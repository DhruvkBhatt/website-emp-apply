import { planning777 } from '@/content';
import { Section, Reveal } from '@/components/Section';
import { GlassCard } from '@/components/GlassCard';
import { ProgressMeter } from '@/components/ProgressMeter';
import { ActionButton } from '@/components/ActionButton';
import { useSpontaneous } from '@/hooks/useSpontaneous';

export function Planning777() {
  const { current, exhausted, draw, reset, drawnCount, total } = useSpontaneous();

  return (
    <Section
      id="planning-777"
      theme="warm"
      eyebrow={planning777.eyebrow}
      title={planning777.title}
      lede={planning777.lede}
    >
      <ol className="m-0 grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-3">
        {planning777.nodes.map((node) => (
          <Reveal key={node.key} as="li">
            <GlassCard className="h-full">
              <p className="pf-eyebrow">{node.key}</p>
              <h3 className="pf-serif mt-1 text-step-2">{node.title}</h3>
              <p className="mt-2 text-fg-muted">{node.body}</p>
              <ul className="pf-mono m-0 mt-4 flex list-none flex-col gap-1 p-0 text-fg-muted">
                {node.examples.map((ex) => (
                  <li key={ex}>· {ex}</li>
                ))}
              </ul>
            </GlassCard>
          </Reveal>
        ))}
      </ol>

      <Reveal className="mt-10 max-w-xl">
        <ProgressMeter
          value={planning777.split.plannedPct}
          label={planning777.split.label}
          note={planning777.split.note}
        />
        <p className="pf-mono mt-2 flex justify-between text-fg-muted">
          <span>{planning777.split.plannedLabel}</span>
          <span>{planning777.split.spontaneousLabel}</span>
        </p>
      </Reveal>

      <Reveal className="mt-8">
        <div className="flex flex-wrap items-center gap-3">
          <ActionButton onClick={draw} disabled={exhausted}>
            {current ? planning777.spontaneous.again : planning777.spontaneous.button}
          </ActionButton>
          {drawnCount > 0 && (
            <button
              type="button"
              onClick={reset}
              className="pf-mono bg-transparent p-0 text-fg-muted underline decoration-dotted underline-offset-4"
            >
              Reset the pool ({drawnCount}/{total} drawn)
            </button>
          )}
        </div>

        {/* aria-live so a keyboard user hears the draw instead of only seeing it. */}
        <div role="status" aria-live="polite" className="mt-4 min-h-16">
          {current && (
            <GlassCard>
              <p className="pf-serif text-step-1">{current.text}</p>
              <p className="pf-mono mt-2 text-fg-muted">{planning777.spontaneous.caption}</p>
            </GlassCard>
          )}
          {exhausted && !current && (
            <p className="pf-mono text-fg-muted">{planning777.spontaneous.exhausted}</p>
          )}
        </div>
      </Reveal>
    </Section>
  );
}
