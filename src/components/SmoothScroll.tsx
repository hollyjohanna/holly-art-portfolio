"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/** Seconds the page takes to "catch up" to wherever the wheel/trackpad is
 *  pushing it. This is the scroll speed cap: no matter how hard someone
 *  spins the wheel, the page can't outrun this — raise it to slow the whole
 *  site down further, lower it to speed things back up. */
const SCROLL_DURATION = 2.2;

/** How far a single wheel "tick" nudges the scroll target, before easing
 *  even applies. Kept below 1 so a fast flick doesn't fling the page miles
 *  ahead of what the duration above can smooth out. */
const WHEEL_MULTIPLIER = 0.7;

/** Slow, soft settle — no bounce, no linear feel. */
export function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

/** The live Lenis instance, so other components (e.g. BackToTop) can drive
 *  programmatic scrolls through it instead of calling window.scrollTo
 *  directly — a direct call would just get overwritten on the next frame by
 *  Lenis's own animation loop. Null when reduced-motion skipped Lenis
 *  entirely, or before/after the effect below has run. */
export const lenisRef: { current: Lenis | null } = { current: null };

export default function SmoothScroll() {
  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) return;

    const lenis = new Lenis({
      duration: SCROLL_DURATION,
      easing: easeOutCubic,
      wheelMultiplier: WHEEL_MULTIPLIER,
      // Leave touch scrolling native — smoothing it tends to feel laggy on
      // trackpads/phones, and the ask here is specifically about the wheel.
      syncTouch: false,
    });
    lenisRef.current = lenis;

    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return null;
}
