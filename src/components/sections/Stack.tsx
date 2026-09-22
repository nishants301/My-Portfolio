import { site, skillGroups } from "@/data/site";
import Reveal from "@/components/ui/Reveal";

export default function Stack() {
  // Duplicated once so the marquee can loop seamlessly at -50%.
  const ticker = [...site.capabilities, ...site.capabilities];

  return (
    <section id="stack" className="scroll-mt-20 border-t border-rule py-24 md:py-32">
      {/* Capability ticker — motion that carries information, not decoration. */}
      <div className="marquee relative mb-20 overflow-hidden border-y border-rule py-5">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-ground to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-ground to-transparent"
          aria-hidden
        />
        <div className="marquee-track flex w-max gap-8" aria-hidden>
          {ticker.map((c, i) => (
            <span
              key={`${c}-${i}`}
              className="mono-label flex shrink-0 items-center gap-8 text-ink-dim"
            >
              {c}
              <span className="text-signal/40">◦</span>
            </span>
          ))}
        </div>
        <span className="sr-only">
          Capabilities: {site.capabilities.join(", ")}
        </span>
      </div>

      <div className="shell">
        <Reveal className="max-w-[46ch]">
          <p className="mono-label">Stack</p>
          <h2 className="display mt-4 text-[clamp(2rem,5vw,3.75rem)]">
            Chosen for what ships.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-y-10 md:grid-cols-2 md:gap-x-16 lg:grid-cols-4">
          {skillGroups.map((g, i) => (
            <Reveal key={g.label} delay={i * 70}>
              <div className="flex items-baseline gap-3 border-b border-rule pb-3">
                <span className="font-mono text-xs text-signal">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-sm tracking-tight text-ink">{g.label}</h3>
              </div>
              <ul className="mt-5 space-y-2.5">
                {g.items.map((item) => (
                  <li
                    key={item}
                    className="text-[0.875rem] leading-snug text-ink-dim"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
