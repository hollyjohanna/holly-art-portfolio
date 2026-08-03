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
    <header className="sticky top-0 z-50 bg-cream/90 backdrop-blur-sm border-b border-rule">
      <div className="container-page flex items-center justify-between py-4">
        <Link
          href="/"
          onClick={() => setMenuOpen(false)}
          className="font-display text-base sm:text-lg transition-colors duration-300 hover:text-rose"
        >
          Holly Johanna
        </Link>

        <nav className="hidden sm:flex items-center gap-1 lg:-mr-4">
          {LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative label px-4 py-2"
              >
                {active && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="absolute inset-x-3 bottom-1 h-px bg-ink/45"
                    transition={{ type: "spring", stiffness: 400, damping: 34 }}
                  />
                )}
                <motion.span
                  className={
                    active
                      ? "text-ink/90"
                      : "text-ink/45 transition-colors duration-300 hover:text-ink/80"
                  }
                  whileTap={{ scale: 0.96 }}
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
          className="sm:hidden relative h-9 w-9 border-hairline bg-cream flex flex-col items-center justify-center gap-[5px] active:translate-y-[1px] transition-transform"
        >
          <motion.span
            animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 6 : 0 }}
            className="block h-px w-4 bg-ink/70 origin-center"
          />
          <motion.span
            animate={{ opacity: menuOpen ? 0 : 1 }}
            className="block h-px w-4 bg-ink/70"
          />
          <motion.span
            animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -6 : 0 }}
            className="block h-px w-4 bg-ink/70 origin-center"
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
            className="sm:hidden overflow-hidden border-t border-rule bg-cream"
          >
            <div className="flex flex-col">
              {LINKS.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`label px-6 py-4 border-b border-rule transition-colors duration-300 ${
                      active
                        ? "bg-gold/40 text-ink/90"
                        : "text-ink/50 hover:bg-ink/[0.03] hover:text-ink/80"
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
