import { useState } from 'react';
import { easterEggs, eggsUi, footer } from '@/content';
import { useAppState } from '@/state/AppState';
import { allEggsFound } from '@/state/reducer';

export function Footer() {
  const { state, dispatch, persisting, resetAll } = useAppState();
  const [showHints, setShowHints] = useState(false);
  const [reset, setReset] = useState(false);

  const found = easterEggs.filter((egg) => state.eggsFound.includes(egg.id));

  return (
    <footer data-theme="executive" className="w-full bg-bg py-14 text-fg">
      <div className="pf-shell flex flex-col gap-8">
        <section className="flex flex-col gap-4">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="pf-serif text-step-2">{eggsUi.title}</h2>
            <p className="pf-mono text-fg-muted">
              {eggsUi.found(state.eggsFound.length, easterEggs.length)}
            </p>
          </div>

          {found.length > 0 && (
            <ul className="m-0 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2">
              {found.map((egg) => (
                <li
                  key={egg.id}
                  className="rounded-md border p-4"
                  style={{ borderColor: 'color-mix(in srgb, var(--fg) 14%, transparent)' }}
                >
                  <p className="pf-serif text-step-1">{egg.title}</p>
                  <p className="mt-1 text-step--1 text-fg-muted">{egg.body}</p>
                </li>
              ))}
            </ul>
          )}

          {allEggsFound(state) ? (
            <p className="pf-mono text-accent-text">{eggsUi.allFound}</p>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setShowHints((s) => !s)}
                className="pf-mono self-start bg-transparent p-0 text-fg-muted underline decoration-dotted underline-offset-4"
              >
                {eggsUi.hintLabel}
              </button>
              {showHints && (
                <ul className="pf-mono m-0 flex list-none flex-col gap-1 p-0 text-fg-muted">
                  {easterEggs
                    .filter((egg) => !state.eggsFound.includes(egg.id))
                    .map((egg) => (
                      <li key={egg.id}>· {egg.how}</li>
                    ))}
                </ul>
              )}
            </>
          )}

          {/* §7 — the 'queen' egg is keyboard-triggered, so it needs a tap
              equivalent. This is it. */}
          <button
            type="button"
            aria-label={eggsUi.crownLabel}
            onClick={() => dispatch({ type: 'findEgg', egg: 'queen' })}
            className="self-start bg-transparent p-1 text-step-1"
          >
            <span aria-hidden="true">👑</span>
          </button>
        </section>

        <div
          className="flex flex-col gap-2 border-t pt-6"
          style={{ borderColor: 'color-mix(in srgb, var(--fg) 14%, transparent)' }}
        >
          <p className="pf-mono text-fg-muted">{footer.built}</p>
          <p className="pf-mono text-fg-muted">{footer.privacy}</p>
          {!persisting && <p className="pf-mono text-fail">{footer.storageWarning}</p>}
          <button
            type="button"
            onClick={() => {
              resetAll();
              setReset(true);
            }}
            className="pf-mono self-start bg-transparent p-0 text-fg-muted underline decoration-dotted underline-offset-4"
          >
            {footer.resetLabel}
          </button>
          <p role="status" aria-live="polite" className="pf-mono min-h-5 text-accent-text">
            {reset ? footer.resetConfirm : ''}
          </p>
        </div>
      </div>
    </footer>
  );
}
