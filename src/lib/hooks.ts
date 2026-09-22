"use client";

import { useEffect, useRef, useState } from "react";

/** Matches a media query, SSR-safe (always false on the server). */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

export const usePrefersReducedMotion = () =>
  useMediaQuery("(prefers-reduced-motion: reduce)");

/**
 * Decides whether the WebGL hero is worth rendering at all.
 *
 * Bails on: no WebGL context, reduced-motion, and low-core devices. A phone
 * that would render this at 12fps is better served by the static fallback —
 * a janky hero reads as worse engineering than no hero.
 */
export function useCanRender3D() {
  const reduced = usePrefersReducedMotion();
  const [capable, setCapable] = useState<boolean | null>(null);

  useEffect(() => {
    if (reduced) {
      setCapable(false);
      return;
    }
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl");
      const cores = navigator.hardwareConcurrency ?? 4;
      setCapable(Boolean(gl) && cores >= 4);
    } catch {
      setCapable(false);
    }
  }, [reduced]);

  return capable;
}

/**
 * Adds `is-in` once the element scrolls into view, then stops observing.
 * One observer per element, unobserved on first hit — reveals should not cost
 * anything after they have fired.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  options?: IntersectionObserverInit
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!("IntersectionObserver" in window)) {
      el.classList.add("is-in");
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-in");
          io.unobserve(el);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px", ...options }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [options]);

  return ref;
}

/** Tracks which section id is currently in view, for the side rail. */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!sections.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { threshold: [0.15, 0.5], rootMargin: "-20% 0px -55% 0px" }
    );

    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [ids]);

  return active;
}

/** Raw scroll progress 0→1 down the document, for the top progress bar. */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const max = document.body.scrollHeight - window.innerHeight;
        setProgress(max > 0 ? window.scrollY / max : 0);
        frame = 0;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return progress;
}
