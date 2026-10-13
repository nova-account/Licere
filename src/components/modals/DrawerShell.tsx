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
      className="fixed inset-0 z-[60] flex justify-end bg-foreground/20 bg-darkreader/20"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <section className=" flex flex-col h-full w-full max-w-[460px] bg-card  border-l border-border rounded-l-[24px] shadow-card animate-fade" aria-label="detalhes">
        <div className="flex justify-between gap-5 pt-7 px-[26px] pb-[22px] border-b border-border">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground ">{eyebrow}</p>
            <h2 className='text-xl font-semibold  text-secondary-foreground'>{title}</h2>
            <span className='text-[12px] font-semibold text-muted-foreground'>{subtitle}</span>
          </div>
          <button
            aria-label="fechar detalhes"
            onClick={onClose}
            className="flex size-9 items-center justify-center rounded-lg border-2 border-border bg-transparent text-muted-foreground transition-colors hover:bg-muted"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-[22px] px-[18px] md:px-[26px]">{children}</div>

        <div className="flex justify-end gap-[9px] border-t border-border py-[17px] px-[18px] " >
          {onSave && (
            <button
              className="inline-flex items-center justify-center h-10 px-4 gap-2 bg-primary text-primary-foreground text-xs font-semibold  rounded-lg  transition-all duration-150 
              hover:-translate-y-[2px] hover:bg-primary/90"
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
    <button className="mb-2 flex w-full items-center justify-between gap-3 rounded-sm border border-border bg-primary/6 px-[14px] py-[10px] transition-all duration-200 hover:bg-primary/20" onClick={onClick}>
      <span  className=' text-secondary-foreground text-xs font-semibold'>{label}</span>
      <ChevronRight size={14} />
    </button>
  );
}
