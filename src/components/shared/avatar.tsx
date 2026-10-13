import React from 'react';
import { cn } from '@/lib/utils';
import { initials } from '@/shared/ui';

export interface AvatarProps {
  name?: string;
  fallback?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'circle' | 'rounded';
  tone?: 'default' | 'olive' | 'sand' | 'blue' | 'dark';
  className?: string;
}

const sizeClasses = {
  xs: 'w-[22px] h-[22px] text-[9px]',
  sm: 'w-[27px] h-[27px] text-[9px]',
  md: 'w-8 h-8 text-[10px]',
  lg: 'w-10 h-10 text-xs',
  xl: 'w-16 h-16 text-lg',
};

const toneClasses = {
  default: 'bg-[#e8f2ef] text-[#276c4d] border border-[#d1e3e0]',
  olive: 'bg-[#e6eee8] text-[#335d49] border border-[#d4e1d7]',
  sand: 'bg-[#efece4] text-[#6b5c3a] border border-[#e2dbce]',
  blue: 'bg-[#e3ecf0] text-[#2c5364] border border-[#d0dfe6]',
  dark: 'bg-[#132c22] text-[#d9f0dd] border border-[#1b3e30]',
};

export function Avatar({
  name = '',
  fallback = 'U',
  size = 'md',
  shape = 'circle',
  tone = 'default',
  className,
}: AvatarProps) {
  const letters = initials(name) || fallback;
  return (
    <span
      className={cn(
        'grid place-items-center font-mono font-bold shrink-0 select-none leading-none',
        sizeClasses[size],
        shape === 'circle' ? 'rounded-full' : 'rounded-[9px]',
        toneClasses[tone],
        className
      )}
      aria-label={name || undefined}
    >
      {letters}
    </span>
  );
}
