'use client';

import React, { useState } from 'react';
import {
  Building2,
  MapPin,
  FileText,
  ListTodo,
  ShieldCheck,
  AlertTriangle,
  Trash2,
  Lock,
  History,
} from 'lucide-react';
import type { Centro, Licenca, DetailItem, Condicionante, Documento } from '@/shared/types';
import { StatusPill } from '@/components/shared/status-pill';
import { DrawerShell, RelationshipLink } from './DrawerShell';
import { getDocumentStatus, formatDateBr } from '@/shared/utils';
import { useAppData } from '@/lib/AppDataContext';
import { ConfirmModal } from './ConfirmModal';

export function CenterDetail({
  item,
  onClose,
  onOpen,
  licencas,
  condicionantes,
  documentos,
}: {
  item: Centro;
  onClose: () => void;
  onOpen: (item: DetailItem) => void;
  licencas: Licenca[];
  condicionantes: Condicionante[];
  documentos: Documento[];
}) {
  const { deleteCentro } = useAppData();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const centerLicenses = licencas.filter((l) => l.centroId === item.id);
  const centerDocs = documentos.filter((d) => d.centroId === item.id);
  const centerTasks = condicionantes.filter((c) => c.centroId === item.id);

  const isInactive = item.status === 'Inativa';

  const handleDelete = () => {
    const result = deleteCentro(item.id);
    if (!result.success) {
      setErrorMessage(result.reason || 'Não foi possível excluir a unidade.');
    } else {
      onClose();
    }
  };

  return (
    <DrawerShell
      title={item.nome}
      subtitle={`${item.cidade} — ${item.estado}`}
      eyebrow="Detalhamento da unidade"
      onClose={onClose}
    >
      <div className="drawer-file">
        <span className="document-icon">
          <Building2 size={20} />
        </span>
        <span>
          <b>{item.responsavel}</b>
          <small style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
            <MapPin size={13} style={{ flexShrink: 0 }} />
            <span>{item.cidade} — {item.estado}</span>
          </small>
        </span>
        <StatusPill status={item.status} />
      </div>

      {isInactive && (
        <div
          style={{
            margin: '14px 0',
            padding: '12px 14px',
            borderRadius: '8px',
            background: 'rgba(217, 83, 79, 0.08)',
            border: '1px solid rgba(217, 83, 79, 0.25)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            color: '#a94442',
            fontSize: '13px',
            lineHeight: 1.45,
          }}
        >
          <Lock size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>Unidade Inativa — Modo Somente Leitura</strong>
            <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#666' }}>
              Esta unidade está desativada. Seus documentos e tarefas são exibidos apenas para consulta e não é permitido vincular novas pendências.
            </p>
          </div>
        </div>
      )}

      {errorMessage && (
        <div
          style={{
            margin: '14px 0',
            padding: '12px 14px',
            borderRadius: '8px',
            background: 'rgba(240, 173, 78, 0.12)',
            border: '1px solid rgba(240, 173, 78, 0.35)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            color: '#8a6d3b',
            fontSize: '13px',
          }}
        >
          <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>Bloqueio de exclusão</strong>
            <p style={{ margin: '4px 0 0', fontSize: '12px' }}>{errorMessage}</p>
          </div>
        </div>
      )}

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
          <span>Situação cadastral</span>
          <b>{item.status}</b>
        </div>
        <div>
          <span>Documentos ativos</span>
          <b>{centerDocs.length} no acervo</b>
        </div>
      </div>

      {/* Documentos vinculados */}
      <div className="relationship-section" style={{ marginTop: '20px' }}>
        <div className="relationship-title">
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FileText size={15} /> Documentos vinculados
          </span>
          <b>{centerDocs.length}</b>
        </div>
        {centerDocs.length === 0 ? (
          <p style={{ fontSize: '12px', color: '#7a9186', margin: '8px 0' }}>
            Nenhum documento anexado a esta unidade.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
            {centerDocs.map((doc) => {
              const docStatus = getDocumentStatus(doc.validade);
              return (
                <div
                  key={doc.id}
                  onClick={() => !isInactive && onOpen(doc)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: '#f9fbf9',
                    border: '1px solid #edf1ee',
                    fontSize: '12px',
                    cursor: isInactive ? 'default' : 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', maxWidth: '70%' }}>
                    <b style={{ color: '#243029' }}>{doc.nome}</b>
                    <span style={{ color: '#7a9186', fontSize: '11px' }}>
                      Validade: {formatDateBr(doc.validade)}
                    </span>
                  </div>
                  <StatusPill status={docStatus} />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Tarefas vinculadas */}
      <div className="relationship-section" style={{ marginTop: '20px' }}>
        <div className="relationship-title">
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ListTodo size={15} /> Tarefas vinculadas
          </span>
          <b>{centerTasks.length}</b>
        </div>
        {centerTasks.length === 0 ? (
          <p style={{ fontSize: '12px', color: '#7a9186', margin: '8px 0' }}>
            Nenhuma tarefa cadastrada para esta unidade.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
            {centerTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => !isInactive && onOpen(task)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  background: '#f9fbf9',
                  border: '1px solid #edf1ee',
                  fontSize: '12px',
                  cursor: isInactive ? 'default' : 'pointer',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', maxWidth: '70%' }}>
                  <b style={{ color: '#243029' }}>{task.titulo}</b>
                  <span style={{ color: '#7a9186', fontSize: '11px' }}>
                    Prazo: {task.prazo} · Resp: {task.responsavel}
                  </span>
                </div>
                <StatusPill status={task.status} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Licenças vinculadas */}
      <div className="relationship-section" style={{ marginTop: '20px' }}>
        <div className="relationship-title">
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={15} /> Licenças ambientais
          </span>
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

      {/* Histórico de alterações e auditoria */}
      <div className="relationship-section" style={{ marginTop: '20px' }}>
        <div className="relationship-title">
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <History size={15} /> Histórico de alterações (Auditoria)
          </span>
          <b>Últimas ações</b>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
          <div style={{ fontSize: '11px', color: '#55685d', padding: '8px 10px', background: '#f8faf9', borderRadius: '6px', border: '1px solid #edf1ee', lineHeight: 1.4 }}>
            <b>Marina Azevedo</b> alterou o status da unidade para <strong>{item.status}</strong> · <span style={{ color: '#889e92' }}>há 2 dias</span>
          </div>
          <div style={{ fontSize: '11px', color: '#55685d', padding: '8px 10px', background: '#f8faf9', borderRadius: '6px', border: '1px solid #edf1ee', lineHeight: 1.4 }}>
            <b>Sistema</b> sincronizou {centerDocs.length} documento(s) e {centerTasks.length} tarefa(s) · <span style={{ color: '#889e92' }}>há 5 dias</span>
          </div>
          <div style={{ fontSize: '11px', color: '#55685d', padding: '8px 10px', background: '#f8faf9', borderRadius: '6px', border: '1px solid #edf1ee', lineHeight: 1.4 }}>
            <b>{item.responsavel}</b> realizou a validação de conformidade da filial · <span style={{ color: '#889e92' }}>14 jan 2026</span>
          </div>
        </div>
      </div>

      {/* Ação de exclusão protegida com regra de negócio */}
      <div
        style={{
          marginTop: '28px',
          paddingTop: '16px',
          borderTop: '1px solid #edf1ee',
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <button
          type="button"
          onClick={() => {
            setErrorMessage(null);
            setDeleteConfirmOpen(true);
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            borderRadius: '6px',
            border: '1px solid #f2dede',
            background: '#fff',
            color: '#d9534f',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <Trash2 size={14} /> Excluir unidade
        </button>
      </div>

      <ConfirmModal
        open={deleteConfirmOpen}
        title="Confirmar exclusão de unidade"
        description={`Deseja realmente excluir a unidade "${item.nome}"? Esta ação removerá a unidade da listagem.`}
        onConfirm={() => {
          setDeleteConfirmOpen(false);
          handleDelete();
        }}
        onCancel={() => setDeleteConfirmOpen(false)}
      />
    </DrawerShell>
  );
}
