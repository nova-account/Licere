import React, { useState } from 'react';
import type { Condicionante, Documento, Licenca, DetailItem } from '@/shared/types';
import { StatusPill } from '@/components/shared/status-pill';
import { formatDateBr, centerName } from '@/shared/utils';
import { DrawerShell, RelationshipLink } from './DrawerShell';
import { useAppData } from '@/lib/AppDataContext';

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
  const { centros } = useAppData();
  const [draft, setDraft] = useState<Condicionante>(item);

  const relatedLicense = licencas.find((l) => l.id === draft.licencaId);
  const relatedDocuments = documentos.filter((d) => d.condicionanteId === draft.id);

  return (
    <DrawerShell
      title={draft.titulo}
      subtitle={centerName(item.centroId, centros)}
      eyebrow="Detalhes da obrigação"
      onClose={onClose}
      onSave={() => onSave(draft)}
    >
      <label className="flex flex-col gap-[7px] text-[#6f888c] text-[10px] font-bold">
        Obrigação
        <textarea
          value={draft.titulo}
          onChange={(e) => setDraft({ ...draft, titulo: e.target.value })}
          className="min-h-[105px] resize-y p-[11px] outline-none border border-[#d7e3e5] rounded-[10px] text-[#315b4a] bg-[#fbfcfc] text-xs leading-[1.55] focus:border-[#70a48a] focus:ring-2 focus:ring-[#317d56]/15 font-normal"
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
          <b>{centerName(item.centroId, centros)}</b>
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
        <span className="text-[#6f888c] text-[10px] font-bold">Status atual</span>
        <StatusPill status={draft.status} />
      </div>
    </DrawerShell>
  );
}
