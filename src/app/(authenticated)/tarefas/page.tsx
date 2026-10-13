'use client';

import React, { useState } from 'react';
import { CalendarDays, Check, ChevronRight } from 'lucide-react';
import type { Condicionante } from '@/shared/types';
import { StatusPill } from '@/components/shared/status-pill';
import { PageHeader, Avatar } from '@/shared/ui';
import { cn } from '@/lib/utils';
import { FilterBar, ListHeader, EmptyState, ListSkeleton, useQuerySearch } from '@/components/layout/list-controls';
import { NovaTarefaModal } from '@/components/modals/NovaTarefaModal';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { useAppData } from '@/lib/AppDataContext';
import { formatDate, centerName, licenseName } from '@/shared/utils';

export default function TarefasPage() {
  const {
    condicionantes: items,
    licencas,
    centros,
    isLoaded,
    setDetail: openDetail,
    saveDetail,
  } = useAppData();

  const [search, setSearch] = useState('');
  useQuerySearch(setSearch);
  const [filter, setFilter] = useState('Todos');

  const filtered = items.filter(
    (item) =>
      `${item.titulo} ${item.responsavel} ${centerName(item.centroId, centros)}`
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (filter === 'Todos' || item.status === filter),
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
        title="Tarefas"
        action={add}
        actionLabel="Nova tarefa"
      />
      <div className="list-card tasks-list-card animate-rise">
        <FilterBar
          search={search}
          setSearch={setSearch}
          filter={filter}
          setFilter={setFilter}
          options={['Pendente', 'Em andamento', 'Concluída']}
          placeholder="Buscar tarefa, responsável ou unidade"
          onClear={() => {
            setSearch('');
            setFilter('Todos');
          }}
        />
        <ListHeader
          count={filtered.length}
          label={!isLoaded ? 'carregando...' : 'tarefas monitoradas'}
        />

        {!isLoaded ? (
          <ListSkeleton variant="condition" rows={5} />
        ) : items.length === 0 ? (
          <EmptyState
            title="Nenhuma tarefa cadastrada"
            description="Cadastre tarefas e rotinas operacionais para a sua equipe acompanhar."
            actionLabel="Nova tarefa"
            onAction={add}
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="Nenhuma tarefa encontrada"
            description="Nenhum resultado corresponde aos critérios de pesquisa ou filtros aplicados."
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
        ) : (
          <div className="condition-list">
            {filtered.map((item) => (
              <div
                className="condition-row"
                key={item.id}
                data-testid={`row-tarefa-${item.id}`}
              >
                <button
                  className={cn(
                    'check-box',
                    item.status === 'Concluída' && 'check-box-done',
                  )}
                  onClick={() => toggle(item)}
                  aria-label={`concluir ${item.titulo}`}
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
                      {licenseName(item.licencaId, licencas, 'Licença ambiental')}
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
        )}
      </div>
      <NovaTarefaModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={(nova) => saveDetail(nova)}
      />
      <ConfirmModal
        open={!!confirmItem}
        title="Confirmar conclusão"
        description={
          confirmItem
            ? `Tem certeza que deseja marcar a tarefa "${confirmItem.titulo}" como concluída?`
            : ''
        }
        onConfirm={confirmToggle}
        onCancel={() => setConfirmItem(null)}
      />
    </main>
  );
}
