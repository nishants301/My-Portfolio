import { site } from "@/data/site";
import Reveal from "@/components/ui/Reveal";

export default function Contact() {
  return (
    <footer
      id="contact"
      className="relative scroll-mt-20 overflow-hidden border-t border-rule"
    >
      <div className="grid-field mask-radial absolute inset-0 opacity-70" aria-hidden />

      <div className="shell relative py-24 md:py-36">
        <Reveal>
          <p className="mono-label">Contact</p>
          <h2 className="display mt-5 max-w-[15ch] text-[clamp(2.5rem,8vw,6rem)]">
            Have something that
            <span className="text-ink-dim"> needs shipping?</span>
          </h2>
          <p className="mt-8 max-w-[48ch] text-[0.9375rem] leading-relaxed text-ink-dim">
            I take on AI systems work end-to-end — discovery, architecture,
            build, deployment and training the team that inherits it. Enterprise
            engagements and senior engineering roles both welcome.
          </p>
        </Reveal>

        <Reveal delay={100} className="mt-12 flex flex-wrap items-center gap-3">
          <a
            href={`mailto:${site.email}`}
            className="group inline-flex items-center gap-2.5 rounded-full bg-signal px-7 py-3.5 text-sm font-medium text-ground transition-transform hover:-translate-y-0.5"
          >
            {site.email}
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
          <a
            href={site.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-rule-strong px-7 py-3.5 text-sm text-ink transition-colors hover:border-signal hover:text-signal"
          >
            LinkedIn ↗
          </a>
          <a
            href={site.resume}
            className="inline-flex items-center gap-2 rounded-full border border-rule-strong px-7 py-3.5 text-sm text-ink transition-colors hover:border-signal hover:text-signal"
          >
            Résumé (PDF)
          </a>
        </Reveal>

        <div className="mt-24 flex flex-wrap items-center justify-between gap-4 border-t border-rule pt-7">
          <p className="mono-label">
            © {new Date().getFullYear()} {site.name}
          </p>
          <p className="mono-label">
            Built with Next.js · Three.js · No template
          </p>
        </div>
      </div>
    </footer>
  );
}
