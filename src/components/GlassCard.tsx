import type { ReactNode } from 'react';

export function GlassCard({
  children,
  className = '',
  as: Tag = 'div',
}: {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'li' | 'article';
}) {
  return (
    <Tag
      className={`rounded-lg border p-5 backdrop-blur-sm sm:p-6 ${className}`}
      style={{
        background: 'color-mix(in srgb, var(--bg-raised) 82%, transparent)',
        borderColor: 'color-mix(in srgb, var(--fg) 12%, transparent)',
        boxShadow: 'var(--shadow-lift)',
      }}
    >
      {children}
    </Tag>
  );
}
