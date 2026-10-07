import React from 'react';
import { ArrowDownRight, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Metric({
  label,
  value,
  detail,
  icon: MetricIcon,
  tone = 'default',
  trend,
}: {
  label: string;
  value: string;
  detail: string;
  icon: typeof ShieldCheck;
  tone?: string;
  trend?: 'up' | 'down';
}) {
  return (
    <div className={cn('metric-card', `metric-${tone}`)}>
      <div className="metric-top">
        <span>{label}</span>
        <MetricIcon size={18} />
      </div>
      <strong>{value}</strong>
      <div className="metric-detail">
        {trend &&
          (trend === 'down' ? (
            <ArrowDownRight size={14} />
          ) : (
            <ArrowUpRight size={14} />
          ))}
        <span>{detail}</span>
      </div>
    </div>
  );
}
