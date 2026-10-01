'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  ClipboardCheck,
  FolderOpen,
  Leaf,
  MoreHorizontal,
  ShieldCheck,
  Building2,
  X,
  AlertTriangle,
} from 'lucide-react';
import { StatusPill } from '@/components/shared/status-pill';
import { PageHeader, initials } from '@/shared/ui';
import { Metric } from '@/components/dashboard/Metric';
import { RiskChart } from '@/components/dashboard/RiskChart';
import { PriorityList } from '@/components/dashboard/PriorityList';
import { useAppData } from '@/lib/AppDataContext';
import { getDocumentStatus } from '@/shared/utils';

export default function DashboardPage() {
  const {
    centros,
    licencas,
    condicionantes,
    documentos,
    setDetail: openDetail,
  } = useAppData();

  const [notice, setNotice] = useState(true);

  // Cálculos em tempo real conforme as regras de negócio do projeto
  const ativasCount = centros.filter((c) => c.status === 'Ativa').length;
  const docsPendentes = documentos.filter(
    (d) => getDocumentStatus(d.validade) !== 'Válido',
  ).length;
  const tarefasPendentes = condicionantes.filter(
    (c) => c.status !== 'Concluída',
  ).length;
  const totalPendencias = docsPendentes + tarefasPendentes;

  return (
    <main className="content">
      <PageHeader
        eyebrow="Operações Brasil · Gestão Corporativa"
        title="Painel Central de Indicadores"
      />

      <div className="metric-grid animate-rise">
        {/* Indicador Geral de Unidades */}
        <Metric
          label="Total de unidades"
          value={`${centros.length}`}
          detail={`${ativasCount} operando ativas`}
          icon={Building2}
          tone="sand"
        />

        {/* Total de Pendências Integradas (Regra Obrigatória do Edital) */}
        <Metric
          label="Total de pendências"
          value={`${totalPendencias}`}
          detail={`${docsPendentes} docs · ${tarefasPendentes} tarefas`}
          icon={ShieldCheck}
          tone={totalPendencias > 5 ? 'peach' : 'green'}
          trend={totalPendencias > 0 ? 'down' : 'up'}
        />

        {/* Indicador de Tarefas Pendentes */}
        <Metric
          label="Tarefas pendentes"
          value={`${tarefasPendentes}`}
          detail="Em andamento ou pendentes"
          icon={ClipboardCheck}
          tone="peach"
        />

        {/* Indicador de Documentos Cadastrados */}
        <Metric
          label="Total de documentos"
          value={`${documentos.length}`}
          detail={`${documentos.length - docsPendentes} válidos no acervo`}
          icon={FolderOpen}
          tone="lavender"
          trend="up"
        />
      </div>

      {notice && (
        <div className="notice-banner animate-rise">
          <div className="notice-icon">
            <AlertTriangle size={17} />
          </div>
          <div>
            <b>Atenção Operacional em Tempo Real</b>
            <span>
              Existem {totalPendencias} pendências monitoradas ({tarefasPendentes}{' '}
              tarefas e {docsPendentes} documentos exigindo atualização).
            </span>
          </div>
          <Link href="/tarefas">
            Ver pendências <ChevronRight size={15} />
          </Link>
          <button onClick={() => setNotice(false)} aria-label="fechar aviso">
            <X size={16} />
          </button>
        </div>
      )}

      <div className="dashboard-grid animate-rise">
        <RiskChart />
        <PriorityList
          licencas={licencas}
          condicionantes={condicionantes}
          onOpen={openDetail}
        />
      </div>

      <div className="lower-grid animate-rise">
        <div className="centers-card">
          <div className="card-heading">
            <div>
              <p className="eyebrow">Rede operacional</p>
              <h2>Unidades</h2>
            </div>
            <Link href="/unidades" className="text-link">
              Ver unidades ({centros.length}) <ChevronRight size={14} />
            </Link>
          </div>
          <div className="centers-table">
            {centros.slice(0, 5).map((center) => (
              <button
                className="center-row"
                onClick={() => openDetail(center)}
                key={center.id}
                data-testid={`button-center-${center.id}`}
              >
                <span className="center-symbol">{initials(center.nome)}</span>
                <span>
                  <b>{center.nome}</b>
                  <small>
                    {center.cidade} — {center.estado}
                  </small>
                </span>
                <span className="center-owner">{center.responsavel}</span>
                <StatusPill status={center.status} />
                <ChevronRight size={15} />
              </button>
            ))}
          </div>
        </div>

        <div className="activity-card">
          <div className="card-heading">
            <div>
              <p className="eyebrow">Registro</p>
              <h2>Atividade recente</h2>
            </div>
            <button
              className="icon-btn"
              onClick={() => setNotice(true)}
              aria-label="ver atividade recente"
            >
              <MoreHorizontal size={18} />
            </button>
          </div>
          <div className="activity-list">
            <div>
              <span className="activity-avatar avatar-olive">BL</span>
              <p>
                <b>Bianca Lima</b> atualizou o <strong>PGRS — CD Extrema</strong>
                <small>Há 32 min · Documentos</small>
              </p>
            </div>
            <div>
              <span className="activity-avatar avatar-sand">RN</span>
              <p>
                <b>Ricardo Nunes</b> concluiu uma tarefa
                <small>Há 2 h · CD Jundiaí</small>
              </p>
            </div>
            <div>
              <span className="activity-avatar avatar-blue">HS</span>
              <p>
                <b>Helena Souza</b> adicionou uma evidência
                <small>Ontem · Licença SEMAD-GO</small>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
