'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { DetailPanel } from '@/components/modals/DetailPanel';
import { QuickAdd, type QuickActionType } from '@/components/modals/QuickAdd';
import { NovaTarefaModal } from '@/components/modals/NovaTarefaModal';
import { NovoDocumentoModal } from '@/components/modals/NovoDocumentoModal';
import { NovaLicencaModal } from '@/components/modals/NovaLicencaModal';
import { NovaUnidadeModal } from '@/components/modals/NovaUnidadeModal';
import { useAppData } from '@/lib/AppDataContext';
import { getSessionUserId } from '@/lib/session';

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [activeModal, setActiveModal] = useState<QuickActionType | null>(null);

  useEffect(() => {
    const hasSession =
      typeof window !== 'undefined'
        ? getSessionUserId() || localStorage.getItem('licere_auth_user')
        : null;
    if (!hasSession) {
      router.replace('/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const {
    menuOpen,
    setMenuOpen,
    quickAdd,
    setQuickAdd,
    detail,
    setDetail,
    setCentros,
    licencas,
    setLicencas,
    condicionantes,
    setCondicionantes,
    documentos,
    setDocumentos,
    saveDetail,
  } = useAppData();

  if (isAuthenticated === null) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#f8faf9] text-[#245b45] font-sans">
        <div className="text-center">
          <div className="text-[20px] font-bold tracking-[-0.02em] mb-1.5">licere</div>
          <div className="text-[13px] text-[#688275]">Validando credenciais corporativas...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="app-main">
        <Topbar
          onMenu={() => setMenuOpen(true)}
          onQuickAdd={() => setQuickAdd(true)}
        />
        {children}
      </div>

      {detail && (
        <DetailPanel
          item={detail}
          licencas={licencas}
          condicionantes={condicionantes}
          documentos={documentos}
          onClose={() => setDetail(null)}
          onSave={saveDetail}
          onOpen={setDetail}
        />
      )}

      {quickAdd && (
        <QuickAdd
          onClose={() => setQuickAdd(false)}
          onSelectAction={(kind) => {
            setQuickAdd(false);
            setActiveModal(kind);
          }}
        />
      )}

      {activeModal === 'tarefa' && (
        <NovaTarefaModal
          open
          onClose={() => setActiveModal(null)}
          onSave={(nova) => saveDetail(nova)}
        />
      )}

      {activeModal === 'documento' && (
        <NovoDocumentoModal
          open
          onClose={() => setActiveModal(null)}
          onSave={(novo) => saveDetail(novo)}
        />
      )}

      {activeModal === 'licenca' && (
        <NovaLicencaModal
          open
          onClose={() => setActiveModal(null)}
          onSave={(nova) => saveDetail(nova)}
        />
      )}

      {activeModal === 'unidade' && (
        <NovaUnidadeModal
          open
          onClose={() => setActiveModal(null)}
          onSave={(nova) => saveDetail(nova)}
        />
      )}
    </div>
  );
}
