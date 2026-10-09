import * as z from 'zod';

export const statusSchema = z.enum([
  'Regular',
  'A vencer',
  'Próximo do vencimento',
  'Vencida',
  'Expirada',
  'Expirado',
  'Em análise',
  'Em andamento',
  'Concluída',
  'Pendente',
  'Vigente',
  'Válido',
  'Operando',
  'Em expansão',
  'Ativa',
  'Inativa'
]);

export const centroStatusSchema = z.enum(['Ativa', 'Inativa']);

export const centroFormSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  cidade: z.string().min(1, 'Cidade é obrigatória'),
  estado: z.string().min(2, 'Estado inválido'),
  responsavel: z.string().min(3, 'Responsável é obrigatório'),
  status: centroStatusSchema,
});

export const centroSchema = centroFormSchema.extend({
  id: z.string(),
});

export const licencaFormSchema = z.object({
  numero: z.string().min(1, 'Número da licença é obrigatório'),
  tipo: z.string().min(1, 'Tipo de licença é obrigatório'),
  centroId: z.string().min(1, 'Unidade é obrigatória'),
  orgao: z.string().min(1, 'Órgão ambiental é obrigatório'),
  emissao: z.string().min(1, 'Data de emissão é obrigatória'),
  vencimento: z.string().min(1, 'Data de vencimento é obrigatória'),
  status: statusSchema,
  criticidade: z.enum(['Alta', 'Média', 'Baixa']),
  observacao: z.string().optional().default(''),
});

export const licencaSchema = licencaFormSchema.extend({
  id: z.string(),
});

export const condicionanteFormSchema = z.object({
  titulo: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  licencaId: z.string().min(1, 'Licença vinculada é obrigatória'),
  centroId: z.string().min(1, 'Unidade responsável é obrigatória'),
  responsavel: z.string().min(3, 'Responsável é obrigatório'),
  prazo: z.string().min(1, 'Prazo é obrigatório'),
  status: statusSchema,
  recorrencia: z.string().min(1, 'Recorrência é obrigatória'),
});

export const condicionanteSchema = condicionanteFormSchema.extend({
  id: z.string(),
});

export const documentoFormSchema = z.object({
  nome: z.string().min(1, 'Nome do arquivo é obrigatório'),
  categoria: z.string().min(1, 'Categoria é obrigatória'),
  centroId: z.string().min(1, 'Unidade é obrigatória'),
  atualizadoEm: z.string(),
  validade: z.string().min(1, 'Validade é obrigatória'),
  tamanho: z.string(),
  licencaId: z.string().optional(),
  condicionanteId: z.string().optional(),
});

export const documentoSchema = documentoFormSchema.extend({
  id: z.string(),
});
