import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { Centro } from '@/shared/types';
import { StatusPill } from '@/components/shared/status-pill';
import { Avatar } from '@/shared/ui';
import { cn } from '@/lib/utils';

export function CentersCard({
  centros,
  onOpen,
}: {
  centros: Centro[];
  onOpen: (center: Centro) => void;
}) {
  return (
    <div className="rounded-[14px] bg-white border border-[rgba(16,42,34,0.08)] p-[21px] max-[760px]:p-[17px] shadow-[0_1px_3px_rgba(15,23,42,0.03),0_6px_16px_-3px_rgba(15,23,42,0.04)]">
      <div className="flex items-start justify-between gap-[15px]">
        <div>
          <p className="eyebrow !mb-1.5">Rede operacional</p>
          <h2 className="m-0 text-[#1b4032] font-bold text-[18px] tracking-[-0.04em] font-display">
            Unidades
          </h2>
        </div>
        <Link href="/unidades" className="text-link">
          Ver unidades ({centros.length}) <ChevronRight size={14} />
        </Link>
      </div>

      <div className="mt-[17px]">
        {centros.slice(0, 5).map((center, index) => (
          <button
            key={center.id}
            onClick={() => onOpen(center)}
            className={cn(
              'grid grid-cols-[31px_minmax(150px,1fr)_minmax(100px,0.7fr)_auto_15px] max-[760px]:grid-cols-[31px_1fr_auto_15px] items-center w-full gap-2.5 py-[11px] bg-transparent text-left cursor-pointer group transition-colors',
              index > 0 && 'border-t border-[#e4ebec]'
            )}
            data-testid={`button-center-${center.id}`}
          >
            <Avatar name={center.nome} size="sm" shape="rounded" />
            <span className="flex flex-col gap-[3px] min-w-0">
              <b className="truncate text-[#25493c] text-[11px] group-hover:text-[#1b6848] transition-colors font-semibold">
                {center.nome}
              </b>
              <small className="truncate text-[#829397] text-[10px]">
                {center.cidade} — {center.estado}
              </small>
            </span>
            <span className="flex items-center gap-1.5 text-[#829397] text-[10px] min-w-0 truncate max-[760px]:hidden">
              <Avatar name={center.responsavel} size="xs" shape="circle" />
              <span className="truncate">{center.responsavel}</span>
            </span>
            <StatusPill status={center.status} />
            <ChevronRight
              size={15}
              className="text-[#afb7ac] group-hover:text-[#1b6848] transition-colors"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
