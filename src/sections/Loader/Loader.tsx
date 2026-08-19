import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import * as m from 'motion/react-m';
import { loader, candidate } from '@/content';
import { ActionButton } from '@/components/ActionButton';
import { TerminalBlock, type TerminalLine } from '@/components/TerminalBlock';
import { useAppState } from '@/state/AppState';
import { isReturningVisitor } from '@/state/reducer';
import { useMotionPreference } from '@/hooks/useMotionPreference';
import { premium } from '@/design/motion';

/** §4 — returning visitors get ~1.2 s of theatre, not the full boot. */
const FULL_BOOT_MS = 2100;
const SHORT_BOOT_MS = 1200;

/**
 * §7 — the boot sequence is *theatre*, not a real wait. It never blocks on the
 * network and the ENTER button is clickable from the first frame, so the
 * loader can never be the reason the site feels slow.
 */
export function Loader() {
  const { state, dispatch } = useAppState();
  const { reduced } = useMotionPreference();
  const returning = isReturningVisitor(state);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const budget = returning ? SHORT_BOOT_MS : FULL_BOOT_MS;
  const lines = useMemo<TerminalLine[]>(() => {
    const base = loader.bootLines.map((label) => ({ label, status: 'PASS' as const }));
    return returning ? [{ label: loader.returningLine, status: 'INFO' as const }, ...base] : base;
  }, [returning]);

  const [ready, setReady] = useState(reduced);

  useEffect(() => {
    if (reduced) {
      setReady(true);
      return;
    }
    const id = window.setTimeout(() => setReady(true), budget);
    return () => window.clearTimeout(id);
  }, [budget, reduced]);

  // Move focus into the page after entering, so keyboard and screen-reader
  // users are not left at the top of a document that just replaced itself.
  const enter = () => {
    dispatch({ type: 'enter' });
    window.requestAnimationFrame(() => {
      document.getElementById('hero')?.scrollIntoView({ block: 'start' });
      headingRef.current?.focus();
    });
  };

  if (state.hasEntered) return null;

  return (
    <AnimatePresence>
      <m.div
        data-theme="executive"
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg px-6 text-fg"
        {...(reduced ? {} : { exit: { opacity: 0, transition: premium(0.5) } })}
      >
        <div className="w-full max-w-md">
          <h1 ref={headingRef} tabIndex={-1} className="pf-serif mb-1 text-step-2 outline-none">
            Application Portal
          </h1>
          <p className="pf-mono mb-6 text-fg-muted">{candidate.applicationId}</p>

          <TerminalBlock
            lines={lines}
            stagger={reduced ? 0 : Math.floor(budget / (lines.length + 1))}
            caption="boot sequence"
          />

          <div className="mt-7 flex flex-col items-start gap-3">
            {/* Clickable immediately — the delay only gates the emphasis, never access. */}
            <ActionButton onClick={enter} autoFocus>
              {loader.cta}
            </ActionButton>
            {!ready && (
              <button
                type="button"
                onClick={enter}
                className="pf-mono bg-transparent p-0 text-fg-muted underline decoration-dotted underline-offset-4"
              >
                {loader.skip}
              </button>
            )}
          </div>
        </div>
      </m.div>
    </AnimatePresence>
  );
}
