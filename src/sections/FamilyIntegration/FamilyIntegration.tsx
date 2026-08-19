import { familyIntegration } from '@/content';
import { Section, Reveal } from '@/components/Section';

/** §5.3 — no full names, employers, or addresses. Ever. */
export function FamilyIntegration() {
  return (
    <Section
      id="family"
      theme="warm"
      eyebrow={familyIntegration.eyebrow}
      title={familyIntegration.title}
      lede={familyIntegration.lede}
    >
      <ul className="m-0 flex max-w-3xl list-none flex-col gap-4 p-0">
        {familyIntegration.commitments.map((c) => (
          <Reveal key={c} as="li">
            <p className="border-l-2 pl-4 text-step-1" style={{ borderColor: 'var(--accent)' }}>
              {c}
            </p>
          </Reveal>
        ))}
      </ul>
      <Reveal className="mt-8">
        <p className="pf-serif text-step-2">{familyIntegration.closing}</p>
      </Reveal>
    </Section>
  );
}
