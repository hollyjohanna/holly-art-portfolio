"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Artwork } from "@/lib/artworks";

const EASE = [0.22, 1, 0.36, 1] as const;
const CONTROLS_HIDE_MS = 5000;

const slideVariants = {
  enter: (direction: number) => ({
    x: direction >= 0 ? "100%" : "-100%",
  }),
  center: {
    x: 0,
  },
  exit: (direction: number) => ({
    x: direction >= 0 ? "-100%" : "100%",
  }),
};

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
  const [imageIndex, setImageIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);
  const hideTimerRef = useRef<number | null>(null);

  useEffect(() => {
    setImageIndex(0);
    setSlideDirection(0);
  }, [activeId]);

  const goPrevArtwork = useCallback(() => {
    if (activeIndex < 0) return;
    const prevIndex = (activeIndex - 1 + artworks.length) % artworks.length;
    onNavigate(artworks[prevIndex].id);
  }, [activeIndex, artworks, onNavigate]);

  const goNextArtwork = useCallback(() => {
    if (activeIndex < 0) return;
    const nextIndex = (activeIndex + 1) % artworks.length;
    onNavigate(artworks[nextIndex].id);
  }, [activeIndex, artworks, onNavigate]);

  const goPrevImage = useCallback(() => {
    if (!artwork || artwork.images.length < 2) return;
    setSlideDirection(-1);
    setImageIndex((i) => (i - 1 + artwork.images.length) % artwork.images.length);
  }, [artwork]);

  const goNextImage = useCallback(() => {
    if (!artwork || artwork.images.length < 2) return;
    setSlideDirection(1);
    setImageIndex((i) => (i + 1) % artwork.images.length);
  }, [artwork]);

  const goToImage = useCallback(
    (nextIndex: number) => {
      if (!artwork || nextIndex === imageIndex) return;
      setSlideDirection(nextIndex > imageIndex ? 1 : -1);
      setImageIndex(nextIndex);
    },
    [artwork, imageIndex]
  );

  useEffect(() => {
    if (!artwork) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrevArtwork();
      if (e.key === "ArrowRight") goNextArtwork();
      if (e.key === "ArrowUp") goPrevImage();
      if (e.key === "ArrowDown") goNextImage();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [artwork, onClose, goPrevArtwork, goNextArtwork, goPrevImage, goNextImage]);

  const images = artwork?.images ?? [];
  const safeIndex = images.length ? Math.min(imageIndex, images.length - 1) : 0;
  const currentImage = images[safeIndex] ?? null;
  const hasMultiple = images.length > 1;

  const scheduleHide = useCallback(() => {
    if (hideTimerRef.current !== null) {
      window.clearTimeout(hideTimerRef.current);
    }
    hideTimerRef.current = window.setTimeout(() => {
      setControlsVisible(false);
      hideTimerRef.current = null;
    }, CONTROLS_HIDE_MS);
  }, []);

  const revealControls = useCallback(() => {
    if (!hasMultiple) return;
    setControlsVisible(true);
    scheduleHide();
  }, [hasMultiple, scheduleHide]);

  // Fresh reveal + idle countdown whenever the open photo changes.
  useEffect(() => {
    if (!hasMultiple) return;
    setControlsVisible(true);
    scheduleHide();
    return () => {
      if (hideTimerRef.current !== null) {
        window.clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
    };
  }, [safeIndex, activeId, hasMultiple, scheduleHide]);

  return (
    <AnimatePresence>
      {artwork && currentImage && (
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
            className="relative flex w-full md:w-auto max-w-6xl flex-col md:flex-row md:items-stretch gap-4 md:gap-0"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute -top-3 -right-3 md:-top-4 md:-right-4 z-10 flex h-9 w-9 items-center justify-center border-hairline bg-cream text-base text-ink/70 shadow-soft transition-colors duration-300 hover:bg-rose/25 hover:text-ink active:translate-y-[1px]"
            >
              ×
            </button>

            <div
              key={artwork.id}
              className="relative min-w-0 self-center overflow-hidden border-hairline bg-cream shadow-soft-lg md:self-stretch"
              onMouseMove={revealControls}
              onMouseEnter={revealControls}
            >
              {/* Invisible sizer keeps the frame stable while slides crossfade/slide. */}
              <img
                src={currentImage.src}
                alt=""
                aria-hidden
                className="pointer-events-none block max-h-[50vh] w-auto max-w-full opacity-0 md:max-h-[85vh]"
              />

              <AnimatePresence initial={false} custom={slideDirection}>
                <motion.img
                  key={`${artwork.id}-${safeIndex}`}
                  layoutId={safeIndex === 0 ? `art-image-${artwork.id}` : undefined}
                  custom={slideDirection}
                  variants={slideVariants}
                  initial={slideDirection === 0 ? false : "enter"}
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: EASE }}
                  src={currentImage.src}
                  alt={`${artwork.title}${hasMultiple ? ` — photo ${safeIndex + 1}` : ""}`}
                  className="absolute inset-0 h-full w-full object-contain"
                />
              </AnimatePresence>

              {hasMultiple && (
                <motion.div
                  initial={false}
                  animate={{ opacity: controlsVisible ? 1 : 0 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="absolute inset-0 z-10"
                  style={{ pointerEvents: controlsVisible ? "auto" : "none" }}
                >
                  <button
                    type="button"
                    onClick={goPrevImage}
                    aria-label="Previous photo of this piece"
                    tabIndex={controlsVisible ? 0 : -1}
                    className="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border-hairline bg-cream/90 text-ink/70 shadow-soft transition-colors duration-300 hover:bg-cream hover:text-ink"
                  >
                    <ChevronLeft />
                  </button>
                  <button
                    type="button"
                    onClick={goNextImage}
                    aria-label="Next photo of this piece"
                    tabIndex={controlsVisible ? 0 : -1}
                    className="absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border-hairline bg-cream/90 text-ink/70 shadow-soft transition-colors duration-300 hover:bg-cream hover:text-ink"
                  >
                    <ChevronRight />
                  </button>

                  <div
                    className="absolute inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-ink/50 to-transparent px-4 pb-3.5 pt-10"
                    role="tablist"
                    aria-label="Photos of this piece"
                  >
                    <div className="flex items-center gap-2">
                      {images.map((image, i) => (
                        <button
                          key={image.src}
                          type="button"
                          role="tab"
                          aria-selected={i === safeIndex}
                          aria-label={`Photo ${i + 1} of ${images.length}`}
                          tabIndex={controlsVisible ? 0 : -1}
                          onClick={() => goToImage(i)}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            i === safeIndex
                              ? "w-5 bg-cream"
                              : "w-1.5 bg-cream/45 hover:bg-cream/75"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={artwork.id}
                initial={{ x: 32, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 16, opacity: 0 }}
                transition={{ duration: 0.35, ease: EASE, delay: 0.08 }}
                className="flex w-full md:-ml-px md:w-80 flex-shrink-0 flex-col gap-3.5 border-hairline bg-cream p-6 shadow-soft-lg md:min-h-0"
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
                  {artwork.year || "[Year]"} &middot; {artwork.medium}
                </div>
                <div className="text-xs text-ink/45">{artwork.dimensions}</div>
                <p className="text-[13px] leading-relaxed text-ink/65">
                  {artwork.description}
                </p>
                <div className="mt-auto flex gap-6 border-t border-rule pt-4">
                  <button
                    type="button"
                    onClick={goPrevArtwork}
                    className="label text-ink/50 transition-colors duration-300 hover:text-ink"
                  >
                    Prev work
                  </button>
                  <button
                    type="button"
                    onClick={goNextArtwork}
                    className="label text-ink/50 transition-colors duration-300 hover:text-ink"
                  >
                    Next work
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
