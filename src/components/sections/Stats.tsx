import { site } from "@/data/site";
import Reveal from "@/components/ui/Reveal";

/**
 * The evidence bar. Placed immediately under the hero because the numbers are
 * the strongest thing on the page — a reviewer who reads nothing else should
 * still leave with these four.
 */
export default function Stats() {
  return (
    <section className="border-y border-rule bg-surface/40">
      <div className="shell grid grid-cols-2 divide-rule md:grid-cols-4 md:divide-x">
        {site.stats.map((s, i) => (
          <Reveal
            key={s.label}
            delay={i * 70}
            className={[
              "px-1 py-8 md:px-8",
              i < 2 ? "border-b border-rule md:border-b-0" : "",
              i % 2 === 1 ? "border-l border-rule pl-6 md:border-l-0 md:pl-8" : "",
              i === 0 ? "md:pl-0" : "",
            ].join(" ")}
          >
            <div className="font-mono text-[clamp(1.75rem,3.6vw,2.75rem)] leading-none tracking-tight text-ink">
              {s.value}
            </div>
            <div className="mt-3 text-[0.8125rem] leading-snug text-ink-dim">
              {s.label}
            </div>
            <div className="mono-label mt-1.5 normal-case tracking-normal">
              {s.detail}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
