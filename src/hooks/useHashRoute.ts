import { useEffect, useState } from 'react';

/**
 * §1 — there is no router. The only "route" is the hash-gated management
 * panel, so a 15-line hook covers it.
 */
export function useHashRoute(): { hash: string; navigate: (hash: string) => void } {
  const [hash, setHash] = useState(() =>
    typeof window === 'undefined' ? '' : window.location.hash,
  );

  useEffect(() => {
    const onChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  return {
    hash,
    navigate: (next: string) => {
      if (window.location.hash === next) setHash(next);
      else window.location.hash = next;
    },
  };
}

export const MANAGEMENT_HASH = '#/management';
