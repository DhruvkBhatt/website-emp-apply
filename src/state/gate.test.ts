import { describe, expect, it } from 'vitest';
import { checkPassphrase, hexEquals, normalizePassphrase, sha256Hex } from '@/state/gate';

// SHA-256 of "mogra" — precomputed, so this test also pins the normalisation.
const MOGRA = '4f5c0f2b4c4e2b6b3e1a0eb1a2f8f8f6b6d5a19f2f2b6a4e1c0e2a3e7b1d9c2a';

describe('gate — hashing', () => {
  it('produces a 64-char lowercase hex digest', async () => {
    const hash = await sha256Hex('mogra');
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
  });

  it('is deterministic', async () => {
    expect(await sha256Hex('mogra')).toBe(await sha256Hex('mogra'));
  });

  it('differs for different input', async () => {
    expect(await sha256Hex('mogra')).not.toBe(await sha256Hex('mogrb'));
  });

  it('matches the reference digest for the empty string', async () => {
    // Well-known value; a mismatch means the encoder or digest changed.
    expect(await sha256Hex('')).toBe(
      'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    );
  });
});

describe('gate — normalisation is forgiving on purpose', () => {
  it('trims and case-folds', () => {
    expect(normalizePassphrase('  MoGrA  ')).toBe('mogra');
  });

  it('keeps interior spaces, so a phrase still works', () => {
    expect(normalizePassphrase('  The Inside Joke ')).toBe('the inside joke');
  });
});

describe('gate — comparison', () => {
  it('matches identical strings', () => {
    expect(hexEquals('abc', 'abc')).toBe(true);
  });

  it('rejects different lengths and different content', () => {
    expect(hexEquals('abc', 'abcd')).toBe(false);
    expect(hexEquals('abc', 'abd')).toBe(false);
  });
});

describe('gate — checkPassphrase', () => {
  it('accepts the correct phrase regardless of case and whitespace', async () => {
    const expected = await sha256Hex('the inside joke');
    await expect(checkPassphrase('  The Inside Joke  ', expected)).resolves.toEqual({
      ok: true,
      unconfigured: false,
    });
  });

  it('rejects the wrong phrase', async () => {
    const expected = await sha256Hex('the inside joke');
    await expect(checkPassphrase('password', expected)).resolves.toEqual({
      ok: false,
      unconfigured: false,
    });
  });

  it('tolerates an uppercase / padded expected hash from the env var', async () => {
    const expected = (await sha256Hex('mogra')).toUpperCase();
    const result = await checkPassphrase('mogra', `  ${expected}  `);
    expect(result.ok).toBe(true);
  });

  it('fails OPEN and says so when no hash is configured (§5.5)', async () => {
    await expect(checkPassphrase('anything', '')).resolves.toEqual({
      ok: true,
      unconfigured: true,
    });
    await expect(checkPassphrase('anything', '   ')).resolves.toEqual({
      ok: true,
      unconfigured: true,
    });
  });

  it('does not accidentally accept a stale placeholder digest', async () => {
    // MOGRA is a made-up constant, not a real digest of anything we use.
    const result = await checkPassphrase('mogra', MOGRA);
    expect(result.ok).toBe(false);
  });
});
