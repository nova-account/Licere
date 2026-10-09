'use client';

import React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart"

const chartData = [
  { month: "Jan", items: 8 },
  { month: "Fev", items: 11 },
  { month: "Mar", items: 9 },
  { month: "Abr", items: 16 },
  { month: "Mai", items: 13 },
  { month: "Jun", items: 18 },
  { month: "Jul", items: 12 },
  { month: "Ago", items: 22 },
  { month: "Set", items: 17 },
  { month: "Out", items: 26 },
  { month: "Nov", items: 21 },
  { month: "Dez", items: 14 },
];

const chartConfig = {
  items: {
    label: "Vencimentos",
    color: "#164e3f",
  },
} satisfies ChartConfig;

export function RiskChart() {
  return (
    <div className="min-w-0 rounded-[14px] border border-border bg-card p-[21px] text-card-foreground shadow-sm max-[760px]:overflow-hidden max-[760px]:p-[17px]">
      <div className="flex items-start justify-between gap-[15px]">
        <div>
          <p className="eyebrow mb-[6px]">Jan — Dez 2025</p>
          <h2 className="m-0 font-display text-lg font-bold text-primary">
            Mapa de vencimentos
          </h2>
        </div>
        <span className="chart-period">2025</span>
      </div>
      <div className="mt-[19px] flex items-center gap-[15px] text-[10px] text-muted-foreground max-[400px]:gap-2">
        <span>
          <i className="mr-[5px] inline-block size-[7px] rounded-full bg-chart-1" />
          Alto risco
        </span>
        <span>
          <i className="mr-[5px] inline-block size-[7px] rounded-full bg-chart-3" />
          Atenção
        </span>
        <span className="ml-auto font-mono text-[9px] text-muted-foreground max-[400px]:hidden">
          18 itens monitorados
        </span>
      </div>
      
      <div className="mt-[9px] h-[250px] w-full overflow-hidden pt-[10px] max-[760px]:mr-[-4px] max-[760px]:overflow-x-auto">
        <ChartContainer
          config={chartConfig}
          className="h-full w-full [&_.recharts-surface]:block [&_.recharts-surface]:h-[230px] [&_.recharts-surface]:min-w-[490px] [&_.recharts-surface]:w-full max-[1100px]:[&_.recharts-surface]:min-w-0 max-[760px]:[&_.recharts-surface]:h-[210px] max-[760px]:[&_.recharts-surface]:w-[650px]"
        >
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{ left: -20, right: 12, top: 12, bottom: 0 }}
          >
            <defs>
              <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#164e3f" stopOpacity={0.22} />
                <stop offset="100%" stopColor="#164e3f" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#dce3dc" strokeDasharray="3 5" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              tick={{ fill: '#829088', fontSize: 11 }}
            />
            <YAxis 
              tickLine={false} 
              axisLine={false} 
              tickMargin={8} 
              tickCount={4}
              tick={{ fill: '#829088', fontSize: 11 }}
            />
            <ChartTooltip
              cursor={{ stroke: '#829088', strokeWidth: 1, strokeDasharray: '3 3' }}
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                const item = payload[0];
                return (
                  <div className="flex min-w-[120px] flex-col items-center justify-center gap-1 rounded-[8px] border border-border bg-card px-[14px] py-2 text-center text-card-foreground shadow-[0_4px_14px_rgba(0,0,0,0.08)]">
                    <span className="text-[11px] font-semibold text-muted-foreground">
                      {label}
                    </span>
                    <div className="flex w-full items-center justify-center gap-1.5">
                      <span className="inline-block size-[7px] shrink-0 rounded-full bg-primary" />
                      <span className="text-[12px] font-medium text-card-foreground">
                        Vencimentos:
                      </span>
                      <strong className="font-mono text-[13px] font-bold text-primary">
                        {item.value}
                      </strong>
                    </div>
                  </div>
                );
              }}
            />
            <Area
              dataKey="items"
              type="linear"
              fill="url(#areaFill)"
              stroke="#164e3f"
              strokeWidth={3}
              activeDot={{
                r: 6,
                fill: "#d97706",
                stroke: "#d97706",
                strokeWidth: 2,
              }}
              dot={(props: { cx?: number; cy?: number; index?: number }) => {
                const { cx, cy, index } = props;
                // Destaca o mês de Outubro (index 9) como na versão original
                if (index === 9) {
                  return (
                    <circle key={`dot-${index}`} cx={cx} cy={cy} r={5} fill="#d97706" stroke="#d97706" strokeWidth={2} />
                  );
                }
                return (
                  <circle key={`dot-${index}`} cx={cx} cy={cy} r={3.5} fill="#ffffff" stroke="#164e3f" strokeWidth={2} />
                );
              }}
            />
          </AreaChart>
        </ChartContainer>
      </div>

      <div className="mt-0.5 flex items-center gap-2.5 rounded-[10px] bg-primary/10 px-3 py-2.5">
        <span className="size-[7px] shrink-0 rounded-full bg-amber-500" />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <b className="text-[11px] text-primary">Outubro concentra o maior risco</b>
          <small className="text-[10px] text-muted-foreground">
            4 licenças e 6 condicionantes vencem no período
          </small>
        </div>
      </div>
    </div>
  );
}
