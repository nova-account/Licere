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
import { cn } from '@/lib/utils';

const loginInputClass =
  'h-[47px] w-full box-border rounded-[11px] border border-input bg-muted px-[14px] text-[13px] text-foreground outline-none transition-[border-color,background,box-shadow] duration-150 placeholder:text-muted-foreground focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/10';

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
    <div className="flex min-h-[100dvh] flex-col bg-background px-[clamp(18px,4vw,64px)] pt-[26px] pb-[20px] text-foreground max-[760px]:px-[15px] max-[760px]:pt-[20px] max-[760px]:pb-[17px]">
      <header className="mx-auto flex w-[min(1220px,100%)] items-center justify-between gap-[20px]">
        <Link href="/" className="inline-flex items-center gap-[10px] text-foreground no-underline" data-testid="link-login-brand">
          <Mark className="size-9" />
          <span className="font-display text-[21px] font-extrabold tracking-[-0.06em] text-foreground">licere</span>
        </Link>
      </header>

      <main className="grid flex-1 place-items-center py-[16px] max-[760px]:py-[30px]">
        <section
          className="grid w-[min(1040px,100%)] grid-cols-[1.05fr_0.95fr] overflow-hidden rounded-[24px] border border-border bg-card shadow-[0_1px_3px_rgba(15,23,42,0.03),0_6px_16px_-3px_rgba(15,23,42,0.04)] max-[1100px]:grid-cols-2 max-[760px]:block max-[760px]:rounded-[21px]"
          aria-label="Acesso à Licere"
        >
          <div className="relative isolate min-h-[510px] overflow-hidden bg-sidebar p-[36px] text-sidebar-foreground max-[1100px]:min-h-[550px] max-[1100px]:p-[32px] max-[760px]:min-h-[275px] max-[760px]:p-[25px]">
            <div className="absolute inset-0 [background-image:linear-gradient(currentColor_1px,transparent_1px),linear-gradient(90deg,currentColor_1px,transparent_1px)] [background-size:34px_34px] text-sidebar-foreground/[0.04] [mask-image:linear-gradient(to_bottom,black,transparent_78%)]" />
            <div className="absolute bottom-[86px] left-[42px] z-[2] flex flex-col gap-[15px] max-[1100px]:bottom-[78px] max-[1100px]:left-[32px] max-[760px]:bottom-[51px] max-[760px]:left-[25px] max-[760px]:gap-[7px]">
              <b className="font-display text-[clamp(28px,4vw,46px)] leading-[0.98] font-bold tracking-[-0.075em] text-sidebar-foreground max-[760px]:text-[25px]">Conformidade que<br />se deixa ler.</b>
            </div>
          </div>

          <section className="flex flex-col justify-center bg-card px-[clamp(28px,5vw,70px)] py-[58px] max-[760px]:p-[32px_25px_28px]">
            <div className="mb-[30px] max-[760px]:mb-[24px]">
              <p className="mt-0 mb-[8px] font-mono text-[10px] tracking-[0.13em] text-muted-foreground uppercase">Acesso corporativo</p>
              <h1 className="m-0 font-display text-[clamp(28px,3vw,37px)] leading-[1.05] font-extrabold tracking-[-0.075em] text-foreground max-[760px]:text-[29px]">Entrar na Licere</h1>
              <p className="mt-[12px] mb-0 text-[13px] leading-[1.5] text-muted-foreground">Acesse o painel integrado das suas unidades operacionais.</p>
            </div>

            {statusMessage && (
              <div
                className={cn(
                  'mt-[12px] mb-[16px] flex items-center gap-[10px] rounded-[8px] border p-[12px_14px] text-[13px]',
                  statusMessage.type === 'success'
                    ? 'border-primary/30 bg-primary/5 text-primary'
                    : 'border-destructive/30 bg-destructive/5 text-destructive',
                )}
              >
                {statusMessage.type === 'success' ? (
                  <CheckCircle2 size={18} className="shrink-0" />
                ) : (
                  <AlertCircle size={18} className="shrink-0" />
                )}
                <span>{statusMessage.text}</span>
              </div>
            )}

            <form className="flex flex-col gap-[19px]" onSubmit={handleSubmit(onSubmit)} noValidate>
              <label className="flex flex-col gap-[8px] text-[11px] font-bold tracking-[0.02em] text-foreground">
                <span>E-mail corporativo</span>
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="nome@empresa.com.br"
                  {...register('email')}
                  className={cn(
                    loginInputClass,
                    errors.email && 'border-destructive bg-destructive/5',
                  )}
                  data-testid="input-login-email"
                />
                {errors.email && (
                  <span className="mt-[4px] flex items-center gap-[4px] text-[11px] text-destructive">
                    <AlertCircle size={12} /> {errors.email.message}
                  </span>
                )}
              </label>

              <div className="flex flex-col gap-[8px] text-[11px] font-bold tracking-[0.02em] text-foreground">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block">Senha</label>
                  <button
                    type="button"
                    className="cursor-pointer border-none bg-transparent p-0 text-[11px] font-medium text-primary underline decoration-transparent transition-all hover:decoration-primary"
                    onClick={() => setForgotOpen(true)}
                  >
                    Esqueceu a senha?
                  </button>
                </div>
                <span className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Digite sua senha"
                    {...register('password')}
                    className={cn(
                      loginInputClass,
                      'pr-[46px]',
                      errors.password && 'border-destructive bg-destructive/5',
                    )}
                    data-testid="input-login-password"
                  />
                  <button
                    type="button"
                    className="absolute top-1/2 right-[11px] grid size-7 -translate-y-1/2 place-items-center border-0 bg-transparent p-0 text-muted-foreground hover:text-primary"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={showPassword ? 'ocultar senha' : 'mostrar senha'}
                    data-testid="button-toggle-password"
                  >
                    {showPassword ? <Eye size={17} /> : <EyeOff size={17} />}
                  </button>
                </span>
                {errors.password && (
                  <span className="mt-[4px] flex items-center gap-[4px] text-[11px] text-destructive">
                    <AlertCircle size={12} /> {errors.password.message}
                  </span>
                )}
              </div>

              <label className="flex cursor-pointer items-center gap-[9px] text-[11px] text-muted-foreground">
                <input
                  type="checkbox"
                  className="m-0 size-[15px] accent-primary"
                  autoComplete="on"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  data-testid="input-login-remember"
                />
                <span>Lembrar este acesso</span>
              </label>

              <button
                className={cn(
                  'mt-[3px] flex h-[47px] items-center justify-center gap-[8px] rounded-[11px] border border-primary bg-primary text-[13px] font-bold text-primary-foreground shadow-[0_8px_16px_rgba(30,93,65,0.15)] transition-[background,transform] duration-150 hover:-translate-y-px hover:bg-primary/90',
                  isSubmitting && 'opacity-70',
                )}
                type="submit"
                disabled={isSubmitting}
                data-testid="button-login-submit"
              >
                {isSubmitting ? 'Validando...' : 'Entrar na plataforma'} <ArrowRight size={17} />
              </button>
            </form>

            <div className="mt-[25px] mb-[16px] flex items-center gap-[12px] font-mono text-[9px] tracking-[0.08em] text-muted-foreground uppercase before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
              <span>ou</span>
            </div>

            <button
              type="button"
              className="flex h-[45px] items-center justify-center gap-[11px] rounded-[11px] border border-input bg-card text-[12px] font-bold text-foreground transition-[background,border-color] duration-150 hover:border-primary/40 hover:bg-muted"
              onClick={handleDemoAccess}
              data-testid="button-login-sso"
            >
              <span className="grid w-[16px] grid-cols-2 gap-[2px] [&>i]:block [&>i]:size-[7px] [&>i:nth-child(1)]:bg-chart-3 [&>i:nth-child(2)]:bg-chart-5 [&>i:nth-child(3)]:bg-chart-1 [&>i:nth-child(4)]:bg-muted-foreground">
                <i /><i /><i /><i />
              </span>
              Entrar com SSO corporativo
            </button>

            <div className="mt-[27px] flex justify-between gap-[12px] text-[10px] text-muted-foreground">
              <button
                type="button"
                className="border-0 bg-transparent p-0 text-[10px] font-bold text-primary"
                onClick={handleDemoAccess}
                data-testid="button-login-explore"
              >
                Explorar workspace de demonstração →
              </button>
            </div>
          </section>
        </section>
      </main>

      <footer className="mx-auto box-border flex w-full max-w-[1200px] items-center justify-between border-t border-border p-[24px_20px] text-[12px] text-muted-foreground">
        <span>
          <span className="font-sans text-[13px]">&copy;</span> 2026 Licere
        </span>
        <nav className="flex items-center gap-[20px]">
          <a href="#privacy" onClick={(e) => e.preventDefault()} className="text-[12px] font-medium text-muted-foreground no-underline transition-colors hover:text-foreground hover:underline">Privacidade</a>
          <a href="#terms" onClick={(e) => e.preventDefault()} className="text-[12px] font-medium text-muted-foreground no-underline transition-colors hover:text-foreground hover:underline">Termos</a>
        </nav>
      </footer>

      <ForgotPasswordModal open={forgotOpen} onClose={() => setForgotOpen(false)} />
    </div>
  );
}
