'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { channelRevenueData } from '@/lib/dashboard-data'
import PinButton from '../PinButton'

const chartTooltipStyle = {
  contentStyle: { background: '#EEE9DF', border: '2px solid #2C3B4D', borderRadius: '0', fontSize: '10px', fontFamily: 'var(--font-mono)' },
  labelStyle: { color: '#4A5B6D', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', fontSize: '9px' },
  itemStyle: { color: '#1B2632', fontFamily: 'var(--font-mono)' },
}

export default function AnalyticsRevenueByChannel() {
  return (
    <div className="relative bg-waxe-card border-2 border-waxe-border rounded-none p-5 flex flex-col h-[360px]">
      <PinButton widgetId="analytics-revenue-by-channel" />
      <div className="mb-4 flex items-baseline gap-2">
        <h3 className="text-[11px] font-black text-waxe-text uppercase tracking-[0.1em]">Revenue by Channel</h3>
        <span className="text-[10px] text-waxe-cool font-bold">{'>>'}</span>
        <p className="text-[10px] text-waxe-text-muted uppercase tracking-[0.1em]">Discogs · Storefront · In-store POS</p>
      </div>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={channelRevenueData}>
            <defs>
              <linearGradient id="widgetDiscogsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1B2632" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#1B2632" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="widgetStorefrontGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#A35139" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#A35139" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="widgetPosGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FFB162" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#FFB162" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(44,59,77,0.12)" />
            <XAxis dataKey="month" tick={{ fill: '#4A5B6D', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#4A5B6D', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip {...chartTooltipStyle} formatter={(value) => [`$${Number(value).toLocaleString()}`, '']} />
            <Legend iconType="plainline" wrapperStyle={{ fontSize: '10px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.05em', paddingTop: '8px' }} />
            <Area type="monotone" dataKey="discogs" stackId="1" stroke="#1B2632" fill="url(#widgetDiscogsGrad)" strokeWidth={2} name="Discogs" />
            <Area type="monotone" dataKey="storefront" stackId="1" stroke="#A35139" fill="url(#widgetStorefrontGrad)" strokeWidth={2} name="Storefront" />
            <Area type="monotone" dataKey="pos" stackId="1" stroke="#FFB162" fill="url(#widgetPosGrad)" strokeWidth={2} name="POS" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
