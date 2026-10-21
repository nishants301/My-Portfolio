"use client";

import { useState } from "react";
import Link from "next/link";
import Folder from "@/components/ui/Folder";
import DrawHeading from "@/components/ui/DrawHeading";
import Reveal from "@/components/motion/Reveal";
import { DUR, EASE_CSS } from "@/lib/motion";

/**
 * Section 02 — Contents.
 *
 * The reference's chapter catalog: numbered rows, the first one expanded to
 * show what a chapter contains. It is the device that makes a 6000px scroll
 * feel authored rather than endless, which is why it earns its place even
 * though it carries no portfolio content of its own.
 *
 * The reference animates this with `grid-template-rows`, which reflows on
 * every frame. This uses a transform-only accordion instead — the panel is
 * always laid out, and only its scaleY/opacity change, so expanding a row
 * contributes nothing to CLS (docs/spec.md §3).
 */

const CHAPTERS = [
  {
    n: "01",
    title: "Self-introduction",
    href: "#about",
    detail:
      "Who is building this, how the work actually starts, and the constraint that shapes every system: no PM, no spec, and a non-engineer has to be able to run it afterwards.",
    points: ["Background", "How I work", "Experience", "Education"],
  },
  {
    n: "02",
    title: "Selected work",
    href: "#work",
    detail:
      "Eight systems in production. Filterable by what they are, each opening into the architecture decisions behind it.",
    points: ["Data infrastructure", "AI agents", "Product / SaaS", "Frontend / 3D"],
  },
  {
    n: "03",
    title: "Working process",
    href: "#process",
    detail:
      "The four phases every engagement runs through, from finding the real bottleneck to handing the system over.",
    points: ["Discovery", "Architecture", "Gating", "Handover"],
  },
  {
    n: "04",
    title: "Production safeguards",
    href: "#safeguards",
    detail:
      "What is actually in force on live systems — the part a client is buying that no capability list captures.",
    points: ["Human approval", "Encryption", "Rate limits", "RBAC"],
  },
  {
    n: "05",
    title: "Contact",
    href: "#contact",
    detail: "Engagements, roles, and the fastest way to start a conversation.",
    points: ["Email", "LinkedIn", "Résumé"],
  },
];

export default function Contents() {
  const [open, setOpen] = useState(0);

  return (
    <Folder
      id="contents"
      index="02"
      total="07"
      tab="Contents"
      tone={1}
      meta={["2024 — 2026", "CHAPTER INDEX", "05 CHAPTERS", "SCROLL OR JUMP"]}
    >
      <DrawHeading text="CATALOG" slug="05 CHAPTERS · INDEX" />

      <Reveal className="mt-6 max-w-[52ch]">
        <p className="text-[0.9375rem] leading-relaxed text-ink-dim">
          Table of contents for this portfolio. Open a chapter to see what is
          inside, or jump straight to it.
        </p>
      </Reveal>

      <div className="mt-12 space-y-2">
        {CHAPTERS.map((c, i) => {
          const isOpen = i === open;
          return (
            <Reveal key={c.n} delay={i * 0.04}>
              <div
                className={[
                  "overflow-hidden rounded-[18px] border transition-colors",
                  isOpen
                    ? "border-signal/30 bg-raised"
                    : "border-rule bg-ground/40 hover:border-rule-strong",
                ].join(" ")}
                style={{ transition: `border-color ${DUR.tap}s ease` }}
              >
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  aria-controls={`chapter-${c.n}`}
                  className="flex w-full items-center gap-5 px-5 py-5 text-left sm:px-7"
                >
                  <span
                    className={`font-mono text-xs ${isOpen ? "text-signal" : "text-ink-faint"}`}
                  >
                    {c.n}
                  </span>
                  <span
                    className={`flex-1 text-[clamp(1.0625rem,2.4vw,1.5rem)] tracking-tight ${
                      isOpen ? "text-ink" : "text-ink-dim"
                    }`}
                  >
                    {c.title}
                  </span>
                  <span
                    className="shrink-0 text-ink-faint"
                    style={{
                      transition: `transform ${DUR.tap}s ${EASE_CSS.spring}`,
                      transform: isOpen ? "rotate(45deg)" : "none",
                    }}
                    aria-hidden
                  >
                    +
                  </span>
                </button>

                {/* Transform-only accordion: always laid out, never reflowed. */}
                <div
                  id={`chapter-${c.n}`}
                  className="origin-top px-5 sm:px-7"
                  style={{
                    transition: `transform ${DUR.hover}s ${EASE_CSS.decelerate}, opacity ${DUR.tap}s ease, height ${DUR.hover}s ${EASE_CSS.decelerate}`,
                    transform: isOpen ? "scaleY(1)" : "scaleY(0.96)",
                    opacity: isOpen ? 1 : 0,
                    height: isOpen ? "auto" : 0,
                    overflow: "hidden",
                  }}
                  inert={!isOpen}
                >
                  <div className="border-t border-rule pb-6 pt-5">
                    <p className="max-w-[62ch] text-[0.9375rem] leading-relaxed text-ink-dim">
                      {c.detail}
                    </p>
                    <div className="mt-5 flex flex-wrap items-center gap-2">
                      {c.points.map((p) => (
                        <span
                          key={p}
                          className="rounded-full border border-rule px-3 py-1 font-mono text-[0.6875rem] text-ink-faint"
                        >
                          {p}
                        </span>
                      ))}
                      <Link
                        href={c.href}
                        className="group ml-auto inline-flex items-center gap-2 text-sm text-ink transition-colors hover:text-signal"
                      >
                        Open chapter
                        <span className="transition-transform group-hover:translate-x-1">
                          →
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Folder>
  );
}
