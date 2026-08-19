import { initialState } from './reducer';
import { EASTER_EGGS, FOOD_SLA_LIMIT, STATE_VERSION, type AppState } from './types';

export const STORAGE_KEY = 'pf.state.v1';

/**
 * §4 — every storage access is wrapped. Safari in private mode (and some
 * lockdown/ITP configurations) throws on `localStorage` access itself, and that
 * must never white-screen the site.
 */
function safeStorage(): Storage | null {
  try {
    const s = globalThis.localStorage;
    // Touching the object is not enough — probe a real write.
    const probe = '__pf_probe__';
    s.setItem(probe, '1');
    s.removeItem(probe);
    return s;
  } catch {
    return null;
  }
}

const isStringArray = (v: unknown): v is string[] =>
  Array.isArray(v) && v.every((x) => typeof x === 'string');

const clampCount = (v: unknown, max = Number.MAX_SAFE_INTEGER): number =>
  typeof v === 'number' && Number.isFinite(v) && v >= 0 ? Math.min(Math.floor(v), max) : 0;

/**
 * §4 / §2 — runtime shape check without pulling in zod. Anything unrecognised
 * falls back to the initial value for that field rather than failing the whole
 * load, but a version mismatch discards the record outright (no migrations —
 * single user, cheap).
 */
export function parseState(raw: unknown): AppState | null {
  if (typeof raw !== 'object' || raw === null) return null;
  const r = raw as Record<string, unknown>;
  if (r.version !== STATE_VERSION) return null;

  const decision = r.managementDecision;
  const eggs = isStringArray(r.eggsFound)
    ? r.eggsFound.filter((e): e is (typeof EASTER_EGGS)[number] =>
        (EASTER_EGGS as readonly string[]).includes(e),
      )
    : [];

  return {
    version: STATE_VERSION,
    // §4 — never restored; the loader replays on a fresh visit.
    hasEntered: false,
    hasSeenGif: r.hasSeenGif === true,
    flowersDeployed: clampCount(r.flowersDeployed),
    coffeeSent: clampCount(r.coffeeSent),
    hugRequested: clampCount(r.hugRequested),
    hoodieStolen: r.hoodieStolen === true,
    foodRejectCount: clampCount(r.foodRejectCount, FOOD_SLA_LIMIT),
    compatibilityCompleted: r.compatibilityCompleted === true,
    spontaneousDrawn: isStringArray(r.spontaneousDrawn) ? r.spontaneousDrawn : [],
    eggsFound: [...new Set(eggs)],
    applicationSubmitted: r.applicationSubmitted === true,
    managementDecision:
      decision === 'accepted' || decision === 'clarification' ? decision : 'pending',
    managementUnlocked: r.managementUnlocked === true,
    reducedMotionOverride:
      typeof r.reducedMotionOverride === 'boolean' ? r.reducedMotionOverride : null,
  };
}

export function loadState(): AppState | null {
  const storage = safeStorage();
  if (!storage) return null;
  try {
    const json = storage.getItem(STORAGE_KEY);
    if (!json) return null;
    return parseState(JSON.parse(json));
  } catch {
    // Corrupt JSON is treated exactly like a version mismatch: discard.
    return null;
  }
}

export function saveState(state: AppState): boolean {
  const storage = safeStorage();
  if (!storage) return false;
  try {
    // `hasEntered` is deliberately dropped on the way out too, so a record
    // written mid-session can never skip the loader on the next visit.
    const { hasEntered: _hasEntered, ...persisted } = state;
    storage.setItem(STORAGE_KEY, JSON.stringify(persisted));
    return true;
  } catch {
    // Quota exceeded or private mode — the site keeps working, in memory only.
    return false;
  }
}

export function clearState(): void {
  const storage = safeStorage();
  if (!storage) return;
  try {
    storage.removeItem(STORAGE_KEY);
  } catch {
    /* nothing we can or should do */
  }
}

export { initialState };
