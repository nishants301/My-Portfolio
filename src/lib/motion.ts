/**
 * The single source of truth for motion.
 *
 * The reference template declares ~14 distinct transitions, but they collapse
 * to three easing curves and a handful of durations. Centralising them is what
 * makes a long scrolling page feel authored by one hand rather than assembled
 * — see docs/spec.md §3.
 *
 * Nothing in this project should hard-code a duration or cubic-bezier.
 */

/** Cubic-bezier control points, in GSAP/CSS order. */
export const EASE = {
  /** Overshoot. Hover, press, pill selection — anything that should feel sprung. */
  spring: [0.3, 1.4, 0.5, 1],
  /** Arrival. Reveals, panels, accordions — decelerating into place. */
  decelerate: [0.2, 0.8, 0.2, 1],
  /** The stroke draw-on. Slow in, fast middle, slow out. */
  draw: [0.65, 0, 0.25, 1],
} as const;

const css = (e: readonly number[]) => `cubic-bezier(${e.join(",")})`;

/** Same curves, pre-formatted for CSS `transition-timing-function`. */
export const EASE_CSS = {
  spring: css(EASE.spring),
  decelerate: css(EASE.decelerate),
  draw: css(EASE.draw),
} as const;

/** Seconds. Named by intent, not by number. */
export const DUR = {
  /** Link colour, micro-feedback. */
  fast: 0.25,
  /** Tap/select state change. */
  tap: 0.35,
  /** Card and tab hover. */
  hover: 0.5,
  /** Large panel movement. */
  panel: 0.7,
  /** Section entrance. */
  reveal: 0.9,
  /** Outline heading stroke draw. */
  draw: 1.25,
} as const;

/** Stagger offsets, in seconds. Measured off the reference. */
export const STAGGER = {
  /** Per character in a drawn heading. */
  letter: 0.07,
  /** Per item in a revealing grid or list. */
  item: 0.06,
} as const;

/** Travel distances for entrance animations, in px. */
export const SHIFT = {
  /** Whole sections. */
  section: 40,
  /** Items within a section. */
  item: 16,
} as const;

/**
 * True when the user has asked for less motion. SSR-safe (returns false on the
 * server, where there is no media query to read).
 */
export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
