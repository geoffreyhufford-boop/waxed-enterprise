'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { priceVsMarketData } from '@/lib/dashboard-data'
import PinButton from '../PinButton'

const chartTooltipStyle = {
  contentStyle: { background: '#EEE9DF', border: '2px solid #2C3B4D', borderRadius: '0', fontSize: '10px', fontFamily: 'var(--font-mono)' },
  labelStyle: { color: '#4A5B6D', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', fontSize: '9px' },
  itemStyle: { color: '#1B2632', fontFamily: 'var(--font-mono)' },
}

export default function AnalyticsPriceVsMarket() {
  return (
    <div className="relative bg-waxe-card border-2 border-waxe-border rounded-none p-5 flex flex-col h-[360px]">
      <PinButton widgetId="analytics-price-vs-market" />
      <div className="mb-4 flex items-baseline gap-2">
        <h3 className="text-[11px] font-black text-waxe-text uppercase tracking-[0.1em]">Your Price vs. Market</h3>
        <span className="text-[10px] text-waxe-cool font-bold">{'>>'}</span>
        <p className="text-[10px] text-waxe-text-muted uppercase tracking-[0.1em]">Active listings compared to Discogs median</p>
      </div>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={priceVsMarketData} layout="vertical" barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(44,59,77,0.15)" horizontal={false} />
            <XAxis type="number" tick={{ fill: '#4A5B6D', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
            <YAxis type="category" dataKey="artist" tick={{ fill: '#4A5B6D', fontSize: 9 }} axisLine={false} tickLine={false} width={90} />
            <Tooltip {...chartTooltipStyle} formatter={(value) => [`$${value}`, '']} />
            <Legend iconType="plainline" wrapperStyle={{ fontSize: '10px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.05em', paddingTop: '8px' }} />
            <Bar dataKey="yourPrice" fill="#1B2632" barSize={6} name="Your Price" radius={[0, 2, 2, 0]} />
            <Bar dataKey="discogsMedian" fill="#FFB162" barSize={6} name="Discogs Median" radius={[0, 2, 2, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
