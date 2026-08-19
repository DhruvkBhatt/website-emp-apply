import { useCallback, useState } from 'react';
import { spontaneousPool } from '@/content';
import { useAppState } from '@/state/AppState';

export interface Draw {
  id: string;
  text: string;
}

/**
 * §4 — pure, so the no-repeat guarantee is unit-testable without React.
 * Returns null when the pool is exhausted.
 */
export function pickSpontaneous(
  pool: readonly Draw[],
  drawn: readonly string[],
  random: () => number = Math.random,
): Draw | null {
  const remaining = pool.filter((item) => !drawn.includes(item.id));
  if (remaining.length === 0) return null;
  const index = Math.min(remaining.length - 1, Math.floor(random() * remaining.length));
  return remaining[index] ?? null;
}

export function useSpontaneous(): {
  current: Draw | null;
  exhausted: boolean;
  draw: () => void;
  reset: () => void;
  drawnCount: number;
  total: number;
} {
  const { state, dispatch } = useAppState();
  const [current, setCurrent] = useState<Draw | null>(null);

  const draw = useCallback(() => {
    const next = pickSpontaneous(spontaneousPool, state.spontaneousDrawn);
    if (!next) {
      setCurrent(null);
      return;
    }
    setCurrent(next);
    dispatch({ type: 'drawSpontaneous', id: next.id });
  }, [state.spontaneousDrawn, dispatch]);

  const reset = useCallback(() => {
    setCurrent(null);
    dispatch({ type: 'resetSpontaneous' });
  }, [dispatch]);

  return {
    current,
    exhausted: state.spontaneousDrawn.length >= spontaneousPool.length,
    draw,
    reset,
    drawnCount: state.spontaneousDrawn.length,
    total: spontaneousPool.length,
  };
}
