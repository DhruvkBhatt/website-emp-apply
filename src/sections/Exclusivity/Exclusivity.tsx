import { exclusivity } from '@/content';
import { Section, Reveal } from '@/components/Section';

export function Exclusivity() {
  return (
    <Section
      id="exclusivity"
      theme="executive"
      eyebrow={exclusivity.eyebrow}
      title={exclusivity.title}
      lede={exclusivity.lede}
    >
      <ol className="pf-mono m-0 flex max-w-3xl list-none flex-col gap-4 p-0">
        {exclusivity.terms.map((term, i) => (
          <Reveal key={term} as="li">
            <p className="flex gap-4 text-step-0">
              <span aria-hidden="true" className="text-accent-text">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span>{term}</span>
            </p>
          </Reveal>
        ))}
      </ol>
      <Reveal className="mt-8">
        <p className="pf-serif text-step-1 text-accent-text">{exclusivity.seal}</p>
      </Reveal>
    </Section>
  );
}
