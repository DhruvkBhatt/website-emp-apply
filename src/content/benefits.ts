export const benefits = {
  eyebrow: 'Section 17 · Benefits',
  title: 'What the position offers',
  lede: 'Stated by the candidate, on behalf of the candidate. Non-negotiable, all of it.',
  items: [
    { icon: '∞', title: 'Unlimited patience', body: 'No accrual, no cap, no approval workflow.' },
    {
      icon: '☕',
      title: 'Coffee, correctly made',
      body: 'Your order memorised. Never asked again.',
    },
    {
      icon: '🛏',
      title: 'Blanket equity',
      body: 'A controlling stake, transferred permanently to you.',
    },
    { icon: '☂', title: 'Bad-day cover', body: 'Full coverage. No deductible, no waiting period.' },
    { icon: '🔊', title: 'Loudest advocate', body: 'In every room, whether or not you are in it.' },
    {
      icon: '🏠',
      title: 'Somewhere to be unfiltered',
      body: 'No performance clause in this contract.',
    },
  ],
} as const;

export const seriousMessage = {
  eyebrow: 'No animations here',
  /** §3 / §8 — theme `intimate`, motion deliberately off. Read it aloud. */
  title: 'The part that is not a joke',
  paragraphs: [
    'The whole site is a bit. This part is not.',
    'I built all of this because I wanted the asking to look like the amount you are worth, and ' +
      'because you deserve to see effort, not just hear about it.',
    'I am not asking you to be impressed. I am asking you to be in this — properly, out loud, with ' +
      'your name next to mine and no ambiguity left over.',
    'I will get things wrong. I will be tired and short and occasionally useless. I will keep ' +
      'choosing you on those days too, and I will say so rather than assume you know.',
    'That is the whole application. Everything above it is decoration.',
  ],
  signature: '— The candidate',
} as const;

export const applyNow = {
  eyebrow: 'Section 18 · Submission',
  title: 'Submit application',
  lede: 'The checklist has to be complete before submission. It already is.',
  checklist: [
    'Nine years of evidence attached',
    'References: unnecessary, but available',
    'Competing offers: none, historically or otherwise',
    'Intentions: serious, stated in writing',
    'Notice period: none',
    'Willing to be told when he is wrong',
  ],
  submit: 'APPLY NOW',
  submitting: 'SUBMITTING…',
  submitted: 'APPLICATION SUBMITTED',
  sequence: [
    { label: 'validating candidate', status: 'PASS' as const },
    { label: 'attaching nine years of evidence', status: 'PASS' as const },
    { label: 'checking for competing offers', status: 'PASS' as const, detail: 'none found' },
    { label: 'notifying management', status: 'PASS' as const },
    { label: 'awaiting decision', status: 'RUN' as const },
  ],
  afterSubmit: 'Status: submitted. The decision is entirely yours, and there is no deadline on it.',
} as const;

export const declaration = {
  eyebrow: 'Declaration',
  title: 'Candidate declaration',
  body:
    'I confirm that everything in this application is true, that I have not exaggerated a single ' +
    'clause, and that I would submit it again tomorrow.',
  signedAs: 'Signed, electronically and otherwise',
} as const;

export const management = {
  eyebrow: 'Management only',
  title: 'Decision portal',
  lede: 'Two options. Both of them are fine. One of them is being hoped for.',
  notSubmitted: 'There is nothing to decide yet — the application has not been submitted.',
  accept: 'ACCEPT APPLICATION',
  clarify: 'SCHEDULE FURTHER CLARIFICATION',
  /** §10.5 — the clarification path opens a real WhatsApp deep link. */
  clarifyMessage:
    "I've reviewed the application. I have questions. Schedule further clarification immediately.",
  clarifyFallback:
    'No number configured for this build. Set VITE_CLARIFICATION_WHATSAPP, or just tell him in person.',
  decided: {
    accepted: 'Decision recorded: ACCEPTED.',
    clarification: 'Decision recorded: FURTHER CLARIFICATION REQUESTED.',
  },
  change: 'Change decision',
} as const;

export const acceptance = {
  eyebrow: 'Offer accepted',
  title: 'Welcome to forever.',
  lede: 'Position filled. Permanently. No further applications will be accepted.',
  lines: [
    { label: 'offer accepted', status: 'PASS' as const },
    { label: 'start date', status: 'INFO' as const, detail: 'immediately' },
    { label: 'contract length', status: 'INFO' as const, detail: 'lifetime' },
    { label: 'probation period', status: 'INFO' as const, detail: 'waived' },
    { label: 'position closed to other candidates', status: 'PASS' as const },
  ],
  callback: 'Now — get over here.',
  replay: 'Replay this',
  close: 'Close',
  footer: 'Filed under: the best thing that ever happened to either of us.',
} as const;

export const footer = {
  built: 'Built by hand, over several late nights, for one person.',
  privacy: 'No analytics. No tracking. Nothing leaves this device.',
  resetLabel: 'Reset my progress on this device',
  resetConfirm: 'Progress cleared. Refresh to start from the top.',
  storageWarning:
    'Progress cannot be saved on this device (private browsing?). Everything still works — it just ' +
    'will not be remembered.',
} as const;
