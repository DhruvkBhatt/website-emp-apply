import { decisionArchitecture } from '@/content';
import { Section, Reveal } from '@/components/Section';
import { GlassCard } from '@/components/GlassCard';

export function DecisionArchitecture() {
  return (
    <Section
      id="decisions"
      theme="warm"
      eyebrow={decisionArchitecture.eyebrow}
      title={decisionArchitecture.title}
      lede={decisionArchitecture.lede}
    >
      <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2">
        {decisionArchitecture.tiers.map((t) => (
          <Reveal key={t.tier} as="li">
            <GlassCard className="h-full">
              <h3 className="pf-serif text-step-2 text-accent-text">{t.tier}</h3>
              <p className="mt-2 text-fg-muted">{t.body}</p>
            </GlassCard>
          </Reveal>
        ))}
      </ul>
      <Reveal className="mt-8">
        <p className="pf-mono text-accent-text">{decisionArchitecture.rule}</p>
      </Reveal>
    </Section>
  );
}
