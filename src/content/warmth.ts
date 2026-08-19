export const warmth = {
  eyebrow: 'Section 05 · Warmth Protocol',
  title: 'The warmth protocol',
  lede: 'Standard operating procedure for the days that are heavy.',
  steps: [
    { trigger: 'You go quiet', response: 'I come closer, not further. No interrogation.' },
    { trigger: 'You are exhausted', response: 'Food appears. Decisions get taken off your plate.' },
    { trigger: 'You are upset with me', response: 'I listen first. Defend later, if at all.' },
    { trigger: 'You are cold', response: 'Blanket, then hoodie, then me. In that order.' },
    {
      trigger: 'You are winning at something',
      response: 'Loudest person in the room. Every time.',
    },
  ],
  guarantee: 'No day is ever handled alone. That is the entire protocol.',
} as const;

export const blushLab = {
  eyebrow: 'Section 06 · Blush Lab',
  title: 'Blush lab',
  lede: 'Four controls. All of them do something. Press them in any order.',
  buttons: {
    mogra: { label: 'Deploy mogra', running: 'Deploying…', done: 'Mogra deployed' },
    coffee: { label: 'Send coffee', running: 'Brewing…', done: 'Coffee sent' },
    cuddle: { label: 'Request cuddle', running: 'Routing…', done: 'Request approved' },
    hoodie: { label: 'Steal hoodie', running: 'Attempting…', done: 'Hoodie relocated' },
  },
  responses: {
    mogra: [
      'Mogra deployed to your side of the room. Scent will linger longer than the flowers.',
      'Second batch deployed. The room now smells like a decision already made.',
      'Supply chain confirms: unlimited stock, permanent standing order.',
    ],
    coffee: [
      'Coffee dispatched. Exactly the way you take it — no confirmation needed.',
      'Second cup. Nobody is counting.',
      'Third cup logged. You have unlocked something. Keep going.',
    ],
    cuddle: [
      'Request approved without review. There is no approval queue for this.',
      'Approved again. There will never be a rate limit.',
      'Standing approval granted retroactively for all past and future requests.',
    ],
  },
  hoodie403: {
    code: '403',
    title: 'Forbidden',
    body: 'That hoodie is already yours. It has been since the first time you wore it home.',
    dismiss: 'Understood',
  },
} as const;

export const foodSimulator = {
  eyebrow: 'Section 07 · Food Decision Simulator',
  title: 'What do you want to eat?',
  lede: 'Standard protocol. Reject as many as you like.',
  options: [
    'The usual place',
    'Something new, mid-range',
    'Whatever is closest',
    'Homemade, together',
    'Dessert first, dinner later',
    'The place with the good paneer',
    'Street food, no plan',
  ],
  reject: 'Not that',
  accept: 'Yes, that one',
  reset: 'Start over',
  /** One line per rejection count, index = rejections so far. */
  reactions: [
    'Taking your order.',
    'Noted. Recalculating.',
    'Still fine. Genuinely.',
    'Confidence dropping. Patience holding.',
    'One option left in the buffer.',
  ],
  slaBreach: {
    badge: 'SLA BREACH',
    title: 'Five rejections. Escalating.',
    body:
      'Decision authority transferred to the candidate. He will pick, you will like it, and if you ' +
      'do not, he will fix it without being asked.',
    resolution: 'Resolution: he decides tonight. Order placed.',
  },
  accepted: {
    title: 'Locked in.',
    body: 'That was the answer the whole time. It always is.',
  },
} as const;
