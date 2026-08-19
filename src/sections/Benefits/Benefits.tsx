import { benefits } from '@/content';
import { Section, Reveal } from '@/components/Section';
import { GlassCard } from '@/components/GlassCard';
import { useAppState } from '@/state/AppState';
import { useClickStreak } from '@/hooks/useClickStreak';

/**
 * The blanket-equity benefit is the 5×-tap egg (§2 useClickStreak). It is a real
 * button so the egg is reachable by tap, not hover (§7).
 */
export function Benefits() {
  const { dispatch } = useAppState();
  const blanket = useClickStreak(5, () => dispatch({ type: 'findEgg', egg: 'blanket' }));

  return (
    <Section
      id="benefits"
      theme="warm"
      eyebrow={benefits.eyebrow}
      title={benefits.title}
      lede={benefits.lede}
    >
      <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {benefits.items.map((item) => {
          const isBlanket = item.title === 'Blanket equity';
          const body = (
            <>
              <span aria-hidden="true" className="block text-step-2">
                {item.icon}
              </span>
              <span className="pf-serif mt-2 block text-step-1">{item.title}</span>
              <span className="mt-1 block text-fg-muted">{item.body}</span>
            </>
          );
          return (
            <Reveal key={item.title} as="li">
              <GlassCard className="h-full">
                {isBlanket ? (
                  <button
                    type="button"
                    onClick={blanket.bump}
                    className="block w-full bg-transparent p-0 text-left"
                  >
                    {body}
                    {blanket.count > 0 && !blanket.reached && (
                      <span className="pf-mono mt-3 block text-fg-muted">
                        {blanket.count} of 5 shares transferred…
                      </span>
                    )}
                    {blanket.reached && (
                      <span className="pf-mono mt-3 block text-accent-text">
                        Controlling stake transferred. Permanently.
                      </span>
                    )}
                  </button>
                ) : (
                  body
                )}
              </GlassCard>
            </Reveal>
          );
        })}
      </ul>
    </Section>
  );
}
