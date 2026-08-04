"use client";

import { motion } from "framer-motion";

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
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-cream"
      aria-hidden
    >
      <div className="h-1 w-40 overflow-hidden rounded-full bg-ink/10">
        <motion.div
          className="h-full rounded-full"
          style={{
            backgroundImage:
              "linear-gradient(90deg, var(--color-gold), var(--color-rose), var(--color-blue), var(--color-gold))",
            backgroundSize: "200% 100%",
          }}
          animate={{
            width: `${Math.max(8, pct * 100)}%`,
            backgroundPosition: ["0% 0%", "200% 0%"],
          }}
          transition={{
            width: { duration: 0.3, ease: EASE },
            backgroundPosition: {
              duration: 1.6,
              repeat: Infinity,
              ease: "linear",
            },
          }}
        />
      </div>
    </motion.div>
  );
}
