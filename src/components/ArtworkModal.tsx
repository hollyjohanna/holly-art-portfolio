"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import type { CSSProperties } from "react";
import type { Artwork, ArtworkImage } from "@/lib/artworks";
import { areImagesReady, markImageReady, preloadImages } from "@/lib/preload";

const EASE = [0.22, 1, 0.36, 1] as const;
// Long, soft deceleration for the open: fast off the mark, settles gently.
const EASE_OPEN = [0.16, 1, 0.3, 1] as const;
// Quick, even exit so closing never feels sluggish.
const EASE_CLOSE = [0.4, 0, 0.2, 1] as const;
const CONTROLS_HIDE_MS = 5000;
const SLIDE_MS = 0.45;

const BACKDROP_BLUR = 14;
const BACKDROP_TINT = "rgba(20, 9, 29, 0.55)";

// Animating the blur radius and tint directly (instead of fading an
// already-blurred layer's opacity) is what keeps the backdrop from popping.
const backdropVariants = {
  hidden: {
    backgroundColor: "rgba(20, 9, 29, 0)",
    backdropFilter: "blur(0px)",
    WebkitBackdropFilter: "blur(0px)",
    transition: { duration: 0.4, ease: EASE_CLOSE },
  },
  shown: {
    backgroundColor: BACKDROP_TINT,
    backdropFilter: `blur(${BACKDROP_BLUR}px)`,
    WebkitBackdropFilter: `blur(${BACKDROP_BLUR}px)`,
    transition: { duration: 0.6, ease: EASE_OPEN },
  },
};

const contentVariants = {
  enter: { opacity: 0, y: 36, scale: 0.94 },
  hidden: {
    opacity: 0,
    y: 14,
    scale: 0.985,
    transition: { duration: 0.3, ease: EASE_CLOSE },
  },
  shown: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.75, ease: EASE_OPEN, delay: 0.06 },
  },
};

const panelVariants = {
  hidden: { opacity: 0, y: 12 },
  shown: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_OPEN, delay: 0.24 },
  },
};

const closeButtonVariants = {
  hidden: { opacity: 0, scale: 0.85, transition: { duration: 0.2, ease: EASE_CLOSE } },
  shown: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.45, ease: EASE_OPEN, delay: 0.35 },
  },
};

// Work-to-work is a fade-through: the old piece drifts out, then the new one
// drifts in. Nothing is on screen while the frame changes shape, so a
// portrait-to-landscape switch never visibly snaps.
const WORK_SHIFT_PX = 28;

const artworkSlideVariants = {
  enter: (direction: number) => ({
    x: direction === 0 ? 0 : direction > 0 ? WORK_SHIFT_PX : -WORK_SHIFT_PX,
    opacity: direction === 0 ? 1 : 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: EASE_OPEN },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -WORK_SHIFT_PX : WORK_SHIFT_PX,
    opacity: 0,
    transition: { duration: 0.2, ease: [0.4, 0, 1, 1] as const },
  }),
};

const CLOSE_BUTTON_CLASS =
  "z-30 items-center justify-center border-hairline bg-cream text-base text-ink/70 shadow-soft transition-colors duration-300 hover:bg-rose/25 hover:text-ink active:translate-y-[1px]";

