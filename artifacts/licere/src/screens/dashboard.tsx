import React, { useState } from 'react';
import { Link } from 'wouter';
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
} from 'lucide-react';
import type { Condicionante, DetailItem, Documento, Licenca } from '@/shared/types';
import { centros } from '@/shared/data';
import { StatusPill } from '@/components/ui/StatusPill';
import { PageHeader, cn, initials } from '@/shared/ui';

const centerName = (id: string) =>
  centros.find((center) => center.id === id)?.nome ?? id;

const formatDate = (value: string) => {
  if (!value) return '';
  const [y, m, d] = value.split('-');
  if (!d) return value;
  return `${d}/${m}/${y}`;
};

function Metric({
  label,
  value,
  detail,
  icon: MetricIcon,
  tone = 'default',
  trend,
}: {
  label: string;
  value: string;
  detail: string;
  icon: typeof ShieldCheck;
  tone?: string;
  trend?: 'up' | 'down';
}) {
  return (
    <div className={cn('metric-card', `metric-${tone}`)}>
      <div className="metric-top">
        <span>{label}</span>
        <MetricIcon size={18} />
      </div>
      <strong>{value}</strong>
      <div className="metric-detail">
        {trend &&
          (trend === 'down' ? (
            <ArrowDownRight size={14} />
          ) : (
            <ArrowUpRight size={14} />
          ))}
        <span>{detail}</span>
      </div>
    </div>
  );
}

function RiskChart() {
  const values = [8, 11, 9, 16, 13, 18, 12, 22, 17, 26, 21, 14];
  const max = 30;
  const width = 720;
  const height = 250;
  const left = 40;
  const bottom = 34;
  const chartW = width - left - 18;
  const chartH = height - bottom - 18;
  const points = values
    .map(
      (v, i) =>
        `${left + (chartW / 11) * i},${18 + chartH - (v / max) * chartH}`,
    )
    .join(' ');
  const area = `${left},${18 + chartH} ${points} ${left + chartW},${18 + chartH}`;

  return (
    <div className="chart-card">
      <div className="card-heading">
        <div>
          <p className="eyebrow">Jan — Dez 2025</p>
          <h2>Mapa de vencimentos</h2>
        </div>
        <span className="chart-period">2025</span>
      </div>
      <div className="chart-legend">
        <span>
          <i className="legend-dot critical" />
          Alto risco
        </span>
        <span>
          <i className="legend-dot attention" />
          Atenção
        </span>
        <span className="chart-note">18 itens monitorados</span>
      </div>
      <div className="chart-wrap">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label="Gráfico de vencimentos por mês"
        >
          <defs>
            <linearGradient id="areaFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#164e3f" stopOpacity=".22" />
              <stop offset="1" stopColor="#164e3f" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0, 10, 20, 30].map((line) => (
            <g key={line}>
              <line
                x1={left}
                x2={width - 18}
                y1={18 + chartH - (line / max) * chartH}
                y2={18 + chartH - (line / max) * chartH}
                stroke="#dce3dc"
                strokeDasharray="3 5"
              />
              <text
                x="0"
                y={22 + chartH - (line / max) * chartH}
                fill="#829088"
                fontSize="11"
              >
                {line}
              </text>
            </g>
          ))}
          <polygon points={area} fill="url(#areaFill)" />
          <polyline
            points={points}
            fill="none"
            stroke="#164e3f"
            strokeWidth="3"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {values.map((v, i) => (
            <circle
              key={i}
              cx={left + (chartW / 11) * i}
              cy={18 + chartH - (v / max) * chartH}
              r={i === 9 ? 5 : 3.5}
              fill={i === 9 ? '#d97706' : '#ffffff'}
              stroke={i === 9 ? '#d97706' : '#164e3f'}
              strokeWidth="2"
            />
          ))}
          {[
            'Jan',
            'Fev',
            'Mar',
            'Abr',
            'Mai',
            'Jun',
            'Jul',
            'Ago',
            'Set',
            'Out',
            'Nov',
            'Dez',
          ].map((m, i) => (
            <text
              key={m}
              x={left + (chartW / 11) * i}
              y={height - 6}
              textAnchor="middle"
              fill="#829088"
              fontSize="11"
            >
              {m}
            </text>
          ))}
        </svg>
      </div>
      <div className="chart-callout">
        <span className="callout-dot" />
        <div>
          <b>Outubro concentra o maior risco</b>
          <small>4 licenças e 6 condicionantes vencem no período</small>
        </div>
        <ChevronRight size={16} />
      </div>
    </div>
  );
}

function PriorityList({
  licencas,
  condicionantes,
  onOpen,
}: {
  licencas: Licenca[];
  condicionantes: Condicionante[];
  onOpen: (item: DetailItem) => void;
}) {
  const items = [
    ...licencas.filter(
      (l) => l.status === 'A vencer' || l.status === 'Vencida',
    ),
    ...condicionantes.filter((c) => c.status === 'Pendente'),
  ].slice(0, 4);

  return (
    <div className="priority-card">
      <div className="card-heading">
        <div>
          <p className="eyebrow">Próximas ações</p>
          <h2>O que pede atenção</h2>
        </div>
        <Link href="/licencas" className="text-link">
          Ver tudo <ChevronRight size={14} />
        </Link>
      </div>
      <div className="priority-list">
        {items.map((item) => {
          const isLicense = 'numero' in item;
          return (
            <button
              key={item.id}
              onClick={() => onOpen(item)}
              className="priority-row"
              data-testid={`button-priority-${item.id}`}
            >
              <span
                className={cn(
                  'priority-icon',
                  item.status === 'Vencida' ? 'priority-red' : 'priority-amber',
                )}
              >
                {isLicense ? (
                  <ShieldCheck size={16} />
                ) : (
                  <ClipboardCheck size={16} />
                )}
              </span>
              <span className="priority-copy">
                <b>{isLicense ? item.tipo : item.titulo}</b>
                <small>
                  {isLicense
                    ? centerName(item.centroId)
                    : `Prazo ${formatDate(item.prazo)}`}
                </small>
              </span>
              <span className="priority-date">
                {isLicense
                  ? formatDate(item.vencimento)
                  : item.responsavel.split(' ')[0]}
              </span>
              <ChevronRight size={15} className="priority-arrow" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function DashboardScreen({
  licencas,
  condicionantes,
  documentos,
  openDetail,
}: {
  licencas: Licenca[];
  condicionantes: Condicionante[];
  documentos: Documento[];
  openDetail: (item: DetailItem) => void;
}) {
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
            <Zap size={17} />
          </div>
          <div>
            <b>Prazo próximo</b>
            <span>Uma tarefa do CD Joinville vence em 7 dias.</span>
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
