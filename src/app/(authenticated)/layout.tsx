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

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [activeModal, setActiveModal] = useState<QuickActionType | null>(null);

  useEffect(() => {
    const auth = typeof window !== 'undefined' ? localStorage.getItem('licere_auth_user') : null;
    if (!auth) {
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
    centros,
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
      <div
        style={{
          display: 'flex',
          height: '100vh',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f8faf9',
          color: '#245b45',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '6px' }}>licere</div>
          <div style={{ fontSize: '13px', color: '#688275' }}>Validando credenciais corporativas...</div>
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
          onSave={(nova) => setCondicionantes((prev) => [nova, ...prev])}
        />
      )}

      {activeModal === 'documento' && (
        <NovoDocumentoModal
          open
          onClose={() => setActiveModal(null)}
          onSave={(novo) => setDocumentos((prev) => [novo, ...prev])}
        />
      )}

      {activeModal === 'licenca' && (
        <NovaLicencaModal
          open
          onClose={() => setActiveModal(null)}
          onSave={(nova) => setLicencas((prev) => [nova, ...prev])}
        />
      )}

      {activeModal === 'unidade' && (
        <NovaUnidadeModal
          open
          onClose={() => setActiveModal(null)}
          onSave={(nova) => setCentros((prev) => [nova, ...prev])}
        />
      )}
    </div>
  );
}
