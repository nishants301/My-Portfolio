"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/data/site";
import Folder from "@/components/ui/Folder";
import DrawHeading from "@/components/ui/DrawHeading";
import Reveal from "@/components/motion/Reveal";
import { DUR, EASE_CSS } from "@/lib/motion";

/**
 * Section 07 — Contact.
 *
 * Reference pattern: a large CTA panel, an email bar with a copy action, and a
 * row of links. The copy toast (`ftp-toast`) is the one piece of its motion
 * worth taking verbatim — it confirms an action that otherwise gives no
 * feedback at all.
 */
export default function Contact() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear on unmount so a pending toast cannot set state on a dead component.
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      // 3-5s auto-dismiss, per the toast rule.
      timer.current = setTimeout(() => setCopied(false), 3200);
    } catch {
      // Clipboard can be blocked; the address is visible and selectable anyway.
      setCopied(false);
    }
  };

  return (
    <Folder
      id="contact"
      index="07"
      total="07"
      tab="Contact"
      tone={0}
      active
      meta={["2024 — 2026", "CONTACT", "OPEN TO WORK", site.location.toUpperCase()]}
    >
      <DrawHeading text="CONTACT" slug="OPEN · ENGAGEMENTS & ROLES" />

      {/* ---------- CTA panel ---------- */}
      <Reveal className="mt-12">
        <div className="relative overflow-hidden rounded-[18px] border border-rule bg-raised p-7 sm:p-12">
          <div className="grid-field mask-radial absolute inset-0 opacity-60" aria-hidden />
          <div className="relative">
            <h3 className="display max-w-[14ch] text-[clamp(2.25rem,7vw,5rem)]">
              Have something that
              <span className="text-ink-dim"> needs shipping?</span>
            </h3>
            <p className="mt-7 max-w-[48ch] text-[0.9375rem] leading-relaxed text-ink-dim">
              I take on AI systems work end-to-end — discovery, architecture,
              build, deployment and training the team that inherits it.
              Enterprise engagements and senior engineering roles both welcome.
            </p>
          </div>
        </div>
      </Reveal>

      {/* ---------- Email bar ---------- */}
      <Reveal className="mt-4">
        <div className="flex flex-col gap-4 rounded-[18px] border border-signal/30 bg-signal/[0.06] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <a
            href={`mailto:${site.email}`}
            className="font-mono text-[clamp(1.0625rem,3vw,1.75rem)] tracking-tight text-ink transition-colors hover:text-signal"
          >
            {site.email}
          </a>

          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={copy}
              className="rounded-full border border-rule-strong px-5 py-2.5 text-sm text-ink transition-colors hover:border-signal hover:text-signal"
            >
              Copy
            </button>
            <a
              href={`mailto:${site.email}`}
              className="group inline-flex items-center gap-2 rounded-full bg-signal px-5 py-2.5 text-sm font-medium text-ground"
              style={{ transition: `transform ${DUR.hover}s ${EASE_CSS.spring}` }}
            >
              Write
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </a>
          </div>
        </div>
      </Reveal>

      {/* ---------- Links ---------- */}
      <Reveal className="mt-4 grid gap-3 sm:grid-cols-3" stagger>
        {[
          { k: "LinkedIn", v: "in/nishant301", href: site.linkedin },
          { k: "Phone", v: site.phone, href: `tel:${site.phone.replace(/\s/g, "")}` },
          { k: "Résumé", v: "PDF, one page", href: site.resume },
        ].map((l) => (
          <a
            key={l.k}
            href={l.href}
            target={l.href.startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="group flex items-center justify-between gap-4 rounded-[18px] border border-rule bg-ground/40 px-5 py-4 transition-colors hover:border-rule-strong"
          >
            <span>
              <span className="mono-label block">{l.k}</span>
              <span className="mt-1 block text-[0.875rem] text-ink-dim">{l.v}</span>
            </span>
            <span className="text-ink-faint transition-all group-hover:translate-x-1 group-hover:text-signal">
              ↗
            </span>
          </a>
        ))}
      </Reveal>

      <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-rule pt-7">
        <p className="mono-label">© {new Date().getFullYear()} {site.name}</p>
        <p className="mono-label">Next.js · GSAP · Canvas · No template</p>
      </div>

      {/* ---------- Copy toast ---------- */}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-8 z-[70] flex justify-center"
      >
        <span
          className="rounded-full border border-signal/40 bg-panel px-5 py-2.5 text-sm text-ink shadow-[0_18px_40px_-18px_rgba(0,0,0,0.9)]"
          style={{
            transition: `opacity ${DUR.tap}s ease, transform ${DUR.tap}s ${EASE_CSS.decelerate}`,
            opacity: copied ? 1 : 0,
            transform: copied ? "none" : "translateY(14px) scale(0.96)",
          }}
        >
          {copied ? "Email copied to clipboard" : ""}
        </span>
      </div>
    </Folder>
  );
}
