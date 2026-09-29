import React, { useState } from 'react';
import type { Condicionante, Documento, Licenca, DetailItem } from '@/shared/types';
import { centros } from '@/shared/data';
import { StatusPill } from '@/components/shared/status-pill';
import { formatDateBr } from '@/shared/utils';
import { DrawerShell, RelationshipLink } from './DrawerShell';

const centerName = (id: string) =>
  centros.find((center) => center.id === id)?.nome ?? id;

export function ConditionDetail({
  item,
  onClose,
  onSave,
  onOpen,
  licencas,
  documentos,
}: {
  item: Condicionante;
  onClose: () => void;
  onSave: (item: DetailItem) => void;
  onOpen: (item: DetailItem) => void;
  licencas: Licenca[];
  documentos: Documento[];
}) {
  const [draft, setDraft] = useState<Condicionante>(item);

  const relatedLicense = licencas.find((l) => l.id === draft.licencaId);
  const relatedDocuments = documentos.filter((d) => d.condicionanteId === draft.id);

  return (
    <DrawerShell
      title={draft.titulo}
      subtitle={centerName(draft.centroId)}
      eyebrow="Detalhes da obrigação"
      onClose={onClose}
      onSave={() => onSave(draft)}
    >
      <label className="field-label">
        Obrigação
        <textarea
          value={draft.titulo}
          onChange={(e) => setDraft({ ...draft, titulo: e.target.value })}
        />
      </label>

      <div className="drawer-facts">
        <div>
          <span>Responsável</span>
          <b>{draft.responsavel}</b>
        </div>
        <div>
          <span>Prazo</span>
          <b>{formatDateBr(draft.prazo)}</b>
        </div>
        <div>
          <span>Recorrência</span>
          <b>{draft.recorrencia}</b>
        </div>
        <div>
          <span>Unidade</span>
          <b>{centerName(draft.centroId)}</b>
        </div>
      </div>

      <div className="relationship-section">
        <div className="relationship-title">
          <span>Licença de origem</span>
        </div>
        {relatedLicense ? (
          <RelationshipLink
            label={`${relatedLicense.tipo} · ${relatedLicense.numero}`}
            onClick={() => onOpen(relatedLicense)}
          />
        ) : (
          <p className="relationship-empty">Licença não localizada.</p>
        )}
        <div className="relationship-title">
          <span>Evidências desta obrigação</span>
          <b>{relatedDocuments.length}</b>
        </div>
        {relatedDocuments.map((document) => (
          <RelationshipLink
            key={document.id}
            label={document.nome}
            onClick={() => onOpen(document)}
          />
        ))}
      </div>

      <div className="drawer-status">
        <span className="field-label">Status atual</span>
        <StatusPill status={draft.status} />
      </div>
    </DrawerShell>
  );
}
