"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { projects, type Project } from "@/data/projects";
import Folder from "@/components/ui/Folder";
import DrawHeading from "@/components/ui/DrawHeading";
import Reveal from "@/components/motion/Reveal";
import ShotFrame from "@/components/ui/ShotFrame";
import { DUR, EASE_CSS } from "@/lib/motion";

/**
 * Section 04 — Works.
 *
 * The reference's "work cabinet": a row of filter pills over a grid of cards.
 *
 * The reference's 6 filters map onto 30 raw stack tags here, which would
 * overflow the row. Families are derived from existing project fields instead,
 * so the taxonomy needs no new content and cannot drift out of sync with it
 * (docs/spec.md §4).
 */

type Family = "All" | "Data Infra" | "AI Agents" | "Product / SaaS" | "Frontend / 3D" | "Archive";

const familyOf = (p: Project): Exclude<Family, "All"> => {
  if (p.status === "Archive") return "Archive";
  if (p.slug === "swiggy-analytics") return "Data Infra";
  if (p.slug === "agent-fleet" || p.slug === "talentscout") return "AI Agents";
  if (p.slug === "plateful-technologies") return "Frontend / 3D";
  return "Product / SaaS";
};

const FILTERS: Family[] = [
  "All",
  "Data Infra",
  "AI Agents",
  "Product / SaaS",
  "Frontend / 3D",
  "Archive",
];

function WorkCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  // CSS-only lift — see the note in Cover's StatFolder.
  return (
    <article className="group min-w-0">
      {/* Card tab, carrying the family label */}
      <div className="flex pl-4">
        <div className="rounded-t-[12px] border border-b-0 border-rule bg-ground/60 px-3 py-1.5">
          <span className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-ink-faint">
            {project.idx} · {familyOf(project)}
          </span>
        </div>
      </div>

      <div
        style={{ transition: `transform ${DUR.hover}s ${EASE_CSS.spring}` }}
        className="overflow-hidden rounded-[18px] rounded-tl-none border border-rule bg-ground/50 transition-transform group-hover:-translate-y-2"
      >
        <ShotFrame project={project} />

        <div className="p-5">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="text-lg tracking-tight text-ink">{project.name}</h3>
            <span className="mono-label shrink-0">{project.year}</span>
          </div>

          <p className="mt-2.5 text-[0.875rem] leading-relaxed text-ink-dim">
            {project.tagline}
          </p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.stack.slice(0, 4).map((s) => (
              <span
                key={s}
                className="rounded-full border border-rule px-2.5 py-1 font-mono text-[0.625rem] text-ink-faint"
              >
                {s}
              </span>
            ))}
          </div>

          <div className="mt-5 flex items-center gap-5 border-t border-rule pt-4">
            <button
              onClick={onOpen}
              className="group/cta inline-flex items-center gap-2 text-sm text-ink transition-colors hover:text-signal"
            >
              Details
              <span className="transition-transform group-hover/cta:translate-x-1">→</span>
            </button>
            <Link
              href={`/work/${project.slug}`}
              className="text-sm text-ink-faint underline-offset-4 transition-colors hover:text-ink hover:underline"
            >
              Case study
            </Link>
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto text-sm text-ink-faint transition-colors hover:text-signal"
              >
                Live ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

