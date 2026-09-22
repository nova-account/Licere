import { ArrowRight, Building2, ChevronRight, ClipboardCheck, FileCheck2, ShieldCheck } from 'lucide-react';
import { Link } from 'wouter';
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
          <a href="#como-funciona">Como funciona</a>
          <a href="#servico">Para operações</a>
          <Link href="/login" className="public-login">
            Entrar <ArrowRight size={15} />
          </Link>
        </nav>
      </header>
      <main>
        <section className="hero-public">
          <div className="hero-copy">
            <p className="eyebrow">Ambiente &amp; compliance operacional</p>
            <h1>
              Gestão ambiental com <em>eficiência.</em>
            </h1>
            <p>
              Licere conecta licenças, condicionantes e evidências em um só lugar.
              Dê às suas unidades controle total sobre prazos, status e obrigações operacionais.
            </p>
            <div className="hero-actions">
              <Link href="/dashboard" className="primary-btn">
                Entrar no workspace <ArrowRight size={16} />
              </Link>
              <Link href="/login" className="hero-secondary">
                Conhecer a demonstração <ChevronRight size={15} />
              </Link>
            </div>
            <div className="hero-proof">
              <span>
                <ShieldCheck size={15} />
                Histórico seguro
              </span>
              <span>
                <Building2 size={15} />5 unidades conectadas
              </span>
            </div>
          </div>
          <div className="hero-orbit" aria-label="Mapa visual de relações de compliance">
            <div className="orbit-ring orbit-ring-three" />
            <div className="orbit-ring orbit-ring-one" />
            <div className="orbit-ring orbit-ring-two" />
            <div className="orbit-center">
              <Mark />
              <b>licere</b>
            </div>
            <div className="orbit-node node-license">
              <ShieldCheck size={15} />
              <span>Licenças</span>
            </div>
            <div className="orbit-node node-task">
              <ClipboardCheck size={15} />
              <span>Condicionantes</span>
            </div>
            <div className="orbit-node node-doc">
              <FileCheck2 size={15} />
              <span>Documentos</span>
            </div>
          </div>
        </section>
        <section className="public-strip" id="como-funciona">
          <div>
            <span className="strip-index">01</span>
            <b>Veja a autorização</b>
            <p>Uma visão objetiva do que cada unidade pode operar.</p>
          </div>
          <div>
            <span className="strip-index">02</span>
            <b>Acompanhe a obrigação</b>
            <p>Prazos e responsáveis sem depender de planilhas.</p>
          </div>
          <div>
            <span className="strip-index">03</span>
            <b>Abra a evidência</b>
            <p>O documento certo, ligado à decisão que sustenta.</p>
          </div>
        </section>
        <section className="public-service" id="servico">
          <div>
            <p className="eyebrow">Um sistema para a rotina real</p>
            <h2>
              Menos caça ao arquivo.<br />
              <span>Mais clareza para agir.</span>
            </h2>
          </div>
          <div className="service-note">
            <p>
              Licere foi desenhada para operações brasileiras que precisam manter
              o ritmo sem perder o controle ambiental.
            </p>
            <Link href="/dashboard" className="text-link">
              Abrir visão geral <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      </main>
      <footer className="public-footer">
        <span>
          <span style={{ fontFamily: 'var(--app-font-sans)', fontSize: '13px' }}>&copy;</span> 2026 Licere
        </span>
        <nav className="footer-nav">
          <a href="#privacy" onClick={(e) => e.preventDefault()}>Privacidade</a>
          <a href="#terms" onClick={(e) => e.preventDefault()}>Termos</a>
        </nav>
      </footer>
    </div>
  );
}
