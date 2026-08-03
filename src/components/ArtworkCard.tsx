"use client";

import { motion } from "framer-motion";
import type { Artwork } from "@/lib/artworks";

export default function ArtworkCard({
  artwork,
  onOpen,
}: {
  artwork: Artwork;
  onOpen: () => void;
}) {
  return (
    <div className="mb-5 sm:mb-7 break-inside-avoid">
      <motion.button
        type="button"
        onClick={onOpen}
        whileTap={{ scale: 0.99 }}
        className="group relative block w-full overflow-hidden border-hairline bg-cream text-left cursor-pointer"
      >
        <motion.img
          layoutId={`art-image-${artwork.id}`}
          src={artwork.src}
          alt={artwork.title}
          width={artwork.width}
          height={artwork.height}
          className="block w-full h-auto"
        />
        <div className="pointer-events-none absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/30" />
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-end gap-0.5 p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <span className="label text-cream/90">{artwork.medium}</span>
          <span className="label text-cream/60">
            {artwork.year} &middot; {artwork.dimensions}
          </span>
        </div>
      </motion.button>
      <p className="mt-2.5 text-xs text-ink/40 tracking-wide">{artwork.title}</p>
    </div>
  );
}
