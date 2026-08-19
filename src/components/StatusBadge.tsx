type Tone = 'neutral' | 'pass' | 'fail' | 'pending';

const TONE: Record<Tone, { fg: string; bg: string }> = {
  neutral: { fg: 'var(--fg-muted)', bg: 'color-mix(in srgb, var(--fg) 8%, transparent)' },
  pass: { fg: 'var(--pass)', bg: 'color-mix(in srgb, var(--pass) 14%, transparent)' },
  fail: { fg: 'var(--fail)', bg: 'color-mix(in srgb, var(--fail) 14%, transparent)' },
  pending: { fg: 'var(--accent-text)', bg: 'color-mix(in srgb, var(--accent) 16%, transparent)' },
};

export function StatusBadge({
  children,
  tone = 'neutral',
  className = '',
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  const t = TONE[tone];
  return (
    <span
      className={`pf-mono inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 uppercase tracking-widest ${className}`}
      style={{ color: t.fg, background: t.bg }}
    >
      {children}
    </span>
  );
}
