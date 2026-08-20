"use client";

import { useEffect, useRef } from "react";

/** How far the item rises while scrubbing in (CSS rem) — kept in sync with
 *  the fallback value in globals.css's `.gallery-reveal` for the
 *  pre-hydration state. */
const RISE_REM = 14;

/** Fraction of viewport height where the scrub starts (item's top just
 *  below the fold) and ends (item's top has nearly scrolled past the top
 *  edge). Widening this — and pushing the end past 0 — keeps the motion
 *  visible for most of the time the item is actually on screen, instead of
 *  finishing while it's still low in the viewport. */
const SCRUB_START_VH = 1;
const SCRUB_END_VH = -0.05;

/** Fast at the start, gently settling into place — no linear/bouncy feel. */
function easeOutQuart(t: number) {
  const clamped = Math.min(1, Math.max(0, t));
  return 1 - Math.pow(1 - clamped, 4);
}

/**
 * Scroll-scrubbed fade-up reveal shared by every gallery-style grid on the
 * site (Works, Other Works, Featured Other Works), so cards animate in with
 * identical weight everywhere rather than each grid rolling its own
 * (weaker) version.
 */
export default function RevealItem({
  ready,
  children,
  className = "",
}: {
  ready: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  /** Items already sitting in the viewport the moment we go "ready" (i.e.
   *  before the user has scrolled at all) never scrub — they're just there,
   *  fully loaded, like the rest of the page. */
  const preRevealedRef = useRef(false);
  const firstRunRef = useRef(true);

  useEffect(() => {
    if (!ready) return;
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    const apply = (progress: number) => {
      const p = Math.min(1, Math.max(0, progress));
      inner.style.opacity = String(p);
      inner.style.transform = `translate3d(0, ${(1 - p) * RISE_REM}rem, 0)`;
    };

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) {
      apply(1);
      return;
    }

    const update = () => {
      const rect = outer.getBoundingClientRect();
      const vh = window.innerHeight;

      // First frame after "ready": anything already on screen (the initial
      // handful of items) snaps straight to fully loaded — no fade, no
      // rise — and stays exempt permanently, even if scrolled out of view
      // and back. Only items below the fold get the scroll-scrubbed reveal.
      if (firstRunRef.current) {
        firstRunRef.current = false;
        if (rect.top < vh) {
          preRevealedRef.current = true;
          apply(1);
          return;
        }
      }

      if (preRevealedRef.current) {
        apply(1);
        return;
      }

      // No permanent lock: progress tracks the item's position on every
      // frame, so scrolling back up fades it back out at the same pace it
      // faded in, exactly mirroring the reveal.
      if (rect.top >= vh) {
        apply(0);
        return;
      }

      if (rect.bottom <= 0) {
        apply(1);
        return;
      }

      const start = vh * SCRUB_START_VH;
      const end = vh * SCRUB_END_VH;
      let progress = (start - rect.top) / (start - end);
      progress = Math.min(1, Math.max(0, progress));

      apply(easeOutQuart(progress));
    };

    let ticking = false;
    const onScrollOrResize = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    };

    update();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [ready]);

  return (
    <div ref={outerRef} className={className}>
      <div ref={innerRef} className="gallery-reveal">
        {children}
      </div>
    </div>
  );
}
