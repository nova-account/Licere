import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import type { Condicionante, Documento, Licenca, DetailItem } from '@/shared/types';
import { centros } from '@/shared/data';
import { StatusPill } from '@/components/shared/status-pill';
import { formatDateBr } from '@/shared/utils';
import { DrawerShell, RelationshipLink } from './DrawerShell';

const centerName = (id: string) =>
  centros.find((center) => center.id === id)?.nome ?? id;

export function LicenseDetail({
  item,
  onClose,
  onSave,
  onOpen,
  condicionantes,
  documentos,
}: {
  item: Licenca;
  onClose: () => void;
  onSave: (item: DetailItem) => void;
  onOpen: (item: DetailItem) => void;
  condicionantes: Condicionante[];
  documentos: Documento[];
}) {
  const [draft, setDraft] = useState<Licenca>(item);

  const relatedConditions = condicionantes.filter((c) => c.licencaId === draft.id);
  const relatedDocuments = documentos.filter((d) => d.licencaId === draft.id);

  return (
    <DrawerShell
      title={draft.tipo}
      subtitle={draft.numero}
      eyebrow="Detalhes da licença"
      onClose={onClose}
      onSave={() => onSave(draft)}
    >
      <div className="drawer-file">
        <span className="document-icon">
          <ShieldCheck size={20} />
        </span>
        <span>
          <b>{draft.orgao}</b>
          <small>Emissão {formatDateBr(draft.emissao)}</small>
        </span>
        <StatusPill status={draft.status} />
      </div>

      <label className="field-label">
        Observação
        <textarea
          value={draft.observacao}
          onChange={(e) => setDraft({ ...draft, observacao: e.target.value })}
        />
      </label>

      <div className="drawer-facts">
        <div>
          <span>Unidade</span>
          <b>{centerName(draft.centroId)}</b>
        </div>
        <div>
          <span>Vencimento</span>
          <b>{formatDateBr(draft.vencimento)}</b>
        </div>
        <div>
          <span>Criticidade</span>
          <b>{draft.criticidade}</b>
        </div>
        <div>
          <span>Condicionantes</span>
          <b>{relatedConditions.length} vinculadas</b>
        </div>
      </div>

      <div className="relationship-section">
        <div className="relationship-title">
          <span>Obrigações desta licença</span>
          <b>{relatedConditions.length}</b>
        </div>
        {relatedConditions.length > 0 ? (
          relatedConditions.map((condition) => (
            <RelationshipLink
              key={condition.id}
              label={condition.titulo}
              onClick={() => onOpen(condition)}
            />
          ))
        ) : (
          <p className="relationship-empty">Nenhuma condicionante vinculada.</p>
        )}
        <div className="relationship-title">
          <span>Evidências relacionadas</span>
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

    </DrawerShell>
  );
}
