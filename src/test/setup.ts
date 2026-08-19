import '@testing-library/jest-dom/vitest';
import { webcrypto } from 'node:crypto';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// jsdom ships no `crypto.subtle`, and the passphrase gate is one of the few
// things worth testing end to end. Node's WebCrypto is the same implementation
// the browser exposes, so the assertions stay honest.
if (!globalThis.crypto?.subtle) {
  Object.defineProperty(globalThis, 'crypto', { value: webcrypto, configurable: true });
}

// jsdom implements neither of these, and Framer Motion / useInViewOnce both
// reach for them. Stubbing here keeps every test file free of the same boilerplate.
if (!('matchMedia' in window)) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

// Node 25 exposes its own partial `localStorage` global, which shadows jsdom's
// and is missing `clear()`. Rather than depend on which implementation wins in
// a given Node/jsdom combination, install a known-good in-memory Storage and
// point the global `Storage` constructor at it — the persistence tests spy on
// `Storage.prototype.setItem` to simulate private-mode Safari, so the two have
// to be the same class.
class MemoryStorage {
  #map = new Map<string, string>();
  get length() {
    return this.#map.size;
  }
  key(index: number): string | null {
    return [...this.#map.keys()][index] ?? null;
  }
  getItem(key: string): string | null {
    return this.#map.get(String(key)) ?? null;
  }
  setItem(key: string, value: string): void {
    this.#map.set(String(key), String(value));
  }
  removeItem(key: string): void {
    this.#map.delete(String(key));
  }
  clear(): void {
    this.#map.clear();
  }
}

vi.stubGlobal('Storage', MemoryStorage);
vi.stubGlobal('localStorage', new MemoryStorage() as unknown as Storage);

// canvas-confetti needs a real 2D context, which jsdom does not implement — it
// returns null and the library then throws "clearRect of null" from a rAF
// callback, surfacing as an unhandled error in whichever unrelated test happens
// to be running. A `vi.mock` in a setup file does NOT hoist into test files, so
// stub the context itself: every method is a no-op, every property writable.
const FAKE_CONTEXT = new Proxy(
  {},
  {
    get: (target: Record<string, unknown>, prop: string) =>
      prop in target ? target[prop] : () => undefined,
    set: (target: Record<string, unknown>, prop: string, value: unknown) => {
      target[prop] = value;
      return true;
    },
  },
);

HTMLCanvasElement.prototype.getContext = function getContext() {
  return FAKE_CONTEXT;
} as unknown as HTMLCanvasElement['getContext'];

class MockIntersectionObserver implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = '';
  readonly thresholds: readonly number[] = [];
  private readonly callback: IntersectionObserverCallback;
  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
  }
  observe(target: Element) {
    // Report "in view" immediately — the tests care about the resulting
    // content, not about scroll position.
    this.callback([{ isIntersecting: true, target } as unknown as IntersectionObserverEntry], this);
  }
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}
vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);

if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}

afterEach(() => {
  cleanup();
  localStorage.clear();
  document.documentElement.removeAttribute('data-motion');
});
