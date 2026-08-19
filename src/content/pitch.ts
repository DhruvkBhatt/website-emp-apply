export const pitch = {
  eyebrow: 'Section 01 · Executive Summary',
  title: 'Why this candidate',
  lede: 'Four claims. Each one has evidence later in this document.',
  cards: [
    {
      icon: '◆',
      title: 'Consistency over intensity',
      body:
        'Not the loudest effort — the repeatable kind. Shows up the same on ordinary Tuesdays as ' +
        'on anniversaries.',
      metric: 'Uptime: every day so far',
    },
    {
      icon: '◇',
      title: 'Listens, then acts',
      body:
        'Remembers the small things that were only mentioned once. Turns them into plans without ' +
        'being asked twice.',
      metric: 'Recall: uncomfortably good',
    },
    {
      icon: '◈',
      title: 'Builds for the long term',
      body:
        'Thinks in decades, not weekends. Every decision is checked against the version of us at ' +
        'seventy.',
      metric: 'Horizon: lifetime',
    },
    {
      icon: '◉',
      title: 'Safe to be unfiltered around',
      body:
        'No performance required. Bad days, bad hair, bad moods — all in scope, none of them a ' +
        'problem.',
      metric: 'Judgement: none on record',
    },
  ],
} as const;
