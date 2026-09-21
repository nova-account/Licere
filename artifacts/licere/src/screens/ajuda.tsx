import { ArrowRight, BookOpen, CircleHelp, FileCheck2, ShieldCheck } from 'lucide-react';
import { Link } from 'wouter';
import { PageHeader } from '@/shared/ui';

const topics = [
  { icon: ShieldCheck, title: 'Licenças', text: 'Consulte validade, criticidade, órgão responsável e histórico de cada autorização.' },
  { icon: FileCheck2, title: 'Evidências', text: 'Mantenha documentos ligados às unidades, licenças e condicionantes corretas.' },
  { icon: BookOpen, title: 'Rotina de controle', text: 'Use tarefas e condicionantes para acompanhar prazos e responsáveis.' },
];

export default function AjudaScreen() {
  return <main className="content help-page"><PageHeader eyebrow="Central de ajuda" title="Como podemos ajudar?" /><p className="page-description">Encontre o caminho mais rápido para consultar, organizar e manter sua operação ambiental em dia.</p><div className="help-grid">{topics.map(({ icon: Icon, title, text }) => <section className="help-card" key={title}><span className="help-card-icon"><Icon size={20} /></span><h2>{title}</h2><p>{text}</p><Link href={title === 'Licenças' ? '/licencas' : title === 'Evidências' ? '/documentos' : '/tarefas'}>Abrir seção <ArrowRight size={14} /></Link></section>)}</div><section className="help-contact"><div><CircleHelp size={20} /><div><b>Não encontrou o que precisava?</b><p>Explore o workspace ou volte para a visão geral da operação.</p></div></div><Link href="/dashboard" className="secondary-btn">Abrir visão geral <ArrowRight size={14} /></Link></section></main>;
}
