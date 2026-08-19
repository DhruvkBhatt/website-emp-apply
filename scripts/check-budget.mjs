#!/usr/bin/env node
/**
 * PLAN §7 — the performance budget, enforced.
 *
 * Parses the built index.html, finds only the JS/CSS the browser fetches
 * *before* first paint (the entry module plus its modulepreloads), gzips each,
 * and fails the build if the total is over budget. Lazily-imported chunks
 * (motion features, canvas-confetti) are correctly excluded, which is the whole
 * point of the LazyMotion split.
 */
import { readFileSync, existsSync, statSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { join } from 'node:path';

const DIST = 'dist';
const BUDGET = {
  js: 120 * 1024, // §7: initial JS (gz) ≤ 120 KB
  css: 25 * 1024, // not in §7, but a stylesheet blocks paint too
};

if (!existsSync(join(DIST, 'index.html'))) {
  console.error('✗ no dist/index.html — run `vite build` first');
  process.exit(1);
}

const html = readFileSync(join(DIST, 'index.html'), 'utf8');
const assets = [...html.matchAll(/(?:src|href)="[^"]*?(assets\/[^"]+\.(?:js|css))"/g)].map(
  (m) => m[1],
);

if (assets.length === 0) {
  console.error('✗ found no assets referenced from index.html — did the build change shape?');
  process.exit(1);
}

let js = 0;
let css = 0;
const rows = [];

for (const asset of new Set(assets)) {
  const path = join(DIST, asset);
  const raw = readFileSync(path);
  const gz = gzipSync(raw, { level: 9 }).length;
  if (asset.endsWith('.js')) js += gz;
  else css += gz;
  rows.push({ asset, raw: statSync(path).size, gz });
}

const kb = (n) => `${(n / 1024).toFixed(1)} KB`;

console.log('\n  Initial payload (fetched before first paint)\n');
for (const r of rows.sort((a, b) => b.gz - a.gz)) {
  console.log(`    ${r.asset.padEnd(44)} ${kb(r.raw).padStart(10)}  →  ${kb(r.gz).padStart(9)} gz`);
}
console.log('');
console.log(`    initial JS   ${kb(js).padStart(10)} gz   budget ${kb(BUDGET.js)}`);
console.log(`    initial CSS  ${kb(css).padStart(10)} gz   budget ${kb(BUDGET.css)}`);
console.log('');

let failed = false;
if (js > BUDGET.js) {
  console.error(`✗ initial JS is ${kb(js - BUDGET.js)} over the §7 budget`);
  failed = true;
}
if (css > BUDGET.css) {
  console.error(`✗ initial CSS is ${kb(css - BUDGET.css)} over budget`);
  failed = true;
}

// §7 — the GIF has its own 2 MB ceiling, and it is the asset most likely to
// quietly blow past it when a real file is dropped in.
const gif = join('public', 'media', 'gif', 'get-over-here.gif');
if (existsSync(gif)) {
  const size = statSync(gif).size;
  console.log(`    get-over-here.gif ${kb(size).padStart(10)}      budget 2048.0 KB`);
  if (size > 2 * 1024 * 1024) {
    console.error(`✗ the GIF is ${kb(size - 2 * 1024 * 1024)} over the §7 budget`);
    failed = true;
  }
}

if (failed) {
  console.error('\n  Budget exceeded. See PLAN §7 before raising these numbers.\n');
  process.exit(1);
}

console.log('  ✓ within the §7 budget\n');
