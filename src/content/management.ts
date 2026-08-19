/**
 * §5 — **Personal tier** copy: it sits behind the `#/management` passphrase
 * gate, but the gate is UX-only and this file ships in the bundle. So the test
 * for anything added here is: *would it embarrass either of you if a stranger
 * read it?* If yes, it does not belong in this file — it belongs in a
 * `<LockedPanel>` and a conversation.
 */

export const managementGate = {
  eyebrow: 'Restricted',
  title: '🔐 Management-only protocol',
  lede: 'This panel is for Management. If you are Management, you already know the phrase.',
  prompt: 'Passphrase',
  hintPrefix: 'Hint:',
  submit: 'Unlock',
  checking: 'Checking…',
  wrong: 'Not it. Try again — there is no lockout, and no penalty.',
  unconfigured:
    'No passphrase is configured for this build, so the panel is open. Set ' +
    'VITE_MANAGEMENT_PASSPHRASE_HASH before you send the link.',
  relock: 'Lock this panel',
  close: 'Back to the application',
  /** Fallback hint when VITE_MANAGEMENT_HINT is unset. §10.3: use an inside joke. */
  defaultHint: 'The thing only you would guess. Lowercase. Spaces are fine.',
} as const;

/** Shown inside the unlocked panel — Personal tier, deliberately restrained. */
export const managementPanel = {
  notes: [
    'You are the only person who has ever had access to this panel.',
    'The decision has no deadline. Nothing here expires.',
    'If you want to talk before deciding, that is the better option, and it always was.',
  ],
} as const;
