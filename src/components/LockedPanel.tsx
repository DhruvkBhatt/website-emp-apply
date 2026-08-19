import type { ReactNode } from 'react';
import { StatusBadge } from './StatusBadge';

/**
 * §5 — the 🔐 MANAGEMENT-ONLY PROTOCOL placeholder.
 *
 * Private-tier material is *never committed*. This renders the shape of the
 * thing — a titled, locked panel — so the narrative reads complete without the
 * content existing in the repo at all. If you find yourself wanting to put real
 * figures in `note`, stop and re-read docs/PRIVACY.md.
 */
export function LockedPanel({
  title,
  note,
  children,
}: {
  title: string;
  /** One line about *why* it's locked. Must contain no actual private detail. */
  note?: string;
  /** Optional visible, Public-tier framing shown above the lock. */
  children?: ReactNode;
}) {
  return (
    <div
      className="relative overflow-hidden rounded-lg border p-5 sm:p-6"
      style={{
        borderStyle: 'dashed',
        borderColor: 'color-mix(in srgb, var(--accent) 45%, transparent)',
        background: 'color-mix(in srgb, var(--accent) 6%, transparent)',
      }}
    >
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <span aria-hidden="true">🔐</span>
        <h3 className="pf-serif text-step-1">{title}</h3>
        <StatusBadge tone="pending">Management-only protocol</StatusBadge>
      </div>
      {children}
      <p className="pf-mono mt-3 text-fg-muted">
        {note ?? 'Discussed in person. Deliberately not written down.'}
      </p>
    </div>
  );
}
