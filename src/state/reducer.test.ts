import { describe, expect, it } from 'vitest';
import {
  allEggsFound,
  initialState,
  isFoodSlaBreached,
  isReturningVisitor,
  reducer,
} from '@/state/reducer';
import { EASTER_EGGS, FOOD_SLA_LIMIT, type Action, type AppState } from '@/state/types';

/** Apply a list of actions in order — keeps the SLA tests readable. */
const run = (actions: Action[], from: AppState = initialState): AppState =>
  actions.reduce(reducer, from);

describe('reducer — basic transitions', () => {
  it('starts from a clean, pending state', () => {
    expect(initialState.applicationSubmitted).toBe(false);
    expect(initialState.managementDecision).toBe('pending');
    expect(initialState.foodRejectCount).toBe(0);
    expect(initialState.eggsFound).toEqual([]);
  });

  it('is a no-op for unknown actions', () => {
    expect(reducer(initialState, { type: 'nope' } as unknown as Action)).toBe(initialState);
  });

  it('returns the identical object when nothing changes', () => {
    const entered = reducer(initialState, { type: 'enter' });
    // Referential equality matters: it's what stops the persistence effect
    // from writing on every render.
    expect(reducer(entered, { type: 'enter' })).toBe(entered);
    expect(reducer(initialState, { type: 'resetFood' })).toBe(initialState);
  });

  it('counts flowers, coffee and hugs independently', () => {
    const s = run([
      { type: 'deployFlowers' },
      { type: 'deployFlowers' },
      { type: 'sendCoffee' },
      { type: 'requestHug' },
      { type: 'requestHug' },
      { type: 'requestHug' },
    ]);
    expect(s.flowersDeployed).toBe(2);
    expect(s.coffeeSent).toBe(1);
    expect(s.hugRequested).toBe(3);
  });

  it('marks the hoodie stolen exactly once', () => {
    const once = reducer(initialState, { type: 'stealHoodie' });
    expect(once.hoodieStolen).toBe(true);
    expect(reducer(once, { type: 'stealHoodie' })).toBe(once);
  });
});

describe('reducer — food SLA (§4: breach at exactly 5)', () => {
  it('does not breach at four rejections', () => {
    const s = run(Array.from({ length: 4 }, () => ({ type: 'rejectFood' }) as const));
    expect(s.foodRejectCount).toBe(4);
    expect(isFoodSlaBreached(s)).toBe(false);
  });

  it('breaches at exactly five', () => {
    const s = run(Array.from({ length: FOOD_SLA_LIMIT }, () => ({ type: 'rejectFood' }) as const));
    expect(s.foodRejectCount).toBe(FOOD_SLA_LIMIT);
    expect(isFoodSlaBreached(s)).toBe(true);
  });

  it('clamps at the limit rather than running away', () => {
    const s = run(Array.from({ length: 12 }, () => ({ type: 'rejectFood' }) as const));
    expect(s.foodRejectCount).toBe(FOOD_SLA_LIMIT);
  });

  it('resets back to zero', () => {
    const breached = run(
      Array.from({ length: FOOD_SLA_LIMIT }, () => ({ type: 'rejectFood' }) as const),
    );
    const reset = reducer(breached, { type: 'resetFood' });
    expect(reset.foodRejectCount).toBe(0);
    expect(isFoodSlaBreached(reset)).toBe(false);
  });
});

describe('reducer — easter eggs', () => {
  it('records an egg once, never twice', () => {
    const once = reducer(initialState, { type: 'findEgg', egg: 'queen' });
    expect(once.eggsFound).toEqual(['queen']);
    expect(reducer(once, { type: 'findEgg', egg: 'queen' })).toBe(once);
  });

  it('ignores an unknown egg id', () => {
    const s = reducer(initialState, {
      type: 'findEgg',
      egg: 'not-an-egg',
    } as unknown as Action);
    expect(s).toBe(initialState);
  });

  it('unlocks the coffee egg on the third cup, not before', () => {
    const two = run([{ type: 'sendCoffee' }, { type: 'sendCoffee' }]);
    expect(two.eggsFound).not.toContain('coffee');
    const three = reducer(two, { type: 'sendCoffee' });
    expect(three.eggsFound).toContain('coffee');
  });

  it('reports completion only when every egg is found', () => {
    const s = run(EASTER_EGGS.map((egg) => ({ type: 'findEgg', egg }) as const));
    expect(allEggsFound(s)).toBe(true);
    expect(allEggsFound(initialState)).toBe(false);
  });
});

