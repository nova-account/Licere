'use client';

import React, { ReactNode } from 'react';
import { create } from 'zustand';
import type { Centro, Condicionante, DetailItem, Documento, Licenca, Usuario } from '@/shared/types';
import { isLicenca, isCondicionante, isDocumento } from '@/shared/types';
import { getDocumentStatus } from '@/shared/utils';
import { fetchInitialData, saveCentroDb, saveLicencaDb, saveCondicionanteDb, saveDocumentoDb, deleteCentroDb } from '@/actions/db-actions';
import { getSessionUserId, startSession } from '@/lib/session';

export interface WorkspaceInfo {
  nome: string;
  tipo: string;
}

export type UserInfo = Usuario;

interface DeleteResult {
  success: boolean;
  reason?: string;
}

interface AppState {
  centros: Centro[];
  setCentros: (updater: Centro[] | ((prev: Centro[]) => Centro[])) => void;
  licencas: Licenca[];
  setLicencas: (updater: Licenca[] | ((prev: Licenca[]) => Licenca[])) => void;
  condicionantes: Condicionante[];
  setCondicionantes: (updater: Condicionante[] | ((prev: Condicionante[]) => Condicionante[])) => void;
  documentos: Documento[];
  setDocumentos: (updater: Documento[] | ((prev: Documento[]) => Documento[])) => void;
  usuarios: Usuario[];
  setUsuarios: (updater: Usuario[] | ((prev: Usuario[]) => Usuario[])) => void;
  detail: DetailItem | null;
  setDetail: (updater: DetailItem | null | ((prev: DetailItem | null) => DetailItem | null)) => void;
  quickAdd: boolean;
  setQuickAdd: (updater: boolean | ((prev: boolean) => boolean)) => void;
  menuOpen: boolean;
  setMenuOpen: (updater: boolean | ((prev: boolean) => boolean)) => void;
  workspace: WorkspaceInfo;
  setWorkspace: (updater: WorkspaceInfo | ((prev: WorkspaceInfo) => WorkspaceInfo)) => void;
  user: UserInfo | null;
  setUser: (updater: UserInfo | null | ((prev: UserInfo | null) => UserInfo | null)) => void;
  syncProfile: () => void;
  saveDetail: (item: DetailItem) => Promise<void>;
  deleteCentro: (id: string) => DeleteResult;
  loadDbData: () => Promise<void>;
  isLoaded: boolean;
}

