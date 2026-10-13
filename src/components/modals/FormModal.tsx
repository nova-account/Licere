import React, { useEffect, forwardRef } from 'react';
import { X, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// ── Form Modal Shell ──────────────────────────────────────────────
export interface FormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (e?: any) => void | Promise<void>;
  title: string;
  eyebrow: string;
  icon: React.ReactNode;
  submitLabel: string;
  submitIcon?: React.ReactNode;
  maxWidth?: string;
  children: React.ReactNode;
}

export function FormModal({
  open,
  onClose,
  onSubmit,
  title,
  eyebrow,
  icon,
  submitLabel,
  submitIcon = <Save size={15} />,
  maxWidth = '540px',
  children,
}: FormModalProps) {
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

  const maxWidthClass =
    maxWidth === '520px'
      ? 'max-w-[520px]'
      : maxWidth === '560px'
      ? 'max-w-[560px]'
      : maxWidth === '500px'
      ? 'max-w-[500px]'
      : maxWidth === '580px'
      ? 'max-w-[580px]'
      : 'max-w-[540px]';

  return (
    <div
      className="modal-backdrop animate-fade"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={cn('quick-modal animate-rise w-full', maxWidthClass)}
      >
        <div className="drawer-head">
          <div className="flex items-center gap-2.5">
            <span
              className="document-icon size-8 rounded-[8px] bg-[#245b45]/10 text-[#245b45] flex items-center justify-center shrink-0"
            >
              {icon}
            </span>
            <div>
              <p className="eyebrow">{eyebrow}</p>
              <h2 className="text-[17px] m-0">{title}</h2>
            </div>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Fechar" type="button">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit} noValidate>
          <div
            className="drawer-content py-5 px-6 flex flex-col gap-4 max-h-[calc(85vh-130px)] overflow-y-auto"
          >
            {children}
          </div>

          <div
            className="drawer-foot flex justify-end gap-2.5 py-3.5 px-6 border-t border-[#edf1ee] bg-[#fbfcfb]"
          >
            <button
              type="button"
              className="secondary-btn h-[38px] px-[18px]"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="primary-btn h-[38px] px-[18px]"
            >
              {submitIcon} {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Form Field Wrapper ────────────────────────────────────────────
export interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: React.ReactNode;
}

export function FormField({
  label,
  required,
  error,
  className,
  children,
}: FormFieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5 min-w-0 w-full', className)}>
      <span className="text-[11px] font-bold text-[#4e6b5c] tracking-normal truncate">
        {label} {required && <span className="text-[#e53e3e]">*</span>}
      </span>
      {children}
      {error && <span className="text-[#e53e3e] text-[11px] mt-0.5">{error}</span>}
    </div>
  );
}

// ── Form Input ────────────────────────────────────────────────────
export interface FormInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'w-full h-[38px] px-3 rounded-[10px] border text-[12px] font-medium outline-none text-[#2c4e3f] bg-white transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)] placeholder:text-[#9aa9ac]',
          'focus:border-[#70a48a] focus:ring-3 focus:ring-[#317d56]/15',
          error ? 'border-[#e53e3e] bg-[#fffbfb]' : 'border-[#d9e3e6]',
          className
        )}
        {...props}
      />
    );
  }
);
FormInput.displayName = 'FormInput';

// ── Form Textarea ─────────────────────────────────────────────────
export interface FormTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ className, error, rows = 2, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        rows={rows}
        className={cn(
          'w-full p-2.5 rounded-[10px] border text-[12px] font-medium outline-none text-[#2c4e3f] bg-white resize-y transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)] placeholder:text-[#9aa9ac]',
          'focus:border-[#70a48a] focus:ring-3 focus:ring-[#317d56]/15',
          error ? 'border-[#e53e3e] bg-[#fffbfb]' : 'border-[#d9e3e6]',
          className
        )}
        {...props}
      />
    );
  }
);
FormTextarea.displayName = 'FormTextarea';

// ── Form Select (Custom Selector UI with strictly matched width) ──
export interface FormSelectOption {
  value: string;
  label: string;
}

export interface FormSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: FormSelectOption[];
  placeholder?: string;
  error?: boolean;
  disabled?: boolean;
  className?: string;
}

export function FormSelect({
  value,
  onValueChange,
  options,
  placeholder,
  error,
  disabled,
  className,
}: FormSelectProps) {
  const safeValue = value === '' ? '__none__' : value;

  return (
    <Select
      value={safeValue}
      onValueChange={(val) => onValueChange(val === '__none__' ? '' : val)}
      disabled={disabled}
    >
      <SelectTrigger
        className={cn(
          'w-full h-[38px] px-3 rounded-[10px] border text-[12px] font-medium text-[#2c4e3f] bg-white transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)] outline-none cursor-pointer hover:bg-[#f4f7f6]',
          'focus:border-[#70a48a] focus:ring-3 focus:ring-[#317d56]/15',
          error ? 'border-[#e53e3e] bg-[#fffbfb]' : 'border-[#d9e3e6]',
          className
        )}
      >
        <div className="flex items-center min-w-0 flex-1 truncate text-left">
          <SelectValue placeholder={placeholder} />
        </div>
      </SelectTrigger>
      <SelectContent
        position="popper"
        sideOffset={4}
        className="w-[var(--radix-select-trigger-width)] max-w-[var(--radix-select-trigger-width)] min-w-[var(--radix-select-trigger-width)] rounded-[10px] border border-[#d9e3e6] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.08)] p-1 z-[150]"
      >
        {options.map((opt) => {
          const itemValue = opt.value === '' ? '__none__' : opt.value;
          return (
            <SelectItem
              key={itemValue}
              value={itemValue}
              className="text-[12px] font-medium text-[#2c4e3f] rounded-[6px] py-1.5 px-2.5 focus:bg-[#f4f7f6] focus:text-[#183e30] cursor-pointer"
            >
              <span className="truncate block">{opt.label}</span>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
