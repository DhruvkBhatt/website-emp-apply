import { seriousMessage } from '@/content';

/**
 * §3 / §8 — theme `intimate`, and deliberately *not* wrapped in <Section>:
 * there are no reveals, no stagger, no motion of any kind here. The absence of
 * animation is the design.
 */
export function SeriousMessage() {
  return (
    <section
      id="serious"
      data-theme="intimate"
      className="w-full bg-bg text-fg"
      style={{ paddingBlock: 'clamp(5rem, 14vh, 9rem)' }}
    >
      <div className="pf-shell max-w-2xl">
        <p className="pf-eyebrow">{seriousMessage.eyebrow}</p>
        <h2 className="pf-serif mt-3 text-step-3">{seriousMessage.title}</h2>
        <div className="mt-7 flex flex-col gap-5">
          {seriousMessage.paragraphs.map((p) => (
            <p key={p.slice(0, 24)} className="pf-serif text-step-1 leading-relaxed">
              {p}
            </p>
          ))}
        </div>
        <p className="pf-mono mt-8 text-fg-muted">{seriousMessage.signature}</p>
      </div>
    </section>
  );
}
