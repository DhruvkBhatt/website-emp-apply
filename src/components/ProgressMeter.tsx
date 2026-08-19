import * as m from 'motion/react-m';
import { premium } from '@/design/motion';
import { useInViewOnce } from '@/hooks/useInViewOnce';
import { useMotionPreference } from '@/hooks/useMotionPreference';

/**
 * §7 — the numeric value is always in the DOM as text, so the meter never
 * conveys information by animation alone. `role="meter"` carries the value to
 * assistive tech; the bar is decorative.
 */
export function ProgressMeter({
  value,
  label,
  suffix = '%',
  note,
  max = 100,
}: {
  value: number;
  label: string;
  suffix?: string;
  note?: string;
  max?: number;
}) {
  const { reduced } = useMotionPreference();
  const { ref, inView } = useInViewOnce<HTMLDivElement>();
  const pct = Math.max(0, Math.min(100, (value / max) * 100));

  return (
    <div ref={ref} className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-4">
        <span className="pf-eyebrow">{label}</span>
        <span className="pf-serif text-step-2 tabular-nums text-accent-text">
          {value}
          {suffix}
        </span>
      </div>
      <div
        role="meter"
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuetext={`${value}${suffix}`}
        className="h-2 w-full overflow-hidden rounded-full"
        style={{ background: 'color-mix(in srgb, var(--fg) 12%, transparent)' }}
      >
        <m.div
          className="h-full rounded-full"
          style={{ background: 'var(--accent)' }}
          initial={{ width: reduced ? `${pct}%` : 0 }}
          animate={{ width: inView || reduced ? `${pct}%` : 0 }}
          transition={reduced ? { duration: 0 } : premium(1.1, 0.1)}
        />
      </div>
      {note && <p className="pf-mono text-fg-muted">{note}</p>}
    </div>
  );
}
