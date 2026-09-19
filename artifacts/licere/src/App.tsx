import { type FormEvent, type ReactNode, useEffect, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Link, Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import {
  ArrowDownRight, ArrowRight, ArrowUpRight, Bell, CalendarDays, Check, CheckCircle2,
  ChevronDown, ChevronRight, CircleHelp, ClipboardCheck, Download, Eye, EyeOff, FileText,
  Filter, FolderOpen, LayoutDashboard, Leaf, ListFilter, LogIn, Menu, MoreHorizontal,
  Plus, Search, ShieldCheck, SlidersHorizontal, Sparkles, X, Zap,
} from 'lucide-react';
import NotFound from '@/pages/not-found';

type Status = 'Regular' | 'A vencer' | 'Vencida' | 'Em análise' | 'Concluída' | 'Pendente' | 'Vigente' | 'Expirada';
type Centro = { id: string; nome: string; cidade: string; estado: string; responsavel: string; status: string };
type Licenca = { id: string; numero: string; tipo: string; centroId: string; orgao: string; emissao: string; vencimento: string; status: Status; criticidade: 'Alta' | 'Média' | 'Baixa'; observacao: string };
type Condicionante = { id: string; titulo: string; licencaId: string; centroId: string; responsavel: string; prazo: string; status: Status; recorrencia: string };
type Documento = { id: string; nome: string; categoria: string; centroId: string; atualizadoEm: string; validade: string; status: Status; tamanho: string };

const centros: Centro[] = [
  { id: 'cd-sp', nome: 'CD Cajamar', cidade: 'Cajamar', estado: 'SP', responsavel: 'Marina Azevedo', status: 'Operando' },
  { id: 'cd-jundiai', nome: 'CD Jundiaí', cidade: 'Jundiaí', estado: 'SP', responsavel: 'Ricardo Nunes', status: 'Operando' },
  { id: 'cd-extrema', nome: 'CD Extrema', cidade: 'Extrema', estado: 'MG', responsavel: 'Bianca Tavares', status: 'Operando' },
  { id: 'cd-joinville', nome: 'CD Joinville', cidade: 'Joinville', estado: 'SC', responsavel: 'Caio Martins', status: 'Em expansão' },
  { id: 'cd-goiania', nome: 'CD Goiânia', cidade: 'Aparecida de Goiânia', estado: 'GO', responsavel: 'Helena Freitas', status: 'Operando' },
];
const initialLicencas: Licenca[] = [
  { id: 'lic-1', numero: 'CETESB 48001234', tipo: 'Licença de Operação', centroId: 'cd-sp', orgao: 'CETESB', emissao: '2023-08-14', vencimento: '2025-08-14', status: 'A vencer', criticidade: 'Alta', observacao: 'Renovação deve ser protocolada 120 dias antes do vencimento.' },
  { id: 'lic-2', numero: 'CETESB 57009871', tipo: 'Licença de Instalação', centroId: 'cd-jundiai', orgao: 'CETESB', emissao: '2024-02-22', vencimento: '2026-02-22', status: 'Vigente', criticidade: 'Média', observacao: 'Obra de ampliação do armazém B.' },
  { id: 'lic-3', numero: 'SEMAD-MG 2024/0198', tipo: 'Licença de Operação', centroId: 'cd-extrema', orgao: 'SEMAD / MG', emissao: '2024-06-03', vencimento: '2028-06-03', status: 'Regular', criticidade: 'Baixa', observacao: 'Operação condicionada ao relatório anual de efluentes.' },
  { id: 'lic-4', numero: 'IMA-SC 1129/2021', tipo: 'Licença Ambiental de Operação', centroId: 'cd-joinville', orgao: 'IMA / SC', emissao: '2021-11-18', vencimento: '2025-11-18', status: 'A vencer', criticidade: 'Alta', observacao: 'Iniciar renovação após inspeção do sistema de drenagem.' },
  { id: 'lic-5', numero: 'SEMAD-GO 891/2023', tipo: 'Licença Prévia e de Instalação', centroId: 'cd-goiania', orgao: 'SEMAD / GO', emissao: '2023-04-10', vencimento: '2025-04-10', status: 'Vencida', criticidade: 'Alta', observacao: 'Aguardando análise de documentação complementar.' },
  { id: 'lic-6', numero: 'CETESB 44006612', tipo: 'Outorga de captação', centroId: 'cd-sp', orgao: 'DAEE / SP', emissao: '2024-09-01', vencimento: '2029-09-01', status: 'Regular', criticidade: 'Baixa', observacao: 'Captação subterrânea para uso não potável.' },
];
const initialCondicionantes: Condicionante[] = [
  { id: 'con-1', titulo: 'Enviar relatório trimestral de efluentes', licencaId: 'lic-1', centroId: 'cd-sp', responsavel: 'Marina Azevedo', prazo: '2025-03-28', status: 'Pendente', recorrencia: 'Trimestral' },
  { id: 'con-2', titulo: 'Medição de emissões atmosféricas', licencaId: 'lic-1', centroId: 'cd-sp', responsavel: 'Eduardo Lima', prazo: '2025-04-12', status: 'Em análise', recorrencia: 'Semestral' },
  { id: 'con-3', titulo: 'Atualizar PGRS do empreendimento', licencaId: 'lic-3', centroId: 'cd-extrema', responsavel: 'Bianca Tavares', prazo: '2025-05-06', status: 'Concluída', recorrencia: 'Anual' },
  { id: 'con-4', titulo: 'Apresentar inventário de resíduos', licencaId: 'lic-4', centroId: 'cd-joinville', responsavel: 'Caio Martins', prazo: '2025-03-19', status: 'Pendente', recorrencia: 'Anual' },
  { id: 'con-5', titulo: 'Laudo de ruído do entorno', licencaId: 'lic-5', centroId: 'cd-goiania', responsavel: 'Helena Freitas', prazo: '2025-03-14', status: 'Pendente', recorrencia: 'Anual' },
  { id: 'con-6', titulo: 'Renovar cadastro de transportadores', licencaId: 'lic-3', centroId: 'cd-extrema', responsavel: 'Bruno Reis', prazo: '2025-06-10', status: 'Concluída', recorrencia: 'Anual' },
];
const initialDocumentos: Documento[] = [
  { id: 'doc-1', nome: 'Licença de Operação — CD Cajamar', categoria: 'Licenças', centroId: 'cd-sp', atualizadoEm: '14 ago 2023', validade: '14 ago 2025', status: 'Vigente', tamanho: '2,4 MB' },
  { id: 'doc-2', nome: 'PGRS — CD Extrema v3', categoria: 'Planos e programas', centroId: 'cd-extrema', atualizadoEm: '06 jan 2025', validade: '06 jan 2026', status: 'Vigente', tamanho: '4,8 MB' },
  { id: 'doc-3', nome: 'Relatório de efluentes — 4º tri. 2024', categoria: 'Relatórios', centroId: 'cd-sp', atualizadoEm: '10 jan 2025', validade: '10 abr 2025', status: 'Vigente', tamanho: '1,1 MB' },
  { id: 'doc-4', nome: 'Licença Ambiental de Operação — Joinville', categoria: 'Licenças', centroId: 'cd-joinville', atualizadoEm: '18 nov 2021', validade: '18 nov 2025', status: 'Vigente', tamanho: '3,2 MB' },
  { id: 'doc-5', nome: 'Inventário de resíduos — 2024', categoria: 'Relatórios', centroId: 'cd-joinville', atualizadoEm: '03 fev 2025', validade: '19 mar 2025', status: 'A vencer', tamanho: '820 KB' },
  { id: 'doc-6', nome: 'Outorga de captação subterrânea', categoria: 'Autorizações', centroId: 'cd-sp', atualizadoEm: '01 set 2024', validade: '01 set 2029', status: 'Vigente', tamanho: '980 KB' },
  { id: 'doc-7', nome: 'Licença Prévia e de Instalação — Goiânia', categoria: 'Licenças', centroId: 'cd-goiania', atualizadoEm: '10 abr 2023', validade: '10 abr 2025', status: 'Expirada', tamanho: '2,1 MB' },
];

const queryClient = new QueryClient();
const cn = (...v: Array<string | false | null | undefined>) => v.filter(Boolean).join(' ');
const centerName = (id: string) => centros.find((c) => c.id === id)?.nome ?? 'Centro não localizado';
const formatDate = (date: string) => new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(`${date}T12:00:00`)).replace('.', '');
const useLocal = <T,>(key: string, fallback: T): [T, (value: T | ((old: T) => T)) => void] => {
  const [value, setValue] = useState<T>(() => {
    try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) as T : fallback; } catch { return fallback; }
  });
  const save = (next: T | ((old: T) => T)) => setValue((old) => {
    const resolved = typeof next === 'function' ? (next as (old: T) => T)(old) : next;
    localStorage.setItem(key, JSON.stringify(resolved));
    return resolved;
  });
  return [value, save];
};

