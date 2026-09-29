import React from 'react';
import { Check, ChevronRight, X } from 'lucide-react';

export function DrawerShell({
  title,
  subtitle,
  eyebrow,
  onClose,
  onSave,
  children,
}: {
  title: string;
  subtitle: string;
  eyebrow: string;
  onClose: () => void;
  onSave?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className="drawer-backdrop"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <section className="detail-drawer animate-fade" aria-label="detalhes">
        <div className="drawer-head">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h2>{title}</h2>
            <span>{subtitle}</span>
          </div>
          <button
            aria-label="fechar detalhes"
            onClick={onClose}
            className="icon-btn"
          >
            <X size={18} />
          </button>
        </div>

        <div className="drawer-content">{children}</div>

        <div className="drawer-foot" style={{ display: 'flex', justifyContent: 'flex-end' }}>
          {onSave && (
            <button
              className="primary-btn"
              onClick={() => {
                onSave();
                onClose();
              }}
            >
              <Check size={16} />
              Salvar alterações
            </button>
          )}
        </div>
      </section>
    </div>
  );
}

export function RelationshipLink({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button className="relationship-link" onClick={onClick}>
      <span>{label}</span>
      <ChevronRight size={14} />
    </button>
  );
}
