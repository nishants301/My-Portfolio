import Reveal from "@/components/ui/Reveal";

/**
 * The section that converts enterprise buyers. Anyone can list technologies;
 * what a client is actually buying is the judgment about when *not* to let the
 * model run on its own.
 */

const phases = [
  {
    n: "01",
    title: "Find the bottleneck first",
    body: "No PM and no spec means discovery is the job. I sit with the people doing the work — founders, sales, HR, ops — and find the task that eats hours before deciding what to build. Most requested features are not the actual constraint.",
  },
  {
    n: "02",
    title: "Architect for the failure case",
    body: "Production systems are defined by what they do at 3am when a job fails. Idempotent writes, encrypted session reuse, auditable runs and independent deploys are decided up front, not patched in after the first incident.",
  },
  {
    n: "03",
    title: "Gate anything public",
    body: "Every public-facing AI output goes through mandatory human approval. Rate caps and send windows protect messaging accounts, and a seven-gate policy check runs before creative ships. Autonomy is granted where it is safe and withheld where it is not.",
  },
  {
    n: "04",
    title: "Hand it over properly",
    body: "A system nobody can run without me is a liability, not an asset. Non-technical staff are trained to operate the dashboards, agents and workflows themselves — success is measured by daily use weeks later, not by the delivery date.",
  },
];

const safeguards = [
  { k: "Human approval", v: "100% of public AI output" },
  { k: "Session storage", v: "AES-256-GCM encrypted" },
  { k: "Messaging", v: "Hard rate caps + send windows" },
  { k: "Ad creative", v: "7-gate policy compliance check" },
  { k: "Data access", v: "RBAC enforced at the data layer" },
  { k: "Collection jobs", v: "Idempotent, auditable, re-runnable" },
];

export default function Approach() {
  return (
    <section
      id="approach"
      className="scroll-mt-20 border-t border-rule bg-surface/30 py-24 md:py-32"
    >
      <div className="shell">
        <Reveal className="max-w-[52ch]">
          <p className="mono-label">How I work</p>
          <h2 className="display mt-4 text-[clamp(2rem,5vw,3.75rem)]">
            The hard part was never the model.
          </h2>
          <p className="mt-6 text-[0.9375rem] leading-relaxed text-ink-dim">
            Calling an LLM is an afternoon. Running one against real customers,
            real messaging accounts and real payroll data without breaking
            something is the actual engineering.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-x-14 gap-y-12 md:grid-cols-2">
          {phases.map((p, i) => (
            <Reveal key={p.n} delay={i * 80}>
              <div className="flex items-center gap-4">
                <span className="font-mono text-sm text-signal">{p.n}</span>
                <span className="h-px flex-1 bg-rule" />
              </div>
              <h3 className="mt-5 text-lg tracking-tight text-ink">{p.title}</h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-dim">
                {p.body}
              </p>
            </Reveal>
          ))}
        </div>

        {/* ---------- Safeguards spec sheet ---------- */}
        <Reveal className="mt-20">
          <div className="rounded-xl border border-rule bg-panel/60 p-6 md:p-10">
            <div className="flex items-center gap-3">
              <span className="relative flex h-1.5 w-1.5">
                <span className="pip absolute inline-flex h-full w-full rounded-full bg-signal" />
              </span>
              <p className="mono-label">Production safeguards in force</p>
            </div>

            <dl className="mt-8 grid gap-x-10 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
              {safeguards.map((s) => (
                <div key={s.k} className="border-t border-rule pt-4">
                  <dt className="mono-label">{s.k}</dt>
                  <dd className="mt-1.5 text-sm text-ink">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