export const useAppStore = create<AppState>()(
  (set, get) => ({
    isLoaded: false,
    centros: [],
    licencas: [],
    condicionantes: [],
    documentos: [],
    usuarios: [],
    detail: null,
    quickAdd: false,
    menuOpen: false,
    workspace: {
      nome: '',
      tipo: 'Acesso Corporativo',
    },
    user: null,

    syncProfile: () => {
      if (typeof window === 'undefined') return;
      const { usuarios } = get();
      if (!usuarios || usuarios.length === 0) return;

      const sessionUserId = getSessionUserId();
      let match = usuarios.find((u) => u.id === sessionUserId);
      if (!match) {
        try {
          const raw = localStorage.getItem('licere_auth_user');
          if (raw) {
            const auth = JSON.parse(raw);
            if (auth?.email) {
              match = usuarios.find((u) => u.email.toLowerCase() === auth.email.trim().toLowerCase());
            }
          }
        } catch {}
      }
      if (!match && usuarios.length > 0) {
        match = usuarios[0];
      }
      if (match) {
        startSession(match.id);
        set({
          user: match,
          workspace: {
            nome: match.empresa || '',
            tipo: 'Acesso Corporativo',
          },
        });
      }
    },

    setWorkspace: (updater) =>
      set((state) => ({ workspace: typeof updater === 'function' ? updater(state.workspace) : updater })),
    setUser: (updater) =>
      set((state) => ({ user: typeof updater === 'function' ? updater(state.user) : updater })),

    loadDbData: async () => {
      try {
        const data = await fetchInitialData();
        const dbUsers = (data.usuarios || []) as unknown as Usuario[];
        set({
          centros: data.centros as unknown as Centro[],
          licencas: data.licencas as unknown as Licenca[],
          condicionantes: data.condicionantes as unknown as Condicionante[],
          documentos: data.documentos as unknown as Documento[],
          usuarios: dbUsers,
          isLoaded: true,
        });

        if (typeof window !== 'undefined') {
          const sessionUserId = getSessionUserId();
          let match = dbUsers.find((u) => u.id === sessionUserId);
          if (!match) {
            try {
              const raw = localStorage.getItem('licere_auth_user');
              if (raw) {
                const auth = JSON.parse(raw);
                if (auth?.email) {
                  match = dbUsers.find((u) => u.email.toLowerCase() === auth.email.trim().toLowerCase());
                }
              }
            } catch {}
          }
          if (!match && dbUsers.length > 0) {
            match = dbUsers[0];
          }
          if (match) {
            startSession(match.id);
            set({
              user: match,
              workspace: {
                nome: match.empresa || '',
                tipo: 'Acesso Corporativo',
              },
            });
          }
        }
      } catch (err) {
        console.error('Erro ao carregar dados do banco:', err);
        set({ isLoaded: true });
      }
    },

    setCentros: (updater) => set((state) => ({ centros: typeof updater === 'function' ? updater(state.centros) : updater })),
    setLicencas: (updater) => set((state) => ({ licencas: typeof updater === 'function' ? updater(state.licencas) : updater })),
    setCondicionantes: (updater) => set((state) => ({ condicionantes: typeof updater === 'function' ? updater(state.condicionantes) : updater })),
    setDocumentos: (updater) => set((state) => ({ documentos: typeof updater === 'function' ? updater(state.documentos) : updater })),
    setUsuarios: (updater) => set((state) => ({ usuarios: typeof updater === 'function' ? updater(state.usuarios) : updater })),
    setDetail: (updater) => set((state) => ({ detail: typeof updater === 'function' ? updater(state.detail) : updater })),
    setQuickAdd: (updater) => set((state) => ({ quickAdd: typeof updater === 'function' ? updater(state.quickAdd) : updater })),
    setMenuOpen: (updater) => set((state) => ({ menuOpen: typeof updater === 'function' ? updater(state.menuOpen) : updater })),

    saveDetail: async (item) => {
      if (isLicenca(item)) {
        await saveLicencaDb(item);
        get().setLicencas((old) => {
          const exists = old.find((x) => x.id === item.id);
          if (exists) return old.map((x) => (x.id === item.id ? item : x));
          return [item, ...old];
        });
      } else if (isCondicionante(item)) {
        await saveCondicionanteDb(item);
        get().setCondicionantes((old) => {
          const exists = old.find((x) => x.id === item.id);
          if (exists) return old.map((x) => (x.id === item.id ? item : x));
          return [item, ...old];
        });
      } else if (isDocumento(item)) {
        await saveDocumentoDb(item);
        get().setDocumentos((old) => {
          const exists = old.find((x) => x.id === item.id);
          if (exists) return old.map((x) => (x.id === item.id ? item : x));
          return [item, ...old];
        });
      } else {
        await saveCentroDb(item);
        get().setCentros((old) => {
          const exists = old.find((x) => x.id === item.id);
          if (exists) return old.map((x) => (x.id === item.id ? item : x));
          return [item, ...old];
        });
      }
    },

    deleteCentro: (id) => {
      const { centros, documentos, condicionantes, detail, setCentros, setDetail } = get();
      const target = centros.find((c) => c.id === id);
      if (!target) return { success: false, reason: 'Unidade não encontrada.' };

      const pendenciasDocs = documentos.filter(
        (d) => d.centroId === id && getDocumentStatus(d.validade) !== 'Válido'
      );
      const pendenciasTarefas = condicionantes.filter(
        (c) => c.centroId === id && c.status !== 'Concluída'
      );

      const total = pendenciasDocs.length + pendenciasTarefas.length;
      if (total > 0) {
        return {
          success: false,
          reason: `Não é possível excluir "${target.nome}". A unidade possui ${total} pendência(s) ativa(s) (${pendenciasDocs.length} documentos pendentes/expirados e ${pendenciasTarefas.length} tarefas não concluídas). Regularize-as antes de excluir.`,
        };
      }

      deleteCentroDb(id).catch(console.error);
      setCentros((prev) => prev.filter((c) => c.id !== id));
      if (detail && 'id' in detail && detail.id === id) {
        setDetail(null);
      }
      return { success: true };
    },
  })
);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const loadDbData = useAppStore((state) => state.loadDbData);
  const syncProfile = useAppStore((state) => state.syncProfile);

  React.useEffect(() => {
    loadDbData();
    syncProfile();

    const handleSync = () => {
      syncProfile();
    };

    window.addEventListener('storage', handleSync);
    window.addEventListener('licere:profile_updated', handleSync);
    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('licere:profile_updated', handleSync);
    };
  }, [loadDbData, syncProfile]);

  return <>{children}</>;
}

export function useAppData() {
  return useAppStore();
}
