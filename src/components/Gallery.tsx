"use client";

import { useCallback, useEffect, useState } from "react";
import type { Artwork } from "@/lib/artworks";
import ArtworkCard from "@/components/ArtworkCard";
import ArtworkModal from "@/components/ArtworkModal";
import RevealItem from "@/components/RevealItem";
import { useLoadingGate } from "@/components/LoadingGate";
import { preloadImages } from "@/lib/preload";

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
          <RevealItem
            key={artwork.id}
            ready={assetsReady}
            className="mb-5 sm:mb-7 break-inside-avoid"
          >
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
