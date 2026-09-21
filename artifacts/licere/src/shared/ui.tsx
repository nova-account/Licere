import React from 'react';

export const cn = (...values: Array<string | false | null | undefined>) => values.filter(Boolean).join(' ');

export function Mark({ className = '' }: { className?: string }) {
  return (
    <span className={cn('licere-mark', className)} aria-hidden="true">
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', width: '100%', height: '100%' }}>
        <rect width="32" height="32" rx="7" fill="#245b45" />
        <path
          d="M 9.5 5.5 L 9.5 14 A 1.5 1.5 0 0 0 11 15.5 L 18 15.5 C 22.5 15.5 22.5 18 19 19 C 14.5 20 9 20 9 24 C 9 26.5 13.5 27.8 21.5 27.8"
          stroke="#d9f0dd"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function PageHeader({ eyebrow, title, action, actionLabel }: { eyebrow: string; title: string; action?: () => void; actionLabel?: string }) {
  return <div className="page-header animate-rise"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1></div>{action && <button className="primary-btn" onClick={action}><span aria-hidden="true">+</span>{actionLabel}</button>}</div>;
}

export function initials(name: string) {
  return name.split(' ').map((part) => part[0]).join('').slice(0, 2);
}

export function useLocal<T>(key: string, fallback: T): [T, (value: T | ((old: T) => T)) => void] {
  const [value, setValue] = React.useState<T>(() => {
    try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) as T : fallback; } catch { return fallback; }
  });
  const save = (next: T | ((old: T) => T)) => setValue((old) => {
    const resolved = typeof next === 'function' ? (next as (old: T) => T)(old) : next;
    localStorage.setItem(key, JSON.stringify(resolved));
    return resolved;
  });
  return [value, save];
}
