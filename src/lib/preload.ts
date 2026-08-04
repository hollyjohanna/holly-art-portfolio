const inflight = new Map<string, Promise<void>>();
const ready = new Set<string>();

function loadOne(src: string): Promise<void> {
  const existing = inflight.get(src);
  if (existing) return existing;

  const promise = new Promise<void>((resolve) => {
    if (typeof window === "undefined") {
      resolve();
      return;
    }

    const img = new window.Image();

    const finish = async () => {
      try {
        if (typeof img.decode === "function") {
          await img.decode();
        }
      } catch {
        /* still mark ready so open isn't blocked forever */
      }
      ready.add(src);
      resolve();
    };

    img.onload = () => {
      void finish();
    };
    img.onerror = () => {
      ready.add(src);
      resolve();
    };
    img.src = src;

    if (img.complete && img.naturalWidth > 0) {
      void finish();
    }
  });

  inflight.set(src, promise);
  return promise;
}

/** Load + decode image URLs. Resolves only when every src is paint-ready. */
export function preloadImages(srcs: string[]): Promise<void> {
  const unique = [...new Set(srcs.filter(Boolean))];
  if (unique.length === 0) return Promise.resolve();
  return Promise.all(unique.map(loadOne)).then(() => undefined);
}

export function areImagesReady(srcs: string[]): boolean {
  return srcs.filter(Boolean).every((src) => ready.has(src));
}
