'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, Eye, EyeOff, AlertCircle, Loader2, Check } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mark } from '@/shared/ui';
import { cn } from '@/lib/utils';
import { fetchUsuariosDb, authenticateUsuario } from '@/actions/db-actions';
import { startSession } from '@/lib/session';
import { loginSchema } from '@/shared/schemas';
import type { Usuario, LoginFormData } from '@/shared/types';
import { ForgotPasswordModal } from '@/components/modals/ForgotPasswordModal';

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [showDemoUsers, setShowDemoUsers] = useState(false);

  useEffect(() => {
    fetchUsuariosDb()
      .then((list) => {
        if (list && list.length > 0) {
          setUsuarios(list);
        }
      })
      .catch(console.error);
  }, []);

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

  const handleSelectUser = (u: Usuario) => {
    setValue('email', u.email, { shouldValidate: true });
    setValue('password', 'licere123', { shouldValidate: true });

    setConnectingId(u.id);
    setErrorMessage(null);

    startSession(u.id);
    localStorage.setItem(
      'licere_auth_user',
      JSON.stringify({
        id: u.id,
        email: u.email,
        role: u.tipoAcesso,
        cargo: u.cargo,
        tipoAcesso: u.tipoAcesso,
        nome: u.nome,
        empresa: u.empresa,
        telefone: u.telefone || '',
        authenticatedAt: new Date().toISOString(),
      }),
    );

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('licere:profile_updated'));
    }

    setTimeout(() => {
      router.push('/dashboard');
    }, 350);
  };

  const onSubmit = async (data: LoginFormData) => {
    setErrorMessage(null);

    try {
      const authUser = await authenticateUsuario(data.email, data.password);
      if (authUser) {
        handleSelectUser(authUser);
        return;
      }

      setErrorMessage('Credenciais inválidas. Verifique seu e-mail e senha corporativos.');
    } catch {
      setErrorMessage('Falha ao autenticar. Verifique sua conexão e tente novamente.');
    }
  };

  const handleDemoAccess = () => {
    setShowDemoUsers((prev) => !prev);
  };

  return (
    <div className="h-[100dvh] overflow-y-auto flex flex-col pt-[26px] pb-5 px-[clamp(18px,4vw,64px)] max-[760px]:pt-5 max-[760px]:pb-[17px] max-[760px]:px-[15px] text-[#162922] bg-[#f8f9fa]">
      <header className="w-[min(1220px,100%)] mx-auto flex items-center justify-between gap-5">
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 no-underline text-[#173c2d]"
          data-testid="link-login-brand"
        >
          <Mark className="size-9 text-[#1b6848] block" />
          <span className="font-['Manrope',sans-serif] font-extrabold text-[21px] tracking-[-0.06em] text-[#173c2d]">licere</span>
        </Link>
      </header>

      <main className="grid flex-1 place-items-center py-4 max-[760px]:py-[30px]">
        <section
          className="w-[min(1040px,100%)] grid grid-cols-[1.05fr_0.95fr] max-[1100px]:grid-cols-2 max-[760px]:block overflow-hidden border border-[#102a22]/[0.08] rounded-[24px] max-[760px]:rounded-[21px] bg-white shadow-[0_1px_3px_rgba(15,23,42,0.03),0_6px_16px_-3px_rgba(15,23,42,0.04)]"
          aria-label="Acesso à Licere"
        >
          <div className="min-h-[510px] max-[1100px]:min-h-[550px] max-[760px]:min-h-[275px] relative isolate overflow-hidden p-9 max-[1100px]:p-8 max-[760px]:p-[25px] text-[#f2faf2] bg-[#0b291e]">
            <div className="visual-grid" />
            <div className="absolute z-[2] left-[42px] max-[1100px]:left-8 max-[760px]:left-[25px] bottom-[86px] max-[1100px]:bottom-[78px] max-[760px]:bottom-[51px] flex flex-col gap-[15px] max-[760px]:gap-[7px]">
              <b className="text-[#eff6f4] font-['Manrope',sans-serif] font-bold text-[clamp(28px,4vw,46px)] max-[760px]:text-[25px] leading-[0.98] tracking-[-0.035em]">
                Conformidade que<br />se deixa ler.
              </b>
            </div>
          </div>

          <section className="flex flex-col justify-center py-[58px] px-[clamp(28px,5vw,70px)] max-[760px]:pt-8 max-[760px]:pb-7 max-[760px]:px-[25px] bg-white">
            <div className="mb-[30px] max-[760px]:mb-6">
              <p className="m-0 mb-2 text-[#7d9296] font-mono text-[10px] tracking-[0.13em] uppercase">Acesso corporativo</p>
              <h1 className="m-0 text-[#162f26] font-['Manrope',sans-serif] font-extrabold text-[clamp(28px,3vw,37px)] max-[760px]:text-[29px] leading-[1.05] tracking-[-0.035em]">
                Entrar na Licere
              </h1>
              <p className="m-0 mt-3 text-[#789095] text-[13px] leading-[1.5]">
                Acesse o painel integrado das suas unidades operacionais.
              </p>
            </div>

            {errorMessage && (
              <div
                className="mt-3 mb-4 py-3 px-3.5 rounded-lg flex items-center gap-2.5 text-[13px] bg-[#fdeded] border border-[#f5c2c7] text-[#b02a37]"
                role="alert"
              >
                <AlertCircle size={18} className="shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form className="flex flex-col gap-[19px]" onSubmit={handleSubmit(onSubmit)} noValidate>
              <label className="flex flex-col gap-2 text-[#365b4c] text-[11px] font-bold tracking-[0.02em]">
                <span>E-mail corporativo</span>
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="nome@empresa.com.br"
                  {...register('email')}
                  className={cn(
                    'w-full h-[47px] box-border px-3.5 border border-[#d5e2e4] rounded-[11px] text-[#244d3b] bg-[#f4f8f8] text-[13px] placeholder:text-[#9aa9ac] transition-[border-color,background-color,box-shadow] duration-150 !outline-none focus:!outline-none focus-visible:!outline-none focus:border-[#61937d] focus:bg-[#fbfcfc] focus:shadow-[0_0_0_4px_rgba(73,142,96,0.11)]',
                    errors.email && '!border-[#b02a37] !bg-[#fffbfb] focus:!border-[#b02a37] focus:!shadow-[0_0_0_4px_rgba(176,42,55,0.12)]',
                  )}
                  data-testid="input-login-email"
                />
                {errors.email && (
                  <span className="text-[#b02a37] text-[11px] mt-1 flex items-center gap-1">
                    <AlertCircle size={12} className="shrink-0" /> {errors.email.message}
                  </span>
                )}
              </label>

              <div className="flex flex-col gap-2 text-[#365b4c] text-[11px] font-bold tracking-[0.02em]">
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="block">Senha</label>
                  <button
                    type="button"
                    className="bg-transparent border-none text-[11px] text-primary font-medium cursor-pointer p-0 underline decoration-transparent hover:decoration-primary transition-all duration-200"
                    onClick={() => setForgotOpen(true)}
                  >
                    Esqueceu a senha?
                  </button>
                </div>
                <div className="relative block w-full">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Digite sua senha"
                    {...register('password')}
                    className={cn(
                      'w-full h-[47px] box-border pl-3.5 pr-[42px] border border-[#d5e2e4] rounded-[11px] text-[#244d3b] bg-[#f4f8f8] text-[13px] placeholder:text-[#9aa9ac] transition-[border-color,background-color,box-shadow] duration-150 !outline-none focus:!outline-none focus-visible:!outline-none focus:border-[#61937d] focus:bg-[#fbfcfc] focus:shadow-[0_0_0_4px_rgba(73,142,96,0.11)]',
                      errors.password && '!border-[#b02a37] !bg-[#fffbfb] focus:!border-[#b02a37] focus:!shadow-[0_0_0_4px_rgba(176,42,55,0.12)]',
                    )}
                    data-testid="input-login-password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-3 my-auto flex items-center justify-center size-6 p-0 border-none bg-transparent text-[#71887c] hover:text-[#1a563d] focus-visible:outline-none focus-visible:text-[#1a563d] cursor-pointer transition-colors duration-150 z-10 outline-none shadow-none"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                    title={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                    data-testid="button-toggle-password"
                  >
                    {showPassword ? <Eye size={17} strokeWidth={1.75} className="shrink-0 pointer-events-none block" /> : <EyeOff size={17} strokeWidth={1.75} className="shrink-0 pointer-events-none block" />}
                  </button>
                </div>
                {errors.password && (
                  <span className="text-[#b02a37] text-[11px] mt-1 flex items-center gap-1">
                    <AlertCircle size={12} className="shrink-0" /> {errors.password.message}
                  </span>
                )}
              </div>

              <label className="flex items-center gap-[9px] text-[#71868b] text-[11px] cursor-pointer">
                <input
                  type="checkbox"
                  autoComplete="on"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="size-[15px] m-0 accent-[#1b6848] !outline-none focus:!outline-none focus-visible:!outline-none"
                  data-testid="input-login-remember"
                />
                <span>Lembrar este acesso</span>
              </label>

              <button
                className="flex items-center justify-center gap-2 h-[47px] mt-[3px] border border-[#176044] rounded-[11px] text-[#f4faf4] bg-[#176044] shadow-[0_8px_16px_rgba(30,93,65,0.15)] !text-[13px] !font-bold transition-[background-color,transform] duration-150 hover:bg-[#104c35] hover:-translate-y-[1px] disabled:opacity-75 disabled:cursor-wait disabled:transform-none cursor-pointer"
                type="submit"
                disabled={isSubmitting || !!connectingId}
                data-testid="button-login-submit"
              >
                {isSubmitting || !!connectingId ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    <span className="font-bold text-[13px]">Entrar na plataforma</span>
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </form>

            <div className="flex items-center gap-3 mt-[25px] mb-4 text-[#98a8ab] font-mono text-[9px] tracking-[0.08em] uppercase before:content-[''] before:h-px before:flex-1 before:bg-[#e0e8e9] after:content-[''] after:h-px after:flex-1 after:bg-[#e0e8e9]">
              <span>ou</span>
            </div>

            <button
              type="button"
              className="flex items-center justify-center gap-[11px] h-[45px] border border-[#d5e2e4] rounded-[11px] text-[#3f6257] bg-[#fbfcfc] !text-[12px] !font-bold transition-[background-color,border-color] duration-150 hover:border-[#9dbbc2] hover:bg-[#edf3f4] cursor-pointer"
              onClick={handleDemoAccess}
              data-testid="button-login-sso"
            >
              <span className="grid grid-cols-[repeat(2,7px)] gap-[2px] w-4">
                <i className="size-[7px] block bg-[#658ea5]" />
                <i className="size-[7px] block bg-[#7ca38e]" />
                <i className="size-[7px] block bg-[#8b8fb3]" />
                <i className="size-[7px] block bg-[#9cb5bd]" />
              </span>
              <span className="font-bold text-[12px]">Entrar com SSO corporativo</span>
            </button>

            <div className="flex justify-between gap-3 mt-[27px] text-[#93a59a] text-[10px]">
              <button
                type="button"
                onClick={handleDemoAccess}
                data-testid="button-login-explore"
                className="p-0 border-0 bg-transparent !text-[10px] text-[#236848] !font-bold cursor-pointer inline-flex items-center gap-[2.5px] hover:underline"
              >
                <span className="font-bold text-[10px] text-[#236848]">Explorar workspace de demonstração</span>
                <ArrowRight
                  size={10}
                  strokeWidth={2.2}
                  className={cn(
                    'transition-transform duration-200 ease-out text-[#236848]',
                    showDemoUsers ? 'rotate-90' : 'rotate-0',
                  )}
                />
              </button>
            </div>

            {showDemoUsers && usuarios.length > 0 && (
              <div className="mt-[14px] mx-auto w-full max-w-[408px] py-[11px] px-[10px] rounded-[10px] bg-[#f6faf7] border border-[#dce8e1] box-border">
                <p className="m-0 mb-[9px] text-[11px] text-[#4a6b5d] text-center font-semibold">
                  Selecione o responsável para testar:
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {usuarios.map((u) => {
                    const isSelected = connectingId === u.id;
                    return (
                      <button
                        key={u.id}
                        type="button"
                        disabled={!!connectingId}
                        onClick={() => handleSelectUser(u)}
                        className={cn(
                          'w-full h-[26px] box-border inline-flex items-center justify-start gap-1 px-2 rounded-lg text-[10px] whitespace-nowrap overflow-hidden transition-colors duration-150',
                          connectingId ? 'cursor-wait' : 'cursor-pointer',
                          connectingId && !isSelected && 'opacity-50',
                          isSelected
                            ? 'border border-[#1b6848] bg-[#dff0e6] text-[#143f2f]'
                            : cn(
                              'border border-[#cbdcd2] bg-white text-[#1e4838]',
                              !connectingId && 'hover:bg-[#e6f1eb] hover:border-[#1b6848]',
                            ),
                        )}
                      >
                        {isSelected ? (
                          <Check size={11} strokeWidth={2.5} className="text-[#1b6848] shrink-0" />
                        ) : (
                          <span className="size-[5px] rounded-full bg-[#1b6848] shrink-0" />
                        )}
                        <b className="truncate font-semibold text-[10px]">{u.nome}</b>
                        {u.tipoAcesso && (
                          <span className="opacity-75 text-[9px] font-normal shrink-0">
                            • {u.tipoAcesso}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </section>
        </section>
      </main>

      <footer className="flex items-center justify-between max-w-[1200px] w-full mx-auto py-6 px-5 text-[12px] text-[#799084] box-border border-t border-[#709786]/[0.25]">
        <span>
          <span className="font-sans text-[13px]">&copy;</span> 2026 Licere
        </span>
        <nav className="flex items-center gap-5">
          <a
            href="#privacy"
            onClick={(e) => e.preventDefault()}
            className="text-[#799084] no-underline font-medium text-[12px] transition-colors duration-150 hover:text-[#173c2d] hover:underline"
          >
            Privacidade
          </a>
          <a
            href="#terms"
            onClick={(e) => e.preventDefault()}
            className="text-[#799084] no-underline font-medium text-[12px] transition-colors duration-150 hover:text-[#173c2d] hover:underline"
          >
            Termos
          </a>
        </nav>
      </footer>

      <ForgotPasswordModal open={forgotOpen} onClose={() => setForgotOpen(false)} />
    </div>
  );
}
