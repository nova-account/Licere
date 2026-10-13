import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-[7px] whitespace-nowrap rounded-[11px] text-xs font-semibold transition-[transform,background,color,border-color] duration-150 active:scale-[0.985] select-none cursor-pointer disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'h-[38px] px-[15px] border border-[#176044] bg-[#176044] text-white shadow-[0_5px_12px_rgba(32,95,67,0.12)] hover:bg-[#104c35] hover:-translate-y-0.5',
        secondary:
          'h-[33px] px-4 py-2.5 border border-[#dce9df] rounded-[10px] text-[#1b6848] bg-[#fbfcfc] hover:bg-[#e9f1ee] hover:-translate-y-[1px] text-[11px]',
        quiet:
          'min-h-[32px] px-2.5 border border-[#d8e5dc] rounded-[9px] text-[#648273] bg-[#f8fbf8] hover:text-[#175f42] hover:bg-[#e8f0ed]',
        filter:
          'h-[37px] px-2.5 border border-[#d8e5dc] rounded-[9px] text-[#648273] bg-[#f8fbf8] hover:text-[#175f42] hover:bg-[#e8f0ed] text-[11px]',
        quickAdd:
          'h-[35px] px-[13px] border border-[#176044] bg-[#176044] text-white shadow-[0_5px_12px_rgba(32,95,67,0.12)] hover:bg-[#104c35] hover:-translate-y-0.5 max-[760px]:w-[35px] max-[760px]:p-0 max-[760px]:text-[0px]',
        destructive:
          'h-[38px] px-[15px] border border-destructive bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm',
      },
      size: {
        default: '',
        sm: 'h-8 px-2.5 text-[11px] rounded-lg',
        lg: 'h-10 px-5 text-sm rounded-xl',
        icon: 'h-8 w-8 p-0 rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
