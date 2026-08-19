import { useState } from 'react';
import { foodSimulator } from '@/content';
import { Section, Reveal } from '@/components/Section';
import { GlassCard } from '@/components/GlassCard';
import { ActionButton } from '@/components/ActionButton';
import { StatusBadge } from '@/components/StatusBadge';
import { useAppState } from '@/state/AppState';
import { isFoodSlaBreached } from '@/state/reducer';
import { FOOD_SLA_LIMIT } from '@/state/types';

/**
 * §4 / §8 — five rejections and the SLA breaches. The reject button is then
 * disabled and decision authority transfers to the candidate.
 */
export function FoodSimulator() {
  const { state, dispatch } = useAppState();
  const [accepted, setAccepted] = useState(false);
  const breached = isFoodSlaBreached(state);

  const index = Math.min(state.foodRejectCount, foodSimulator.options.length - 1);
  const option = foodSimulator.options[index] ?? foodSimulator.options[0];
  const reaction = foodSimulator.reactions[Math.min(state.foodRejectCount, FOOD_SLA_LIMIT - 1)];

  const restart = () => {
    setAccepted(false);
    dispatch({ type: 'resetFood' });
  };

  return (
    <Section
      id="food-simulator"
      theme="playful"
      eyebrow={foodSimulator.eyebrow}
      title={foodSimulator.title}
      lede={foodSimulator.lede}
    >
      <Reveal>
        <GlassCard className="max-w-xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <StatusBadge tone={breached ? 'fail' : 'neutral'}>
              Rejections {state.foodRejectCount}/{FOOD_SLA_LIMIT}
            </StatusBadge>
            {breached && <StatusBadge tone="fail">{foodSimulator.slaBreach.badge}</StatusBadge>}
          </div>

          {/* One live region for the whole simulator, so each change is announced
              once rather than three times (§7). */}
          <div role="status" aria-live="polite" className="mt-5">
            {accepted ? (
              <>
                <h3 className="pf-serif text-step-2">{foodSimulator.accepted.title}</h3>
                <p className="mt-2 text-fg-muted">{foodSimulator.accepted.body}</p>
              </>
            ) : breached ? (
              <>
                <h3 className="pf-serif text-step-2 text-fail">{foodSimulator.slaBreach.title}</h3>
                <p className="mt-2 text-fg-muted">{foodSimulator.slaBreach.body}</p>
                <p className="pf-mono mt-3 text-accent-text">
                  {foodSimulator.slaBreach.resolution}
                </p>
              </>
            ) : (
              <>
                <p className="pf-eyebrow">Proposal {state.foodRejectCount + 1}</p>
                <h3 className="pf-serif mt-1 text-step-2">{option}</h3>
                <p className="pf-mono mt-2 text-fg-muted">{reaction}</p>
              </>
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {!accepted && !breached && (
              <>
                <ActionButton onClick={() => setAccepted(true)}>
                  {foodSimulator.accept}
                </ActionButton>
                <ActionButton variant="ghost" onClick={() => dispatch({ type: 'rejectFood' })}>
                  {foodSimulator.reject}
                </ActionButton>
              </>
            )}
            {(accepted || state.foodRejectCount > 0) && (
              <ActionButton variant="quiet" onClick={restart}>
                {foodSimulator.reset}
              </ActionButton>
            )}
          </div>
        </GlassCard>
      </Reveal>
    </Section>
  );
}
