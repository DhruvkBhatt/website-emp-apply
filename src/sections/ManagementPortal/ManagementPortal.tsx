import { useEffect, useRef, useState } from 'react';
import { management, managementGate, managementPanel } from '@/content';
import { Section, Reveal } from '@/components/Section';
import { GlassCard } from '@/components/GlassCard';
import { ActionButton } from '@/components/ActionButton';
import { StatusBadge } from '@/components/StatusBadge';
import { useAppState } from '@/state/AppState';
import { checkPassphrase } from '@/state/gate';
import { MANAGEMENT_HASH, useHashRoute } from '@/hooks/useHashRoute';
import { useLazyConfetti } from '@/hooks/useLazyConfetti';

/** §10.5 — the clarification button opens a real WhatsApp deep link. */
function clarificationUrl(): string | null {
  const number = (import.meta.env.VITE_CLARIFICATION_WHATSAPP ?? '').replace(/\D/g, '');
  if (!number) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(management.clarifyMessage)}`;
}

export function ManagementPortal({ onAccepted }: { onAccepted: () => void }) {
  const { state, dispatch } = useAppState();
  const { hash } = useHashRoute();
  const fire = useLazyConfetti();
  const inputRef = useRef<HTMLInputElement>(null);

  const [value, setValue] = useState('');
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unconfigured, setUnconfigured] = useState(false);

  // Deep-linking to #/management scrolls here and puts the cursor in the field.
  useEffect(() => {
    if (hash !== MANAGEMENT_HASH) return;
    document.getElementById('management')?.scrollIntoView({ block: 'start' });
    inputRef.current?.focus();
  }, [hash]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setChecking(true);
    setError(null);
    const result = await checkPassphrase(
      value,
      import.meta.env.VITE_MANAGEMENT_PASSPHRASE_HASH ?? '',
    );
    setChecking(false);
    if (result.ok) {
      setUnconfigured(result.unconfigured);
      setValue('');
      dispatch({ type: 'unlockManagement' });
    } else {
      setError(managementGate.wrong);
    }
  };

  const decide = (decision: 'accepted' | 'clarification') => {
    dispatch({ type: 'decide', decision });
    if (decision === 'accepted') {
      void fire('accept');
      onAccepted();
      return;
    }
    const url = clarificationUrl();
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  const decided = state.managementDecision !== 'pending';

  return (
    <Section
      id="management"
      theme="cinematic"
      eyebrow={state.managementUnlocked ? management.eyebrow : managementGate.eyebrow}
      title={state.managementUnlocked ? management.title : managementGate.title}
      lede={state.managementUnlocked ? management.lede : managementGate.lede}
    >
      {!state.managementUnlocked ? (
        <Reveal>
          <GlassCard className="max-w-md">
            <form onSubmit={submit} className="flex flex-col gap-3">
              <label htmlFor="pf-passphrase" className="pf-eyebrow">
                {managementGate.prompt}
              </label>
              <input
                id="pf-passphrase"
                ref={inputRef}
                type="password"
                autoComplete="off"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                aria-describedby="pf-passphrase-hint"
                {...(error ? { 'aria-invalid': true } : {})}
                className="min-h-11 rounded-md border bg-transparent px-3 py-2 text-fg"
                style={{ borderColor: 'color-mix(in srgb, var(--fg) 25%, transparent)' }}
              />
              <p id="pf-passphrase-hint" className="pf-mono text-fg-muted">
                {managementGate.hintPrefix}{' '}
                {import.meta.env.VITE_MANAGEMENT_HINT || managementGate.defaultHint}
              </p>
              <ActionButton type="submit" disabled={checking || value.trim() === ''}>
                {checking ? managementGate.checking : managementGate.submit}
              </ActionButton>
              {/* Errors are announced, not just coloured (§7). */}
              <p role="alert" aria-live="assertive" className="pf-mono min-h-5 text-fail">
                {error}
              </p>
            </form>
          </GlassCard>
        </Reveal>
      ) : (
        <Reveal>
          <div className="flex max-w-2xl flex-col gap-5">
            {unconfigured && <p className="pf-mono text-fail">{managementGate.unconfigured}</p>}

            <ul className="m-0 flex list-none flex-col gap-2 p-0 text-fg-muted">
              {managementPanel.notes.map((note) => (
                <li key={note}>· {note}</li>
              ))}
            </ul>

            {!state.applicationSubmitted ? (
              <p className="pf-mono">{management.notSubmitted}</p>
            ) : (
              <>
                <div role="status" aria-live="polite">
                  {decided && (
                    <StatusBadge
                      tone={state.managementDecision === 'accepted' ? 'pass' : 'pending'}
                    >
                      {state.managementDecision === 'accepted'
                        ? management.decided.accepted
                        : management.decided.clarification}
                    </StatusBadge>
                  )}
                </div>

                <div className="flex flex-wrap gap-3">
                  <ActionButton onClick={() => decide('accepted')}>
                    {management.accept}
                  </ActionButton>
                  <ActionButton variant="ghost" onClick={() => decide('clarification')}>
                    {management.clarify}
                  </ActionButton>
                </div>

                {state.managementDecision === 'clarification' && !clarificationUrl() && (
                  <p className="pf-mono text-fg-muted">{management.clarifyFallback}</p>
                )}
              </>
            )}

            <button
              type="button"
              onClick={() => dispatch({ type: 'lockManagement' })}
              className="pf-mono self-start bg-transparent p-0 text-fg-muted underline decoration-dotted underline-offset-4"
            >
              {managementGate.relock}
            </button>
          </div>
        </Reveal>
      )}
    </Section>
  );
}
