'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { StatusPill } from '@/components/shared/status-pill';
import { PageHeader, Avatar } from '@/shared/ui';
import { FilterBar, ListHeader, EmptyState, ListSkeleton, useQuerySearch } from '@/components/layout/list-controls';
import { NovaUnidadeModal } from '@/components/modals/NovaUnidadeModal';
import { useAppData } from '@/lib/AppDataContext';

const ITEMS_PER_PAGE = 5;

export default function UnidadesPage() {
  const { centros, isLoaded, setDetail: openDetail, saveDetail } = useAppData();

  const [search, setSearch] = useState('');
  useQuerySearch(setSearch);
  const [filter, setFilter] = useState('Todos');
  const [addOpen, setAddOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = centros.filter(
    (center) =>
      `${center.nome} ${center.cidade} ${center.estado} ${center.responsavel}`
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (filter === 'Todos' || center.status === filter),
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE,
  );

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const handleFilterChange = (val: string) => {
    setFilter(val);
    setCurrentPage(1);
  };

  return (
    <main className="content">
      <PageHeader
        eyebrow="Rede operacional"
        title="Unidades"
        action={() => setAddOpen(true)}
        actionLabel="Nova unidade"
      />
      <div className="list-card units-list-card animate-rise">
        <FilterBar
          search={search}
          setSearch={handleSearchChange}
          filter={filter}
          setFilter={handleFilterChange}
          options={['Ativa', 'Inativa']}
          placeholder="Buscar unidade, cidade ou responsável"
          onClear={() => {
            setSearch('');
            setFilter('Todos');
            setCurrentPage(1);
          }}
        />
        <ListHeader
          count={filtered.length}
          label={!isLoaded ? 'carregando...' : 'unidades cadastradas'}
        />

        {!isLoaded ? (
          <ListSkeleton variant="unit" rows={5} />
        ) : centros.length === 0 ? (
          <EmptyState
            title="Nenhuma unidade cadastrada"
            description="Comece cadastrando sua primeira unidade operacional no sistema."
            actionLabel="Nova unidade"
            onAction={() => setAddOpen(true)}
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="Nenhuma unidade encontrada"
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
              setCurrentPage(1);
            }}
          />
        ) : (
          <div className="w-full">
            {paginated.map((center) => (
              <button
                className="grid [grid-template-columns:38px_minmax(180px,1fr)_minmax(150px,0.65fr)_auto_16px] max-[760px]:[grid-template-columns:36px_1fr_auto_16px] items-center w-full gap-3.5 max-[760px]:gap-2 px-5 py-3.5 border-t border-[#e4ebed] first:border-t-0 text-inherit bg-transparent text-left hover:bg-[rgba(14,80,55,0.025)] cursor-pointer transition-colors"
                onClick={() => openDetail(center)}
                key={center.id}
                data-testid={`row-unidade-${center.id}`}
              >
                <Avatar name={center.nome} size="md" shape="rounded" />
                <span className="flex flex-col gap-1 min-w-0">
                  <b className="truncate text-[#234a3a] text-xs font-bold">
                    {center.nome}
                  </b>
                  <small className="text-[#819397] text-[10px]">
                    {center.cidade} — {center.estado}
                  </small>
                </span>
                <span className="flex items-center gap-1.5 text-[#6c796e] text-[10px] min-w-0 truncate max-[760px]:hidden">
                  <Avatar name={center.responsavel} size="xs" shape="circle" />
                  <span className="truncate">{center.responsavel}</span>
                </span>
                <StatusPill status={center.status} />
                <ChevronRight size={16} className="text-[#9eafb1] shrink-0" />
              </button>
            ))}
          </div>
        )}

        {/* Paginação */}
        {isLoaded && filtered.length > 0 && (
          <div className="pagination-bar">
            <span className="pagination-info">
              Exibindo {(safePage - 1) * ITEMS_PER_PAGE + 1} a{' '}
              {Math.min(safePage * ITEMS_PER_PAGE, filtered.length)} de{' '}
              {filtered.length} unidades
            </span>
            <div className="pagination-controls">
              <button
                type="button"
                className="pagination-btn"
                disabled={safePage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                aria-label="Página anterior"
              >
                <ChevronLeft size={14} /> Anterior
              </button>
              <span className="pagination-current">
                {safePage} de {totalPages}
              </span>
              <button
                type="button"
                className="pagination-btn"
                disabled={safePage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                aria-label="Próxima página"
              >
                Próxima <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      <NovaUnidadeModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={(nova) => saveDetail(nova)}
      />
    </main>
  );
}
