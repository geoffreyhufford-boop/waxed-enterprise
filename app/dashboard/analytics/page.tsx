'use client'

import { useState, useRef } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts'
import { DashboardHeader, StatCard, ChartCard, StatusBadge, DataTable, PinButton } from '@/components/dashboard'
import {
  channelRevenueData, marginData, genreBreakdowns,
  daysOnShelfData, priceVsMarketData, deadStockSummary, conditionBreakdowns,
  velocityData, restockRecommendations, missedSearches
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
        subtitle="Sales performance, inventory health, and restocking intelligence"
        actions={
          <div className="flex gap-2 items-center">
            <button className="btn-ghost text-sm">Export</button>
            <button className="btn-secondary text-sm px-4 py-2">Last 7 Months</button>
          </div>
        }
      />

      {/* Stats Row */}
      <div className="shrink-0 grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <StatCard label="Revenue (MTD)" value="$14,230" trend="+18%" trendUp={true} />
        <StatCard label="Margin" value="46%" trend="+1%" trendUp={true} />
        <StatCard label="Avg Order Value" value="$76.50" trend="+$4.20" trendUp={true} />
        <StatCard label="Sell-through" value="6.5%" trend="+0.8%" trendUp={true} />
      </div>

      {/* Panel tabs — directly above panels */}
      <div className="shrink-0 flex gap-1.5 pb-3 mb-3 w-fit border-b-2 border-waxe-border pr-4">
        {['Sales', 'Inventory', 'Restock'].map((label, i) => (
          <button
            key={label}
            onClick={() => scrollToPanel(i)}
            className={`text-[9px] font-bold uppercase tracking-[0.1em] px-3 py-1.5 border-2 ${
              activePanel === i
                ? 'bg-waxe-text text-waxe-deep border-waxe-text'
                : 'text-waxe-text-muted border-waxe-border hover:text-waxe-text'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Horizontal swipe panels */}
      <div ref={scrollRef} onScroll={handleScroll} className="flex-1 min-h-0 overflow-x-auto overflow-y-hidden snap-x snap-mandatory flex gap-4 -mr-5 lg:-mr-6 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>

        {/* ── Panel 1: Sales Performance ── */}
        <div className="snap-start shrink-0 w-[92%] grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
          {/* Charts — left 2/3 */}
          <div className="lg:col-span-2 grid grid-rows-2 gap-4 min-h-0">
            <ChartCard title="Revenue by Channel" subtitle="Discogs · Storefront · In-store POS" action={<PinButton widgetId="analytics-revenue-by-channel" />} className="min-h-0 flex flex-col [&>div:last-child]:flex-1 [&>div:last-child]:min-h-0">
              {(() => {
                // Use unique gradient IDs to avoid SVG conflicts
                return (
                  <BarChart data={channelRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(44,59,77,0.12)" />
                    <XAxis dataKey="month" tick={{ fill: '#4A5B6D', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#4A5B6D', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip {...chartTooltipStyle} formatter={(value) => [`$${Number(value).toLocaleString()}`, '']} />
                    <Legend iconType="plainline" wrapperStyle={{ fontSize: '10px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.05em', paddingTop: '8px' }} />
                    <Bar dataKey="discogs" fill="#1B2632" name="Discogs" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="storefront" fill="#A35139" name="Storefront" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="pos" fill="#FFB162" name="POS" radius={[2, 2, 0, 0]} />
                  </BarChart>
                )
              })()}
            </ChartCard>

            <ChartCard title="Margin Trend" subtitle="Revenue vs. cost of goods" action={<PinButton widgetId="analytics-margin-trend" />} className="min-h-0 flex flex-col [&>div:last-child]:flex-1 [&>div:last-child]:min-h-0">
              <BarChart data={marginData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(44,59,77,0.15)" />
                <XAxis dataKey="month" tick={{ fill: '#4A5B6D', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#4A5B6D', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip {...chartTooltipStyle} formatter={(value, name) => [`$${Number(value).toLocaleString()}`, name === 'margin' ? 'Margin' : name === 'cost' ? 'COGS' : String(name)]} />
                <Bar dataKey="cost" stackId="1" fill="#2C3B4D" name="COGS" radius={[0, 0, 0, 0]} />
                <Bar dataKey="margin" stackId="1" fill="#FFB162" name="Margin" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ChartCard>
          </div>

          {/* Sidebar — Genre breakdown */}
          <div className="flex flex-col gap-4 min-h-0">
            <div className="relative flex-1 min-h-0 bg-waxe-card border-2 border-waxe-border rounded-none flex flex-col">
              <PinButton widgetId="analytics-revenue-by-genre" />
              <h3 className="shrink-0 px-5 pt-5 pb-3 text-[11px] font-black text-waxe-text uppercase tracking-[0.1em]">Revenue <span className="text-waxe-cool">{'>>'}</span> By Genre</h3>
              <div className="flex-1 min-h-0 overflow-y-auto px-5 pb-5 space-y-3">
                {genreBreakdowns.map((g) => (
                  <div key={g.genre}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-waxe-text truncate">{g.genre}</span>
                      <span className="text-xs text-waxe-text font-mono font-medium">${g.revenue.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-waxe-surface overflow-hidden">
                        <div className="h-full bg-waxe-warm" style={{ width: `${g.percentage}%` }} />
                      </div>
                      <span className="text-[10px] text-waxe-text-muted w-10 shrink-0 text-right font-mono">{g.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Channel split summary */}
            <div className="relative shrink-0 bg-waxe-card border-2 border-waxe-border rounded-none p-5">
              <PinButton widgetId="analytics-channel-split" />
              <h3 className="text-[11px] font-black text-waxe-text uppercase tracking-[0.1em] mb-4">Channel <span className="text-waxe-cool">{'>>'}</span> Split</h3>
              <div className="space-y-3">
                {[
                  { name: 'Discogs', pct: 43, color: '#1B2632' },
                  { name: 'Storefront', pct: 33, color: '#A35139' },
                  { name: 'In-store', pct: 24, color: '#FFB162' },
                ].map((ch) => (
                  <div key={ch.name} className="flex items-center gap-2">
                    <div className="w-2 h-2 shrink-0" style={{ backgroundColor: ch.color }} />
                    <span className="text-xs text-waxe-text flex-1">{ch.name}</span>
                    <span className="text-xs text-waxe-text font-mono font-bold">{ch.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Panel 2: Inventory Health ── */}
        <div className="snap-start shrink-0 w-[92%] grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
          {/* Charts — left 2/3 */}
          <div className="lg:col-span-2 grid grid-rows-2 gap-4 min-h-0">
            <ChartCard title="Days on Shelf" subtitle="How long inventory sits before selling" action={<PinButton widgetId="analytics-days-on-shelf" />} className="min-h-0 flex flex-col [&>div:last-child]:flex-1 [&>div:last-child]:min-h-0">
              <BarChart data={daysOnShelfData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(44,59,77,0.15)" />
                <XAxis dataKey="range" tick={{ fill: '#4A5B6D', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#4A5B6D', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip {...chartTooltipStyle} formatter={(value, name) => [name === 'count' ? `${value} items` : `$${Number(value).toLocaleString()}`, name === 'count' ? 'Items' : 'Value']} />
                <Bar dataKey="count" radius={[2, 2, 0, 0]}>
                  {daysOnShelfData.map((entry, index) => (
                    <Cell key={index} fill={index >= 4 ? '#A35139' : index >= 3 ? '#C9C1B1' : '#1B2632'} />
                  ))}
                </Bar>
              </BarChart>
            </ChartCard>

            <ChartCard title="Your Price vs. Market" subtitle="Active listings compared to Discogs median" action={<PinButton widgetId="analytics-price-vs-market" />} className="min-h-0 flex flex-col [&>div:last-child]:flex-1 [&>div:last-child]:min-h-0">
              <BarChart data={priceVsMarketData} layout="vertical" barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(44,59,77,0.15)" horizontal={false} />
                <XAxis type="number" tick={{ fill: '#4A5B6D', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                <YAxis type="category" dataKey="artist" tick={{ fill: '#4A5B6D', fontSize: 9 }} axisLine={false} tickLine={false} width={90} />
                <Tooltip {...chartTooltipStyle} formatter={(value) => [`$${value}`, '']} />
                <Legend iconType="plainline" wrapperStyle={{ fontSize: '10px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.05em', paddingTop: '8px' }} />
                <Bar dataKey="yourPrice" fill="#1B2632" barSize={6} name="Your Price" radius={[0, 2, 2, 0]} />
                <Bar dataKey="discogsMedian" fill="#FFB162" barSize={6} name="Discogs Median" radius={[0, 2, 2, 0]} />
              </BarChart>
            </ChartCard>
          </div>

          {/* Sidebar — Dead stock + condition */}
          <div className="flex flex-col gap-4 min-h-0">
            {/* Dead stock alert */}
            <div className="relative shrink-0 bg-waxe-card border-2 border-waxe-border rounded-none p-5">
              <PinButton widgetId="analytics-dead-stock" />
              <div className="mb-4">
                <h3 className="text-[11px] font-black text-waxe-text uppercase tracking-[0.1em]">Dead Stock <span className="text-waxe-cool">{'>>'}</span> 90+ Days</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-waxe-text-muted uppercase tracking-wider">Items</span>
                  <span className="text-2xl font-semibold text-waxe-negative font-mono">{deadStockSummary.totalItems}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-waxe-text-muted uppercase tracking-wider">Capital Tied Up</span>
                  <span className="text-lg font-semibold text-waxe-text font-mono">${deadStockSummary.totalValue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-waxe-text-muted uppercase tracking-wider">Avg Days Listed</span>
                  <span className="text-sm font-medium text-waxe-text font-mono">{deadStockSummary.avgDaysListed}d</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-waxe-text-muted uppercase tracking-wider">Top Genre</span>
                  <span className="text-sm font-medium text-waxe-text">{deadStockSummary.topGenre}</span>
                </div>
              </div>
            </div>

            {/* Condition distribution */}
            <div className="relative flex-1 min-h-0 bg-waxe-card border-2 border-waxe-border rounded-none flex flex-col">
              <PinButton widgetId="analytics-condition" />
              <h3 className="shrink-0 px-5 pt-5 pb-3 text-[11px] font-black text-waxe-text uppercase tracking-[0.1em]">Condition <span className="text-waxe-cool">{'>>'}</span> Distribution</h3>
              <div className="flex-1 min-h-0 overflow-y-auto px-5 pb-5 space-y-3">
                {conditionBreakdowns.map((c) => (
                  <div key={c.condition}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-waxe-text truncate">{c.condition}</span>
                      <span className="text-xs text-waxe-text-muted font-mono">{c.count}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-waxe-surface overflow-hidden">
                        <div className="h-full bg-waxe-text" style={{ width: `${c.percentage}%` }} />
                      </div>
                      <span className="text-[10px] text-waxe-text-muted w-10 shrink-0 text-right font-mono">{c.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Panel 3: Restocking Intelligence ── */}
        <div className="snap-start shrink-0 w-[92%] grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
          <div className="lg:col-span-2 flex flex-col gap-4 min-h-0">
            <div className="shrink-0">
              <ChartCard title="Inventory Velocity" subtitle="Items sold vs. added per week" action={<PinButton widgetId="analytics-velocity" />}>
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

            <div className="relative flex-1 min-h-0">
              <PinButton widgetId="analytics-restock-table" />
              <DataTable headers={['Record', 'Genre', 'Demand', 'Avg Price', 'Last Sold', 'Velocity']} maxHeight="100%">
                {restockRecommendations.map((rec, i) => (
                  <tr key={i} className="table-row hover:bg-waxe-surface/30">
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-waxe-text">{rec.artist}</p>
                        <p className="text-xs text-waxe-text-muted">{rec.title}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-waxe-text-secondary">{rec.genre}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1.5 bg-waxe-surface overflow-hidden">
                          <div className="h-full bg-waxe-warm" style={{ width: `${rec.demandScore}%` }} />
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

          {/* Sidebar — Missed searches */}
          <div className="flex flex-col gap-4 min-h-0">
            <div className="relative flex-1 min-h-0 bg-waxe-card border-2 border-waxe-border rounded-none flex flex-col">
              <PinButton widgetId="analytics-missed-searches" />
              <div className="shrink-0 px-5 pt-5 pb-1">
                <h3 className="text-[11px] font-black text-waxe-text uppercase tracking-[0.1em]">Missed <span className="text-waxe-cool">{'>>'}</span> Searches</h3>
              </div>
              <p className="shrink-0 px-5 pb-3 text-[10px] text-waxe-text-muted">What buyers searched for that you don&apos;t carry</p>
              <div className="flex-1 min-h-0 overflow-y-auto px-5 pb-5 space-y-3">
                {missedSearches.map((s) => (
                  <div key={s.query} className="flex items-start justify-between gap-2 py-1.5 border-b border-waxe-border/30 last:border-0">
                    <div className="min-w-0">
                      <p className="text-xs text-waxe-text font-medium truncate">{s.query}</p>
                      <p className="text-[10px] text-waxe-text-muted">{s.lastSearched}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-bold text-waxe-warm font-mono">{s.searchCount}</p>
                      <p className="text-[9px] text-waxe-text-muted uppercase">searches</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Spacer so last panel can fully snap */}
        <div className="shrink-0 w-[8%]" />

      </div>

    </div>
  )
}
