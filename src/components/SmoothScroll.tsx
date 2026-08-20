"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();

  // Lenis auto-resizes via a ResizeObserver on <html>, but <html> is pinned
  // to the viewport height (Tailwind's h-full), so that box never actually
  // resizes when a client-side route swap changes body content height —
  // e.g. leaving a short page (About/Contact) for the tall Works gallery.
  // Lenis then keeps clamping scroll to the old page's height until a full
  // reload re-measures from scratch. Force a fresh measurement on every
  // navigation instead of waiting for a resize that will never come.
  useEffect(() => {
    lenisRef.current?.resize();
  }, [pathname]);

  // The browser's native scroll restoration remembers where each page was
  // scrolled to and replays it on reload — e.g. reloading halfway down Works
  // drops you back halfway down instead of at the top. Opt out so every
  // reload starts fresh at the top like a normal first visit.
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

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

    // Same story as the pathname effect above, but for content that grows or
    // shrinks without a navigation — e.g. a form validation error appearing
    // below a field. <html> never resizes, so Lenis's cached scroll height
    // goes stale and clamps scrolling to wherever the page used to end.
    // Watch body directly so any in-place height change re-measures.
    const resizeObserver = new ResizeObserver(() => lenis.resize());
    resizeObserver.observe(document.body);

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return null;
}
