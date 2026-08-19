#!/usr/bin/env node
/**
 * §5.5 — turn a passphrase into the SHA-256 hex you put in
 * VITE_MANAGEMENT_PASSPHRASE_HASH (a repo secret in CI, .env locally).
 *
 *   npm run hash -- "the inside joke"
 *
 * Normalisation must match src/state/gate.ts exactly: trim, then lowercase.
 */
import { createHash } from 'node:crypto';

const input = process.argv.slice(2).join(' ');

if (!input) {
  console.error('usage: npm run hash -- "your passphrase"');
  process.exit(1);
}

const normalized = input.trim().toLowerCase();
const hash = createHash('sha256').update(normalized, 'utf8').digest('hex');

console.log('');
console.log('  normalised : %s', normalized);
console.log('  sha-256    : %s', hash);
console.log('');
console.log('  Put this in .env (local) and in the repo secret used by');
console.log('  .github/workflows/deploy.yml:');
console.log('');
console.log('    VITE_MANAGEMENT_PASSPHRASE_HASH=%s', hash);
console.log('');
console.log('  Do NOT commit the plaintext anywhere.');
console.log('');
