import * as m from 'motion/react-m';
import { drawLine, premium } from '@/design/motion';
import { useInViewOnce } from '@/hooks/useInViewOnce';
import { useMotionPreference } from '@/hooks/useMotionPreference';

export interface TimelineNode {
  when: string;
  title: string;
  detail?: string;
}

/**
 * §2 / §8 — horizontal on desktop, vertical on mobile. The line is an SVG
 * `pathLength` draw (cheap, no layout), and every node's text is present
 * regardless of whether the draw ran (§7).
 */
export function Timeline({ nodes }: { nodes: TimelineNode[] }) {
  const { reduced } = useMotionPreference();
  const { ref, inView } = useInViewOnce<HTMLOListElement>();
  const animate = inView && !reduced;

  return (
    <ol
      ref={ref}
      className="relative m-0 grid list-none gap-8 p-0 md:grid-flow-col md:auto-cols-fr md:gap-6"
    >
      {/* The rail. Vertical on mobile, horizontal from md up. */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute left-[7px] top-2 h-full w-px md:left-0 md:top-[9px] md:h-px md:w-full"
        preserveAspectRatio="none"
        viewBox="0 0 1 1"
      >
        <m.line
          x1="0.5"
          y1="0"
          x2="0.5"
          y2="1"
          stroke="var(--accent)"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
          className="md:hidden"
          variants={drawLine}
          initial={animate ? 'hidden' : 'visible'}
          animate="visible"
        />
      </svg>

      {nodes.map((node, i) => (
        <m.li
          key={node.when + node.title}
          className="relative pl-8 md:pl-0 md:pt-8"
          initial={animate ? { opacity: 0, y: 16 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={reduced ? { duration: 0 } : premium(0.42, i * 0.09)}
        >
          <span
            aria-hidden="true"
            className="absolute left-0 top-1.5 block size-4 rounded-full border-2 md:top-1"
            style={{
              borderColor: 'var(--accent)',
              background: i === nodes.length - 1 ? 'var(--accent)' : 'var(--bg)',
            }}
          />
          <p className="pf-eyebrow">{node.when}</p>
          <p className="pf-serif mt-1 text-step-1">{node.title}</p>
          {node.detail && <p className="mt-1 text-step--1 text-fg-muted">{node.detail}</p>}
        </m.li>
      ))}
    </ol>
  );
}
