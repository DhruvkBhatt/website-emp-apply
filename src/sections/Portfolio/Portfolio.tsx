import { portfolio } from '@/content';
import { Section, Reveal } from '@/components/Section';
import { GlassCard } from '@/components/GlassCard';
import { ProgressMeter } from '@/components/ProgressMeter';
import { StatusBadge } from '@/components/StatusBadge';

/**
 * §7 — photos are WebP with an explicit width/height and `loading="lazy"`. Until
 * real files exist (§10.4), each deployment renders a typographic plate, which
 * costs nothing and causes no layout shift.
 */
export function Portfolio() {
  return (
    <Section
      id="portfolio"
      theme="executive"
      eyebrow={portfolio.eyebrow}
      title={portfolio.title}
      lede={portfolio.lede}
    >
      <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-3">
        {portfolio.deployments.map((d) => (
          <Reveal key={d.id} as="li">
            <GlassCard className="flex h-full flex-col gap-3">
              <div
                role="img"
                aria-label={d.alt}
                className="pf-serif flex aspect-[4/3] w-full items-center justify-center rounded-md text-step-3"
                style={{
                  background:
                    'linear-gradient(140deg, color-mix(in srgb, var(--accent) 22%, transparent), transparent)',
                  color: 'var(--accent-text)',
                }}
              >
                {d.name
                  .split(' ')
                  .map((w) => w[0])
                  .join('')}
              </div>
              <div className="flex items-center justify-between gap-2">
                <h3 className="pf-serif text-step-1">{d.name}</h3>
                <StatusBadge tone="pass">{d.status}</StatusBadge>
              </div>
              <p className="pf-mono text-fg-muted">{d.kind}</p>
              <p className="text-step-0 text-fg-muted">{d.summary}</p>
            </GlassCard>
          </Reveal>
        ))}
      </ul>

      <Reveal className="mt-10 max-w-xl">
        <ProgressMeter
          value={portfolio.meter.value}
          label={portfolio.meter.label}
          note={portfolio.meter.note}
        />
      </Reveal>

      <Reveal className="mt-6">
        <p className="pf-mono text-fg-muted">{portfolio.footnote}</p>
      </Reveal>
    </Section>
  );
}
