'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { marginData } from '@/lib/dashboard-data'
import PinButton from '../PinButton'

const chartTooltipStyle = {
  contentStyle: { background: '#141020', border: '1px solid #2D2540', borderRadius: '12px', fontSize: '10px', fontFamily: 'var(--font-mono)' },
  labelStyle: { color: '#5A4D70', fontWeight: 500, fontSize: '9px' },
  itemStyle: { color: '#E8E0D8', fontFamily: 'var(--font-mono)' },
}

export default function AnalyticsMarginTrend() {
  return (
    <div className="relative bg-waxe-card border border-waxe-border p-5 flex flex-col h-[360px] clip-card-bl">
      <PinButton widgetId="analytics-margin-trend" />
      <div className="mb-2 flex items-center gap-2">
        <h3 className="text-[11px] font-semibold text-waxe-text">Margin Trend</h3>
        <span className="text-[11px] text-waxe-cool font-medium">→</span>
        <p className="text-[11px] text-waxe-text-muted">Revenue vs. cost of goods</p>
        <span className="hatch-inline flex-1 mr-10" style={{ width: 'auto' }} />
      </div>
      <div className="hatch-divider mb-3" />
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={marginData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(238,233,223,0.08)" />
            <XAxis dataKey="month" tick={{ fill: '#5A4D70', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#5A4D70', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip {...chartTooltipStyle} formatter={(value, name) => [`$${Number(value).toLocaleString()}`, name === 'margin' ? 'Margin' : name === 'cost' ? 'COGS' : String(name)]} />
            <Bar dataKey="cost" stackId="1" fill="#5A4D70" name="COGS" radius={[0, 0, 0, 0]} />
            <Bar dataKey="margin" stackId="1" fill="#E8837C" name="Margin" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
