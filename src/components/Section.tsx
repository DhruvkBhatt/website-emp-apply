import * as m from 'motion/react-m';
import type { ReactNode } from 'react';
import type { Theme } from '@/design/themes';
import { fadeUp, instant, stagger } from '@/design/motion';
import { useMotionPreference } from '@/hooks/useMotionPreference';

interface SectionProps {
  id: string;
  theme: Theme;
  /** Rendered in the mono eyebrow above the heading. */
  eyebrow?: string;
  title?: string;
  /** Short line under the title. */
  lede?: string;
  children?: ReactNode;
  /** Full-bleed sections (Loader, Hero, Acceptance) skip the max-width shell. */
  bleed?: boolean;
  className?: string;
  /** Minimum height in viewport units. Hero-class sections use 100. */
  minVh?: number;
}

/**
 * §2 / §3 — the theme-aware wrapper. Sets `data-theme`, so every token slot in
 * tokens.css re-points and children need no theme awareness at all.
 * §7 — the reveal is `whileInView` with `once`, and the end state is what
 * renders under reduced motion, so nothing is animation-gated.
 */
export function Section({
  id,
  theme,
  eyebrow,
  title,
  lede,
  children,
  bleed = false,
  className = '',
  minVh,
}: SectionProps) {
  const { reduced } = useMotionPreference();

  return (
    <section
      id={id}
      data-theme={theme}
      className={`relative isolate w-full overflow-hidden bg-bg text-fg ${className}`}
      style={{
        minHeight: minVh ? `${minVh}svh` : undefined,
        paddingBlock: 'clamp(3.5rem, 9vh, 7rem)',
      }}
    >
      <m.div
        className={bleed ? 'w-full' : 'pf-shell'}
        variants={reduced ? instant : stagger(0.08)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
      >
        {(eyebrow || title || lede) && (
          <header className="mb-8 flex flex-col gap-3">
            {eyebrow && (
              <m.p variants={reduced ? instant : fadeUp} className="pf-eyebrow">
                {eyebrow}
              </m.p>
            )}
            {title && (
              <m.h2 variants={reduced ? instant : fadeUp} className="pf-serif text-step-3 text-fg">
                {title}
              </m.h2>
            )}
            {lede && (
              <m.p
                variants={reduced ? instant : fadeUp}
                className="max-w-prose text-step-0 text-fg-muted"
              >
                {lede}
              </m.p>
            )}
          </header>
        )}
        {children}
      </m.div>
    </section>
  );
}

/** A staggered child. Any direct child of Section's grid can use this. */
export function Reveal({
  children,
  className = '',
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'li' | 'p';
}) {
  const { reduced } = useMotionPreference();
  const Tag = m[as];
  return (
    <Tag variants={reduced ? instant : fadeUp} className={className}>
      {children}
    </Tag>
  );
}
