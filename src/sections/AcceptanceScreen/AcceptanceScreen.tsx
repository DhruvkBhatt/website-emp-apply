import { useEffect, useRef } from 'react';
import { AnimatePresence } from 'motion/react';
import * as m from 'motion/react-m';
import { acceptance, getOverHere } from '@/content';
import { ActionButton } from '@/components/ActionButton';
import { TerminalBlock } from '@/components/TerminalBlock';
import { useLazyConfetti } from '@/hooks/useLazyConfetti';
import { useMotionPreference } from '@/hooks/useMotionPreference';
import { premium } from '@/design/motion';

/**
 * §8 Phase 5 — the letterboxed acceptance screen with the GIF callback.
 * Rendered as an overlay so it can be replayed on demand from the hero (§4).
 */
export function AcceptanceScreen({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { reduced } = useMotionPreference();
  const fire = useLazyConfetti();
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    previousFocus.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    void fire('celebrate');

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    // Freeze the page behind the overlay so scrolling doesn't leak through.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
      previousFocus.current?.focus();
    };
  }, [open, onClose, fire]);

  return (
    <AnimatePresence>
      {open && (
        <m.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="acceptance-title"
          data-theme="cinematic"
          className="fixed inset-0 z-50 overflow-y-auto bg-bg text-fg"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          {...(reduced ? {} : { exit: { opacity: 0 } })}
          transition={reduced ? { duration: 0 } : premium(0.5)}
        >
          {/* Letterbox bars — decorative only. */}
          <div aria-hidden="true" className="h-[8svh] w-full bg-black" />

          <div className="pf-shell flex min-h-[84svh] max-w-2xl flex-col justify-center gap-6 py-10">
            <p className="pf-eyebrow">{acceptance.eyebrow}</p>
            <h2 id="acceptance-title" className="pf-serif text-step-4">
              {acceptance.title}
            </h2>
            <p className="text-step-1 text-fg-muted">{acceptance.lede}</p>

            <TerminalBlock lines={[...acceptance.lines]} stagger={reduced ? 0 : 300} />

            <p className="pf-serif text-step-2 text-accent-text">{acceptance.callback}</p>
            <p className="pf-mono text-fg-muted">{getOverHere.staticLine}</p>

            <div className="flex flex-wrap gap-3">
              <ActionButton ref={closeRef} onClick={onClose}>
                {acceptance.close}
              </ActionButton>
            </div>

            <p className="pf-mono text-fg-muted">{acceptance.footer}</p>
          </div>

          <div aria-hidden="true" className="h-[8svh] w-full bg-black" />
        </m.div>
      )}
    </AnimatePresence>
  );
}
