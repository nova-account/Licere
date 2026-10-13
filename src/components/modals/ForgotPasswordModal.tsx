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
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="modal-backdrop animate-fade"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="quick-modal animate-rise max-w-[420px] w-full">
        <div className="drawer-head">
          <h2>Esqueceu a senha?</h2>
          <button className="icon-btn" onClick={onClose} aria-label="fechar modal">
            <X size={18} />
          </button>
        </div>
        <div className="drawer-content p-6">
          <p className="text-muted-foreground text-[14px] m-0 mb-6 leading-[1.5]">
            Informe o e-mail associado à sua conta. Enviaremos instruções para redefinir sua senha.
          </p>
          <label className="flex flex-col gap-2 text-[#365b4c] text-[11px] font-bold tracking-[0.02em]">
            <span>E-mail corporativo</span>
            <input
              type="email"
              placeholder="nome@empresa.com.br"
              className="w-full h-[47px] box-border px-3.5 border border-[#d5e2e4] rounded-[11px] outline-none text-[#244d3b] bg-[#f4f8f8] text-[13px] placeholder:text-[#9aa9ac] transition-[border-color,background-color,box-shadow] duration-150 focus:border-[#61937d] focus:bg-[#fbfcfc] focus:shadow-[0_0_0_4px_rgba(73,142,96,0.11)]"
            />
          </label>
        </div>
        <div className="drawer-foot flex justify-end gap-3 py-4 px-6 border-t border-border bg-background">
          <button className="secondary-btn h-[40px] px-4" onClick={onClose}>Cancelar</button>
          <button className="primary-btn h-[40px] px-4" onClick={onClose}>
            <Send size={16} /> Enviar link
          </button>
        </div>
      </div>
    </div>
  );
}
