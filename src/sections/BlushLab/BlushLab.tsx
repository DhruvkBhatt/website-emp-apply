import { useEffect, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import * as m from 'motion/react-m';
import { blushLab } from '@/content';
import { Section, Reveal } from '@/components/Section';
import { GlassCard } from '@/components/GlassCard';
import { ActionButton } from '@/components/ActionButton';
import { StatusBadge } from '@/components/StatusBadge';
import { useAppState } from '@/state/AppState';
import { useLazyConfetti } from '@/hooks/useLazyConfetti';
import { useMotionPreference } from '@/hooks/useMotionPreference';
import { premium } from '@/design/motion';

/** Pick the response for the nth press, holding on the last line. */
const nth = (lines: readonly string[], count: number): string | undefined =>
  count === 0 ? undefined : lines[Math.min(count, lines.length) - 1];

export function BlushLab() {
  const { state, dispatch } = useAppState();
  const fire = useLazyConfetti();
  const { reduced } = useMotionPreference();
  const [show403, setShow403] = useState(false);

  // Escape closes the 403 takeover — a modal you can only leave by mouse is not
  // a modal, it's a trap.
  useEffect(() => {
    if (!show403) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShow403(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [show403]);

  const mogra = nth(blushLab.responses.mogra, state.flowersDeployed);
  const coffee = nth(blushLab.responses.coffee, state.coffeeSent);
  const cuddle = nth(blushLab.responses.cuddle, state.hugRequested);

  return (
    <Section
      id="blush-lab"
      theme="playful"
      eyebrow={blushLab.eyebrow}
      title={blushLab.title}
      lede={blushLab.lede}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Reveal>
          <GlassCard className="flex h-full flex-col gap-3">
            <ActionButton
              onClick={() => {
                dispatch({ type: 'deployFlowers' });
                void fire('apply');
              }}
            >
              {blushLab.buttons.mogra.label}
            </ActionButton>
            <p role="status" aria-live="polite" className="min-h-12 text-fg-muted">
              {mogra}
            </p>
            {state.flowersDeployed > 0 && (
              <StatusBadge tone="pass">
                {blushLab.buttons.mogra.done} × {state.flowersDeployed}
              </StatusBadge>
            )}
          </GlassCard>
        </Reveal>

        <Reveal>
          <GlassCard className="flex h-full flex-col gap-3">
            <ActionButton onClick={() => dispatch({ type: 'sendCoffee' })}>
              {blushLab.buttons.coffee.label}
            </ActionButton>
            <p role="status" aria-live="polite" className="min-h-12 text-fg-muted">
              {coffee}
            </p>
            {state.coffeeSent > 0 && (
              <StatusBadge tone="pass">
                {blushLab.buttons.coffee.done} × {state.coffeeSent}
              </StatusBadge>
            )}
          </GlassCard>
        </Reveal>

        <Reveal>
          <GlassCard className="flex h-full flex-col gap-3">
            <ActionButton onClick={() => dispatch({ type: 'requestHug' })}>
              {blushLab.buttons.cuddle.label}
            </ActionButton>
            <p role="status" aria-live="polite" className="min-h-12 text-fg-muted">
              {cuddle}
            </p>
            {state.hugRequested > 0 && (
              <StatusBadge tone="pass">{blushLab.buttons.cuddle.done}</StatusBadge>
            )}
          </GlassCard>
        </Reveal>

        <Reveal>
          <GlassCard className="flex h-full flex-col gap-3">
            <ActionButton
              onClick={() => {
                dispatch({ type: 'stealHoodie' });
                setShow403(true);
              }}
            >
              {blushLab.buttons.hoodie.label}
            </ActionButton>
            <p className="min-h-12 text-fg-muted">
              {state.hoodieStolen ? blushLab.buttons.hoodie.done : ''}
            </p>
          </GlassCard>
        </Reveal>
      </div>

      {/* The 403 takeover. A real dialog: labelled, dismissible, focus-visible. */}
      <AnimatePresence>
        {show403 && (
          <m.div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="hoodie-403-title"
            className="fixed inset-0 z-40 flex items-center justify-center p-6"
            style={{ background: 'color-mix(in srgb, var(--ink) 82%, transparent)' }}
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            {...(reduced ? {} : { exit: { opacity: 0 } })}
            transition={reduced ? { duration: 0 } : premium(0.24)}
          >
            <div data-theme="cinematic" className="w-full max-w-md rounded-lg bg-bg p-7 text-fg">
              <p className="pf-mono text-step-4 text-fail">{blushLab.hoodie403.code}</p>
              <h3 id="hoodie-403-title" className="pf-serif mt-2 text-step-2">
                {blushLab.hoodie403.title}
              </h3>
              <p className="mt-3 text-fg-muted">{blushLab.hoodie403.body}</p>
              <ActionButton className="mt-6" autoFocus onClick={() => setShow403(false)}>
                {blushLab.hoodie403.dismiss}
              </ActionButton>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </Section>
  );
}
