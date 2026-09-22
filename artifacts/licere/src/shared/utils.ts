import { Status } from './types';

export function getDocumentStatus(validade: string): Status {
  if (!validade || validade === 'Indeterminada' || validade === 'Permanente') return 'Vigente';
  
  const [y, m, d] = validade.split('-');
  if (!y || !m || !d) return 'Vigente';
  
  const expDate = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (expDate < today) {
    return 'Expirada';
  }
  
  const diffTime = expDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  
  if (diffDays <= 15) {
    return 'A vencer';
  }
  
  return 'Vigente';
}

export function formatDateBr(value: string): string {
  if (!value || value === 'Indeterminada' || value === 'Permanente') return value;
  const [y, m, d] = value.split('-');
  if (!y || !m || !d) return value;
  
  const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  const monthName = months[parseInt(m) - 1];
  
  return `${d} ${monthName} ${y}`;
}