export default function ArtworkModal({
  artworks,
  activeId,
  coverSrcs,
  onClose,
  onNavigate,
}: {
  artworks: Artwork[];
  activeId: string | null;
  /** Already-decoded gallery cover URLs, shown while full-res photos load. */
  coverSrcs: Record<string, string>;
  onClose: () => void;
  onNavigate: (id: string) => void;
}) {
  const activeIndex = artworks.findIndex((a) => a.id === activeId);
  const artwork = activeIndex >= 0 ? artworks[activeIndex] : null;

  const [artworkDirection, setArtworkDirection] = useState(0);
  const [switchingArtwork, setSwitchingArtwork] = useState(false);
  // Scrollbars stay hidden while things are moving, so a transform never
  // flashes one in for a frame or two.
  const [settling, setSettling] = useState(true);
  const isSwitchingArtworkRef = useRef(false);

  // Reset so the next open plays the full entrance rather than a slide.
  const close = useCallback(() => {
    setArtworkDirection(0);
    onClose();
  }, [onClose]);

  // Warm this piece's photos first, then its neighbours, so Prev/Next is instant.
  useEffect(() => {
    if (activeIndex < 0) return;
    const current = artworks[activeIndex];
    const neighbours = [
      artworks[(activeIndex - 1 + artworks.length) % artworks.length],
      artworks[(activeIndex + 1) % artworks.length],
    ];
    void preloadImages(current.images.map((img) => img.src)).then(() =>
      preloadImages(
        neighbours.flatMap((piece) => piece.images.map((img) => img.src))
      )
    );
  }, [activeIndex, artworks]);

  const goToArtwork = useCallback(
    async (direction: 1 | -1) => {
      if (activeIndex < 0 || isSwitchingArtworkRef.current) return;
      isSwitchingArtworkRef.current = true;
      setSwitchingArtwork(true);
      const nextIndex =
        (activeIndex + direction + artworks.length) % artworks.length;
      const next = artworks[nextIndex];
      await preloadImages(next.images.map((image) => image.src));
      setArtworkDirection(direction);
      onNavigate(next.id);
      isSwitchingArtworkRef.current = false;
      setSwitchingArtwork(false);
    },
    [activeIndex, artworks, onNavigate]
  );

  const goPrevArtwork = useCallback(() => goToArtwork(-1), [goToArtwork]);
  const goNextArtwork = useCallback(() => goToArtwork(1), [goToArtwork]);

  useEffect(() => {
    if (!artwork) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") void goPrevArtwork();
      if (e.key === "ArrowRight") void goNextArtwork();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [artwork, close, goPrevArtwork, goNextArtwork]);

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {artwork && (
          <motion.div
            key="artwork-modal"
            className="fixed inset-0 z-[100]"
            initial="hidden"
            animate="shown"
            exit="hidden"
          >
            <motion.div
              aria-hidden
              variants={backdropVariants}
              className="absolute inset-0"
            />

            <div
              onClick={close}
              data-lenis-prevent
              className={`absolute inset-0 overflow-x-hidden overscroll-contain ${
                settling ? "overflow-y-hidden" : "overflow-y-auto"
              }`}
            >
              <div className="flex min-h-full items-center justify-center p-4 py-10 sm:p-8">
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="relative w-full md:w-auto max-w-6xl"
                >
                  {/* Mobile: pinned to the screen corner. */}
                  <motion.button
                    type="button"
                    variants={closeButtonVariants}
                    onClick={close}
                    aria-label="Close"
                    className={`fixed top-3 right-3 flex h-10 w-10 md:hidden ${CLOSE_BUTTON_CLASS}`}
                  >
                    ×
                  </motion.button>

                  <motion.div
                    variants={contentVariants}
                    initial="enter"
                    animate="shown"
                    exit="hidden"
                    onAnimationStart={() => setSettling(true)}
                    onAnimationComplete={() => setSettling(false)}
                  >
                    <AnimatePresence mode="wait" custom={artworkDirection} initial={false}>
                      <motion.div
                        key={artwork.id}
                        custom={artworkDirection}
                        variants={artworkSlideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        onAnimationStart={() => setSettling(true)}
                        onAnimationComplete={() => setSettling(false)}
                        className="relative flex w-full flex-col md:flex-row md:items-stretch gap-4 md:gap-0"
                      >
                        {/* Desktop: rides along with the piece so it always
                            sits on the current frame's corner. */}
                        <motion.button
                          type="button"
                          initial={
                            artworkDirection === 0
                              ? closeButtonVariants.hidden
                              : false
                          }
                          animate={closeButtonVariants.shown}
                          onClick={close}
                          aria-label="Close"
                          className={`absolute -top-4 -right-4 hidden h-9 w-9 md:flex ${CLOSE_BUTTON_CLASS}`}
                        >
                          ×
                        </motion.button>

                        <ArtworkPhotoStage
                          key={artwork.id}
                          artwork={artwork}
                          coverSrc={coverSrcs[artwork.id]}
                        />

                        <div className="flex w-full md:w-96 flex-shrink-0 flex-col border-hairline bg-cream p-6 shadow-soft-lg md:min-h-0">
                          <motion.div
                            variants={panelVariants}
                            initial={artworkDirection === 0 ? "hidden" : false}
                            animate="shown"
                            className="flex flex-1 flex-col gap-3.5"
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
                            {artwork.price != null ? (
                              <div className="text-xs text-ink/45">
                                ${artwork.price} - contact me to purchase
                              </div>
                            ) : null}
                            <div className="text-xs text-ink/45">{artwork.dimensions}</div>
                            <p className="whitespace-pre-line text-[13px] leading-relaxed text-ink/65">
                              {artwork.description}
                            </p>
                            <div className="mt-auto flex items-center gap-6 border-t border-rule pt-4">
                              <button
                                type="button"
                                onClick={() => {
                                  void goPrevArtwork();
                                }}
                                disabled={switchingArtwork}
                                className="label text-ink/50 transition-colors duration-300 hover:text-ink disabled:pointer-events-none disabled:opacity-40"
                              >
                                Prev work
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  void goNextArtwork();
                                }}
                                disabled={switchingArtwork}
                                className="label text-ink/50 transition-colors duration-300 hover:text-ink disabled:pointer-events-none disabled:opacity-40"
                              >
                                Next work
                              </button>
                              {switchingArtwork && (
                                <span
                                  aria-hidden
                                  className="h-3 w-3 flex-shrink-0 animate-spin rounded-full border border-ink/25 border-t-ink/60"
                                />
                              )}
                            </div>
                          </motion.div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}

function ArtworkPhotoStage({
  artwork,
  coverSrc,
}: {
  artwork: Artwork;
  coverSrc?: string;
}) {
  const images = artwork.images;
  const hasMultiple = images.length > 1;
  const [imageIndex, setImageIndex] = useState(0);
  const [trackIndex, setTrackIndex] = useState(hasMultiple ? 1 : 0);
  const [trackInstant, setTrackInstant] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const hideTimerRef = useRef<number | null>(null);
  const isAnimatingRef = useRef(false);

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
    if (!hasMultiple || isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    setTrackIndex((i) => i - 1);
  }, [hasMultiple]);

  const goNextImage = useCallback(() => {
    if (!hasMultiple || isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    setTrackIndex((i) => i + 1);
  }, [hasMultiple]);

  const goToImage = useCallback(
    (nextIndex: number) => {
      if (!hasMultiple || nextIndex === imageIndex || isAnimatingRef.current) return;
      isAnimatingRef.current = true;
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
      isAnimatingRef.current = false;
      return;
    }

    if (trackIndex === last + 1) {
      setTrackInstant(true);
      setTrackIndex(1);
      setImageIndex(0);
      isAnimatingRef.current = false;
      return;
    }

    if (trackIndex >= 1 && trackIndex <= last) {
      setImageIndex(trackIndex - 1);
    }
    isAnimatingRef.current = false;
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
    <div
      className="relative min-w-0 self-center overflow-hidden bg-cream shadow-soft-lg md:self-stretch"
      onMouseMove={revealControls}
      onMouseEnter={revealControls}
    >
      {/* Sizes the frame to the photo's proportions from its stored
          dimensions, so it has its final shape on the very first frame
          instead of snapping open once the photo downloads. */}
      <div
        aria-hidden
        className="pointer-events-none w-[min(var(--w),calc(var(--r)*42vh),calc(100vw_-_2rem))] md:w-[min(var(--w),calc(var(--r)*85vh),calc(100vw_-_4rem_-_24rem),48rem)]"
        style={
          {
            aspectRatio: `${currentImage.width} / ${currentImage.height}`,
            "--r": currentImage.width / currentImage.height,
            "--w": `${currentImage.width}px`,
          } as CSSProperties
        }
      />

      <div className="absolute inset-0 overflow-hidden">
        {hasMultiple ? (
          <motion.div
            className="flex h-full w-full"
            initial={false}
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
                <FadeInPhoto
                  image={image}
                  placeholderSrc={
                    image.src === images[0].src ? coverSrc : undefined
                  }
                  alt={
                    i === trackIndex
                      ? `${artwork.title}, photo ${imageIndex + 1}`
                      : ""
                  }
                />
              </div>
            ))}
          </motion.div>
        ) : (
          <FadeInPhoto
            image={currentImage}
            placeholderSrc={coverSrc}
            alt={artwork.title}
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
    </div>
  );
}

/**
 * Full-res photo that fades in over the (already decoded) gallery cover once
 * it's ready, so the modal never waits on a download and never pops.
 */
function FadeInPhoto({
  image,
  placeholderSrc,
  alt,
}: {
  image: ArtworkImage;
  placeholderSrc?: string;
  alt: string;
}) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [ready, setReady] = useState(() => areImagesReady([image.src]));

  useLayoutEffect(() => {
    const img = imgRef.current;
    if (!ready && img?.complete && img.naturalWidth > 0) setReady(true);
  }, [ready]);

  const onLoad = useCallback(() => {
    const img = imgRef.current;
    const decoded = img?.decode ? img.decode().catch(() => undefined) : Promise.resolve();
    void decoded.then(() => {
      markImageReady(image.src);
      setReady(true);
    });
  }, [image.src]);

  return (
    <div className="relative h-full w-full">
      {placeholderSrc && (
        <img
          src={placeholderSrc}
          alt=""
          aria-hidden
          draggable={false}
          className="absolute inset-0 h-full w-full object-contain"
        />
      )}
      <img
        ref={imgRef}
        src={image.src}
        alt={alt}
        width={image.width}
        height={image.height}
        draggable={false}
        decoding="async"
        onLoad={onLoad}
        className="relative h-full w-full object-contain transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ opacity: ready ? 1 : 0 }}
      />
    </div>
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
