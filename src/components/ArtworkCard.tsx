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
    <div className="mb-4 sm:mb-5 break-inside-avoid">
      <motion.button
        type="button"
        onClick={onOpen}
        whileTap={{ scale: 0.98 }}
        className="group relative block w-full overflow-hidden border-brutal bg-cream text-left cursor-pointer"
      >
        <motion.img
          layoutId={`art-image-${artwork.id}`}
          src={artwork.src}
          alt={artwork.title}
          width={artwork.width}
          height={artwork.height}
          className="block w-full h-auto"
        />
        <div className="pointer-events-none absolute inset-0 bg-ink/0 transition-colors duration-300 group-hover:bg-ink/45" />
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-end p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="text-cream text-sm font-semibold uppercase tracking-wide">
            {artwork.medium}
          </span>
          <span className="text-cream/80 text-xs uppercase tracking-wide">
            {artwork.year} &middot; {artwork.dimensions}
          </span>
        </div>
      </motion.button>
      <p className="mt-2 text-xs sm:text-sm text-ink/50 tracking-wide">
        {artwork.title}
      </p>
    </div>
  );
}
