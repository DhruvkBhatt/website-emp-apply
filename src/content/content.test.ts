import { describe, expect, it } from 'vitest';
import { checkContent } from '@/content';
import { candidate, hero, loader } from '@/content/candidate';
import * as roadmap from '@/content/roadmap';
import * as warmthContent from '@/content/warmth';
import * as benefitsContent from '@/content/benefits';
import * as pitchContent from '@/content/pitch';
import * as portfolioContent from '@/content/portfolio';
import * as notes from '@/content/meetingNotes';
import * as plan777 from '@/content/planning777';
import * as surprises from '@/content/surprises';
import * as managementContent from '@/content/management';

describe('content — structural shape check (§2)', () => {
  it('has no structural problems', () => {
    expect(checkContent()).toEqual([]);
  });
});

/**
 * §5.2 / §5.3 — the privacy denylist as a unit test, so a violation fails
 * locally and in CI even if someone commits with --no-verify.
 */
const ALL_COPY = JSON.stringify({
  candidate,
  hero,
  loader,
  ...roadmap,
  ...warmthContent,
  ...benefitsContent,
  ...pitchContent,
  ...portfolioContent,
  ...notes,
  ...plan777,
  ...surprises,
  ...managementContent,
});

describe('content — privacy hard rules', () => {
  it('contains no currency symbols or amounts (§5.2)', () => {
    expect(ALL_COPY).not.toMatch(/₹/);
    expect(ALL_COPY).not.toMatch(/\$\d/);
    expect(ALL_COPY).not.toMatch(/\b(?:rs\.?|inr|usd)\s?\d/i);
    expect(ALL_COPY).not.toMatch(/\b\d+\s?(?:lakh|crore)\b/i);
  });

  it('mentions no salary, account or transcript material (§5.1, §5.2)', () => {
    expect(ALL_COPY).not.toMatch(/\bsalary\b/i);
    expect(ALL_COPY).not.toMatch(/\bctc\b/i);
    expect(ALL_COPY).not.toMatch(/account number|ifsc|upi id/i);
    // "transcript" is allowed in exactly one place: the line that promises
    // there isn't one.
    const transcriptHits = ALL_COPY.match(/transcript/gi) ?? [];
    expect(transcriptHits.length).toBeLessThanOrEqual(2);
  });

  it('keeps the finance section to buckets and principles only', () => {
    const finance = JSON.stringify(roadmap.financePhilosophy);
    expect(finance).not.toMatch(/\d{3,}/);
    expect(roadmap.financePhilosophy.buckets).toHaveLength(4);
  });

  it('keeps the jewellery roadmap free of any budget (§5.2, §8)', () => {
    const jewelry = JSON.stringify(roadmap.jewelryRoadmap);
    // Amounts, not words: the copy is allowed to *say* "No prices", which is
    // the point of the section. What it must never contain is a figure.
    expect(jewelry).not.toMatch(/₹|\$\d|\b\d[\d,.]*\s?(?:k|lakh|crore|rupees|dollars)\b/i);
    expect(jewelry).not.toMatch(/\bbudget\b/i);
    // Phase numbering is the only place digits are expected. The eyebrow's
    // section number is excluded — it isn't copy, it's a label.
    const { eyebrow: _eyebrow, ...body } = roadmap.jewelryRoadmap;
    const digits = JSON.stringify(body).match(/\d+/g) ?? [];
    expect(digits).toEqual(['1', '2', '3', '4']);
  });
});

describe('content — narrative invariants the sections depend on', () => {
  it('ends the commitment timeline at LIFETIME (§8)', () => {
    expect(roadmap.commitmentTimeline.nodes.at(-1)?.when).toBe('LIFETIME');
    expect(roadmap.commitmentTimeline.nodes[0]?.when).toBe('TODAY');
  });

  it('keeps the portfolio meter at 87% (§8)', () => {
    expect(portfolioContent.portfolio.meter.value).toBe(87);
  });

  it('keeps compatibility at 99.99% with at least one honest FAIL', () => {
    expect(roadmap.compatibility.score.value).toBe(99.99);
    expect(roadmap.compatibility.checks.some((c) => c.status === 'FAIL')).toBe(true);
  });

  it('keeps the 777 plan at three horizons and an 80/20 split', () => {
    expect(plan777.planning777.nodes).toHaveLength(3);
    expect(plan777.planning777.split.plannedPct).toBe(80);
  });

  it('gives every easter egg a findable route written down', () => {
    for (const egg of surprises.easterEggs) {
      expect(egg.how.trim().length).toBeGreaterThan(0);
      expect(egg.title.trim().length).toBeGreaterThan(0);
    }
  });
});
