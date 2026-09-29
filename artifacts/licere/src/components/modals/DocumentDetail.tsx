import React, { useState } from 'react';
import { Download, FileCheck2 } from 'lucide-react';
import type { Condicionante, Documento, Licenca, DetailItem } from '@/shared/types';
import { centros } from '@/shared/data';
import { StatusPill } from '@/components/shared/status-pill';
import { getDocumentStatus, formatDateBr } from '@/shared/utils';
import { DrawerShell, RelationshipLink } from './DrawerShell';

const centerName = (id: string) =>
  centros.find((center) => center.id === id)?.nome ?? id;

export function DocumentDetail({
  item,
  onClose,
  onSave,
  onOpen,
  licencas,
  condicionantes,
}: {
  item: Documento;
  onClose: () => void;
  onSave: (item: DetailItem) => void;
  onOpen: (item: DetailItem) => void;
  licencas: Licenca[];
  condicionantes: Condicionante[];
}) {
  const [draft, setDraft] = useState<Documento>(item);

  const relatedLicense = draft.licencaId
    ? licencas.find((l) => l.id === draft.licencaId)
    : undefined;
  
  const relatedCondition = draft.condicionanteId
    ? condicionantes.find((c) => c.id === draft.condicionanteId)
    : undefined;

  return (
    <DrawerShell
      title={draft.nome}
      subtitle={draft.categoria}
      eyebrow="Detalhes da evidência"
      onClose={onClose}
      onSave={() => onSave(draft)}
    >
      <div className="drawer-file">
        <span className="document-icon">
          <FileCheck2 size={20} />
        </span>
        <span>
          <b>{draft.categoria}</b>
          <small>Atualizado em {draft.atualizadoEm}</small>
        </span>
        <Download size={17} />
      </div>

      <label className="field-label">
        Observação
        <textarea
          value={draft.nome}
          onChange={(e) => setDraft({ ...draft, nome: e.target.value })}
        />
      </label>

      <div className="drawer-facts">
        <div>
          <span>Unidade</span>
          <b>{centerName(draft.centroId)}</b>
        </div>
        <div>
          <span>Validade</span>
          <b>{formatDateBr(draft.validade)}</b>
        </div>
        <div>
          <span>Tamanho</span>
          <b>{draft.tamanho}</b>
        </div>
      </div>

      <div className="relationship-section">
        <div className="relationship-title">
          <span>Unidade responsável</span>
        </div>
        <RelationshipLink
          label={centerName(draft.centroId)}
          onClick={() =>
            onOpen(
              centros.find((center) => center.id === draft.centroId) ?? centros[0],
            )
          }
        />
        {relatedLicense && (
          <>
            <div className="relationship-title">
              <span>Licença suportada</span>
            </div>
            <RelationshipLink
              label={`${relatedLicense.tipo} · ${relatedLicense.numero}`}
              onClick={() => onOpen(relatedLicense)}
            />
          </>
        )}
        {relatedCondition && (
          <>
            <div className="relationship-title">
              <span>Condicionante suportada</span>
            </div>
            <RelationshipLink
              label={relatedCondition.titulo}
              onClick={() => onOpen(relatedCondition)}
            />
          </>
        )}
      </div>

      <div className="drawer-status">
        <span className="field-label">Status atual</span>
        <StatusPill status={getDocumentStatus(draft.validade)} />
      </div>
    </DrawerShell>
  );
}
