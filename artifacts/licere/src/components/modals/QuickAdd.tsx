import React from 'react';
import { ChevronRight, ClipboardCheck, FileCheck2, ShieldCheck, X } from 'lucide-react';

export function QuickAdd({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (kind: 'licenca' | 'condicionante' | 'documento') => void;
}) {
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <section className="quick-modal animate-fade">
        <div className="drawer-head">
          <div>
            <p className="eyebrow">Ação rápida</p>
            <h2>O que você quer registrar?</h2>
            <span>Escolha o registro que entra no radar.</span>
          </div>
          <button
            aria-label="fechar adicionar"
            onClick={onClose}
            className="icon-btn"
          >
            <X size={18} />
          </button>
        </div>

        <div className="quick-options">
          <button
            onClick={() => {
              onCreate('licenca');
              onClose();
            }}
            data-testid="button-quick-licenca"
          >
            <span className="quick-option-icon green">
              <ShieldCheck size={20} />
            </span>
            <span>
              <b>Nova licença</b>
              <small>Cadastre um ato autorizativo</small>
            </span>
            <ChevronRight size={16} />
          </button>

          <button
            onClick={() => {
              onCreate('condicionante');
              onClose();
            }}
            data-testid="button-quick-condicionante"
          >
            <span className="quick-option-icon sand">
              <ClipboardCheck size={20} />
            </span>
            <span>
              <b>Nova condicionante</b>
              <small>Adicione uma obrigação para acompanhar</small>
            </span>
            <ChevronRight size={16} />
          </button>

          <button
            onClick={() => {
              onCreate('documento');
              onClose();
            }}
            data-testid="button-quick-documento"
          >
            <span className="quick-option-icon dark">
              <FileCheck2 size={20} />
            </span>
            <span>
              <b>Novo documento</b>
              <small>Vincule uma evidência operacional</small>
            </span>
            <ChevronRight size={16} />
          </button>
        </div>
      </section>
    </div>
  );
}
