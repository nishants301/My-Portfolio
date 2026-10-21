import Folder from "@/components/ui/Folder";
import DrawHeading from "@/components/ui/DrawHeading";
import Reveal from "@/components/motion/Reveal";

/**
 * Section 06 — Production safeguards.
 *
 * Replaces the reference's testimonials section, which had no backing content
 * here (docs/spec.md §4). Fabricated praise on a portfolio aimed at enterprise
 * buyers is the fastest way to lose credibility, and it is exactly the kind of
 * claim that gets checked.
 *
 * These six are real, already documented in the project data, and are the
 * thing a client is actually weighing: not whether an LLM can be called, but
 * whether it is safe to let one near their customers.
 */

const SAFEGUARDS = [
  {
    k: "Human approval",
    v: "100% of public AI output",
    note: "Nothing an agent writes reaches a public channel without a person approving it.",
  },
  {
    k: "Session storage",
    v: "AES-256-GCM encrypted",
    note: "Authenticated scraping sessions are captured once and replayed, never re-authenticated per run.",
  },
  {
    k: "Messaging",
    v: "Hard rate caps + send windows",
    note: "Protects client messaging accounts from being flagged or banned.",
  },
  {
    k: "Ad creative",
    v: "7-gate policy compliance check",
    note: "Every creative passes a policy gate before it can ship to a platform.",
  },
  {
    k: "Data access",
    v: "RBAC at the data layer",
    note: "Payroll and revenue are isolated by role in the database, not merely hidden in the UI.",
  },
  {
    k: "Collection jobs",
    v: "Idempotent and re-runnable",
    note: "A failed 3am run repairs itself on retry instead of duplicating a day of data.",
  },
] as const;

export default function Safeguards() {
  return (
    <Folder
      id="safeguards"
      index="06"
      total="07"
      tab="Safeguards"
      tone={3}
      meta={["2024 — 2026", "PRODUCTION SAFEGUARDS", "06 CONTROLS", "IN FORCE"]}
    >
      <DrawHeading text="SAFEGUARDS" slug="06 CONTROLS · IN FORCE" />

      <Reveal className="mt-6 max-w-[58ch]">
        <p className="text-[0.9375rem] leading-relaxed text-ink-dim">
          What a client is actually buying is the judgment about when{" "}
          <em className="not-italic text-ink">not</em> to let the model run on
          its own. These are the controls currently in force on live systems.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SAFEGUARDS.map((s, i) => (
          <Reveal key={s.k} delay={i * 0.05}>
            <div className="h-full rounded-[18px] border border-rule bg-ground/40 p-6">
              <div className="flex items-center gap-2.5">
                <span className="pip h-1.5 w-1.5 rounded-full bg-signal" aria-hidden />
                <span className="mono-label">{s.k}</span>
              </div>
              <p className="mt-4 text-[1.0625rem] leading-snug tracking-tight text-ink">
                {s.v}
              </p>
              <p className="mt-3 text-[0.8125rem] leading-relaxed text-ink-faint">
                {s.note}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </Folder>
  );
}
