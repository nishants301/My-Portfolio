import Link from "next/link";
import { featured, archive } from "@/data/projects";
import ProjectCard from "@/components/ui/ProjectCard";
import Reveal from "@/components/ui/Reveal";

export default function Work() {
  return (
    <section id="work" className="scroll-mt-20 py-24 md:py-32">
      <div className="shell">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="mono-label">Selected work</p>
            <h2 className="display mt-4 max-w-[16ch] text-[clamp(2rem,5vw,3.75rem)]">
              Systems in production, not prototypes.
            </h2>
          </div>
          <p className="max-w-[34ch] text-sm leading-relaxed text-ink-dim">
            Every project below is deployed and in daily use by real clients or
            an internal team. Each one links to the architecture decisions
            behind it.
          </p>
        </Reveal>

        <div className="mt-16">
          {featured.map((p, i) => (
            <ProjectCard key={p.slug} project={p} flip={i % 2 === 1} />
          ))}
        </div>

        {/* ---------- Archive index ---------- */}
        <div className="mt-24 border-t border-rule pt-14">
          <Reveal>
            <p className="mono-label">Also built</p>
          </Reveal>

          <ul className="mt-8">
            {archive.map((p, i) => (
              <Reveal as="li" key={p.slug} delay={i * 60}>
                <Link
                  href={`/work/${p.slug}`}
                  className="group grid grid-cols-12 items-baseline gap-4 border-b border-rule py-6 transition-colors hover:bg-surface/50"
                >
                  <span className="mono-label col-span-2 text-signal md:col-span-1">
                    {p.idx}
                  </span>
                  <span className="col-span-10 text-base text-ink transition-colors group-hover:text-signal md:col-span-3">
                    {p.name}
                  </span>
                  <span className="col-span-12 text-sm text-ink-dim md:col-span-5">
                    {p.kicker}
                  </span>
                  <span className="mono-label col-span-10 md:col-span-2">
                    {p.stack.slice(0, 2).join(" · ")}
                  </span>
                  <span className="col-span-2 text-right text-ink-faint transition-all group-hover:translate-x-1 group-hover:text-signal md:col-span-1">
                    →
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
