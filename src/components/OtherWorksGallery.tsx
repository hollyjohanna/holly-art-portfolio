"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { OtherWork } from "@/lib/otherWorks";
import OtherWorksLightbox from "@/components/OtherWorksLightbox";
import RevealItem from "@/components/RevealItem";
import { useLoadingGate } from "@/components/LoadingGate";

export default function OtherWorksGallery({ works }: { works: OtherWork[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { ready } = useLoadingGate();

  return (
    <>
      <div className="columns-2 sm:columns-3 xl:columns-4 gap-3 sm:gap-4">
        {works.map((work, index) => (
          <RevealItem
            key={work.id}
            ready={ready}
            className="mb-3 break-inside-avoid sm:mb-4"
          >
            <motion.button
              type="button"
              onClick={() => setActiveIndex(index)}
              whileTap={{ scale: 0.99 }}
              className="group relative block w-full cursor-pointer overflow-hidden border-hairline bg-cream text-left"
            >
              <Image
                src={work.src}
                alt={work.title}
                width={work.width}
                height={work.height}
                sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
                quality={78}
                draggable={false}
                className="block h-auto w-full transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              />
              <div className="pointer-events-none absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/30" />
              <div className="pointer-events-none absolute inset-0 flex flex-col justify-end p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <span className="label text-cream/90">
                  {work.availableForPrint
                    ? "Available for print"
                    : "Not available for print"}
                </span>
              </div>
            </motion.button>
            <p className="mt-2.5 text-xs text-ink/40 tracking-wide">{work.title}</p>
          </RevealItem>
        ))}
      </div>

      <OtherWorksLightbox
        works={works}
        activeIndex={activeIndex}
        onClose={() => setActiveIndex(null)}
        onNavigate={setActiveIndex}
      />
    </>
  );
}
