import React, { useEffect } from 'react';
import { X, Send } from 'lucide-react';

export function ForgotPasswordModal({
  open,
  onClose,
}: {
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
      <div className="quick-modal animate-rise" style={{ maxWidth: '420px', width: '100%' }}>
        <div className="drawer-head">
          <h2>Esqueceu a senha?</h2>
          <button className="icon-btn" onClick={onClose} aria-label="fechar modal">
            <X size={18} />
          </button>
        </div>
        <div className="drawer-content" style={{ padding: '24px' }}>
          <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '14px', margin: '0 0 24px 0', lineHeight: 1.5 }}>
            Informe o e-mail associado à sua conta. Enviaremos instruções para redefinir sua senha.
          </p>
          <label className="field-label" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'hsl(var(--muted-foreground))', textTransform: 'uppercase' }}>E-mail corporativo</span>
            <input type="email" placeholder="nome@empresa.com.br" style={{ height: '44px', padding: '0 12px', border: '1px solid hsl(var(--border))', borderRadius: '8px', width: '100%', fontSize: '14px' }} />
          </label>
        </div>
        <div className="drawer-foot" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', padding: '16px 24px', borderTop: '1px solid hsl(var(--border))', background: 'hsl(var(--background))' }}>
          <button className="secondary-btn" onClick={onClose} style={{ height: '40px', padding: '0 16px' }}>Cancelar</button>
          <button className="primary-btn" onClick={onClose} style={{ height: '40px', padding: '0 16px' }}>
            <Send size={16} /> Enviar link
          </button>
        </div>
      </div>
    </div>
  );
}
