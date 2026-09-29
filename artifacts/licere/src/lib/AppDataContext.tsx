'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import type { Condicionante, DetailItem, Documento, Licenca } from '@/shared/types';
import { initialCondicionantes, initialDocumentos, initialLicencas } from '@/shared/data';
import { useLocal } from '@/shared/ui';

interface AppDataContextProps {
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
  createQuick: (kind: 'licenca' | 'condicionante' | 'documento') => string;
}

const AppDataContext = createContext<AppDataContextProps | undefined>(undefined);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [quickAdd, setQuickAdd] = useState(false);
  const [detail, setDetail] = useState<DetailItem | null>(null);

  const [licencas, setLicencas] = useLocal<Licenca[]>('licere-licencas', initialLicencas);
  const [condicionantes, setCondicionantes] = useLocal<Condicionante[]>('licere-condicionantes', initialCondicionantes);
  const [documentos, setDocumentos] = useLocal<Documento[]>('licere-documentos', initialDocumentos);
  const router = useRouter();

  const saveDetail = (item: DetailItem) => {
    if ('numero' in item) {
      setLicencas((old) => old.map((x) => (x.id === item.id ? item as Licenca : x)));
    } else if ('recorrencia' in item) {
      setCondicionantes((old) => old.map((x) => (x.id === item.id ? item as Condicionante : x)));
    } else if ('categoria' in item && 'nome' in item) {
      setDocumentos((old) => old.map((x) => (x.id === item.id ? item as Documento : x)));
    }
  };

  const createQuick = (kind: 'licenca' | 'condicionante' | 'documento') => {
    const id = `${kind}-${Date.now()}`;
    if (kind === 'licenca') {
      setLicencas((old) => [
        {
          id,
          numero: 'NOVO REGISTRO',
          tipo: 'Licença de Operação',
          centroId: 'cd-sp',
          orgao: 'CETESB',
          emissao: '2025-03-12',
          vencimento: '2026-03-12',
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
          licencaId: 'lic-1',
          centroId: 'cd-sp',
          responsavel: 'Marina Azevedo',
          prazo: '2025-04-12',
          status: 'Em andamento',
          recorrencia: 'Semestral',
        },
        ...old,
      ]);
      router.push('/condicionantes');
    } else {
      setDocumentos((old) => [
        {
          id,
          nome: 'Novo documento — revisão pendente',
          categoria: 'Relatórios',
          centroId: 'cd-sp',
          atualizadoEm: '12 mar 2025',
          validade: '2026-03-12',
          tamanho: '—',
          condicionanteId: 'con-1',
        },
        ...old,
      ]);
    }
    return id;
  };

  return (
    <AppDataContext.Provider
      value={{
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
