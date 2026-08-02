"use client";

import { useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Artwork } from "@/lib/artworks";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function ArtworkModal({
  artworks,
  activeId,
  onClose,
  onNavigate,
}: {
  artworks: Artwork[];
  activeId: string | null;
  onClose: () => void;
  onNavigate: (id: string) => void;
}) {
  const activeIndex = artworks.findIndex((a) => a.id === activeId);
  const artwork = activeIndex >= 0 ? artworks[activeIndex] : null;

  const goPrev = useCallback(() => {
    if (activeIndex < 0) return;
    const prevIndex = (activeIndex - 1 + artworks.length) % artworks.length;
    onNavigate(artworks[prevIndex].id);
  }, [activeIndex, artworks, onNavigate]);

  const goNext = useCallback(() => {
    if (activeIndex < 0) return;
    const nextIndex = (activeIndex + 1) % artworks.length;
    onNavigate(artworks[nextIndex].id);
  }, [activeIndex, artworks, onNavigate]);

  useEffect(() => {
    if (!artwork) return;

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
  }, [artwork, onClose, goPrev, goNext]);

  return (
    <AnimatePresence>
      {artwork && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/70 backdrop-blur-md p-4 sm:p-8"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex w-full max-w-6xl max-h-[92vh] flex-col md:flex-row items-stretch gap-4 md:gap-0"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute -top-3 -right-3 md:-top-4 md:-right-4 z-10 flex h-10 w-10 items-center justify-center border-brutal bg-cream text-lg font-semibold text-ink transition-colors duration-300 hover:bg-rose active:translate-y-[1px]"
            >
              ×
            </button>

            <div className="relative flex flex-1 items-center justify-center min-h-0 min-w-0">
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous piece"
                className="absolute left-2 sm:-left-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border-brutal bg-cream text-ink transition-colors duration-300 hover:bg-gold active:translate-y-[1px]"
              >
                ←
              </button>

              <motion.img
                layoutId={`art-image-${artwork.id}`}
                transition={{ duration: 0.45, ease: EASE }}
                src={artwork.src}
                alt={artwork.title}
                className="max-h-[50vh] md:max-h-[80vh] w-auto max-w-full border-brutal bg-cream object-contain shadow-brutal-lg"
              />

              <button
                type="button"
                onClick={goNext}
                aria-label="Next piece"
                className="absolute right-2 sm:-right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border-brutal bg-cream text-ink transition-colors duration-300 hover:bg-gold active:translate-y-[1px]"
              >
                →
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={artwork.id}
                initial={{ x: 32, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 16, opacity: 0 }}
                transition={{ duration: 0.35, ease: EASE, delay: 0.08 }}
                className="flex w-full md:w-80 flex-shrink-0 flex-col gap-4 border-brutal bg-cream p-6 shadow-brutal md:ml-8"
              >
                <div>
                  <p className="text-xs uppercase tracking-wide text-ink/40">
                    {activeIndex + 1} / {artworks.length}
                  </p>
                  <h2 className="mt-1 font-display text-2xl leading-tight">
                    {artwork.title}
                  </h2>
                </div>
                <div className="text-sm uppercase tracking-wide text-ink/60">
                  {artwork.year} &middot; {artwork.medium}
                </div>
                <div className="text-sm text-ink/60">{artwork.dimensions}</div>
                <p className="text-sm leading-relaxed text-ink/80">
                  {artwork.description}
                </p>
                <div className="mt-auto flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={goPrev}
                    className="flex-1 border-brutal bg-cream px-4 py-2 text-sm font-semibold uppercase tracking-wide transition-colors duration-300 hover:bg-blue active:translate-y-[1px]"
                  >
                    Prev
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    className="flex-1 border-brutal bg-cream px-4 py-2 text-sm font-semibold uppercase tracking-wide transition-colors duration-300 hover:bg-blue active:translate-y-[1px]"
                  >
                    Next
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