describe('reducer — spontaneous draws never repeat', () => {
  it('ignores an id that has already been drawn', () => {
    const first = reducer(initialState, { type: 'drawSpontaneous', id: 'drive' });
    expect(first.spontaneousDrawn).toEqual(['drive']);
    expect(reducer(first, { type: 'drawSpontaneous', id: 'drive' })).toBe(first);
  });

  it('clears the pool on reset', () => {
    const drawn = run([
      { type: 'drawSpontaneous', id: 'drive' },
      { type: 'drawSpontaneous', id: 'rain' },
    ]);
    expect(reducer(drawn, { type: 'resetSpontaneous' }).spontaneousDrawn).toEqual([]);
  });
});

describe('reducer — submission and the management decision', () => {
  it('refuses a decision before the application is submitted', () => {
    const s = reducer(initialState, { type: 'decide', decision: 'accepted' });
    expect(s).toBe(initialState);
    expect(s.managementDecision).toBe('pending');
  });

  it('accepts a decision once submitted', () => {
    const submitted = reducer(initialState, { type: 'submitApplication' });
    expect(isReturningVisitor(submitted)).toBe(true);
    const accepted = reducer(submitted, { type: 'decide', decision: 'accepted' });
    expect(accepted.managementDecision).toBe('accepted');
  });

  it('lets management change its mind', () => {
    const s = run([
      { type: 'submitApplication' },
      { type: 'decide', decision: 'clarification' },
      { type: 'decide', decision: 'accepted' },
    ]);
    expect(s.managementDecision).toBe('accepted');
  });
});

describe('reducer — management gate and motion override', () => {
  it('unlocks and re-locks', () => {
    const open = reducer(initialState, { type: 'unlockManagement' });
    expect(open.managementUnlocked).toBe(true);
    expect(reducer(open, { type: 'lockManagement' }).managementUnlocked).toBe(false);
  });

  it('stores all three motion states', () => {
    const forced = reducer(initialState, { type: 'setReducedMotion', value: true });
    expect(forced.reducedMotionOverride).toBe(true);
    const off = reducer(forced, { type: 'setReducedMotion', value: false });
    expect(off.reducedMotionOverride).toBe(false);
    const auto = reducer(off, { type: 'setReducedMotion', value: null });
    expect(auto.reducedMotionOverride).toBeNull();
  });
});

describe('reducer — hydrate and reset preserve hasEntered', () => {
  it('never lets a persisted record skip the loader (§4)', () => {
    const stored: AppState = { ...initialState, applicationSubmitted: true, hasEntered: true };
    const hydrated = reducer(initialState, { type: 'hydrate', state: stored });
    expect(hydrated.applicationSubmitted).toBe(true);
    expect(hydrated.hasEntered).toBe(false);
  });

  it('keeps the visitor inside the app when hydrating mid-session', () => {
    const live = reducer(initialState, { type: 'enter' });
    const hydrated = reducer(live, {
      type: 'hydrate',
      state: { ...initialState, coffeeSent: 4 },
    });
    expect(hydrated.hasEntered).toBe(true);
    expect(hydrated.coffeeSent).toBe(4);
  });

  it('reset clears progress but does not eject the visitor', () => {
    const busy = run([
      { type: 'enter' },
      { type: 'sendCoffee' },
      { type: 'submitApplication' },
      { type: 'findEgg', egg: 'name' },
    ]);
    const cleared = reducer(busy, { type: 'reset' });
    expect(cleared.hasEntered).toBe(true);
    expect(cleared.coffeeSent).toBe(0);
    expect(cleared.applicationSubmitted).toBe(false);
    expect(cleared.eggsFound).toEqual([]);
  });
});
