import React from 'react';
import Link from 'next/link';
import { ChevronRight, ShieldCheck, ClipboardCheck } from 'lucide-react';
import type { Condicionante, DetailItem, Licenca } from '@/shared/types';
import { cn } from '@/lib/utils';
import { useAppData } from '@/lib/AppDataContext';

const centerName = (id: string, centros: any[]) => centros.find((center: any) => center.id === id)?.nome ?? id;

const formatDate = (value: string) => {
  if (!value) return '';
  const [y, m, d] = value.split('-');
  if (!d) return value;
  return `${d}/${m}/${y}`;
};

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
    <div className="priority-card">
      <div className="card-heading">
        <div>
          <p className="eyebrow">Próximas ações</p>
          <h2>O que pede atenção</h2>
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
              className="group flex w-full items-center gap-2.5 border-0 border-t border-border bg-transparent py-3 text-left first:border-t-0"
              data-testid={`button-priority-${item.id}`}
            >
              <span
                className={cn(
                  'grid size-[31px] shrink-0 place-items-center rounded-[10px]',
                  item.status === 'Vencida'
                    ? 'bg-destructive/10 text-destructive'
                    : 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
                )}
              >
                {isLicense ? (
                  <ShieldCheck size={16} />
                ) : (
                  <ClipboardCheck size={16} />
                )}
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-[3px]">
                <b className="truncate text-[11px] text-card-foreground group-hover:text-primary">
                  {isLicense ? (item as Licenca).tipo : (item as Condicionante).titulo}
                </b>
                <small className="text-[10px] text-muted-foreground">
                  {isLicense
                    ? centerName((item as Licenca).centroId, centros)
                    : `Prazo ${formatDate((item as Condicionante).prazo)}`}
                </small>
              </span>
              <span className="whitespace-nowrap font-mono text-[9px] text-muted-foreground max-[400px]:hidden">
                {isLicense
                  ? formatDate((item as Licenca).vencimento)
                  : (item as Condicionante).responsavel.split(' ')[0]}
              </span>
              <ChevronRight size={15} className="text-muted-foreground" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
