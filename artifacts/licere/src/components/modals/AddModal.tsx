import React, { useEffect } from 'react';
import { X, Save } from 'lucide-react';

export function AddModal({
  title,
  open,
  onClose,
}: {
  title: string;
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-backdrop animate-fade">
      <div className="quick-modal animate-rise">
        <div className="drawer-head">
          <h2>{title}</h2>
          <button className="icon-btn" onClick={onClose} aria-label="fechar modal">
            <X size={18} />
          </button>
        </div>
        <div className="drawer-content" style={{ padding: '24px' }}>
          <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '13px', margin: '0 0 20px 0' }}>
            Preencha os dados abaixo para cadastrar. Esta é uma visualização de demonstração.
          </p>
          <label className="field-label" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'hsl(var(--muted-foreground))', textTransform: 'uppercase' }}>Título ou Nome</span>
            <input type="text" placeholder="Ex: Relatório Anual" style={{ height: '40px', padding: '0 12px', border: '1px solid hsl(var(--border))', borderRadius: '8px', width: '100%' }} />
          </label>
          <label className="field-label" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'hsl(var(--muted-foreground))', textTransform: 'uppercase' }}>Data Limite</span>
            <input type="date" style={{ height: '40px', padding: '0 12px', border: '1px solid hsl(var(--border))', borderRadius: '8px', width: '100%' }} />
          </label>
        </div>
        <div className="drawer-foot" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', padding: '16px 24px', borderTop: '1px solid hsl(var(--border))', background: 'hsl(var(--muted))' }}>
          <button className="secondary-btn" onClick={onClose} style={{ height: '38px', padding: '0 16px' }}>Cancelar</button>
          <button className="primary-btn" onClick={onClose} style={{ height: '38px', padding: '0 16px' }}>
            <Save size={16} /> Salvar cadastro
          </button>
        </div>
      </div>
    </div>
  );
}
