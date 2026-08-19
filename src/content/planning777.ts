export const planning777 = {
  eyebrow: 'Section 04 · Operating Model',
  title: 'The 7 · 7 · 7 plan',
  lede: 'Three horizons, one direction. Reviewed together, not decided alone.',
  nodes: [
    {
      key: '7 days',
      title: 'Seven days',
      body: 'Small, deliberate, unmissable. One thing a week that says you were thought about.',
      examples: ['A call with no purpose', 'The good coffee, delivered', 'Plans made, not floated'],
    },
    {
      key: '7 months',
      title: 'Seven months',
      body: 'Enough runway to build something visible. Habits become defaults.',
      examples: [
        'One trip that is only ours',
        'Families comfortable, not just polite',
        'A shared plan',
      ],
    },
    {
      key: '7 years',
      title: 'Seven years',
      body: 'The version of us that people quietly use as a reference.',
      examples: [
        'A home that sounds like us',
        'Two careers, neither sacrificed',
        'Still choosing this',
      ],
    },
  ],
  split: {
    label: 'Planned vs spontaneous',
    plannedPct: 80,
    plannedLabel: '80% planned',
    spontaneousLabel: '20% spontaneous',
    note: 'The 80 is a promise. The 20 is why it stays interesting.',
  },
  spontaneous: {
    button: 'Engage spontaneous mode',
    again: 'Draw another',
    exhausted: 'That is the whole pool. Ask me in person for more.',
    caption: 'Drawn at random. No repeats.',
  },
} as const;
