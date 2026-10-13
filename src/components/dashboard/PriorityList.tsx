import React from 'react';
import Link from 'next/link';
import { ChevronRight, ShieldCheck, ClipboardCheck } from 'lucide-react';
import type { Condicionante, DetailItem, Licenca } from '@/shared/types';
import { cn } from '@/lib/utils';
import { useAppData } from '@/lib/AppDataContext';
import { formatDate, centerName } from '@/shared/utils';

export function PriorityList({
  licencas,
  condicionantes,
  onOpen,
}: {
  licencas: Licenca[];
  condicionantes: Condicionante[];
  onOpen: (item: DetailItem) => void;
}) {
  const { centros } = useAppData();
  const items = [
    ...licencas.filter(
      (l) => l.status === 'A vencer' || l.status === 'Vencida',
    ),
    ...condicionantes.filter((c) => c.status === 'Pendente'),
  ].slice(0, 4);

  return (
    <div className="rounded-[14px] bg-white border border-[rgba(16,42,34,0.08)] p-[21px] max-[760px]:p-[17px] shadow-[0_1px_3px_rgba(15,23,42,0.03),0_6px_16px_-3px_rgba(15,23,42,0.04)]">
      <div className="flex items-start justify-between gap-[15px]">
        <div>
          <p className="eyebrow !mb-1.5">Próximas ações</p>
          <h2 className="m-0 text-[#1b4032] font-bold text-[18px] tracking-[-0.04em] font-display">
            O que pede atenção
          </h2>
        </div>
        <Link href="/licencas" className="text-link">
          Ver tudo <ChevronRight size={14} />
        </Link>
      </div>
      <div className="mt-[17px]">
        {items.map((item) => {
          const isLicense = 'numero' in item;
          return (
            <button
              key={item.id}
              onClick={() => onOpen(item)}
              className="flex items-center w-full gap-2.5 py-3 text-left border-0 border-t border-[#e4ebec] first:border-t-0 bg-transparent cursor-pointer group transition-colors"
              data-testid={`button-priority-${item.id}`}
            >
              <span
                className={cn(
                  'grid place-items-center w-[31px] h-[31px] shrink-0 rounded-[10px]',
                  item.status === 'Vencida' && 'text-[#a35852] bg-[#f4e8e7]',
                  (item.status === 'A vencer' || item.status === 'Próximo do vencimento') && 'text-[#c9741e] bg-[#fff8f0]',
                  item.status === 'Pendente' && 'text-[#927d4f] bg-[#f1efe5]',
                  (item.status === 'Em análise' || item.status === 'Em andamento') && 'text-[#0e5d8c] bg-[#e6f2fb]',
                  item.status !== 'Vencida' && item.status !== 'A vencer' && item.status !== 'Próximo do vencimento' && item.status !== 'Pendente' && item.status !== 'Em análise' && item.status !== 'Em andamento' && 'text-[#2d7050] bg-[#e2f0e6]',
                )}
              >
                {isLicense ? (
                  <ShieldCheck size={16} />
                ) : (
                  <ClipboardCheck size={16} />
                )}
              </span>
              <span className="flex flex-1 flex-col gap-[3px] min-w-0">
                <b className="truncate text-[#25493c] text-[11px] group-hover:text-[#1b6848] transition-colors font-bold">
                  {isLicense ? (item as Licenca).tipo : (item as Condicionante).titulo}
                </b>
                <small className="text-[#829397] text-[10px]">
                  {isLicense
                    ? centerName((item as Licenca).centroId, centros)
                    : `Prazo ${formatDate((item as Condicionante).prazo)}`}
                </small>
              </span>
              <span className="text-[#818c82] font-mono text-[9px] whitespace-nowrap max-[400px]:hidden">
                {isLicense
                  ? formatDate((item as Licenca).vencimento)
                  : (item as Condicionante).responsavel.split(' ')[0]}
              </span>
              <ChevronRight size={15} className="text-[#adb4a9] group-hover:text-[#1b6848] transition-colors shrink-0" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
