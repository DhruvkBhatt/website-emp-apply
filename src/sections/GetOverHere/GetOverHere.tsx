import { useState } from 'react';
import { getOverHere } from '@/content';
import { Section, Reveal } from '@/components/Section';
import { ActionButton } from '@/components/ActionButton';
import { MotionSafe } from '@/components/MotionSafe';
import { useAppState } from '@/state/AppState';
import { useInViewOnce } from '@/hooks/useInViewOnce';

/**
 * §7 — the GIF is fetched only once this section enters the viewport, is
 * `loading="lazy"`, and has explicit dimensions so it cannot shift layout.
 * §4 — `hasSeenGif` makes it one-shot; replay is opt-in.
 */
export function GetOverHere() {
  const { state, dispatch } = useAppState();
  const { ref, inView } = useInViewOnce<HTMLDivElement>();
  const [replayKey, setReplayKey] = useState(0);
  const [failed, setFailed] = useState(false);

  const shouldLoad = inView && (!state.hasSeenGif || replayKey > 0);

  return (
    <Section
      id="get-over-here"
      theme="playful"
      eyebrow={getOverHere.eyebrow}
      lede={getOverHere.lede}
    >
      <div ref={ref} className="flex flex-col items-start gap-5">
        <Reveal>
          <h2 className="pf-serif text-step-4 tracking-tight text-accent-text">
            {getOverHere.title}
          </h2>
        </Reveal>

        <MotionSafe fallback={<p className="text-step-1">{getOverHere.staticLine}</p>}>
          <div className="w-full max-w-sm">
            {shouldLoad && !failed ? (
              (() => {
                const src = getOverHere.gifSrc.startsWith('http')
                  ? getOverHere.gifSrc
                  : `${import.meta.env.BASE_URL}${getOverHere.gifSrc}`;
                return (
                  <img
                    key={replayKey}
                    src={src}
                    alt={getOverHere.gifAlt}
                    width={480}
                    height={270}
                    loading="lazy"
                    decoding="async"
                    className="h-auto w-full rounded-md"
                    onLoad={() => dispatch({ type: 'gifSeen' })}
                    onError={() => setFailed(true)}
                  />
                );
              })()
            ) : (
              <p className="text-step-1">{getOverHere.staticLine}</p>
            )}
            {failed && <p className="pf-mono mt-2 text-fg-muted">{getOverHere.missingAssetNote}</p>}
          </div>
        </MotionSafe>

        <Reveal>
          <div className="flex flex-wrap items-center gap-3">
            {state.hasSeenGif && !failed && (
              <ActionButton variant="ghost" onClick={() => setReplayKey((k) => k + 1)}>
                {getOverHere.replay}
              </ActionButton>
            )}
            <p className="pf-mono text-fg-muted">{getOverHere.caption}</p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
