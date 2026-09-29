'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { DetailPanel } from '@/components/modals/DetailPanel';
import { QuickAdd } from '@/components/modals/QuickAdd';
import { useAppData } from '@/lib/AppDataContext';

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const {
    menuOpen,
    setMenuOpen,
    quickAdd,
    setQuickAdd,
    detail,
    setDetail,
    licencas,
    condicionantes,
    documentos,
    saveDetail,
    createQuick,
  } = useAppData();

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
        <QuickAdd onClose={() => setQuickAdd(false)} onCreate={createQuick} />
      )}
    </div>
  );
}
