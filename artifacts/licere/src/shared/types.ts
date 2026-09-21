export type Status =
  | 'Regular'
  | 'A vencer'
  | 'Vencida'
  | 'Em análise'
  | 'Concluída'
  | 'Pendente'
  | 'Vigente'
  | 'Expirada';

export type Centro = {
  id: string;
  nome: string;
  cidade: string;
  estado: string;
  responsavel: string;
  status: string;
};

export type Licenca = {
  id: string;
  numero: string;
  tipo: string;
  centroId: string;
  orgao: string;
  emissao: string;
  vencimento: string;
  status: Status;
  criticidade: 'Alta' | 'Média' | 'Baixa';
  observacao: string;
};

export type Condicionante = {
  id: string;
  titulo: string;
  licencaId: string;
  centroId: string;
  responsavel: string;
  prazo: string;
  status: Status;
  recorrencia: string;
};

export type Documento = {
  id: string;
  nome: string;
  categoria: string;
  centroId: string;
  atualizadoEm: string;
  validade: string;
  status: Status;
  tamanho: string;
  licencaId?: string;
  condicionanteId?: string;
};

export type DetailItem = Licenca | Condicionante | Documento | Centro;

export const isLicenca = (item: DetailItem): item is Licenca => 'numero' in item;
export const isCondicionante = (item: DetailItem): item is Condicionante => 'recorrencia' in item;
export const isDocumento = (item: DetailItem): item is Documento => 'categoria' in item && 'nome' in item;
export const isCentro = (item: DetailItem): item is Centro => !('numero' in item) && !('recorrencia' in item) && !('categoria' in item);
