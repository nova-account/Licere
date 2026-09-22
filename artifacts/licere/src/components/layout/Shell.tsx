import React, { useState } from 'react';
import { Route, Switch, useLocation } from 'wouter';
import type { Condicionante, DetailItem, Documento, Licenca } from '@/shared/types';
import { initialCondicionantes, initialDocumentos, initialLicencas } from '@/shared/data';
import { useLocal } from '@/shared/ui';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { DetailPanel } from '@/components/modals/DetailPanel';
import { QuickAdd } from '@/components/modals/QuickAdd';

import DashboardScreen from '@/screens/dashboard';
import UnidadesPage from '@/screens/unidades';
import DocumentosPage from '@/screens/documentos';
import TarefasPage from '@/screens/tarefas';
import LicencasPage from '@/screens/licencas';
import CondicionantesPage from '@/screens/condicionantes';
import PerfilPageScreen from '@/screens/perfil';
import AjudaScreen from '@/screens/ajuda';
import NotFound from '@/NotFound';

export function Shell() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [quickAdd, setQuickAdd] = useState(false);
  const [detail, setDetail] = useState<DetailItem | null>(null);
  const [, setLocation] = useLocation();

  const [licencas, setLicencas] = useLocal<Licenca[]>(
    'licere-licencas',
    initialLicencas,
  );
  const [condicionantes, setCondicionantes] = useLocal<Condicionante[]>(
    'licere-condicionantes',
    initialCondicionantes,
  );
  const [documentos, setDocumentos] = useLocal<Documento[]>(
    'licere-documentos',
    initialDocumentos,
  );

  const saveDetail = (item: DetailItem) => {
    if ('numero' in item) {
      setLicencas((old) => old.map((x) => (x.id === item.id ? item : x)));
    } else if ('recorrencia' in item) {
      setCondicionantes((old) => old.map((x) => (x.id === item.id ? item : x)));
    } else if ('categoria' in item && 'nome' in item) {
      setDocumentos((old) => old.map((x) => (x.id === item.id ? item : x)));
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
      setLocation('/licencas');
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
      setLocation('/condicionantes');
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
      setLocation('/documentos');
    }
  };

  return (
    <div className="app-shell">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="app-main">
        <Topbar
          onMenu={() => setMenuOpen(true)}
          onQuickAdd={() => setQuickAdd(true)}
        />
        <Switch>
          <Route
            path="/dashboard"
            component={() => (
              <DashboardScreen
                licencas={licencas}
                condicionantes={condicionantes}
                documentos={documentos}
                openDetail={setDetail}
              />
            )}
          />
          <Route
            path="/unidades"
            component={() => <UnidadesPage openDetail={setDetail} />}
          />
          <Route
            path="/documentos"
            component={() => (
              <DocumentosPage
                items={documentos}
                setItems={setDocumentos}
                openDetail={setDetail}
              />
            )}
          />
          <Route
            path="/tarefas"
            component={() => (
              <TarefasPage
                items={condicionantes}
                setItems={setCondicionantes}
                licencas={licencas}
                openDetail={setDetail}
              />
            )}
          />
          <Route
            path="/licencas"
            component={() => (
              <LicencasPage
                items={licencas}
                setItems={setLicencas}
                openDetail={setDetail}
              />
            )}
          />
          <Route
            path="/condicionantes"
            component={() => (
              <CondicionantesPage
                items={condicionantes}
                setItems={setCondicionantes}
                licencas={licencas}
                openDetail={setDetail}
              />
            )}
          />
          <Route path="/perfil" component={PerfilPageScreen} />
          <Route path="/ajuda" component={AjudaScreen} />
          <Route component={NotFound} />
        </Switch>
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
