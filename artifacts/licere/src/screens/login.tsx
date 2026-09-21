import { type FormEvent, useState } from 'react';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { Mark } from '@/shared/ui';

import { ForgotPasswordModal } from '@/components/modals/ForgotPasswordModal';

export default function Login() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [forgotOpen, setForgotOpen] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setLocation('/dashboard'); };
  return (
    <div className="login-page">
      <header className="login-header">
        <Link href="/" className="login-brand" data-testid="link-login-brand">
          <Mark />
          <span>licere</span>
        </Link>
      </header>
      <main className="login-main">
        <section className="login-card" aria-label="Acesso à Licere">
          <div className="login-visual">
            <div className="visual-grid" />
            <div className="visual-caption">
              <b>Conformidade que<br />se deixa ler.</b>
            </div>
          </div>
          <section className="login-form-panel">
            <div className="login-form-heading">
              <p className="eyebrow">Acesso corporativo</p>
              <h1>Entrar na Licere</h1>
              <p>Acesse o painel das suas unidades operacionais.</p>
            </div>
            <form className="login-form" onSubmit={submit}>
              <label className="login-field">
                <span>E-mail corporativo</span>
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nome@empresa.com.br"
                  required
                  data-testid="input-login-email"
                />
              </label>
              <label className="login-field">
                <span className="login-field-label">
                  <span>Senha</span>
                  <button
                    type="button"
                    className="forgot-password-link"
                    onClick={() => setForgotOpen(true)}
                  >
                    Esqueceu a senha?
                  </button>
                </span>
                <span className="password-wrap">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite sua senha"
                    required
                    data-testid="input-login-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={showPassword ? 'ocultar senha' : 'mostrar senha'}
                    data-testid="button-toggle-password"
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </span>
              </label>
              <label className="remember-check">
                <input
                  type="checkbox"
                  autoComplete="on"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  data-testid="input-login-remember"
                />
                <span>Lembrar este acesso</span>
              </label>
              <button
                className="login-submit"
                type="submit"
                data-testid="button-login-submit"
              >
                Entrar <ArrowRight size={17} />
              </button>
            </form>
            <div className="login-divider">
              <span>ou</span>
            </div>
            <button
              type="button"
              className="sso-button"
              onClick={() => setLocation('/dashboard')}
              data-testid="button-login-sso"
            >
              <span className="sso-symbol">
                <i /><i /><i /><i />
              </span>
              Continuar com SSO corporativo
            </button>
            <div className="login-form-foot">
              <button
                type="button"
                onClick={() => setLocation('/dashboard')}
                data-testid="button-login-explore"
              >
                Explorar workspace de demonstração →
              </button>
            </div>
          </section>
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
      <ForgotPasswordModal open={forgotOpen} onClose={() => setForgotOpen(false)} />
    </div>
  );
}
