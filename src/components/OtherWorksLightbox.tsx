"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { OtherWork } from "@/lib/otherWorks";

const EASE = [0.22, 1, 0.36, 1] as const;

const slideVariants = {
  enter: (direction: number) => ({
    x: direction === 0 ? 0 : direction > 0 ? "14%" : "-14%",
    opacity: direction === 0 ? 1 : 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? "-14%" : "14%",
    opacity: 0,
  }),
};

export default function OtherWorksLightbox({
  works,
  activeIndex,
  onClose,
  onNavigate,
}: {
  works: OtherWork[];
  activeIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  const [direction, setDirection] = useState(0);
  const work = activeIndex != null ? works[activeIndex] : null;

  const goPrev = useCallback(() => {
    if (activeIndex == null) return;
    setDirection(-1);
    onNavigate((activeIndex - 1 + works.length) % works.length);
  }, [activeIndex, works.length, onNavigate]);

  const goNext = useCallback(() => {
    if (activeIndex == null) return;
    setDirection(1);
    onNavigate((activeIndex + 1) % works.length);
  }, [activeIndex, works.length, onNavigate]);

  useEffect(() => {
    if (activeIndex == null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, onClose, goPrev, goNext]);

  return (
    <AnimatePresence>
      {work && activeIndex != null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: EASE }}
          onClick={onClose}
          data-lenis-prevent
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-ink/55 p-4 py-10 backdrop-blur-md sm:p-8"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="fixed top-3 right-3 z-30 flex h-10 w-10 items-center justify-center border-hairline bg-cream text-base text-ink/70 shadow-soft transition-colors duration-300 hover:bg-rose/25 hover:text-ink active:translate-y-[1px]"
          >
            ×
          </button>

          <div className="fixed top-4 left-4 z-30 flex flex-col gap-1">
            <p className="label text-cream/80">
              {activeIndex + 1} / {works.length}
            </p>
            <p className="font-display text-sm text-cream/95">{work.title}</p>
            <p className="label text-cream/55">
              {work.availableForPrint
                ? "Available for print"
                : "Not available for print"}
            </p>
          </div>

          {works.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
                aria-label="Previous work"
                className="fixed left-2 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border-hairline bg-cream/90 text-ink/70 shadow-soft transition-colors duration-300 hover:bg-cream hover:text-ink sm:left-4"
              >
                <ChevronLeft />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                aria-label="Next work"
                className="fixed right-2 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border-hairline bg-cream/90 text-ink/70 shadow-soft transition-colors duration-300 hover:bg-cream hover:text-ink sm:right-4"
              >
                <ChevronRight />
              </button>
            </>
          )}

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[85vh] max-w-[92vw] overflow-hidden"
          >
            <AnimatePresence mode="popLayout" custom={direction} initial={false}>
              <motion.img
                key={work.id}
                src={work.src}
                alt={work.title}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: EASE }}
                width={work.width}
                height={work.height}
                draggable={false}
                decoding="sync"
                className="max-h-[85vh] max-w-[92vw] object-contain shadow-soft-lg"
              />
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ChevronLeft() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M8.5 2.5L4 7l4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M5.5 2.5L10 7l-4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
