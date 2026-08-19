import type { ComponentPropsWithRef, ReactNode } from 'react';

type Variant = 'primary' | 'ghost' | 'quiet';

const BASE =
  'pf-mono inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 py-2.5 uppercase tracking-widest transition-[transform,background-color,color] duration-[--dur-fast] disabled:cursor-not-allowed disabled:opacity-55 active:translate-y-px';

/**
 * §7 — one real `<button>` primitive so the focus ring, the 44 px touch target
 * and the disabled state are correct everywhere by default.
 */
export function ActionButton({
  children,
  variant = 'primary',
  className = '',
  ...rest
}: ComponentPropsWithRef<'button'> & { children: ReactNode; variant?: Variant }) {
  const style =
    variant === 'primary'
      ? { background: 'var(--accent)', color: 'var(--bg)' }
      : variant === 'ghost'
        ? {
            background: 'transparent',
            color: 'var(--accent-text)',
            border: '1px solid color-mix(in srgb, var(--accent) 55%, transparent)',
          }
        : { background: 'transparent', color: 'var(--fg-muted)' };

  return (
    <button type="button" className={`${BASE} ${className}`} style={style} {...rest}>
      {children}
    </button>
  );
}
