import { compatibility } from '@/content';
import { Section, Reveal } from '@/components/Section';
import { TerminalBlock } from '@/components/TerminalBlock';
import { ProgressMeter } from '@/components/ProgressMeter';
import { ActionButton } from '@/components/ActionButton';
import { StatusBadge } from '@/components/StatusBadge';
import { useAppState } from '@/state/AppState';

/**
 * §7 — the check is not a gate: the results and the score are rendered as soon
 * as the section is reached if it has already been run once, and pressing the
 * button is the only thing the animation adds.
 */
export function Compatibility() {
  const { state, dispatch } = useAppState();
  const run = state.compatibilityCompleted;

  return (
    <Section
      id="compatibility"
      theme="executive"
      eyebrow={compatibility.eyebrow}
      title={compatibility.title}
      lede={compatibility.lede}
    >
      {!run && (
        <Reveal className="mb-6">
          <ActionButton onClick={() => dispatch({ type: 'completeCompatibility' })}>
            {compatibility.runLabel}
          </ActionButton>
        </Reveal>
      )}

      {run && (
        <div className="flex flex-col gap-8">
          <TerminalBlock
            lines={compatibility.checks.map((c) => ({
              label: c.label,
              status: c.status,
              ...('detail' in c && c.detail ? { detail: c.detail } : {}),
            }))}
            caption="compatibility.run()"
          />

          <div className="max-w-xl">
            <ProgressMeter
              value={compatibility.score.value}
              label={compatibility.score.label}
              note={compatibility.score.note}
            />
          </div>

          <StatusBadge tone="pass" className="self-start">
            {compatibility.verdict}
          </StatusBadge>
        </div>
      )}
    </Section>
  );
}
