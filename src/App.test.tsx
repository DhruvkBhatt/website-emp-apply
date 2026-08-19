import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '@/App';
import { AppStateProvider } from '@/state/AppState';
import { MotionProvider } from '@/components/MotionProvider';
import { STORAGE_KEY } from '@/state/persistence';
import { sha256Hex } from '@/state/gate';
import {
  acceptance,
  applyNow,
  blushLab,
  compatibility,
  eggsUi,
  foodSimulator,
  hero,
  loader,
  management,
  managementGate,
  planning777,
  seriousMessage,
} from '@/content';
import { EASTER_EGGS, FOOD_SLA_LIMIT } from '@/state/types';

/**
 * §8 Phase 5 — "full run-through, then refresh → returning-visitor state is
 * correct". This is that run-through, in jsdom, so it is checked on every commit
 * rather than only by hand on a phone.
 */
function renderApp() {
  const user = userEvent.setup();
  const result = render(
    <AppStateProvider>
      <MotionProvider>
        <App />
      </MotionProvider>
    </AppStateProvider>,
  );
  return { user, ...result };
}

const enter = async (user: ReturnType<typeof userEvent.setup>) => {
  const button = await screen.findByRole('button', { name: loader.cta });
  await user.click(button);
};

describe('App — the loader gate', () => {
  it('shows the boot sequence and nothing else on first load', async () => {
    renderApp();
    expect(await screen.findByRole('button', { name: loader.cta })).toBeInTheDocument();
    // The narrative must not be reachable before entering.
    expect(screen.queryByRole('heading', { level: 1 })).not.toHaveTextContent(hero.title);
  });

  it('is clickable immediately — the boot delay never gates access (§7)', async () => {
    const { user } = renderApp();
    await enter(user);
    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent(hero.title);
    expect(screen.queryByRole('button', { name: loader.cta })).not.toBeInTheDocument();
  });
});

describe('App — every section renders in narrative order', () => {
  it('mounts all 22 sections with unique ids', async () => {
    const { user, container } = renderApp();
    await enter(user);

    const sections = [...container.querySelectorAll('section[id]')].map((s) => s.id);
    const expected = [
      'hero',
      'pitch',
      'portfolio',
      'meeting-notes',
      'planning-777',
      'get-over-here',
      'blush-lab',
      'food-simulator',
      'compatibility',
      'warmth',
      'decisions',
      'finance',
      'jewelry',
      'fitness',
      'family',
      'career',
      'benefits',
      'exclusivity',
      'timeline',
      'serious',
      'apply',
      'management',
    ];
    expect(sections).toEqual(expected);
    expect(new Set(sections).size).toBe(sections.length);
  });

  it('renders the serious message with no jokes and no animation wrapper', async () => {
    const { user, container } = renderApp();
    await enter(user);

    const serious = container.querySelector('#serious');
    expect(serious).toHaveAttribute('data-theme', 'intimate');
    for (const paragraph of seriousMessage.paragraphs) {
      expect(within(serious as HTMLElement).getByText(paragraph)).toBeInTheDocument();
    }
  });

  it('keeps every Private-tier panel a placeholder, never a container', async () => {
    const { user } = renderApp();
    await enter(user);

    const locked = screen.getAllByText(/Management-only protocol/i);
    // Finance figures + jewellery specifications.
    expect(locked.length).toBeGreaterThanOrEqual(2);
  });
});

