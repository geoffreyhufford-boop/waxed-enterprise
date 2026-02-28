'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { priceVsMarketData } from '@/lib/dashboard-data'
import { useTheme } from '@/lib/theme-context'
import { getChartPalette } from '@/lib/chart-theme'
import PinButton from '../PinButton'

export default function AnalyticsPriceVsMarket() {
  const { theme } = useTheme()
  const c = getChartPalette(theme)

  return (
    <div className="relative bg-waxe-card border border-waxe-border p-5 flex flex-col h-[360px] clip-card-bl">
      <PinButton widgetId="analytics-price-vs-market" />
      <div className="mb-2 flex items-center gap-2">
        <h3 className="text-[11px] font-semibold text-waxe-text">Your Price vs. Market</h3>
        <span className="text-[11px] text-waxe-cool font-medium">→</span>
        <p className="text-[11px] text-waxe-text-muted">Active listings compared to Discogs median</p>
        <span className="hatch-inline flex-1 mr-10" style={{ width: 'auto' }} />
      </div>
      <div className="hatch-divider mb-3" />
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={priceVsMarketData} layout="vertical" barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke={c.grid} horizontal={false} />
            <XAxis type="number" tick={{ fill: c.axisLabel, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
            <YAxis type="category" dataKey="artist" tick={{ fill: c.axisLabel, fontSize: 9 }} axisLine={false} tickLine={false} width={90} />
            <Tooltip {...c.tooltip} formatter={(value) => [`$${value}`, '']} />
            <Legend iconType="plainline" wrapperStyle={{ fontSize: '10px', fontFamily: 'var(--font-mono)', paddingTop: '8px' }} />
            <Bar dataKey="yourPrice" fill={c.secondary} barSize={6} name="Your Price" radius={[0, 2, 2, 0]} />
            <Bar dataKey="discogsMedian" fill={c.primary} barSize={6} name="Discogs Median" radius={[0, 2, 2, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
