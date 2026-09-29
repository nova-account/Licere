'use client';
export const dynamic = 'force-dynamic';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, MoreHorizontal } from 'lucide-react';
import type { DetailItem, Documento } from '@/shared/types';
import { centros } from '@/shared/data';
import { StatusPill } from '@/components/shared/status-pill';
import { PageHeader } from '@/shared/ui';
import { FilterBar, ListHeader, EmptyState, useQuerySearch } from '@/components/layout/list-controls';
import { NovoDocumentoModal } from '@/components/modals/NovoDocumentoModal';
import { getDocumentStatus, formatDateBr } from '@/shared/utils';

const centerName = (id: string) =>
  centros.find((center) => center.id === id)?.nome ?? id;

import { useAppData } from '@/lib/AppDataContext';

export default function DocumentosPage() {
  const { documentos: items, setDocumentos: setItems, setDetail: openDetail } = useAppData();

  const querySearch = useQuerySearch();
  const [search, setSearch] = useState(querySearch);
  const [filter, setFilter] = useState('Todos');
  const router = useRouter();

  const filtered = items.filter(
    (i) =>
      `${i.nome} ${i.categoria} ${centerName(i.centroId)}`
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (filter === 'Todos' || i.categoria === filter || getDocumentStatus(i.validade) === filter),
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
            'Licenças',
            'Relatórios',
            'Planos e programas',
            'Autorizações',
            'Vigente',
            'A vencer',
            'Expirada',
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
                  {centerName(item.centroId)} · {item.categoria}
                </small>
                <span className="document-meta">
                  <span>Validade {formatDateBr(item.validade)}</span>
                  <span>{item.tamanho}</span>
                </span>
              </span>
              <span className="document-status">
                <StatusPill status={status} />
                <MoreHorizontal size={17} />
              </span>
            </button>
            );
          })}
        </div>
        {filtered.length === 0 && (
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
