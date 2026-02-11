'use client'

import { useState, useRef } from 'react'
import { AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { DashboardHeader, StatCard, ChartCard, StatusBadge, DataTable } from '@/components/dashboard'
import {
  revenueData, genreDemandData, priceTrendData, restockRecommendations,
  genreBreakdowns, conditionBreakdowns, velocityData
} from '@/lib/dashboard-data'

const chartTooltipStyle = {
  contentStyle: { background: '#EEE9DF', border: '2px solid #2C3B4D', borderRadius: '0', fontSize: '10px', fontFamily: 'var(--font-mono)' },
  labelStyle: { color: '#4A5B6D', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', fontSize: '9px' },
  itemStyle: { color: '#1B2632', fontFamily: 'var(--font-mono)' },
}

export default function AnalyticsPage() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activePanel, setActivePanel] = useState(0)
  const panelCount = 3

  const handleScroll = () => {
    if (!scrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    const maxScroll = scrollWidth - clientWidth
    if (maxScroll <= 0) return
    setActivePanel(Math.round((scrollLeft / maxScroll) * (panelCount - 1)))
  }

  const scrollToPanel = (i: number) => {
    const panels = scrollRef.current?.querySelectorAll(':scope > .snap-start')
    if (panels?.[i]) panels[i].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' })
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <DashboardHeader
        title="Analytics"
        subtitle="Performance insights and market intelligence"
        actions={
          <div className="flex gap-2">
            <button className="btn-ghost text-sm">Export</button>
            <button className="btn-secondary text-sm px-4 py-2">Last 7 Months</button>
          </div>
        }
      />

      {/* Stats Row */}
      <div className="shrink-0 grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <StatCard label="Revenue (MTD)" value="$14,230" trend="+18%" trendUp={true} />
        <StatCard label="Orders" value="186" trend="+23%" trendUp={true} />
        <StatCard label="Avg Order Value" value="$76.50" trend="+$4.20" trendUp={true} />
        <StatCard label="Return Rate" value="1.2%" trend="-0.3%" trendUp={true} />
      </div>

      {/* Horizontal swipe panels */}
      <div ref={scrollRef} onScroll={handleScroll} className="flex-1 min-h-0 overflow-x-auto overflow-y-hidden snap-x snap-mandatory flex gap-4 -mr-5 lg:-mr-6 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>

        {/* ── Panel 1: Performance ── */}
        <div className="snap-start shrink-0 w-[92%] grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
          {/* Charts — left 2/3 */}
          <div className="lg:col-span-2 grid grid-rows-2 gap-4 min-h-0">
            <ChartCard title="Revenue" subtitle="Last 7 months" className="min-h-0 flex flex-col [&>div:last-child]:flex-1 [&>div:last-child]:min-h-0">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A35139" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#A35139" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(44,59,77,0.12)" />
                <XAxis dataKey="month" tick={{ fill: '#4A5B6D', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#4A5B6D', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip {...chartTooltipStyle} formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']} />
                <Area type="monotone" dataKey="revenue" stroke="#A35139" fill="url(#revenueGradient)" strokeWidth={2.5} />
              </AreaChart>
            </ChartCard>

            <ChartCard title="Orders" subtitle="Monthly order volume" className="min-h-0 flex flex-col [&>div:last-child]:flex-1 [&>div:last-child]:min-h-0">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(44,59,77,0.15)" />
                <XAxis dataKey="month" tick={{ fill: '#4A5B6D', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#4A5B6D', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip {...chartTooltipStyle} />
                <Bar dataKey="orders" fill="#1B2632" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ChartCard>
          </div>

          {/* Breakdowns — right 1/3 */}
          <div className="flex flex-col gap-4 min-h-0">
            <div className="flex-1 min-h-0 bg-waxe-card border-2 border-waxe-border rounded-none flex flex-col">
              <h3 className="shrink-0 px-5 pt-5 pb-3 text-[11px] font-black text-waxe-text uppercase tracking-[0.1em]">Genre <span className="text-waxe-cool">{'>>'}</span> Breakdown</h3>
              <div className="flex-1 min-h-0 overflow-y-auto px-5 pb-5 space-y-3">
                {genreBreakdowns.map((g) => (
                  <div key={g.genre} className="flex items-center gap-2">
                    <span className="text-xs text-waxe-text w-20 shrink-0 truncate">{g.genre}</span>
                    <div className="flex-1 h-2 bg-waxe-surface rounded-full overflow-hidden">
                      <div className="h-full bg-waxe-warm rounded-full" style={{ width: `${g.percentage}%` }} />
                    </div>
                    <span className="text-xs text-waxe-text-muted w-8 shrink-0 text-right font-mono">{g.count}</span>
                    <span className="text-xs text-waxe-text-muted w-10 shrink-0 text-right font-mono">{g.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 min-h-0 bg-waxe-card border-2 border-waxe-border rounded-none flex flex-col">
              <h3 className="shrink-0 px-5 pt-5 pb-3 text-[11px] font-black text-waxe-text uppercase tracking-[0.1em]">Condition <span className="text-waxe-cool">{'>>'}</span> Distribution</h3>
              <div className="flex-1 min-h-0 overflow-y-auto px-5 pb-5 space-y-3">
                {conditionBreakdowns.map((c) => (
                  <div key={c.condition} className="flex items-center gap-2">
                    <span className="text-xs text-waxe-text w-24 shrink-0 truncate">{c.condition}</span>
                    <div className="flex-1 h-2 bg-waxe-surface rounded-full overflow-hidden">
                      <div className="h-full bg-waxe-text rounded-full" style={{ width: `${c.percentage}%` }} />
                    </div>
                    <span className="text-xs text-waxe-text-muted w-8 shrink-0 text-right font-mono">{c.count}</span>
                    <span className="text-xs text-waxe-text-muted w-10 shrink-0 text-right font-mono">{c.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Panel 2: Market Trends ── */}
        <div className="snap-start shrink-0 w-[92%] flex flex-col gap-4 min-h-0">
          <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Genre Demand" subtitle="Search & purchase interest by genre" className="min-h-0 flex flex-col [&>div:last-child]:flex-1 [&>div:last-child]:min-h-0">
              <LineChart data={genreDemandData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(44,59,77,0.15)" />
                <XAxis dataKey="month" tick={{ fill: '#4A5B6D', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#4A5B6D', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip {...chartTooltipStyle} />
                <Legend iconType="plainline" wrapperStyle={{ fontSize: '10px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.05em', paddingTop: '8px' }} />
                <Line type="monotone" dataKey="techno" stroke="#1B2632" strokeWidth={2} dot={false} name="Techno" />
                <Line type="monotone" dataKey="house" stroke="#2C3B4D" strokeWidth={2} dot={false} name="House" />
                <Line type="monotone" dataKey="ambient" stroke="#A35139" strokeWidth={2} dot={false} name="Ambient" />
                <Line type="monotone" dataKey="electro" stroke="#FFB162" strokeWidth={2} dot={false} name="Electro" />
                <Line type="monotone" dataKey="breakbeat" stroke="#C9C1B1" strokeWidth={2} dot={false} name="Breakbeat" />
              </LineChart>
            </ChartCard>

            <ChartCard title="Price Trends" subtitle="Average sale price by condition" className="min-h-0 flex flex-col [&>div:last-child]:flex-1 [&>div:last-child]:min-h-0">
              <LineChart data={priceTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(44,59,77,0.15)" />
                <XAxis dataKey="month" tick={{ fill: '#4A5B6D', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#4A5B6D', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip {...chartTooltipStyle} formatter={(value) => [`$${value}`, '']} />
                <Legend iconType="plainline" wrapperStyle={{ fontSize: '10px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.05em', paddingTop: '8px' }} />
                <Line type="monotone" dataKey="c10" stroke="#1B2632" strokeWidth={2} dot={false} name="10 — Sealed" />
                <Line type="monotone" dataKey="c9" stroke="#2C3B4D" strokeWidth={2} dot={false} name="9 — Pristine" />
                <Line type="monotone" dataKey="c7" stroke="#A35139" strokeWidth={2} dot={false} name="7 — Very Good" />
                <Line type="monotone" dataKey="c5" stroke="#C9C1B1" strokeWidth={2} dot={false} name="5 — Fair" />
              </LineChart>
            </ChartCard>
          </div>

        </div>

        {/* ── Panel 3: Restocking ── */}
        <div className="snap-start shrink-0 w-[92%] flex flex-col gap-4 min-h-0">
          <div className="shrink-0">
            <ChartCard title="Inventory Velocity" subtitle="Items sold vs. added per week">
              <BarChart data={velocityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(44,59,77,0.15)" />
                <XAxis dataKey="week" tick={{ fill: '#4A5B6D', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#4A5B6D', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip {...chartTooltipStyle} />
                <Bar dataKey="sold" fill="#FFB162" radius={[2, 2, 0, 0]} name="Sold" />
                <Bar dataKey="added" fill="#1B2632" radius={[2, 2, 0, 0]} name="Added" />
              </BarChart>
            </ChartCard>
          </div>

          <div className="flex-1 min-h-0">
            <DataTable headers={['Record', 'Genre', 'Demand Score', 'Avg Sale Price', 'Last Sold', 'Velocity']} maxHeight="100%">
              {restockRecommendations.map((rec, i) => (
                <tr key={i} className="table-row hover:bg-waxe-surface/30 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-waxe-text">{rec.artist}</p>
                      <p className="text-xs text-waxe-text-muted">{rec.title}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-waxe-text-secondary">{rec.genre}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1.5 bg-waxe-surface rounded-full overflow-hidden">
                        <div className="h-full bg-waxe-warm rounded-full" style={{ width: `${rec.demandScore}%` }} />
                      </div>
                      <span className="text-sm font-medium text-waxe-text font-mono w-6 text-right">{rec.demandScore}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-waxe-text-secondary font-mono">${rec.avgSalePrice}</td>
                  <td className="px-4 py-3 text-xs text-waxe-text-muted">{rec.lastSold}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={rec.velocity} />
                  </td>
                </tr>
              ))}
            </DataTable>
          </div>
        </div>

        {/* Spacer so last panel can fully snap */}
        <div className="shrink-0 w-[8%]" />

      </div>

    </div>
  )
}
