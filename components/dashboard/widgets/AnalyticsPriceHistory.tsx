'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { priceHistoryData, priceIntelSummary } from '@/lib/dashboard-data'
import { useTheme } from '@/lib/theme-context'
import { getChartPalette } from '@/lib/chart-theme'
import PinButton from '../PinButton'

export default function AnalyticsPriceHistory() {
  const { theme } = useTheme()
  const c = getChartPalette(theme)

  return (
    <div className="relative bg-waxe-card border border-waxe-border p-5 flex flex-col h-[360px] clip-card-bl">
      <PinButton widgetId="analytics-price-history" />
      <div className="flex items-center justify-between mb-2 shrink-0">
        <div className="flex items-center gap-2">
          <h2 className="text-[11px] font-semibold text-waxe-text">Price History</h2>
          <span className="text-[11px] text-waxe-cool font-medium">→</span>
          <p className="text-[11px] text-waxe-text-muted">12-month trend</p>
          <span className="hatch-inline ml-1" />
        </div>
        <div className="text-right mr-11">
          <p className="text-2xl font-semibold text-waxe-text leading-none">$78</p>
          <div className="flex items-center gap-1.5 justify-end mt-0.5">
            <span className="glyph-box-sm">▲</span>
            <p className="text-[11px] text-waxe-positive font-medium">+$16 avg vs start</p>
          </div>
        </div>
      </div>
      <div className="hatch-divider-strong mb-3 shrink-0" />
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={priceHistoryData}>
            <defs>
              <linearGradient id="widgetStoreAvgGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={c.primary} stopOpacity={0.4} />
                <stop offset="95%" stopColor={c.primary} stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="widgetDiscogsAvgGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={c.channels.discogs} stopOpacity={0.3} />
                <stop offset="95%" stopColor={c.channels.discogs} stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="widgetSuggestedAvgGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={c.quaternary} stopOpacity={0.3} />
                <stop offset="95%" stopColor={c.quaternary} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={c.grid} />
            <XAxis dataKey="month" tick={{ fill: c.axisLabel, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: c.axisLabel, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} domain={['dataMin - 5', 'dataMax + 5']} />
            <Tooltip {...c.tooltip} formatter={(value) => [`$${Number(value)}`, '']} />
            <Legend iconType="plainline" wrapperStyle={{ fontSize: '10px', fontFamily: 'var(--font-mono)', paddingTop: '8px' }} />
            <Area type="monotone" dataKey="storeAvg" stroke={c.primary} fill="url(#widgetStoreAvgGrad)" strokeWidth={2.5} name="Your Store" />
            <Area type="monotone" dataKey="discogsAvg" stroke={c.channels.discogs} fill="url(#widgetDiscogsAvgGrad)" strokeWidth={2} name="Discogs Median" />
            <Area type="monotone" dataKey="suggestedAvg" stroke={c.quaternary} fill="url(#widgetSuggestedAvgGrad)" strokeWidth={2} name="Suggested" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {/* Key metrics */}
      <div className="shrink-0 grid grid-cols-3 gap-3 mt-3 pt-3 border-t border-waxe-border/30">
        {priceIntelSummary.map((metric) => (
          <div key={metric.label} className="text-center">
            <p className={`text-sm font-semibold font-mono ${metric.positive ? 'text-waxe-positive' : 'text-waxe-warm'}`}>{metric.value}</p>
            <p className="text-[9px] text-waxe-text-muted">{metric.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
