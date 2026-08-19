import { useEffect, useState } from 'react';
import { useAppState } from '@/state/AppState';

const QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Hand-rolled rather than Framer's `useReducedMotion`, because importing that
 * pulls the full animation library into the initial chunk and breaks the §7
 * budget. This is the same six lines.
 */
function useOsReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia?.(QUERY).matches === true,
  );

  useEffect(() => {
    const mql = window.matchMedia?.(QUERY);
    if (!mql) return;
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mql.addEventListener('change', onChange);
    setReduced(mql.matches);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return reduced;
}

/**
 * §7 — the single source of truth for "should this animate?".
 *
 * OS preference by default, overridable in-page via `reducedMotionOverride`
 * so Management can turn the theatre back on (or off) without leaving Safari.
 */
export function useMotionPreference(): {
  reduced: boolean;
  override: boolean | null;
  setOverride: (value: boolean | null) => void;
} {
  const osReduced = useOsReducedMotion();
  const { state, dispatch } = useAppState();
  const override = state.reducedMotionOverride;

  return {
    reduced: override ?? osReduced,
    override,
    setOverride: (value) => dispatch({ type: 'setReducedMotion', value }),
  };
}
