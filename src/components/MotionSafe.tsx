import type { ReactNode } from 'react';
import { useMotionPreference } from '@/hooks/useMotionPreference';

/**
 * §7 — render one tree when motion is welcome and another when it isn't.
 * Used for the handful of places where "the same element, animated less" isn't
 * good enough (the GIF takeover, the loader).
 */
export function MotionSafe({
  children,
  fallback,
}: {
  children: ReactNode;
  /** Static equivalent. Must carry the same information as `children`. */
  fallback: ReactNode;
}) {
  const { reduced } = useMotionPreference();
  return <>{reduced ? fallback : children}</>;
}
