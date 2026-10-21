"use client";

import { useState } from "react";
import Folder from "@/components/ui/Folder";
import DrawHeading from "@/components/ui/DrawHeading";
import Reveal from "@/components/motion/Reveal";
import { DUR, EASE_CSS } from "@/lib/motion";

/**
 * Section 05 — Process.
 *
 * An exact 1:1 with the reference: it has four step tabs and a giant numeral
 * panel; this has precisely four phases. No adaptation needed.
 *
 * Panel content crossfades in place rather than remounting, which is the
 * `fade-crossfade` rule — content replacement inside one container should
 * cross-fade, not snap.
 */

const PHASES = [
  {
    n: "01",
    tab: "Discover",
    title: "Find the bottleneck first",
    body: "No PM and no spec means discovery is the job. I sit with the people doing the work — founders, sales, HR, ops — and find the task that eats hours before deciding what to build. Most requested features are not the actual constraint.",
    marks: ["Shadow the work", "Measure the hours", "Name the constraint"],
  },
  {
    n: "02",
    tab: "Architect",
    title: "Architect for the failure case",
    body: "Production systems are defined by what they do at 3am when a job fails. Idempotent writes, encrypted session reuse, auditable runs and independent deploys are decided up front, not patched in after the first incident.",
    marks: ["Idempotent writes", "Auditable runs", "Independent deploys"],
  },
  {
    n: "03",
    tab: "Gate",
    title: "Gate anything public",
    body: "Every public-facing AI output goes through mandatory human approval. Rate caps and send windows protect messaging accounts, and a seven-gate policy check runs before creative ships. Autonomy is granted where it is safe and withheld where it is not.",
    marks: ["Human approval", "Rate caps", "Policy checks"],
  },
  {
    n: "04",
    tab: "Hand over",
    title: "Hand it over properly",
    body: "A system nobody can run without me is a liability, not an asset. Non-technical staff are trained to operate the dashboards, agents and workflows themselves — success is measured by daily use weeks later, not by the delivery date.",
    marks: ["Train the team", "Measure adoption", "Step back"],
  },
] as const;

export default function Process() {
  const [step, setStep] = useState(0);
  const phase = PHASES[step];

  return (
    <Folder
      id="process"
      index="05"
      total="07"
      tab="Process"
      tone={2}
      meta={["2024 — 2026", "WORKING PROCESS", "04 PHASES", "DISCOVERY → HANDOVER"]}
    >
      <DrawHeading text="PROCESS" slug="04 PHASES · HOW I WORK" />

      <Reveal className="mt-6 max-w-[56ch]">
        <p className="text-[0.9375rem] leading-relaxed text-ink-dim">
          Calling an LLM is an afternoon. Running one against real customers,
          real messaging accounts and real payroll data without breaking
          something is the actual engineering.
        </p>
      </Reveal>

      {/* ---------- Step tabs ---------- */}
      <div
        className="mt-10 flex gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="tablist"
        aria-label="Process phases"
      >
        {PHASES.map((p, i) => {
          const on = i === step;
          return (
            <button
              key={p.n}
              role="tab"
              aria-selected={on}
              aria-controls="process-panel"
              onClick={() => setStep(i)}
              style={{
                transition: `transform ${DUR.tap}s ${EASE_CSS.spring}, background-color ${DUR.tap}s ease, color ${DUR.tap}s ease`,
              }}
              className={[
                "shrink-0 rounded-t-[12px] px-4 py-2.5 text-[0.8125rem] whitespace-nowrap sm:px-5",
                on ? "bg-raised text-ink" : "bg-ground/40 text-ink-faint hover:text-ink-dim",
              ].join(" ")}
            >
              <span className={`mr-2 font-mono text-[0.6875rem] ${on ? "text-signal" : ""}`}>
                {p.n}
              </span>
              {p.tab}
            </button>
          );
        })}
      </div>

      {/* ---------- Panel ---------- */}
      <div
        id="process-panel"
        role="tabpanel"
        className="rounded-[18px] rounded-tl-none border border-rule bg-raised p-6 sm:p-10"
      >
        {/* key forces a crossfade on step change rather than a snap. */}
        <div
          key={step}
          className="grid gap-8 lg:grid-cols-12 lg:gap-12"
          style={{ animation: `proc-in ${DUR.reveal}s ${EASE_CSS.decelerate} both` }}
        >
          <div className="lg:col-span-4">
            <div className="font-mono text-[clamp(3.5rem,10vw,7rem)] leading-none text-signal/90">
              {phase.n}
            </div>
            <div className="mono-label mt-3">Phase {phase.n} of 04</div>

            <div className="mt-8 space-y-2.5">
              {phase.marks.map((m) => (
                <div key={m} className="flex items-center gap-3">
                  <span className="h-px w-5 bg-signal/50" aria-hidden />
                  <span className="text-[0.8125rem] text-ink-dim">{m}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-8">
            <h3 className="display text-[clamp(1.5rem,3.4vw,2.5rem)]">{phase.title}</h3>
            <p className="mt-6 max-w-[62ch] text-[0.9375rem] leading-relaxed text-ink-dim">
              {phase.body}
            </p>

            <div className="mt-10 flex items-center gap-3 border-t border-rule pt-6">
              <button
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className="rounded-full border border-rule px-4 py-2 text-sm text-ink-dim transition-colors enabled:hover:border-signal enabled:hover:text-signal disabled:opacity-40"
              >
                ← Prev
              </button>
              <button
                onClick={() => setStep((s) => Math.min(PHASES.length - 1, s + 1))}
                disabled={step === PHASES.length - 1}
                className="group inline-flex items-center gap-2 rounded-full border border-rule px-4 py-2 text-sm text-ink transition-colors enabled:hover:border-signal enabled:hover:text-signal disabled:opacity-40"
              >
                Next step
                <span className="transition-transform group-enabled:group-hover:translate-x-1">
                  →
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Folder>
  );
}
