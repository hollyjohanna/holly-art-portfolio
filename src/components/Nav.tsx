"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const LINKS = [
  { href: "/", label: "Works" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur-sm border-b-[3px] border-ink">
      <div className="flex items-center justify-between px-6 sm:px-10 py-4 sm:py-5">
        <Link
          href="/"
          onClick={() => setMenuOpen(false)}
          className="font-display text-lg sm:text-2xl tracking-tight transition-colors duration-300 hover:text-rose"
        >
          HOLLY JOHANNA
        </Link>

        <nav className="hidden sm:flex items-center gap-1">
          {LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 font-semibold uppercase tracking-wide text-sm"
              >
                {active && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="absolute inset-0 border-brutal bg-gold"
                    style={{ zIndex: -1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <motion.span
                  className={
                    active
                      ? "text-ink"
                      : "text-ink/60 transition-colors duration-300 hover:text-ink"
                  }
                  whileTap={{ scale: 0.94 }}
                >
                  {link.label}
                </motion.span>
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((v) => !v)}
          className="sm:hidden relative h-9 w-9 border-brutal bg-cream flex flex-col items-center justify-center gap-[5px] active:translate-y-[1px] transition-transform"
        >
          <motion.span
            animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 6 : 0 }}
            className="block h-[2.5px] w-5 bg-ink origin-center"
          />
          <motion.span
            animate={{ opacity: menuOpen ? 0 : 1 }}
            className="block h-[2.5px] w-5 bg-ink"
          />
          <motion.span
            animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -6 : 0 }}
            className="block h-[2.5px] w-5 bg-ink origin-center"
          />
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="sm:hidden overflow-hidden border-t-[3px] border-ink bg-cream"
          >
            <div className="flex flex-col">
              {LINKS.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`px-6 py-4 font-semibold uppercase tracking-wide text-sm border-b border-ink/10 transition-colors duration-300 ${
                      active ? "bg-gold text-ink" : "text-ink/70 hover:bg-ink/5 hover:text-ink"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
