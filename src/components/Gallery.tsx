"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Artwork } from "@/lib/artworks";
import ArtworkCard from "@/components/ArtworkCard";
import ArtworkModal from "@/components/ArtworkModal";

export default function Gallery({ artworks }: { artworks: Artwork[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.05 } },
        }}
        className="columns-1 sm:columns-2 xl:columns-3 gap-5 sm:gap-7"
      >
        {artworks.map((artwork) => (
          <motion.div
            key={artwork.id}
            variants={{
              hidden: { opacity: 0, y: 16 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <ArtworkCard
              artwork={artwork}
              onOpen={() => setActiveId(artwork.id)}
            />
          </motion.div>
        ))}
      </motion.div>

      <ArtworkModal
        artworks={artworks}
        activeId={activeId}
        onClose={() => setActiveId(null)}
        onNavigate={(id) => setActiveId(id)}
      />
    </>
  );
}
