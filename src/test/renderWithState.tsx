import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement } from 'react';
import { AppStateProvider } from '@/state/AppState';
import { MotionProvider } from '@/components/MotionProvider';
import { initialState } from '@/state/reducer';
import type { AppState } from '@/state/types';

/**
 * Renders a section with the app already "entered" and persistence off, so a
 * test never depends on localStorage or on the loader having run.
 *
 * MotionProvider is included because it runs in `strict` mode — a section that
 * reaches for `motion.div` instead of `m.div` (and silently re-inflates the
 * bundle past the §7 budget) fails here rather than in production.
 */
export function renderWithState(
  ui: ReactElement,
  overrides: Partial<AppState> = {},
  { persist = false }: { persist?: boolean } = {},
) {
  const user = userEvent.setup();
  const initial: AppState = { ...initialState, hasEntered: true, ...overrides };
  const result = render(
    <AppStateProvider initial={initial} persist={persist}>
      <MotionProvider>{ui}</MotionProvider>
    </AppStateProvider>,
  );
  return { user, ...result };
}
