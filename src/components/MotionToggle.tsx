import { nav } from '@/content';
import { useMotionPreference } from '@/hooks/useMotionPreference';

/**
 * §7 — the in-page reduced-motion control. Three states, because "follow the
 * system" has to remain reachable once you have overridden it.
 */
export function MotionToggle() {
  const { override, setOverride, reduced } = useMotionPreference();

  return (
    <div
      className="fixed bottom-3 right-3 z-30 flex items-center gap-1 rounded-full border px-2 py-1.5 backdrop-blur"
      style={{
        background: 'color-mix(in srgb, var(--ink) 70%, transparent)',
        borderColor: 'color-mix(in srgb, var(--champagne) 30%, transparent)',
        color: 'var(--champagne)',
      }}
      role="group"
      aria-label={nav.motionLabel}
    >
      <button
        type="button"
        onClick={() => setOverride(reduced ? false : true)}
        className="pf-mono min-h-9 bg-transparent px-2 uppercase tracking-widest"
      >
        {reduced ? nav.motionToggleRestore : nav.motionToggleReduce}
      </button>
      {override !== null && (
        <button
          type="button"
          onClick={() => setOverride(null)}
          className="pf-mono min-h-9 bg-transparent px-2 opacity-70"
        >
          {nav.motionToggleAuto}
        </button>
      )}
    </div>
  );
}
