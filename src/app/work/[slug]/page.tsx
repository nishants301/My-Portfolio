import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, bySlug } from "@/data/projects";
import ShotFrame from "@/components/ui/ShotFrame";
import Reveal from "@/components/ui/Reveal";
import Contact from "@/components/sections/Contact";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = bySlug(slug);
  if (!project) return { title: "Not found" };

  return {
    title: project.name,
    description: project.summary,
    openGraph: { title: project.name, description: project.summary },
  };
}

export default async function CaseStudy({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = bySlug(slug);
  if (!project) notFound();

  const i = projects.findIndex((p) => p.slug === slug);
  const next = projects[(i + 1) % projects.length];

  return (
    <main>
      {/* ---------- Header ---------- */}
      <header className="relative overflow-hidden border-b border-rule pt-16">
        <div className="grid-field mask-radial absolute inset-0" aria-hidden />

        <div className="shell relative py-20 md:py-28">
          <Link
            href="/#work"
            className="group mono-label inline-flex items-center gap-2 transition-colors hover:text-ink"
          >
            <span className="transition-transform group-hover:-translate-x-1">←</span>
            All work
          </Link>

          <div className="mt-10 flex items-center gap-4">
            <span className="mono-label text-signal">{project.idx}</span>
            <span className="h-px w-12 bg-rule" />
            <span className="mono-label">{project.kicker}</span>
          </div>

          <h1 className="display mt-6 max-w-[16ch] text-[clamp(2.5rem,7vw,5.5rem)]">
            {project.name}
          </h1>

          <p className="mt-7 max-w-[56ch] text-[clamp(1rem,1.5vw,1.1875rem)] leading-relaxed text-ink-dim">
            {project.tagline}
          </p>

          {/* Spec rail */}
          <dl className="mt-14 grid gap-x-10 gap-y-6 border-t border-rule pt-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { k: "Status", v: project.status },
              { k: "Year", v: project.year },
              { k: "Role", v: project.role },
              { k: "Stack", v: project.stack.join(" · ") },
            ].map((r) => (
              <div key={r.k}>
                <dt className="mono-label">{r.k}</dt>
                <dd className="mt-2 text-sm leading-snug text-ink">{r.v}</dd>
              </div>
            ))}
          </dl>

          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-flex items-center gap-2 rounded-full border border-rule-strong px-6 py-3 text-sm text-ink transition-colors hover:border-signal hover:text-signal"
            >
              {project.urlLabel} ↗
            </a>
          )}
        </div>
      </header>

      {/* ---------- Hero shot ---------- */}
      <div className="shell -mt-4 md:-mt-8">
        <Reveal className="relative z-10">
          <ShotFrame project={project} />
        </Reveal>
      </div>

      {/* ---------- Body ---------- */}
      <div className="shell py-24 md:py-32">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Reveal className="lg:sticky lg:top-28">
              <p className="mono-label">Outcome</p>
              <dl className="mt-6 space-y-6">
                {project.outcomes.map((o) => (
                  <div key={o.label} className="border-t border-rule pt-4">
                    <dt className="font-mono text-2xl leading-none text-ink">
                      {o.value}
                    </dt>
                    <dd className="mt-2 text-[0.8125rem] text-ink-dim">
                      {o.label}
                    </dd>
                  </div>
                ))}
              </dl>

              {project.judgment && (
                <div className="mt-10 rounded-lg border border-rule bg-panel/60 p-5">
                  <p className="mono-label">Production judgment</p>
                  <ul className="mt-4 space-y-3">
                    {project.judgment.map((j) => (
                      <li key={j} className="flex gap-3">
                        <span className="mt-2 h-px w-3 shrink-0 bg-signal/60" />
                        <span className="text-[0.8125rem] leading-relaxed text-ink-dim">
                          {j}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Reveal>
          </div>

          <div className="lg:col-span-8">
            <Reveal>
              <p className="mono-label">Overview</p>
              <p className="mt-5 text-[clamp(1.0625rem,1.7vw,1.375rem)] leading-relaxed text-ink">
                {project.summary}
              </p>
            </Reveal>

            <Reveal className="mt-16">
              <p className="mono-label">The problem</p>
              <p className="mt-5 max-w-[62ch] text-[0.9375rem] leading-relaxed text-ink-dim">
                {project.problem}
              </p>
            </Reveal>

            <div className="mt-16">
              <Reveal>
                <p className="mono-label">Approach & decisions</p>
              </Reveal>
              <div className="mt-8 space-y-10">
                {project.approach.map((a, n) => (
                  <Reveal key={a.title} delay={n * 70}>
                    <div className="border-t border-rule pt-6">
                      <div className="flex items-baseline gap-4">
                        <span className="font-mono text-xs text-signal">
                          {String(n + 1).padStart(2, "0")}
                        </span>
                        <h2 className="text-lg tracking-tight text-ink">
                          {a.title}
                        </h2>
                      </div>
                      <p className="mt-3 max-w-[62ch] pl-8 text-[0.9375rem] leading-relaxed text-ink-dim">
                        {a.body}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ---------- Next ---------- */}
        <Reveal className="mt-28 border-t border-rule pt-10">
          <Link href={`/work/${next.slug}`} className="group block">
            <p className="mono-label">Next project</p>
            <div className="mt-4 flex flex-wrap items-baseline justify-between gap-4">
              <h2 className="display text-[clamp(1.75rem,4vw,3rem)] transition-colors group-hover:text-signal">
                {next.name}
              </h2>
              <span className="text-2xl text-ink-faint transition-all group-hover:translate-x-2 group-hover:text-signal">
                →
              </span>
            </div>
            <p className="mt-2 text-sm text-ink-dim">{next.kicker}</p>
          </Link>
        </Reveal>
      </div>

      <Contact />
    </main>
  );
}
