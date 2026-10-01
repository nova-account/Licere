'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, ChevronRight } from 'lucide-react';
import type { Documento } from '@/shared/types';
import { StatusPill } from '@/components/shared/status-pill';
import { PageHeader } from '@/shared/ui';
import { FilterBar, ListHeader, EmptyState, useQuerySearch } from '@/components/layout/list-controls';
import { NovoDocumentoModal } from '@/components/modals/NovoDocumentoModal';
import { getDocumentStatus, formatDateBr } from '@/shared/utils';
import { useAppData } from '@/lib/AppDataContext';

export default function DocumentosPage() {
  const { documentos: items, setDocumentos: setItems, centros, setDetail: openDetail } = useAppData();

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

  const filtered = items.filter(
    (i) =>
      `${i.nome} ${i.categoria} ${getUnitName(i.centroId)}`
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (filter === 'Todos' ||
        i.categoria === filter ||
        getDocumentStatus(i.validade) === filter),
  );

  const [addOpen, setAddOpen] = useState(false);

  const add = () => {
    setAddOpen(true);
  };

  return (
    <main className="content">
      <PageHeader
        eyebrow="Acervo de evidências"
        title="Documentos"
        action={add}
        actionLabel="Adicionar documento"
      />
      <div className="list-card documents-list-card animate-rise">
        <FilterBar
          search={search}
          setSearch={setSearch}
          filter={filter}
          setFilter={setFilter}
          options={[
            'Válido',
            'Próximo do vencimento',
            'Expirado',
            'Relatórios',
            'Licenças',
            'Certificados',
            'Planos & Laudos',
            'Protocolos',
          ]}
          placeholder="Buscar documento, unidade ou categoria"
          onClear={() => {
            setSearch('');
            setFilter('Todos');
          }}
        />
        <ListHeader
          count={filtered.length}
          label="documentos encontrados"
        />

        {isLoading ? (
          <div style={{ padding: '24px 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                style={{
                  height: '110px',
                  borderRadius: '10px',
                  background: 'linear-gradient(90deg, #f0f3f1 25%, #e6ebe8 50%, #f0f3f1 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'pulse 1.5s infinite ease-in-out',
                }}
              />
            ))}
          </div>
        ) : (
          <div className="document-grid">
            {filtered.map((item) => {
              const status = getDocumentStatus(item.validade);
              return (
                <button
                  className="document-card"
                  key={item.id}
                  onClick={() => openDetail(item)}
                  data-testid={`card-documento-${item.id}`}
                >
                  <span className="document-icon">
                    <FileText size={19} />
                  </span>
                  <span className="document-content">
                    <b>{item.nome}</b>
                    <small>
                      {getUnitName(item.centroId)} · {item.categoria}
                    </small>
                    <span className="document-meta">
                      <span>Validade {formatDateBr(item.validade)}</span>
                      <span>{item.tamanho}</span>
                    </span>
                  </span>
                  <span className="document-status">
                    <StatusPill status={status} />
                    <ChevronRight size={15} />
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <EmptyState
            title="Nenhum documento encontrado"
            description="Ajuste a busca ou o filtro."
            onClear={() => {
              setSearch('');
              setFilter('Todos');
            }}
          />
        )}
      </div>
      <NovoDocumentoModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={(novo) => setItems((prev) => [novo, ...prev])}
      />
    </main>
  );
}
