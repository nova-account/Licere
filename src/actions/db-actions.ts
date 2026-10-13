'use server';

import { prisma } from '@/lib/db';
import {
  centroSchema,
  licencaSchema,
  condicionanteSchema,
  documentoSchema,
  usuarioSchema,
  perfilFormSchema,
} from '@/shared/schemas';
import type { Centro, Licenca, Condicionante, Documento, Usuario, PerfilFormData } from '@/shared/types';

// Colunas de Usuario que podem ir para o cliente (nunca a senha).
const usuarioPublicFields = {
  id: true,
  nome: true,
  email: true,
  cargo: true,
  tipoAcesso: true,
  empresa: true,
  telefone: true,
  centroId: true,
} as const;

async function safeRevalidate(path: string) {
  if (process.env.NODE_ENV !== 'test') {
    try {
      const { revalidatePath } = await import('next/cache');
      revalidatePath(path);
    } catch { }
  }
}

// Busca inicial de todos os dados do banco SQLite com validação Zod
export async function fetchInitialData() {
  const rawCentros = await prisma.centro.findMany();
  const rawLicencas = await prisma.licenca.findMany();
  const rawCondicionantes = await prisma.condicionante.findMany();
  const rawDocumentos = await prisma.documento.findMany();
  const usuarios = await fetchUsuariosDb();

  // Validação Zod com fallback seguro
  const centros: Centro[] = rawCentros.map((item) => {
    const parsed = centroSchema.safeParse(item);
    return parsed.success ? parsed.data : (item as any);
  });

  const licencas: Licenca[] = rawLicencas.map((item) => {
    const parsed = licencaSchema.safeParse(item);
    return parsed.success ? parsed.data : (item as any);
  });

  const condicionantes: Condicionante[] = rawCondicionantes.map((item) => {
    const parsed = condicionanteSchema.safeParse(item);
    return parsed.success ? parsed.data : (item as any);
  });

  const documentos: Documento[] = rawDocumentos.map((item) => {
    const parsed = documentoSchema.safeParse(item);
    return parsed.success ? parsed.data : (item as any);
  });

  return {
    centros,
    licencas,
    condicionantes,
    documentos,
    usuarios,
  };
}

export async function fetchUsuariosDb(): Promise<Usuario[]> {
  const rows = await prisma.usuario.findMany({
    select: usuarioPublicFields,
    orderBy: { nome: 'asc' },
  });
  return rows.map((row) => usuarioSchema.parse(row));
}

/** Valida as credenciais no servidor. Retorna o usuário (sem senha) ou null. */
export async function authenticateUsuario(email: string, senha: string): Promise<Usuario | null> {
  const row = await prisma.usuario.findUnique({
    where: { email: email.trim().toLowerCase() },
  });
  if (!row || row.senha !== senha) return null;
  return usuarioSchema.parse(row);
}

/** Busca um usuário pelo ID no banco. */
export async function getUsuarioDb(id: string): Promise<Usuario | null> {
  const row = await prisma.usuario.findUnique({
    where: { id },
    select: usuarioPublicFields,
  });
  return row ? usuarioSchema.parse(row) : null;
}

/** Atualiza apenas os campos editáveis do perfil e devolve o registro salvo. */
export async function updatePerfilDb(id: string, data: PerfilFormData): Promise<Usuario> {
  const validated = perfilFormSchema.parse(data);
  const row = await prisma.usuario.update({
    where: { id },
    data: {
      nome: validated.nome,
      email: validated.email.trim().toLowerCase(),
      cargo: validated.cargo,
      empresa: validated.empresa,
      telefone: validated.telefone ?? null,
    },
    select: usuarioPublicFields,
  });
  await safeRevalidate('/');
  return usuarioSchema.parse(row);
}

