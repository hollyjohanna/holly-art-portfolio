"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useLayoutEffect, useRef, useState } from "react";

const LINKS = [
  { href: "/", label: "Works" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

/** Matches the pill's old `inset-x-3` (0.75rem either side, at the default
 *  16px root size) now that its position is measured in pixels instead of
 *  being pinned with Tailwind insets. */
const PILL_INSET_PX = 12;

export default function Nav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const navRowRef = useRef<HTMLElement>(null);
  const linkRefs = useRef<Partial<Record<string, HTMLAnchorElement>>>({});
  const [pill, setPill] = useState<{ left: number; width: number } | null>(
    null
  );

  // Measured in DOM-local coordinates (relative to the nav row itself), not
  // the viewport — so unlike a layoutId/shared-layout FLIP animation, this
  // can't be thrown off by sticky positioning, scroll position, or the
  // scroll clamp that happens when navigating from a tall page to a short
  // one. The pill only ever moves along x.
  useLayoutEffect(() => {
    const measure = () => {
      const row = navRowRef.current;
      const activeLink = linkRefs.current[pathname];
      if (!row || !activeLink) {
        setPill(null);
        return;
      }
      const rowRect = row.getBoundingClientRect();
      const linkRect = activeLink.getBoundingClientRect();
      setPill({
        left: linkRect.left - rowRect.left + PILL_INSET_PX,
        width: linkRect.width - PILL_INSET_PX * 2,
      });
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [pathname]);

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

        <nav
          ref={navRowRef}
          className="relative hidden sm:flex items-center gap-1 lg:-mr-4"
        >
          {pill && (
            <motion.span
              className="pointer-events-none absolute bottom-1 h-px"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, var(--color-gold), var(--color-rose), var(--color-blue))",
                opacity: 0.45,
              }}
              animate={{ left: pill.left, width: pill.width }}
              transition={{ type: "spring", stiffness: 400, damping: 34 }}
            />
          )}
          {LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                ref={(el) => {
                  linkRefs.current[link.href] = el ?? undefined;
                }}
                className="label font-display px-4 py-2"
              >
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
                    className={`label font-display px-6 py-4 border-b border-rule transition-colors duration-300 ${
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