function Mark({ className = '' }: { className?: string }) {
  return <span className={cn('licere-mark', className)} aria-hidden="true">
    <svg viewBox="0 0 32 32" role="img" focusable="false">
      <path d="M11 5.25h6.1c6.03 0 10.9 4.87 10.9 10.88S23.13 27 17.1 27 6.25 22.13 6.25 16.13c0-3.72 1.86-7.13 4.75-9.1" />
      <path d="M11 10.15v11.7h5.66a5.72 5.72 0 0 0 0-11.44H11" />
      <path d="M16.72 15.3h4.18" />
    </svg>
  </span>;
}
function StatusPill({ status }: { status: Status | string }) {
  const tone = status === 'Regular' || status === 'Vigente' || status === 'Concluída' || status === 'Operando' ? 'good' : status === 'A vencer' || status === 'Em análise' || status === 'Em expansão' ? 'warn' : 'bad';
  return <span data-testid={`status-${status}`} className={`status-pill status-${tone}`}><i />{status}</span>;
}
function IconButton({ label, onClick, children, active = false }: { label: string; onClick?: () => void; children: ReactNode; active?: boolean }) {
  return <button aria-label={label} data-testid={`button-${label.toLowerCase().replaceAll(' ', '-')}`} onClick={onClick} className={cn('icon-btn', active && 'icon-btn-active')}>{children}</button>;
}
function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [location] = useLocation();
  const nav = [
    { href: '/', label: 'Visão geral', icon: LayoutDashboard },
    { href: '/licencas', label: 'Licenças', icon: ShieldCheck, count: 6 },
    { href: '/condicionantes', label: 'Condicionantes', icon: ClipboardCheck, count: 6 },
    { href: '/documentos', label: 'Documentos', icon: FolderOpen },
  ];
  return <aside className={cn('sidebar', open && 'sidebar-open')}>
    <div className="sidebar-top"><Link href="/" className="brand" onClick={onClose}><Mark /><span>licere</span></Link><IconButton label="fechar menu" onClick={onClose}><X size={17} /></IconButton></div>
    <div className="workspace-switcher"><span className="workspace-avatar">O</span><span><b>Operações Brasil</b><small>Ambiente &amp; Compliance</small></span><ChevronDown size={15} /></div>
    <nav className="nav-list" aria-label="Navegação principal">{nav.map(({ href, label, icon: NavIcon, count }) => <Link key={href} href={href} onClick={onClose} data-testid={`link-${label.toLowerCase()}`} className={cn('nav-item', (location === href || (href !== '/' && location.startsWith(href))) && 'nav-item-active')}><NavIcon size={18} strokeWidth={1.8} /><span>{label}</span>{count && <em>{count}</em>}</Link>)}</nav>
    <div className="sidebar-note"><Sparkles size={16} /><div><b>Leitura recomendada</b><span>Você tem 3 itens que pedem atenção esta semana.</span><Link href="/licencas" onClick={onClose}>Ver prioridades <ChevronRight size={13} /></Link></div></div>
     <div className="sidebar-bottom"><Link href="/documentos" onClick={onClose} className="help-link"><CircleHelp size={17} />Central de ajuda</Link><Link href="/login" onClick={onClose} className="help-link access-link"><LogIn size={17} />Acesso de demonstração</Link><div className="profile"><span className="profile-avatar">MA</span><span><b>Marina Azevedo</b><small>Administradora</small></span><MoreHorizontal size={16} /></div></div>
  </aside>;
}
function Topbar({ onMenu, onQuickAdd }: { onMenu: () => void; onQuickAdd: () => void }) {
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState('');
  const [notificationOpen, setNotificationOpen] = useState(false);
  return <header className="topbar"><button className="mobile-menu" onClick={onMenu} aria-label="abrir menu"><Menu size={20} /></button><div className="breadcrumbs"><span>Operações Brasil</span><ChevronRight size={14} /><b>Conformidade</b></div><div className="top-actions"><label className="global-search"><Search size={16} /><input value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && setLocation(`/licencas?busca=${encodeURIComponent(search)}`)} placeholder="Buscar em tudo" aria-label="buscar em tudo" data-testid="input-global-search" /><kbd>⌘ K</kbd></label><div className="notification-wrap"><IconButton label="notificações" onClick={() => setNotificationOpen((open) => !open)} active={notificationOpen}><Bell size={18} /></IconButton>{notificationOpen && <div className="notification-popover"><b>Sem novos alertas</b><span>Seu radar de conformidade está em dia.</span></div>}</div><button className="quick-add" onClick={onQuickAdd} data-testid="button-adicionar"><Plus size={17} />Adicionar</button></div></header>;
}
function PageHeader({ eyebrow, title, description, action, actionLabel }: { eyebrow: string; title: string; description: string; action?: () => void; actionLabel?: string }) {
  return <div className="page-header animate-rise"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="page-description">{description}</p></div>{action && <button className="primary-btn" onClick={action} data-testid="button-page-action"><Plus size={17} />{actionLabel}</button>}</div>;
}
function Metric({ label, value, detail, icon: MetricIcon, tone = 'default', trend }: { label: string; value: string; detail: string; icon: typeof ShieldCheck; tone?: string; trend?: 'up' | 'down' }) {
  return <div className={cn('metric-card', `metric-${tone}`)}><div className="metric-top"><span>{label}</span><MetricIcon size={18} /></div><strong>{value}</strong><div className="metric-detail">{trend && (trend === 'down' ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />)}<span>{detail}</span></div></div>;
}
function RiskChart() {
  const values = [8, 11, 9, 16, 13, 18, 12, 22, 17, 26, 21, 14];
  const max = 30; const width = 720; const height = 250; const left = 40; const bottom = 34; const chartW = width - left - 18; const chartH = height - bottom - 18;
  const points = values.map((v, i) => `${left + (chartW / 11) * i},${18 + chartH - (v / max) * chartH}`).join(' ');
  const area = `${left},${18 + chartH} ${points} ${left + chartW},${18 + chartH}`;
  return <div className="chart-card"><div className="card-heading"><div><p className="eyebrow">Jan — Dez 2025</p><h2>Mapa de vencimentos</h2></div><button className="quiet-btn">Este ano <ChevronDown size={14} /></button></div><div className="chart-legend"><span><i className="legend-dot critical" />Alto risco</span><span><i className="legend-dot attention" />Atenção</span><span className="chart-note">18 itens monitorados</span></div><div className="chart-wrap"><svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Gráfico de vencimentos por mês"><defs><linearGradient id="areaFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#245b45" stopOpacity=".22" /><stop offset="1" stopColor="#245b45" stopOpacity="0" /></linearGradient></defs>{[0, 10, 20, 30].map((line) => <g key={line}><line x1={left} x2={width - 18} y1={18 + chartH - (line / max) * chartH} y2={18 + chartH - (line / max) * chartH} stroke="#e8e4d9" strokeDasharray="3 5" /><text x="0" y={22 + chartH - (line / max) * chartH} fill="#8b958c" fontSize="11">{line}</text></g>)}<polygon points={area} fill="url(#areaFill)" /><polyline points={points} fill="none" stroke="#245b45" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />{values.map((v, i) => <circle key={i} cx={left + (chartW / 11) * i} cy={18 + chartH - (v / max) * chartH} r={i === 9 ? 5 : 3.5} fill={i === 9 ? '#d08b3d' : '#f9f8f2'} stroke={i === 9 ? '#d08b3d' : '#245b45'} strokeWidth="2" />)}{['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'].map((m, i) => <text key={m} x={left + (chartW / 11) * i} y={height - 6} textAnchor="middle" fill="#8b958c" fontSize="11">{m}</text>)}</svg></div><div className="chart-callout"><span className="callout-dot" /><div><b>Outubro concentra o maior risco</b><small>4 licenças e 6 condicionantes vencem no período</small></div><ChevronRight size={16} /></div></div>;
}
function PriorityList({ licencas, condicionantes, onOpen }: { licencas: Licenca[]; condicionantes: Condicionante[]; onOpen: (item: Licenca | Condicionante) => void }) {
  const items = [...licencas.filter((l) => l.status === 'A vencer' || l.status === 'Vencida'), ...condicionantes.filter((c) => c.status === 'Pendente')].slice(0, 4);
  return <div className="priority-card"><div className="card-heading"><div><p className="eyebrow">Próximas ações</p><h2>O que pede atenção</h2></div><Link href="/licencas" className="text-link">Ver tudo <ChevronRight size={14} /></Link></div><div className="priority-list">{items.map((item) => { const isLicense = 'numero' in item; return <button key={item.id} onClick={() => onOpen(item)} className="priority-row" data-testid={`button-priority-${item.id}`}><span className={cn('priority-icon', item.status === 'Vencida' ? 'priority-red' : 'priority-amber')}>{isLicense ? <ShieldCheck size={16} /> : <ClipboardCheck size={16} />}</span><span className="priority-copy"><b>{isLicense ? item.tipo : item.titulo}</b><small>{isLicense ? centerName(item.centroId) : `Prazo ${formatDate(item.prazo)}`}</small></span><span className="priority-date">{isLicense ? formatDate(item.vencimento) : item.responsavel.split(' ')[0]}</span><ChevronRight size={15} className="priority-arrow" /></button> })}</div></div>;
}
function Overview({ licencas, condicionantes, openDetail }: { licencas: Licenca[]; condicionantes: Condicionante[]; openDetail: (item: Licenca | Condicionante | Documento) => void }) {
  const [notice, setNotice] = useState(true);
  return <main className="content"><PageHeader eyebrow="Quarta-feira, 12 de março de 2025" title="Bom dia, Marina." description="Aqui está o pulso de conformidade dos seus centros de distribuição." /><div className="metric-grid animate-rise" style={{ animationDelay: '.06s' }}><Metric label="Índice de conformidade" value="87,4%" detail="+2,8% vs. mês anterior" icon={ShieldCheck} tone="green" trend="up" /><Metric label="Licenças vigentes" value="4 de 6" detail="2 pedem atenção nos próximos 90 dias" icon={Leaf} tone="sand" /><Metric label="Condicionantes em aberto" value="3" detail="1 vence nesta semana" icon={ClipboardCheck} tone="peach" /><Metric label="Documentos atualizados" value="92%" detail="7 documentos no acervo" icon={FolderOpen} tone="lavender" trend="up" /></div>{notice && <div className="notice-banner animate-rise" style={{ animationDelay: '.12s' }}><div className="notice-icon"><Zap size={17} /></div><div><b>Uma semana para reduzir risco</b><span>A condicionante do CD Joinville vence em 7 dias. Atualize a evidência ou atribua um responsável.</span></div><Link href="/condicionantes">Revisar agora <ChevronRight size={15} /></Link><button onClick={() => setNotice(false)} aria-label="fechar aviso"><X size={16} /></button></div>}<div className="dashboard-grid animate-rise" style={{ animationDelay: '.18s' }}><RiskChart /><PriorityList licencas={licencas} condicionantes={condicionantes} onOpen={openDetail} /></div><div className="lower-grid animate-rise" style={{ animationDelay: '.24s' }}><div className="centers-card"><div className="card-heading"><div><p className="eyebrow">Visão operacional</p><h2>Centros acompanhados</h2></div><button className="quiet-btn" onClick={() => setNotice(true)}><SlidersHorizontal size={14} />Filtrar</button></div><div className="centers-table">{centros.map((center) => <button className="center-row" onClick={() => openDetail({ id: center.id, numero: center.nome, tipo: 'Centro de distribuição', centroId: center.id, orgao: center.responsavel, emissao: '2025-01-01', vencimento: '2026-01-01', status: center.status as Status, criticidade: 'Baixa', observacao: `${center.cidade} — ${center.estado}` })} key={center.id} data-testid={`button-center-${center.id}`}><span className="center-symbol">{center.nome.split(' ').map((w) => w[0]).join('').slice(0, 2)}</span><span><b>{center.nome}</b><small>{center.cidade} — {center.estado}</small></span><span className="center-owner">{center.responsavel}</span><StatusPill status={center.status} /><ChevronRight size={15} /></button>)}</div></div><div className="activity-card"><div className="card-heading"><div><p className="eyebrow">Rastreabilidade</p><h2>Atividade recente</h2></div><button className="icon-btn" onClick={() => setNotice(true)} aria-label="ver atividade recente"><MoreHorizontal size={18} /></button></div><div className="activity-list"><div><span className="activity-avatar avatar-olive">BL</span><p><b>Bianca Lima</b> atualizou o <strong>PGRS — CD Extrema</strong><small>Há 32 min · Documentos</small></p></div><div><span className="activity-avatar avatar-sand">RN</span><p><b>Ricardo Nunes</b> concluiu uma condicionante<small>Há 2 h · CD Jundiaí</small></p></div><div><span className="activity-avatar avatar-blue">HS</span><p><b>Helena Souza</b> adicionou uma evidência<small>Ontem · Licença SEMAD-GO</small></p></div></div></div></div></main>;
}
type FilterBarProps = { search: string; setSearch: (v: string) => void; filter: string; setFilter: (v: string) => void; options: string[]; placeholder: string; onClear: () => void };
function FilterBar({ search, setSearch, filter, setFilter, options, placeholder, onClear }: FilterBarProps) {
  return <div className="filter-bar"><label className="list-search"><Search size={16} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={placeholder} aria-label={placeholder} data-testid="input-list-search" />{search && <button onClick={() => setSearch('')} aria-label="limpar busca"><X size={14} /></button>}</label><div className="filter-actions"><label className="select-wrap"><Filter size={15} /><select value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="filtrar itens" data-testid="select-filter"><option value="Todos">Todos</option>{options.map((option) => <option key={option}>{option}</option>)}</select><ChevronDown size={14} /></label><button className="filter-btn" onClick={onClear} data-testid="button-limpar-filtros"><ListFilter size={15} />Limpar filtros</button></div></div>;
}
function ListHeader({ count, label, onAdd, addLabel }: { count: number; label: string; onAdd: () => void; addLabel: string }) {
  return <div className="list-header"><span><b>{count}</b> {label}</span><button className="secondary-btn" onClick={onAdd} data-testid="button-list-add"><Plus size={16} />{addLabel}</button></div>;
}
function LicencasPage({ items, setItems, openDetail }: { items: Licenca[]; setItems: (v: Licenca[] | ((old: Licenca[]) => Licenca[])) => void; openDetail: (item: Licenca) => void }) {
  const [search, setSearch] = useState(''); const [filter, setFilter] = useState('Todos'); const [sort, setSort] = useState<'vencimento' | 'centro'>('vencimento');
  const filtered = useMemo(() => items.filter((item) => `${item.numero} ${item.tipo} ${centerName(item.centroId)}`.toLowerCase().includes(search.toLowerCase()) && (filter === 'Todos' || item.status === filter || item.criticidade === filter)).sort((a, b) => sort === 'centro' ? centerName(a.centroId).localeCompare(centerName(b.centroId)) : a.vencimento.localeCompare(b.vencimento)), [items, search, filter, sort]);
  const add = () => { const id = `lic-${Date.now()}`; setItems((old) => [{ id, numero: 'NOVO REGISTRO', tipo: 'Licença de Operação', centroId: 'cd-sp', orgao: 'CETESB', emissao: '2025-03-12', vencimento: '2026-03-12', status: 'Em análise', criticidade: 'Média', observacao: 'Registro criado localmente. Edite os campos quando necessário.' }, ...old]); };
  return <main className="content"><PageHeader eyebrow="Base regulatória" title="Licenças" description="Todos os atos autorizativos, em uma leitura simples e rastreável." action={add} actionLabel="Nova licença" /><div className="list-card animate-rise"><FilterBar search={search} setSearch={setSearch} filter={filter} setFilter={setFilter} options={['Vigente', 'Regular', 'A vencer', 'Vencida', 'Alta', 'Média', 'Baixa']} placeholder="Buscar por número, tipo ou centro" onClear={() => { setSearch(''); setFilter('Todos'); }} /><ListHeader count={filtered.length} label="licenças encontradas" onAdd={add} addLabel="Adicionar licença" /><div className="table-scroll"><table className="data-table"><thead><tr><th>Licença <button onClick={() => setSort('vencimento')}><ChevronDown size={13} /></button></th><th>Centro de distribuição</th><th>Órgão</th><th>Vencimento</th><th>Criticidade</th><th>Status</th><th /></tr></thead><tbody>{filtered.map((item) => <tr key={item.id} onClick={() => openDetail(item)} data-testid={`row-licenca-${item.id}`}><td><b>{item.tipo}</b><small>{item.numero}</small></td><td><span className="table-center"><span className="tiny-mark" />{centerName(item.centroId)}</span></td><td>{item.orgao}</td><td><span className={cn('date-cell', item.status === 'Vencida' && 'date-danger')}>{formatDate(item.vencimento)}</span></td><td><span className={`criticality criticality-${item.criticidade.toLowerCase()}`}><i />{item.criticidade}</span></td><td><StatusPill status={item.status} /></td><td><ChevronRight size={16} className="row-chevron" /></td></tr>)}</tbody></table>{filtered.length === 0 && <EmptyState title="Nenhuma licença encontrada" description="Tente remover um filtro ou alterar os termos da busca." onClear={() => { setSearch(''); setFilter('Todos'); }} />}</div></div></main>;
}
function CondicionantesPage({ items, setItems, openDetail }: { items: Condicionante[]; setItems: (v: Condicionante[] | ((old: Condicionante[]) => Condicionante[])) => void; openDetail: (item: Condicionante) => void }) {
  const [search, setSearch] = useState(''); const [filter, setFilter] = useState('Todos'); const filtered = items.filter((i) => `${i.titulo} ${i.responsavel} ${centerName(i.centroId)}`.toLowerCase().includes(search.toLowerCase()) && (filter === 'Todos' || i.status === filter));
  const toggle = (item: Condicionante) => setItems((old) => old.map((current) => current.id === item.id ? { ...current, status: current.status === 'Concluída' ? 'Pendente' : 'Concluída' } : current));
  const add = () => setItems((old) => [{ id: `con-${Date.now()}`, titulo: 'Nova obrigação ambiental', licencaId: 'lic-1', centroId: 'cd-sp', responsavel: 'Marina Azevedo', prazo: '2025-06-30', status: 'Pendente', recorrencia: 'Anual' }, ...old]);
  return <main className="content"><PageHeader eyebrow="Rotina de conformidade" title="Condicionantes" description="Obrigações claras, responsáveis visíveis e nenhum prazo perdido." action={add} actionLabel="Nova condicionante" /><div className="list-card animate-rise"><FilterBar search={search} setSearch={setSearch} filter={filter} setFilter={setFilter} options={['Pendente', 'Em análise', 'Concluída']} placeholder="Buscar por obrigação ou responsável" onClear={() => { setSearch(''); setFilter('Todos'); }} /><ListHeader count={filtered.length} label="obrigações monitoradas" onAdd={add} addLabel="Adicionar obrigação" /><div className="condition-list">{filtered.map((item) => <div className="condition-row" key={item.id} data-testid={`row-condicionante-${item.id}`}><button className={cn('check-box', item.status === 'Concluída' && 'check-box-done')} onClick={() => toggle(item)} aria-label={`marcar ${item.titulo}`}>{item.status === 'Concluída' && <Check size={14} />}</button><button className="condition-main" onClick={() => openDetail(item)}><span><b className={item.status === 'Concluída' ? 'condition-done' : ''}>{item.titulo}</b><small>{centerName(item.centroId)} · {item.recorrencia}</small></span><span className="condition-responsible"><span className="initial-avatar">{item.responsavel.split(' ').map((p) => p[0]).join('').slice(0, 2)}</span>{item.responsavel}</span><span className={cn('condition-deadline', item.status === 'Pendente' && 'deadline-soon')}><CalendarDays size={14} />{formatDate(item.prazo)}</span><StatusPill status={item.status} /><ChevronRight size={16} /></button></div>)}</div>{filtered.length === 0 && <EmptyState title="Tudo limpo por aqui" description="Nenhuma condicionante combina com os filtros selecionados." onClear={() => { setSearch(''); setFilter('Todos'); }} />}</div></main>;
}
function DocumentosPage({ items, setItems, openDetail }: { items: Documento[]; setItems: (v: Documento[] | ((old: Documento[]) => Documento[])) => void; openDetail: (item: Documento) => void }) {
  const [search, setSearch] = useState(''); const [filter, setFilter] = useState('Todos');
  const filtered = items.filter((i) => `${i.nome} ${i.categoria} ${centerName(i.centroId)}`.toLowerCase().includes(search.toLowerCase()) && (filter === 'Todos' || i.categoria === filter || i.status === filter));
  const add = () => setItems((old) => [{ id: `doc-${Date.now()}`, nome: 'Novo documento — revisão pendente', categoria: 'Relatórios', centroId: 'cd-sp', atualizadoEm: '12 mar 2025', validade: '12 mar 2026', status: 'Em análise', tamanho: '—' }, ...old]);
  return <main className="content"><PageHeader eyebrow="Acervo de evidências" title="Documentos" description="A versão certa, no centro certo, no momento em que você precisa." action={add} actionLabel="Adicionar documento" /><div className="list-card animate-rise"><FilterBar search={search} setSearch={setSearch} filter={filter} setFilter={setFilter} options={['Licenças', 'Relatórios', 'Planos e programas', 'Autorizações', 'Vigente', 'A vencer', 'Expirada']} placeholder="Buscar por nome, categoria ou centro" onClear={() => { setSearch(''); setFilter('Todos'); }} /><ListHeader count={filtered.length} label="documentos no acervo" onAdd={add} addLabel="Adicionar documento" /><div className="document-grid">{filtered.map((item) => <button className="document-card" key={item.id} onClick={() => openDetail(item)} data-testid={`card-documento-${item.id}`}><span className="document-icon"><FileText size={20} /></span><span className="document-content"><b>{item.nome}</b><small>{item.categoria} · {centerName(item.centroId)}</small><span className="document-meta"><span>Atualizado {item.atualizadoEm}</span><span>{item.tamanho}</span></span></span><span className="document-status"><StatusPill status={item.status} /><MoreHorizontal size={17} /></span></button>)}</div>{filtered.length === 0 && <EmptyState title="Nenhum documento encontrado" description="Ajuste sua busca para encontrar outro documento do acervo." onClear={() => { setSearch(''); setFilter('Todos'); }} />}</div></main>;
}
function EmptyState({ title, description, onClear }: { title: string; description: string; onClear: () => void }) { return <div className="empty-state"><div className="empty-mark"><FolderOpen size={24} /></div><h3>{title}</h3><p>{description}</p><button className="quiet-btn" onClick={onClear}>Limpar filtros</button></div>; }
function DetailPanel({ item, onClose, onSave }: { item: Licenca | Condicionante | Documento | null; onClose: () => void; onSave: (item: Licenca | Condicionante | Documento) => void }) {
  const [draft, setDraft] = useState(item); useEffect(() => setDraft(item), [item]); if (!draft) return null;
  const isLicense = 'numero' in draft; const isCondition = 'titulo' in draft && 'recorrencia' in draft;
  const title = isLicense ? draft.tipo : isCondition ? draft.titulo : draft.nome; const subtitle = isLicense ? draft.numero : isCondition ? centerName(draft.centroId) : draft.categoria;
  return <div className="drawer-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}><section className="detail-drawer animate-fade" aria-label="detalhes"><div className="drawer-head"><div><p className="eyebrow">{isLicense ? 'Detalhes da licença' : isCondition ? 'Detalhes da obrigação' : 'Detalhes do documento'}</p><h2>{title}</h2><span>{subtitle}</span></div><IconButton label="fechar detalhes" onClick={onClose}><X size={18} /></IconButton></div><div className="drawer-content">{!isCondition && <div className="drawer-file"><span className="document-icon"><FileText size={20} /></span><span><b>{isLicense ? draft.orgao : draft.categoria}</b><small>{isLicense ? `Emissão ${formatDate(draft.emissao)}` : `Atualizado em ${draft.atualizadoEm}`}</small></span><Download size={17} /></div>}<label className="field-label">Observação <textarea value={isLicense ? draft.observacao : isCondition ? draft.titulo : draft.nome} onChange={(e) => setDraft(isLicense ? { ...draft, observacao: e.target.value } : isCondition ? { ...draft, titulo: e.target.value } : { ...draft, nome: e.target.value })} /></label><div className="drawer-facts">{isLicense && <><div><span>Vencimento</span><b>{formatDate(draft.vencimento)}</b></div><div><span>Criticidade</span><b>{draft.criticidade}</b></div></>}{isCondition && <><div><span>Responsável</span><b>{draft.responsavel}</b></div><div><span>Prazo</span><b>{formatDate(draft.prazo)}</b></div></>}{!isLicense && !isCondition && <><div><span>Validade</span><b>{draft.validade}</b></div><div><span>Tamanho</span><b>{draft.tamanho}</b></div></>}</div><div className="drawer-status"><span>Status atual</span><StatusPill status={draft.status} /></div></div><div className="drawer-foot"><button className="quiet-btn" onClick={onClose}>Cancelar</button><button className="primary-btn" onClick={() => { onSave(draft); onClose(); }}><Check size={16} />Salvar alterações</button></div></section></div>;
}
function QuickAdd({ onClose, onCreate }: { onClose: () => void; onCreate: (kind: 'licenca' | 'condicionante' | 'documento') => void }) { return <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}><section className="quick-modal animate-fade"><div className="drawer-head"><div><p className="eyebrow">Ação rápida</p><h2>O que você quer registrar?</h2><span>Comece pela informação que precisa entrar no radar.</span></div><IconButton label="fechar adicionar" onClick={onClose}><X size={18} /></IconButton></div><div className="quick-options"><button onClick={() => { onCreate('licenca'); onClose(); }} data-testid="button-quick-licenca"><span className="quick-option-icon green"><ShieldCheck size={20} /></span><span><b>Nova licença</b><small>Cadastre um ato autorizativo</small></span><ChevronRight size={16} /></button><button onClick={() => { onCreate('condicionante'); onClose(); }} data-testid="button-quick-condicionante"><span className="quick-option-icon sand"><ClipboardCheck size={20} /></span><span><b>Nova condicionante</b><small>Adicione uma obrigação para acompanhar</small></span><ChevronRight size={16} /></button><button onClick={() => { onCreate('documento'); onClose(); }} data-testid="button-quick-documento"><span className="quick-option-icon blue"><FileText size={20} /></span><span><b>Novo documento</b><small>Guarde uma evidência no acervo</small></span><ChevronRight size={16} /></button></div></section></div>; }
function Login() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [feedback, setFeedback] = useState('');

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback('Acesso demonstrativo reconhecido. Você já pode explorar o workspace.');
  };

  return <div className="login-page">
    <header className="login-header">
      <Link href="/" className="login-brand" data-testid="link-login-brand"><Mark /><span>licere</span></Link>
      <div className="login-header-help"><span>Ambiente de demonstração</span><Link href="/documentos" data-testid="link-login-help">Precisa de ajuda?</Link></div>
    </header>
    <main className="login-main">
      <section className="login-card" aria-label="Acesso à Licere">
        <div className="login-visual">
          <div className="visual-grid" />
          <div className="visual-orbit visual-orbit-one" />
          <div className="visual-orbit visual-orbit-two" />
          <div className="visual-core"><Mark /><span>Rastro claro<br />para decisões responsáveis.</span></div>
          <div className="visual-caption"><span>LICERE / OPERAÇÕES BRASIL</span><b>Conformidade que<br />se deixa ler.</b></div>
          <div className="visual-foot"><span>01</span><i /><span>MEIO AMBIENTE · EHS · COMPLIANCE</span></div>
        </div>
        <section className="login-form-panel">
          <div className="login-form-heading"><p className="eyebrow">Acesso corporativo</p><h1>Entrar na Licere</h1><p>Retome o acompanhamento dos seus centros de distribuição.</p></div>
          <form className="login-form" onSubmit={submit}>
            <label className="login-field"><span>E-mail corporativo</span><input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nome@empresa.com.br" required data-testid="input-login-email" /></label>
            <label className="login-field"><span className="login-field-label">Senha <button type="button" onClick={() => setFeedback('Para este protótipo, use qualquer senha.')} data-testid="button-login-forgot">Esqueceu a senha?</button></span><span className="password-wrap"><input type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Digite sua senha" required data-testid="input-login-password" /><button type="button" className="password-toggle" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? 'ocultar senha' : 'mostrar senha'} data-testid="button-toggle-password">{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></span></label>
            <label className="remember-check"><input type="checkbox" autoComplete="on" checked={remember} onChange={(e) => setRemember(e.target.checked)} data-testid="input-login-remember" /><span>Lembrar este acesso neste dispositivo</span></label>
            <button className="login-submit" type="submit" data-testid="button-login-submit">Entrar <ArrowRight size={17} /></button>
          </form>
          <div className="login-divider"><span>ou continue com</span></div>
          <button type="button" className="sso-button" onClick={() => setFeedback('SSO corporativo disponível como demonstração visual neste protótipo.')} data-testid="button-login-sso"><span className="sso-symbol"><i /><i /><i /><i /></span>Continuar com SSO corporativo</button>
          {feedback && <div className="login-feedback" role="status" data-testid="status-login-feedback"><CheckCircle2 size={16} /><span>{feedback}</span></div>}
          <div className="login-form-foot"><span>Sem autenticação real neste protótipo.</span><button type="button" onClick={() => setLocation('/')} data-testid="button-login-explore">Explorar sem entrar</button></div>
        </section>
      </section>
    </main>
    <footer className="login-footer"><span>© 2025 Licere</span><span>Dados locais de demonstração</span><div><button type="button" data-testid="button-login-terms">Termos de uso</button><button type="button" data-testid="button-login-privacy">Privacidade</button></div></footer>
  </div>;
}
function Shell() {
  const [menuOpen, setMenuOpen] = useState(false); const [quickAdd, setQuickAdd] = useState(false); const [detail, setDetail] = useState<Licenca | Condicionante | Documento | null>(null);
  const [licencas, setLicencas] = useLocal<Licenca[]>('licere-licencas', initialLicencas); const [condicionantes, setCondicionantes] = useLocal<Condicionante[]>('licere-condicionantes', initialCondicionantes); const [documentos, setDocumentos] = useLocal<Documento[]>('licere-documentos', initialDocumentos);
  const saveDetail = (item: Licenca | Condicionante | Documento) => { if ('numero' in item) setLicencas((old) => old.map((x) => x.id === item.id ? item : x)); else if ('recorrencia' in item) setCondicionantes((old) => old.map((x) => x.id === item.id ? item : x)); else setDocumentos((old) => old.map((x) => x.id === item.id ? item : x)); };
  const createQuick = (kind: 'licenca' | 'condicionante' | 'documento') => { const id = `${kind}-${Date.now()}`; if (kind === 'licenca') setLicencas((old) => [{ id, numero: 'NOVO REGISTRO', tipo: 'Licença de Operação', centroId: 'cd-sp', orgao: 'CETESB', emissao: '2025-03-12', vencimento: '2026-03-12', status: 'Em análise', criticidade: 'Média', observacao: 'Registro criado localmente.' }, ...old]); else if (kind === 'condicionante') setCondicionantes((old) => [{ id, titulo: 'Nova obrigação ambiental', licencaId: 'lic-1', centroId: 'cd-sp', responsavel: 'Marina Azevedo', prazo: '2025-06-30', status: 'Pendente', recorrencia: 'Anual' }, ...old]); else setDocumentos((old) => [{ id, nome: 'Novo documento — revisão pendente', categoria: 'Relatórios', centroId: 'cd-sp', atualizadoEm: '12 mar 2025', validade: '12 mar 2026', status: 'Em análise', tamanho: '—' }, ...old]); };
  return <div className="app-noise app-shell"><Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} /><div className="app-main"><Topbar onMenu={() => setMenuOpen(true)} onQuickAdd={() => setQuickAdd(true)} /><Switch><Route path="/" component={() => <Overview licencas={licencas} condicionantes={condicionantes} openDetail={setDetail} />} /><Route path="/licencas" component={() => <LicencasPage items={licencas} setItems={setLicencas} openDetail={setDetail} />} /><Route path="/condicionantes" component={() => <CondicionantesPage items={condicionantes} setItems={setCondicionantes} openDetail={setDetail} />} /><Route path="/documentos" component={() => <DocumentosPage items={documentos} setItems={setDocumentos} openDetail={setDetail} />} /><Route component={NotFound} /></Switch></div>{detail && <DetailPanel item={detail} onClose={() => setDetail(null)} onSave={saveDetail} />}{quickAdd && <QuickAdd onClose={() => setQuickAdd(false)} onCreate={createQuick} />}</div>;
}
function Router() { const [location] = useLocation(); return <ErrorBoundary resetKey={location}><Shell /></ErrorBoundary>; }
function App() { return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Switch><Route path="/login" component={Login} /><Route component={Router} /></Switch></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>; }
export default App;