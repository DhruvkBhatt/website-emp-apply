import {
  EASTER_EGGS,
  FOOD_SLA_LIMIT,
  STATE_VERSION,
  type Action,
  type AppState,
  type EasterEgg,
} from './types';

export const initialState: AppState = {
  version: STATE_VERSION,
  hasEntered: false,
  hasSeenGif: false,
  flowersDeployed: 0,
  coffeeSent: 0,
  hugRequested: 0,
  hoodieStolen: false,
  foodRejectCount: 0,
  compatibilityCompleted: false,
  spontaneousDrawn: [],
  eggsFound: [],
  applicationSubmitted: false,
  managementDecision: 'pending',
  managementUnlocked: false,
  reducedMotionOverride: null,
};

const addEgg = (found: EasterEgg[], egg: EasterEgg): EasterEgg[] =>
  found.includes(egg) ? found : [...found, egg];

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'enter':
      return state.hasEntered ? state : { ...state, hasEntered: true };

    case 'gifSeen':
      return state.hasSeenGif ? state : { ...state, hasSeenGif: true };

    case 'deployFlowers':
      return { ...state, flowersDeployed: state.flowersDeployed + 1 };

    case 'sendCoffee': {
      const coffeeSent = state.coffeeSent + 1;
      // §2 useClickStreak: 3× coffee unlocks the coffee egg.
      return {
        ...state,
        coffeeSent,
        eggsFound: coffeeSent >= 3 ? addEgg(state.eggsFound, 'coffee') : state.eggsFound,
      };
    }

    case 'requestHug':
      return { ...state, hugRequested: state.hugRequested + 1 };

    case 'stealHoodie':
      return state.hoodieStolen ? state : { ...state, hoodieStolen: true };

    case 'rejectFood':
      // §4 — clamped at the SLA limit. Rejecting again once breached is a no-op
      // so the breach copy stays stable and the counter can't run away.
      return state.foodRejectCount >= FOOD_SLA_LIMIT
        ? state
        : { ...state, foodRejectCount: state.foodRejectCount + 1 };

    case 'resetFood':
      return state.foodRejectCount === 0 ? state : { ...state, foodRejectCount: 0 };

    case 'completeCompatibility':
      return state.compatibilityCompleted ? state : { ...state, compatibilityCompleted: true };

    case 'drawSpontaneous':
      return state.spontaneousDrawn.includes(action.id)
        ? state
        : { ...state, spontaneousDrawn: [...state.spontaneousDrawn, action.id] };

    case 'resetSpontaneous':
      return state.spontaneousDrawn.length === 0 ? state : { ...state, spontaneousDrawn: [] };

    case 'findEgg': {
      if (!EASTER_EGGS.includes(action.egg)) return state;
      const eggsFound = addEgg(state.eggsFound, action.egg);
      return eggsFound === state.eggsFound ? state : { ...state, eggsFound };
    }

    case 'submitApplication':
      return state.applicationSubmitted ? state : { ...state, applicationSubmitted: true };

    case 'decide':
      // A decision is only meaningful once the application exists.
      if (!state.applicationSubmitted) return state;
      return state.managementDecision === action.decision
        ? state
        : { ...state, managementDecision: action.decision };

    case 'unlockManagement':
      return state.managementUnlocked ? state : { ...state, managementUnlocked: true };

    case 'lockManagement':
      return state.managementUnlocked ? { ...state, managementUnlocked: false } : state;

    case 'setReducedMotion':
      return state.reducedMotionOverride === action.value
        ? state
        : { ...state, reducedMotionOverride: action.value };

    case 'hydrate':
      // Persisted state never restores `hasEntered` (§4) — the loader replays.
      return { ...action.state, hasEntered: state.hasEntered };

    case 'reset':
      return { ...initialState, hasEntered: state.hasEntered };

    default:
      return state;
  }
}

/** §4 — has the candidate blown the food SLA? */
export const isFoodSlaBreached = (state: AppState): boolean =>
  state.foodRejectCount >= FOOD_SLA_LIMIT;

export const allEggsFound = (state: AppState): boolean =>
  EASTER_EGGS.every((egg) => state.eggsFound.includes(egg));

/** §4 — a returning visitor gets the short loader and the "welcome back" hero. */
export const isReturningVisitor = (state: AppState): boolean => state.applicationSubmitted;
