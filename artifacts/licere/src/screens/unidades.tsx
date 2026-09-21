import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import type { Centro, DetailItem } from '@/shared/types';
import { centros } from '@/shared/data';
import { StatusPill } from '@/components/ui/StatusPill';
import { PageHeader, initials, useLocal } from '@/shared/ui';
import { FilterBar, ListHeader, EmptyState, useQuerySearch } from '@/components/ui/PageControls';
import { NovaUnidadeModal } from '@/components/modals/NovaUnidadeModal';

export default function UnidadesPage({
  openDetail,
}: {
  openDetail: (item: DetailItem) => void;
}) {
  const [centrosList, setCentrosList] = useLocal<Centro[]>('licere_centros', centros);
  const querySearch = useQuerySearch();
  const [search, setSearch] = useState(querySearch);
  const [filter, setFilter] = useState('Todos');
  const [addOpen, setAddOpen] = useState(false);

  const filtered = centrosList.filter(
    (center) =>
      `${center.nome} ${center.cidade} ${center.estado} ${center.responsavel}`
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (filter === 'Todos' || center.status === filter),
  );

  return (
    <main className="content">
      <PageHeader eyebrow="Rede operacional" title="Unidades" action={() => setAddOpen(true)} actionLabel="Nova unidade" />
      <div className="list-card units-list-card animate-rise">
        <FilterBar
          search={search}
          setSearch={setSearch}
          filter={filter}
          setFilter={setFilter}
          options={['Operando', 'Em expansão']}
          placeholder="Buscar unidade ou cidade"
          onClear={() => {
            setSearch('');
            setFilter('Todos');
          }}
        />
        <ListHeader count={filtered.length} label="unidades acompanhadas" />
        <div className="unit-list">
          {filtered.map((center) => (
            <button
              className="unit-row"
              onClick={() => openDetail(center)}
              key={center.id}
              data-testid={`row-unidade-${center.id}`}
            >
              <span className="unit-symbol">{initials(center.nome)}</span>
              <span className="unit-name">
                <b>{center.nome}</b>
                <small>
                  {center.cidade} — {center.estado}
                </small>
              </span>
              <span className="unit-owner">{center.responsavel}</span>
              <StatusPill status={center.status} />
              <ChevronRight size={16} />
            </button>
          ))}
        </div>
        {filtered.length === 0 && (
          <EmptyState
            title="Nenhuma unidade encontrada"
            description="Ajuste a busca ou o filtro."
            onClear={() => {
              setSearch('');
              setFilter('Todos');
            }}
          />
        )}
      </div>
      <NovaUnidadeModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={(nova) => setCentrosList((prev) => [nova, ...prev])}
      />
    </main>
  );
}
