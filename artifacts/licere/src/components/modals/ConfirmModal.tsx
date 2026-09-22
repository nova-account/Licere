import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  open,
  title,
  description,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
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
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="modal-backdrop animate-fade"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
      style={{ zIndex: 1000 }}
    >
      <div
        className="quick-modal animate-rise"
        style={{ maxWidth: '420px', width: '100%' }}
      >
        <div className="drawer-head" style={{ borderBottom: '1px solid #edf1ee' }}>
          <div>
            <h2 style={{ fontSize: '16px', margin: 0 }}>{title}</h2>
          </div>
          <button className="icon-btn" onClick={onCancel} aria-label="Cancelar">
            <X size={18} />
          </button>
        </div>

        <div className="drawer-content" style={{ padding: '24px', fontSize: '14px', color: '#445b50', lineHeight: 1.5 }}>
          {description}
        </div>

        <div
          className="drawer-foot"
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            padding: '14px 24px',
            borderTop: '1px solid #edf1ee',
            background: '#fbfcfb',
          }}
        >
          <button
            type="button"
            className="secondary-btn"
            style={{ height: '36px', padding: '0 16px' }}
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="primary-btn"
            style={{ height: '36px', padding: '0 16px' }}
            onClick={onConfirm}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
