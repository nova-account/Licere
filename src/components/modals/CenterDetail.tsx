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
import { cn } from '@/lib/utils';

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
  const { deleteCentro, user } = useAppData();
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
          <small className="inline-flex items-center gap-1 whitespace-nowrap">
            <MapPin size={13} className="shrink-0" />
            <span>{item.cidade} — {item.estado}</span>
          </small>
        </span>
        <StatusPill status={item.status} />
      </div>

      {isInactive && (
        <div
          className="my-3.5 py-3 px-3.5 rounded-[8px] bg-[#d9534f]/[0.08] border border-[#d9534f]/25 flex items-start gap-2.5 text-[#a94442] text-[13px] leading-[1.45]"
        >
          <Lock size={18} className="shrink-0 mt-0.5" />
          <div>
            <strong>Unidade Inativa — Modo Somente Leitura</strong>
            <p className="mt-1 m-0 text-[12px] text-[#666]">
              Esta unidade está desativada. Seus documentos e tarefas são exibidos apenas para consulta e não é permitido vincular novas pendências.
            </p>
          </div>
        </div>
      )}

      {errorMessage && (
        <div
          className="my-3.5 py-3 px-3.5 rounded-[8px] bg-[#f0ad4e]/[0.12] border border-[#f0ad4e]/35 flex items-start gap-2.5 text-[#8a6d3b] text-[13px]"
        >
          <AlertTriangle size={18} className="shrink-0 mt-0.5" />
          <div>
            <strong>Bloqueio de exclusão</strong>
            <p className="mt-1 m-0 text-[12px]">{errorMessage}</p>
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
      <div className="relationship-section mt-5">
        <div className="relationship-title">
          <span className="flex items-center gap-1.5">
            <FileText size={15} /> Documentos vinculados
          </span>
          <b>{centerDocs.length}</b>
        </div>
        {centerDocs.length === 0 ? (
          <p className="text-[12px] text-[#7a9186] my-2 m-0">
            Nenhum documento anexado a esta unidade.
          </p>
        ) : (
          <div className="flex flex-col gap-1.5 mt-2">
            {centerDocs.map((doc) => {
              const docStatus = getDocumentStatus(doc.validade);
              return (
                <div
                  key={doc.id}
                  onClick={() => !isInactive && onOpen(doc)}
                  className={cn(
                    'flex items-center justify-between py-2 px-3 rounded-[8px] bg-[#f9fbf9] border border-[#edf1ee] text-[12px]',
                    isInactive ? 'cursor-default' : 'cursor-pointer',
                  )}
                >
                  <div className="flex flex-col gap-0.5 max-w-[70%]">
                    <b className="text-[#35614f]">{doc.nome}</b>
                    <span className="text-[#7a9186] text-[11px]">
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
      <div className="relationship-section mt-5">
        <div className="relationship-title">
          <span className="flex items-center gap-1.5">
            <ListTodo size={15} /> Tarefas vinculadas
          </span>
          <b>{centerTasks.length}</b>
        </div>
        {centerTasks.length === 0 ? (
          <p className="text-[12px] text-[#7a9186] my-2 m-0">
            Nenhuma tarefa cadastrada para esta unidade.
          </p>
        ) : (
          <div className="flex flex-col gap-1.5 mt-2">
            {centerTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => !isInactive && onOpen(task)}
                className={cn(
                  'flex items-center justify-between py-2 px-3 rounded-[8px] bg-[#f9fbf9] border border-[#edf1ee] text-[12px]',
                  isInactive ? 'cursor-default' : 'cursor-pointer',
                )}
              >
                <div className="flex flex-col gap-0.5 max-w-[70%]">
                  <b className="text-[#35614f]">{task.titulo}</b>
                  <span className="text-[#7a9186] text-[11px]">
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
      <div className="relationship-section mt-5">
        <div className="relationship-title">
          <span className="flex items-center gap-1.5">
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
      <div className="relationship-section mt-5">
        <div className="relationship-title">
          <span className="flex items-center gap-1.5">
            <History size={15} /> Histórico de alterações (Auditoria)
          </span>
          <b>Últimas ações</b>
        </div>
        <div className="flex flex-col gap-1.5 mt-2">
          <div className="text-[11px] text-[#55685d] py-2 px-2.5 bg-[#f8faf9] rounded-[6px] border border-[#edf1ee] leading-[1.4]">
            <b>{user?.nome || 'Gestor'}</b> alterou o status da unidade para <strong>{item.status}</strong> · <span className="text-[#889e92]">há 2 dias</span>
          </div>
          <div className="text-[11px] text-[#55685d] py-2 px-2.5 bg-[#f8faf9] rounded-[6px] border border-[#edf1ee] leading-[1.4]">
            <b>Sistema</b> sincronizou {centerDocs.length} documento(s) e {centerTasks.length} tarefa(s) · <span className="text-[#889e92]">há 5 dias</span>
          </div>
          <div className="text-[11px] text-[#55685d] py-2 px-2.5 bg-[#f8faf9] rounded-[6px] border border-[#edf1ee] leading-[1.4]">
            <b>{item.responsavel}</b> realizou a validação de conformidade da filial · <span className="text-[#889e92]">14 jan 2026</span>
          </div>
        </div>
      </div>

      {/* Ação de exclusão protegida com regra de negócio */}
      <div
        className="mt-7 pt-4 border-t border-[#edf1ee] flex justify-end"
      >
        <button
          type="button"
          onClick={() => {
            setErrorMessage(null);
            setDeleteConfirmOpen(true);
          }}
          className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-[5px] border border-[#f2dede] bg-white text-[#d9534f] text-[11px] font-medium cursor-pointer transition-colors hover:bg-[#fff5f5]"
        >
          <Trash2 size={12} /> Excluir unidade
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
