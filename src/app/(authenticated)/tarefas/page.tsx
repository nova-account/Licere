'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarDays, Check, ChevronRight } from 'lucide-react';
import type { Condicionante } from '@/shared/types';
import { StatusPill } from '@/components/shared/status-pill';
import { PageHeader, initials } from '@/shared/ui';
import { cn } from '@/lib/utils';
import { FilterBar, ListHeader, EmptyState, useQuerySearch } from '@/components/layout/list-controls';
import { NovaTarefaModal } from '@/components/modals/NovaTarefaModal';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { useAppData } from '@/lib/AppDataContext';

const formatDate = (value: string) => {
  if (!value) return '';
  const [y, m, d] = value.split('-');
  if (!d) return value;
  return `${d}/${m}/${y}`;
};

export default function TarefasPage() {
  const {
    condicionantes: items,
    setCondicionantes: setItems,
    licencas,
    centros,
    setDetail: openDetail,
  } = useAppData();

  const querySearch = useQuerySearch();
  const [search, setSearch] = useState(querySearch);
  const [filter, setFilter] = useState('Todos');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  const getUnitName = (id: string) =>
    centros.find((center) => center.id === id)?.nome ?? id;

  const licenseName = (id: string) =>
    licencas.find((license) => license.id === id)?.numero ?? 'Licença ambiental';

  const filtered = items.filter(
    (item) =>
      `${item.titulo} ${item.responsavel} ${getUnitName(item.centroId)}`
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (filter === 'Todos' || item.status === filter),
  );

  const [confirmItem, setConfirmItem] = useState<Condicionante | null>(null);

  const toggle = (item: Condicionante) => {
    if (item.status === 'Concluída') {
      setItems((old) =>
        old.map((current) =>
          current.id === item.id
            ? { ...current, status: 'Pendente' }
            : current,
        ),
      );
    } else {
      setConfirmItem(item);
    }
  };

  const confirmToggle = () => {
    if (!confirmItem) return;
    setItems((old) =>
      old.map((current) =>
        current.id === confirmItem.id
          ? { ...current, status: 'Concluída' }
          : current,
      ),
    );
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
          label="tarefas monitoradas"
        />

        {isLoading ? (
          <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[1, 2, 3, 4, 5].map((n) => (
              <div
                key={n}
                style={{
                  height: '56px',
                  borderRadius: '8px',
                  background: 'linear-gradient(90deg, #f0f3f1 25%, #e6ebe8 50%, #f0f3f1 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'pulse 1.5s infinite ease-in-out',
                }}
              />
            ))}
          </div>
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
                      {getUnitName(item.centroId)} ·{' '}
                      {licenseName(item.licencaId)}
                    </small>
                  </span>
                  <span className="condition-responsible">
                    <span className="initial-avatar">
                      {initials(item.responsavel)}
                    </span>
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

        {!isLoading && filtered.length === 0 && (
          <EmptyState
            title="Nenhuma tarefa encontrada"
            description="Ajuste a busca ou o filtro."
            onClear={() => {
              setSearch('');
              setFilter('Todos');
            }}
          />
        )}
      </div>
      <NovaTarefaModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={(nova) => setItems((prev) => [nova, ...prev])}
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
