'use client';

import React, { type FormEvent, useEffect, useState } from 'react';
import { Check, ShieldCheck } from 'lucide-react';
import { PageHeader, initials } from '@/shared/ui';
import { useAppData } from '@/lib/AppDataContext';
import { fetchUsuariosDb, updatePerfilDb } from '@/actions/db-actions';
import { getSessionUserId, startSession } from '@/lib/session';

type Profile = {
  id?: string;
  nome: string;
  email: string;
  cargo: string;
  tipoAcesso: string;
  empresa: string;
  telefone: string;
  centroId?: string | null;
};

export default function PerfilPage() {
  const { user, setUsuarios, setWorkspace, setUser } = useAppData();

  const [profile, setProfile] = useState<Profile>(() => ({
    id: user?.id || '',
    nome: user?.nome || '',
    email: user?.email || '',
    cargo: user?.cargo || '',
    tipoAcesso: user?.tipoAcesso || '',
    empresa: user?.empresa || '',
    telefone: user?.telefone || '',
    centroId: user?.centroId ?? null,
  }));

  const [draft, setDraft] = useState<Profile>(profile);
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Sincroniza do banco SQLite na inicialização para garantir dados 100% atualizados
  useEffect(() => {
    let isMounted = true;

    async function loadFreshProfile() {
      try {
        const dbUsers = await fetchUsuariosDb();
        if (!dbUsers || dbUsers.length === 0 || !isMounted) return;

        setUsuarios(dbUsers);

        const sessionUserId = getSessionUserId();
        let current = dbUsers.find((u) => u.id === sessionUserId);

        if (!current) {
          const rawAuth = localStorage.getItem('licere_auth_user');
          if (rawAuth) {
            try {
              const parsed = JSON.parse(rawAuth);
              if (parsed?.email) {
                current = dbUsers.find((u) => u.email.toLowerCase() === parsed.email.trim().toLowerCase());
              }
            } catch { }
          }
        }

        if (!current && user?.email) {
          current = dbUsers.find((u) => u.email.toLowerCase() === user.email?.trim().toLowerCase());
        }

        if (!current && dbUsers.length > 0) {
          current = dbUsers[0];
        }

        if (current && isMounted) {
          startSession(current.id);
          const loaded: Profile = {
            id: current.id,
            nome: current.nome,
            email: current.email,
            cargo: current.cargo,
            tipoAcesso: current.tipoAcesso,
            empresa: current.empresa || '',
            telefone: current.telefone || '',
            centroId: current.centroId ?? null,
          };

          setProfile(loaded);
          setDraft(loaded);
          setUser(current);
          setWorkspace({
            nome: current.empresa || '',
            tipo: 'Acesso Corporativo',
          });
        }
      } catch (err) {
        console.error('Erro ao carregar perfil do banco:', err);
      }
    }

    loadFreshProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  // Quando o contexto global for atualizado
  useEffect(() => {
    if (user && user.nome) {
      const updated: Profile = {
        id: user.id || profile.id || '',
        nome: user.nome,
        email: user.email || '',
        cargo: user.cargo || '',
        tipoAcesso: user.tipoAcesso || '',
        empresa: user.empresa || '',
        telefone: user.telefone || '',
        centroId: user.centroId ?? null,
      };
      setProfile((prev) => ({ ...prev, ...updated }));
      setDraft((prev) => ({
        ...prev,
        ...updated,
        nome: prev.nome || updated.nome,
        email: prev.email || updated.email,
        cargo: prev.cargo || updated.cargo,
        empresa: prev.empresa || updated.empresa,
        telefone: prev.telefone || updated.telefone,
      }));
    }
  }, [user]);

  const update = (field: keyof Profile, value: string) =>
    setDraft((old) => ({ ...old, [field]: value }));

  const save = async (event: FormEvent) => {
    event.preventDefault();
    if (!draft.id) return;
    setIsSaving(true);

    try {
      const updatedUser = await updatePerfilDb(draft.id, {
        nome: draft.nome.trim(),
        email: draft.email.trim(),
        cargo: draft.cargo.trim(),
        empresa: draft.empresa.trim(),
        telefone: draft.telefone.trim() || null,
      });

      const updatedProfile: Profile = {
        id: updatedUser.id,
        nome: updatedUser.nome,
        email: updatedUser.email,
        cargo: updatedUser.cargo,
        tipoAcesso: updatedUser.tipoAcesso,
        empresa: updatedUser.empresa,
        telefone: updatedUser.telefone || '',
        centroId: updatedUser.centroId ?? null,
      };

      setProfile(updatedProfile);
      setDraft(updatedProfile);
      setUser(updatedUser);
      setWorkspace({
        nome: updatedUser.empresa,
        tipo: 'Acesso Corporativo',
      });
      setUsuarios((prev) =>
        prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
      );

      // Atualiza caches legados para consistência se existirem
      const auth = localStorage.getItem('licere_auth_user');
      if (auth) {
        try {
          const parsed = JSON.parse(auth);
          parsed.nome = updatedUser.nome;
          parsed.email = updatedUser.email;
          parsed.cargo = updatedUser.cargo;
          parsed.tipoAcesso = updatedUser.tipoAcesso;
          parsed.role = updatedUser.tipoAcesso;
          parsed.empresa = updatedUser.empresa;
          parsed.telefone = updatedUser.telefone || '';
          localStorage.setItem('licere_auth_user', JSON.stringify(parsed));
        } catch { }
      }

      window.dispatchEvent(new Event('licere:profile_updated'));

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Erro ao atualizar perfil no banco:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="content">
      <PageHeader eyebrow="Conta e preferências" title="Perfil" />

      <div className="grid grid-cols-[240px_1fr] max-[800px]:grid-cols-1 gap-[18px] items-start">
        {/* Profile Intro Card */}
        <section className="p-[20px] rounded-[16px] border border-[rgba(16,42,34,0.08)] bg-white shadow-[0_1px_3px_rgba(15,23,42,0.03),0_6px_16px_-3px_rgba(15,23,42,0.04)]">
          <div className="grid place-items-center w-[54px] h-[54px] rounded-[16px] border-[3.5px] border-[#e3efea] bg-[#c5dfcf] text-[#246747] font-bold text-[16px] font-mono">
            {initials(draft.nome || 'U')}
          </div>
          <h2 className="mt-[14px] mb-[6px] text-[#183e30] font-bold text-[18px] font-display tracking-[-0.04em]">
            {draft.nome}
          </h2>
          {draft.tipoAcesso && (
            <span className="inline-flex items-center gap-[5px] mt-[6px] py-[5px] px-[8px] rounded-[6px] bg-[#e5f1e9] text-[#317053] text-[10px] font-bold">
              <ShieldCheck size={13} />
              Acesso {draft.tipoAcesso}
            </span>
          )}
        </section>

        {/* Settings Card */}
        <form
          className="p-[27px] max-[800px]:p-[21px] rounded-[16px] border border-[rgba(16,42,34,0.08)] bg-white shadow-[0_1px_3px_rgba(15,23,42,0.03),0_6px_16px_-3px_rgba(15,23,42,0.04)]"
          onSubmit={save}
        >
          <div className="flex items-start justify-between gap-[18px] pb-[20px] border-b border-[#e2eaeb]">
            <div>
              <p className="eyebrow">Dados do responsável</p>
              <h2 className="m-0 text-[#1c4435] font-bold text-[18px] font-display tracking-[-0.045em]">
                Informações cadastrais
              </h2>
            </div>
            {saved && (
              <span className="inline-flex items-center gap-[5px] py-[6px] px-[9px] rounded-[7px] bg-[#e3f0e7] text-[#347553] text-[10px] font-mono">
                <Check size={14} />
                Salvo com sucesso
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 max-[800px]:grid-cols-1 gap-x-[16px] gap-y-[19px] py-[24px] pb-[28px]">
            <label className="flex flex-col gap-[7px] text-[#315b4a] text-[11px] font-bold tracking-[0.02em]">
              Nome completo
              <input
                value={draft.nome}
                onChange={(e) => update('nome', e.target.value)}
                required
                className="w-full h-[44px] box-border px-[14px] rounded-[11px] border border-[#d9e3e6] bg-[#fbfcfc] text-[#1b4d3b] text-[13px] font-medium outline-none transition-all placeholder:text-[#9aa9ac] focus:border-[#61937d] focus:bg-white focus:ring-3 focus:ring-[#317d56]/15"
              />
            </label>
            <label className="flex flex-col gap-[7px] text-[#315b4a] text-[11px] font-bold tracking-[0.02em]">
              E-mail corporativo
              <input
                type="email"
                value={draft.email}
                onChange={(e) => update('email', e.target.value)}
                required
                className="w-full h-[44px] box-border px-[14px] rounded-[11px] border border-[#d9e3e6] bg-[#fbfcfc] text-[#1b4d3b] text-[13px] font-medium outline-none transition-all placeholder:text-[#9aa9ac] focus:border-[#61937d] focus:bg-white focus:ring-3 focus:ring-[#317d56]/15"
              />
            </label>
            <label className="flex flex-col gap-[7px] text-[#315b4a] text-[11px] font-bold tracking-[0.02em]">
              Cargo
              <input
                value={draft.cargo}
                onChange={(e) => update('cargo', e.target.value)}
                required
                className="w-full h-[44px] box-border px-[14px] rounded-[11px] border border-[#d9e3e6] bg-[#fbfcfc] text-[#1b4d3b] text-[13px] font-medium outline-none transition-all placeholder:text-[#9aa9ac] focus:border-[#61937d] focus:bg-white focus:ring-3 focus:ring-[#317d56]/15"
              />
            </label>
            <label className="flex flex-col gap-[7px] text-[#315b4a] text-[11px] font-bold tracking-[0.02em]">
              Empresa
              <input
                value={draft.empresa}
                onChange={(e) => update('empresa', e.target.value)}
                required
                className="w-full h-[44px] box-border px-[14px] rounded-[11px] border border-[#d9e3e6] bg-[#fbfcfc] text-[#1b4d3b] text-[13px] font-medium outline-none transition-all placeholder:text-[#9aa9ac] focus:border-[#61937d] focus:bg-white focus:ring-3 focus:ring-[#317d56]/15"
              />
            </label>
            <label className="flex flex-col gap-[7px] text-[#315b4a] text-[11px] font-bold tracking-[0.02em]">
              Contato
              <input
                value={draft.telefone}
                onChange={(e) => update('telefone', e.target.value)}
                placeholder="+55 11 99999-9999"
                className="w-full h-[44px] box-border px-[14px] rounded-[11px] border border-[#d9e3e6] bg-[#fbfcfc] text-[#1b4d3b] text-[13px] font-medium outline-none transition-all placeholder:text-[#9aa9ac] focus:border-[#61937d] focus:bg-white focus:ring-3 focus:ring-[#317d56]/15"
              />
            </label>
          </div>

          <div className="flex justify-end gap-[9px] pt-[18px] border-t border-[#e2eaeb]">
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
            <button type="submit" className="primary-btn" disabled={isSaving}>
              <Check size={16} />
              {isSaving ? 'Salvando...' : 'Salvar alterações'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
