'use client';

import React, { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Centro, Condicionante, DetailItem, Documento, Licenca } from '@/shared/types';
import { getDocumentStatus } from '@/shared/utils';
import { fetchInitialData, saveCentroDb, saveLicencaDb, saveCondicionanteDb, saveDocumentoDb, deleteCentroDb } from '@/actions/db-actions';

export interface WorkspaceInfo {
  nome: string;
  tipo: string;
}

export interface UserInfo {
  nome: string;
  email?: string;
  cargo?: string;
  empresa?: string;
  telefone?: string;
}

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
  createQuick: (kind: 'licenca' | 'condicionante' | 'documento', navigate: (path: string) => void) => string;
  loadDbData: () => Promise<void>;
}

export const useAppStore = create<AppState>()(
    (set, get) => ({
      centros: [],
      licencas: [],
      condicionantes: [],
      documentos: [],
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
        try {
          const rawProfile = localStorage.getItem('licere-profile');
          if (rawProfile) {
            const p = JSON.parse(rawProfile);
            set({
              user: p,
              workspace: {
                nome: p.empresa || '',
                tipo: 'Acesso Corporativo',
              },
            });
            return;
          }
          const rawAuth = localStorage.getItem('licere_auth_user');
          if (rawAuth) {
            const a = JSON.parse(rawAuth);
            set({
              user: {
                nome: a.nome || 'Usuário',
                email: a.email,
                cargo: a.role || 'Administrador(a)',
                empresa: a.empresa || '',
              },
              workspace: {
                nome: a.empresa || '',
                tipo: 'Acesso Corporativo',
              },
            });
          }
        } catch {}
      },

      setWorkspace: (updater) =>
        set((state) => ({ workspace: typeof updater === 'function' ? updater(state.workspace) : updater })),
      setUser: (updater) =>
        set((state) => ({ user: typeof updater === 'function' ? updater(state.user) : updater })),

      loadDbData: async () => {
        const data = await fetchInitialData();
        set({
          centros: data.centros as unknown as Centro[],
          licencas: data.licencas as unknown as Licenca[],
          condicionantes: data.condicionantes as unknown as Condicionante[],
          documentos: data.documentos as unknown as Documento[]
        });
      },

      setCentros: (updater) => set((state) => ({ centros: typeof updater === 'function' ? updater(state.centros) : updater })),
      setLicencas: (updater) => set((state) => ({ licencas: typeof updater === 'function' ? updater(state.licencas) : updater })),
      setCondicionantes: (updater) => set((state) => ({ condicionantes: typeof updater === 'function' ? updater(state.condicionantes) : updater })),
      setDocumentos: (updater) => set((state) => ({ documentos: typeof updater === 'function' ? updater(state.documentos) : updater })),
      setDetail: (updater) => set((state) => ({ detail: typeof updater === 'function' ? updater(state.detail) : updater })),
      setQuickAdd: (updater) => set((state) => ({ quickAdd: typeof updater === 'function' ? updater(state.quickAdd) : updater })),
      setMenuOpen: (updater) => set((state) => ({ menuOpen: typeof updater === 'function' ? updater(state.menuOpen) : updater })),

      saveDetail: async (item) => {
        if ('numero' in item) {
          await saveLicencaDb(item as Licenca);
          get().setLicencas((old) => {
            const exists = old.find((x) => x.id === item.id);
            if (exists) return old.map((x) => (x.id === item.id ? (item as Licenca) : x));
            return [item as Licenca, ...old];
          });
        } else if ('recorrencia' in item) {
          await saveCondicionanteDb(item as Condicionante);
          get().setCondicionantes((old) => {
            const exists = old.find((x) => x.id === item.id);
            if (exists) return old.map((x) => (x.id === item.id ? (item as Condicionante) : x));
            return [item as Condicionante, ...old];
          });
        } else if ('categoria' in item && 'nome' in item) {
          await saveDocumentoDb(item as Documento);
          get().setDocumentos((old) => {
             const exists = old.find((x) => x.id === item.id);
             if (exists) return old.map((x) => (x.id === item.id ? (item as Documento) : x));
             return [item as Documento, ...old];
          });
        } else {
          await saveCentroDb(item as Centro);
          get().setCentros((old) => {
             const exists = old.find((x) => x.id === item.id);
             if (exists) return old.map((x) => (x.id === item.id ? (item as Centro) : x));
             return [item as Centro, ...old];
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

      createQuick: (kind, navigate) => {
        const { centros } = get();
        const id = `${kind}-${Date.now()}`;
        const activeCentro = centros.find((c) => c.status === 'Ativa') || centros[0];

        if (kind === 'licenca') {
          const newItem: Licenca = {
            id,
            numero: 'NOVO REGISTRO',
            tipo: 'Licença de Operação',
            centroId: activeCentro?.id || '',
            orgao: 'CETESB',
            emissao: new Date().toISOString().split('T')[0],
            vencimento: '2026-12-31',
            status: 'Em análise',
            criticidade: 'Média',
            observacao: 'Registro criado localmente.',
          };
          get().saveDetail(newItem);
          navigate('/licencas');
        } else if (kind === 'condicionante') {
          const { licencas } = get();
          const newItem: Condicionante = {
            id,
            titulo: 'Nova obrigação ambiental',
            licencaId: licencas[0]?.id || '',
            centroId: activeCentro?.id || '',
            responsavel: activeCentro?.responsavel || '',
            prazo: '2025-05-15',
            status: 'Em andamento',
            recorrencia: 'Semestral',
          };
          get().saveDetail(newItem);
          navigate('/tarefas');
        } else {
          const newItem: Documento = {
            id,
            nome: 'Novo documento — revisão pendente.pdf',
            categoria: 'Relatórios',
            centroId: activeCentro?.id || '',
            atualizadoEm: new Date().toLocaleDateString('pt-BR'),
            validade: '2026-12-31',
            tamanho: '1.2 MB',
          };
          get().saveDetail(newItem);
          navigate('/documentos');
        }
        return id;
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
  const store = useAppStore();
  const router = useRouter();

  return {
    ...store,
    createQuick: (kind: 'licenca' | 'condicionante' | 'documento') => {
      return store.createQuick(kind, (path) => router.push(path));
    },
  };
}
