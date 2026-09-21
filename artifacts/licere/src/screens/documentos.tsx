import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { FileText, MoreHorizontal } from 'lucide-react';
import type { DetailItem, Documento } from '@/shared/types';
import { centros } from '@/shared/data';
import { StatusPill } from '@/components/ui/StatusPill';
import { PageHeader } from '@/shared/ui';
import { FilterBar, ListHeader, EmptyState, useQuerySearch } from '@/components/ui/PageControls';
import { NovoDocumentoModal } from '@/components/modals/NovoDocumentoModal';

const centerName = (id: string) =>
  centros.find((center) => center.id === id)?.nome ?? id;

export default function DocumentosPage({
  items,
  setItems,
  openDetail,
}: {
  items: Documento[];
  setItems: (v: Documento[] | ((old: Documento[]) => Documento[])) => void;
  openDetail: (item: DetailItem) => void;
}) {
  const querySearch = useQuerySearch();
  const [search, setSearch] = useState(querySearch);
  const [filter, setFilter] = useState('Todos');
  const [, setLocation] = useLocation();

  const filtered = items.filter(
    (i) =>
      `${i.nome} ${i.categoria} ${centerName(i.centroId)}`
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (filter === 'Todos' || i.categoria === filter || i.status === filter),
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
          {filtered.map((item) => (
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
                  <span>Validade {item.validade}</span>
                  <span>{item.tamanho}</span>
                </span>
              </span>
              <span className="document-status">
                <StatusPill status={item.status} />
                <MoreHorizontal size={17} />
              </span>
            </button>
          ))}
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
