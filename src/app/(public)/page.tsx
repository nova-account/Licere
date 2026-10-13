'use client';
import React from 'react';
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  FileCheck2,
  FileText,
  Lock,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { Mark } from '@/shared/ui';
import { cn } from '@/lib/utils';

const publicBrandClass =
  'inline-flex items-center gap-[10px] font-display text-[22px] leading-none font-extrabold tracking-[-0.08em] text-foreground no-underline';
const publicBrandSpanClass = 'font-display text-[21px] font-extrabold tracking-[-0.06em] text-foreground';
const pillBaseClass =
  'inline-flex w-fit items-center gap-[6.5px] rounded-full border px-[10px] py-[3.5px] text-[11px] font-semibold leading-[1.35] whitespace-nowrap tracking-[0.015em] [&>i]:inline-block [&>i]:size-[6px] [&>i]:shrink-0 [&>i]:rounded-full [&>i]:bg-current';
const previewTableGridClass =
  'grid grid-cols-[1.5fr_1fr_1fr_1fr] max-[480px]:grid-cols-2 max-[480px]:[&>*:nth-child(n+3)]:hidden';

export default function HomePage() {
  return (
    <div className="min-h-[100dvh] overflow-hidden bg-background text-foreground">
      <header className="relative z-[2] mx-auto flex w-[min(1220px,calc(100%_-_64px))] items-center justify-between py-[28px] max-[800px]:w-[calc(100%_-_32px)] max-[800px]:py-[18px]">
        <Link href="/" className={publicBrandClass}>
          <Mark className="size-9" />
          <span className={publicBrandSpanClass}>licere</span>
        </Link>
        <nav className="flex items-center gap-[27px]">
          <a
            href="#recursos"
            className="text-[12px] text-muted-foreground no-underline transition-colors hover:text-primary max-[800px]:hidden"
          >
            Como funciona
          </a>
          <a
            href="#conformidade"
            className="text-[12px] text-muted-foreground no-underline transition-colors hover:text-primary max-[800px]:hidden"
          >
            Para operações
          </a>
          <Link
            href="/login"
            className="inline-flex items-center gap-[7px] rounded-[9px] border border-border bg-card px-[13px] py-[10px] text-[12px] font-bold text-primary no-underline transition-all hover:-translate-y-px hover:border-primary hover:bg-card/95"
          >
            Entrar <ArrowRight size={15} />
          </Link>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative mx-auto grid min-h-[720px] w-[min(1280px,calc(100%_-_64px))] grid-cols-[minmax(0,1.05fr)_minmax(440px,1.15fr)] items-center gap-[48px] pt-[64px] pb-[80px] max-[1024px]:min-h-0 max-[1024px]:grid-cols-1 max-[1024px]:gap-[40px] max-[1024px]:pt-[40px] max-[1024px]:pb-[56px] max-[768px]:w-[calc(100%_-_32px)] max-[768px]:gap-[32px] max-[768px]:pt-[28px] max-[768px]:pb-[44px] max-[480px]:pt-[20px] max-[480px]:pb-[36px]">
          <div className="relative z-[2] max-w-[600px] max-[1024px]:max-w-full">
            <h1 className="animate-rise m-0 font-display text-[clamp(42px,5.2vw,68px)] leading-[1.04] font-extrabold tracking-[-0.045em] text-foreground max-[768px]:text-[clamp(30px,8vw,44px)] max-[768px]:tracking-[-0.035em] max-[480px]:text-[clamp(26px,9vw,36px)]">
              Controle regulatório absoluto para operações que{' '}
              <em className="not-italic bg-linear-to-br from-primary to-primary/60 bg-clip-text text-transparent">
                não podem parar.
              </em>
            </h1>

            <p className="mt-[22px] mb-0 max-w-[540px] text-[16.5px] leading-[1.62] text-muted-foreground max-[768px]:mt-[14px] max-[768px]:text-[14px]">
              Centralize licenças de operação, condicionantes ambientais, prazos de renovação e evidências técnicas em
              uma plataforma auditável construída para a indústria e logística brasileira.
            </p>

            <div className="mt-[36px] flex flex-wrap items-center gap-[16px] max-[768px]:mt-[24px] max-[768px]:gap-[10px] max-[480px]:flex-col max-[480px]:items-stretch">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-[9px] rounded-[10px] bg-primary px-[26px] py-[14px] text-[14px] font-semibold text-primary-foreground no-underline shadow-[0_4px_14px_rgba(17,71,54,0.25)] transition-[transform,background,box-shadow] duration-150 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-[0_8px_24px_rgba(17,71,54,0.35)] max-[768px]:px-[18px] max-[768px]:py-[12px] max-[768px]:text-[13px] max-[480px]:justify-center"
              >
                <span>Abrir Demonstração ao Vivo</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-[6px] rounded-[10px] border border-border bg-card px-[22px] py-[13px] text-[14px] font-semibold text-primary no-underline shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-[background,border-color,transform] duration-150 hover:-translate-y-px hover:bg-muted max-[768px]:px-[18px] max-[768px]:py-[12px] max-[768px]:text-[13px] max-[480px]:justify-center"
              >
                <span>Acessar com Credenciais</span>
                <ChevronRight size={15} />
              </Link>
            </div>

            <div className="mt-[48px] flex items-center gap-[16px] text-[12px] font-medium text-muted-foreground max-[768px]:mt-[28px] max-[768px]:flex-wrap max-[768px]:gap-[10px] max-[768px]:text-[11px]">
              <div className="inline-flex items-center gap-[6px] [&_svg]:text-primary">
                <CheckCircle2 size={15} />
                <span>Gestão Automatizada de Condicionantes</span>
              </div>
              <div className="h-[14px] w-px bg-border max-[768px]:hidden" />
              <div className="inline-flex items-center gap-[6px] [&_svg]:text-primary">
                <Building2 size={15} />
                <span>Integração de Múltiplas Unidades</span>
              </div>
              <div className="h-[14px] w-px bg-border max-[768px]:hidden" />
              <div className="inline-flex items-center gap-[6px] [&_svg]:text-primary">
                <ShieldCheck size={15} />
                <span>Conformidade Regulatória Auditável</span>
              </div>
            </div>
          </div>

          {/* Interactive UI Snapshot in Hero */}
          <div className="animate-rise relative w-full">
            <div className="relative z-[2] overflow-hidden rounded-[16px] border border-border bg-card shadow-[0_20px_50px_-10px_rgba(10,36,26,0.12),0_8px_20px_-5px_rgba(10,36,26,0.06)] max-[1024px]:mx-auto max-[1024px]:max-w-[600px]">
              <div className="flex items-center justify-between border-b border-border bg-muted px-[18px] py-[12px] max-[768px]:flex-wrap max-[768px]:gap-[8px] max-[768px]:p-[10px_14px]">
                <div className="flex gap-[6px]">
                  <span className="size-[10px] rounded-full bg-destructive" />
                  <span className="size-[10px] rounded-full bg-accent" />
                  <span className="size-[10px] rounded-full bg-chart-5" />
                </div>
                <div className="inline-flex items-center gap-[6px] rounded-[6px] border border-border bg-card px-[12px] py-[3px] font-mono text-[11px] text-muted-foreground max-[768px]:hidden">
                  <Lock size={11} />
                  <span>licere.com / operacoes-brasil / dashboard</span>
                </div>
                <div className="inline-flex items-center gap-[5px] text-[11px] font-semibold text-primary">
                  <span className="size-[6px] rounded-full bg-chart-5" />
                  <span>Conectado</span>
                </div>
              </div>

              <div className="p-[20px] max-[768px]:p-[14px]">
                {/* Metric Strip */}
                <div className="mb-[18px] grid grid-cols-2 gap-[12px] max-[768px]:gap-[8px]">
                  <div className="rounded-[10px] border border-border bg-card p-[14px_16px] shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
                    <div className="flex items-center justify-between">
                      <span className="block text-[11px] font-medium text-muted-foreground">Total de unidades</span>
                      <Building2 size={16} className="text-muted-foreground" />
                    </div>
                    <strong className="mt-[6px] mb-[2px] block font-display text-[24px] font-bold text-foreground tabular-nums">7</strong>
                    <div className="mt-[2px] flex items-center gap-[4px]">
                      <small className="text-[10.5px] font-semibold text-muted-foreground">5 operando ativas</small>
                    </div>
                  </div>
                  <div className="rounded-[10px] border border-border bg-card p-[14px_16px] shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
                    <div className="flex items-center justify-between">
                      <span className="block text-[11px] font-medium text-muted-foreground">Total de pendências</span>
                      <ShieldCheck size={16} className="text-muted-foreground" />
                    </div>
                    <strong className="mt-[6px] mb-[2px] block font-display text-[24px] font-bold text-foreground tabular-nums">12</strong>
                    <div className="mt-[2px] flex items-center gap-[4px]">
                      <ArrowDownRight size={13} className="text-amber-600" />
                      <small className="text-[10.5px] font-semibold text-amber-600">4 docs · 8 tarefas</small>
                    </div>
                  </div>
                  <div className="rounded-[10px] border border-border bg-card p-[14px_16px] shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
                    <div className="flex items-center justify-between">
                      <span className="block text-[11px] font-medium text-muted-foreground">Tarefas pendentes</span>
                      <ClipboardCheck size={16} className="text-muted-foreground" />
                    </div>
                    <strong className="mt-[6px] mb-[2px] block font-display text-[24px] font-bold text-foreground tabular-nums">8</strong>
                    <div className="mt-[2px] flex items-center gap-[4px]">
                      <small className="text-[10.5px] font-semibold text-muted-foreground">Em andamento ou pendentes</small>
                    </div>
                  </div>
                  <div className="rounded-[10px] border border-border bg-card p-[14px_16px] shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
                    <div className="flex items-center justify-between">
                      <span className="block text-[11px] font-medium text-muted-foreground">Total de documentos</span>
                      <FileText size={16} className="text-muted-foreground" />
                    </div>
                    <strong className="mt-[6px] mb-[2px] block font-display text-[24px] font-bold text-foreground tabular-nums">8</strong>
                    <div className="mt-[2px] flex items-center gap-[4px]">
                      <ArrowUpRight size={13} className="text-primary" />
                      <small className="text-[10.5px] font-semibold text-primary">4 válidos no acervo</small>
                    </div>
                  </div>
                </div>

                {/* Mock Live Alert Banner */}
                <div className="mb-[18px] flex items-center gap-[12px] rounded-[10px] border border-amber-600/20 bg-amber-500/10 p-[12px_14px]">
                  <AlertTriangle size={15} className="shrink-0 text-amber-700" />
                  <div className="flex-1 text-[11.5px] leading-[1.4]">
                    <b className="mb-px block font-semibold text-amber-700">Protocolo Preventivo Necessário</b>
                    <span className="text-amber-800/80">
                      Licença CETESB 48001234 (CD Cajamar) vence em 154 dias. Iniciar renovação com 120 dias de
                      antecedência.
                    </span>
                  </div>
                  <div className="inline-flex items-center gap-[3px] text-[11px] font-bold text-amber-700">
                    Abrir tarefa <ChevronRight size={15} />
                  </div>
                </div>

                {/* Mock Live Table Preview */}
                <div className="overflow-hidden rounded-[10px] border border-border text-[11.5px]">
                  <div className={cn(previewTableGridClass, 'bg-muted px-[14px] py-[8px] font-mono text-[10.5px] font-semibold text-muted-foreground uppercase')}>
                    <span>Documento / Licença</span>
                    <span>Unidade</span>
                    <span>Validade</span>
                    <span>Status</span>
                  </div>
                  <div className={cn(previewTableGridClass, 'items-center border-t border-border px-[14px] py-[10px] text-muted-foreground')}>
                    <div className="[&>b]:block [&>b]:text-[11.5px] [&>b]:text-foreground [&>small]:block [&>small]:text-[10px] [&>small]:text-muted-foreground">
                      <b>CETESB 48001234</b>
                      <small>Licença de Operação</small>
                    </div>
                    <span>CD Cajamar</span>
                    <span className="font-mono">14/08/2025</span>
                    <span className={cn(pillBaseClass, 'border-amber-600/20 bg-amber-500/10 text-amber-700')}><i />A vencer</span>
                  </div>
                  <div className={cn(previewTableGridClass, 'items-center border-t border-border px-[14px] py-[10px] text-muted-foreground')}>
                    <div className="[&>b]:block [&>b]:text-[11.5px] [&>b]:text-foreground [&>small]:block [&>small]:text-[10px] [&>small]:text-muted-foreground">
                      <b>SEMAD 2023/00912</b>
                      <small>Licença Ambiental Simplificada</small>
                    </div>
                    <span>CD Extrema</span>
                    <span className="font-mono">22/11/2026</span>
                    <span className={cn(pillBaseClass, 'border-primary/20 bg-primary/10 text-primary')}><i />Vigente</span>
                  </div>
                  <div className={cn(previewTableGridClass, 'items-center border-t border-border px-[14px] py-[10px] text-muted-foreground')}>
                    <div className="[&>b]:block [&>b]:text-[11.5px] [&>b]:text-foreground [&>small]:block [&>small]:text-[10px] [&>small]:text-muted-foreground">
                      <b>IMA SC 99214/22</b>
                      <small>Licença de Instalação</small>
                    </div>
                    <span>CD Joinville</span>
                    <span className="font-mono">30/03/2027</span>
                    <span className={cn(pillBaseClass, 'border-primary/20 bg-primary/10 text-primary')}><i />Vigente</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Micro Highlights */}
            <div className="animate-rise absolute bottom-[30px] left-[-24px] z-[3] flex items-center gap-[10px] rounded-[12px] border border-border bg-card/95 p-[10px_14px] text-[11.5px] shadow-[0_12px_30px_rgba(10,36,26,0.1)] [&_b]:block [&_b]:text-foreground [&_small]:text-muted-foreground max-[1024px]:left-[-10px] max-[768px]:hidden">
              <CheckCircle2 size={16} className="text-primary" />
              <div>
                <b>Aprovação de Evidência</b>
                <small>Relatório de Ruído aprovado · CD Jundiaí</small>
              </div>
            </div>

            <div className="animate-rise absolute top-[40px] right-[-20px] z-[3] flex items-center gap-[10px] rounded-[12px] border border-border bg-card/95 p-[10px_14px] text-[11.5px] shadow-[0_12px_30px_rgba(10,36,26,0.1)] [&_b]:block [&_b]:text-foreground [&_small]:text-muted-foreground max-[1024px]:right-[-10px] max-[768px]:hidden">
              <Zap size={16} className="text-amber-600" />
              <div>
                <b>Alerta Preventivo Ativado</b>
                <small>Licença vence em 120 dias</small>
              </div>
            </div>
          </div>
        </section>

        {/* Quantifiable Impact Metrics */}
        <section className="border-y border-border bg-card py-[44px] max-[768px]:py-[32px]" id="impacto">
          <div className="mx-auto flex w-[min(1200px,calc(100%_-_64px))] items-center justify-between max-[768px]:flex-col max-[768px]:gap-[20px]">
            <div className="flex-1 px-[20px] text-center">
              <strong className="mb-[8px] block font-display text-[clamp(32px,3.5vw,44px)] leading-none font-extrabold tracking-[-0.04em] text-foreground tabular-nums max-[768px]:text-[clamp(28px,8vw,40px)]">0</strong>
              <p className="m-0 text-[13px] leading-[1.45] text-muted-foreground">Paralisações operacionais por atraso regulatório</p>
            </div>

            <div className="h-[48px] w-px bg-border max-[768px]:hidden" />
            <div className="flex-1 px-[20px] text-center">
              <strong className="mb-[8px] block font-display text-[clamp(32px,3.5vw,44px)] leading-none font-extrabold tracking-[-0.04em] text-foreground tabular-nums max-[768px]:text-[clamp(28px,8vw,40px)]">-75%</strong>
              <p className="m-0 text-[13px] leading-[1.45] text-muted-foreground">Tempo gasto na consolidação de relatórios de auditoria</p>
            </div>
            <div className="h-[48px] w-px bg-border max-[768px]:hidden" />
            <div className="flex-1 px-[20px] text-center">
              <strong className="mb-[8px] block font-display text-[clamp(32px,3.5vw,44px)] leading-none font-extrabold tracking-[-0.04em] text-foreground tabular-nums max-[768px]:text-[clamp(28px,8vw,40px)]">100%</strong>
              <p className="m-0 text-[13px] leading-[1.45] text-muted-foreground">Conformidade e rastreabilidade documental</p>
            </div>
          </div>
        </section>

        {/* Bento Grid Architecture */}
        <section className="mx-auto my-[90px] w-[min(1200px,calc(100%_-_64px))] max-[768px]:my-[48px] max-[768px]:w-[calc(100%_-_32px)]" id="recursos">
          <div className="mx-auto mb-[54px] max-w-[680px] text-center">
            <p className="mb-[12px] block font-mono text-[12px] font-semibold tracking-[0.06em] text-primary uppercase">Arquitetura de Gestão</p>
            <h2 className="m-0 font-display text-[clamp(30px,3.8vw,46px)] leading-[1.15] font-extrabold tracking-[-0.04em] text-foreground max-[768px]:text-[clamp(26px,7vw,36px)]">
              Engenharia de precisão para sua governança ambiental.
            </h2>
            <p className="mx-auto mt-[16px] text-[15.5px] leading-[1.6] text-muted-foreground max-[768px]:text-[14px]">
              Substitua planilhas frágeis e pastas de rede desorganizadas por um ecossistema estruturado, seguro e
              interligado.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-[24px] max-[768px]:grid-cols-1 max-[768px]:gap-[16px]">
            {/* Bento Card 1 */}
            <div className="col-span-2 rounded-[16px] border border-border bg-card p-[34px] shadow-[0_2px_10px_rgba(10,36,26,0.03)] transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-[3px] hover:border-foreground/20 hover:shadow-[0_12px_30px_rgba(10,36,26,0.07)] max-[768px]:col-span-1 max-[768px]:p-[24px_18px]">
              <div className="mb-[20px] inline-flex size-[44px] items-center justify-center rounded-[10px] bg-primary/10 text-primary">
                <Calendar size={22} />
              </div>
              <h3 className="m-0 mb-[10px] font-display text-[20px] font-bold tracking-[-0.02em] text-foreground">Prazos Preditivos &amp; Linha do Tempo</h3>
              <p className="m-0 text-[14.5px] leading-[1.6] text-muted-foreground">
                Rastreamento contínuo com contagem regressiva de 120, 90 e 30 dias. O sistema alerta os responsáveis
                antes que a renovação se torne uma emergência operacional.
              </p>
              <div className="mt-[28px] flex items-center rounded-[12px] border border-border bg-muted p-[18px_24px] max-[768px]:mt-[18px] max-[768px]:justify-between max-[768px]:overflow-x-auto max-[768px]:p-[12px_10px] max-[768px]:[scrollbar-width:none]">
                <div className="rounded-[20px] border border-primary/30 bg-primary/10 px-[14px] py-[6px] font-mono text-[11px] text-primary max-[768px]:shrink-0 max-[768px]:px-[6px] max-[768px]:py-[4px] max-[768px]:text-[8.5px] max-[768px]:whitespace-nowrap">
                  <span>Protocolo Inicial</span>
                </div>
                <div className="mx-[8px] h-[2px] flex-1 bg-primary max-[768px]:mx-[3px] max-[768px]:min-w-[6px]" />
                <div className="rounded-[20px] border border-primary bg-primary px-[14px] py-[6px] font-mono text-[11px] font-bold text-primary-foreground max-[768px]:shrink-0 max-[768px]:px-[6px] max-[768px]:py-[4px] max-[768px]:text-[8.5px] max-[768px]:whitespace-nowrap">
                  <span>Renovação 120d</span>
                </div>
                <div className="mx-[8px] h-[2px] flex-1 bg-border max-[768px]:mx-[3px] max-[768px]:min-w-[6px]" />
                <div className="rounded-[20px] border border-border bg-card px-[14px] py-[6px] font-mono text-[11px] text-muted-foreground max-[768px]:shrink-0 max-[768px]:px-[6px] max-[768px]:py-[4px] max-[768px]:text-[8.5px] max-[768px]:whitespace-nowrap">
                  <span>Vencimento</span>
                </div>
              </div>
            </div>

            {/* Bento Card 2 */}
            <div className="rounded-[16px] border border-border bg-card p-[34px] shadow-[0_2px_10px_rgba(10,36,26,0.03)] transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-[3px] hover:border-foreground/20 hover:shadow-[0_12px_30px_rgba(10,36,26,0.07)] max-[768px]:p-[24px_18px]">
              <div className="mb-[20px] inline-flex size-[44px] items-center justify-center rounded-[10px] bg-primary/10 text-primary">
                <ClipboardCheck size={22} />
              </div>
              <h3 className="m-0 mb-[10px] font-display text-[20px] font-bold tracking-[-0.02em] text-foreground">Condicionantes Vinculadas</h3>
              <p className="m-0 text-[14.5px] leading-[1.6] text-muted-foreground">
                Cada exigência legal possui dono, periodicidade e documentação comprobatória anexada em tempo real.
              </p>
            </div>

            {/* Bento Card 3 */}
            <div className="rounded-[16px] border border-border bg-card p-[34px] shadow-[0_2px_10px_rgba(10,36,26,0.03)] transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-[3px] hover:border-foreground/20 hover:shadow-[0_12px_30px_rgba(10,36,26,0.07)] max-[768px]:p-[24px_18px]">
              <div className="mb-[20px] inline-flex size-[44px] items-center justify-center rounded-[10px] bg-primary/10 text-primary">
                <Building2 size={22} />
              </div>
              <h3 className="m-0 mb-[10px] font-display text-[20px] font-bold tracking-[-0.02em] text-foreground">Multi-Unidade &amp; CDs</h3>
              <p className="m-0 text-[14.5px] leading-[1.6] text-muted-foreground">
                Alterne instantaneamente entre centros de distribuição e fábricas em múltiplos estados com uma
                governança centralizada.
              </p>
            </div>

            {/* Bento Card 4 */}
            <div className="col-span-2 rounded-[16px] border border-border bg-card p-[34px] shadow-[0_2px_10px_rgba(10,36,26,0.03)] transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-[3px] hover:border-foreground/20 hover:shadow-[0_12px_30px_rgba(10,36,26,0.07)] max-[768px]:col-span-1 max-[768px]:p-[24px_18px]">
              <div className="mb-[20px] inline-flex size-[44px] items-center justify-center rounded-[10px] bg-primary/10 text-primary">
                <FileCheck2 size={22} />
              </div>
              <h3 className="m-0 mb-[10px] font-display text-[20px] font-bold tracking-[-0.02em] text-foreground">Repositório Auditável de Evidências</h3>
              <p className="m-0 text-[14.5px] leading-[1.6] text-muted-foreground">
                Laudos de ruído, planos de gerenciamento de resíduos (PGRS), relatórios de queima e outorgas de água
                vinculados diretamente às licenças correspondentes.
              </p>
              <div className="mt-[24px] flex flex-wrap gap-[10px] max-[768px]:mt-[18px] max-[768px]:w-full max-[768px]:flex-col max-[768px]:gap-[8px]">
                <span className="inline-flex items-center gap-[6px] rounded-[8px] border border-border bg-muted px-[14px] py-[7px] text-[12px] font-medium text-primary max-[768px]:w-full max-[768px]:px-[12px] max-[768px]:py-[8px] max-[768px]:text-[11.5px] max-[768px]:break-words max-[768px]:whitespace-normal"><FileText size={13} /> Laudo de Ruído NBR 10151</span>
                <span className="inline-flex items-center gap-[6px] rounded-[8px] border border-border bg-muted px-[14px] py-[7px] text-[12px] font-medium text-primary max-[768px]:w-full max-[768px]:px-[12px] max-[768px]:py-[8px] max-[768px]:text-[11.5px] max-[768px]:break-words max-[768px]:whitespace-normal"><FileText size={13} /> Análise Físico-Química de Efluentes</span>
                <span className="inline-flex items-center gap-[6px] rounded-[8px] border border-border bg-muted px-[14px] py-[7px] text-[12px] font-medium text-primary max-[768px]:w-full max-[768px]:px-[12px] max-[768px]:py-[8px] max-[768px]:text-[11.5px] max-[768px]:break-words max-[768px]:whitespace-normal"><FileText size={13} /> Certificado de Destinação Final (CDF)</span>
              </div>
            </div>
          </div>
        </section>

        {/* Regulatory Governance Section */}
        <section className="border-y border-border bg-card py-[90px] max-[768px]:py-[56px]" id="conformidade">
          <div className="mx-auto grid w-[min(1200px,calc(100%_-_64px))] grid-cols-2 items-center gap-[64px] max-[1024px]:grid-cols-1 max-[1024px]:gap-[40px] max-[768px]:w-[calc(100%_-_32px)]">
            <div>
              <p className="mb-[12px] block font-mono text-[12px] font-semibold tracking-[0.06em] text-primary uppercase">Pronto para Fiscalização</p>
              <h2 className="m-0 mb-[20px] font-display text-[clamp(28px,3.4vw,42px)] leading-[1.15] font-extrabold tracking-[-0.035em] text-foreground">
                Auditoria sem surpresas.<br />
                <span className="text-primary">Qualquer documento em 3 cliques.</span>
              </h2>
              <p className="mb-[28px] text-[15.5px] leading-[1.62] text-muted-foreground">
                Quando a fiscalização da CETESB, IBAMA ou órgãos municipais chega à unidade, sua equipe não perde horas
                procurando pastas. Todo o histórico, comprovantes de protocolo e laudos estão indexados e exportáveis.
              </p>
              <div className="mb-[34px] flex flex-col gap-[14px]">
                <div className="flex items-center gap-[10px] text-[14.5px] font-medium text-foreground [&_svg]:shrink-0 [&_svg]:text-primary">
                  <CheckCircle2 size={16} />
                  <span>Histórico imutável de renovações e protocolos</span>
                </div>
                <div className="flex items-center gap-[10px] text-[14.5px] font-medium text-foreground [&_svg]:shrink-0 [&_svg]:text-primary">
                  <CheckCircle2 size={16} />
                  <span>Matriz de criticidade (Alta, Média e Baixa)</span>
                </div>
                <div className="flex items-center gap-[10px] text-[14.5px] font-medium text-foreground [&_svg]:shrink-0 [&_svg]:text-primary">
                  <CheckCircle2 size={16} />
                  <span>Controle de acessos com trilha de auditoria</span>
                </div>
              </div>
              <div>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-[9px] rounded-[10px] bg-primary px-[26px] py-[14px] text-[14px] font-semibold text-primary-foreground no-underline shadow-[0_4px_14px_rgba(17,71,54,0.25)] transition-[transform,background,box-shadow] duration-150 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-[0_8px_24px_rgba(17,71,54,0.35)]"
                >
                  Conhecer o Painel Geral <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            <div>
              <div className="rounded-[16px] border border-border bg-muted p-[32px] shadow-[0_16px_40px_rgba(10,36,26,0.06)]">
                <div className="flex items-center gap-[14px] border-b border-border pb-[20px]">
                  <ShieldCheck size={20} className="text-primary" />
                  <div className="[&>b]:block [&>b]:text-[15px] [&>b]:text-foreground [&>small]:text-[12px] [&>small]:text-muted-foreground">
                    <b>Certificado de Conformidade Operacional</b>
                    <small>Emitido para Operações Brasil S/A</small>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-[14px] py-[24px] max-[768px]:grid-cols-2 max-[768px]:gap-[12px]">
                  <div>
                    <span className="block text-[11px] text-muted-foreground">Unidades Ativas</span>
                    <b className="mt-[4px] block text-[16px] text-foreground">05 Centros</b>
                  </div>
                  <div>
                    <span className="block text-[11px] text-muted-foreground">Licenças Regulares</span>
                    <b className="mt-[4px] block text-[16px] text-foreground">100%</b>
                  </div>
                  <div>
                    <span className="block text-[11px] text-muted-foreground">Índice de Risco</span>
                    <b className="mt-[4px] block text-[16px] text-primary">Baixo / Controlado</b>
                  </div>
                </div>
                <div className="border-t border-border pt-[16px] font-mono text-[11px] text-muted-foreground">
                  <small>Última verificação automatizada: Hoje, às 08:00</small>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="mx-auto my-[90px] w-[min(1200px,calc(100%_-_64px))] max-[768px]:my-[56px]">
          <div className="rounded-[20px] bg-linear-to-br from-sidebar to-sidebar/80 p-[64px] text-center text-sidebar-foreground shadow-[0_24px_60px_-10px_rgba(10,36,26,0.35)] max-[768px]:p-[36px_24px]">
            <div className="mx-auto max-w-[640px]">
              <h2 className="m-0 mb-[16px] font-display text-[clamp(30px,3.6vw,44px)] leading-[1.15] font-extrabold tracking-[-0.035em] text-sidebar-foreground max-[768px]:text-[clamp(24px,6vw,34px)]">Eleve o padrão ambiental da sua operação hoje.</h2>
              <p className="mb-[32px] text-[16px] leading-[1.6] text-sidebar-foreground/70 max-[768px]:text-[14px]">
                Descubra como o Licere simplifica a rotina de conformidade e protege seu negócio de penalidades e
                interrupções.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-[16px] max-[480px]:flex-col max-[480px]:items-stretch">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-[8px] rounded-[10px] bg-card px-[26px] py-[14px] text-[14px] font-bold text-foreground no-underline shadow-[0_4px_14px_rgba(0,0,0,0.2)] transition-[transform,background] duration-150 hover:-translate-y-0.5 hover:bg-muted max-[480px]:justify-center"
                >
                  Acessar Demonstração Gratuita <ArrowRight size={16} />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center rounded-[10px] border border-primary-foreground/30 px-[24px] py-[13px] text-[14px] font-semibold text-primary-foreground no-underline transition-[background,border-color] duration-150 hover:border-primary-foreground/50 hover:bg-primary-foreground/10 max-[480px]:justify-center"
                >
                  Fazer Login
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Enterprise Footer */}
      <footer className="box-border w-full border-t border-border bg-muted px-[min(5vw,64px)] pt-[64px] pb-[36px] max-[768px]:px-[24px] max-[768px]:pt-[40px] max-[768px]:pb-[28px]">
        <div className="mx-auto mb-[54px] grid max-w-[1200px] grid-cols-[2fr_1fr_1fr_1fr] gap-[48px] max-[1024px]:grid-cols-2 max-[1024px]:gap-[36px] max-[768px]:grid-cols-1 max-[768px]:gap-[28px]">
          <div className="max-w-[320px] max-[768px]:max-w-full">
            <Link href="/" className={publicBrandClass}>
              <Mark className="size-9" />
              <span className={publicBrandSpanClass}>licere</span>
            </Link>
            <p className="mt-[16px] mb-[20px] text-[13.5px] leading-[1.55] text-muted-foreground">
              Sistema inteligente de gestão de licenças e compliance ambiental para operações e logística.
            </p>
          </div>

          <div className="flex flex-col gap-[12px] [&>a]:text-[13px] [&>a]:text-muted-foreground [&>a]:no-underline [&>a]:transition-colors [&>a]:hover:text-foreground">
            <b className="mb-[4px] text-[13px] font-bold text-foreground">Plataforma</b>
            <Link href="/dashboard">Visão Geral</Link>
            <Link href="/licencas">Licenças</Link>
            <Link href="/condicionantes">Condicionantes</Link>
            <Link href="/unidades">Unidades Operacionais</Link>
          </div>

          <div className="flex flex-col gap-[12px] [&>a]:text-[13px] [&>a]:text-muted-foreground [&>a]:no-underline [&>a]:transition-colors [&>a]:hover:text-foreground">
            <b className="mb-[4px] text-[13px] font-bold text-foreground">Recursos</b>
            <Link href="/documentos">Repositório de Evidências</Link>
            <Link href="/tarefas">Cronograma de Tarefas</Link>
            <Link href="/ajuda">Central de Ajuda</Link>
          </div>

          <div className="flex flex-col gap-[12px] [&>a]:text-[13px] [&>a]:text-muted-foreground [&>a]:no-underline [&>a]:transition-colors [&>a]:hover:text-foreground">
            <b className="mb-[4px] text-[13px] font-bold text-foreground">Legal &amp; Segurança</b>
            <a href="#privacidade" onClick={(e) => e.preventDefault()}>Privacidade e LGPD</a>
            <a href="#termos" onClick={(e) => e.preventDefault()}>Termos de Serviço</a>
            <a href="#seguranca" onClick={(e) => e.preventDefault()}>Segurança da Informação</a>
          </div>
        </div>

        <div className="mx-auto flex max-w-[1200px] items-center justify-between border-t border-border pt-[28px] text-[12px] text-muted-foreground max-[768px]:flex-col max-[768px]:items-start max-[768px]:gap-[12px]">
          <span className="tracking-[0.02em] text-muted-foreground">
            <span className="font-sans text-[13px]">&copy;</span> 2026 Licere
          </span>
          <div className="flex items-center gap-[10px] text-muted-foreground">
            <span>Enterprise</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
