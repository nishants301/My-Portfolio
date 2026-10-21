"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { site } from "@/data/site";
import { DUR, EASE_CSS } from "@/lib/motion";
import { useCanRender3D } from "@/lib/hooks";

// Three.js stays out of the initial bundle. Critically, this is only rendered
// once the capability check passes — `dynamic()` fetches its chunk the moment
// the component renders, so gating *inside* HeroCanvas would still have pulled
// ~170KB onto phones that never draw a single particle.
const HeroCanvas = dynamic(() => import("@/components/three/HeroCanvas"), {
  ssr: false,
});

/**
 * Section 01 — Cover.
 *
 * Maps the reference's folder-tab cover: oversized display word, meta strip,
 * and a row of stacked colour folders carrying numbers. Your four stats are
 * those folders — the reference numbers its own 01/03/05 with nothing behind
 * them, so this is the rare case where our content is stronger than the thing
 * we are borrowing from.
 *
 * The WebGL field sits behind the display word rather than being dropped:
 * showing 3D capability is one of the stated goals, and the reference's cover
 * is otherwise flat.
 */

/** Tonal steps for the stat folders — elevation, not hue. */
const TONE = ["bg-surface", "bg-panel", "bg-raised", "bg-[#1f242a]"] as const;

function StatFolder({
  stat,
  i,
}: {
  stat: (typeof site.stats)[number];
  i: number;
}) {
  // Pure CSS hover. A binary hover state does not need a rAF-written transform
  // — the compositor handles this without any main-thread work, and it removes
  // a pointer handler per card from hydration.
  return (
    <div className="group min-w-0 flex-1">
      <div className="flex pl-3">
        <div className={`rounded-t-[12px] ${TONE[i]} px-3 py-1.5`}>
          <span className="font-mono text-[0.625rem] tracking-[0.14em] text-ink-faint">
            {String(i + 1).padStart(2, "0")}
          </span>
        </div>
      </div>

      <div
        style={{ transition: `transform ${DUR.hover}s ${EASE_CSS.spring}` }}
        className={`rounded-[18px] rounded-tl-none border border-rule ${TONE[i]} p-4 transition-transform group-hover:-translate-y-2.5 sm:p-5`}
      >
        <div className="font-mono text-[clamp(1.5rem,3.2vw,2.5rem)] leading-none text-ink">
          {stat.value}
        </div>
        <div className="mt-3 text-[0.8125rem] leading-snug text-ink-dim">
          {stat.label}
        </div>
        <div className="mono-label mt-1.5 normal-case tracking-normal">
          {stat.detail}
        </div>
      </div>
    </div>
  );
}

export default function Cover() {
  const can3D = useCanRender3D();

  return (
    <section id="cover" className="scroll-mt-24 px-3 pt-20 sm:px-4">
      <div className="mx-auto w-full max-w-[96rem]">
        {/* ---------- Tab row ---------- */}
        <div className="flex items-end gap-1.5 pl-4 sm:pl-8">
          <div className="flex items-center gap-2.5 rounded-t-[12px] bg-surface px-4 py-2 text-signal sm:px-5">
            <span className="pip h-1.5 w-1.5 rounded-full bg-signal" aria-hidden />
            <span className="font-mono text-[0.6875rem] uppercase tracking-[0.14em]">
              Cover
            </span>
          </div>
          <div className="ml-auto rounded-t-[12px] bg-surface px-4 py-2">
            <span className="font-mono text-[0.6875rem] tracking-[0.1em] text-ink-faint">
              01 / 07
            </span>
          </div>
        </div>

        {/* ---------- Body ---------- */}
        <div className="relative overflow-hidden rounded-[18px] rounded-tl-none border border-rule bg-surface pb-10 pt-[22px]">
          <div className="grid-field mask-radial absolute inset-0" aria-hidden />
          {can3D && (
            <div className="absolute inset-y-0 right-0 w-full lg:left-[42%]" aria-hidden>
              <HeroCanvas />
            </div>
          )}
          {/* Scrim so the display word always wins against stray particles. */}
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-surface via-surface/88 to-transparent lg:via-surface/70"
            aria-hidden
          />

          {/* Meta strip */}
          <div className="relative mb-10 overflow-x-auto border-b border-rule px-5 pb-[22px] sm:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex w-max items-center gap-6">
              {[
                "2024 — 2026",
                "AI SYSTEMS",
                "AGENTS",
                "LLM APPLICATIONS",
                "AUTOMATION",
                site.location.toUpperCase(),
              ].map((m) => (
                <span
                  key={m}
                  className="whitespace-nowrap font-mono text-[0.65625rem] uppercase tracking-[0.14em] text-ink-faint"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>

          <div className="relative px-5 sm:px-8">
            {/* Display block */}
            <p className="mono-label">
              {site.role} · Available for work
            </p>

            <h1 className="display mt-6 max-w-[18ch] text-[clamp(2.75rem,8.5vw,7rem)]">
              {site.headline[0]}
              <br />
              <span className="text-ink-dim">{site.headline[1]}</span>
            </h1>

            <p className="mt-7 max-w-[56ch] text-[clamp(0.9375rem,1.5vw,1.125rem)] leading-relaxed text-ink-dim">
              {site.subhead}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="#work"
                className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-ground transition-colors hover:bg-signal"
              >
                See the work
                <span className="transition-transform group-hover:translate-y-0.5">
                  ↓
                </span>
              </Link>
              <a
                href={`mailto:${site.email}`}
                className="inline-flex items-center gap-2 rounded-full border border-rule-strong px-6 py-3 text-sm text-ink transition-colors hover:border-signal hover:text-signal"
              >
                Start a project
              </a>
              <a
                href={site.resume}
                className="px-2 py-3 text-sm text-ink-faint underline-offset-4 transition-colors hover:text-ink hover:underline"
              >
                Résumé (PDF)
              </a>
            </div>

            {/* ---------- Stat folders ---------- */}
            <div className="mt-14 flex flex-col gap-4 sm:flex-row sm:gap-3">
              {site.stats.map((s, i) => (
                <StatFolder key={s.label} stat={s} i={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
