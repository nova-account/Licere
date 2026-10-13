export function getDocumentStatus(validade: string): 'Válido' | 'Próximo do vencimento' | 'Expirado' {
  if (!validade) return 'Expirado';
  if (validade === 'Indeterminada' || validade === 'Permanente') return 'Válido';

  const [y, m, d] = validade.split('-');
  if (!y || !m || !d) return 'Expirado';

  const expDate = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
  if (isNaN(expDate.getTime())) return 'Expirado';

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

export function formatDate(value: string): string {
  if (!value || value === 'Indeterminada' || value === 'Permanente') return value || '';
  const [y, m, d] = value.split('-');
  if (!d) return value;
  return `${d}/${m}/${y}`;
}

export function formatDateBr(value: string): string {
  if (!value || value === 'Indeterminada' || value === 'Permanente') return value || '';
  const [y, m, d] = value.split('-');
  if (!d) return value;

  const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  const monthName = months[parseInt(m) - 1];
  if (!monthName) return value;

  return `${d} ${monthName} ${y}`;
}

export function getCenterName(
  id: string,
  centros: Array<{ id?: string; nome?: string }>,
  fallback?: string
): string {
  return centros.find((c) => c.id === id)?.nome ?? fallback ?? id;
}

export function getLicenseNumber(
  id: string,
  licencas: Array<{ id?: string; numero?: string }>,
  fallback = 'Licença não localizada'
): string {
  return licencas.find((l) => l.id === id)?.numero ?? fallback;
}

export const centerName = getCenterName;
export const licenseName = getLicenseNumber;

