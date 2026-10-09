'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Centro } from '@/shared/types';
import { StatusPill } from '@/components/shared/status-pill';
import { PageHeader, initials } from '@/shared/ui';
import { FilterBar, ListHeader, EmptyState, useQuerySearch } from '@/components/layout/list-controls';
import { NovaUnidadeModal } from '@/components/modals/NovaUnidadeModal';
import { useAppData } from '@/lib/AppDataContext';

const ITEMS_PER_PAGE = 5;

export default function UnidadesPage() {
  const { centros, setCentros, setDetail: openDetail } = useAppData();

  const querySearch = useQuerySearch();
  const [search, setSearch] = useState(querySearch);
  const [filter, setFilter] = useState('Todos');
  const [addOpen, setAddOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

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
          label="unidades cadastradas"
        />

        {isLoading ? (
          <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                style={{
                  height: '52px',
                  borderRadius: '8px',
                  background: 'linear-gradient(90deg, #f0f3f1 25%, #e6ebe8 50%, #f0f3f1 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'pulse 1.5s infinite ease-in-out',
                }}
              />
            ))}
          </div>
        ) : (
          <div className="unit-list">
            {paginated.map((center) => (
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
        )}

        {!isLoading && filtered.length === 0 && (
          <EmptyState
            title="Nenhuma unidade encontrada"
            description="Ajuste a busca ou os filtros para encontrar a unidade desejada."
            onClear={() => {
              setSearch('');
              setFilter('Todos');
              setCurrentPage(1);
            }}
          />
        )}

        {/* Paginação */}
        {!isLoading && filtered.length > 0 && (
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
        onSave={(nova) => setCentros((prev) => [nova, ...prev])}
      />
    </main>
  );
}
