'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts'
import { daysOnShelfData } from '@/lib/dashboard-data'
import PinButton from '../PinButton'

const chartTooltipStyle = {
  contentStyle: { background: '#EEE9DF', border: '2px solid #2C3B4D', borderRadius: '0', fontSize: '10px', fontFamily: 'var(--font-mono)' },
  labelStyle: { color: '#4A5B6D', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', fontSize: '9px' },
  itemStyle: { color: '#1B2632', fontFamily: 'var(--font-mono)' },
}

export default function AnalyticsDaysOnShelf() {
  return (
    <div className="relative bg-waxe-card border-2 border-waxe-border rounded-none p-5 flex flex-col h-[360px]">
      <PinButton widgetId="analytics-days-on-shelf" />
      <div className="mb-4 flex items-baseline gap-2">
        <h3 className="text-[11px] font-black text-waxe-text uppercase tracking-[0.1em]">Days on Shelf</h3>
        <span className="text-[10px] text-waxe-cool font-bold">{'>>'}</span>
        <p className="text-[10px] text-waxe-text-muted uppercase tracking-[0.1em]">How long inventory sits before selling</p>
      </div>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={daysOnShelfData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(44,59,77,0.15)" />
            <XAxis dataKey="range" tick={{ fill: '#4A5B6D', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#4A5B6D', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip {...chartTooltipStyle} formatter={(value, name) => [name === 'count' ? `${value} items` : `$${Number(value).toLocaleString()}`, name === 'count' ? 'Items' : 'Value']} />
            <Bar dataKey="count" radius={[2, 2, 0, 0]}>
              {daysOnShelfData.map((_, index) => (
                <Cell key={index} fill={index >= 4 ? '#A35139' : index >= 3 ? '#C9C1B1' : '#1B2632'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
