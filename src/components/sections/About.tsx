"use client";

import { useRef } from "react";
import { site, experience, education } from "@/data/site";
import Folder from "@/components/ui/Folder";
import DrawHeading from "@/components/ui/DrawHeading";
import Reveal from "@/components/motion/Reveal";
import Portrait from "@/components/ui/Portrait";
import { DUR, EASE_CSS } from "@/lib/motion";

/**
 * Section 03 — About.
 *
 * Reference pattern: a portrait card that tilts toward the pointer, bio text,
 * a row of credential chips, and a three-point timeline.
 *
 * The tilt is written straight to the node inside rAF rather than through
 * state, so pointer movement never triggers a React render.
 */

const CREDENTIALS = [
  { k: "Role", v: "Sole engineer" },
  { k: "Scope", v: "Discovery → handover" },
  { k: "Clients", v: "150+ consultancy" },
  { k: "Base", v: "Delhi, India" },
] as const;

function TiltCard() {
  const card = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  const onMove = (e: React.MouseEvent) => {
    const el = card.current;
    if (!el || frame.current) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    frame.current = requestAnimationFrame(() => {
      el.style.transform = `perspective(1000px) rotateY(${px * 9}deg) rotateX(${-py * 9}deg)`;
      frame.current = 0;
    });
  };

  const onLeave = () => {
    const el = card.current;
    if (!el) return;
    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = 0;
    el.style.transform = "";
  };

  return (
    <div onMouseMove={onMove} onMouseLeave={onLeave}>
      <div
        ref={card}
        style={{
          transition: `transform ${DUR.hover}s ${EASE_CSS.spring}`,
          willChange: "transform",
        }}
        className="overflow-hidden rounded-[18px] border border-rule bg-panel"
      >
        <div className="relative aspect-[4/5]">
          <Portrait alt={site.name} />
        </div>

        <dl className="divide-y divide-rule border-t border-rule">
          {[
            { k: "Email", v: site.email, href: `mailto:${site.email}` },
            { k: "Phone", v: site.phone, href: `tel:${site.phone.replace(/\s/g, "")}` },
            { k: "LinkedIn", v: "in/nishant301", href: site.linkedin },
          ].map((r) => (
            <div key={r.k} className="flex items-center justify-between gap-4 px-4 py-3">
              <dt className="mono-label">{r.k}</dt>
              <dd className="truncate text-[0.8125rem] text-ink-dim">
                <a
                  href={r.href}
                  target={r.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-signal"
                >
                  {r.v}
                </a>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

export default function About() {
  return (
    <Folder
      id="about"
      index="03"
      total="07"
      tab="About"
      tone={2}
      meta={["2024 — 2026", "SELF-INTRODUCTION", "AUTOMATION & ROBOTICS", "NEW DELHI"]}
    >
      <DrawHeading text="ABOUT" slug="01 · SELF-INTRODUCTION" />

      <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-14">
        <Reveal className="lg:col-span-4">
          <TiltCard />
        </Reveal>

        <div className="lg:col-span-8">
          <Reveal>
            <h3 className="display max-w-[18ch] text-[clamp(1.75rem,4vw,3rem)]">
              One engineer, the whole pipeline.
            </h3>
            <div className="mt-7 max-w-[62ch] space-y-5 text-[0.9375rem] leading-relaxed text-ink-dim">
              <p>
                I am the entire engineering function at Plateful Consulting, a
                restaurant-growth consultancy serving 150+ clients across India.
                There is no product manager and no spec — the work starts with a
                conversation about what is slow, and ends with a system in
                production that somebody who is not an engineer can run.
              </p>
              <p>
                That constraint shapes everything I build. Systems have to fail
                safely, hand over cleanly, and keep working when I am busy with
                the next thing. It is also why I care more about whether a tool
                is still open six weeks after launch than about how impressive
                it was on the day it shipped.
              </p>
              <p>
                My background is automation and robotics, which is where the
                instinct comes from: treat an AI agent like any other machine on
                a line — give it limits, instrument it, and put a human at the
                point where a mistake becomes expensive.
              </p>
            </div>
          </Reveal>

          {/* Credential chips */}
          <Reveal className="mt-9 flex flex-wrap gap-2" stagger>
            {CREDENTIALS.map((c) => (
              <span
                key={c.k}
                className="rounded-full border border-rule bg-ground/40 px-3.5 py-1.5"
              >
                <span className="mono-label mr-2">{c.k}</span>
                <span className="text-[0.8125rem] text-ink">{c.v}</span>
              </span>
            ))}
          </Reveal>

          {/* Timeline */}
          <div className="mt-14">
            {experience.map((e) => (
              <Reveal key={e.org}>
                <div className="border-t border-rule pt-7">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                    <h4 className="text-base tracking-tight text-ink">
                      {e.role} · {e.org}
                    </h4>
                    <span className="mono-label">{e.period}</span>
                  </div>
                  <p className="mono-label mt-2 normal-case tracking-normal">
                    {e.context}
                  </p>
                  <ul className="mt-6 space-y-4">
                    {e.points.map((pt) => (
                      <li key={pt} className="flex gap-4">
                        <span className="mt-2 h-px w-4 shrink-0 bg-signal/50" />
                        <span className="text-[0.9375rem] leading-relaxed text-ink-dim">
                          {pt}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-12 border-t border-rule pt-7">
            <p className="mono-label">Education & certification</p>
            <ul className="mt-5 space-y-4">
              {education.map((ed) => (
                <li key={ed.title}>
                  <p className="text-[0.9375rem] text-ink">{ed.title}</p>
                  <p className="mt-0.5 text-sm text-ink-faint">{ed.detail}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </Folder>
  );
}
