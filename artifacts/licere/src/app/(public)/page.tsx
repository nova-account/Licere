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

export default function HomePage() {
  return (
    <div className="public-page app-noise">
      <header className="public-header">
        <Link href="/" className="public-brand">
          <Mark />
          <span>licere</span>
        </Link>
        <nav>
          <a href="#recursos">Como funciona</a>
          <a href="#conformidade">Para operações</a>
          <Link href="/login" className="public-login">
            Entrar <ArrowRight size={15} />
          </Link>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="hero-enterprise">
          <div className="hero-content">
            <h1 className="hero-title animate-rise">
              Controle regulatório absoluto para operações que <em>não podem parar.</em>
            </h1>

            <p className="hero-description">
              Centralize licenças de operação, condicionantes ambientais, prazos de renovação e evidências técnicas em uma plataforma auditável construída para a indústria e logística brasileira.
            </p>

            <div className="hero-buttons">
              <Link href="/dashboard" className="hero-btn-primary">
                <span>Abrir Demonstração ao Vivo</span>
                <ArrowRight size={16} />
              </Link>
              <Link href="/login" className="hero-btn-secondary">
                <span>Acessar com Credenciais</span>
                <ChevronRight size={15} />
              </Link>
            </div>

            <div className="hero-trust-bar">
              <div className="trust-item">
                <CheckCircle2 size={15} />
                <span>Gestão Automatizada de Condicionantes</span>
              </div>
              <div className="trust-divider" />
              <div className="trust-item">
                <Building2 size={15} />
                <span>Integração de Múltiplas Unidades</span>
              </div>
              <div className="trust-divider" />
              <div className="trust-item">
                <ShieldCheck size={15} />
                <span>Conformidade Regulatória Auditável</span>
              </div>
            </div>
          </div>

          {/* Interactive UI Snapshot in Hero */}
          <div className="hero-ui-showcase animate-rise">
            <div className="ui-window-card">
              <div className="ui-window-header">
                <div className="ui-window-dots">
                  <span className="dot dot-red" />
                  <span className="dot dot-amber" />
                  <span className="dot dot-green" />
                </div>
                <div className="ui-window-breadcrumb">
                  <Lock size={11} />
                  <span>licere.com / operacoes-brasil / dashboard</span>
                </div>
                <div className="ui-window-status">
                  <span className="live-dot" />
                  <span>Conectado</span>
                </div>
              </div>

              <div className="ui-window-body">
                {/* Metric Strip */}
                <div className="preview-metrics">
                  <div className="preview-metric">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="preview-label">Licenças Ativas</span>
                      <ShieldCheck size={16} color="#6a8277" />
                    </div>
                    <strong className="preview-val">48</strong>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                      <ArrowUpRight size={13} className="text-good" />
                      <small className="preview-sub text-good" style={{ marginTop: 0 }}>100% conformes</small>
                    </div>
                  </div>
                  <div className="preview-metric">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="preview-label">Condicionantes</span>
                      <ClipboardCheck size={16} color="#6a8277" />
                    </div>
                    <strong className="preview-val">142</strong>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                      <ArrowDownRight size={13} className="text-amber" />
                      <small className="preview-sub text-amber" style={{ marginTop: 0 }}>3 a protocolar</small>
                    </div>
                  </div>
                  <div className="preview-metric">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="preview-label">Unidades</span>
                      <Building2 size={16} color="#6a8277" />
                    </div>
                    <strong className="preview-val">5</strong>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                      <small className="preview-sub" style={{ marginTop: 0 }}>Em operação total</small>
                    </div>
                  </div>
                  <div className="preview-metric">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="preview-label">Documentos</span>
                      <FileText size={16} color="#6a8277" />
                    </div>
                    <strong className="preview-val">1.4k</strong>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                      <small className="preview-sub" style={{ marginTop: 0 }}>Acervo digital</small>
                    </div>
                  </div>
                </div>

                {/* Mock Live Alert Banner */}
                <div className="preview-alert">
                  <AlertTriangle size={15} className="alert-icon" />
                  <div className="alert-text">
                    <b>Protocolo Preventivo Necessário</b>
                    <span>Licença CETESB 48001234 (CD Cajamar) vence em 154 dias. Iniciar renovação com 120 dias de antecedência.</span>
                  </div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', color: '#925537', fontSize: '11px', fontWeight: 700 }}>
                    Abrir tarefa <ChevronRight size={15} />
                  </div>
                </div>

                {/* Mock Live Table Preview */}
                <div className="preview-table">
                  <div className="preview-table-header">
                    <span>Documento / Licença</span>
                    <span>Unidade</span>
                    <span>Validade</span>
                    <span>Status</span>
                  </div>
                  <div className="preview-table-row">
                    <div className="row-item-main">
                      <b>CETESB 48001234</b>
                      <small>Licença de Operação</small>
                    </div>
                    <span>CD Cajamar</span>
                    <span className="font-mono">14/08/2025</span>
                    <span className="pill pill-orange"><i />A vencer</span>
                  </div>
                  <div className="preview-table-row">
                    <div className="row-item-main">
                      <b>SEMAD 2023/00912</b>
                      <small>Licença Ambiental Simplificada</small>
                    </div>
                    <span>CD Extrema</span>
                    <span className="font-mono">22/11/2026</span>
                    <span className="pill pill-good"><i />Vigente</span>
                  </div>
                  <div className="preview-table-row">
                    <div className="row-item-main">
                      <b>IMA SC 99214/22</b>
                      <small>Licença de Instalação</small>
                    </div>
                    <span>CD Joinville</span>
                    <span className="font-mono">30/03/2027</span>
                    <span className="pill pill-good"><i />Vigente</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Micro Highlights */}
            <div className="floating-card floating-card-left animate-rise">
              <CheckCircle2 size={16} className="text-good" />
              <div>
                <b>Aprovação de Evidência</b>
                <small>Relatório de Ruído aprovado · CD Jundiaí</small>
              </div>
            </div>

            <div className="floating-card floating-card-right animate-rise">
              <Zap size={16} className="text-amber" />
              <div>
                <b>Alerta Preventivo Ativado</b>
                <small>Licença vence em 120 dias</small>
              </div>
            </div>
          </div>
        </section>

        {/* Quantifiable Impact Metrics */}
        <section className="impact-section" id="impacto">
          <div className="impact-container">
            <div className="impact-item">
              <strong className="impact-number">0</strong>
              <p className="impact-label">Paralisações operacionais por atraso regulatório</p>
            </div>

            <div className="impact-divider" />
            <div className="impact-item">
              <strong className="impact-number">-75%</strong>
              <p className="impact-label">Tempo gasto na consolidação de relatórios de auditoria</p>
            </div>
            <div className="impact-divider" />
            <div className="impact-item">
              <strong className="impact-number">100%</strong>
              <p className="impact-label">Conformidade e rastreabilidade documental</p>
            </div>
          </div>
        </section>

        {/* Bento Grid Architecture */}
        <section className="bento-section" id="recursos">
          <div className="section-head text-center">
            <p className="section-eyebrow">Arquitetura de Gestão</p>
            <h2 className="section-title">
              Engenharia de precisão para sua governança ambiental.
            </h2>
            <p className="section-subtitle">
              Substitua planilhas frágeis e pastas de rede desorganizadas por um ecossistema estruturado, seguro e interligado.
            </p>
          </div>

          <div className="bento-grid">
            {/* Bento Card 1 */}
            <div className="bento-card bento-wide">
              <div className="bento-icon">
                <Calendar size={22} />
              </div>
              <h3>Prazos Preditivos &amp; Linha do Tempo</h3>
              <p>
                Rastreamento contínuo com contagem regressiva de 120, 90 e 30 dias. O sistema alerta os responsáveis antes que a renovação se torne uma emergência operacional.
              </p>
              <div className="bento-preview-graphic">
                <div className="timeline-node completed">
                  <span>Protocolo Inicial</span>
                </div>
                <div className="timeline-line active" />
                <div className="timeline-node active">
                  <span>Renovação 120d</span>
                </div>
                <div className="timeline-line" />
                <div className="timeline-node">
                  <span>Vencimento</span>
                </div>
              </div>
            </div>

            {/* Bento Card 2 */}
            <div className="bento-card">
              <div className="bento-icon">
                <ClipboardCheck size={22} />
              </div>
              <h3>Condicionantes Vinculadas</h3>
              <p>
                Cada exigência legal possui dono, periodicidade e documentação comprobatória anexada em tempo real.
              </p>
            </div>

            {/* Bento Card 3 */}
            <div className="bento-card">
              <div className="bento-icon">
                <Building2 size={22} />
              </div>
              <h3>Multi-Unidade &amp; CDs</h3>
              <p>
                Alterne instantaneamente entre centros de distribuição e fábricas em múltiplos estados com uma governança centralizada.
              </p>
            </div>

            {/* Bento Card 4 */}
            <div className="bento-card bento-wide">
              <div className="bento-icon">
                <FileCheck2 size={22} />
              </div>
              <h3>Repositório Auditável de Evidências</h3>
              <p>
                Laudos de ruído, planos de gerenciamento de resíduos (PGRS), relatórios de queima e outorgas de água vinculados diretamente às licenças correspondentes.
              </p>
              <div className="bento-pill-cluster">
                <span className="cluster-pill"><FileText size={13} /> Laudo de Ruído NBR 10151</span>
                <span className="cluster-pill"><FileText size={13} /> Análise Físico-Química de Efluentes</span>
                <span className="cluster-pill"><FileText size={13} /> Certificado de Destinação Final (CDF)</span>
              </div>
            </div>
          </div>
        </section>

        {/* Regulatory Governance Section */}
        <section className="compliance-section" id="conformidade">
          <div className="compliance-inner">
            <div className="compliance-copy">
              <p className="section-eyebrow">Pronto para Fiscalização</p>
              <h2>
                Auditoria sem surpresas.<br />
                <span>Qualquer documento em 3 cliques.</span>
              </h2>
              <p>
                Quando a fiscalização da CETESB, IBAMA ou órgãos municipais chega à unidade, sua equipe não perde horas procurando pastas. Todo o histórico, comprovantes de protocolo e laudos estão indexados e exportáveis.
              </p>
              <div className="compliance-checklist">
                <div className="check-row">
                  <CheckCircle2 size={16} />
                  <span>Histórico imutável de renovações e protocolos</span>
                </div>
                <div className="check-row">
                  <CheckCircle2 size={16} />
                  <span>Matriz de criticidade (Alta, Média e Baixa)</span>
                </div>
                <div className="check-row">
                  <CheckCircle2 size={16} />
                  <span>Controle de acessos com trilha de auditoria</span>
                </div>
              </div>
              <div className="compliance-actions">
                <Link href="/dashboard" className="hero-btn-primary">
                  Conhecer o Painel Geral <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            <div className="compliance-card-visual">
              <div className="audit-card">
                <div className="audit-header">
                  <ShieldCheck size={20} className="text-good" />
                  <div>
                    <b>Certificado de Conformidade Operacional</b>
                    <small>Emitido para Operações Brasil S/A</small>
                  </div>
                </div>
                <div className="audit-stats">
                  <div>
                    <span>Unidades Ativas</span>
                    <b>05 Centros</b>
                  </div>
                  <div>
                    <span>Licenças Regulares</span>
                    <b>100%</b>
                  </div>
                  <div>
                    <span>Índice de Risco</span>
                    <b className="text-good">Baixo / Controlado</b>
                  </div>
                </div>
                <div className="audit-footer">
                  <small>Última verificação automatizada: Hoje, às 08:00</small>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="cta-banner-section">
          <div className="cta-banner">
            <div className="cta-content">
              <h2>Eleve o padrão ambiental da sua operação hoje.</h2>
              <p>
                Descubra como o Licere simplifica a rotina de conformidade e protege seu negócio de penalidades e interrupções.
              </p>
              <div className="cta-actions">
                <Link href="/dashboard" className="cta-btn-light">
                  Acessar Demonstração Gratuita <ArrowRight size={16} />
                </Link>
                <Link href="/login" className="cta-btn-outline">
                  Fazer Login
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Enterprise Footer */}
      <footer className="public-footer-enterprise">
        <div className="footer-top">
          <div className="footer-brand-col">
            <Link href="/" className="public-brand">
              <Mark />
              <span>licere</span>
            </Link>
            <p className="footer-tagline">
              Sistema inteligente de gestão de licenças e compliance ambiental para operações e logística.
            </p>
          </div>

          <div className="footer-links-col">
            <b>Plataforma</b>
            <Link href="/dashboard">Visão Geral</Link>
            <Link href="/licencas">Licenças</Link>
            <Link href="/condicionantes">Condicionantes</Link>
            <Link href="/unidades">Unidades Operacionais</Link>
          </div>

          <div className="footer-links-col">
            <b>Recursos</b>
            <Link href="/documentos">Repositório de Evidências</Link>
            <Link href="/tarefas">Cronograma de Tarefas</Link>
            <Link href="/ajuda">Central de Ajuda</Link>
          </div>

          <div className="footer-links-col">
            <b>Legal &amp; Segurança</b>
            <a href="#privacidade" onClick={(e) => e.preventDefault()}>Privacidade e LGPD</a>
            <a href="#termos" onClick={(e) => e.preventDefault()}>Termos de Serviço</a>
            <a href="#seguranca" onClick={(e) => e.preventDefault()}>Segurança da Informação</a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            <span style={{ fontFamily: 'var(--app-font-sans)', fontSize: '13px' }}>&copy;</span> 2026 Licere
          </span>
          <div className="footer-bottom-links">
            <span>Enterprise</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

