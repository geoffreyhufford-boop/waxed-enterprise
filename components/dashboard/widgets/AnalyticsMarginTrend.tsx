'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { marginData } from '@/lib/dashboard-data'
import PinButton from '../PinButton'

const chartTooltipStyle = {
  contentStyle: { background: '#EEE9DF', border: '2px solid #2C3B4D', borderRadius: '0', fontSize: '10px', fontFamily: 'var(--font-mono)' },
  labelStyle: { color: '#4A5B6D', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', fontSize: '9px' },
  itemStyle: { color: '#1B2632', fontFamily: 'var(--font-mono)' },
}

export default function AnalyticsMarginTrend() {
  return (
    <div className="relative bg-waxe-card border-2 border-waxe-border rounded-none p-5 flex flex-col h-[360px]">
      <PinButton widgetId="analytics-margin-trend" />
      <div className="mb-4 flex items-baseline gap-2">
        <h3 className="text-[11px] font-black text-waxe-text uppercase tracking-[0.1em]">Margin Trend</h3>
        <span className="text-[10px] text-waxe-cool font-bold">{'>>'}</span>
        <p className="text-[10px] text-waxe-text-muted uppercase tracking-[0.1em]">Revenue vs. cost of goods</p>
      </div>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={marginData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(44,59,77,0.15)" />
            <XAxis dataKey="month" tick={{ fill: '#4A5B6D', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#4A5B6D', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip {...chartTooltipStyle} formatter={(value, name) => [`$${Number(value).toLocaleString()}`, name === 'margin' ? 'Margin' : name === 'cost' ? 'COGS' : String(name)]} />
            <Bar dataKey="cost" stackId="1" fill="#2C3B4D" name="COGS" radius={[0, 0, 0, 0]} />
            <Bar dataKey="margin" stackId="1" fill="#FFB162" name="Margin" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
