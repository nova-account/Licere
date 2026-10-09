import React from 'react';
import { ArrowDownRight, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricProps {
  label: string;
  value: string;
  detail?: string;
  icon: typeof ShieldCheck;
  tone?: 'default' | 'primary' | 'destructive' | 'warning';
  trend?: 'up' | 'down';
}

const toneStyles: Record<string, string> = {
  default: 'border-border',
  primary: 'border-primary/50 bg-primary/5',
  destructive: 'border-destructive/50 bg-destructive/5',
  warning: 'border-amber-500/50 bg-amber-500/5',
};

export function Metric({
  label,
  value,
  detail,
  icon: MetricIcon,
  tone = 'default',
  trend,
}: MetricProps) {
  return (
    <div
      className={cn(
        'bg-card text-card-foreground border rounded-[14px] p-5 shadow-sm min-h-[132px] flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md',
        toneStyles[tone] || toneStyles.default
      )}
    >
      <div className="flex items-center justify-between text-sm text-muted-foreground font-medium">
        <span>{label}</span>
        <MetricIcon size={18} className="text-muted-foreground" />
      </div>

      <strong className="text-2xl font-bold text-foreground tracking-tight">
        {value}
      </strong>

      {detail && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          {trend && (
            trend === 'down' ? (
              <ArrowDownRight size={14} className="text-destructive" />
            ) : (
              <ArrowUpRight size={14} className="text-primary" />
            )
          )}
          <span>{detail}</span>
        </div>
      )}
    </div>
  );
}