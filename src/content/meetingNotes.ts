/**
 * §5.1 — HARD RULE: no raw transcript, no verbatim call notes, no automated
 * transcript file. Only the paraphrased "What I Heard" list below.
 */
export const meetingNotes = {
  eyebrow: 'Section 03 · Meeting Notes',
  title: 'What I heard',
  lede: 'Paraphrased, from memory, on purpose.',
  typewriterIntro: 'Reviewing notes from the last conversation…',
  heard: [
    'That you want to be chosen out loud, not quietly assumed.',
    'That effort matters more to you than expense.',
    'That being tired is allowed, and being looked after while tired matters more.',
    'That you want a partner, not a project manager.',
    'That you would rather hear the plan than be surprised by the outcome.',
    'That you noticed the small thing I did in October, and you never said so.',
  ],
  closing: 'Noted. Filed. Acted on.',
  disclaimer: 'No recordings. No transcripts. Just what stayed with me.',
} as const;
