import { useEffect, useRef, useState } from 'react';
import { useMotionPreference } from './useMotionPreference';

export interface TypewriterOptions {
  /** ms per character. */
  speed?: number;
  /** ms to wait before the first character. */
  startDelay?: number;
  /** Don't start until this is true (e.g. the section is in view). */
  enabled?: boolean;
}

/**
 * §1 — hand-rolled, no dependency.
 * §7 — under reduced motion the full text is rendered immediately, and `done`
 * is true from the first render so any "reveal after typing" UI still appears.
 */
export function useTypewriter(
  text: string,
  { speed = 28, startDelay = 200, enabled = true }: TypewriterOptions = {},
): { output: string; done: boolean; skip: () => void } {
  const { reduced } = useMotionPreference();
  const [count, setCount] = useState(0);
  const skippedRef = useRef(false);

  const instant = reduced || skippedRef.current;

  useEffect(() => {
    // Re-typing when the text changes is intentional (spontaneous mode redraws).
    setCount(0);
    skippedRef.current = false;
  }, [text]);

  useEffect(() => {
    if (!enabled || instant) return;
    if (count >= text.length) return;
    const delay = count === 0 ? startDelay : speed;
    const id = window.setTimeout(() => setCount((c) => c + 1), delay);
    return () => window.clearTimeout(id);
  }, [count, text.length, enabled, instant, speed, startDelay]);

  const output = instant ? text : text.slice(0, count);

  return {
    output,
    done: output.length === text.length,
    skip: () => {
      skippedRef.current = true;
      setCount(text.length);
    },
  };
}
