'use client';

import React, { type FormEvent, useEffect, useState } from 'react';
import { Check, Settings2, ShieldCheck } from 'lucide-react';
import { PageHeader, initials } from '@/shared/ui';
import { useAppData } from '@/lib/AppDataContext';

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
    <main className="content profile-page">
      <PageHeader eyebrow="Conta e preferências" title="Perfil" />

      <div className="profile-layout">
        <section className="profile-intro">
          <div className="profile-large-avatar">{initials(draft.nome)}</div>
          <h2>{draft.nome}</h2>
          <p>{draft.cargo}</p>
          <span className="profile-chip">
            <ShieldCheck size={13} />
            Acesso administrador
          </span>
          <div className="profile-side-note">
            <Settings2 size={16} />
            <span>Preferências salvas localmente.</span>
          </div>
        </section>

        <form className="settings-card" onSubmit={save}>
          <div className="settings-heading">
            <div>
              <p className="eyebrow">Dados pessoais</p>
              <h2>Como podemos chamar você?</h2>
            </div>
            {saved && (
              <span className="saved-note">
                <Check size={14} />
                Salvo com sucesso
              </span>
            )}
          </div>

          <div className="profile-fields">
            <label className="field-label">
              Nome completo
              <input
                value={draft.nome}
                onChange={(e) => update('nome', e.target.value)}
              />
            </label>
            <label className="field-label">
              E-mail corporativo
              <input
                type="email"
                value={draft.email}
                onChange={(e) => update('email', e.target.value)}
              />
            </label>
            <label className="field-label">
              Cargo
              <input
                value={draft.cargo}
                onChange={(e) => update('cargo', e.target.value)}
              />
            </label>
            <label className="field-label">
              Empresa
              <input
                value={draft.empresa}
                onChange={(e) => update('empresa', e.target.value)}
              />
            </label>
            <label className="field-label">
              Telefone
              <input
                value={draft.telefone}
                onChange={(e) => update('telefone', e.target.value)}
              />
            </label>
          </div>

          <div className="settings-foot">
            <button
              type="button"
              className="quiet-btn"
              onClick={() => {
                setDraft(profile);
                setSaved(false);
              }}
            >
              Cancelar
            </button>
            <button type="submit" className="primary-btn">
              <Check size={16} />
              Salvar alterações
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
