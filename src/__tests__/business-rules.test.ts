import { getDocumentStatus, formatDate, getCenterName, centerName, getLicenseNumber, licenseName } from '../shared/utils';
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

    it('deve retornar "Expirado" para datas vazias ou corrompidas sem mascarar conformidade', () => {
      expect(getDocumentStatus('')).toBe('Expirado');
      expect(getDocumentStatus('data-invalida')).toBe('Expirado');
    });
  });

  describe('formatDate helper', () => {
    it('deve formatar data no padrão DD/MM/YYYY', () => {
      expect(formatDate('2026-12-31')).toBe('31/12/2026');
      expect(formatDate('Indeterminada')).toBe('Indeterminada');
    });
  });

  describe('getCenterName / centerName helper', () => {
    const mockCenters = [
      { id: 'c1', nome: 'Matriz São Paulo' },
      { id: 'c2', nome: 'Filial Curitiba' },
    ];

    it('deve retornar o nome da unidade correspondente ao ID', () => {
      expect(getCenterName('c1', mockCenters)).toBe('Matriz São Paulo');
      expect(centerName('c2', mockCenters)).toBe('Filial Curitiba');
    });

    it('deve retornar o próprio ID ou fallback quando não encontrado', () => {
      expect(getCenterName('c-inexistente', mockCenters)).toBe('c-inexistente');
      expect(getCenterName('c-inexistente', mockCenters, 'Unidade Geral')).toBe('Unidade Geral');
    });
  });

  describe('getLicenseNumber / licenseName helper', () => {
    const mockLicenses = [
      { id: 'lic-1', numero: 'LO 9982/2024' },
      { id: 'lic-2', numero: 'LP 4410/2023' },
    ];

    it('deve retornar o número da licença correspondente ao ID', () => {
      expect(getLicenseNumber('lic-1', mockLicenses)).toBe('LO 9982/2024');
      expect(licenseName('lic-2', mockLicenses)).toBe('LP 4410/2023');
    });

    it('deve retornar mensagem amigável de fallback quando não encontrada', () => {
      expect(getLicenseNumber('lic-x', mockLicenses)).toBe('Licença não localizada');
      expect(licenseName('lic-x', mockLicenses, 'Licença ambiental')).toBe('Licença ambiental');
    });
  });

  describe('initials helper', () => {
    it('deve extrair as iniciais corretamente para o workspace avatar', () => {
      expect(initials('Operações Brasil')).toBe('OB');
      expect(initials('Logística Nacional')).toBe('LN');
      expect(initials('Suzano')).toBe('S');
    });

    it('deve lidar com espaços múltiplos sem gerar "undefined"', () => {
      expect(initials('Operações  Brasil')).toBe('OB');
      expect(initials(' EcoLog   Nacional ')).toBe('EN');
      expect(initials('')).toBe('');
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

import {
  centroSchema,
  licencaSchema,
  condicionanteSchema,
  documentoSchema,
  documentoFormSchema,
  usuarioSchema,
  loginSchema,
} from '../shared/schemas';

describe('Validação Zod x Banco de Dados (Prisma / SQLite)', () => {
  it('deve validar corretamente o schema de Usuario mapeado do banco', () => {
    const dbUser = {
      id: 'usr-1',
      nome: 'Marina Azevedo',
      email: 'marina.azevedo@operacoesbrasil.com.br',
      senha: 'licere123',
      cargo: 'Diretora de Compliance & Operações',
      tipoAcesso: 'Administrador',
      empresa: 'Operações Brasil',
      telefone: '+55 11 98842-0176',
      centroId: 'cd-sp',
    };

    const parsed = usuarioSchema.safeParse(dbUser);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.nome).toBe('Marina Azevedo');
      expect(parsed.data.email).toBe('marina.azevedo@operacoesbrasil.com.br');
      expect(parsed.data.tipoAcesso).toBe('Administrador');
    }
  });

  it('deve suportar campos nulos/opcionais do banco em Documento (licencaId e condicionanteId)', () => {
    const dbDocWithNulls = {
      id: 'doc-123',
      nome: 'Alvara_2026.pdf',
      categoria: 'Alvarás e Outorgas',
      centroId: 'cd-sp',
      atualizadoEm: '10/10/2026',
      validade: '2026-12-31',
      tamanho: '2.4 MB',
      licencaId: null,
      condicionanteId: null,
    };

    const parsed = documentoSchema.safeParse(dbDocWithNulls);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.licencaId).toBeNull();
      expect(parsed.data.condicionanteId).toBeNull();
    }
  });

  it('deve validar Licenca com observacao nula ou ausente do banco', () => {
    const dbLicenca = {
      id: 'lic-1',
      numero: 'LO-2026/001',
      tipo: 'Licença de Operação',
      centroId: 'cd-sp',
      orgao: 'CETESB',
      emissao: '2024-01-01',
      vencimento: '2026-12-31',
      status: 'Vigente',
      criticidade: 'Média',
      observacao: null,
    };

    const parsed = licencaSchema.safeParse(dbLicenca);
    expect(parsed.success).toBe(true);
  });

  it('deve validar loginSchema e rejeitar credenciais corporativas inválidas', () => {
    const invalidEmail = loginSchema.safeParse({ email: 'invalido', password: '123' });
    expect(invalidEmail.success).toBe(false);

    const validCreds = loginSchema.safeParse({
      email: 'gestor@operacoesbrasil.com.br',
      password: 'senhaSegura123',
    });
    expect(validCreds.success).toBe(true);
  });

  it('deve rejeitar nomes de arquivo com path traversal (..) ou barras', () => {
    const maliciousDoc = {
      nome: '../../../../etc/passwd',
      categoria: 'Relatórios',
      centroId: 'cd-sp',
      validade: '2026-12-31',
    };
    const parsed = documentoFormSchema.safeParse(maliciousDoc);
    expect(parsed.success).toBe(false);
  });

  it('deve aceitar nomes de arquivos válidos e sanitizados', () => {
    const validDoc = {
      nome: 'Relatorio_Ambiental_2026.pdf',
      categoria: 'Relatórios',
      centroId: 'cd-sp',
      validade: '2026-12-31',
    };
    const parsed = documentoFormSchema.safeParse(validDoc);
    expect(parsed.success).toBe(true);
  });

  it('deve validar centroSchema e rejeitar dados com campos obrigatórios ausentes', () => {
    const invalidCentro = {
      id: 'cd-invalido',
      nome: 'AB', // Menos de 3 caracteres
      cidade: '',
      estado: 'X',
      responsavel: 'X',
    };
    const parsed = centroSchema.safeParse(invalidCentro);
    expect(parsed.success).toBe(false);
  });

  it('deve integrar validação Zod e armazenamento no Zustand store para Condicionantes', () => {
    const validCondicionante: Condicionante = {
      id: 't-10',
      titulo: 'Monitoramento Semestral de Ruído',
      responsavel: 'Eng. Luísa Costa',
      prazo: '2026-11-30',
      status: 'Pendente',
      recorrencia: 'Semestral',
      centroId: 'cd-1',
      licencaId: 'lic-1',
    };

    const parsed = condicionanteSchema.safeParse(validCondicionante);
    expect(parsed.success).toBe(true);

    useAppStore.getState().setCondicionantes([validCondicionante]);
    const stored = useAppStore.getState().condicionantes;
    expect(stored).toHaveLength(1);
    expect(stored[0].titulo).toBe('Monitoramento Semestral de Ruído');
  });
});

