"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { easeOutCubic, lenisRef } from "@/components/SmoothScroll";

/** How far down the page (px) before the button appears. A small buffer
 *  above 0 keeps it from flickering during mobile Safari's elastic
 *  overscroll bounce at rest. */
const SHOW_AFTER_PX = 40;

/** Seconds for the scroll-to-top animation — deliberately faster than
 *  SCROLL_DURATION in SmoothScroll.tsx. Someone clicking "back to top"
 *  already knows where they're going, so it shouldn't crawl back up at the
 *  same capped pace as incidental wheel scrolling. Tune this on its own. */
const RETURN_DURATION = 0.7;

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      setVisible(window.scrollY > SHOW_AFTER_PX);
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(0, { duration: RETURN_DURATION, easing: easeOutCubic });
    } else {
      // Reduced-motion visitors never get a Lenis instance — jump instantly.
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={scrollToTop}
          aria-label="Back to top"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          whileTap={{ scale: 0.94 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-5 right-5 z-40 flex h-11 w-11 items-center justify-center border-hairline bg-cream text-lg text-ink/70 shadow-soft transition-colors duration-300 hover:bg-rose/25 hover:text-ink active:translate-y-[1px] sm:bottom-7 sm:right-7"
        >
          ↑
        </motion.button>
      )}
    </AnimatePresence>
  );
}
