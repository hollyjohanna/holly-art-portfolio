"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function FaqAccordion({
  items,
  className,
}: {
  items: { q: string; a: string }[];
  className?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className={`flex flex-col border-t border-rule ${className ?? ""}`}>
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={item.q} className="border-b border-rule">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 py-4 text-left"
            >
              <span className="label text-ink/70">{item.q}</span>
              <span
                className="shrink-0 text-lg text-ink/45 transition-transform duration-300"
                style={{ transform: isOpen ? "rotate(45deg)" : "none" }}
                aria-hidden="true"
              >
                +
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="overflow-hidden"
                >
                  <p className="pb-4 text-sm sm:text-[15px] leading-relaxed text-ink/60">
                    {item.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
