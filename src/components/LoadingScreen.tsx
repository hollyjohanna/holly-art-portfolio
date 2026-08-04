"use client";

import { motion } from "framer-motion";

const BLOB_COLORS = [
  "var(--color-gold)",
  "var(--color-rose)",
  "var(--color-blue)",
  "var(--color-ink)",
];

const EASE = [0.22, 1, 0.36, 1] as const;

export default function LoadingScreen({
  loaded,
  total,
}: {
  loaded: number;
  total: number;
}) {
  const pct = total > 0 ? Math.min(1, loaded / total) : 0;

  return (
    <motion.div
      key="loading-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: EASE }}
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-8 bg-cream"
      aria-hidden
    >
      {/* Paintbrush hovering over a row of bouncing paint blobs it's "mixing" */}
      <div className="relative flex items-end gap-4">
        <motion.svg
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="none"
          className="absolute -top-8 left-1/2 -translate-x-1/2"
          animate={{ rotate: [-16, 16, -16], x: [-10, 10, -10] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <path
            d="M4.5 19.5l3.6-0.9 8.4-8.4-2.7-2.7-8.4 8.4-0.9 3.6z"
            fill="var(--color-ink)"
          />
          <path
            d="M13.5 6.9l3.6 3.6 2.55-2.55a2.55 2.55 0 10-3.6-3.6L13.5 6.9z"
            fill="var(--color-rose)"
          />
        </motion.svg>

        {BLOB_COLORS.map((color, i) => (
          <motion.span
            key={color}
            className="block h-5 w-5 sm:h-6 sm:w-6"
            style={{ backgroundColor: color, borderRadius: "62% 62% 62% 4%" }}
            animate={{ y: [0, -20, 0], rotate: [42, 55, 42] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.13,
            }}
          />
        ))}
      </div>

      <div className="flex flex-col items-center gap-3">
        <p className="label text-ink/50">Mixing a little colour</p>
        <div className="h-1 w-40 overflow-hidden rounded-full bg-ink/10">
          <motion.div
            className="h-full rounded-full"
            style={{
              background:
                "linear-gradient(90deg, var(--color-gold), var(--color-rose), var(--color-blue))",
            }}
            animate={{ width: `${Math.max(8, pct * 100)}%` }}
            transition={{ duration: 0.3, ease: EASE }}
          />
        </div>
      </div>
    </motion.div>
  );
}
