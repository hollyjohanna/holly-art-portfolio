"use client";

import { useEffect } from "react";

/** Fades the CSS scroll-driven scrollbar in while scrolling, out when idle.
 *  Does not control scroll position — that stays fully native. */
const IDLE_MS = 1100;

export default function ScrollbarActivity() {
  useEffect(() => {
    const root = document.documentElement;
    let idleTimer = 0;
    let raf = 0;

    const hide = () => {
      root.classList.remove("scrollbar-active");
    };

    const show = () => {
      root.classList.add("scrollbar-active");
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(hide, IDLE_MS);
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        show();
      });
    };

    hide();
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("scroll", onScroll, {
      passive: true,
      capture: true,
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("scroll", onScroll, true);
      window.clearTimeout(idleTimer);
      if (raf) cancelAnimationFrame(raf);
      root.classList.remove("scrollbar-active");
    };
  }, []);

  return (
    <div className="scroll-indicator" aria-hidden>
      <div className="scroll-indicator-thumb" />
    </div>
  );
}