describe('App — the full happy path, end to end', () => {
  it('walks submit → unlock → accept → acceptance screen', async () => {
    vi.stubEnv('VITE_MANAGEMENT_PASSPHRASE_HASH', await sha256Hex('mogra'));
    const { user } = renderApp();
    await enter(user);

    // 1. Play with the interactive sections on the way down.
    await user.click(screen.getByRole('button', { name: blushLab.buttons.coffee.label }));
    await user.click(screen.getByRole('button', { name: compatibility.runLabel }));
    expect(await screen.findByText(compatibility.verdict)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: planning777.spontaneous.button }));

    const reject = screen.getByRole('button', { name: foodSimulator.reject });
    for (let i = 0; i < FOOD_SLA_LIMIT; i += 1) await user.click(reject);
    expect(screen.getByText(foodSimulator.slaBreach.title)).toBeInTheDocument();

    // 2. Submit the application.
    await user.click(screen.getByRole('button', { name: applyNow.submit }));
    await waitFor(
      () => expect(screen.getByRole('button', { name: applyNow.submitted })).toBeDisabled(),
      { timeout: 4000 },
    );

    // 3. Unlock the management panel.
    await user.type(screen.getByLabelText(managementGate.prompt), 'mogra');
    await user.click(screen.getByRole('button', { name: managementGate.submit }));

    // 4. Accept.
    const accept = await screen.findByRole('button', { name: management.accept });
    await user.click(accept);

    // 5. The acceptance screen takes over, labelled and focus-trapping.
    const dialog = await screen.findByRole('dialog');
    expect(dialog).toHaveAccessibleName(acceptance.title);
    expect(within(dialog).getByText(acceptance.callback)).toBeInTheDocument();
    expect(document.body.style.overflow).toBe('hidden');

    // 6. Escape closes it and restores the page.
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(document.body.style.overflow).not.toBe('hidden');

    vi.unstubAllEnvs();
  }, 20000);
});

describe('App — the refresh-state matrix (§8 Phase 5)', () => {
  it('replays the loader and shows the returning-visitor hero after a refresh', async () => {
    const { user, unmount } = renderApp();
    await enter(user);
    await user.click(screen.getByRole('button', { name: applyNow.submit }));
    await waitFor(
      () => expect(screen.getByRole('button', { name: applyNow.submitted })).toBeDisabled(),
      { timeout: 4000 },
    );
    await waitFor(() => expect(localStorage.getItem(STORAGE_KEY)).not.toBeNull());

    unmount();

    // "Refresh".
    const second = renderApp();
    // The loader replays — hasEntered is never persisted (§4)...
    expect(await screen.findByRole('button', { name: loader.cta })).toBeInTheDocument();
    // ...but once hydration lands it acknowledges the returning visitor. The
    // boot log prints line by line, so this is a wait, not an assertion on the
    // first frame.
    expect(await screen.findByText(loader.returningLine)).toBeInTheDocument();

    await enter(second.user);
    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent(
      hero.returning.title,
    );
    expect(screen.getByRole('button', { name: hero.returning.cta })).toBeInTheDocument();
  }, 20000);

  it('does not ambush a returning visitor with the acceptance overlay', async () => {
    // A visitor who accepted on a previous visit and has now come back.
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 1,
        applicationSubmitted: true,
        managementDecision: 'accepted',
      }),
    );

    const { user } = renderApp();
    await enter(user);

    // Accepted, but the overlay is opt-in via the 🖤 button.
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    const replay = screen.getByRole('button', {
      name: new RegExp(hero.returning.replay, 'i'),
    });
    await user.click(replay);
    expect(await screen.findByRole('dialog')).toHaveAccessibleName(acceptance.title);
  }, 20000);
});

describe('App — easter eggs are enhancements with tap routes (§7)', () => {
  it('records the crown egg by tap, not only by keystroke', async () => {
    const { user } = renderApp();
    await enter(user);

    expect(screen.getByText(eggsUi.found(0, EASTER_EGGS.length))).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: eggsUi.crownLabel }));
    expect(screen.getByText(eggsUi.found(1, EASTER_EGGS.length))).toBeInTheDocument();
  });

  it('records the queen egg from the keyboard too', async () => {
    const { user } = renderApp();
    await enter(user);
    await user.keyboard('queen');
    expect(screen.getByText(eggsUi.found(1, EASTER_EGGS.length))).toBeInTheDocument();
  });

  it('never lets an egg be the only route to content', async () => {
    const { user } = renderApp();
    await enter(user);
    // Hints are always available, so nothing is permanently hidden.
    await user.click(screen.getByRole('button', { name: eggsUi.hintLabel }));
    expect(screen.getByText(/Type "queen" anywhere/)).toBeInTheDocument();
  });
});
