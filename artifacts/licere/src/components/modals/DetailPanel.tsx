import React from 'react';
import type { DetailItem, Licenca, Condicionante, Documento, Centro } from '@/shared/types';
import { LicenseDetail } from './LicenseDetail';
import { ConditionDetail } from './ConditionDetail';
import { DocumentDetail } from './DocumentDetail';
import { CenterDetail } from './CenterDetail';

export function DetailPanel({
  item,
  onClose,
  onSave,
  onOpen,
  licencas,
  condicionantes,
  documentos,
}: {
  item: DetailItem | null;
  onClose: () => void;
  onSave: (item: DetailItem) => void;
  onOpen: (item: DetailItem) => void;
  licencas: Licenca[];
  condicionantes: Condicionante[];
  documentos: Documento[];
}) {
  if (!item) return null;

  if ('numero' in item) {
    return (
      <LicenseDetail
        item={item as Licenca}
        onClose={onClose}
        onSave={onSave}
        onOpen={onOpen}
        condicionantes={condicionantes}
        documentos={documentos}
      />
    );
  }

  if ('recorrencia' in item) {
    return (
      <ConditionDetail
        item={item as Condicionante}
        onClose={onClose}
        onSave={onSave}
        onOpen={onOpen}
        licencas={licencas}
        documentos={documentos}
      />
    );
  }

  if ('categoria' in item && 'nome' in item) {
    return (
      <DocumentDetail
        item={item as Documento}
        onClose={onClose}
        onSave={onSave}
        onOpen={onOpen}
        licencas={licencas}
        condicionantes={condicionantes}
      />
    );
  }

  return (
    <CenterDetail
      item={item as Centro}
      onClose={onClose}
      onOpen={onOpen}
      licencas={licencas}
    />
  );
}
