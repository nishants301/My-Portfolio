"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Stippled dot orb — a sphere of fine points you can drag to spin, part with
 * the pointer, and click to ripple.
 *
 * Deliberately a 2D canvas rather than WebGL. The previous hero was a Three.js
 * particle field costing ~170KB, which had to be switched off below 1024px to
 * keep LCP sane, so phones got nothing. This has no dependencies, ships
 * everywhere, and removed Three.js from the bundle entirely.
 *
 * WHAT MAKES IT READ AS A SPHERE
 * Measured against the reference, the look comes from density and faintness,
 * not from bright specks: ~45% of the canvas carries some light at an average
 * alpha of only ~11%. That is thousands of *large, soft, nearly transparent*
 * dots overlapping. A sparse scatter of small bright dots — the obvious first
 * implementation — reads as noise instead of volume. So:
 *   - one dot per ~95 device px^2 (an order of magnitude denser than a naive
 *     stipple), counted in device pixels so retina does not halve the density
 *   - each dot a pre-rendered soft radial sprite ~6.4 CSS px across
 *   - peak alpha ~0.34, floor ~0.03
 *
 * PERFORMANCE
 * Per-point gradients or fillStyle strings are hopeless at this count. Dots
 * are drawn with drawImage of a cached sprite, bucketed into a few alpha
 * tiers so globalAlpha changes a handful of times per frame instead of
 * thousands.
 *
 * The orb is decorative: aria-hidden, conveys nothing, and the page loses
 * nothing if you never touch it. That is what makes a drag-only interaction
 * acceptable without a keyboard equivalent.
 */

type Pt = { x: number; y: number; z: number; seed: number };

