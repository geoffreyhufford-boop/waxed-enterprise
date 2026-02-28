'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { channelRevenueData } from '@/lib/dashboard-data'
import { useTheme } from '@/lib/theme-context'
import { getChartPalette } from '@/lib/chart-theme'
import PinButton from '../PinButton'

export default function AnalyticsRevenueByChannel() {
  const { theme } = useTheme()
  const c = getChartPalette(theme)

  return (
    <div className="relative bg-waxe-card border border-waxe-border p-5 flex flex-col h-[360px] clip-card-bl">
      <PinButton widgetId="analytics-revenue-by-channel" />
      <div className="mb-2 flex items-center gap-2">
        <h3 className="text-[11px] font-semibold text-waxe-text">Revenue by Channel</h3>
        <span className="text-[11px] text-waxe-cool font-medium">→</span>
        <p className="text-[11px] text-waxe-text-muted">Discogs · Storefront · In-store POS</p>
        <span className="hatch-inline flex-1 mr-10" style={{ width: 'auto' }} />
      </div>
      <div className="hatch-divider mb-3" />
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={channelRevenueData}>
            <defs>
              <linearGradient id="widgetDiscogsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={c.channels.discogs} stopOpacity={0.3} />
                <stop offset="95%" stopColor={c.channels.discogs} stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="widgetStorefrontGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={c.channels.storefront} stopOpacity={0.3} />
                <stop offset="95%" stopColor={c.channels.storefront} stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="widgetPosGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={c.channels.pos} stopOpacity={0.3} />
                <stop offset="95%" stopColor={c.channels.pos} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={c.grid} />
            <XAxis dataKey="month" tick={{ fill: c.axisLabel, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: c.axisLabel, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip {...c.tooltip} formatter={(value) => [`$${Number(value).toLocaleString()}`, '']} />
            <Legend iconType="plainline" wrapperStyle={{ fontSize: '10px', fontFamily: 'var(--font-mono)', paddingTop: '8px' }} />
            <Area type="monotone" dataKey="discogs" stackId="1" stroke={c.channels.discogs} fill="url(#widgetDiscogsGrad)" strokeWidth={2} name="Discogs" />
            <Area type="monotone" dataKey="storefront" stackId="1" stroke={c.channels.storefront} fill="url(#widgetStorefrontGrad)" strokeWidth={2} name="Storefront" />
            <Area type="monotone" dataKey="pos" stackId="1" stroke={c.channels.pos} fill="url(#widgetPosGrad)" strokeWidth={2} name="POS" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
