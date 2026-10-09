import { getDocumentStatus } from '../shared/utils';
import { initials } from '../shared/ui';
import { useAppStore } from '../lib/AppDataContext';
import type { Centro, Documento, Condicionante } from '../shared/types';

describe('Regras de Negócio - utils', () => {
  describe('getDocumentStatus', () => {
    it('deve retornar "Expirado" para uma data no passado', () => {
      const pastDate = '2024-01-01';
      expect(getDocumentStatus(pastDate)).toBe('Expirado');
    });

    it('deve retornar "Próximo do vencimento" para data em até 15 dias', () => {
      const now = new Date();
      const inSevenDays = new Date(now.getTime() + 7 * 86400000);
      const date7 = `${inSevenDays.getFullYear()}-${String(inSevenDays.getMonth() + 1).padStart(2, '0')}-${String(inSevenDays.getDate()).padStart(2, '0')}`;
      expect(getDocumentStatus(date7)).toBe('Próximo do vencimento');
    });

    it('deve retornar "Válido" para data acima de 15 dias', () => {
      const now = new Date();
      const inSixMonths = new Date(now.getTime() + 180 * 86400000);
      const date180 = `${inSixMonths.getFullYear()}-${String(inSixMonths.getMonth() + 1).padStart(2, '0')}-${String(inSixMonths.getDate()).padStart(2, '0')}`;
      expect(getDocumentStatus(date180)).toBe('Válido');
    });

    it('deve retornar "Válido" para validade "Indeterminada" ou "Permanente"', () => {
      expect(getDocumentStatus('Indeterminada')).toBe('Válido');
      expect(getDocumentStatus('Permanente')).toBe('Válido');
    });
  });

  describe('initials helper', () => {
    it('deve extrair as iniciais corretamente para o workspace avatar', () => {
      expect(initials('Operações Brasil')).toBe('OB');
      expect(initials('Logística Nacional')).toBe('LN');
      expect(initials('Suzano')).toBe('S');
    });
  });
});

describe('Regras de Negócio - useAppStore (Zustand)', () => {
  beforeEach(() => {
    // Reset initial state to prevent leak between tests
    useAppStore.setState({
      centros: [],
      documentos: [],
      condicionantes: [],
      licencas: [],
      workspace: { nome: 'Operações Brasil', tipo: 'Acesso Corporativo' },
      user: null,
    });
  });

  it('deve bloquear a exclusão de unidade com pendências ativas', () => {
    const unidadeAtiva: Centro = { id: 'cd-1', nome: 'CD Cajamar', status: 'Ativa', cidade: 'Cajamar', estado: 'SP', responsavel: 'Teste' };
    const docs: Documento[] = [
      { id: 'd1', centroId: 'cd-1', validade: '2024-01-01', nome: 'Doc', categoria: 'Relatórios', atualizadoEm: '', tamanho: '1MB' }, // Expirado
    ];
    const tarefas: Condicionante[] = [
      { id: 't1', centroId: 'cd-1', status: 'Pendente', titulo: 'Tarefa', licencaId: '', responsavel: '', prazo: '', recorrencia: 'Anual' },
    ];

    useAppStore.setState({ centros: [unidadeAtiva], documentos: docs, condicionantes: tarefas });

    const result = useAppStore.getState().deleteCentro('cd-1');
    expect(result.success).toBe(false);
    expect(result.reason).toContain('Não é possível excluir');
  });

  it('deve permitir a exclusão de unidade sem pendências ativas', () => {
    const unidadeAtiva: Centro = { id: 'cd-1', nome: 'CD Cajamar', status: 'Ativa', cidade: 'Cajamar', estado: 'SP', responsavel: 'Teste' };
    
    useAppStore.setState({ centros: [unidadeAtiva], documentos: [], condicionantes: [] });

    const result = useAppStore.getState().deleteCentro('cd-1');
    expect(result.success).toBe(true);
    expect(useAppStore.getState().centros).toHaveLength(0);
  });

  it('deve permitir atualizar dinamicamente o workspace e perfil', () => {
    useAppStore.getState().setWorkspace({ nome: 'EcoLog Brasil', tipo: 'Filial Sul' });
    expect(useAppStore.getState().workspace.nome).toBe('EcoLog Brasil');
    expect(initials(useAppStore.getState().workspace.nome)).toBe('EB');

    useAppStore.getState().setUser({
      nome: 'Carlos Silva',
      email: 'carlos@ecolog.com.br',
      cargo: 'Engenheiro Ambiental',
      empresa: 'EcoLog Brasil',
    });
    expect(useAppStore.getState().user?.nome).toBe('Carlos Silva');
    expect(initials(useAppStore.getState().user!.nome)).toBe('CS');
  });
});
