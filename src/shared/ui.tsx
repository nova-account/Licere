import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

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
  return (
    <div className="animate-rise mb-[31px] flex items-end justify-between gap-[30px] max-[760px]:flex-wrap max-[760px]:items-center max-[760px]:gap-[17px]">
      <div>
        <p className="hidden">{eyebrow}</p>
        <h1 className="m-0 font-display text-[clamp(31px,3.1vw,44px)] leading-[1.1] font-extrabold tracking-[-0.075em] text-foreground max-[760px]:text-[30px]">
          {title}
        </h1>
      </div>
      {action && (
        <Button
          type="button"
          onClick={action}
          className="h-[38px] gap-[7px] rounded-[11px] border border-primary px-[15px] text-xs font-semibold shadow-[0_5px_12px_rgba(32,95,67,0.12)] hover:-translate-y-0.5 max-[760px]:self-end"
        >
          <span aria-hidden="true">+</span>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export function initials(name: string) {
  return name.split(' ').map((part) => part[0]).join('').slice(0, 2);
}


