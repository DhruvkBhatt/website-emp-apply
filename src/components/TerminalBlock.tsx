import { useEffect, useState } from 'react';
import { useMotionPreference } from '@/hooks/useMotionPreference';

export interface TerminalLine {
  label: string;
  status?: 'PASS' | 'FAIL' | 'RUN' | 'INFO';
  detail?: string;
}

const GLYPH: Record<NonNullable<TerminalLine['status']>, string> = {
  PASS: '✓',
  FAIL: '✗',
  RUN: '›',
  INFO: '·',
};

const COLOR: Record<NonNullable<TerminalLine['status']>, string> = {
  PASS: 'var(--pass)',
  FAIL: 'var(--fail)',
  RUN: 'var(--fg-muted)',
  INFO: 'var(--fg-muted)',
};

/**
 * §2 — the ✓/PASS console aesthetic.
 * §7 — `role="status"` + `aria-live="polite"` so results are announced rather
 * than merely animated, and under reduced motion every line is present on the
 * first render.
 */
export function TerminalBlock({
  lines,
  /** ms between lines. 0 or reduced motion → all at once. */
  stagger = 260,
  caption,
  className = '',
}: {
  lines: TerminalLine[];
  stagger?: number;
  caption?: string;
  className?: string;
}) {
  const { reduced } = useMotionPreference();
  const [shown, setShown] = useState(() => (reduced || stagger === 0 ? lines.length : 0));

  useEffect(() => {
    if (reduced || stagger === 0) {
      setShown(lines.length);
      return;
    }
    if (shown >= lines.length) return;
    const id = window.setTimeout(() => setShown((n) => n + 1), stagger);
    return () => window.clearTimeout(id);
  }, [shown, lines.length, stagger, reduced]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`rounded-md border p-4 sm:p-5 ${className}`}
      style={{
        background: 'color-mix(in srgb, var(--fg) 5%, var(--bg-raised))',
        borderColor: 'color-mix(in srgb, var(--fg) 14%, transparent)',
      }}
    >
      {caption && <p className="pf-eyebrow mb-3">{caption}</p>}
      <ul className="pf-mono m-0 flex list-none flex-col gap-1.5 p-0">
        {lines.slice(0, shown).map((line, i) => {
          const status = line.status ?? 'INFO';
          return (
            <li key={`${line.label}-${i}`} className="flex items-start gap-2.5">
              <span aria-hidden="true" style={{ color: COLOR[status] }}>
                {GLYPH[status]}
              </span>
              <span className="flex-1">
                {line.label}
                {line.detail && <span className="text-fg-muted"> — {line.detail}</span>}
              </span>
              {line.status && line.status !== 'INFO' && (
                <span style={{ color: COLOR[status] }} className="shrink-0 tabular-nums">
                  {line.status}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
