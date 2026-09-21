import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { CalendarDays, Check, ChevronRight } from 'lucide-react';
import type { Condicionante, DetailItem, Licenca } from '@/shared/types';
import { centros, initialLicencas } from '@/shared/data';
import { StatusPill } from '@/components/ui/StatusPill';
import { PageHeader, cn, initials } from '@/shared/ui';
import { FilterBar, ListHeader, EmptyState, useQuerySearch } from '@/components/ui/PageControls';
import { NovaCondicionanteModal } from '@/components/modals/NovaCondicionanteModal';

const centerName = (id: string) =>
  centros.find((center) => center.id === id)?.nome ?? id;

const licenseName = (id: string, list: Licenca[] = initialLicencas) =>
  list.find((license) => license.id === id)?.numero ?? 'Licença não localizada';

const formatDate = (value: string) => {
  if (!value) return '';
  const [y, m, d] = value.split('-');
  if (!d) return value;
  return `${d}/${m}/${y}`;
};

export default function CondicionantesPage({
  items,
  setItems,
  openDetail,
  licencas,
}: {
  items: Condicionante[];
  setItems: (
    v: Condicionante[] | ((old: Condicionante[]) => Condicionante[]),
  ) => void;
  openDetail: (item: DetailItem) => void;
  licencas: Licenca[];
}) {
  const querySearch = useQuerySearch();
  const [search, setSearch] = useState(querySearch);
  const [filter, setFilter] = useState('Todos');
  const [, setLocation] = useLocation();

  const filtered = items.filter(
    (i) =>
      `${i.titulo} ${i.responsavel} ${centerName(i.centroId)} ${licenseName(i.licencaId, licencas)}`
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (filter === 'Todos' || i.status === filter),
  );

  const toggle = (item: Condicionante) =>
    setItems((old) =>
      old.map((current) =>
        current.id === item.id
          ? {
              ...current,
              status: current.status === 'Concluída' ? 'Pendente' : 'Concluída',
            }
          : current,
      ),
    );

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
          options={['Pendente', 'Em análise', 'Concluída']}
          placeholder="Buscar obrigação, responsável ou licença"
          onClear={() => {
            setSearch('');
            setFilter('Todos');
          }}
        />
        <ListHeader
          count={filtered.length}
          label="obrigações monitoradas"
        />
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
                    {centerName(item.centroId)} ·{' '}
                    {licenseName(item.licencaId, licencas)}
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
        {filtered.length === 0 && (
          <EmptyState
            title="Tudo limpo por aqui"
            description="Nenhuma condicionante encontrada."
            onClear={() => {
              setSearch('');
              setFilter('Todos');
            }}
          />
        )}
      </div>
      <NovaCondicionanteModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={(nova) => setItems((prev) => [nova, ...prev])}
        licencas={licencas}
      />
    </main>
  );
}
