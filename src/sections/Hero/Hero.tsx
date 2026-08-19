import { hero, candidate } from '@/content';
import { Section, Reveal } from '@/components/Section';
import { ActionButton } from '@/components/ActionButton';
import { StatusBadge } from '@/components/StatusBadge';
import { useAppState } from '@/state/AppState';
import { isReturningVisitor } from '@/state/reducer';

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ block: 'start' });
}

export function Hero({ onReplayAcceptance }: { onReplayAcceptance: () => void }) {
  const { state, dispatch } = useAppState();
  const returning = isReturningVisitor(state);

  return (
    <Section id="hero" theme="executive" minVh={100} className="flex items-center">
      <div className="flex flex-col gap-7">
        <Reveal>
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge tone={state.applicationSubmitted ? 'pass' : 'pending'}>
              {state.applicationSubmitted ? 'Submitted' : 'Draft'}
            </StatusBadge>
            {/* §2 easter egg 'name' — a tap target, so it works on touch (§7). */}
            <button
              type="button"
              onClick={() => dispatch({ type: 'findEgg', egg: 'name' })}
              className="pf-mono bg-transparent p-0 text-left text-fg-muted"
              aria-label={`Application ID ${candidate.applicationId}`}
            >
              {candidate.applicationId}
            </button>
          </div>
        </Reveal>

        <Reveal>
          <p className="pf-eyebrow">{hero.eyebrow}</p>
        </Reveal>

        <Reveal>
          <h1 className="pf-serif max-w-3xl text-step-4">
            {returning ? hero.returning.title : hero.title}
          </h1>
        </Reveal>

        <Reveal>
          <p className="max-w-prose text-step-1 text-fg-muted">
            {returning ? hero.returning.lede : hero.lede}
          </p>
        </Reveal>

        <Reveal>
          <dl className="grid grid-cols-1 gap-x-10 gap-y-4 sm:grid-cols-2">
            {hero.meta.map((row) => (
              <div
                key={row.label}
                className="border-t pt-3"
                style={{ borderColor: 'color-mix(in srgb, var(--fg) 14%, transparent)' }}
              >
                <dt className="pf-eyebrow">{row.label}</dt>
                <dd className="m-0 mt-1 text-step-0">{row.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal>
          <div className="flex flex-wrap items-center gap-3">
            {returning ? (
              <>
                <ActionButton onClick={() => scrollTo('management')}>
                  {hero.returning.cta}
                </ActionButton>
                {state.managementDecision === 'accepted' && (
                  <ActionButton variant="ghost" onClick={onReplayAcceptance}>
                    🖤 {hero.returning.replay}
                  </ActionButton>
                )}
              </>
            ) : (
              <ActionButton variant="ghost" onClick={() => scrollTo('pitch')}>
                {hero.scrollHint}
              </ActionButton>
            )}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
