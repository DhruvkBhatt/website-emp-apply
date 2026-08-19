import { meetingNotes } from '@/content';
import { Section, Reveal } from '@/components/Section';
import { useInViewOnce } from '@/hooks/useInViewOnce';
import { useTypewriter } from '@/hooks/useTypewriter';
import { useMotionPreference } from '@/hooks/useMotionPreference';

/**
 * §5.1 — paraphrased notes only. There is no transcript in this repo and there
 * must never be one.
 */
export function MeetingNotes() {
  const { ref, inView } = useInViewOnce<HTMLDivElement>();
  const { reduced } = useMotionPreference();
  const { output, done, skip } = useTypewriter(meetingNotes.typewriterIntro, { enabled: inView });

  return (
    <Section
      id="meeting-notes"
      theme="warm"
      eyebrow={meetingNotes.eyebrow}
      title={meetingNotes.title}
      lede={meetingNotes.lede}
    >
      <div ref={ref}>
        <p className="pf-mono min-h-6 text-fg-muted" aria-live="polite">
          {output}
          {!done && !reduced && (
            <span aria-hidden="true" className="animate-pulse">
              ▌
            </span>
          )}
        </p>
        {!done && !reduced && (
          <button
            type="button"
            onClick={skip}
            className="pf-mono mt-2 bg-transparent p-0 text-fg-muted underline decoration-dotted underline-offset-4"
          >
            Skip typing
          </button>
        )}

        {/* §7 — the list is always in the DOM. The typewriter above is flourish,
            never a gate on the content. */}
        <ul className="m-0 mt-7 flex list-none flex-col gap-4 p-0">
          {meetingNotes.heard.map((line) => (
            <Reveal key={line} as="li">
              <p
                className="pf-serif border-l-2 pl-4 text-step-1"
                style={{ borderColor: 'var(--accent)' }}
              >
                {line}
              </p>
            </Reveal>
          ))}
        </ul>

        <Reveal className="mt-8">
          <p className="pf-mono text-accent-text">{meetingNotes.closing}</p>
          <p className="pf-mono mt-1 text-fg-muted">{meetingNotes.disclaimer}</p>
        </Reveal>
      </div>
    </Section>
  );
}
