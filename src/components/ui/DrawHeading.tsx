"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DUR, EASE, STAGGER, prefersReducedMotion } from "@/lib/motion";

/**
 * The reference's signature move: a giant outline heading that strokes itself
 * on as the section enters, one character at a time.
 *
 * Each character is its own <svg><text>, which buys three things a single text
 * element cannot: a per-character stroke length we can measure exactly, a real
 * per-character stagger, and glyphs that stay selectable text for a screen
 * reader. Kerning is traded away for that, which is acceptable on a tracked-out
 * display line and matches the reference's own +1.16px tracking.
 *
 * Accessibility: the visible SVG is aria-hidden and a real heading element
 * carries the text. Under prefers-reduced-motion the glyphs render filled and
 * fully formed — an undrawn outline with animation disabled would be invisible
 * text, which is a failure, not a graceful degradation.
 */
export default function DrawHeading({
  text,
  as: Tag = "h2",
  className = "",
  slug,
}: {
  text: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
  /** Mono sub-label rendered opposite the heading — replaces the reference's CJK pairing. */
  slug?: string;
}) {
  const scope = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(true); // assume reduced until proven otherwise

  useEffect(() => setReduced(prefersReducedMotion()), []);

  useEffect(() => {
    const root = scope.current;
    if (!root || prefersReducedMotion()) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const glyphs = gsap.utils.toArray<SVGTextElement>("[data-glyph]");
      if (!glyphs.length) return;

      glyphs.forEach((g) => {
        // A glyph's stroked outline is roughly 2.6x its advance width. Measuring
        // per glyph keeps the draw speed even between an 'I' and a 'W'.
        const len = g.getComputedTextLength() * 2.6 || 300;
        gsap.set(g, { strokeDasharray: len, strokeDashoffset: len });
      });

      gsap.to(glyphs, {
        strokeDashoffset: 0,
        duration: DUR.draw,
        ease: `cubic-bezier(${EASE.draw.join(",")})`,
        stagger: STAGGER.letter,
        scrollTrigger: {
          trigger: root,
          start: "top 85%",
          once: true,
        },
      });
    }, root);

    return () => ctx.revert();
  }, [text]);

  const chars = [...text];

  return (
    <div ref={scope} className={`flex flex-wrap items-end justify-between gap-x-6 gap-y-2 ${className}`}>
      {/* Real heading for assistive tech and SEO; the SVG below is decoration. */}
      <Tag className="sr-only">{text}</Tag>

      <div className="flex items-baseline" aria-hidden>
        {chars.map((ch, i) =>
          ch === " " ? (
            <span key={i} className="inline-block w-[0.26em]" />
          ) : (
            <svg
              key={i}
              viewBox="0 0 100 130"
              className="block h-[clamp(2.6rem,9vw,7.5rem)] w-auto overflow-visible"
              role="presentation"
            >
              <text
                data-glyph
                x="50"
                y="100"
                textAnchor="middle"
                className={
                  reduced
                    ? "fill-ink stroke-none"
                    : "fill-none stroke-ink [stroke-width:2.4]"
                }
                style={{
                  fontSize: "104px",
                  fontWeight: 800,
                  letterSpacing: "0.012em",
                  fontFamily: "var(--font-inter), sans-serif",
                  // Keeps the stroke visually even as glyphs scale with the viewport.
                  vectorEffect: "non-scaling-stroke",
                }}
              >
                {ch}
              </text>
            </svg>
          )
        )}
      </div>

      {slug && (
        <span className="mono-label shrink-0 pb-2 text-ink-dim">{slug}</span>
      )}
    </div>
  );
}
