"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { site } from "@/data/site";

// Three.js is ~150kB gzipped. Keeping it out of the initial bundle is the
// difference between a fast first paint and a hero that arrives late.
const HeroCanvas = dynamic(() => import("@/components/three/HeroCanvas"), {
  ssr: false,
});

export default function Hero() {
  return (
    <section className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden pt-16">
      <div className="grid-field mask-radial absolute inset-0" aria-hidden />
      <HeroCanvas />

      {/* Scrim under the copy. Even offset, stray particles drift behind the
          text — this guarantees contrast without dimming the whole scene. */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ground via-ground/85 to-transparent lg:via-ground/70 lg:to-transparent"
        aria-hidden
      />

      {/* Ground fade so the canvas dissolves into the next section. */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ground to-transparent"
        aria-hidden
      />

      <div className="shell relative z-10 py-20">
        <div className="flex items-center gap-3">
          <span className="relative flex h-1.5 w-1.5">
            <span className="pip absolute inline-flex h-full w-full rounded-full bg-signal" />
          </span>
          <span className="mono-label">
            {site.location} · Available for work
          </span>
        </div>

        <h1 className="display mt-7 max-w-[19ch] text-[clamp(2.75rem,8.5vw,7rem)]">
          {site.headline[0]}
          <br />
          <span className="text-ink-dim">{site.headline[1]}</span>
        </h1>

        <p className="mt-8 max-w-[58ch] text-[clamp(1rem,1.6vw,1.1875rem)] leading-relaxed text-ink-dim">
          {site.subhead}
        </p>

        <div className="mt-11 flex flex-wrap items-center gap-3">
          <Link
            href="#work"
            className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-ground transition-colors hover:bg-signal"
          >
            See the work
            <span className="transition-transform group-hover:translate-y-0.5">↓</span>
          </Link>
          <a
            href={`mailto:${site.email}`}
            className="inline-flex items-center gap-2 rounded-full border border-rule-strong px-6 py-3 text-sm text-ink transition-colors hover:border-signal hover:text-signal"
          >
            Start a project
          </a>
          <a
            href={site.resume}
            className="inline-flex items-center gap-2 px-2 py-3 text-sm text-ink-faint underline-offset-4 transition-colors hover:text-ink hover:underline"
          >
            Résumé (PDF)
          </a>
        </div>

        {/* Role strip — the recruiter's three-second scan. */}
        <div className="mt-16 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-rule pt-6">
          <span className="mono-label text-ink-dim">{site.role}</span>
          {site.disciplines.map((d) => (
            <span key={d} className="mono-label">
              <span className="mr-3 text-ink-faint/40">/</span>
              {d}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
