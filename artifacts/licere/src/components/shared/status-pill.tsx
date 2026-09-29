import React from 'react';
import type { Status } from '@/shared/types';

export function StatusPill({ status }: { status: Status | string }) {
  const tone =
    status === 'Regular' ||
      status === 'Vigente' ||
      status === 'Concluída' ||
      status === 'Operando'
      ? 'good'
      : status === 'Em análise' ||
        status === 'Em expansão' ||
        status === 'Em andamento'
        ? 'notice'
        : status === 'Pendente'
          ? 'warn'
          : status === 'A vencer'
            ? 'orange'
            : 'bad';

  return (
    <span className={`pill pill-${tone}`} role="status" title={status}>
      <i aria-hidden="true" />
      <span>{status}</span>
    </span>
  );
}
