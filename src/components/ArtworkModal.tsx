"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Artwork, ArtworkImage } from "@/lib/artworks";
import { areImagesReady, preloadImages } from "@/lib/preload";

const EASE = [0.22, 1, 0.36, 1] as const;
const CONTROLS_HIDE_MS = 5000;
const SLIDE_MS = 0.45;
const OPEN_MS = 0.55;

const artworkSlideVariants = {
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

  const [artworkDirection, setArtworkDirection] = useState(0);
  const [sharedElement, setSharedElement] = useState(true);
  const [photosReady, setPhotosReady] = useState(false);
  const wasOpenRef = useRef(false);
  const closeAfterSharedRef = useRef(false);

  // Never morph/show the modal until this piece's full-res photos are decoded.
  useEffect(() => {
    if (!artwork) {
      setPhotosReady(false);
      return;
    }

    let cancelled = false;
    const srcs = artwork.images.map((image) => image.src);

    if (areImagesReady(srcs)) {
      setPhotosReady(true);
      return;
    }

    setPhotosReady(false);
    preloadImages(srcs).then(() => {
      if (!cancelled) setPhotosReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, [artwork]);

  useEffect(() => {
    if (!activeId) {
      wasOpenRef.current = false;
      setArtworkDirection(0);
      setSharedElement(true);
      return;
    }

    if (!photosReady) return;

    const justOpened = !wasOpenRef.current;
    wasOpenRef.current = true;

    if (justOpened) {
      setSharedElement(true);
      setArtworkDirection(0);
      const t = window.setTimeout(() => setSharedElement(false), OPEN_MS * 1000 + 40);
      return () => window.clearTimeout(t);
    }

    setSharedElement(false);
  }, [activeId, photosReady]);

  useEffect(() => {
    if (activeIndex < 0 || !photosReady) return;
    const neighbours = [
      artworks[activeIndex],
      artworks[(activeIndex - 1 + artworks.length) % artworks.length],
      artworks[(activeIndex + 1) % artworks.length],
    ];
    void preloadImages(
      neighbours.flatMap((piece) => piece.images.map((img) => img.src))
    );
  }, [activeIndex, artworks, photosReady]);

  const goPrevArtwork = useCallback(async () => {
    if (activeIndex < 0) return;
    setSharedElement(false);
    setArtworkDirection(-1);
    const prevIndex = (activeIndex - 1 + artworks.length) % artworks.length;
    const next = artworks[prevIndex];
    await preloadImages(next.images.map((image) => image.src));
    onNavigate(next.id);
  }, [activeIndex, artworks, onNavigate]);

  const goNextArtwork = useCallback(async () => {
    if (activeIndex < 0) return;
    setSharedElement(false);
    setArtworkDirection(1);
    const nextIndex = (activeIndex + 1) % artworks.length;
    const next = artworks[nextIndex];
    await preloadImages(next.images.map((image) => image.src));
    onNavigate(next.id);
  }, [activeIndex, artworks, onNavigate]);

  const requestClose = useCallback(() => {
    closeAfterSharedRef.current = true;
    setSharedElement(true);
  }, []);

  useEffect(() => {
    if (!sharedElement || !closeAfterSharedRef.current) return;
    closeAfterSharedRef.current = false;
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => onClose());
    });
    return () => cancelAnimationFrame(id);
  }, [sharedElement, onClose]);

  useEffect(() => {
    if (!artwork || !photosReady) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") requestClose();
      if (e.key === "ArrowLeft") void goPrevArtwork();
      if (e.key === "ArrowRight") void goNextArtwork();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [artwork, photosReady, requestClose, goPrevArtwork, goNextArtwork]);

  const frameLayoutId =
    artwork && sharedElement && photosReady
      ? `art-frame-${artwork.id}`
      : undefined;

  const showModal = Boolean(artwork && photosReady);

  return (
    <AnimatePresence>
      {showModal && artwork && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: EASE }}
          onClick={requestClose}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/55 backdrop-blur-md p-4 sm:p-8"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full md:w-auto max-w-6xl"
          >
            <button
              type="button"
              onClick={requestClose}
              aria-label="Close"
              className="absolute -top-3 -right-3 md:-top-4 md:-right-4 z-20 flex h-9 w-9 items-center justify-center border-hairline bg-cream text-base text-ink/70 shadow-soft transition-colors duration-300 hover:bg-rose/25 hover:text-ink active:translate-y-[1px]"
            >
              ×
            </button>

            <AnimatePresence mode="popLayout" custom={artworkDirection} initial={false}>
              <motion.div
                key={artwork.id}
                custom={artworkDirection}
                variants={artworkSlideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: EASE }}
                className="relative flex w-full flex-col md:flex-row md:items-stretch gap-4 md:gap-0"
              >
                <ArtworkPhotoStage
                  artwork={artwork}
                  layoutId={frameLayoutId}
                />

                <div className="flex w-full md:-ml-px md:w-80 flex-shrink-0 flex-col gap-3.5 border-hairline bg-cream p-6 shadow-soft-lg md:min-h-0">
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
                      onClick={() => {
                        void goPrevArtwork();
                      }}
                      className="label text-ink/50 transition-colors duration-300 hover:text-ink"
                    >
                      Prev work
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        void goNextArtwork();
                      }}
                      className="label text-ink/50 transition-colors duration-300 hover:text-ink"
                    >
                      Next work
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ArtworkPhotoStage({
  artwork,
  layoutId,
}: {
  artwork: Artwork;
  layoutId?: string;
}) {
  const images = artwork.images;
  const hasMultiple = images.length > 1;
  const [imageIndex, setImageIndex] = useState(0);
  const [trackIndex, setTrackIndex] = useState(hasMultiple ? 1 : 0);
  const [trackInstant, setTrackInstant] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const hideTimerRef = useRef<number | null>(null);

  const trackSlides = hasMultiple
    ? [images[images.length - 1], ...images, images[0]]
    : images;
  const currentImage: ArtworkImage | null =
    images[Math.min(imageIndex, Math.max(images.length - 1, 0))] ?? null;

  useLayoutEffect(() => {
    if (!trackInstant) return;
    const id = requestAnimationFrame(() => setTrackInstant(false));
    return () => cancelAnimationFrame(id);
  }, [trackInstant, trackIndex]);

  const goPrevImage = useCallback(() => {
    if (!hasMultiple) return;
    setTrackIndex((i) => i - 1);
  }, [hasMultiple]);

  const goNextImage = useCallback(() => {
    if (!hasMultiple) return;
    setTrackIndex((i) => i + 1);
  }, [hasMultiple]);

  const goToImage = useCallback(
    (nextIndex: number) => {
      if (!hasMultiple || nextIndex === imageIndex) return;
      setTrackIndex(nextIndex + 1);
    },
    [hasMultiple, imageIndex]
  );

  const onTrackAnimationComplete = useCallback(() => {
    if (!hasMultiple || trackInstant) return;
    const last = images.length;

    if (trackIndex === 0) {
      setTrackInstant(true);
      setTrackIndex(last);
      setImageIndex(last - 1);
      return;
    }

    if (trackIndex === last + 1) {
      setTrackInstant(true);
      setTrackIndex(1);
      setImageIndex(0);
      return;
    }

    if (trackIndex >= 1 && trackIndex <= last) {
      setImageIndex(trackIndex - 1);
    }
  }, [hasMultiple, images.length, trackIndex, trackInstant]);

  useEffect(() => {
    if (!hasMultiple) {
      setImageIndex(0);
      return;
    }
    if (trackIndex >= 1 && trackIndex <= images.length) {
      setImageIndex(trackIndex - 1);
    }
  }, [trackIndex, hasMultiple, images.length]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        goPrevImage();
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        goNextImage();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goPrevImage, goNextImage]);

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
  }, [imageIndex, hasMultiple, scheduleHide]);

  if (!currentImage) return null;

  return (
    <motion.div
      layoutId={layoutId}
      transition={{ duration: OPEN_MS, ease: EASE }}
      className="relative min-w-0 self-center overflow-hidden border-hairline bg-cream shadow-soft-lg md:self-stretch"
      onMouseMove={revealControls}
      onMouseEnter={revealControls}
    >
      {/* Preloaded sizer — same bytes as the visible photo, so the frame
          has its final size before the open morph runs. */}
      <img
        src={currentImage.src}
        alt=""
        aria-hidden
        width={currentImage.width}
        height={currentImage.height}
        decoding="sync"
        className="pointer-events-none block max-h-[50vh] w-auto max-w-full opacity-0 md:max-h-[85vh]"
      />

      <div className="absolute inset-0 overflow-hidden">
        {hasMultiple ? (
          <motion.div
            className="flex h-full w-full"
            animate={{ x: `${-trackIndex * 100}%` }}
            transition={
              trackInstant
                ? { duration: 0 }
                : { duration: SLIDE_MS, ease: EASE }
            }
            onAnimationComplete={onTrackAnimationComplete}
          >
            {trackSlides.map((image, i) => (
              <div
                key={`${image.src}-${i}`}
                className="relative flex h-full w-full min-w-full flex-shrink-0 items-center justify-center"
              >
                <img
                  src={image.src}
                  alt={
                    i === trackIndex
                      ? `${artwork.title} — photo ${imageIndex + 1}`
                      : ""
                  }
                  width={image.width}
                  height={image.height}
                  draggable={false}
                  decoding="sync"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            ))}
          </motion.div>
        ) : (
          <img
            src={currentImage.src}
            alt={artwork.title}
            width={currentImage.width}
            height={currentImage.height}
            draggable={false}
            decoding="sync"
            className="h-full w-full object-contain"
          />
        )}
      </div>

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
                  aria-selected={i === imageIndex}
                  aria-label={`Photo ${i + 1} of ${images.length}`}
                  tabIndex={controlsVisible ? 0 : -1}
                  onClick={() => goToImage(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === imageIndex
                      ? "w-5 bg-cream"
                      : "w-1.5 bg-cream/45 hover:bg-cream/75"
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
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
