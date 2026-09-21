import React, { useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { DetailItem, Licenca } from '@/shared/types';
import { centros } from '@/shared/data';
import { StatusPill } from '@/components/ui/StatusPill';
import { PageHeader, cn } from '@/shared/ui';
import { FilterBar, ListHeader, EmptyState, useQuerySearch } from '@/components/ui/PageControls';
import { NovaLicencaModal } from '@/components/modals/NovaLicencaModal';

const centerName = (id: string) =>
  centros.find((center) => center.id === id)?.nome ?? id;

const formatDate = (value: string) => {
  if (!value) return '';
  const [y, m, d] = value.split('-');
  if (!d) return value;
  return `${d}/${m}/${y}`;
};

export default function LicencasPage({
  items,
  setItems,
  openDetail,
}: {
  items: Licenca[];
  setItems: (v: Licenca[] | ((old: Licenca[]) => Licenca[])) => void;
  openDetail: (item: DetailItem) => void;
}) {
  const querySearch = useQuerySearch();
  const [search, setSearch] = useState(querySearch);
  const [filter, setFilter] = useState('Todos');
  const [sort, setSort] = useState<'vencimento' | 'centro'>('vencimento');
  const [, setLocation] = useLocation();

  const filtered = useMemo(
    () =>
      items
        .filter(
          (item) =>
            `${item.numero} ${item.tipo} ${centerName(item.centroId)}`
              .toLowerCase()
              .includes(search.toLowerCase()) &&
            (filter === 'Todos' ||
              item.status === filter ||
              item.criticidade === filter),
        )
        .sort((a, b) =>
          sort === 'centro'
            ? centerName(a.centroId).localeCompare(centerName(b.centroId))
            : a.vencimento.localeCompare(b.vencimento),
        ),
    [items, search, filter, sort],
  );

  const [addOpen, setAddOpen] = useState(false);

  const add = () => {
    setAddOpen(true);
  };

  return (
    <main className="content">
      <PageHeader
        eyebrow="Base regulatória"
        title="Licenças"
        action={add}
        actionLabel="Nova licença"
      />
      <div className="list-card animate-rise">
        <FilterBar
          search={search}
          setSearch={setSearch}
          filter={filter}
          setFilter={setFilter}
          options={[
            'Vigente',
            'Regular',
            'A vencer',
            'Vencida',
            'Alta',
            'Média',
            'Baixa',
          ]}
          placeholder="Buscar por número, tipo ou unidade"
          onClear={() => {
            setSearch('');
            setFilter('Todos');
          }}
        />
        <ListHeader
          count={filtered.length}
          label="licenças encontradas"
        />
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>
                  Licença{' '}
                  <button onClick={() => setSort('vencimento')}>
                    <ChevronDown size={13} />
                  </button>
                </th>
                <th>Unidade</th>
                <th>Órgão</th>
                <th>Vencimento</th>
                <th>Criticidade</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => openDetail(item)}
                  data-testid={`row-licenca-${item.id}`}
                >
                  <td>
                    <b>{item.tipo}</b>
                    <small>{item.numero}</small>
                  </td>
                  <td>
                    <span className="table-center">
                      <span className="tiny-mark" />
                      {centerName(item.centroId)}
                    </span>
                  </td>
                  <td>{item.orgao}</td>
                  <td>
                    <span
                      className={cn(
                        'date-cell',
                        item.status === 'Vencida' && 'date-danger',
                      )}
                    >
                      {formatDate(item.vencimento)}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`criticality criticality-${item.criticidade.toLowerCase()}`}
                    >
                      <i />
                      {item.criticidade}
                    </span>
                  </td>
                  <td>
                    <StatusPill status={item.status} />
                  </td>
                  <td>
                    <ChevronRight size={16} className="row-chevron" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <EmptyState
              title="Nenhuma licença encontrada"
              description="Ajuste a busca ou o filtro."
              onClear={() => {
                setSearch('');
                setFilter('Todos');
              }}
            />
          )}
        </div>
      </div>
      <NovaLicencaModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={(nova) => setItems((prev) => [nova, ...prev])}
      />
    </main>
  );
}
