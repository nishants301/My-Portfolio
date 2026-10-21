"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DUR, EASE, SHIFT, STAGGER } from "@/lib/motion";

/**
 * Scroll-entrance wrapper. Animates opacity and transform only — never a
 * layout property — so revealing a section cannot contribute to CLS.
 *
 * `gsap.matchMedia` is doing the accessibility work: under reduced motion the
 * branch simply never runs, and because the element's resting state is its
 * final state, the content is already correct on screen. There is no
 * "animate to visible" that could strand content at opacity 0.
 */
export default function Reveal({
  children,
  as: Tag = "div",
  className = "",
  /** Stagger direct children instead of moving the container as one block. */
  stagger = false,
  /** Entrance distance: a whole section travels further than an item. */
  distance = SHIFT.item,
  delay = 0,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  stagger?: boolean;
  distance?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const targets = stagger ? Array.from(el.children) : el;

      gsap.from(targets, {
        opacity: 0,
        y: distance,
        duration: DUR.reveal,
        delay,
        ease: `cubic-bezier(${EASE.decelerate.join(",")})`,
        stagger: stagger ? STAGGER.item : 0,
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          once: true,
        },
      });
    });

    return () => mm.revert();
  }, [stagger, distance, delay]);

  // TS cannot narrow a generic ElementType's props, so the tag is cast to a
  // plain HTML-attribute component here.
  const Component = Tag as React.ComponentType<
    React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLDivElement> }
  >;

  return (
    <Component ref={ref} className={className}>
      {children}
    </Component>
  );
}
