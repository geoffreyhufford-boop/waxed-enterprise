'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts'
import { daysOnShelfData } from '@/lib/dashboard-data'
import PinButton from '../PinButton'

const chartTooltipStyle = {
  contentStyle: { background: '#141020', border: '1px solid #2D2540', borderRadius: '12px', fontSize: '10px', fontFamily: 'var(--font-mono)' },
  labelStyle: { color: '#5A4D70', fontWeight: 500, fontSize: '9px' },
  itemStyle: { color: '#E8E0D8', fontFamily: 'var(--font-mono)' },
}

export default function AnalyticsDaysOnShelf() {
  return (
    <div className="relative bg-waxe-card border border-waxe-border p-5 flex flex-col h-[360px] clip-card-bl">
      <PinButton widgetId="analytics-days-on-shelf" />
      <div className="mb-2 flex items-center gap-2">
        <h3 className="text-[11px] font-semibold text-waxe-text">Days on Shelf</h3>
        <span className="text-[11px] text-waxe-cool font-medium">→</span>
        <p className="text-[11px] text-waxe-text-muted">How long inventory sits before selling</p>
        <span className="hatch-inline flex-1 mr-10" style={{ width: 'auto' }} />
      </div>
      <div className="hatch-divider mb-3" />
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={daysOnShelfData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(238,233,223,0.08)" />
            <XAxis dataKey="range" tick={{ fill: '#5A4D70', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#5A4D70', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip {...chartTooltipStyle} formatter={(value, name) => [name === 'count' ? `${value} items` : `$${Number(value).toLocaleString()}`, name === 'count' ? 'Items' : 'Value']} />
            <Bar dataKey="count" radius={[2, 2, 0, 0]}>
              {daysOnShelfData.map((_, index) => (
                <Cell key={index} fill={index >= 4 ? '#7B6FA0' : index >= 3 ? '#C0B8D0' : '#2D2540'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
