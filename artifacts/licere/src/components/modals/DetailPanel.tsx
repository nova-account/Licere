import React, { useState, useEffect } from 'react';
import {
  Building2,
  Check,
  ChevronRight,
  Download,
  FileCheck2,
  MapPin,
  ShieldCheck,
  X,
} from 'lucide-react';
import type { Centro, Condicionante, DetailItem, Documento, Licenca } from '@/shared/types';
import { centros } from '@/shared/data';
import { StatusPill } from '@/components/ui/StatusPill';

const centerName = (id: string) =>
  centros.find((center) => center.id === id)?.nome ?? id;

const formatDate = (value: string) => {
  if (!value) return '';
  const [y, m, d] = value.split('-');
  if (!d) return value;
  return `${d}/${m}/${y}`;
};

function RelationshipLink({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button className="relationship-link" onClick={onClick}>
      <span>{label}</span>
      <ChevronRight size={14} />
    </button>
  );
}

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
  const [draft, setDraft] = useState<DetailItem | null>(item);

  useEffect(() => {
    setDraft(item);
  }, [item]);

  if (!draft) return null;

  const isLicense = 'numero' in draft;
  const isCondition = 'recorrencia' in draft;
  const isDocument = 'categoria' in draft && 'nome' in draft;
  const isCenter = !isLicense && !isCondition && !isDocument;

  const title = isLicense
    ? draft.tipo
    : isCondition
      ? draft.titulo
      : isDocument
        ? draft.nome
        : draft.nome;

  const subtitle = isLicense
    ? draft.numero
    : isCondition
      ? centerName(draft.centroId)
      : isDocument
        ? draft.categoria
        : `${(draft as Centro).cidade} — ${(draft as Centro).estado}`;

  const relatedLicense = isCondition
    ? licencas.find((l) => l.id === draft.licencaId)
    : isDocument && draft.licencaId
      ? licencas.find((l) => l.id === draft.licencaId)
      : undefined;

  const relatedCondition =
    isDocument && draft.condicionanteId
      ? condicionantes.find((c) => c.id === draft.condicionanteId)
      : undefined;

  const relatedConditions = isLicense
    ? condicionantes.filter((c) => c.licencaId === draft.id)
    : [];

  const relatedDocuments = isLicense
    ? documentos.filter((d) => d.licencaId === draft.id)
    : isCondition
      ? documentos.filter((d) => d.condicionanteId === draft.id)
      : [];

  const centerId = isCenter ? draft.id : draft.centroId;
  const centerLicenses = isCenter
    ? licencas.filter((l) => l.centroId === centerId)
    : [];

  return (
    <div
      className="drawer-backdrop"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <section className="detail-drawer animate-fade" aria-label="detalhes">
        <div className="drawer-head">
          <div>
            <p className="eyebrow">
              {isLicense
                ? 'Detalhes da licença'
                : isCondition
                  ? 'Detalhes da obrigação'
                  : isDocument
                    ? 'Detalhes da evidência'
                    : 'Detalhes da unidade'}
            </p>
            <h2>{title}</h2>
            <span>{subtitle}</span>
          </div>
          <button
            aria-label="fechar detalhes"
            onClick={onClose}
            className="icon-btn"
          >
            <X size={18} />
          </button>
        </div>

        <div className="drawer-content">
          {isLicense && (
            <div className="drawer-file">
              <span className="document-icon">
                <ShieldCheck size={20} />
              </span>
              <span>
                <b>{draft.orgao}</b>
                <small>Emissão {formatDate(draft.emissao)}</small>
              </span>
              <StatusPill status={draft.status} />
            </div>
          )}

          {isDocument && (
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
          )}

          {isCenter && (
            <div className="drawer-file">
              <span className="document-icon">
                <Building2 size={20} />
              </span>
              <span>
                <b>{(draft as Centro).responsavel}</b>
                <small>
                  <MapPin size={11} /> {(draft as Centro).cidade} —{' '}
                  {(draft as Centro).estado}
                </small>
              </span>
              <StatusPill status={(draft as Centro).status} />
            </div>
          )}

          {!isCenter && (
            <label className="field-label">
              {isCondition ? 'Obrigação' : 'Observação'}
              <textarea
                value={
                  isLicense
                    ? (draft as Licenca).observacao
                    : isCondition
                      ? (draft as Condicionante).titulo
                      : (draft as Documento).nome
                }
                onChange={(e) =>
                  setDraft(
                    isLicense
                      ? { ...(draft as Licenca), observacao: e.target.value }
                      : isCondition
                        ? { ...(draft as Condicionante), titulo: e.target.value }
                        : { ...(draft as Documento), nome: e.target.value },
                  )
                }
              />
            </label>
          )}

          <div className="drawer-facts">
            {isLicense && (
              <>
                <div>
                  <span>Unidade</span>
                  <b>{centerName((draft as Licenca).centroId)}</b>
                </div>
                <div>
                  <span>Vencimento</span>
                  <b>{formatDate((draft as Licenca).vencimento)}</b>
                </div>
                <div>
                  <span>Criticidade</span>
                  <b>{(draft as Licenca).criticidade}</b>
                </div>
                <div>
                  <span>Condicionantes</span>
                  <b>{relatedConditions.length} vinculadas</b>
                </div>
              </>
            )}
            {isCondition && (
              <>
                <div>
                  <span>Responsável</span>
                  <b>{(draft as Condicionante).responsavel}</b>
                </div>
                <div>
                  <span>Prazo</span>
                  <b>{formatDate((draft as Condicionante).prazo)}</b>
                </div>
                <div>
                  <span>Recorrência</span>
                  <b>{(draft as Condicionante).recorrencia}</b>
                </div>
                <div>
                  <span>Unidade</span>
                  <b>{centerName((draft as Condicionante).centroId)}</b>
                </div>
              </>
            )}
            {isDocument && (
              <>
                <div>
                  <span>Unidade</span>
                  <b>{centerName((draft as Documento).centroId)}</b>
                </div>
                <div>
                  <span>Validade</span>
                  <b>{(draft as Documento).validade}</b>
                </div>
                <div>
                  <span>Tamanho</span>
                  <b>{(draft as Documento).tamanho}</b>
                </div>
              </>
            )}
            {isCenter && (
              <>
                <div>
                  <span>Responsável</span>
                  <b>{(draft as Centro).responsavel}</b>
                </div>
                <div>
                  <span>Localização</span>
                  <b>
                    {(draft as Centro).cidade} — {(draft as Centro).estado}
                  </b>
                </div>
                <div>
                  <span>Licenças</span>
                  <b>{centerLicenses.length} registradas</b>
                </div>
                <div>
                  <span>Status</span>
                  <b>{(draft as Centro).status}</b>
                </div>
              </>
            )}
          </div>

          <div className="relationship-section">
            {isLicense && (
              <>
                <div className="relationship-title">
                  <span>Obrigações desta licença</span>
                  <b>{relatedConditions.length}</b>
                </div>
                {relatedConditions.length ? (
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
              </>
            )}

            {isCondition && (
              <>
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
              </>
            )}

            {isDocument && (
              <>
                <div className="relationship-title">
                  <span>Unidade responsável</span>
                </div>
                <RelationshipLink
                  label={centerName((draft as Documento).centroId)}
                  onClick={() =>
                    onOpen(
                      centros.find(
                        (center) => center.id === (draft as Documento).centroId,
                      ) ?? centros[0],
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
              </>
            )}

            {isCenter && (
              <>
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
              </>
            )}
          </div>

          {!isCenter && (
            <div className="drawer-status">
              <span>Status atual</span>
              <StatusPill status={draft.status} />
            </div>
          )}
        </div>

        <div className="drawer-foot" style={{ display: 'flex', justifyContent: 'flex-end' }}>
          {!isCenter && (
            <button
              className="primary-btn"
              onClick={() => {
                onSave(draft);
                onClose();
              }}
            >
              <Check size={16} />
              Salvar alterações
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
