import React from 'react';
import {
  Building2,
  ChevronRight,
  ClipboardCheck,
  FileCheck2,
  ShieldCheck,
  X,
} from 'lucide-react';

export type QuickActionType = 'tarefa' | 'documento' | 'licenca' | 'unidade';

export function QuickAdd({
  onClose,
  onSelectAction,
}: {
  onClose: () => void;
  onSelectAction: (kind: QuickActionType) => void;
}) {
  return (
    <div
      className="modal-backdrop animate-fade"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <section className="quick-modal animate-rise">
        <div className="drawer-head">
          <div>
            <p className="eyebrow">Ação rápida</p>
            <h2>O que você quer registrar?</h2>
            <span>Escolha o registro que entra no radar operacional.</span>
          </div>
          <button
            aria-label="fechar ação rápida"
            onClick={onClose}
            className="icon-btn"
          >
            <X size={18} />
          </button>
        </div>

        <div className="quick-options">
          {/* Nova Tarefa */}
          <button
            type="button"
            onClick={() => onSelectAction('tarefa')}
            data-testid="button-quick-tarefa"
          >
            <span className="quick-option-icon sand">
              <ClipboardCheck size={20} />
            </span>
            <span>
              <b>Nova tarefa</b>
              <small>Adicione uma obrigação para acompanhamento</small>
            </span>
            <ChevronRight size={16} />
          </button>

          {/* Novo Documento */}
          <button
            type="button"
            onClick={() => onSelectAction('documento')}
            data-testid="button-quick-documento"
          >
            <span className="quick-option-icon blue">
              <FileCheck2 size={20} />
            </span>
            <span>
              <b>Novo documento</b>
              <small>Vincule uma evidência ou laudo operacional</small>
            </span>
            <ChevronRight size={16} />
          </button>

          {/* Nova Licença */}
          <button
            type="button"
            onClick={() => onSelectAction('licenca')}
            data-testid="button-quick-licenca"
          >
            <span className="quick-option-icon green">
              <ShieldCheck size={20} />
            </span>
            <span>
              <b>Nova licença</b>
              <small>Cadastre um ato autorizativo ambiental</small>
            </span>
            <ChevronRight size={16} />
          </button>

          {/* Nova Unidade */}
          <button
            type="button"
            onClick={() => onSelectAction('unidade')}
            data-testid="button-quick-unidade"
          >
            <span className="quick-option-icon forest">
              <Building2 size={20} />
            </span>
            <span>
              <b>Nova unidade</b>
              <small>Cadastre um centro de distribuição ou filial</small>
            </span>
            <ChevronRight size={16} />
          </button>
        </div>
      </section>
    </div>
  );
}
