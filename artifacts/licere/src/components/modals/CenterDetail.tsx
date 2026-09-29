import React from 'react';
import { Building2, MapPin } from 'lucide-react';
import type { Centro, Licenca, DetailItem } from '@/shared/types';
import { StatusPill } from '@/components/shared/status-pill';
import { DrawerShell, RelationshipLink } from './DrawerShell';

export function CenterDetail({
  item,
  onClose,
  onOpen,
  licencas,
}: {
  item: Centro;
  onClose: () => void;
  onOpen: (item: DetailItem) => void;
  licencas: Licenca[];
}) {
  const centerLicenses = licencas.filter((l) => l.centroId === item.id);

  return (
    <DrawerShell
      title={item.nome}
      subtitle={`${item.cidade} — ${item.estado}`}
      eyebrow="Detalhes da unidade"
      onClose={onClose}
    >
      <div className="drawer-file">
        <span className="document-icon">
          <Building2 size={20} />
        </span>
        <span>
          <b>{item.responsavel}</b>
          <small>
            <MapPin size={11} /> {item.cidade} — {item.estado}
          </small>
        </span>
        <StatusPill status={item.status} />
      </div>

      <div className="drawer-facts">
        <div>
          <span>Responsável</span>
          <b>{item.responsavel}</b>
        </div>
        <div>
          <span>Localização</span>
          <b>
            {item.cidade} — {item.estado}
          </b>
        </div>
        <div>
          <span>Licenças</span>
          <b>{centerLicenses.length} registradas</b>
        </div>
        <div>
          <span>Status</span>
          <b>{item.status}</b>
        </div>
      </div>

      <div className="relationship-section">
        <div className="relationship-title">
          <span>Licenças da unidade</span>
          <b>{centerLicenses.length}</b>
        </div>
        {centerLicenses.map((license) => (
          <RelationshipLink
            key={license.id}
            label={`${license.tipo} · ${license.numero}`}
            onClick={() => onOpen(license)}
          />
        ))}
      </div>
    </DrawerShell>
  );
}
