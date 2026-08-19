import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from 'react';
import { initialState, reducer } from './reducer';
import { loadState, saveState, clearState } from './persistence';
import type { Action, AppState } from './types';

interface AppStateContextValue {
  state: AppState;
  dispatch: (action: Action) => void;
  /** True until the first localStorage read has been applied. */
  hydrated: boolean;
  /** False when storage is unavailable (private browsing) — progress is in-memory. */
  persisting: boolean;
  resetAll: () => void;
}

const AppStateContext = createContext<AppStateContextValue | null>(null);

export function AppStateProvider({
  children,
  /** Tests inject a starting state instead of reaching for localStorage. */
  initial,
  persist = true,
}: {
  children: ReactNode;
  initial?: AppState;
  persist?: boolean;
}) {
  const [state, dispatch] = useReducer(reducer, initial ?? initialState);
  const hydratedRef = useRef(initial !== undefined || !persist);
  const persistingRef = useRef(true);

  // One-shot hydration. Runs before paint so the loader already knows whether
  // this is a returning visitor and can pick the 1.2 s replay (§4).
  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;
    const stored = loadState();
    if (stored) dispatch({ type: 'hydrate', state: stored });
    else persistingRef.current = saveState(initialState);
  }, []);

  useEffect(() => {
    if (!persist || !hydratedRef.current) return;
    persistingRef.current = saveState(state);
  }, [state, persist]);

  // §7 — reflect the effective motion preference onto <html> so the CSS
  // escape hatches in tokens.css apply to non-Framer animations too.
  useEffect(() => {
    const root = document.documentElement;
    if (state.reducedMotionOverride === null) root.removeAttribute('data-motion');
    else root.setAttribute('data-motion', state.reducedMotionOverride ? 'reduced' : 'full');
  }, [state.reducedMotionOverride]);

  const resetAll = useCallback(() => {
    clearState();
    dispatch({ type: 'reset' });
  }, []);

  const value = useMemo<AppStateContextValue>(
    () => ({
      state,
      dispatch,
      hydrated: hydratedRef.current,
      persisting: persistingRef.current,
      resetAll,
    }),
    [state, resetAll],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppStateContextValue {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used inside <AppStateProvider>');
  return ctx;
}
