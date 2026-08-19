import { commitmentTimeline } from '@/content';
import { Section } from '@/components/Section';
import { Timeline } from '@/components/Timeline';

export function CommitmentTimeline() {
  return (
    <Section
      id="timeline"
      theme="executive"
      eyebrow={commitmentTimeline.eyebrow}
      title={commitmentTimeline.title}
      lede={commitmentTimeline.lede}
    >
      <Timeline nodes={[...commitmentTimeline.nodes]} />
    </Section>
  );
}
