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
  React.useEffect(() => {
    document.body.classList.add('drawer-open');
    return () => {
      document.body.classList.remove('drawer-open');
    };
  }, []);

  return (
    <div
      className="drawer-backdrop"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <section className="detail-drawer animate-fade" aria-label="detalhes">
        <div className="drawer-head">
          <div className="min-w-0 flex-1">
            <p className="eyebrow">{eyebrow}</p>
            <h2 className="break-words">{title}</h2>
            <span className="truncate block">{subtitle}</span>
          </div>
          <button
            aria-label="fechar detalhes"
            onClick={onClose}
            className="icon-btn shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        <div className="drawer-content">{children}</div>

        {onSave && (
          <div className="drawer-foot flex justify-end">
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
          </div>
        )}
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
