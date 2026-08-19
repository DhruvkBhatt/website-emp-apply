import type { EasterEgg } from '@/state/types';

/** §2 — the spontaneous-mode pool. Each entry is drawn at most once (§4). */
export const spontaneousPool = [
  { id: 'drive', text: 'A drive at 11 p.m. with no destination and the good playlist.' },
  { id: 'breakfast', text: 'Breakfast somewhere neither of us has been, on a weekday.' },
  { id: 'flowers', text: 'Flowers on an ordinary Wednesday, for no stated reason.' },
  { id: 'train', text: 'A train ticket bought the same morning we leave.' },
  { id: 'kitchen', text: 'Cooking something ambitious badly, together, at midnight.' },
  { id: 'rain', text: 'Dropping everything the first time it properly rains.' },
  { id: 'photo', text: 'A photo booth, four frames, one of them ruined on purpose.' },
  { id: 'bookshop', text: 'A bookshop, one hour, we each pick for the other.' },
  { id: 'rooftop', text: 'Somewhere high up, at sunset, phones face-down.' },
] as const;

export interface EggDefinition {
  id: EasterEgg;
  /** How it is found — written for the maintainer, never shown to the user. */
  how: string;
  title: string;
  body: string;
}

/**
 * §7 — eggs are enhancements only. Every one is reachable by tap as well as by
 * keyboard/hover, and none of them is the sole path to any content.
 */
export const easterEggs: readonly EggDefinition[] = [
  {
    id: 'coffee',
    how: 'Send coffee 3× in the Blush Lab.',
    title: 'Barista privileges granted',
    body: 'Three cups. Standing order confirmed, permanently, no confirmation needed again.',
  },
  {
    id: 'blanket',
    how: 'Tap the blanket-equity benefit 5×.',
    title: 'Blanket equity: controlling stake',
    body: 'Ownership transferred in full. He will be cold. He considers this a fair trade.',
  },
  {
    id: 'name',
    how: 'Tap the application ID in the hero.',
    title: 'Application ID decoded',
    body: 'Two initials, one year, one word. That is the entire filing system.',
  },
  {
    id: 'mangalsutra',
    how: 'Tap Phase 3 of the jewellery roadmap.',
    title: 'Phase 3, noted',
    body: 'Traditions respected. Your opinion still outranks everyone in the room.',
  },
  {
    id: 'queen',
    how: 'Type "queen" anywhere. Also reachable by tapping the crown in the footer.',
    title: '👑 Access level: Queen',
    body: 'Highest clearance in the organisation. Retroactive to the day we met.',
  },
];

export const eggsUi = {
  title: 'Hidden findings',
  found: (n: number, total: number) => `${n} of ${total} found`,
  hintLabel: 'Reveal how to find the rest',
  allFound: 'Everything found. There is nothing left hidden — which was also the point.',
  crownLabel: 'Crown',
} as const;
