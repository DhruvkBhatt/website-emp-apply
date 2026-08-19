import type { Transition, Variants } from 'motion/react';

/** §3 / §7 — shared durations. Mirrors tokens.css; keep the two in step. */
export const DUR = { fast: 0.18, mid: 0.42, slow: 0.9 } as const;
export const EASE_PREMIUM: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const premium = (duration: number = DUR.mid, delay = 0): Transition => ({
  duration,
  delay,
  ease: EASE_PREMIUM,
});

/**
 * Every variant here has a static end state that is identical whether or not
 * motion ran (§7: "no information conveyed by animation alone").
 */

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: premium(DUR.mid) },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: premium(DUR.mid) },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: premium(DUR.mid) },
};

export const stagger = (each = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: each, delayChildren } },
});

/** Timeline / meter draw. `pathLength` needs no layout, so it stays cheap. */
export const drawLine: Variants = {
  hidden: { pathLength: 0, opacity: 0.2 },
  visible: { pathLength: 1, opacity: 1, transition: premium(DUR.slow) },
};

/** Reduced-motion equivalents: same end state, no travel. */
export const instant: Variants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1, transition: { duration: 0 } },
};
