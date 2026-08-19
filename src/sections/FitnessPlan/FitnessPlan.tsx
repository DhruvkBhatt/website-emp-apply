import { fitnessPlan } from '@/content';
import { Section, Reveal } from '@/components/Section';
import { GlassCard } from '@/components/GlassCard';

export function FitnessPlan() {
  return (
    <Section
      id="fitness"
      theme="warm"
      eyebrow={fitnessPlan.eyebrow}
      title={fitnessPlan.title}
      lede={fitnessPlan.lede}
    >
      <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2">
        {fitnessPlan.commitments.map((c) => (
          <Reveal key={c.label} as="li">
            <GlassCard className="h-full">
              <h3 className="pf-mono uppercase tracking-widest text-accent-text">{c.label}</h3>
              <p className="mt-2">{c.body}</p>
            </GlassCard>
          </Reveal>
        ))}
      </ul>
      <Reveal className="mt-8">
        <p className="pf-serif text-step-2">{fitnessPlan.target}</p>
      </Reveal>
    </Section>
  );
}
