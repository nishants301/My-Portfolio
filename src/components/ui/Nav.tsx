"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { site } from "@/data/site";
import { useScrollProgress } from "@/lib/hooks";

const links = [
  { href: "/#work", label: "Work" },
  { href: "/#approach", label: "Approach" },
  { href: "/#stack", label: "Stack" },
  { href: "/#about", label: "About" },
];

export default function Nav() {
  const progress = useScrollProgress();
  const [lifted, setLifted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Never leave the menu open behind a resize into the desktop layout.
  useEffect(() => {
    const onResize = () => window.innerWidth >= 768 && setOpen(false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
        lifted
          ? "border-b border-rule bg-ground/80 backdrop-blur-xl"
          : "border-b border-transparent",
      ].join(" ")}
    >
      {/* Read progress — doubles as the only chrome that ever moves. */}
      <div
        className="absolute inset-x-0 top-0 h-px origin-left bg-signal/70"
        style={{ transform: `scaleX(${progress})` }}
        aria-hidden
      />

      <nav className="shell flex h-16 items-center justify-between gap-6">
        <Link
          href="/"
          className="group flex items-center gap-2.5"
          aria-label={`${site.name} — home`}
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="pip absolute inline-flex h-full w-full rounded-full bg-signal" />
          </span>
          <span className="font-mono text-[0.8125rem] tracking-tight text-ink">
            {site.name.toLowerCase().replace(" ", ".")}
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[0.8125rem] text-ink-dim transition-colors hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
          <a
            href={`mailto:${site.email}`}
            className="rounded-full border border-rule-strong px-4 py-1.5 text-[0.8125rem] text-ink transition-colors hover:border-signal hover:text-signal"
          >
            Start a project
          </a>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded border border-rule text-ink-dim md:hidden"
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          <span className="flex flex-col gap-1">
            <span
              className={`block h-px w-4 bg-current transition-transform ${open ? "translate-y-[3px] rotate-45" : ""}`}
            />
            <span
              className={`block h-px w-4 bg-current transition-transform ${open ? "-translate-y-[3px] -rotate-45" : ""}`}
            />
          </span>
        </button>
      </nav>

      {open && (
        <div className="border-t border-rule bg-ground/95 backdrop-blur-xl md:hidden">
          <div className="shell flex flex-col py-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="border-b border-rule py-3 text-sm text-ink-dim"
              >
                {l.label}
              </Link>
            ))}
            <a
              href={`mailto:${site.email}`}
              onClick={() => setOpen(false)}
              className="py-3 text-sm text-signal"
            >
              Start a project →
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
