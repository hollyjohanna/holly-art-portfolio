"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Artwork } from "@/lib/artworks";
import ArtworkCard from "@/components/ArtworkCard";
import ArtworkModal from "@/components/ArtworkModal";
import { useLoadingGate } from "@/components/LoadingGate";
import { preloadImages } from "@/lib/preload";

/** How far the card rises while scrubbing in (CSS rem) — kept in sync with
 *  the fallback value in globals.css for the pre-hydration state. Bumped up
 *  from 9 so the reveal reads clearly even at a glance, now that SmoothScroll
 *  (see SmoothScroll.tsx) caps how fast the page can move underneath it. */
const RISE_REM = 14;

/** Fraction of viewport height where the scrub starts (card's top just
 *  below the fold) and ends (card's top has nearly scrolled past the top
 *  edge). Widening this — and pushing the end past 0 — keeps the motion
 *  visible for most of the time the card is actually on screen, instead of
 *  finishing while it's still low in the viewport. */
const SCRUB_START_VH = 1;
const SCRUB_END_VH = -0.05;

/** Fast at the start, gently settling into place — no linear/bouncy feel. */
function easeOutQuart(t: number) {
  const clamped = Math.min(1, Math.max(0, t));
  return 1 - Math.pow(1 - clamped, 4);
}

export default function Gallery({ artworks }: { artworks: Artwork[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [openingId, setOpeningId] = useState<string | null>(null);
  const { ready: assetsReady, registerTotal, reportLoaded } = useLoadingGate();

  const totalCovers = artworks.filter((a) => a.images[0]).length;

  // Gently warm the rest of the gallery's full-res photos in the background,
  // one work at a time, once the page has settled. Firing every work's
  // images at once (as this used to) floods the browser's connection pool
  // and starves whichever image the modal actually needs next — the modal's
  // own open/neighbour preloading (see ArtworkModal) stays the fast path for
  // whatever the visitor is actively looking at; this is just a slow trickle
  // behind it so a later, unrelated open is more likely to feel instant too.
  useEffect(() => {
    if (!assetsReady || activeId) return;
    let cancelled = false;

    const idle = (cb: () => void) => {
      if (typeof window.requestIdleCallback === "function") {
        return window.requestIdleCallback(cb, { timeout: 2000 });
      }
      return window.setTimeout(cb, 300);
    };

    async function warmRestOfGallery() {
      for (const artwork of artworks) {
        if (cancelled) return;
        await preloadImages(artwork.images.map((image) => image.src));
      }
    }

    const handle = idle(() => {
      void warmRestOfGallery();
    });

    return () => {
      cancelled = true;
      if (typeof handle === "number") {
        window.clearTimeout(handle);
      } else if (typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(handle);
      }
    };
  }, [artworks, assetsReady, activeId]);

  // Tell the shared loading gate how many covers it's waiting on.
  useEffect(() => {
    registerTotal(totalCovers);
  }, [registerTotal, totalCovers]);

  const onCoverLoad = useCallback(
    (id: string) => {
      reportLoaded(id);
    },
    [reportLoaded]
  );

  const openArtwork = useCallback(
    async (id: string) => {
      if (openingId || activeId) return;
      const piece = artworks.find((artwork) => artwork.id === id);
      if (!piece) return;

      setOpeningId(id);
      try {
        const index = artworks.indexOf(piece);
        const neighbours = [
          piece,
          artworks[(index - 1 + artworks.length) % artworks.length],
          artworks[(index + 1) % artworks.length],
        ];
        await preloadImages(
          neighbours.flatMap((artwork) =>
            artwork.images.map((image) => image.src)
          )
        );
        setActiveId(id);
      } finally {
        setOpeningId(null);
      }
    },
    [activeId, artworks, openingId]
  );

  return (
    <>
      <div
        className="columns-1 sm:columns-2 xl:columns-3 gap-5 sm:gap-7"
        aria-busy={!assetsReady}
        data-gallery-ready={assetsReady ? "true" : "false"}
      >
        {artworks.map((artwork) => (
          <RevealItem key={artwork.id} ready={assetsReady}>
            <ArtworkCard
              artwork={artwork}
              isActive={activeId === artwork.id}
              enableSharedLayout={activeId === artwork.id}
              onOpen={() => {
                void openArtwork(artwork.id);
              }}
              onCoverLoad={() => onCoverLoad(artwork.id)}
            />
          </RevealItem>
        ))}
      </div>

      <ArtworkModal
        artworks={artworks}
        activeId={activeId}
        onClose={() => setActiveId(null)}
        onNavigate={(id) => setActiveId(id)}
      />
    </>
  );
}

function RevealItem({
  ready,
  children,
}: {
  ready: boolean;
  children: React.ReactNode;
}) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  /** Cards already sitting in the viewport the moment we go "ready" (i.e.
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
      // handful of works) snaps straight to fully loaded — no fade, no
      // rise — and stays exempt permanently, even if scrolled out of view
      // and back. Only cards below the fold get the scroll-scrubbed reveal.
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

      // No permanent lock: progress tracks the card's position on every
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
    <div ref={outerRef} className="mb-5 sm:mb-7 break-inside-avoid">
      <div ref={innerRef} className="gallery-reveal">
        {children}
      </div>
    </div>
  );
}
