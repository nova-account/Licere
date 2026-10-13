'use client';
import React, { useState } from 'react';
import { CalendarDays, Check, ChevronRight } from 'lucide-react';
import type { Condicionante } from '@/shared/types';

import { StatusPill } from '@/components/shared/status-pill';
import { PageHeader, Avatar } from '@/shared/ui';
import { cn } from '@/lib/utils';
import { FilterBar, ListHeader, EmptyState, ListSkeleton, useQuerySearch } from '@/components/layout/list-controls';
import { NovaCondicionanteModal } from '@/components/modals/NovaCondicionanteModal';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { useAppData } from '@/lib/AppDataContext';
import { formatDate, centerName, licenseName } from '@/shared/utils';

export default function CondicionantesPage() {
  const { condicionantes: items, licencas, setDetail: openDetail, centros, isLoaded, saveDetail } = useAppData();

  const [search, setSearch] = useState('');
  useQuerySearch(setSearch);
  const [filter, setFilter] = useState('Todos');

  const filtered = items.filter(
    (i) =>
      `${i.titulo} ${i.responsavel} ${centerName(i.centroId, centros)} ${licenseName(i.licencaId, licencas)}`
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (filter === 'Todos' || i.status === filter),
  );

  const [confirmItem, setConfirmItem] = useState<Condicionante | null>(null);

  const toggle = (item: Condicionante) => {
    if (item.status === 'Concluída') {
      saveDetail({ ...item, status: 'Pendente' });
    } else {
      setConfirmItem(item);
    }
  };

  const confirmToggle = () => {
    if (!confirmItem) return;
    saveDetail({ ...confirmItem, status: 'Concluída' });
    setConfirmItem(null);
  };

  const [addOpen, setAddOpen] = useState(false);

  const add = () => {
    setAddOpen(true);
  };

  return (
    <main className="content">
      <PageHeader
        eyebrow="Rotina de conformidade"
        title="Condicionantes"
        action={add}
        actionLabel="Nova condicionante"
      />
      <div className="list-card animate-rise">
        <FilterBar
          search={search}
          setSearch={setSearch}
          filter={filter}
          setFilter={setFilter}
          options={['Pendente', 'Em andamento', 'Concluída']}
          placeholder="Buscar obrigação, responsável ou licença"
          onClear={() => {
            setSearch('');
            setFilter('Todos');
          }}
        />
        <ListHeader
          count={filtered.length}
          label={!isLoaded ? 'carregando...' : 'obrigações monitoradas'}
        />
        {!isLoaded ? (
          <ListSkeleton variant="condition" rows={5} />
        ) : items.length === 0 ? (
          <EmptyState
            title="Nenhuma condicionante cadastrada"
            description="Adicione condicionantes e obrigações para acompanhar as rotinas de conformidade ambiental."
            actionLabel="Nova condicionante"
            onAction={add}
          />
        ) : (
          <>
            <div className="condition-list">
              {filtered.map((item) => (
                <div
                  className="condition-row"
                  key={item.id}
                  data-testid={`row-condicionante-${item.id}`}
                >
                  <button
                    className={cn(
                      'check-box',
                      item.status === 'Concluída' && 'check-box-done',
                    )}
                    onClick={() => toggle(item)}
                    aria-label={`marcar ${item.titulo}`}
                  >
                    {item.status === 'Concluída' && <Check size={14} />}
                  </button>
                  <button
                    className="condition-main"
                    onClick={() => openDetail(item)}
                  >
                    <span>
                      <b
                        className={
                          item.status === 'Concluída' ? 'condition-done' : ''
                        }
                      >
                        {item.titulo}
                      </b>
                      <small>
                        {centerName(item.centroId, centros)} ·{' '}
                        {licenseName(item.licencaId, licencas)}
                      </small>
                    </span>
                    <span className="condition-responsible">
                      <Avatar name={item.responsavel} size="xs" shape="circle" />
                      {item.responsavel}
                    </span>
                    <span
                      className={cn(
                        'condition-deadline',
                        item.status === 'Pendente' && 'deadline-soon',
                      )}
                    >
                      <CalendarDays size={14} />
                      {formatDate(item.prazo)}
                    </span>
                    <StatusPill status={item.status} />
                    <ChevronRight size={16} />
                  </button>
                </div>
              ))}
            </div>
            {filtered.length === 0 && (
              <EmptyState
                title="Tudo limpo por aqui"
                description="Nenhuma condicionante encontrada para os critérios de busca ou filtros aplicados."
                clearLabel={
                  search.trim() && filter !== 'Todos'
                    ? 'Limpar busca e filtros'
                    : search.trim()
                      ? 'Limpar busca'
                      : 'Limpar filtros'
                }
                onClear={() => {
                  setSearch('');
                  setFilter('Todos');
                }}
              />
            )}
          </>
        )}
      </div>
      <NovaCondicionanteModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={(nova) => saveDetail(nova)}
        licencas={licencas}
      />
      <ConfirmModal
        open={!!confirmItem}
        title="Confirmar conclusão"
        description={confirmItem ? `Tem certeza que deseja marcar a condicionante "${confirmItem.titulo}" como concluída?` : ''}
        onConfirm={confirmToggle}
        onCancel={() => setConfirmItem(null)}
      />
    </main>
  );
}
