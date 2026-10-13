import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Avatar } from '@/shared/ui';
import { cn } from '@/lib/utils';

export interface RecentActivityItem {
  id: string;
  item: any;
  person: string;
  action: string;
  target: string;
  subtitle: string;
  avatarTone: string;
}

export function ActivityCard({
  activities,
  onOpen,
  onViewAll,
}: {
  activities: RecentActivityItem[];
  onOpen: (item: any) => void;
  onViewAll: () => void;
}) {
  return (
    <div className="rounded-[14px] bg-white border border-[rgba(16,42,34,0.08)] p-[21px] max-[760px]:p-[17px] shadow-[0_1px_3px_rgba(15,23,42,0.03),0_6px_16px_-3px_rgba(15,23,42,0.04)]">
      <div className="flex items-start justify-between gap-[15px]">
        <div>
          <p className="eyebrow !mb-1.5">Registro</p>
          <h2 className="m-0 text-[#1b4032] font-bold text-[18px] tracking-[-0.04em] font-display">
            Atividade recente
          </h2>
        </div>
        <button
          type="button"
          onClick={onViewAll}
          className="text-link"
          data-testid="button-ver-todas-atividades"
        >
          Ver tudo <ChevronRight size={14} />
        </button>
      </div>

      <div className="mt-4">
        {activities.length === 0 ? (
          <p className="text-[#829397] text-[11px] py-3">
            Nenhuma atividade recente registrada.
          </p>
        ) : (
          activities.map((act, index) => (
            <div
                key={act.id}
                onClick={() => onOpen(act.item)}
                className={cn(
                  'flex items-start gap-[9px] py-[11px] cursor-pointer group',
                  index > 0 && 'border-t border-[#e4ebec]'
                )}
                title="Clique para ver detalhes"
              >
                <Avatar
                  name={act.person}
                  size="sm"
                  shape="circle"
                />
                <p className="m-0 text-[#778b90] text-[10px] leading-[1.45]">
                  <b className="text-[#355b4b] font-semibold">{act.person}</b> {act.action}{' '}
                  <strong className="text-[#355b4b] font-semibold">{act.target}</strong>
                  <small className="block mt-[3px] text-[#a0a69f] text-[9px]">
                    {act.subtitle}
                  </small>
                </p>
              </div>
            ))
        )}
      </div>
    </div>
  );
}
