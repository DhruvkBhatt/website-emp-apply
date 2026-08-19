import { warmth } from '@/content';
import { Section, Reveal } from '@/components/Section';
import { GlassCard } from '@/components/GlassCard';

export function WarmthProtocol() {
  return (
    <Section
      id="warmth"
      theme="warm"
      eyebrow={warmth.eyebrow}
      title={warmth.title}
      lede={warmth.lede}
    >
      <ul className="m-0 flex list-none flex-col gap-3 p-0">
        {warmth.steps.map((step) => (
          <Reveal key={step.trigger} as="li">
            <GlassCard className="grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,14rem)_1fr] sm:gap-6">
              <p className="pf-mono uppercase tracking-widest text-accent-text">{step.trigger}</p>
              <p className="text-step-0">{step.response}</p>
            </GlassCard>
          </Reveal>
        ))}
      </ul>
      <Reveal className="mt-8">
        <p className="pf-serif max-w-prose text-step-2">{warmth.guarantee}</p>
      </Reveal>
    </Section>
  );
}
