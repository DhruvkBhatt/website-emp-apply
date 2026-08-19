/**
 * §5.5 — the `#/management` passphrase gate.
 *
 * We compare a SHA-256 hex digest against `VITE_MANAGEMENT_PASSPHRASE_HASH`,
 * injected at build time from a repo secret, so the plaintext never enters git
 * history. This is explicitly *UX-only* protection: the hash ships in the
 * bundle and is brute-forceable. Per §5, nothing lives behind this gate that
 * would embarrass either of you if a stranger read it.
 */

export async function sha256Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** Trim + case-fold so she doesn't lose to a stray space or a capital letter. */
export const normalizePassphrase = (input: string): string => input.trim().toLowerCase();

/** Constant-time-ish comparison. Not security-critical here, but free. */
export function hexEquals(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export interface GateResult {
  ok: boolean;
  /** True when no hash was configured at build time — gate is open by design. */
  unconfigured: boolean;
}

export async function checkPassphrase(input: string, expectedHash: string): Promise<GateResult> {
  const expected = expectedHash.trim().toLowerCase();
  if (!expected) {
    // No secret configured (local dev, or a build that forgot the env var).
    // Fail *open* but say so loudly in the UI — a gate that silently locks
    // Management out of her own portal is worse than one that admits it's off.
    return { ok: true, unconfigured: true };
  }
  const actual = await sha256Hex(normalizePassphrase(input));
  return { ok: hexEquals(actual, expected), unconfigured: false };
}
