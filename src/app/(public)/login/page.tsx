'use client';

import { useState } from 'react';
import { ArrowRight, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mark } from '@/shared/ui';
import { ForgotPasswordModal } from '@/components/modals/ForgotPasswordModal';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'O e-mail corporativo é obrigatório.')
    .email('Informe um e-mail corporativo válido (ex: nome@empresa.com.br).'),
  password: z
    .string()
    .min(1, 'A senha de acesso é obrigatória.')
    .min(6, 'A senha deve conter no mínimo 6 caracteres.'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setStatusMessage(null);

    // Simulação de validação de credenciais
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      let userName = 'Marina Azevedo';
      let userEmpresa = 'Operações Brasil';
      try {
        const existingProfile = localStorage.getItem('licere-profile');
        if (existingProfile) {
          const parsed = JSON.parse(existingProfile);
          if (parsed.nome) userName = parsed.nome;
          if (parsed.empresa) userEmpresa = parsed.empresa;
        } else {
          const [prefix, domain] = (data.email || '').split('@');
          if (prefix && prefix.toLowerCase() !== 'marina.azevedo') {
            userName = prefix
              .split(/[._-]/)
              .filter(Boolean)
              .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
              .join(' ');
          }
          if (domain && !domain.includes('empresa.com.br') && !domain.includes('operacoesbrasil')) {
            const domainName = domain.split('.')[0];
            if (!['gmail', 'hotmail', 'outlook', 'yahoo'].includes(domainName.toLowerCase())) {
              userEmpresa = domainName.charAt(0).toUpperCase() + domainName.slice(1);
            } else {
              userEmpresa = 'Organização';
            }
          }
        }
      } catch {}

      // Salva a sessão de autenticação exigida pelo edital
      localStorage.setItem(
        'licere_auth_user',
        JSON.stringify({
          email: data.email,
          role: 'Administrador',
          nome: userName,
          empresa: userEmpresa,
          authenticatedAt: new Date().toISOString(),
        }),
      );

      setStatusMessage({
        type: 'success',
        text: 'Acesso autenticado com sucesso! Redirecionando para o painel...',
      });

      setTimeout(() => {
        router.push('/dashboard');
      }, 700);
    } catch {
      setStatusMessage({
        type: 'error',
        text: 'Falha ao autenticar. Verifique seus dados e tente novamente.',
      });
    }
  };

  const handleDemoAccess = () => {
    setValue('email', 'marina.azevedo@empresa.com.br', { shouldValidate: true });
    setValue('password', 'licere2026', { shouldValidate: true });
    localStorage.setItem(
      'licere_auth_user',
      JSON.stringify({
        email: 'marina.azevedo@empresa.com.br',
        role: 'Administrador',
        nome: 'Marina Azevedo',
        empresa: 'Operações Brasil',
        authenticatedAt: new Date().toISOString(),
      }),
    );
    setStatusMessage({
      type: 'success',
      text: 'Acesso rápido demonstrativo autorizado. Entrando...',
    });
    setTimeout(() => {
      router.push('/dashboard');
    }, 500);
  };

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
              <p>Acesse o painel integrado das suas unidades operacionais.</p>
            </div>

            {statusMessage && (
              <div
                style={{
                  margin: '12px 0 16px',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '13px',
                  background: statusMessage.type === 'success' ? '#eef7f2' : '#fdeded',
                  border: statusMessage.type === 'success' ? '1px solid #b7dfca' : '1px solid #f5c2c7',
                  color: statusMessage.type === 'success' ? '#1c4d39' : '#b02a37',
                }}
              >
                {statusMessage.type === 'success' ? (
                  <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
                ) : (
                  <AlertCircle size={18} style={{ flexShrink: 0 }} />
                )}
                <span>{statusMessage.text}</span>
              </div>
            )}

            <form className="login-form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <label className="login-field">
                <span>E-mail corporativo</span>
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="nome@empresa.com.br"
                  {...register('email')}
                  style={{
                    borderColor: errors.email ? '#b02a37' : undefined,
                    background: errors.email ? '#fffbfb' : undefined,
                  }}
                  data-testid="input-login-email"
                />
                {errors.email && (
                  <span style={{ color: '#b02a37', fontSize: '11px', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <AlertCircle size={12} /> {errors.email.message}
                  </span>
                )}
              </label>

              <div className="login-field">
                <div className="login-field-label">
                  <label htmlFor="password" style={{ display: 'block' }}>Senha</label>
                  <button
                    type="button"
                    className="forgot-password-link"
                    onClick={() => setForgotOpen(true)}
                  >
                    Esqueceu a senha?
                  </button>
                </div>
                <span className="password-wrap">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Digite sua senha"
                    {...register('password')}
                    style={{
                      borderColor: errors.password ? '#b02a37' : undefined,
                      background: errors.password ? '#fffbfb' : undefined,
                    }}
                    data-testid="input-login-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={showPassword ? 'ocultar senha' : 'mostrar senha'}
                    data-testid="button-toggle-password"
                  >
                    {showPassword ? <Eye size={17} /> : <EyeOff size={17} />}
                  </button>
                </span>
                {errors.password && (
                  <span style={{ color: '#b02a37', fontSize: '11px', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <AlertCircle size={12} /> {errors.password.message}
                  </span>
                )}
              </div>

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
                disabled={isSubmitting}
                data-testid="button-login-submit"
                style={{ opacity: isSubmitting ? 0.7 : 1 }}
              >
                {isSubmitting ? 'Validando...' : 'Entrar na plataforma'} <ArrowRight size={17} />
              </button>
            </form>

            <div className="login-divider">
              <span>ou</span>
            </div>

            <button
              type="button"
              className="sso-button"
              onClick={handleDemoAccess}
              data-testid="button-login-sso"
            >
              <span className="sso-symbol">
                <i /><i /><i /><i />
              </span>
              Entrar com SSO corporativo
            </button>

            <div className="login-form-foot">
              <button
                type="button"
                onClick={handleDemoAccess}
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
