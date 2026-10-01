import type { Centro, Condicionante, Documento, Licenca } from './types';

// Datas dinâmicas para garantir demonstração consistente de status (Válido, Próximo do Vencimento <= 15 dias, Expirado)
const now = new Date();
const addDays = (d: number) => {
  const dt = new Date(now.getTime() + d * 86400000);
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, '0');
  const day = String(dt.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export const centros: Centro[] = [
  {
    id: 'cd-sp',
    nome: 'CD Cajamar',
    cidade: 'Cajamar',
    estado: 'SP',
    responsavel: 'Marina Azevedo',
    status: 'Ativa',
  },
  {
    id: 'cd-jundiai',
    nome: 'CD Jundiaí',
    cidade: 'Jundiaí',
    estado: 'SP',
    responsavel: 'Ricardo Nunes',
    status: 'Ativa',
  },
  {
    id: 'cd-extrema',
    nome: 'CD Extrema',
    cidade: 'Extrema',
    estado: 'MG',
    responsavel: 'Bianca Tavares',
    status: 'Ativa',
  },
  {
    id: 'cd-joinville',
    nome: 'CD Joinville',
    cidade: 'Joinville',
    estado: 'SC',
    responsavel: 'Caio Martins',
    status: 'Ativa',
  },
  {
    id: 'cd-goiania',
    nome: 'CD Goiânia',
    cidade: 'Aparecida de Goiânia',
    estado: 'GO',
    responsavel: 'Helena Freitas',
    status: 'Ativa',
  },
  {
    id: 'cd-betim',
    nome: 'CD Betim',
    cidade: 'Betim',
    estado: 'MG',
    responsavel: 'Lucas Silveira',
    status: 'Inativa',
  },
  {
    id: 'cd-curitiba',
    nome: 'Filial Curitiba',
    cidade: 'Curitiba',
    estado: 'PR',
    responsavel: 'Fernanda Costa',
    status: 'Inativa',
  },
];

export const initialLicencas: Licenca[] = [
  {
    id: 'lic-1',
    numero: 'CETESB 48001234',
    tipo: 'Licença de Operação',
    centroId: 'cd-sp',
    orgao: 'CETESB',
    emissao: '2023-08-14',
    vencimento: addDays(12), // Próximo do vencimento
    status: 'A vencer',
    criticidade: 'Alta',
    observacao: 'Renovação deve ser protocolada 120 dias antes do vencimento.',
  },
  {
    id: 'lic-2',
    numero: 'CETESB 57009871',
    tipo: 'Licença de Instalação',
    centroId: 'cd-jundiai',
    orgao: 'CETESB',
    emissao: '2024-02-22',
    vencimento: addDays(365),
    status: 'Vigente',
    criticidade: 'Média',
    observacao: 'Obra de ampliação do armazém B.',
  },
  {
    id: 'lic-3',
    numero: 'SEMAD-MG 2024/0198',
    tipo: 'Licença de Operação',
    centroId: 'cd-extrema',
    orgao: 'SEMAD / MG',
    emissao: '2024-06-03',
    vencimento: addDays(400),
    status: 'Regular',
    criticidade: 'Baixa',
    observacao: 'Operação condicionada ao relatório anual de efluentes.',
  },
  {
    id: 'lic-4',
    numero: 'IMA-SC 1129/2021',
    tipo: 'Licença Ambiental de Operação',
    centroId: 'cd-joinville',
    orgao: 'IMA / SC',
    emissao: '2021-11-18',
    vencimento: addDays(9), // Próximo do vencimento
    status: 'A vencer',
    criticidade: 'Alta',
    observacao: 'Iniciar renovação após inspeção do sistema de drenagem.',
  },
  {
    id: 'lic-5',
    numero: 'SEMAD-GO 891/2023',
    tipo: 'Licença Prévia e de Instalação',
    centroId: 'cd-goiania',
    orgao: 'SEMAD / GO',
    emissao: '2023-04-10',
    vencimento: '2024-04-10', // Vencida
    status: 'Vencida',
    criticidade: 'Alta',
    observacao: 'Aguardando análise de documentação complementar.',
  },
  {
    id: 'lic-6',
    numero: 'CETESB 44006612',
    tipo: 'Outorga de captação',
    centroId: 'cd-sp',
    orgao: 'DAEE / SP',
    emissao: '2024-09-01',
    vencimento: addDays(800),
    status: 'Regular',
    criticidade: 'Baixa',
    observacao: 'Captação subterrânea para uso não potável.',
  },
  {
    id: 'lic-7',
    numero: 'SEMAD-MG 2021/045',
    tipo: 'Licença Suspensa (Unidade Inativa)',
    centroId: 'cd-betim',
    orgao: 'SEMAD / MG',
    emissao: '2021-01-10',
    vencimento: '2023-01-10',
    status: 'Vencida',
    criticidade: 'Alta',
    observacao: 'Unidade desativada temporariamente para reestruturação.',
  },
];

export const initialCondicionantes: Condicionante[] = [
  {
    id: 'con-1',
    titulo: 'Enviar relatório trimestral de efluentes',
    licencaId: 'lic-1',
    centroId: 'cd-sp',
    responsavel: 'Marina Azevedo',
    prazo: addDays(5),
    status: 'Pendente',
    recorrencia: 'Trimestral',
  },
  {
    id: 'con-2',
    titulo: 'Medição de emissões atmosféricas',
    licencaId: 'lic-1',
    centroId: 'cd-sp',
    responsavel: 'Eduardo Lima',
    prazo: addDays(25),
    status: 'Em andamento',
    recorrencia: 'Semestral',
  },
  {
    id: 'con-3',
    titulo: 'Atualizar PGRS do empreendimento',
    licencaId: 'lic-3',
    centroId: 'cd-extrema',
    responsavel: 'Bianca Tavares',
    prazo: addDays(60),
    status: 'Concluída',
    recorrencia: 'Anual',
  },
  {
    id: 'con-4',
    titulo: 'Apresentar inventário de resíduos',
    licencaId: 'lic-4',
    centroId: 'cd-joinville',
    responsavel: 'Caio Martins',
    prazo: addDays(8),
    status: 'Pendente',
    recorrencia: 'Anual',
  },
  {
    id: 'con-5',
    titulo: 'Manutenção do sistema de separação de óleo e água',
    licencaId: 'lic-2',
    centroId: 'cd-jundiai',
    responsavel: 'Ricardo Nunes',
    prazo: addDays(15),
    status: 'Em andamento',
    recorrencia: 'Mensal',
  },
  {
    id: 'con-6',
    titulo: 'Plano de emergência individual atualizado',
    licencaId: 'lic-5',
    centroId: 'cd-goiania',
    responsavel: 'Helena Freitas',
    prazo: '2024-04-30',
    status: 'Pendente',
    recorrencia: 'Anual',
  },
  {
    id: 'con-7',
    titulo: 'Inventário de passivos ambientais (Unidade Inativa)',
    licencaId: 'lic-7',
    centroId: 'cd-betim',
    responsavel: 'Lucas Silveira',
    prazo: '2024-12-15',
    status: 'Pendente',
    recorrencia: 'Única',
  },
];

export const initialDocumentos: Documento[] = [
  {
    id: 'doc-1',
    nome: 'Relatório Trimestral de Efluentes — Q4.pdf',
    categoria: 'Relatórios',
    centroId: 'cd-sp',
    atualizadoEm: '18 fev 2025',
    validade: addDays(8), // Próximo do vencimento (<= 15 dias)
    tamanho: '2.4 MB',
    licencaId: 'lic-1',
    condicionanteId: 'con-1',
  },
  {
    id: 'doc-2',
    nome: 'Certificado de Destinação Final — Manifesto MTR.pdf',
    categoria: 'Certificados',
    centroId: 'cd-sp',
    atualizadoEm: '03 mar 2025',
    validade: 'Indeterminada', // Válido
    tamanho: '840 KB',
    licencaId: 'lic-1',
  },
  {
    id: 'doc-3',
    nome: 'PGRS — Plano de Gerenciamento de Resíduos Sólidos 2025.pdf',
    categoria: 'Planos & Laudos',
    centroId: 'cd-extrema',
    atualizadoEm: '14 jan 2025',
    validade: addDays(180), // Válido
    tamanho: '6.1 MB',
    licencaId: 'lic-3',
    condicionanteId: 'con-3',
  },
  {
    id: 'doc-4',
    nome: 'Laudo de Análise de Ruído Ambiental.pdf',
    categoria: 'Planos & Laudos',
    centroId: 'cd-jundiai',
    atualizadoEm: '28 nov 2024',
    validade: addDays(240), // Válido
    tamanho: '1.8 MB',
    licencaId: 'lic-2',
  },
  {
    id: 'doc-5',
    nome: 'Licença CETESB 48001234 — Documento Original.pdf',
    categoria: 'Licenças',
    centroId: 'cd-sp',
    atualizadoEm: '14 ago 2023',
    validade: '2024-08-14', // Expirado
    tamanho: '4.2 MB',
    licencaId: 'lic-1',
  },
  {
    id: 'doc-6',
    nome: 'Comprovante de Protocolo de Renovação SEMAD-GO.pdf',
    categoria: 'Protocolos',
    centroId: 'cd-goiania',
    atualizadoEm: '02 fev 2025',
    validade: '2024-10-10', // Expirado
    tamanho: '512 KB',
    licencaId: 'lic-5',
    condicionanteId: 'con-6',
  },
  {
    id: 'doc-7',
    nome: 'Alvará Sanitário Betim — Histórico.pdf',
    categoria: 'Licenças',
    centroId: 'cd-betim',
    atualizadoEm: '10 out 2023',
    validade: '2024-05-20', // Expirado
    tamanho: '1.2 MB',
    licencaId: 'lic-7',
    condicionanteId: 'con-7',
  },
];
