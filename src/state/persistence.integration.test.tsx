import { describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppStateProvider } from '@/state/AppState';
import { MotionProvider } from '@/components/MotionProvider';
import { STORAGE_KEY } from '@/state/persistence';
import { initialState } from '@/state/reducer';
import { BlushLab } from '@/sections/BlushLab/BlushLab';
import { blushLab } from '@/content';

/**
 * §4 — the persistence path end to end: interact, unmount, remount, and check
 * the state came back. This is the bug class that only shows up on a refresh.
 */
describe('persistence integration — progress survives a remount', () => {
  it('restores counters and eggs from localStorage', async () => {
    const user = userEvent.setup();

    const first = render(
      <AppStateProvider initial={{ ...initialState, hasEntered: true }}>
        <MotionProvider>
          <BlushLab />
        </MotionProvider>
      </AppStateProvider>,
    );

    const coffee = screen.getByRole('button', { name: blushLab.buttons.coffee.label });
    await user.click(coffee);
    await user.click(coffee);
    await user.click(coffee);

    await waitFor(() => expect(localStorage.getItem(STORAGE_KEY)).not.toBeNull());
    first.unmount();

    // Fresh provider, no injected state — it must read from storage.
    render(
      <AppStateProvider>
        <MotionProvider>
          <BlushLab />
        </MotionProvider>
      </AppStateProvider>,
    );

    await waitFor(() =>
      expect(screen.getByText(`${blushLab.buttons.coffee.done} × 3`)).toBeInTheDocument(),
    );
  });

  it('does not restore hasEntered, so the loader replays (§4)', async () => {
    const user = userEvent.setup();
    render(
      <AppStateProvider initial={{ ...initialState, hasEntered: true }}>
        <MotionProvider>
          <BlushLab />
        </MotionProvider>
      </AppStateProvider>,
    );
    await user.click(screen.getByRole('button', { name: blushLab.buttons.coffee.label }));

    await waitFor(() => expect(localStorage.getItem(STORAGE_KEY)).not.toBeNull());
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(stored).not.toHaveProperty('hasEntered');
  });
});