/** Alpha quantisation tiers — more tiers means smoother depth, more state changes. */
const TIERS = 10;

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

    let W = 0;      // CSS size of the box
    let H = 0;
    let BW = 0;     // backing-store size actually rendered
    let BH = 0;
    let R = 0;
    let points: Pt[] = [];

    // ---- Points ------------------------------------------------------------
    const buildPoints = (count: number) => {
      const out: Pt[] = [];
      const golden = Math.PI * (3 - Math.sqrt(5));
      for (let i = 0; i < count; i++) {
        const y = 1 - (i / (count - 1)) * 2;
        const r = Math.sqrt(Math.max(0, 1 - y * y));
        const t = golden * i;

        // Jitter off the lattice. A pure Fibonacci sphere is too regular at
        // this density and shows spiral moire, which reads as a rendering
        // artefact. Renormalising keeps the even coverage it was chosen for.
        const J = 0.055;
        let px = Math.cos(t) * r + (Math.random() - 0.5) * J;
        let py = y + (Math.random() - 0.5) * J;
        let pz = Math.sin(t) * r + (Math.random() - 0.5) * J;
        const len = Math.hypot(px, py, pz) || 1;

        out.push({ x: px / len, y: py / len, z: pz / len, seed: Math.random() });
      }
      return out;
    };

    // ---- Sprites -----------------------------------------------------------
    // Integer size, drawn 1:1 at integer coordinates. A sprite whose source
    // size differs from its destination size — or lands on a fractional
    // coordinate — makes drawImage resample on every call, which at this
    // count dominates the frame.
    const SPRITE_CSS = 9;
    let spriteInk: HTMLCanvasElement | null = null;
    let spriteSignal: HTMLCanvasElement | null = null;

    const makeSprite = (rgb: string) => {
      const px = SPRITE_CSS;
      const c = document.createElement("canvas");
      c.width = px;
      c.height = px;
      const g = c.getContext("2d")!;
      const grad = g.createRadialGradient(px / 2, px / 2, 0, px / 2, px / 2, px / 2);
      grad.addColorStop(0, `rgba(${rgb},1)`);
      grad.addColorStop(0.4, `rgba(${rgb},0.5)`);
      grad.addColorStop(1, `rgba(${rgb},0)`);
      g.fillStyle = grad;
      g.fillRect(0, 0, px, px);
      return c;
    };

    // ---- Sizing ------------------------------------------------------------
    // The backing store is capped and CSS-stretched to fill the box. Every dot
    // is a soft gradient, so upscaling is invisible — but cost scales with the
    // square of resolution. At full 815px the orb ran 25fps; capped it holds
    // 60 and looks identical.
    const MAX_DIM = 560;
    let scale = 1;   // backing pixels per CSS pixel

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      W = Math.max(1, Math.round(rect.width));
      H = Math.max(1, Math.round(rect.height));

      scale = Math.min(1, MAX_DIM / Math.max(W, H));
      const bw = Math.max(1, Math.round(W * scale));
      const bh = Math.max(1, Math.round(H * scale));

      canvas.width = bw;
      canvas.height = bh;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);

      // All drawing happens in backing-store space from here on.
      BW = bw;
      BH = bh;
      R = Math.min(bw, bh) * 0.42;

      // Density is measured against the backing store so coverage stays near
      // the reference's ~45% regardless of how large the box is on screen.
      const count = Math.round(Math.max(2000, Math.min(11000, (bw * bh) / 80)));
      if (points.length !== count) points = buildPoints(count);

      spriteInk = makeSprite("226,232,236");
      spriteSignal = makeSprite("74,222,128");
    };

    resize();

    // ---- Interaction -------------------------------------------------------
    let rotX = -0.25;
    let rotY = 0;
    let velX = 0;
    let velY = reduced ? 0 : 0.0016;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    const pointer = { x: -9999, y: -9999, active: false };
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
      // Pointer arrives in CSS px; drawing happens in backing space.
      pointer.x = (e.clientX - rect.left) * scale;
      pointer.y = (e.clientY - rect.top) * scale;
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

    // ---- Render ------------------------------------------------------------
    // Reused scratch buffers: one bucket per (colour, alpha tier). Allocating
    // these per frame would hand the GC thousands of arrays a second.
    const bucketsInk: number[][] = Array.from({ length: TIERS }, () => []);
    const bucketsSig: number[][] = Array.from({ length: TIERS }, () => []);

    const PEAK = 0.40;
    const FLOOR = 0.03;
    let raf = 0;
    let last = performance.now();

    const draw = (now: number) => {
      const dt = Math.min(48, now - last);
      last = now;

      if (!dragging && !reduced) {
        velY += (0.0016 - velY) * 0.012;
        velX *= 0.92;
        rotY += velY * (dt / 16.67);
        rotX += velX * (dt / 16.67);
      }
      rotX = Math.max(-0.9, Math.min(0.9, rotX));
      ripples = ripples.filter((r) => (r.t += dt / 1000) < 1.4);

      ctx.clearRect(0, 0, BW, BH);

      const cx = BW / 2;
      const cy = BH / 2;
      const sinY = Math.sin(rotY), cosY = Math.cos(rotY);
      const sinX = Math.sin(rotX), cosX = Math.cos(rotX);
      const half = SPRITE_CSS / 2;
      const partRad = R * 0.42;

      for (let i = 0; i < TIERS; i++) { bucketsInk[i].length = 0; bucketsSig[i].length = 0; }

      for (let i = 0; i < points.length; i++) {
        const p = points[i];

        const x1 = p.x * cosY - p.z * sinY;
        const z1 = p.x * sinY + p.z * cosY;
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = p.y * sinX + z1 * cosX;

        let sx = cx + x1 * R;
        let sy = cy + y2 * R;

        // Pointer parting, in screen space so it tracks what the eye expects.
        if (pointer.active) {
          const dx = sx - pointer.x;
          const dy = sy - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < partRad * partRad && d2 > 0.01) {
            const d = Math.sqrt(d2);
            const push = (1 - d / partRad) ** 2 * partRad * 0.55;
            sx += (dx / d) * push;
            sy += (dy / d) * push;
          }
        }

        // Click ripple: an expanding shell nudges points outward as it passes.
        for (let k = 0; k < ripples.length; k++) {
          const t = ripples[k].t;
          const band = Math.abs((z2 + 1) / 2 - t * 1.35);
          if (band < 0.12) {
            const amp = (1 - band / 0.12) * (1 - t / 1.4) * R * 0.1;
            const dx = sx - cx, dy = sy - cy;
            const d = Math.hypot(dx, dy) || 1;
            sx += (dx / d) * amp;
            sy += (dy / d) * amp;
          }
        }

        // Depth drives alpha. Quantised into tiers so globalAlpha is set a
        // handful of times per frame rather than once per dot.
        const depth = (z2 + 1) / 2;
        let tier = (depth * depth * TIERS) | 0;
        if (tier >= TIERS) tier = TIERS - 1;

        const arr = p.seed > 0.88 ? bucketsSig[tier] : bucketsInk[tier];
        arr.push((sx - half) | 0, (sy - half) | 0);
      }

      for (let pass = 0; pass < 2; pass++) {
        const sprite = pass === 0 ? spriteInk : spriteSignal;
        const buckets = pass === 0 ? bucketsInk : bucketsSig;
        if (!sprite) continue;

        for (let t = 0; t < TIERS; t++) {
          const arr = buckets[t];
          if (!arr.length) continue;
          ctx.globalAlpha = FLOOR + (PEAK - FLOOR) * (t / (TIERS - 1));
          for (let j = 0; j < arr.length; j += 2) {
            ctx.drawImage(sprite, arr[j], arr[j + 1]);
          }
        }
      }
      ctx.globalAlpha = 1;

      if (!reduced) raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

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
