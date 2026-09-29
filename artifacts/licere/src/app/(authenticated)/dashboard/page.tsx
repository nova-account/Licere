'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowDownRight,
  ArrowUpRight,
  ChevronRight,
  ClipboardCheck,
  FolderOpen,
  Leaf,
  MoreHorizontal,
  ShieldCheck,
  X,
  Zap,
  AlertTriangle
} from 'lucide-react';
import type { Condicionante, DetailItem, Documento, Licenca } from '@/shared/types';
import { centros } from '@/shared/data';
import { StatusPill } from '@/components/shared/status-pill';
import { PageHeader, cn, initials } from '@/shared/ui';

import { Metric } from '@/components/dashboard/Metric';
import { RiskChart } from '@/components/dashboard/RiskChart';
import { PriorityList } from '@/components/dashboard/PriorityList';

import { useAppData } from '@/lib/AppDataContext';

export default function DashboardPage() {
  const { licencas, condicionantes, documentos, setDetail: openDetail } = useAppData();

  const [notice, setNotice] = useState(true);

  return (
    <main className="content">
      <PageHeader
        eyebrow="12 mar 2025 · Operações Brasil"
        title="Bom dia, Marina."
      />

      <div className="metric-grid animate-rise">
        <Metric
          label="Índice de conformidade"
          value="87,4%"
          detail="+2,8% no mês"
          icon={ShieldCheck}
          tone="green"
          trend="up"
        />
        <Metric
          label="Licenças vigentes"
          value={`${licencas.filter((l) => l.status !== 'Vencida').length} de ${licencas.length}`}
          detail="2 pedem atenção"
          icon={Leaf}
          tone="sand"
        />
        <Metric
          label="Tarefas em aberto"
          value={`${condicionantes.filter((c) => c.status !== 'Concluída').length}`}
          detail="1 vence nesta semana"
          icon={ClipboardCheck}
          tone="peach"
        />
        <Metric
          label="Documentos atualizados"
          value="92%"
          detail={`${documentos.length} no acervo`}
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
            <b>Protocolo Preventivo Necessário</b>
            <span>Licença CETESB 48001234 (CD Cajamar) vence em 154 dias. Iniciar renovação com 120 dias de antecedência.</span>
          </div>
          <Link href="/tarefas">
            Abrir tarefa <ChevronRight size={15} />
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
              Ver unidades <ChevronRight size={14} />
            </Link>
          </div>
          <div className="centers-table">
            {centros.map((center) => (
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

