export const getOverHere = {
  eyebrow: 'Interlude',
  title: 'GET OVER HERE',
  lede: 'One-shot. Plays once, then behaves.',
  gifSrc: 'media/gif/get-over-here.gif',
  gifAlt: 'A dramatic "get over here" gesture, played for effect',
  /** §7 — the static equivalent shown under reduced motion. */
  staticLine: 'GET OVER HERE. (Imagine it delivered with full dramatic commitment.)',
  replay: 'Play it again',
  caption: 'Requested formally. Enforced affectionately.',
  missingAssetNote:
    'GIF not added yet — drop a file at public/media/gif/get-over-here.gif (≤ 2 MB, §7).',
} as const;

export const compatibility = {
  eyebrow: 'Section 08 · Compatibility Report',
  title: 'Compatibility analysis',
  lede: 'Run against nine years of production data.',
  runLabel: 'Run compatibility check',
  runningLabel: 'Running…',
  checks: [
    { label: 'Sense of humour · alignment', status: 'PASS' as const },
    { label: 'Argument recovery time', status: 'PASS' as const, detail: 'well under target' },
    { label: 'Silence tolerance · comfortable', status: 'PASS' as const },
    { label: 'Long-term direction · matched', status: 'PASS' as const },
    { label: 'Family compatibility', status: 'PASS' as const },
    { label: 'Music taste · overlap', status: 'FAIL' as const, detail: 'acceptable, non-blocking' },
    { label: 'Sleep schedule · overlap', status: 'FAIL' as const, detail: 'being worked on' },
    { label: 'Choosing each other again · daily', status: 'PASS' as const },
  ],
  score: {
    value: 99.99,
    label: 'Overall compatibility',
    note: 'The missing 0.01% is the music. It stays in the report for honesty.',
  },
  verdict: 'RECOMMENDED FOR IMMEDIATE APPOINTMENT',
} as const;

export const decisionArchitecture = {
  eyebrow: 'Section 09 · Decision Architecture',
  title: 'How decisions get made',
  lede: 'Written down so it is never improvised in the middle of an argument.',
  tiers: [
    {
      tier: 'Yours',
      body: 'Anything about your body, your career, your friendships, your time. No vote required.',
    },
    {
      tier: 'Mine',
      body: 'My work, my health, my discipline. Mine to fix, yours to hear about.',
    },
    {
      tier: 'Ours',
      body: 'Money, home, family, moving, timing. Neither of us proceeds on these alone.',
    },
    {
      tier: 'Deadlocked',
      body: 'Whoever cares more, wins — stated out loud, not guessed at. Nobody keeps score.',
    },
  ],
  rule: 'Nothing in the "Ours" tier gets decided by silence.',
} as const;

export const financePhilosophy = {
  eyebrow: 'Section 10 · Financial Philosophy',
  title: 'Money, as a philosophy',
  /** §5.2 — HARD RULE: no amounts anywhere. Buckets and principles only. */
  lede: 'Four buckets, no numbers. The numbers are a conversation, not a webpage.',
  buckets: [
    { name: 'Today', body: 'Ordinary life, run without anxiety. Groceries, fuel, small joys.' },
    {
      name: 'Together',
      body: 'Trips, celebrations, the things we will still talk about in ten years.',
    },
    { name: 'Tomorrow', body: 'Boring, automated, untouched. The reason we sleep well.' },
    { name: 'Trouble', body: 'Never spent. Exists so that an emergency is never also a crisis.' },
  ],
  principles: [
    'Full visibility, both ways. No separate secrets, no surprise debts.',
    'Neither income is "the main one".',
    'Generosity to family is planned for, not argued about.',
  ],
  locked: {
    title: 'Actual figures',
    note: 'Numbers belong in a conversation with a whiteboard, not in a public repository.',
  },
} as const;

