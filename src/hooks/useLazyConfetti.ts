import { useCallback } from 'react';
import { useMotionPreference } from './useMotionPreference';

type Burst = 'apply' | 'accept' | 'celebrate';

const PRESETS = {
  // Champagne + rose + ivory, matching §3.
  apply: { particleCount: 90, spread: 70, startVelocity: 42, colors: ['#D9BE8A', '#B76E79'] },
  accept: { particleCount: 160, spread: 110, startVelocity: 50, colors: ['#D9BE8A', '#FBF7F0'] },
  celebrate: {
    particleCount: 220,
    spread: 140,
    startVelocity: 55,
    colors: ['#D9BE8A', '#B76E79', '#FBF7F0', '#6E1B32'],
  },
} satisfies Record<
  Burst,
  { particleCount: number; spread: number; startVelocity: number; colors: string[] }
>;

/**
 * §1 / §6 — canvas-confetti is only ever reached through this dynamic import,
 * so it lands in its own chunk and never touches the initial bundle.
 * §7 — skipped entirely under reduced motion.
 */
export function useLazyConfetti(): (burst?: Burst) => Promise<void> {
  const { reduced } = useMotionPreference();

  return useCallback(
    async (burst: Burst = 'apply') => {
      if (reduced) return;
      try {
        const { default: confetti } = await import('canvas-confetti');
        const preset = PRESETS[burst];
        confetti({ ...preset, origin: { y: 0.62 }, disableForReducedMotion: true });
      } catch {
        // A blocked or failed chunk fetch must not break the flow that
        // triggered it — the confetti is garnish, the state change is the point.
      }
    },
    [reduced],
  );
}
