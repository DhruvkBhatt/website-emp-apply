import { useEffect, useRef, useState } from 'react';

/**
 * Fires once, then disconnects. Used for scroll reveals and for deferring
 * expensive media (§7: the GIF is only fetched when GetOverHere enters view).
 *
 * Falls back to "visible" when IntersectionObserver is missing so content is
 * never trapped behind an unavailable API.
 */
export function useInViewOnce<T extends Element = HTMLDivElement>({
  rootMargin = '0px 0px -12% 0px',
  threshold = 0.15,
} = {}): { ref: React.RefObject<T | null>; inView: boolean } {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin, threshold },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  return { ref, inView };
}
