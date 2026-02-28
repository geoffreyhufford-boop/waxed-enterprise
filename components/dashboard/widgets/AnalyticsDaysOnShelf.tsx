'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts'
import { daysOnShelfData } from '@/lib/dashboard-data'
import { useTheme } from '@/lib/theme-context'
import { getChartPalette } from '@/lib/chart-theme'
import PinButton from '../PinButton'

export default function AnalyticsDaysOnShelf() {
  const { theme } = useTheme()
  const c = getChartPalette(theme)

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
            <CartesianGrid strokeDasharray="3 3" stroke={c.grid} />
            <XAxis dataKey="range" tick={{ fill: c.axisLabel, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: c.axisLabel, fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip {...c.tooltip} formatter={(value, name) => [name === 'count' ? `${value} items` : `$${Number(value).toLocaleString()}`, name === 'count' ? 'Items' : 'Value']} />
            <Bar dataKey="count" radius={[2, 2, 0, 0]}>
              {daysOnShelfData.map((_, index) => (
                <Cell key={index} fill={index >= 4 ? c.tertiary : index >= 3 ? c.muted : c.secondary} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
