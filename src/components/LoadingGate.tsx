"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import LoadingScreen from "@/components/LoadingScreen";

/** Minimum time the loading screen stays up, even if covers load instantly —
 *  keeps it from flashing by for a frame on a fast connection. */
const MIN_LOADING_MS = 3000;

/** Module-scoped, not state — survives navigating away from and back to the
 *  home page in the same session, so the splash only ever shows once per
 *  visit instead of replaying every time you come back. */
let hasShownLoadingScreen = false;

type LoadingGateContextValue = {
  /** False only while the home page's very first load is being gated. */
  ready: boolean;
  registerTotal: (total: number) => void;
  reportLoaded: (id: string) => void;
};

const LoadingGateContext = createContext<LoadingGateContextValue>({
  ready: true,
  registerTotal: () => {},
  reportLoaded: () => {},
});

export function useLoadingGate() {
  return useContext(LoadingGateContext);
}

/**
 * Rendered once, at the very top of the layout — outside the animated
 * per-route wrapper in template.tsx. That matters: framer-motion drives that
 * wrapper's slide-up transition with a `transform`, and any `transform`
 * (even the resting `translateY(0)`) turns that element into the containing
 * block for `position: fixed` descendants. A loading screen nested inside it
 * would only ever cover that box — not the sticky nav above it. Living up
 * here, as a sibling of <Nav>, it truly covers the whole viewport.
 */
export default function LoadingGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [total, setTotal] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const markedRef = useRef(new Set<string>());

  const [minTimeElapsed, setMinTimeElapsed] = useState(hasShownLoadingScreen);
  const [assetsReady, setAssetsReady] = useState(
    hasShownLoadingScreen || !isHome
  );

  const coversReady = total > 0 && loaded >= total;

  useEffect(() => {
    if (!isHome || hasShownLoadingScreen) return;
    const t = window.setTimeout(() => setMinTimeElapsed(true), MIN_LOADING_MS);
    return () => window.clearTimeout(t);
    // Deliberately only ever runs once, for the real first visit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isHome || assetsReady || hasShownLoadingScreen) return;
    const t = window.setTimeout(() => setAssetsReady(true), 8000);
    return () => window.clearTimeout(t);
  }, [isHome, assetsReady]);

  useEffect(() => {
    if (!coversReady || !minTimeElapsed || assetsReady) return;
    setAssetsReady(true);
  }, [coversReady, minTimeElapsed, assetsReady]);

  useEffect(() => {
    if (assetsReady) hasShownLoadingScreen = true;
  }, [assetsReady]);

  // Keep the page from scrolling while the covers load in behind the splash.
  useEffect(() => {
    if (!isHome || assetsReady) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isHome, assetsReady]);

  const registerTotal = useCallback((n: number) => setTotal(n), []);

  const reportLoaded = useCallback((id: string) => {
    if (markedRef.current.has(id)) return;
    markedRef.current.add(id);
    setLoaded((count) => count + 1);
  }, []);

  const showOverlay = isHome && !assetsReady;

  const contextValue = useMemo(
    () => ({
      ready: !isHome || assetsReady,
      registerTotal,
      reportLoaded,
    }),
    [isHome, assetsReady, registerTotal, reportLoaded]
  );

  return (
    <LoadingGateContext.Provider value={contextValue}>
      <AnimatePresence>
        {showOverlay && <LoadingScreen loaded={loaded} total={total} />}
      </AnimatePresence>
      {children}
    </LoadingGateContext.Provider>
  );
}
