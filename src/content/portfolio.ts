export const portfolio = {
  eyebrow: 'Section 02 · Portfolio',
  title: 'Previous deployments',
  lede: 'Three shipped projects, all still in production. References available on request.',
  /**
   * §10.4 — swap `image` for a real WebP in public/media/photos and add a
   * srcset entry. Leave `image` undefined to render the initials plate instead
   * of a photo, which is what ships until you pick the pictures.
   */
  deployments: [
    {
      id: 'sunday',
      name: 'Sunday',
      kind: 'Recurring ritual · v-many',
      summary:
        'A standing weekly release. No agenda, no deliverable, no reason needed. The most ' +
        'reliable thing on either calendar.',
      status: 'STABLE',
      alt: 'Placeholder for a Sunday photo',
    },
    {
      id: 'us',
      name: 'The Long Project',
      kind: 'Joint venture · ongoing',
      summary:
        'Two people, one direction, a shared backlog. Scope has only ever grown, and nobody has ' +
        'asked to reduce it.',
      status: 'SCALING',
      alt: 'Placeholder for an us photo',
    },
    {
      id: 'test-app-1',
      name: 'Test App 1',
      kind: 'Prototype · shipped anyway',
      summary:
        'The one that was never supposed to matter and somehow proved everything. Kept in ' +
        'production out of affection.',
      status: 'BELOVED',
      alt: 'Placeholder for a Test App 1 screenshot',
    },
  ],
  meter: {
    value: 87,
    label: 'Candidate readiness',
    note: 'The remaining 13% is reserved for surprises. It will never reach 100 on purpose.',
  },
  footnote: 'No project has ever been abandoned. Zero rollbacks on record.',
} as const;
