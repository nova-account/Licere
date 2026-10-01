'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import type { Centro, Condicionante, DetailItem, Documento, Licenca } from '@/shared/types';
import { centros as initialCentros, initialCondicionantes, initialDocumentos, initialLicencas } from '@/shared/data';
import { useLocal } from '@/shared/ui';
import { getDocumentStatus } from '@/shared/utils';

interface DeleteResult {
  success: boolean;
  reason?: string;
}

interface AppDataContextProps {
  centros: Centro[];
  setCentros: React.Dispatch<React.SetStateAction<Centro[]>>;
  licencas: Licenca[];
  setLicencas: React.Dispatch<React.SetStateAction<Licenca[]>>;
  condicionantes: Condicionante[];
  setCondicionantes: React.Dispatch<React.SetStateAction<Condicionante[]>>;
  documentos: Documento[];
  setDocumentos: React.Dispatch<React.SetStateAction<Documento[]>>;
  detail: DetailItem | null;
  setDetail: React.Dispatch<React.SetStateAction<DetailItem | null>>;
  quickAdd: boolean;
  setQuickAdd: React.Dispatch<React.SetStateAction<boolean>>;
  menuOpen: boolean;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  saveDetail: (item: DetailItem) => void;
  deleteCentro: (id: string) => DeleteResult;
  createQuick: (kind: 'licenca' | 'condicionante' | 'documento') => string;
}

const AppDataContext = createContext<AppDataContextProps | undefined>(undefined);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [quickAdd, setQuickAdd] = useState(false);
  const [detail, setDetail] = useState<DetailItem | null>(null);

  const [centros, setCentros] = useLocal<Centro[]>('licere-centros-v2', initialCentros);
  const [licencas, setLicencas] = useLocal<Licenca[]>('licere-licencas-v2', initialLicencas);
  const [condicionantes, setCondicionantes] = useLocal<Condicionante[]>('licere-condicionantes-v2', initialCondicionantes);
  const [documentos, setDocumentos] = useLocal<Documento[]>('licere-documentos-v2', initialDocumentos);
  const router = useRouter();

  const saveDetail = (item: DetailItem) => {
    if ('numero' in item) {
      setLicencas((old) => old.map((x) => (x.id === item.id ? (item as Licenca) : x)));
    } else if ('recorrencia' in item) {
      setCondicionantes((old) => old.map((x) => (x.id === item.id ? (item as Condicionante) : x)));
    } else if ('categoria' in item && 'nome' in item) {
      setDocumentos((old) => old.map((x) => (x.id === item.id ? (item as Documento) : x)));
    } else {
      // Centro
      setCentros((old) => old.map((x) => (x.id === item.id ? (item as Centro) : x)));
    }
  };

  // Regra de negócio avançada: bloqueio de exclusão de unidade com pendências
  const deleteCentro = (id: string): DeleteResult => {
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

    setCentros((prev) => prev.filter((c) => c.id !== id));
    if (detail && 'id' in detail && detail.id === id) {
      setDetail(null);
    }
    return { success: true };
  };

  const createQuick = (kind: 'licenca' | 'condicionante' | 'documento') => {
    const id = `${kind}-${Date.now()}`;
    const activeCentro = centros.find((c) => c.status === 'Ativa') || centros[0];

    if (kind === 'licenca') {
      setLicencas((old) => [
        {
          id,
          numero: 'NOVO REGISTRO',
          tipo: 'Licença de Operação',
          centroId: activeCentro.id,
          orgao: 'CETESB',
          emissao: new Date().toISOString().split('T')[0],
          vencimento: '2026-12-31',
          status: 'Em análise',
          criticidade: 'Média',
          observacao: 'Registro criado localmente.',
        },
        ...old,
      ]);
      router.push('/licencas');
    } else if (kind === 'condicionante') {
      setCondicionantes((old) => [
        {
          id,
          titulo: 'Nova obrigação ambiental',
          licencaId: initialLicencas[0]?.id || 'lic-1',
          centroId: activeCentro.id,
          responsavel: activeCentro.responsavel,
          prazo: '2025-05-15',
          status: 'Em andamento',
          recorrencia: 'Semestral',
        },
        ...old,
      ]);
      router.push('/tarefas');
    } else {
      setDocumentos((old) => [
        {
          id,
          nome: 'Novo documento — revisão pendente.pdf',
          categoria: 'Relatórios',
          centroId: activeCentro.id,
          atualizadoEm: new Date().toLocaleDateString('pt-BR'),
          validade: '2026-12-31',
          tamanho: '1.2 MB',
          condicionanteId: initialCondicionantes[0]?.id,
        },
        ...old,
      ]);
      router.push('/documentos');
    }
    return id;
  };

  return (
    <AppDataContext.Provider
      value={{
        centros,
        setCentros,
        licencas,
        setLicencas,
        condicionantes,
        setCondicionantes,
        documentos,
        setDocumentos,
        detail,
        setDetail,
        quickAdd,
        setQuickAdd,
        menuOpen,
        setMenuOpen,
        saveDetail,
        deleteCentro,
        createQuick,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (context === undefined) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
}
