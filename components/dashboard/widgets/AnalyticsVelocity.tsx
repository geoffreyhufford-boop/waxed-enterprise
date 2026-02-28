'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { velocityData } from '@/lib/dashboard-data'
import { useTheme } from '@/lib/theme-context'
import { getChartPalette } from '@/lib/chart-theme'
import PinButton from '../PinButton'

export default function AnalyticsVelocity() {
  const { theme } = useTheme()
  const c = getChartPalette(theme)

  return (
    <div className="relative bg-waxe-card border border-waxe-border p-5 flex flex-col h-[360px] clip-card-bl">
      <PinButton widgetId="analytics-velocity" />
      <div className="mb-2 flex items-center gap-2">
        <h3 className="text-[11px] font-semibold text-waxe-text">Inventory Velocity</h3>
        <span className="text-[11px] text-waxe-cool font-medium">→</span>
        <p className="text-[11px] text-waxe-text-muted">Items sold vs. added per week</p>
        <span className="hatch-inline flex-1 mr-10" style={{ width: 'auto' }} />
      </div>
      <div className="hatch-divider mb-3" />
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={velocityData}>
            <CartesianGrid strokeDasharray="3 3" stroke={c.grid} />
            <XAxis dataKey="week" tick={{ fill: c.axisLabel, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: c.axisLabel, fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip {...c.tooltip} />
            <Bar dataKey="sold" fill={c.primary} radius={[2, 2, 0, 0]} name="Sold" />
            <Bar dataKey="added" fill={c.secondary} radius={[2, 2, 0, 0]} name="Added" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
