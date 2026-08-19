import { useCallback, useRef, useState } from 'react';

/**
 * §2 — counts taps on one control and fires when a threshold is hit
 * (3× coffee, 5× blanket equity). Returns a `bump` you wire to onClick, so the
 * egg is reachable by tap on touch devices as well as by mouse (§7).
 */
export function useClickStreak(
  threshold: number,
  onReach: () => void,
): { count: number; bump: () => void; reached: boolean } {
  const [count, setCount] = useState(0);
  const firedRef = useRef(false);
  const handlerRef = useRef(onReach);
  handlerRef.current = onReach;

  const bump = useCallback(() => {
    setCount((prev) => {
      const next = prev + 1;
      if (next >= threshold && !firedRef.current) {
        firedRef.current = true;
        handlerRef.current();
      }
      return next;
    });
  }, [threshold]);

  return { count, bump, reached: count >= threshold };
}
