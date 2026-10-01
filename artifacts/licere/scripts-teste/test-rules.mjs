import assert from 'node:assert';

// 1. Teste da Regra de Negócio: Cálculo de status de validade do documento
function getDocumentStatus(validade) {
  if (!validade || validade === 'Indeterminada' || validade === 'Permanente') return 'Válido';
  const [y, m, d] = validade.split('-');
  if (!y || !m || !d) return 'Válido';
  const expDate = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (expDate < today) {
    return 'Expirado';
  }
  const diffTime = expDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays <= 15) {
    return 'Próximo do vencimento';
  }
  return 'Válido';
}

// 2. Teste da Regra de Negócio: Bloqueio de novos registros em unidades inativas
function canReceiveRecords(centro) {
  return centro.status === 'Ativa';
}

// 3. Teste da Regra de Negócio: Bloqueio de exclusão de unidade com pendências
function canDeleteCentro(centro, documentos, condicionantes) {
  const pendenciasDocs = documentos.filter(
    (d) => d.centroId === centro.id && getDocumentStatus(d.validade) !== 'Válido'
  );
  const pendenciasTarefas = condicionantes.filter(
    (c) => c.centroId === centro.id && c.status !== 'Concluída'
  );
  const total = pendenciasDocs.length + pendenciasTarefas.length;
  if (total > 0) {
    return {
      allowed: false,
      reason: `Bloqueado: ${total} pendência(s) ativa(s).`,
    };
  }
  return { allowed: true };
}

// Execução dos Testes Unitários
console.log('🧪 Iniciando suíte de testes unitários das regras de negócio...');

// Teste 1: Documento Vencido
const pastDate = '2024-01-01';
assert.strictEqual(
  getDocumentStatus(pastDate),
  'Expirado',
  'Erro: Documento com data passada deve ser Expirado'
);
console.log('  Cálculo de status: data passada -> "Expirado"');

// Teste 2: Documento Próximo do Vencimento (<= 15 dias)
const now = new Date();
const inSevenDays = new Date(now.getTime() + 7 * 86400000);
const date7 = `${inSevenDays.getFullYear()}-${String(inSevenDays.getMonth() + 1).padStart(2, '0')}-${String(inSevenDays.getDate()).padStart(2, '0')}`;
assert.strictEqual(
  getDocumentStatus(date7),
  'Próximo do vencimento',
  'Erro: Documento a 7 dias deve ser Próximo do vencimento'
);
console.log('  Cálculo de status: vencimento em 7 dias -> "Próximo do vencimento"');

// Teste 3: Documento Válido (> 15 dias)
const inSixMonths = new Date(now.getTime() + 180 * 86400000);
const date180 = `${inSixMonths.getFullYear()}-${String(inSixMonths.getMonth() + 1).padStart(2, '0')}-${String(inSixMonths.getDate()).padStart(2, '0')}`;
assert.strictEqual(
  getDocumentStatus(date180),
  'Válido',
  'Erro: Documento a 180 dias deve ser Válido'
);
console.log('  Cálculo de status: vencimento em 180 dias -> "Válido"');

// Teste 4: Documento Indeterminado
assert.strictEqual(
  getDocumentStatus('Indeterminada'),
  'Válido',
  'Erro: Documento indeterminado deve ser Válido'
);
console.log('  Cálculo de status: "Indeterminada" -> "Válido"');

// Teste 5: Unidade Ativa vs Inativa para novos registros
const unidadeAtiva = { id: 'cd-1', nome: 'CD Cajamar', status: 'Ativa' };
const unidadeInativa = { id: 'cd-2', nome: 'CD Betim', status: 'Inativa' };

assert.strictEqual(canReceiveRecords(unidadeAtiva), true);
assert.strictEqual(canReceiveRecords(unidadeInativa), false);
console.log('  Bloqueio de unidade inativa: impede novos documentos e tarefas');

// Teste 6: Bloqueio de exclusão com pendências
const docs = [
  { id: 'd1', centroId: 'cd-1', validade: pastDate }, // Expirado
];
const tarefas = [
  { id: 't1', centroId: 'cd-1', status: 'Pendente' },
];

const delResultBlocked = canDeleteCentro(unidadeAtiva, docs, tarefas);
assert.strictEqual(delResultBlocked.allowed, false);
console.log('  Bloqueio de exclusão de unidade: bloqueia com mensagem explicativa');

const delResultOk = canDeleteCentro(unidadeAtiva, [], []);
assert.strictEqual(delResultOk.allowed, true);
console.log('  Exclusão permitida para unidade sem pendências');

console.log('\n🎉 TODOS OS TESTES UNITÁRIOS DAS REGRAS DE NEGÓCIO PASSARAM COM SUCESSO!\n');
