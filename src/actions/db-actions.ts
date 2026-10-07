'use server';

import { prisma } from '@/lib/db';
import { Centro, Licenca, Condicionante, Documento } from '@/shared/types';

async function safeRevalidate(path: string) {
  const isTest = typeof globalThis !== 'undefined' && (globalThis as { process?: { env?: { NODE_ENV?: string } } }).process?.env?.NODE_ENV === 'test';
  if (!isTest) {
    try {
      const { revalidatePath } = await import('next/cache');
      revalidatePath(path);
    } catch {}
  }
}

// Busca inicial de todos os dados do banco SQLite
export async function fetchInitialData() {
  const centros = await prisma.centro.findMany();
  const licencas = await prisma.licenca.findMany();
  const condicionantes = await prisma.condicionante.findMany();
  const documentos = await prisma.documento.findMany();

  return {
    centros,
    licencas,
    condicionantes,
    documentos
  };
}

export async function saveCentroDb(item: Centro) {
  await prisma.centro.upsert({
    where: { id: item.id },
    update: item as any,
    create: item as any
  });
  await safeRevalidate('/');
}

export async function saveLicencaDb(item: Licenca) {
  await prisma.licenca.upsert({
    where: { id: item.id },
    update: item as any,
    create: item as any
  });
  await safeRevalidate('/');
}

export async function saveCondicionanteDb(item: Condicionante) {
  await prisma.condicionante.upsert({
    where: { id: item.id },
    update: item as any,
    create: item as any
  });
  await safeRevalidate('/');
}

export async function saveDocumentoDb(item: Documento) {
  const data = {
    ...item,
    licencaId: item.licencaId ?? null,
    condicionanteId: item.condicionanteId ?? null,
  };
  await prisma.documento.upsert({
    where: { id: item.id },
    update: data as any,
    create: data as any
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
