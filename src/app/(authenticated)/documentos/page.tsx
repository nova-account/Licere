'use client';

import React, { useState } from 'react';
import { FileText, ChevronRight } from 'lucide-react';
import { StatusPill } from '@/components/shared/status-pill';
import { PageHeader } from '@/shared/ui';
import { FilterBar, ListHeader, EmptyState, ListSkeleton, useQuerySearch } from '@/components/layout/list-controls';
import { NovoDocumentoModal } from '@/components/modals/NovoDocumentoModal';
import { getDocumentStatus, formatDateBr, centerName } from '@/shared/utils';
import { useAppData } from '@/lib/AppDataContext';

export default function DocumentosPage() {
  const { documentos: items, centros, isLoaded, setDetail: openDetail, saveDetail } = useAppData();

  const [search, setSearch] = useState('');
  useQuerySearch(setSearch);
  const [filter, setFilter] = useState('Todos');

  const filtered = items.filter(
    (i) =>
      `${i.nome} ${i.categoria} ${centerName(i.centroId, centros)}`
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
          label={!isLoaded ? 'carregando...' : 'documentos encontrados'}
        />

        {!isLoaded ? (
          <ListSkeleton variant="document" rows={5} />
        ) : items.length === 0 ? (
          <EmptyState
            title="Nenhum documento cadastrado"
            description="Adicione seu primeiro documento ou evidência regulatória no acervo da empresa."
            actionLabel="Adicionar documento"
            onAction={add}
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="Nenhum documento encontrado"
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
          <div className="w-full">
            {filtered.map((item) => {
              const status = getDocumentStatus(item.validade);
              return (
                <button
                  className="document-card !px-5 max-[760px]:!px-3.5"
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
                      {centerName(item.centroId, centros)} · {item.categoria}
                    </small>
                    <span className="document-meta">
                      <span>Validade {formatDateBr(item.validade)}</span>
                      <span>{item.tamanho}</span>
                    </span>
                  </span>
                  <span className="document-status">
                    <StatusPill status={status} />
                    <ChevronRight size={15} className="shrink-0 text-[#b0b8af]" />
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
      <NovoDocumentoModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={(novo) => saveDetail(novo)}
      />
    </main>
  );
}
