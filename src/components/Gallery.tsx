"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Artwork } from "@/lib/artworks";
import ArtworkCard from "@/components/ArtworkCard";
import ArtworkModal from "@/components/ArtworkModal";
import { preloadImages } from "@/lib/preload";

/** How far the card rises while scrubbing in (CSS rem). */
const RISE_REM = 5.5;

export default function Gallery({ artworks }: { artworks: Artwork[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [openingId, setOpeningId] = useState<string | null>(null);
  const [loadedCovers, setLoadedCovers] = useState(0);
  const [assetsReady, setAssetsReady] = useState(false);
  const marked = useRef(new Set<string>());

  const totalCovers = artworks.filter((a) => a.images[0]).length;
  const coversReady = loadedCovers >= totalCovers && totalCovers > 0;

  const allSrcs = useMemo(
    () =>
      artworks.flatMap((artwork) => artwork.images.map((image) => image.src)),
    [artworks]
  );

  // Start warming every full-res photo immediately — modal opens use these.
  useEffect(() => {
    void preloadImages(allSrcs);
  }, [allSrcs]);

  useEffect(() => {
    if (assetsReady) return;
    const t = window.setTimeout(() => setAssetsReady(true), 8000);
    return () => window.clearTimeout(t);
  }, [assetsReady]);

  useEffect(() => {
    if (!coversReady || assetsReady) return;
    setAssetsReady(true);
  }, [coversReady, assetsReady]);

  const onCoverLoad = useCallback((id: string) => {
    if (marked.current.has(id)) return;
    marked.current.add(id);
    setLoadedCovers((count) => count + 1);
  }, []);

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
        data-covers-loaded={`${loadedCovers}/${totalCovers}`}
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
  /** Once fully revealed, stay at 1 until the card leaves through the bottom. */
  const lockedRef = useRef(false);

  useEffect(() => {
    if (!ready) return;
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const apply = (progress: number) => {
      const p = Math.min(1, Math.max(0, progress));
      inner.style.opacity = String(p);
      inner.style.transform = `translate3d(0, ${(1 - p) * RISE_REM}rem, 0)`;
    };

    const update = () => {
      const rect = outer.getBoundingClientRect();
      const vh = window.innerHeight;

      if (rect.top >= vh) {
        lockedRef.current = false;
        apply(0);
        return;
      }

      if (lockedRef.current || rect.bottom <= 0) {
        lockedRef.current = true;
        apply(1);
        return;
      }

      if (reduceMotion) {
        lockedRef.current = true;
        apply(1);
        return;
      }

      const start = vh;
      const end = vh * 0.28;
      let progress = (start - rect.top) / (start - end);
      progress = Math.min(1, Math.max(0, progress));

      if (progress >= 1) lockedRef.current = true;
      apply(progress);
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
