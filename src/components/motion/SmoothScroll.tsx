"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Lenis smooth scroll, driven by GSAP's ticker.
 *
 * Two things matter here and both are easy to get wrong:
 *
 * 1. Lenis and ScrollTrigger must share one clock. If Lenis runs its own rAF
 *    loop, ScrollTrigger reads stale scroll positions and pinned sections
 *    judder. Driving Lenis from gsap.ticker keeps them on the same frame.
 *
 * 2. Smooth scroll is motion. Under prefers-reduced-motion it is not started
 *    at all — hijacking the scroll wheel is exactly what that setting asks us
 *    not to do.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.1,
      // Gentle exponential ease-out; anything springier fights the scroll wheel.
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Never smooth touch — it breaks momentum scrolling expectations on iOS.
      syncTouch: false,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000); // gsap passes seconds
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return null;
}
