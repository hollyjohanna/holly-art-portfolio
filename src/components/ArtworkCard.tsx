"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { Artwork } from "@/lib/artworks";

export default function ArtworkCard({
  artwork,
  isActive,
  enableSharedLayout,
  onOpen,
  onCoverLoad,
}: {
  artwork: Artwork;
  isActive: boolean;
  enableSharedLayout: boolean;
  onOpen: () => void;
  onCoverLoad?: () => void;
}) {
  const cover = artwork.images[0];
  if (!cover) return null;

  return (
    <div>
      <motion.button
        type="button"
        onClick={onOpen}
        whileTap={{ scale: 0.99 }}
        className="group relative block w-full overflow-hidden border-hairline bg-cream text-left cursor-pointer"
      >
        <motion.div
          layoutId={enableSharedLayout ? `art-frame-${artwork.id}` : undefined}
          className="relative w-full"
          style={{ opacity: isActive ? 0 : 1 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {/*
            Optimized covers (~viewport width, WebP/AVIF). Animating the full
            1800px JPEGs is what made scroll feels choppy.
          */}
          <Image
            src={cover.src}
            alt={artwork.title}
            width={cover.width}
            height={cover.height}
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 45vw, 30vw"
            className="block h-auto w-full"
            priority
            quality={80}
            draggable={false}
            onLoad={onCoverLoad}
          />
        </motion.div>
        <div className="pointer-events-none absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/30" />
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-end gap-0.5 p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <span className="label text-cream/90">{artwork.medium}</span>
          <span className="label text-cream/60">
            {artwork.year || "[Year]"} &middot; {artwork.dimensions}
          </span>
        </div>
      </motion.button>
      <p className="mt-2.5 text-xs text-ink/40 tracking-wide">{artwork.title}</p>
    </div>
  );
}
