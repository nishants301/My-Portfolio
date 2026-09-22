"use client";

import Image from "next/image";
import { useState } from "react";
import type { Project } from "@/data/projects";

/**
 * Browser-chrome frame around a project screenshot.
 *
 * A project can declare a `shot` before the file exists. If the image is
 * missing or fails to load, the frame falls back to a generated schematic
 * rather than a broken-image box — so dropping a real capture into
 * /public/shots is the only step needed to swap it in, with no code change.
 */

function Schematic({ slug }: { slug: string }) {
  // Deterministic per-slug bar heights: same project always draws the same
  // figure, so nothing shifts between renders.
  const seed = [...slug].reduce((a, c) => a + c.charCodeAt(0), 0);
  const bars = Array.from({ length: 22 }, (_, i) => {
    const v = Math.abs(Math.sin(seed * 0.017 + i * 0.63));
    return 16 + v * 74;
  });

  return (
    <svg
      viewBox="0 0 640 360"
      className="h-full w-full"
      role="img"
      aria-label="Generated system schematic placeholder"
    >
      <defs>
        <linearGradient id={`g-${slug}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4ade80" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#4ade80" stopOpacity="0.06" />
        </linearGradient>
      </defs>

      <g stroke="rgba(255,255,255,0.07)" strokeWidth="1">
        {[80, 140, 200, 260].map((y) => (
          <line key={y} x1="40" y1={y} x2="600" y2={y} />
        ))}
        <line x1="40" y1="300" x2="600" y2="300" stroke="rgba(255,255,255,0.16)" />
      </g>

      {bars.map((h, i) => (
        <rect
          key={i}
          x={44 + i * 25.4}
          y={300 - h * 2.4}
          width="14"
          height={h * 2.4}
          fill={`url(#g-${slug})`}
          rx="1.5"
        />
      ))}

      <polyline
        points={bars.map((h, i) => `${51 + i * 25.4},${300 - h * 2.4 - 10}`).join(" ")}
        fill="none"
        stroke="#4ade80"
        strokeWidth="1.5"
        strokeOpacity="0.8"
      />

      <g fill="rgba(255,255,255,0.34)" fontSize="10" fontFamily="monospace">
        <text x="40" y="42">SERIES / DAILY</text>
        <text x="516" y="42">AUTO-REFRESH</text>
      </g>
    </svg>
  );
}

export default function ShotFrame({ project }: { project: Project }) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(project.shot) && !failed;

  return (
    <figure className="overflow-hidden rounded-xl border border-rule bg-panel shadow-[0_24px_70px_-30px_rgba(0,0,0,0.9)]">
      {/* Chrome */}
      <div className="flex items-center gap-3 border-b border-rule bg-surface px-4 py-2.5">
        <div className="flex gap-1.5" aria-hidden>
          <span className="h-2 w-2 rounded-full bg-white/12" />
          <span className="h-2 w-2 rounded-full bg-white/12" />
          <span className="h-2 w-2 rounded-full bg-white/12" />
        </div>
        <div className="mx-auto flex max-w-full items-center gap-2 truncate rounded-md border border-rule bg-ground/60 px-3 py-1">
          <span className="h-1 w-1 shrink-0 rounded-full bg-signal" />
          <span className="truncate font-mono text-[0.6875rem] text-ink-faint">
            {project.urlLabel ?? project.slug}
          </span>
        </div>
        <span className="mono-label hidden shrink-0 sm:inline">{project.status}</span>
      </div>

      {/* Viewport */}
      <div className="relative aspect-[16/10] bg-ground">
        <div className="grid-field absolute inset-0 opacity-60" aria-hidden />
        {showImage ? (
          <Image
            src={project.shot!}
            alt={`${project.name} interface`}
            fill
            sizes="(max-width: 1024px) 100vw, 58vw"
            className="object-cover object-top"
            onError={() => setFailed(true)}
          />
        ) : (
          <div className="absolute inset-0 p-5">
            <Schematic slug={project.slug} />
          </div>
        )}
      </div>
    </figure>
  );
}
