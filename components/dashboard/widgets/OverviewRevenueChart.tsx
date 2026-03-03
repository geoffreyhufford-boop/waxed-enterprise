'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { revenueData } from '@/lib/dashboard-data'
import { useTheme } from '@/lib/theme-context'
import { getChartPalette } from '@/lib/chart-theme'
import { useDashboardFilters } from '@/lib/dashboard-filter-context'
import PinButton from '../PinButton'

export default function OverviewRevenueChart() {
  const { theme } = useTheme()
  const c = getChartPalette(theme)
  const { dateRange } = useDashboardFilters()

  return (
    <div className="relative bg-waxe-card border border-waxe-border p-5 flex flex-col h-[360px] clip-card-bl">
      <PinButton widgetId="overview-revenue-chart" />
      <div className="flex items-center justify-between mb-2 shrink-0">
        <div className="flex items-center gap-2">
          <h2 className="text-[11px] font-semibold text-waxe-text">Revenue</h2>
          <span className="text-[11px] text-waxe-cool font-medium">→</span>
          <p className="text-[11px] text-waxe-text-muted">{dateRange}</p>
          <span className="hatch-inline ml-1" />
        </div>
        <div className="text-right mr-11">
          <p className="text-2xl font-semibold text-waxe-text leading-none">$14,230</p>
          <div className="flex items-center gap-1.5 justify-end mt-0.5">
            <span className="glyph-box-sm">▲</span>
            <p className="text-[11px] text-waxe-positive font-medium">+18% vs last month</p>
          </div>
        </div>
      </div>
      <div className="hatch-divider-strong mb-3 shrink-0" />
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient id="widgetOverviewRevenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={c.primary} stopOpacity={0.4} />
                <stop offset="95%" stopColor={c.primary} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={c.grid} />
            <XAxis dataKey="month" tick={{ fill: c.axisLabel, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: c.axisLabel, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip {...c.tooltip} formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']} />
            <Area type="monotone" dataKey="revenue" stroke={c.primary} fill="url(#widgetOverviewRevenueGrad)" strokeWidth={2.5} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
