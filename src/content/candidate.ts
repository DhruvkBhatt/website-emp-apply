/**
 * §2 — ALL copy lives in this folder. Components import from here and never
 * hold strings of their own. Editing the site's words should never require
 * opening a component. See docs/CONTENT.md.
 *
 * §5 — everything in here is **Public tier**. No amounts, no full names, no
 * employers, no addresses, no transcript text. `npm run privacy` enforces this.
 */

export const candidate = {
  applicationId: 'QB × DKB / 2026 / LIFETIME',
  role: 'Life Partner',
  department: 'Forever',
  reportsTo: 'Management',
  employmentType: 'Permanent · Full-time · No probation requested',
  noticePeriod: 'None. Available immediately, and every day after that.',
  status: 'Application submitted. Awaiting review.',
  candidateName: 'The Candidate',
  managementName: 'Management',
} as const;

export const loader = {
  bootLines: [
    'initialising application portal',
    'verifying candidate credentials',
    'loading emotional dependencies',
    'compiling nine years of evidence',
    'warming up the good coffee',
    'portal ready',
  ],
  /** Shown under the boot log for returning visitors (§4). */
  returningLine: 'restoring session — welcome back, Management',
  cta: 'ENTER APPLICATION',
  skip: 'Skip the theatre',
} as const;

export const hero = {
  eyebrow: 'Application · Lifetime Position',
  title: 'Application for the Position of Life Partner',
  lede:
    'One candidate. One opening. A submission prepared with more care than any deck he has ever ' +
    'built for work.',
  meta: [
    { label: 'Position', value: candidate.role },
    { label: 'Department', value: candidate.department },
    { label: 'Reports to', value: candidate.reportsTo },
    { label: 'Notice period', value: candidate.noticePeriod },
  ],
  scrollHint: 'Scroll to review the submission',
  /** §4 — returning-visitor variant. */
  returning: {
    title: 'Welcome back, Management.',
    lede: 'Candidate application remains active. ❤️',
    cta: 'Jump to the decision',
    replay: 'Replay the acceptance screen',
  },
} as const;

export const nav = {
  motionToggleReduce: 'Reduce motion',
  motionToggleRestore: 'Restore motion',
  motionToggleAuto: 'Follow system',
  motionLabel: 'Animation',
  progressLabel: 'Application progress',
} as const;
