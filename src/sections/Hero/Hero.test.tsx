import { describe, expect, it } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithState } from '@/test/renderWithState';
import { Hero } from '@/sections/Hero/Hero';
import { ApplyNow } from '@/sections/ApplyNow/ApplyNow';
import { hero, applyNow } from '@/content';

const noop = () => {};

describe('Hero — returning-visitor state (§4)', () => {
  it('shows the first-visit copy before submission', () => {
    renderWithState(<Hero onReplayAcceptance={noop} />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(hero.title);
    expect(screen.getByText('Draft')).toBeInTheDocument();
    expect(screen.queryByText(hero.returning.title)).not.toBeInTheDocument();
  });

  it('swaps to "Welcome back, Management." once submitted', () => {
    renderWithState(<Hero onReplayAcceptance={noop} />, { applicationSubmitted: true });
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(hero.returning.title);
    expect(screen.getByText(hero.returning.lede)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: hero.returning.cta })).toBeInTheDocument();
  });

  it('offers the 🖤 replay only after acceptance', async () => {
    const { rerender } = renderWithState(<Hero onReplayAcceptance={noop} />, {
      applicationSubmitted: true,
    });
    expect(screen.queryByRole('button', { name: /replay/i })).not.toBeInTheDocument();
    rerender(<></>);

    renderWithState(<Hero onReplayAcceptance={noop} />, {
      applicationSubmitted: true,
      managementDecision: 'accepted',
    });
    expect(
      screen.getByRole('button', { name: new RegExp(hero.returning.replay, 'i') }),
    ).toBeInTheDocument();
  });

  it('exposes the application ID as a real button, so the egg works on touch (§7)', async () => {
    const { user } = renderWithState(<Hero onReplayAcceptance={noop} />);
    const idButton = screen.getByRole('button', { name: /Application ID/i });
    await user.click(idButton);
    // No crash, no navigation — the egg is recorded in state and surfaces in
    // the footer, which is covered by the reducer tests.
    expect(idButton).toBeInTheDocument();
  });
});

describe('ApplyNow — the submit sequence', () => {
  it('renders the full checklist up front', () => {
    renderWithState(<ApplyNow />);
    for (const item of applyNow.checklist) {
      expect(screen.getByText(item)).toBeInTheDocument();
    }
  });

  it('submits and locks the button', async () => {
    const { user } = renderWithState(<ApplyNow />);
    await user.click(screen.getByRole('button', { name: applyNow.submit }));

    // The submit sequence is deliberate theatre (~1.6 s), so this wait is
    // longer than the testing-library default.
    await waitFor(
      () => expect(screen.getByRole('button', { name: applyNow.submitted })).toBeDisabled(),
      { timeout: 4000 },
    );
    expect(screen.getByText(applyNow.afterSubmit)).toBeInTheDocument();
  });

  it('skips the theatre entirely under reduced motion (§7)', async () => {
    const { user } = renderWithState(<ApplyNow />, { reducedMotionOverride: true });
    await user.click(screen.getByRole('button', { name: applyNow.submit }));

    await waitFor(() =>
      expect(screen.getByRole('button', { name: applyNow.submitted })).toBeDisabled(),
    );
  });

  it('shows the already-submitted state on a return visit', () => {
    renderWithState(<ApplyNow />, { applicationSubmitted: true });
    expect(screen.getByRole('button', { name: applyNow.submitted })).toBeDisabled();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
