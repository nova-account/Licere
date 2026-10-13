'use client';
import { ArrowRight, BookOpen, CircleHelp, FileCheck2, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { PageHeader } from '@/shared/ui';
import { Button } from '@/components/ui/button';

const topics = [
  { icon: ShieldCheck, title: 'Licenças', text: 'Consulte validade, criticidade, órgão responsável e histórico de cada autorização.' },
  { icon: FileCheck2, title: 'Evidências', text: 'Mantenha documentos ligados às unidades, licenças e condicionantes corretas.' },
  { icon: BookOpen, title: 'Rotina de controle', text: 'Use tarefas e condicionantes para acompanhar prazos e responsáveis.' },
];

export default function AjudaScreen() {
  return (
    <main className="mx-auto max-w-[1500px] bg-background px-[48px] pt-[52px] pb-[100px] max-[1100px]:px-[28px] max-[760px]:px-[18px] max-[760px]:pt-[24px]">
      <PageHeader eyebrow="Central de ajuda" title="Como podemos ajudar?" />
      <p className="mt-[9px] mb-0 max-w-[580px] text-[13px] text-muted-foreground max-[760px]:text-[14px]">
        Encontre o caminho mais rápido para consultar, organizar e manter sua operação ambiental em dia.
      </p>
      <div className="mt-[40px] mb-[50px] grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-[24px]">
        {topics.map(({ icon: Icon, title, text }) => (
          <section className="rounded-[12px] border border-border bg-card p-[24px] shadow-[var(--shadow-card)]" key={title}>
            <span className="mb-[16px] flex size-[40px] items-center justify-center rounded-[8px] bg-primary/10 text-primary">
              <Icon size={20} />
            </span>
            <h2 className="m-0 mb-[8px] text-[14px] font-bold text-foreground">{title}</h2>
            <p className="mb-[14px] text-[13px] leading-[1.5] text-muted-foreground">{text}</p>
            <Link
              href={title === 'Licenças' ? '/licencas' : title === 'Evidências' ? '/documentos' : '/tarefas'}
              className="inline-flex items-center gap-[4px] text-[12px] font-semibold text-primary no-underline"
            >
              Abrir seção <ArrowRight size={14} />
            </Link>
          </section>
        ))}
      </div>
      <section className="flex items-center justify-between rounded-[12px] border border-border bg-card p-[24px] max-[768px]:flex-col max-[768px]:items-stretch max-[768px]:gap-[16px]">
        <div className="flex items-center gap-[16px] text-foreground max-[768px]:flex-col max-[768px]:items-start max-[768px]:gap-[12px]">
          <CircleHelp size={20} />
          <div>
            <b className="mb-[4px] block text-[16px]">Não encontrou o que precisava?</b>
            <p className="m-0 text-[14px] text-muted-foreground">Explore o workspace ou volte para a visão geral da operação.</p>
          </div>
        </div>
        <Button asChild variant="outline" className="h-[33px] gap-[6px] rounded-[10px] px-[16px] text-[11px] font-semibold text-primary">
          <Link href="/dashboard">
            Abrir visão geral <ArrowRight size={14} />
          </Link>
        </Button>
      </section>
    </main>
  );
}
