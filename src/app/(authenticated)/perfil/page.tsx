'use client';

import React, { type FormEvent, useEffect, useState } from 'react';
import { Check, Settings2, ShieldCheck } from 'lucide-react';
import { PageHeader, initials } from '@/shared/ui';
import { useAppData } from '@/lib/AppDataContext';
import { Button } from '@/components/ui/button';

const fieldLabelClass = 'flex flex-col gap-[7px] text-[10px] font-bold text-muted-foreground';
const fieldInputClass =
  'box-border h-[42px] w-full rounded-[9px] border border-input bg-card px-[11px] text-[12px] font-medium text-foreground outline-none focus:border-primary/60 focus:ring-[3px] focus:ring-primary/10';

type Profile = {
  nome: string;
  email: string;
  cargo: string;
  empresa: string;
  telefone: string;
};

const defaultProfile: Profile = {
  nome: 'Marina Azevedo',
  email: 'marina.azevedo@operacoesbrasil.com.br',
  cargo: 'Administradora',
  empresa: 'Operações Brasil',
  telefone: '+55 11 98842-0176',
};

export default function PerfilPage() {
  const { setWorkspace, setUser } = useAppData();
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [draft, setDraft] = useState(profile);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('licere-profile');
      if (raw) {
        const savedProfile = JSON.parse(raw);
        setProfile(savedProfile);
        setDraft(savedProfile);
      } else {
        const auth = localStorage.getItem('licere_auth_user');
        if (auth) {
          const parsed = JSON.parse(auth);
          const initial = {
            ...defaultProfile,
            nome: parsed.nome || defaultProfile.nome,
            email: parsed.email || defaultProfile.email,
            cargo: parsed.role || defaultProfile.cargo,
            empresa: parsed.empresa || defaultProfile.empresa,
          };
          setProfile(initial);
          setDraft(initial);
        }
      }
    } catch { }
  }, []);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setDraft(profile);
  }, [profile]);

  const update = (field: keyof Profile, value: string) =>
    setDraft((old) => ({ ...old, [field]: value }));

  const save = (event: FormEvent) => {
    event.preventDefault();
    setProfile(draft);
    setUser(draft);
    setWorkspace({
      nome: draft.empresa || 'Operações Brasil',
      tipo: 'Acesso Corporativo',
    });
    try {
      localStorage.setItem('licere-profile', JSON.stringify(draft));
      const auth = localStorage.getItem('licere_auth_user');
      if (auth) {
        const parsed = JSON.parse(auth);
        parsed.nome = draft.nome;
        parsed.email = draft.email;
        parsed.cargo = draft.cargo;
        parsed.empresa = draft.empresa;
        localStorage.setItem('licere_auth_user', JSON.stringify(parsed));
      }
      window.dispatchEvent(new Event('licere:profile_updated'));
    } catch {}
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <main className="mx-auto max-w-[1500px] bg-background px-[48px] pt-[52px] pb-[84px] max-[1100px]:px-[28px] max-[760px]:px-[18px] max-[760px]:pt-[24px] max-[760px]:pb-[74px]">
      <PageHeader eyebrow="Conta e preferências" title="Perfil" />

      <div className="grid grid-cols-[minmax(220px,0.52fr)_minmax(420px,1.48fr)] items-start gap-[18px] max-[800px]:grid-cols-1">
        <section className="min-h-[320px] rounded-[16px] border border-border bg-card p-[27px] shadow-[0_1px_3px_rgba(15,23,42,0.03),0_6px_16px_-3px_rgba(15,23,42,0.04)] max-[800px]:min-h-0 max-[800px]:p-[21px]">
          <div className="grid size-[70px] place-items-center rounded-[22px] border-[5px] border-primary/15 bg-primary/20 font-mono text-[19px] font-bold text-primary">{initials(draft.nome)}</div>
          <h2 className="mt-[23px] mb-[5px] font-display text-[21px] font-bold tracking-[-0.05em] text-foreground">{draft.nome}</h2>
          <p className="m-0 text-[12px] text-muted-foreground">{draft.cargo}</p>
          <span className="mt-[19px] inline-flex items-center gap-[5px] rounded-[8px] bg-primary/10 px-[9px] py-[6px] text-[10px] font-bold text-primary">
            <ShieldCheck size={13} />
            Acesso administrador
          </span>
          <div className="mt-[48px] flex items-start gap-[9px] border-t border-border pt-[15px] text-[10px] leading-[1.5] text-muted-foreground [&_svg]:shrink-0 [&_svg]:text-muted-foreground max-[800px]:mt-[24px]">
            <Settings2 size={16} />
            <span>Preferências salvas localmente.</span>
          </div>
        </section>

        <form className="rounded-[16px] border border-border bg-card p-[27px] shadow-[0_1px_3px_rgba(15,23,42,0.03),0_6px_16px_-3px_rgba(15,23,42,0.04)] max-[800px]:p-[21px]" onSubmit={save}>
          <div className="flex items-start justify-between gap-[18px] border-b border-border pb-[20px]">
            <div>
              <p className="mt-0 mb-[8px] font-mono text-[10px] tracking-[0.13em] text-muted-foreground uppercase">Dados pessoais</p>
              <h2 className="m-0 font-display text-[18px] font-bold tracking-[-0.045em] text-foreground">Como podemos chamar você?</h2>
            </div>
            {saved && (
              <span className="inline-flex items-center gap-[5px] rounded-[7px] bg-primary/10 px-[9px] py-[6px] font-mono text-[10px] text-primary">
                <Check size={14} />
                Salvo com sucesso
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-x-[16px] gap-y-[19px] pt-[24px] pb-[28px] max-[800px]:grid-cols-1 max-[800px]:gap-[16px]">
            <label className={fieldLabelClass}>
              Nome completo
              <input className={fieldInputClass} value={draft.nome} onChange={(e) => update('nome', e.target.value)} />
            </label>
            <label className={fieldLabelClass}>
              E-mail corporativo
              <input className={fieldInputClass} type="email" value={draft.email} onChange={(e) => update('email', e.target.value)} />
            </label>
            <label className={fieldLabelClass}>
              Cargo
              <input className={fieldInputClass} value={draft.cargo} onChange={(e) => update('cargo', e.target.value)} />
            </label>
            <label className={fieldLabelClass}>
              Empresa
              <input className={fieldInputClass} value={draft.empresa} onChange={(e) => update('empresa', e.target.value)} />
            </label>
            <label className={fieldLabelClass}>
              Telefone
              <input className={fieldInputClass} value={draft.telefone} onChange={(e) => update('telefone', e.target.value)} />
            </label>
          </div>

          <div className="flex justify-end gap-[9px] border-t border-border pt-[18px]">
            <Button
              type="button"
              variant="outline"
              className="h-8 rounded-[9px] border-input px-[10px] text-xs font-semibold text-muted-foreground hover:text-primary"
              onClick={() => {
                setDraft(profile);
                setSaved(false);
              }}
            >
              Cancelar
            </Button>
            <Button type="submit" className="h-[38px] gap-[7px] rounded-[11px] px-[15px] text-xs font-semibold shadow-[0_5px_12px_rgba(32,95,67,0.12)] hover:-translate-y-0.5">
              <Check size={16} />
              Salvar alterações
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
