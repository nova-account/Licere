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
      className="modal-backdrop animate-fade z-[1000]"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div
        className="quick-modal animate-rise max-w-[420px] w-full"
      >
        <div className="drawer-head border-b border-[#edf1ee]">
          <div>
            <h2 className="text-[16px] m-0">{title}</h2>
          </div>
          <button className="icon-btn" onClick={onCancel} aria-label="Cancelar">
            <X size={18} />
          </button>
        </div>

        <div className="drawer-content p-6 text-[14px] text-[#445b50] leading-[1.5]">
          {description}
        </div>

        <div
          className="drawer-foot flex justify-end gap-3 py-3.5 px-6 border-t border-[#edf1ee] bg-[#fbfcfb]"
        >
          <button
            type="button"
            className="secondary-btn h-[36px] px-4"
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="primary-btn h-[36px] px-4"
            onClick={onConfirm}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
