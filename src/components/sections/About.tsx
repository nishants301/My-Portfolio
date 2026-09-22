import { site, experience, education } from "@/data/site";
import Reveal from "@/components/ui/Reveal";
import Portrait from "@/components/ui/Portrait";

export default function About() {
  return (
    <section
      id="about"
      className="scroll-mt-20 border-t border-rule bg-surface/30 py-24 md:py-32"
    >
      <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-16">
        {/* ---------- Portrait + contact rail ---------- */}
        <Reveal className="lg:col-span-4">
          <div className="relative overflow-hidden rounded-xl border border-rule bg-panel">
            <div className="relative aspect-[4/5]">
              <Portrait alt={site.name} />
            </div>

            <dl className="divide-y divide-rule border-t border-rule">
              {[
                { k: "Based", v: site.location },
                { k: "Email", v: site.email, href: `mailto:${site.email}` },
                { k: "Phone", v: site.phone, href: `tel:${site.phone.replace(/\s/g, "")}` },
                { k: "LinkedIn", v: "in/nishant301", href: site.linkedin },
              ].map((r) => (
                <div key={r.k} className="flex items-center justify-between gap-4 px-4 py-3">
                  <dt className="mono-label">{r.k}</dt>
                  <dd className="truncate text-[0.8125rem] text-ink-dim">
                    {r.href ? (
                      <a
                        href={r.href}
                        target={r.href.startsWith("http") ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className="transition-colors hover:text-signal"
                      >
                        {r.v}
                      </a>
                    ) : (
                      r.v
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>

        {/* ---------- Narrative ---------- */}
        <div className="lg:col-span-8">
          <Reveal>
            <p className="mono-label">About</p>
            <h2 className="display mt-4 max-w-[18ch] text-[clamp(2rem,4.6vw,3.5rem)]">
              One engineer, the whole pipeline.
            </h2>
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
                is still open six weeks after launch than about how impressive it
                was on the day it shipped.
              </p>
              <p>
                My background is automation and robotics, which is where the
                instinct comes from: treat an AI agent like any other machine on
                a line — give it limits, instrument it, and put a human at the
                point where a mistake becomes expensive.
              </p>
            </div>
          </Reveal>

          {/* ---------- Experience ---------- */}
          <div className="mt-16">
            {experience.map((e) => (
              <Reveal key={e.org}>
                <div className="border-t border-rule pt-7">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                    <h3 className="text-base tracking-tight text-ink">
                      {e.role} · {e.org}
                    </h3>
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

          {/* ---------- Education ---------- */}
          <Reveal className="mt-14 border-t border-rule pt-7">
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
    </section>
  );
}
