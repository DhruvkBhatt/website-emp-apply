import { useEffect, useRef } from 'react';

/**
 * §2 — the "queen" keystroke unlock. Listens for a literal word typed anywhere
 * on the page and fires once.
 *
 * §7 — easter eggs are enhancements only. Nothing gated behind this is the sole
 * path to any content, and every keyboard-only egg has a tap equivalent
 * elsewhere in the UI.
 */
export function useKonami(word: string, onUnlock: () => void, enabled = true): void {
  const bufferRef = useRef('');
  const firedRef = useRef(false);
  const handlerRef = useRef(onUnlock);
  handlerRef.current = onUnlock;

  useEffect(() => {
    if (!enabled) return;
    const target = word.toLowerCase();

    const onKeyDown = (event: KeyboardEvent) => {
      if (firedRef.current) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      // Don't hijack typing in the passphrase field or any other input.
      const el = event.target as HTMLElement | null;
      const tag = el?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || el?.isContentEditable) return;
      if (event.key.length !== 1) return;

      const next = (bufferRef.current + event.key.toLowerCase()).slice(-target.length);
      bufferRef.current = next;
      if (next === target) {
        firedRef.current = true;
        handlerRef.current();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [word, enabled]);
}
