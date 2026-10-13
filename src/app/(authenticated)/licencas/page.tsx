'use client';
import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

import { StatusPill, CriticalityPill } from '@/components/shared/status-pill';
import { PageHeader } from '@/shared/ui';
import { cn } from '@/lib/utils';
import { FilterBar, ListHeader, EmptyState, ListSkeleton, useQuerySearch } from '@/components/layout/list-controls';
import { NovaLicencaModal } from '@/components/modals/NovaLicencaModal';
import { useAppData } from '@/lib/AppDataContext';
import { formatDate, centerName } from '@/shared/utils';

export default function LicencasPage() {
  const { licencas: items, setDetail: openDetail, centros, isLoaded, saveDetail } = useAppData();

  const [search, setSearch] = useState('');
  useQuerySearch(setSearch);
  const [filter, setFilter] = useState('Todos');
  const [sort, setSort] = useState<'vencimento' | 'centro'>('vencimento');

  const filtered = useMemo(
    () =>
      items
        .filter(
          (item) =>
            `${item.numero} ${item.tipo} ${centerName(item.centroId, centros)}`
              .toLowerCase()
              .includes(search.toLowerCase()) &&
            (filter === 'Todos' ||
              item.status === filter ||
              item.criticidade === filter),
        )
        .sort((a, b) =>
          sort === 'centro'
            ? centerName(a.centroId, centros).localeCompare(centerName(b.centroId, centros))
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
          label={!isLoaded ? 'carregando...' : 'licenças encontradas'}
        />
        {!isLoaded ? (
          <ListSkeleton variant="table" rows={5} />
        ) : items.length === 0 ? (
          <EmptyState
            title="Nenhuma licença cadastrada"
            description="Cadastre sua primeira licença para iniciar o monitoramento de prazos e conformidades."
            actionLabel="Nova licença"
            onAction={add}
          />
        ) : (
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
                        {centerName(item.centroId, centros)}
                      </span>
                    </td>
                    <td>{item.orgao}</td>
                    <td>
                      <span
                        className={cn(
                          'date-cell',
                          item.status === 'Vencida' && 'text-[#991520] font-bold',
                        )}
                      >
                        {formatDate(item.vencimento)}
                      </span>
                    </td>
                    <td>
                      <CriticalityPill criticidade={item.criticidade} />
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
            )}
          </div>
        )}
      </div>
      <NovaLicencaModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={(nova) => saveDetail(nova)}
      />
    </main>
  );
}
