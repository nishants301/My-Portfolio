"use client";

import type { ElementType, ReactNode } from "react";
import { useReveal } from "@/lib/hooks";

/**
 * Scroll-reveal wrapper. The animation itself lives in CSS (`.reveal`), so the
 * only JS cost is one IntersectionObserver that disconnects after it fires.
 */
export default function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className = "",
}: {
  children: ReactNode;
  /** Stagger in ms. Keep under ~400 or the page feels slow to load. */
  delay?: number;
  as?: ElementType;
  className?: string;
}) {
  const ref = useReveal<HTMLDivElement>();

  // TS cannot narrow a generic ElementType's props, so the tag is cast to a
  // plain HTML-attribute component here.
  const Component = Tag as React.ComponentType<
    React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLDivElement> }
  >;

  return (
    <Component
      ref={ref}
      className={`reveal ${className}`}
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Component>
  );
}
