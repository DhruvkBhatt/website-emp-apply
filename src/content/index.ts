/**
 * §2 — typed barrel + a zod-less runtime shape check.
 *
 * The check exists because content is edited by hand, often late at night, and
 * an empty array or a dropped key should fail loudly in dev rather than render
 * a silently blank section. It is a dev-only assertion — it is tree-shaken out
 * of the production bundle by the `import.meta.env.DEV` guard.
 */

export { candidate, loader, hero, nav } from './candidate';
export { pitch } from './pitch';
export { portfolio } from './portfolio';
export { meetingNotes } from './meetingNotes';
export { planning777 } from './planning777';
export { warmth, blushLab, foodSimulator } from './warmth';
export {
  getOverHere,
  compatibility,
  decisionArchitecture,
  financePhilosophy,
  jewelryRoadmap,
  fitnessPlan,
  familyIntegration,
  careerSupport,
  exclusivity,
  commitmentTimeline,
} from './roadmap';
export {
  benefits,
  seriousMessage,
  applyNow,
  declaration,
  management,
  acceptance,
  footer,
} from './benefits';
export { managementGate, managementPanel } from './management';
export { spontaneousPool, easterEggs, eggsUi } from './surprises';

import { candidate, hero, loader } from './candidate';
import { pitch } from './pitch';
import { portfolio } from './portfolio';
import { meetingNotes } from './meetingNotes';
import { planning777 } from './planning777';
import { warmth, blushLab, foodSimulator } from './warmth';
import {
  compatibility,
  commitmentTimeline,
  decisionArchitecture,
  financePhilosophy,
  jewelryRoadmap,
  fitnessPlan,
  familyIntegration,
  careerSupport,
  exclusivity,
} from './roadmap';
import { benefits, seriousMessage, applyNow } from './benefits';
import { spontaneousPool, easterEggs } from './surprises';
import { EASTER_EGGS, FOOD_SLA_LIMIT } from '@/state/types';

export interface ContentProblem {
  where: string;
  what: string;
}

/**
 * Returns [] when the content is structurally sound. Exported (not just run on
 * import) so it can be unit-tested — this is the one content guarantee we can
 * actually assert in CI.
 */
export function checkContent(): ContentProblem[] {
  const problems: ContentProblem[] = [];
  const nonEmpty = (where: string, value: unknown) => {
    if (typeof value === 'string' && value.trim() === '')
      problems.push({ where, what: 'empty string' });
    if (Array.isArray(value) && value.length === 0) problems.push({ where, what: 'empty array' });
  };
  const expectLength = (where: string, arr: readonly unknown[], n: number) => {
    if (arr.length !== n)
      problems.push({ where, what: `expected ${n} entries, found ${arr.length}` });
  };

  nonEmpty('candidate.applicationId', candidate.applicationId);
  nonEmpty('hero.title', hero.title);
  nonEmpty('loader.bootLines', loader.bootLines);
  nonEmpty('meetingNotes.heard', meetingNotes.heard);
  nonEmpty('meetingNotes.typewriterIntro', meetingNotes.typewriterIntro);
  nonEmpty('seriousMessage.paragraphs', seriousMessage.paragraphs);
  nonEmpty('benefits.items', benefits.items);
  nonEmpty('warmth.steps', warmth.steps);
  nonEmpty('decisionArchitecture.tiers', decisionArchitecture.tiers);
  nonEmpty('familyIntegration.commitments', familyIntegration.commitments);
  nonEmpty('careerSupport.commitments', careerSupport.commitments);
  nonEmpty('fitnessPlan.commitments', fitnessPlan.commitments);
  nonEmpty('exclusivity.terms', exclusivity.terms);
  nonEmpty('applyNow.checklist', applyNow.checklist);

  // Counts the brief pins down explicitly (§8).
  expectLength('pitch.cards', pitch.cards, 4);
  expectLength('portfolio.deployments', portfolio.deployments, 3);
  expectLength('planning777.nodes', planning777.nodes, 3);
  expectLength('financePhilosophy.buckets', financePhilosophy.buckets, 4);
  expectLength('jewelryRoadmap.phases', jewelryRoadmap.phases, 4);
  expectLength('easterEggs', easterEggs, EASTER_EGGS.length);

  // §4 — one reaction line per rejection before the breach.
  expectLength('foodSimulator.reactions', foodSimulator.reactions, FOOD_SLA_LIMIT);
  if (foodSimulator.options.length <= FOOD_SLA_LIMIT) {
    problems.push({
      where: 'foodSimulator.options',
      what: `needs more than ${FOOD_SLA_LIMIT} options so the SLA can actually breach`,
    });
  }

  if (portfolio.meter.value < 0 || portfolio.meter.value > 100) {
    problems.push({ where: 'portfolio.meter.value', what: 'must be 0..100' });
  }
  if (compatibility.score.value < 0 || compatibility.score.value > 100) {
    problems.push({ where: 'compatibility.score.value', what: 'must be 0..100' });
  }
  if (!compatibility.checks.some((c) => c.status === 'FAIL')) {
    // The two honest FAILs are the joke. Losing them loses the section.
    problems.push({ where: 'compatibility.checks', what: 'needs at least one FAIL' });
  }
  if (commitmentTimeline.nodes.at(-1)?.when !== 'LIFETIME') {
    problems.push({ where: 'commitmentTimeline.nodes', what: 'must end at LIFETIME' });
  }

  const eggIds = new Set(easterEggs.map((e) => e.id));
  for (const id of EASTER_EGGS) {
    if (!eggIds.has(id)) problems.push({ where: `easterEggs.${id}`, what: 'missing definition' });
  }

  const drawIds = new Set(spontaneousPool.map((s) => s.id));
  if (drawIds.size !== spontaneousPool.length) {
    problems.push({
      where: 'spontaneousPool',
      what: 'duplicate ids — no-repeat logic depends on them',
    });
  }

  for (const [i, card] of blushLab.responses.mogra.entries())
    nonEmpty(`blushLab.responses.mogra[${i}]`, card);
  for (const [i, card] of blushLab.responses.coffee.entries())
    nonEmpty(`blushLab.responses.coffee[${i}]`, card);
  for (const [i, card] of blushLab.responses.cuddle.entries())
    nonEmpty(`blushLab.responses.cuddle[${i}]`, card);

  return problems;
}

if (import.meta.env.DEV) {
  const problems = checkContent();
  if (problems.length > 0) {
    console.error(
      '[content] structural problems found:\n' +
        problems.map((p) => `  · ${p.where}: ${p.what}`).join('\n'),
    );
  }
}
