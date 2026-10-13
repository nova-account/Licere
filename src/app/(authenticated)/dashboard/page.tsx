'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  ClipboardCheck,
  FolderOpen,
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
import { CentersCard } from '@/components/dashboard/CentersCard';
import { ActivityCard } from '@/components/dashboard/ActivityCard';
import { ActivityHistoryDrawer } from '@/components/modals/ActivityHistoryDrawer';
import { useAppData } from '@/lib/AppDataContext';
import { getDocumentStatus } from '@/shared/utils';

export default function DashboardPage() {
  const {
    centros,
    licencas,
    condicionantes,
    documentos,
    workspace,
    setDetail: openDetail,
  } = useAppData();

  const [notice, setNotice] = useState(true);
  const [historyOpen, setHistoryOpen] = useState(false);

  // Cálculos em tempo real conforme as regras de negócio do projeto
  const ativasCount = centros.filter((c) => c.status === 'Ativa').length;
  const docsPendentes = documentos.filter(
    (d) => getDocumentStatus(d.validade) !== 'Válido',
  ).length;
  const tarefasPendentes = condicionantes.filter(
    (c) => c.status !== 'Concluída',
  ).length;
  const totalPendencias = docsPendentes + tarefasPendentes;

  // Atividades recentes dinâmicas geradas com base nos dados do acervo
  const recentActivities = useMemo(() => {
    const list: Array<{
      id: string;
      person: string;
      action: string;
      target: string;
      subtitle: string;
      avatarTone: string;
      item: any;
    }> = [];

    // 1. Documentos do acervo
    documentos.slice(0, 3).forEach((doc) => {
      const center = centros.find((c) => c.id === doc.centroId);
      list.push({
        id: `doc-${doc.id}`,
        person: center?.responsavel || 'Equipe Técnica',
        action: 'atualizou o documento',
        target: doc.nome,
        subtitle: `${doc.categoria} · ${center?.nome || 'Unidade Geral'}`,
        avatarTone: 'default',
        item: doc,
      });
    });

    // 2. Condicionantes / Tarefas
    condicionantes.slice(0, 2).forEach((cond) => {
      const center = centros.find((c) => c.id === cond.centroId);
      list.push({
        id: `cond-${cond.id}`,
        person: cond.responsavel || 'Responsável',
        action: cond.status === 'Concluída' ? 'concluiu a tarefa' : 'monitorando a tarefa',
        target: cond.titulo,
        subtitle: `${center?.nome || 'Operação'} · Prazo ${cond.prazo}`,
        avatarTone: 'default',
        item: cond,
      });
    });

    return list.slice(0, 5);
  }, [documentos, condicionantes, centros]);

  return (
    <main className="content">
      <PageHeader
        eyebrow={workspace?.nome ? `${workspace.nome} · Gestão Corporativa` : 'Gestão Corporativa'}
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
        <CentersCard centros={centros} onOpen={openDetail} />
        <ActivityCard
          activities={recentActivities}
          onOpen={openDetail}
          onViewAll={() => setHistoryOpen(true)}
        />
      </div>

      <ActivityHistoryDrawer
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onOpenItem={openDetail}
      />
    </main>
  );
}