/** Salva ou cria um usuário no banco SQLite. */
export async function saveUsuarioDb(item: Usuario): Promise<Usuario> {
  const validated = usuarioSchema.parse(item);
  const row = await prisma.usuario.upsert({
    where: { id: validated.id },
    update: {
      nome: validated.nome,
      email: validated.email.trim().toLowerCase(),
      cargo: validated.cargo,
      tipoAcesso: validated.tipoAcesso,
      empresa: validated.empresa,
      telefone: validated.telefone ?? null,
      centroId: validated.centroId ?? null,
    },
    create: {
      id: validated.id,
      nome: validated.nome,
      email: validated.email.trim().toLowerCase(),
      senha: 'licere123',
      cargo: validated.cargo,
      tipoAcesso: validated.tipoAcesso,
      empresa: validated.empresa,
      telefone: validated.telefone ?? null,
      centroId: validated.centroId ?? null,
    },
    select: usuarioPublicFields,
  });
  await safeRevalidate('/');
  return usuarioSchema.parse(row);
}


export async function saveCentroDb(item: Centro) {
  const validated = centroSchema.parse(item);
  await prisma.centro.upsert({
    where: { id: validated.id },
    update: {
      nome: validated.nome,
      cidade: validated.cidade,
      estado: validated.estado,
      responsavel: validated.responsavel,
      status: validated.status,
    },
    create: {
      id: validated.id,
      nome: validated.nome,
      cidade: validated.cidade,
      estado: validated.estado,
      responsavel: validated.responsavel,
      status: validated.status,
    },
  });
  await safeRevalidate('/');
}

export async function saveLicencaDb(item: Licenca) {
  const validated = licencaSchema.parse(item);
  await prisma.licenca.upsert({
    where: { id: validated.id },
    update: {
      numero: validated.numero,
      tipo: validated.tipo,
      orgao: validated.orgao,
      emissao: validated.emissao,
      vencimento: validated.vencimento,
      status: validated.status,
      criticidade: validated.criticidade,
      observacao: validated.observacao ?? '',
      centroId: validated.centroId,
    },
    create: {
      id: validated.id,
      numero: validated.numero,
      tipo: validated.tipo,
      orgao: validated.orgao,
      emissao: validated.emissao,
      vencimento: validated.vencimento,
      status: validated.status,
      criticidade: validated.criticidade,
      observacao: validated.observacao ?? '',
      centroId: validated.centroId,
    },
  });
  await safeRevalidate('/');
}

export async function saveCondicionanteDb(item: Condicionante) {
  const validated = condicionanteSchema.parse(item);
  await prisma.condicionante.upsert({
    where: { id: validated.id },
    update: {
      titulo: validated.titulo,
      responsavel: validated.responsavel,
      prazo: validated.prazo,
      status: validated.status,
      recorrencia: validated.recorrencia,
      centroId: validated.centroId,
      licencaId: validated.licencaId,
    },
    create: {
      id: validated.id,
      titulo: validated.titulo,
      responsavel: validated.responsavel,
      prazo: validated.prazo,
      status: validated.status,
      recorrencia: validated.recorrencia,
      centroId: validated.centroId,
      licencaId: validated.licencaId,
    },
  });
  await safeRevalidate('/');
}

export async function saveDocumentoDb(item: Documento) {
  const validated = documentoSchema.parse(item);
  const data = {
    nome: validated.nome,
    categoria: validated.categoria,
    centroId: validated.centroId,
    atualizadoEm: validated.atualizadoEm || new Date().toLocaleDateString('pt-BR'),
    validade: validated.validade,
    tamanho: validated.tamanho || '1.5 MB',
    licencaId: validated.licencaId ?? null,
    condicionanteId: validated.condicionanteId ?? null,
  };
  await prisma.documento.upsert({
    where: { id: validated.id },
    update: data,
    create: {
      id: validated.id,
      ...data,
    },
  });
  await safeRevalidate('/');
}

export async function deleteCentroDb(id: string) {
  try {
    await prisma.centro.delete({ where: { id } });
  } catch (err: any) {
    if (err?.code !== 'P2025') {
      console.warn('Erro ao deletar centro no banco:', err);
    }
  }
  await safeRevalidate('/');
}
