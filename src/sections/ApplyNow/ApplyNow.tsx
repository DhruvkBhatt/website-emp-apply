import { useEffect, useState } from 'react';
import { applyNow, declaration } from '@/content';
import { Section, Reveal } from '@/components/Section';
import { GlassCard } from '@/components/GlassCard';
import { ActionButton } from '@/components/ActionButton';
import { TerminalBlock } from '@/components/TerminalBlock';
import { StatusBadge } from '@/components/StatusBadge';
import { useAppState } from '@/state/AppState';
import { useLazyConfetti } from '@/hooks/useLazyConfetti';
import { useMotionPreference } from '@/hooks/useMotionPreference';

const SEQUENCE_MS = 1600;

export function ApplyNow() {
  const { state, dispatch } = useAppState();
  const { reduced } = useMotionPreference();
  const fire = useLazyConfetti();
  const [submitting, setSubmitting] = useState(false);

  const submitted = state.applicationSubmitted;

  useEffect(() => {
    if (!submitting) return;
    const id = window.setTimeout(
      () => {
        setSubmitting(false);
        dispatch({ type: 'submitApplication' });
        void fire('apply');
      },
      reduced ? 0 : SEQUENCE_MS,
    );
    return () => window.clearTimeout(id);
  }, [submitting, reduced, dispatch, fire]);

  return (
    <Section
      id="apply"
      theme="cinematic"
      eyebrow={applyNow.eyebrow}
      title={applyNow.title}
      lede={applyNow.lede}
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Reveal>
          <GlassCard className="h-full">
            <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
              {applyNow.checklist.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span aria-hidden="true" style={{ color: 'var(--pass)' }}>
                    ✓
                  </span>
                  <span>{item}</span>
                  <span className="pf-sr-only">complete</span>
                </li>
              ))}
            </ul>
          </GlassCard>
        </Reveal>

        <Reveal>
          <div className="flex h-full flex-col gap-4">
            {(submitting || submitted) && (
              <TerminalBlock
                lines={applyNow.sequence.map((l) => ({
                  label: l.label,
                  status: submitted && l.status === 'RUN' ? 'RUN' : l.status,
                  ...('detail' in l && l.detail ? { detail: l.detail } : {}),
                }))}
                stagger={reduced ? 0 : 280}
                caption="submit()"
              />
            )}

            <div className="flex flex-wrap items-center gap-3">
              <ActionButton
                onClick={() => setSubmitting(true)}
                disabled={submitting || submitted}
                aria-live="polite"
              >
                {submitted
                  ? applyNow.submitted
                  : submitting
                    ? applyNow.submitting
                    : applyNow.submit}
              </ActionButton>
              {submitted && <StatusBadge tone="pass">Awaiting decision</StatusBadge>}
            </div>

            {submitted && <p className="text-fg-muted">{applyNow.afterSubmit}</p>}
          </div>
        </Reveal>
      </div>

      <Reveal className="mt-10">
        <GlassCard className="max-w-2xl">
          <p className="pf-eyebrow">{declaration.eyebrow}</p>
          <h3 className="pf-serif mt-2 text-step-1">{declaration.title}</h3>
          <p className="pf-serif mt-3 text-step-1">{declaration.body}</p>
          <p className="pf-mono mt-4 text-fg-muted">{declaration.signedAs}</p>
        </GlassCard>
      </Reveal>
    </Section>
  );
}
