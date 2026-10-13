import React from 'react';
import type { Status } from '@/shared/types';
import { cn } from '@/lib/utils';

interface StatusPillProps {
  status: Status | string;
  size?: 'sm' | 'md';
  className?: string;
}

export function StatusPill({ status, size = 'md', className }: StatusPillProps) {
  const isGood =
    status === 'Regular' ||
    status === 'Vigente' ||
    status === 'Válido' ||
    status === 'Concluída' ||
    status === 'Operando' ||
    status === 'Ativa';

  const isNotice =
    status === 'Em análise' ||
    status === 'Em expansão' ||
    status === 'Em andamento';

  const isWarn = status === 'Pendente';

  const isOrange =
    status === 'A vencer' || status === 'Próximo do vencimento';

  const isCompact = size === 'sm';

  return (
    <span
      className={cn(
        'pill status-pill inline-flex items-center w-fit border font-semibold whitespace-nowrap leading-[1.35] tracking-[0.015em] transition-all duration-150',
        isCompact
          ? 'gap-[5px] py-1 px-[7px] rounded-[5px] text-[10px]'
          : 'gap-[6.5px] py-[3.5px] px-[10px] rounded-full text-[11px]',
        isGood && '!text-[#2d7050] bg-[#e2f0e6] border-[rgba(14,102,68,0.22)]',
        isNotice && '!text-[#0e5d8c] bg-[#e6f2fb] border-[rgba(14,93,140,0.22)]',
        isWarn && '!text-[#927d4f] bg-[#f1efe5] border-[rgba(129,74,0,0.22)]',
        isOrange && '!text-[#c9741e] bg-[#fff8f0] border-[rgba(201,116,30,0.22)]',
        !isGood &&
          !isNotice &&
          !isWarn &&
          !isOrange &&
          '!text-[#a35852] bg-[#f4e8e7] border-[rgba(153,21,32,0.25)]',
        className
      )}
      role="status"
      title={status}
    >
      <i
        className={cn(
          'inline-block rounded-full bg-current shrink-0',
          isCompact ? 'w-[5px] h-[5px]' : 'w-1.5 h-1.5'
        )}
        aria-hidden="true"
      />
      <span className="text-inherit">{status}</span>
    </span>
  );
}

export function CriticalityPill({
  criticidade,
  className,
}: {
  criticidade: 'Alta' | 'Média' | 'Baixa' | string;
  className?: string;
}) {
  const norm = criticidade?.toLowerCase();
  const isAlta = norm === 'alta';
  const isMedia = norm === 'média' || norm === 'media';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-[5px] text-[10px] font-medium leading-normal',
        isAlta && 'text-[#a54d41]',
        isMedia && 'text-[#a57331]',
        !isAlta && !isMedia && 'text-[#3d7858]',
        className
      )}
    >
      <i
        className={cn(
          'inline-block w-1.5 h-1.5 rounded-full shrink-0',
          isAlta && 'bg-[#be5d4d]',
          isMedia && 'bg-[#d59a48]',
          !isAlta && !isMedia && 'bg-[#5b9a73]'
        )}
        aria-hidden="true"
      />
      <span>{criticidade}</span>
    </span>
  );
}
