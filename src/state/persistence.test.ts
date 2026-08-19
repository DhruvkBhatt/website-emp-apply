import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { STORAGE_KEY, clearState, loadState, parseState, saveState } from '@/state/persistence';
import { initialState } from '@/state/reducer';
import { FOOD_SLA_LIMIT, type AppState } from '@/state/types';

const populated: AppState = {
  ...initialState,
  hasEntered: true,
  hasSeenGif: true,
  flowersDeployed: 3,
  coffeeSent: 4,
  hugRequested: 2,
  hoodieStolen: true,
  foodRejectCount: 5,
  compatibilityCompleted: true,
  spontaneousDrawn: ['drive', 'rain'],
  eggsFound: ['coffee', 'queen'],
  applicationSubmitted: true,
  managementDecision: 'accepted',
  managementUnlocked: true,
  reducedMotionOverride: true,
};

beforeEach(() => localStorage.clear());
afterEach(() => vi.restoreAllMocks());

describe('persistence — round trip', () => {
  it('saves and reloads every field', () => {
    expect(saveState(populated)).toBe(true);
    const loaded = loadState();
    expect(loaded).not.toBeNull();
    expect(loaded).toMatchObject({
      hasSeenGif: true,
      flowersDeployed: 3,
      coffeeSent: 4,
      hugRequested: 2,
      hoodieStolen: true,
      foodRejectCount: 5,
      compatibilityCompleted: true,
      spontaneousDrawn: ['drive', 'rain'],
      eggsFound: ['coffee', 'queen'],
      applicationSubmitted: true,
      managementDecision: 'accepted',
      managementUnlocked: true,
      reducedMotionOverride: true,
    });
  });

  it('never persists hasEntered, so the loader always replays (§4)', () => {
    saveState(populated);
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
    expect(raw).not.toHaveProperty('hasEntered');
    expect(loadState()?.hasEntered).toBe(false);
  });

  it('returns null when nothing has been stored', () => {
    expect(loadState()).toBeNull();
  });

  it('clears cleanly', () => {
    saveState(populated);
    clearState();
    expect(loadState()).toBeNull();
  });
});

describe('persistence — version and corruption handling', () => {
  it('discards a record from a different version rather than migrating', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...populated, version: 99 }));
    expect(loadState()).toBeNull();
  });

  it('discards a record with no version at all', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ coffeeSent: 3 }));
    expect(loadState()).toBeNull();
  });

  it('survives invalid JSON', () => {
    localStorage.setItem(STORAGE_KEY, '{ not json');
    expect(loadState()).toBeNull();
  });

  it('rejects non-objects', () => {
    expect(parseState(null)).toBeNull();
    expect(parseState('a string')).toBeNull();
    expect(parseState(42)).toBeNull();
  });
});

describe('persistence — hostile values are coerced, not trusted', () => {
  it('clamps the food counter to the SLA limit', () => {
    const parsed = parseState({ ...populated, foodRejectCount: 9001 });
    expect(parsed?.foodRejectCount).toBe(FOOD_SLA_LIMIT);
  });

  it('floors negative and fractional counters to zero-or-integer', () => {
    const parsed = parseState({ ...populated, coffeeSent: -5, flowersDeployed: 2.7 });
    expect(parsed?.coffeeSent).toBe(0);
    expect(parsed?.flowersDeployed).toBe(2);
  });

  it('drops unknown easter eggs and de-duplicates the rest', () => {
    const parsed = parseState({ ...populated, eggsFound: ['queen', 'queen', 'wat', 'coffee'] });
    expect(parsed?.eggsFound).toEqual(['queen', 'coffee']);
  });

  it('falls back to pending for an unrecognised decision', () => {
    const parsed = parseState({ ...populated, managementDecision: 'rejected' });
    expect(parsed?.managementDecision).toBe('pending');
  });

  it('falls back to null for a non-boolean motion override', () => {
    const parsed = parseState({ ...populated, reducedMotionOverride: 'yes' });
    expect(parsed?.reducedMotionOverride).toBeNull();
  });

  it('replaces a non-array spontaneous list with an empty one', () => {
    const parsed = parseState({ ...populated, spontaneousDrawn: 'drive' });
    expect(parsed?.spontaneousDrawn).toEqual([]);
  });
});

describe('persistence — storage that throws (§4: private-mode Safari)', () => {
  it('loadState returns null instead of crashing', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('QuotaExceededError');
    });
    expect(() => loadState()).not.toThrow();
    expect(loadState()).toBeNull();
  });

  it('saveState reports failure instead of crashing', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('QuotaExceededError');
    });
    expect(saveState(populated)).toBe(false);
  });

  it('clearState swallows the failure', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('QuotaExceededError');
    });
    expect(() => clearState()).not.toThrow();
  });

  it('survives getItem throwing after a successful probe', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('SecurityError');
    });
    expect(loadState()).toBeNull();
  });
});
