"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Stippled dot orb — a sphere of fine points you can drag to spin, part with
 * the pointer, and click to ripple.
 *
 * Deliberately a 2D canvas rather than WebGL. The previous hero was a Three.js
 * particle field costing ~170KB, which had to be switched off below 1024px to
 * keep LCP sane — meaning phones got nothing. This has no dependencies at all,
 * so it ships everywhere and the bundle drops by the whole of Three.js.
 *
 * Rendering notes:
 * - Points are laid out on a Fibonacci sphere (even coverage, no pole
 *   clustering) and rotated with plain trig. No matrix library needed.
 * - Drawing is two fillRect passes grouped by colour. fillStyle changes are
 *   the expensive part of canvas 2D; arc() per point is far worse. At this
 *   count fillRect is comfortably inside frame budget.
 * - Depth drives size and alpha, which is what reads as a sphere rather than
 *   a disc.
 *
 * The orb is decorative: it is aria-hidden, carries no information, and the
 * page loses nothing if you never touch it. That is what keeps a drag-only
 * interaction acceptable without a keyboard equivalent.
 */

type Pt = { x: number; y: number; z: number; seed: number };

export default function StippleOrb({ hint = true }: { hint?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced = prefersReducedMotion();

    // --- Sizing -------------------------------------------------------------
    let W = 0;
    let H = 0;
    let R = 0;
    let dpr = 1;

    // Point budget scales with area: a phone does not need 9000 dots, and
    // paying for them is how you lose a frame budget.
    let points: Pt[] = [];

    const buildPoints = (count: number) => {
      const out: Pt[] = [];
      const golden = Math.PI * (3 - Math.sqrt(5));
      for (let i = 0; i < count; i++) {
        const y = 1 - (i / (count - 1)) * 2;
        const r = Math.sqrt(Math.max(0, 1 - y * y));
        const t = golden * i;

        // Jitter each point off the lattice. A pure Fibonacci sphere is *too*
        // regular at this density — it shows spiral moiré, which reads as a
        // rendering artefact rather than a stipple. A small random nudge,
        // renormalised back onto the unit sphere, breaks the pattern while
        // keeping the even coverage the lattice was chosen for.
        const J = 0.055;
        let px = Math.cos(t) * r + (Math.random() - 0.5) * J;
        let py = y + (Math.random() - 0.5) * J;
        let pz = Math.sin(t) * r + (Math.random() - 0.5) * J;
        const len = Math.hypot(px, py, pz) || 1;
        px /= len; py /= len; pz /= len;

        out.push({ x: px, y: py, z: pz, seed: Math.random() });
      }
      return out;
    };

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      // Clamp DPR: a soft stipple gains nothing from 3x and costs 9x fill.
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.max(1, Math.round(rect.width));
      H = Math.max(1, Math.round(rect.height));
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      R = Math.min(W, H) * 0.42;

      const area = W * H;
      const count = Math.round(
        Math.max(1800, Math.min(9000, area / 90))
      );
      if (points.length !== count) points = buildPoints(count);
    };

    resize();

    // --- Interaction state --------------------------------------------------
    let rotX = -0.25;
    let rotY = 0;
    let velX = 0;
    let velY = reduced ? 0 : 0.0016; // gentle idle drift
    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    const pointer = { x: -9999, y: -9999, active: false };
    /** Expanding click ripples, in sphere-space radius. */
    let ripples: { t: number }[] = [];

    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      canvas.setPointerCapture(e.pointerId);
      canvas.style.cursor = "grabbing";
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;

      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      velY = dx * 0.00045;
      velX = dy * 0.00045;
      rotY += velY * 6;
      rotX += velX * 6;
    };

    const endDrag = (e: PointerEvent) => {
      dragging = false;
      try { canvas.releasePointerCapture(e.pointerId); } catch {}
      canvas.style.cursor = "grab";
    };

    const onLeave = () => {
      pointer.active = false;
      pointer.x = -9999;
      pointer.y = -9999;
    };

    const onClick = () => {
      if (reduced) return;
      // Cap concurrent ripples; each one costs a per-point test.
      if (ripples.length < 3) ripples.push({ t: 0 });
    };

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", endDrag);
    canvas.addEventListener("pointercancel", endDrag);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("click", onClick);

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    // --- Render loop --------------------------------------------------------
    const INK = "233,236,238";
    const SIGNAL = "74,222,128";

    let raf = 0;
    let last = performance.now();

    const draw = (now: number) => {
      const dt = Math.min(48, now - last);
      last = now;

      if (!dragging) {
        // Inertia, then settle back to the idle drift.
        velY += (0.0016 - velY) * 0.012;
        velX *= 0.92;
        rotY += velY * (dt / 16.67);
        rotX += velX * (dt / 16.67);
      }
      rotX = Math.max(-0.9, Math.min(0.9, rotX));

      ripples = ripples.filter((r) => (r.t += dt / 1000) < 1.4);

      ctx.clearRect(0, 0, W, H);

      const cx = W / 2;
      const cy = H / 2;
      const sinY = Math.sin(rotY), cosY = Math.cos(rotY);
      const sinX = Math.sin(rotX), cosX = Math.cos(rotX);

      // Two passes grouped by colour to avoid per-point fillStyle churn.
      for (let pass = 0; pass < 2; pass++) {
        const rgb = pass === 0 ? INK : SIGNAL;
        let prevAlpha = -1;

        for (let i = 0; i < points.length; i++) {
          const p = points[i];
          const isSignal = p.seed > 0.86;
          if ((pass === 1) !== isSignal) continue;

          // Rotate Y then X.
          const x1 = p.x * cosY - p.z * sinY;
          const z1 = p.x * sinY + p.z * cosY;
          const y2 = p.y * cosX - z1 * sinX;
          const z2 = p.y * sinX + z1 * cosX;

          let sx = cx + x1 * R;
          let sy = cy + y2 * R;

          // Pointer parting: push points away from the cursor, falling off
          // with distance. Screen-space so it tracks what the eye expects.
          if (pointer.active) {
            const dx = sx - pointer.x;
            const dy = sy - pointer.y;
            const d2 = dx * dx + dy * dy;
            const rad = R * 0.42;
            if (d2 < rad * rad && d2 > 0.01) {
              const d = Math.sqrt(d2);
              const push = (1 - d / rad) ** 2 * rad * 0.55;
              sx += (dx / d) * push;
              sy += (dy / d) * push;
            }
          }

          // Click ripple: an expanding shell nudges points outward as it passes.
          for (let k = 0; k < ripples.length; k++) {
            const t = ripples[k].t;
            const front = t * 1.35;
            const band = Math.abs((z2 + 1) / 2 - front);
            if (band < 0.12) {
              const amp = (1 - band / 0.12) * (1 - t / 1.4) * R * 0.1;
              const dx = sx - cx, dy = sy - cy;
              const d = Math.hypot(dx, dy) || 1;
              sx += (dx / d) * amp;
              sy += (dy / d) * amp;
            }
          }

          // Depth: z2 in [-1,1]. Far points shrink and fade.
          const depth = (z2 + 1) / 2;
          const alpha = Math.round((0.14 + depth * 0.78) * 100) / 100;
          const size = depth > 0.62 ? 2 : 1;

          if (alpha !== prevAlpha) {
            ctx.fillStyle = `rgba(${rgb},${alpha})`;
            prevAlpha = alpha;
          }
          ctx.fillRect(sx, sy, size, size);
        }
      }

      raf = requestAnimationFrame(draw);
    };

    if (reduced) {
      // One static frame: the sphere is visible and legible, nothing moves.
      velY = 0;
      draw(performance.now());
      cancelAnimationFrame(raf);
      raf = 0;
    } else {
      raf = requestAnimationFrame(draw);
    }

    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", endDrag);
      canvas.removeEventListener("pointercancel", endDrag);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <div ref={wrapRef} className="absolute inset-0 overflow-hidden">
      <canvas
        ref={canvasRef}
        aria-hidden
        className="block h-full w-full touch-none [cursor:grab]"
      />
      {hint && (
        <div className="pointer-events-none absolute inset-x-0 bottom-[30%] flex justify-center">
          <span className="rounded-full border border-rule bg-ground/70 px-3 py-1.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-ink-faint backdrop-blur-sm">
            <span className="mr-2 inline-block h-1 w-1 rounded-full bg-signal align-middle" />
            Drag to spin
          </span>
        </div>
      )}
    </div>
  );
}
