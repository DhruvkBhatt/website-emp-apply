import { jewelryRoadmap } from '@/content';
import { Section, Reveal } from '@/components/Section';
import { GlassCard } from '@/components/GlassCard';
import { LockedPanel } from '@/components/LockedPanel';
import { useAppState } from '@/state/AppState';

/** §5.2 — four phases, no budget. Do not add one. */
export function JewelryRoadmap() {
  const { dispatch } = useAppState();

  return (
    <Section
      id="jewelry"
      theme="warm"
      eyebrow={jewelryRoadmap.eyebrow}
      title={jewelryRoadmap.title}
      lede={jewelryRoadmap.lede}
    >
      <ol className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2">
        {jewelryRoadmap.phases.map((p, i) => (
          <Reveal key={p.phase} as="li">
            {/* Phase 3 is the 'mangalsutra' egg — a real button, so it is
                reachable by tap and by keyboard (§7). */}
            <GlassCard className="h-full">
              <button
                type="button"
                className="block w-full bg-transparent p-0 text-left"
                onClick={() => {
                  if (i === 2) dispatch({ type: 'findEgg', egg: 'mangalsutra' });
                }}
              >
                <span className="pf-eyebrow">{p.phase}</span>
                <span className="pf-serif mt-1 block text-step-1">{p.title}</span>
                <span className="mt-2 block text-fg-muted">{p.body}</span>
              </button>
            </GlassCard>
          </Reveal>
        ))}
      </ol>

      <Reveal className="mt-8">
        <LockedPanel title={jewelryRoadmap.lockedTitle} note={jewelryRoadmap.lockedNote} />
      </Reveal>
    </Section>
  );
}
