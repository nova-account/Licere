import React from 'react';
import type { Status } from '@/shared/types';

export function StatusPill({ status }: { status: Status | string }) {
  const tone =
    status === 'Regular' ||
    status === 'Vigente' ||
    status === 'Concluída' ||
    status === 'Operando'
      ? 'good'
      : status === 'A vencer'
        ? 'orange'
        : status === 'Em análise' ||
          status === 'Em expansão' ||
          status === 'Em andamento'
        ? 'warn'
        : 'bad';

  return (
    <span className={`pill pill-${tone}`}>
      <i aria-hidden="true" />
      {status}
    </span>
  );
}
