import { careerSupport } from '@/content';
import { Section, Reveal } from '@/components/Section';
import { GlassCard } from '@/components/GlassCard';

export function CareerSupport() {
  return (
    <Section
      id="career"
      theme="warm"
      eyebrow={careerSupport.eyebrow}
      title={careerSupport.title}
      lede={careerSupport.lede}
    >
      <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2">
        {careerSupport.commitments.map((c) => (
          <Reveal key={c.label} as="li">
            <GlassCard className="h-full">
              <h3 className="pf-serif text-step-1">{c.label}</h3>
              <p className="mt-2 text-fg-muted">{c.body}</p>
            </GlassCard>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
