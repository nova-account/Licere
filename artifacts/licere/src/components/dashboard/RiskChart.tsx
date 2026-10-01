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
    <div className="chart-card">
      <div className="card-heading">
        <div>
          <p className="eyebrow">Jan — Dez 2025</p>
          <h2>Mapa de vencimentos</h2>
        </div>
        <span className="chart-period">2025</span>
      </div>
      <div className="chart-legend">
        <span>
          <i className="legend-dot critical" />
          Alto risco
        </span>
        <span>
          <i className="legend-dot attention" />
          Atenção
        </span>
        <span className="chart-note">18 itens monitorados</span>
      </div>
      
      <div className="chart-wrap" style={{ height: '250px', width: '100%', paddingTop: '10px' }}>
        <ChartContainer config={chartConfig} className="h-full w-full">
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
                  <div
                    style={{
                      background: '#ffffff',
                      border: '1px solid rgba(16, 42, 34, 0.12)',
                      borderRadius: '8px',
                      padding: '8px 14px',
                      boxShadow: '0 4px 14px rgba(0, 0, 0, 0.08)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      gap: '4px',
                      minWidth: '120px',
                    }}
                  >
                    <span style={{ fontSize: '11px', color: '#688275', fontWeight: 600 }}>
                      {label}
                    </span>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        width: '100%',
                      }}
                    >
                      <span
                        style={{
                          width: '7px',
                          height: '7px',
                          borderRadius: '50%',
                          background: '#164e3f',
                          display: 'inline-block',
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ fontSize: '12px', color: '#243029', fontWeight: 500 }}>
                        Vencimentos:
                      </span>
                      <strong
                        style={{
                          fontSize: '13px',
                          color: '#164e3f',
                          fontWeight: 700,
                          fontFamily: 'var(--app-font-mono, monospace)',
                        }}
                      >
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

      <div className="chart-callout">
        <span className="callout-dot" />
        <div>
          <b>Outubro concentra o maior risco</b>
          <small>4 licenças e 6 condicionantes vencem no período</small>
        </div>
      </div>
    </div>
  );
}
