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
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/55 backdrop-blur-md p-4 sm:p-8"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex w-full md:w-auto max-w-6xl max-h-[92vh] flex-col md:flex-row items-center md:items-stretch gap-4 md:gap-0"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute -top-3 -right-3 md:-top-4 md:-right-4 z-10 flex h-9 w-9 items-center justify-center border-hairline bg-cream text-base text-ink/70 shadow-soft transition-colors duration-300 hover:bg-rose/25 hover:text-ink active:translate-y-[1px]"
            >
              ×
            </button>

            <div className="flex min-h-0 min-w-0 items-center justify-center">
              <motion.img
                layoutId={`art-image-${artwork.id}`}
                transition={{ duration: 0.45, ease: EASE }}
                src={artwork.src}
                alt={artwork.title}
                className="max-h-[50vh] md:max-h-[80vh] w-auto max-w-full border-hairline bg-cream object-contain shadow-soft-lg"
              />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={artwork.id}
                initial={{ x: 32, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 16, opacity: 0 }}
                transition={{ duration: 0.35, ease: EASE, delay: 0.08 }}
                className="flex w-full md:-ml-px md:w-80 flex-shrink-0 flex-col gap-3.5 border-hairline bg-cream p-6 shadow-soft-lg"
              >
                <div>
                  <p className="label text-ink/35">
                    {activeIndex + 1} / {artworks.length}
                  </p>
                  <h2 className="mt-2 font-display text-xl leading-snug">
                    {artwork.title}
                  </h2>
                </div>
                <div className="label text-ink/45">
                  {artwork.year} &middot; {artwork.medium}
                </div>
                <div className="text-xs text-ink/45">{artwork.dimensions}</div>
                <p className="text-[13px] leading-relaxed text-ink/65">
                  {artwork.description}
                </p>
                <div className="mt-auto flex gap-6 border-t border-rule pt-4">
                  <button
                    type="button"
                    onClick={goPrev}
                    className="label text-ink/50 transition-colors duration-300 hover:text-ink"
                  >
                    Prev
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    className="label text-ink/50 transition-colors duration-300 hover:text-ink"
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