export const jewelryRoadmap = {
  eyebrow: 'Section 11 · Roadmap',
  title: 'Jewellery roadmap',
  /** §5.2 / §8 — four phases, no budget. Do not add one. */
  lede: 'Four phases. No prices. Your taste is the only requirement gathered.',
  phases: [
    {
      phase: 'Phase 1',
      title: 'Something small, soon',
      body: 'Everyday wear. Chosen for how often you would actually reach for it.',
    },
    {
      phase: 'Phase 2',
      title: 'The one that means something',
      body: 'Designed around what you said you liked, not what is easy to buy.',
    },
    {
      phase: 'Phase 3',
      title: 'The formal one',
      body: 'Families involved. Traditions respected. Your opinion outranks everyone in the room.',
    },
    {
      phase: 'Phase 4',
      title: 'The one you help design',
      body: 'Not a surprise. A collaboration. The best version of this is one you shaped.',
    },
  ],
  lockedTitle: 'Specifications and timing',
  lockedNote: 'Requirements gathered. Details deliberately unwritten.',
} as const;

export const fitnessPlan = {
  eyebrow: 'Section 12 · Health',
  title: 'Fitness and health plan',
  lede: 'Not about appearance. About being around, and being able, for a long time.',
  commitments: [
    {
      label: 'Consistency',
      body: 'Movement most days. No dramatic transformations, no crash anything.',
    },
    {
      label: 'Together where it helps',
      body: 'Walks, cooking, sleep at sane hours. Company, not pressure.',
    },
    {
      label: 'Never a comment on your body',
      body: 'Encouragement only where invited. That line does not move.',
    },
    {
      label: 'Actual doctors',
      body: 'Check-ups booked, not postponed. Both of us, not just you nagging me.',
    },
  ],
  target: 'Objective: still walking up the hill together at seventy.',
} as const;

export const familyIntegration = {
  eyebrow: 'Section 13 · Integration',
  /** §5.3 — no full names, employers, or addresses. Ever. */
  title: 'Family integration',
  lede: 'Two families, handled with intent rather than left to chance.',
  commitments: [
    'Your family is not a duty to me. I will show up for them without being reminded.',
    'You are never the sole translator between them and me.',
    'Nothing about our plans gets announced to either family before we have agreed it.',
    'Boundaries get held by me, not delegated to you.',
    'Festivals, hospitals, small Sundays. All of it, not just the photographed parts.',
  ],
  closing: 'You will never have to choose between them and this.',
} as const;

export const careerSupport = {
  eyebrow: 'Section 14 · Career',
  title: 'Career support clause',
  lede: 'Your ambition is not a variable to be balanced against mine.',
  commitments: [
    { label: 'No shrinking', body: 'You never make yourself smaller so this is easier to manage.' },
    {
      label: 'Relocation is mutual',
      body: 'If a move is right for you, it is on the table for both of us.',
    },
    {
      label: 'Load-shifting',
      body: 'When your quarter is brutal, the house is mine to run. Reciprocated.',
    },
    {
      label: 'Loudest advocate',
      body: 'In rooms you are not in, I say your name correctly and often.',
    },
  ],
} as const;

export const exclusivity = {
  eyebrow: 'Section 15 · Terms',
  title: 'Exclusivity clause',
  lede: 'Short section. Nothing here needs elaboration.',
  terms: [
    'One candidate. One position. No parallel applications, none ever considered.',
    'No competing offers entertained, historically or going forward.',
    'This clause has no expiry, no renewal date, and no escape provision.',
  ],
  seal: 'Signed by the candidate, unprompted.',
} as const;

export const commitmentTimeline = {
  eyebrow: 'Section 16 · Timeline',
  title: 'Commitment timeline',
  lede: 'From today to the end. Dates deliberately soft; direction deliberately not.',
  nodes: [
    { when: 'TODAY', title: 'Application submitted', detail: 'This page. Right now.' },
    {
      when: 'SOON',
      title: 'Said out loud, in person',
      detail: 'Not left to a website to do the work.',
    },
    {
      when: 'THIS YEAR',
      title: 'Families, properly',
      detail: 'Introductions with intent behind them.',
    },
    { when: 'NEXT', title: 'A plan with dates on it', detail: 'Made together, at your pace.' },
    { when: 'THEN', title: 'A home that sounds like us', detail: 'Loud kitchen, good speakers.' },
    { when: 'LIFETIME', title: 'Still choosing this', detail: 'The only clause that matters.' },
  ],
} as const;