/** The reference's "details sheet" — a panel that slides up over the grid. */
function DetailSheet({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const open = Boolean(project);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center"
      style={{ pointerEvents: open ? "auto" : "none" }}
      aria-hidden={!open}
    >
      {/* Scrim — blur signals "the background is dismissable". */}
      <button
        onClick={onClose}
        tabIndex={open ? 0 : -1}
        aria-label="Close details"
        className="absolute inset-0 bg-ground/80 backdrop-blur-sm"
        style={{ transition: `opacity ${DUR.tap}s ease`, opacity: open ? 1 : 0 }}
      />

      <div
        role="dialog"
        aria-modal={open}
        aria-label={project ? `${project.name} details` : undefined}
        className="relative max-h-[86vh] w-full max-w-3xl overflow-y-auto rounded-t-[18px] border border-rule bg-panel sm:rounded-[18px]"
        style={{
          transition: `transform ${DUR.hover}s ${EASE_CSS.decelerate}, opacity ${DUR.tap}s ease`,
          transform: open ? "none" : "translateY(24px) scale(0.98)",
          opacity: open ? 1 : 0,
        }}
      >
        {project && (
          <>
            <div className="sticky top-0 flex items-center justify-between gap-4 border-b border-rule bg-panel/95 px-6 py-4 backdrop-blur">
              <div className="min-w-0">
                <p className="mono-label">{project.kicker}</p>
                <h3 className="mt-1 truncate text-lg tracking-tight text-ink">
                  {project.name}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="shrink-0 rounded-full border border-rule px-4 py-1.5 text-sm text-ink-dim transition-colors hover:border-signal hover:text-signal"
              >
                Close
              </button>
            </div>

            <div className="px-6 py-6">
              <p className="text-[0.9375rem] leading-relaxed text-ink">
                {project.summary}
              </p>

              <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-rule pt-6 sm:grid-cols-4">
                {project.outcomes.map((o) => (
                  <div key={o.label}>
                    <dt className="font-mono text-lg leading-none text-ink">{o.value}</dt>
                    <dd className="mt-1.5 text-xs leading-snug text-ink-faint">{o.label}</dd>
                  </div>
                ))}
              </dl>

              {project.judgment && (
                <div className="mt-7 rounded-[11px] border border-rule bg-ground/50 p-5">
                  <p className="mono-label">Production judgment</p>
                  <ul className="mt-4 space-y-3">
                    {project.judgment.map((j) => (
                      <li key={j} className="flex gap-3">
                        <span className="mt-2 h-px w-3 shrink-0 bg-signal/60" />
                        <span className="text-[0.8125rem] leading-relaxed text-ink-dim">
                          {j}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Link
                href={`/work/${project.slug}`}
                className="group mt-7 inline-flex items-center gap-2 text-sm text-ink transition-colors hover:text-signal"
              >
                Read the full case study
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function Work() {
  const [filter, setFilter] = useState<Family>("All");
  const [detail, setDetail] = useState<Project | null>(null);

  const visible = useMemo(
    () => (filter === "All" ? projects : projects.filter((p) => familyOf(p) === filter)),
    [filter]
  );

  const countOf = (f: Family) =>
    f === "All" ? projects.length : projects.filter((p) => familyOf(p) === f).length;

  return (
    <Folder
      id="work"
      index="04"
      total="07"
      tab="Work"
      tone={1}
      active
      meta={["2024 — 2026", "SELECTED WORK", `${projects.length} PROJECTS`, "ALL IN PRODUCTION"]}
    >
      <DrawHeading text="WORKS" slug={`${projects.length} PROJECTS · 2024—2026`} />

      <Reveal className="mt-6 max-w-[54ch]">
        <p className="text-[0.9375rem] leading-relaxed text-ink-dim">
          Every project below is deployed and in daily use by real clients or an
          internal team. Filter the cabinet, or open a card for the architecture
          decisions behind it.
        </p>
      </Reveal>

      {/* ---------- Filter pills ---------- */}
      <div
        className="mt-9 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="tablist"
        aria-label="Filter work by type"
      >
        {FILTERS.map((f) => {
          const on = f === filter;
          return (
            <button
              key={f}
              role="tab"
              aria-selected={on}
              onClick={() => setFilter(f)}
              style={{
                transition: `transform ${DUR.tap}s ${EASE_CSS.spring}, background-color ${DUR.tap}s ease, color ${DUR.tap}s ease, border-color ${DUR.tap}s ease`,
              }}
              className={[
                "shrink-0 rounded-full border px-4 py-2 text-[0.8125rem] whitespace-nowrap",
                on
                  ? "border-signal bg-signal text-ground"
                  : "border-rule text-ink-dim hover:border-rule-strong hover:text-ink",
              ].join(" ")}
            >
              {f}
              <span className={`ml-2 font-mono text-[0.6875rem] ${on ? "text-ground/70" : "text-ink-faint"}`}>
                {countOf(f)}
              </span>
            </button>
          );
        })}
      </div>

      {/* ---------- Cabinet grid ---------- */}
      <div
        key={filter}
        className="mt-8 grid gap-x-5 gap-y-10 sm:grid-cols-2 xl:grid-cols-3"
      >
        {visible.map((p, i) => (
          <Reveal key={p.slug} delay={i * 0.05}>
            <WorkCard project={p} onOpen={() => setDetail(p)} />
          </Reveal>
        ))}
      </div>

      <DetailSheet project={detail} onClose={() => setDetail(null)} />
    </Folder>
  );
}
