"use client";

import Link from "next/link";
import { useRef } from "react";
import type { Project } from "@/data/projects";
import ShotFrame from "./ShotFrame";

/**
 * Featured project row. Pointer-tracked tilt is done with a CSS transform
 * written straight to the node inside rAF — no state, no React re-render per
 * mousemove, which is what keeps a list of these smooth.
 */
export default function ProjectCard({
  project,
  flip,
}: {
  project: Project;
  flip: boolean;
}) {
  const media = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  const onMove = (e: React.MouseEvent) => {
    const el = media.current;
    if (!el || frame.current) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;

    frame.current = requestAnimationFrame(() => {
      el.style.transform = `perspective(1100px) rotateY(${px * 7}deg) rotateX(${-py * 7}deg) scale(1.014)`;
      frame.current = 0;
    });
  };

  const onLeave = () => {
    const el = media.current;
    if (!el) return;
    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = 0;
    el.style.transform = "";
  };

  return (
    <article className="group border-t border-rule py-14 md:py-20">
      <div
        className={[
          "grid items-center gap-10 lg:grid-cols-12 lg:gap-14",
          flip ? "lg:[&>*:first-child]:order-2" : "",
        ].join(" ")}
      >
        {/* ---------- Media ---------- */}
        <div
          className="lg:col-span-7"
          onMouseMove={onMove}
          onMouseLeave={onLeave}
        >
          <div
            ref={media}
            className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform"
          >
            <ShotFrame project={project} />
          </div>
        </div>

        {/* ---------- Copy ---------- */}
        <div className="lg:col-span-5">
          <div className="flex items-center gap-4">
            <span className="mono-label text-signal">{project.idx}</span>
            <span className="h-px flex-1 bg-rule" />
            <span className="mono-label">{project.year}</span>
          </div>

          <p className="mono-label mt-6">{project.kicker}</p>

          <h3 className="display mt-3 text-[clamp(1.75rem,3.2vw,2.5rem)]">
            {project.name}
          </h3>

          <p className="mt-4 max-w-[46ch] text-[0.9375rem] leading-relaxed text-ink-dim">
            {project.tagline}
          </p>

          {/* Outcomes — two columns so the numbers read as a spec sheet. */}
          <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-rule pt-6">
            {project.outcomes.slice(0, 4).map((o) => (
              <div key={o.label}>
                <dt className="font-mono text-lg leading-none text-ink">
                  {o.value}
                </dt>
                <dd className="mt-1.5 text-xs leading-snug text-ink-faint">
                  {o.label}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-7 flex flex-wrap gap-1.5">
            {project.stack.map((s) => (
              <span
                key={s}
                className="rounded-full border border-rule px-2.5 py-1 font-mono text-[0.6875rem] text-ink-faint"
              >
                {s}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-5">
            <Link
              href={`/work/${project.slug}`}
              className="group/cta inline-flex items-center gap-2 text-sm text-ink transition-colors hover:text-signal"
            >
              Read the case study
              <span className="transition-transform group-hover/cta:translate-x-1">
                →
              </span>
            </Link>
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-ink-faint underline-offset-4 transition-colors hover:text-ink hover:underline"
              >
                Visit live ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
