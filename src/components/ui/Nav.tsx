"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { site } from "@/data/site";
import { useActiveSection, useScrollProgress } from "@/lib/hooks";
import { DUR, EASE_CSS } from "@/lib/motion";

/**
 * Sliding sticky nav.
 *
 * The reference's nav is a row of tabs with an indicator that slides to the
 * active one. The indicator is a single absolutely-positioned element animated
 * with transform and width — measured from the real button, so it stays
 * correct across font loading, resize and zoom rather than relying on hardcoded
 * widths.
 */

const LINKS = [
  { id: "contents", label: "Contents" },
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "process", label: "Process" },
  { id: "safeguards", label: "Safeguards" },
  { id: "contact", label: "Contact" },
];

export default function Nav() {
  const progress = useScrollProgress();
  const active = useActiveSection(["cover", ...LINKS.map((l) => l.id)]);
  const [lifted, setLifted] = useState(false);
  const [open, setOpen] = useState(false);

  const row = useRef<HTMLDivElement>(null);
  const [pill, setPill] = useState({ x: 0, w: 0, show: false });

  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => window.innerWidth >= 768 && setOpen(false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Measure the active tab and move the indicator onto it. Layout effect so the
  // indicator never paints at a stale position.
  useLayoutEffect(() => {
    const measure = () => {
      const parent = row.current;
      if (!parent) return;
      const el = parent.querySelector<HTMLElement>(`[data-nav="${active}"]`);
      if (!el) return setPill((p) => ({ ...p, show: false }));
      setPill({
        x: el.offsetLeft,
        w: el.offsetWidth,
        show: true,
      });
    };
    measure();
    window.addEventListener("resize", measure);
    // Re-measure once webfonts settle, since tab widths change with them.
    document.fonts?.ready.then(measure).catch(() => {});
    return () => window.removeEventListener("resize", measure);
  }, [active]);

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
        lifted ? "border-b border-rule bg-ground/80 backdrop-blur-xl" : "border-b border-transparent",
      ].join(" ")}
    >
      <div
        className="absolute inset-x-0 top-0 h-px origin-left bg-signal/70"
        style={{ transform: `scaleX(${progress})` }}
        aria-hidden
      />

      <nav className="mx-auto flex h-16 w-full max-w-[96rem] items-center justify-between gap-6 px-5 sm:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label={`${site.name} — home`}>
          <span className="pip h-1.5 w-1.5 rounded-full bg-signal" />
          <span className="font-mono text-[0.8125rem] tracking-tight text-ink">
            {site.name.toLowerCase().replace(" ", ".")}
          </span>
        </Link>

        {/* ---------- Desktop tabs ---------- */}
        <div ref={row} className="relative hidden items-center md:flex">
          {/* Sliding indicator */}
          <span
            aria-hidden
            className="absolute inset-y-1 rounded-full bg-raised"
            style={{
              transform: `translateX(${pill.x}px)`,
              width: pill.w,
              opacity: pill.show ? 1 : 0,
              transition: `transform ${DUR.hover}s ${EASE_CSS.spring}, width ${DUR.hover}s ${EASE_CSS.spring}, opacity ${DUR.fast}s ease`,
            }}
          />
          {LINKS.map((l) => (
            <Link
              key={l.id}
              href={`#${l.id}`}
              data-nav={l.id}
              aria-current={active === l.id ? "true" : undefined}
              className={`relative z-10 rounded-full px-3.5 py-1.5 text-[0.8125rem] transition-colors ${
                active === l.id ? "text-ink" : "text-ink-dim hover:text-ink"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <a
          href={`mailto:${site.email}`}
          className="hidden shrink-0 rounded-full border border-rule-strong px-4 py-1.5 text-[0.8125rem] text-ink transition-colors hover:border-signal hover:text-signal md:inline-block"
        >
          Start a project
        </a>

        <button
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded border border-rule text-ink-dim md:hidden"
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          <span className="flex flex-col gap-1">
            <span className={`block h-px w-4 bg-current transition-transform ${open ? "translate-y-[3px] rotate-45" : ""}`} />
            <span className={`block h-px w-4 bg-current transition-transform ${open ? "-translate-y-[3px] -rotate-45" : ""}`} />
          </span>
        </button>
      </nav>

      {open && (
        <div className="border-t border-rule bg-ground/95 backdrop-blur-xl md:hidden">
          <div className="mx-auto flex w-full max-w-[96rem] flex-col px-5 py-3 sm:px-8">
            {LINKS.map((l) => (
              <Link
                key={l.id}
                href={`#${l.id}`}
                onClick={() => setOpen(false)}
                className={`border-b border-rule py-3 text-sm ${
                  active === l.id ? "text-signal" : "text-ink-dim"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <a
              href={`mailto:${site.email}`}
              onClick={() => setOpen(false)}
              className="py-3 text-sm text-signal"
            >
              Start a project →
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
