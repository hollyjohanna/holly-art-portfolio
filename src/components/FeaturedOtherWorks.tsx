"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { OtherWork } from "@/lib/otherWorks";
import OtherWorksLightbox from "@/components/OtherWorksLightbox";
import RevealItem from "@/components/RevealItem";
import { useLoadingGate } from "@/components/LoadingGate";

export default function FeaturedOtherWorks({ works }: { works: OtherWork[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { ready } = useLoadingGate();

  if (works.length === 0) return null;

  return (
    <section className="mt-16 border-t border-rule pt-10 sm:mt-24 sm:pt-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-xl sm:text-2xl">Featured Other Works</h2>
          <p className="mt-3 max-w-sm text-[13px] leading-relaxed text-ink/50">
            A few looser pieces from the sketchbook.
          </p>
        </div>
        <Link
          href="/other-works"
          className="label text-ink/50 transition-colors duration-300 hover:text-ink"
        >
          View all other works &rarr;
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6">
        {works.map((work, index) => (
          <RevealItem key={work.id} ready={ready}>
            <button
              type="button"
              onClick={() => setActiveIndex(index)}
              className="group block w-full cursor-pointer text-left"
            >
              <div className="relative overflow-hidden border-hairline bg-cream">
                <Image
                  src={work.src}
                  alt={work.title}
                  width={work.width}
                  height={work.height}
                  sizes="(max-width: 640px) 50vw, 33vw"
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
              </div>
              <p className="mt-2.5 text-xs text-ink/40 tracking-wide">{work.title}</p>
            </button>
          </RevealItem>
        ))}
      </div>

      <OtherWorksLightbox
        works={works}
        activeIndex={activeIndex}
        onClose={() => setActiveIndex(null)}
        onNavigate={setActiveIndex}
      />
    </section>
  );
}
