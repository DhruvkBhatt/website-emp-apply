import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithState } from '@/test/renderWithState';
import { FoodSimulator } from '@/sections/FoodSimulator/FoodSimulator';
import { foodSimulator } from '@/content';
import { FOOD_SLA_LIMIT } from '@/state/types';

describe('FoodSimulator — SLA breach at exactly five (§8 Phase 3)', () => {
  it('shows the first proposal and no breach', () => {
    renderWithState(<FoodSimulator />);
    expect(screen.getByText(`Rejections 0/${FOOD_SLA_LIMIT}`)).toBeInTheDocument();
    expect(screen.queryByText(foodSimulator.slaBreach.title)).not.toBeInTheDocument();
  });

  it('advances the proposal on each rejection without breaching early', async () => {
    const { user } = renderWithState(<FoodSimulator />);
    const reject = screen.getByRole('button', { name: foodSimulator.reject });

    for (let i = 0; i < FOOD_SLA_LIMIT - 1; i += 1) await user.click(reject);

    expect(screen.getByText(`Rejections 4/${FOOD_SLA_LIMIT}`)).toBeInTheDocument();
    expect(screen.queryByText(foodSimulator.slaBreach.title)).not.toBeInTheDocument();
    // Still offering options, not escalating.
    expect(screen.getByRole('button', { name: foodSimulator.reject })).toBeEnabled();
  });

  it('breaches on the fifth rejection and takes the decision away', async () => {
    const { user } = renderWithState(<FoodSimulator />);
    const reject = screen.getByRole('button', { name: foodSimulator.reject });

    for (let i = 0; i < FOOD_SLA_LIMIT; i += 1) await user.click(reject);

    expect(screen.getByText(foodSimulator.slaBreach.badge)).toBeInTheDocument();
    expect(screen.getByText(foodSimulator.slaBreach.title)).toBeInTheDocument();
    expect(screen.getByText(foodSimulator.slaBreach.resolution)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: foodSimulator.reject })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: foodSimulator.accept })).not.toBeInTheDocument();
  });

  it('announces the breach politely rather than silently (§7)', async () => {
    const { user } = renderWithState(<FoodSimulator />, { foodRejectCount: FOOD_SLA_LIMIT - 1 });
    await user.click(screen.getByRole('button', { name: foodSimulator.reject }));

    const live = screen.getByRole('status');
    expect(live).toHaveAttribute('aria-live', 'polite');
    expect(live).toHaveTextContent(foodSimulator.slaBreach.title);
  });

  it('recovers via reset', async () => {
    const { user } = renderWithState(<FoodSimulator />, { foodRejectCount: FOOD_SLA_LIMIT });
    await user.click(screen.getByRole('button', { name: foodSimulator.reset }));

    expect(screen.getByText(`Rejections 0/${FOOD_SLA_LIMIT}`)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: foodSimulator.reject })).toBeInTheDocument();
  });

  it('accepting short-circuits the whole thing', async () => {
    const { user } = renderWithState(<FoodSimulator />);
    await user.click(screen.getByRole('button', { name: foodSimulator.accept }));

    expect(screen.getByText(foodSimulator.accepted.title)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: foodSimulator.reject })).not.toBeInTheDocument();
  });
});
