/** PLAN §4 — state machine types. */

export type ManagementDecision = 'pending' | 'accepted' | 'clarification';

export type EasterEgg = 'blanket' | 'coffee' | 'name' | 'mangalsutra' | 'queen';

export const EASTER_EGGS: readonly EasterEgg[] = [
  'blanket',
  'coffee',
  'name',
  'mangalsutra',
  'queen',
];

/** §4 — the food simulator breaches its SLA at exactly this many rejections. */
export const FOOD_SLA_LIMIT = 5;

export const STATE_VERSION = 1;

export interface AppState {
  version: typeof STATE_VERSION;
  hasEntered: boolean;
  hasSeenGif: boolean;
  flowersDeployed: number;
  coffeeSent: number;
  hugRequested: number;
  hoodieStolen: boolean;
  /** 0..FOOD_SLA_LIMIT — clamped, never exceeds the limit. */
  foodRejectCount: number;
  compatibilityCompleted: boolean;
  /** Spontaneous-mode draws already shown, so we don't repeat. */
  spontaneousDrawn: string[];
  eggsFound: EasterEgg[];
  applicationSubmitted: boolean;
  managementDecision: ManagementDecision;
  /** Personal-tier gate (§5). UX-only — the bundle is still readable. */
  managementUnlocked: boolean;
  /** null = follow the OS. true = force reduced. false = force full. */
  reducedMotionOverride: boolean | null;
}

export type Action =
  | { type: 'enter' }
  | { type: 'gifSeen' }
  | { type: 'deployFlowers' }
  | { type: 'sendCoffee' }
  | { type: 'requestHug' }
  | { type: 'stealHoodie' }
  | { type: 'rejectFood' }
  | { type: 'resetFood' }
  | { type: 'completeCompatibility' }
  | { type: 'drawSpontaneous'; id: string }
  | { type: 'resetSpontaneous' }
  | { type: 'findEgg'; egg: EasterEgg }
  | { type: 'submitApplication' }
  | { type: 'decide'; decision: ManagementDecision }
  | { type: 'unlockManagement' }
  | { type: 'lockManagement' }
  | { type: 'setReducedMotion'; value: boolean | null }
  | { type: 'hydrate'; state: AppState }
  | { type: 'reset' };
