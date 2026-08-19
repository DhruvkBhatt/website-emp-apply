import { describe, expect, it } from 'vitest';
import { pickSpontaneous, type Draw } from '@/hooks/useSpontaneous';
import { spontaneousPool } from '@/content';

const pool: Draw[] = [
  { id: 'a', text: 'A' },
  { id: 'b', text: 'B' },
  { id: 'c', text: 'C' },
];

describe('pickSpontaneous — the no-repeat guarantee (§4)', () => {
  it('never returns something already drawn', () => {
    const picked = pickSpontaneous(pool, ['a', 'b'], () => 0.99);
    expect(picked?.id).toBe('c');
  });

  it('returns null once the pool is exhausted', () => {
    expect(pickSpontaneous(pool, ['a', 'b', 'c'])).toBeNull();
  });

  it('can reach every entry as the random value sweeps 0→1', () => {
    const reached = new Set<string>();
    for (let r = 0; r < 1; r += 0.05) reached.add(pickSpontaneous(pool, [], () => r)!.id);
    expect(reached).toEqual(new Set(['a', 'b', 'c']));
  });

  it('stays in bounds when random() returns exactly 1', () => {
    // Math.random() never returns 1, but a stub might, and an out-of-bounds
    // index here would blank the section.
    expect(pickSpontaneous(pool, [], () => 1)?.id).toBe('c');
  });

  it('drains the real pool completely without repeating', () => {
    const drawn: string[] = [];
    for (let i = 0; i < spontaneousPool.length; i += 1) {
      const next = pickSpontaneous(spontaneousPool, drawn);
      expect(next).not.toBeNull();
      expect(drawn).not.toContain(next!.id);
      drawn.push(next!.id);
    }
    expect(drawn).toHaveLength(spontaneousPool.length);
    expect(pickSpontaneous(spontaneousPool, drawn)).toBeNull();
  });
});
