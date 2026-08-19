import type { ReactNode } from 'react';
import { LazyMotion } from 'motion/react';

/**
 * §7 — the animation budget, enforced.
 *
 * Importing `motion.div` pulls Framer Motion's entire DOM feature set into the
 * initial bundle, which puts us over the 120 KB gz budget on its own. Every
 * animated component imports `m` from `motion/react-m` instead — a renderer-only
 * stub — and this provider fetches the feature set as a separate chunk after
 * first paint.
 *
 * `strict` makes the mistake un-makeable: using `motion.div` anywhere below this
 * provider throws in development instead of silently re-inflating the bundle.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion strict features={() => import('motion/react').then((mod) => mod.domAnimation)}>
      {children}
    </LazyMotion>
  );
}
