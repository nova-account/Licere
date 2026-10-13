import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const usuariosData = [
  {
    id: 'usr-marina',
    nome: 'Marina Azevedo',
    email: 'marina.azevedo@operacoesbrasil.com.br',
    senha: 'licere123',
    cargo: 'Diretora de Compliance & Operações',
    tipoAcesso: 'Administrador',
    empresa: 'Operações Brasil',
    telefone: '+55 11 98842-0176',
    centroId: 'cd-sp',
  },
  {
    id: 'usr-ricardo',
    nome: 'Ricardo Nunes',
    email: 'ricardo.nunes@operacoesbrasil.com.br',
    senha: 'licere123',
    cargo: 'Gerente de Meio Ambiente',
    tipoAcesso: 'Gestor',
    empresa: 'Operações Brasil',
    telefone: '+55 11 97721-4321',
    centroId: 'cd-jundiai',
  },
  {
    id: 'usr-bianca',
    nome: 'Bianca Tavares',
    email: 'bianca.tavares@operacoesbrasil.com.br',
    senha: 'licere123',
    cargo: 'Coordenadora de Sustentabilidade',
    tipoAcesso: 'Gestor',
    empresa: 'Operações Brasil',
    telefone: '+55 35 99812-3456',
    centroId: 'cd-extrema',
  },
  {
    id: 'usr-caio',
    nome: 'Caio Martins',
    email: 'caio.martins@operacoesbrasil.com.br',
    senha: 'licere123',
    cargo: 'Analista de Resíduos & PGRS',
    tipoAcesso: 'Analista',
    empresa: 'Operações Brasil',
    telefone: '+55 47 99234-5678',
    centroId: 'cd-joinville',
  },
  {
    id: 'usr-helena',
    nome: 'Helena Freitas',
    email: 'helena.freitas@operacoesbrasil.com.br',
    senha: 'licere123',
    cargo: 'Especialista em Licenciamento Ambiental',
    tipoAcesso: 'Gestor',
    empresa: 'Operações Brasil',
    telefone: '+55 62 98455-6789',
    centroId: 'cd-goiania',
  },
  {
    id: 'usr-lucas',
    nome: 'Lucas Silveira',
    email: 'lucas.silveira@operacoesbrasil.com.br',
    senha: 'licere123',
    cargo: 'Supervisor de Operações Ambientais',
    tipoAcesso: 'Analista',
    empresa: 'Operações Brasil',
    telefone: '+55 31 99123-4567',
    centroId: 'cd-betim',
  },
  {
    id: 'usr-fernanda',
    nome: 'Fernanda Costa',
    email: 'fernanda.costa@operacoesbrasil.com.br',
    senha: 'licere123',
    cargo: 'Engenheira Ambiental & Auditora',
    tipoAcesso: 'Auditor',
    empresa: 'Operações Brasil',
    telefone: '+55 41 98765-4321',
    centroId: 'cd-curitiba',
  },
];

async function seed() {
  await prisma.usuario.deleteMany();
  for (const u of usuariosData) {
    await prisma.usuario.create({
      data: u,
    });
  }
  const count = await prisma.usuario.count();
  console.log(`Successfully seeded ${count} usuarios.`);
}

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
