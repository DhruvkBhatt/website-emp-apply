import { financePhilosophy } from '@/content';
import { Section, Reveal } from '@/components/Section';
import { GlassCard } from '@/components/GlassCard';
import { LockedPanel } from '@/components/LockedPanel';

/**
 * §5.2 — HARD RULE: no rupee or dollar amounts anywhere in src/ or public/.
 * Buckets and principles only. The figures live behind <LockedPanel>, which is
 * a placeholder, not a container — there is nothing to unlock.
 */
export function FinancePhilosophy() {
  return (
    <Section
      id="finance"
      theme="warm"
      eyebrow={financePhilosophy.eyebrow}
      title={financePhilosophy.title}
      lede={financePhilosophy.lede}
    >
      <ul className="m-0 grid list-none grid-cols-2 gap-4 p-0 lg:grid-cols-4">
        {financePhilosophy.buckets.map((b) => (
          <Reveal key={b.name} as="li">
            <GlassCard className="h-full">
              <h3 className="pf-serif text-step-1 text-accent-text">{b.name}</h3>
              <p className="mt-2 text-step--1 text-fg-muted">{b.body}</p>
            </GlassCard>
          </Reveal>
        ))}
      </ul>

      <Reveal className="mt-8">
        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {financePhilosophy.principles.map((p) => (
            <li key={p} className="flex gap-3">
              <span aria-hidden="true" className="text-accent-text">
                ·
              </span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal className="mt-8">
        <LockedPanel title={financePhilosophy.locked.title} note={financePhilosophy.locked.note} />
      </Reveal>
    </Section>
  );
}
