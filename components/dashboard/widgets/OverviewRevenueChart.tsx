'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { revenueData } from '@/lib/dashboard-data'
import PinButton from '../PinButton'

const chartTooltipStyle = {
  contentStyle: { background: '#EEE9DF', border: '2px solid #2C3B4D', borderRadius: '0', fontSize: '10px', fontFamily: 'var(--font-mono)' },
  labelStyle: { color: '#4A5B6D', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', fontSize: '9px' },
  itemStyle: { color: '#1B2632', fontFamily: 'var(--font-mono)' },
}

export default function OverviewRevenueChart() {
  return (
    <div className="relative bg-waxe-card border-2 border-waxe-border rounded-none p-5 flex flex-col h-[360px]">
      <PinButton widgetId="overview-revenue-chart" />
      <div className="flex items-center justify-between mb-3 shrink-0">
        <div className="flex items-baseline gap-2">
          <h2 className="text-[11px] font-black text-waxe-text uppercase tracking-[0.1em]">Revenue</h2>
          <span className="text-[10px] text-waxe-cool font-bold">{'>>'}</span>
          <p className="text-[10px] text-waxe-text-muted uppercase tracking-[0.1em]">Last 7 months</p>
        </div>
        <div className="text-right mr-11">
          <p className="text-2xl font-black text-waxe-text tracking-tight leading-none">$14,230</p>
          <p className="text-[10px] text-waxe-positive font-bold uppercase tracking-[0.1em]">{'>> '}+18% vs last month</p>
        </div>
      </div>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient id="widgetOverviewRevenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FFB162" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#FFB162" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(44,59,77,0.15)" />
            <XAxis dataKey="month" tick={{ fill: '#4A5B6D', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#4A5B6D', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip {...chartTooltipStyle} formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']} />
            <Area type="monotone" dataKey="revenue" stroke="#FFB162" fill="url(#widgetOverviewRevenueGrad)" strokeWidth={2.5} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
