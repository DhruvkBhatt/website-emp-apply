import { pitch } from '@/content';
import { Section, Reveal } from '@/components/Section';
import { GlassCard } from '@/components/GlassCard';

export function ExecutivePitch() {
  return (
    <Section id="pitch" theme="warm" eyebrow={pitch.eyebrow} title={pitch.title} lede={pitch.lede}>
      <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2">
        {pitch.cards.map((card) => (
          <Reveal key={card.title} as="li">
            <GlassCard className="h-full">
              <p aria-hidden="true" className="text-step-2 text-accent-text">
                {card.icon}
              </p>
              <h3 className="pf-serif mt-2 text-step-1">{card.title}</h3>
              <p className="mt-2 text-step-0 text-fg-muted">{card.body}</p>
              <p className="pf-mono mt-4 text-accent-text">{card.metric}</p>
            </GlassCard>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
