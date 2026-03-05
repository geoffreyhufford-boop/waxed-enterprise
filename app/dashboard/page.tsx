'use client'

import { useState } from 'react'
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts'
import { DashboardHeader, ChartCard, StatusBadge, DataTable, PinButton, DateRangeSelector, SalesChannelFilter } from '@/components/dashboard'
import { exportToPDF } from '@/lib/export-utils'
import {
 channelRevenueData, marginData, genreBreakdowns,
 daysOnShelfData, priceVsMarketData, deadStockSummary, conditionBreakdowns,
 velocityData, restockRecommendations, missedSearches,
 priceHistoryData, priceIntelSummary, channelFeeStructures,
} from '@/lib/dashboard-data'
import { deadStockItems, wantListItems } from '@/lib/restock-data'
import { DashboardFilterProvider } from '@/lib/dashboard-filter-context'
import { usePinnedWidgets } from '@/lib/use-pinned-widgets'
import { widgetRegistry } from '@/lib/widget-registry'
import {
 DndContext,
 closestCenter,
 PointerSensor,
 useSensor,
 useSensors,
 type DragEndEvent,
} from '@dnd-kit/core'
import {
 SortableContext,
 useSortable,
 rectSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { WidgetDef } from '@/lib/widget-registry'



const chartTooltipStyle = {
 contentStyle: { background: '#141020', border: '1px solid #2D2540', borderRadius: '12px', fontSize: '10px', fontFamily: 'var(--font-mono)' },
 labelStyle: { color: '#5A4D70', fontWeight: 500, fontSize: '9px' },
 itemStyle: { color: '#E8E0D8', fontFamily: 'var(--font-mono)' },
}

function SortableWidget({ widget }: { widget: WidgetDef }) {
 const {
  attributes,
  listeners,
  setNodeRef,
  transform,
  transition,
  isDragging,
 } = useSortable({ id: widget.id })

 const style = {
  transform: CSS.Transform.toString(transform),
  transition,
  opacity: isDragging ? 0.5 : 1,
  zIndex: isDragging ? 50 : undefined,
 }

 return (
  <div
   ref={setNodeRef}
   style={style}
   className={`${widget.size === 'lg' ? 'lg:col-span-2' : ''} cursor-grab active:cursor-grabbing`}
   {...attributes}
   {...listeners}
  >
   {widget.render()}
  </div>
 )
}


export default function AnalyticsPage() {
 const [dateRange, setDateRange] = useState('Last 30 Days')
 const [channel, setChannel] = useState('All Channels')
 const { pinned, reorder } = usePinnedWidgets()

 const widgets = pinned
  .map((id) => widgetRegistry[id])
  .filter(Boolean)

 const sensors = useSensors(
  useSensor(PointerSensor, {
   activationConstraint: { distance: 8 },
  })
 )

 const handleDragEnd = (event: DragEndEvent) => {
  const { active, over } = event
  if (!over || active.id === over.id) return

  const oldIndex = pinned.indexOf(active.id as string)
  const newIndex = pinned.indexOf(over.id as string)
  if (oldIndex === -1 || newIndex === -1) return

  const next = [...pinned]
  next.splice(oldIndex, 1)
  next.splice(newIndex, 0, active.id as string)
  reorder(next)
 }

 return (
  <DashboardFilterProvider dateRange={dateRange} channel={channel}>
  <div className="flex flex-col flex-1 min-h-0">
   <DashboardHeader
    title="Overview"
    subtitle="Sales performance, inventory health, and restocking intelligence"
    actions={
     <div className="flex gap-2 items-center">
      <SalesChannelFilter value={channel} onChange={setChannel} />
      <button className="btn-ghost text-sm" onClick={() => exportToPDF('analytics-content')}>Export</button>
      <DateRangeSelector presets={['Today', 'Last 7 Days', 'Last 30 Days', 'Last 3 Months', 'This Year']} value={dateRange} onChange={setDateRange} showComparison />
     </div>
    }
   />

   <div id="analytics-content" className="flex-1 min-h-0 overflow-y-auto space-y-6 pb-6">

    {/* ── Pinned Widgets ── */}
    {widgets.length > 0 && (
     <section>
      <h2 className="text-[11px] font-medium text-waxe-text-muted mb-3">Pinned Widgets</h2>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
       <SortableContext items={pinned} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
         {widgets.map((w) => (
          <SortableWidget key={w.id} widget={w} />
         ))}
        </div>
       </SortableContext>
      </DndContext>
     </section>
    )}

    {/* ── Sales Performance ── */}
    <section>
     <h2 className="text-[11px] font-medium text-waxe-text-muted mb-3">Sales Performance</h2>
     <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 grid grid-cols-1 gap-4">
       <ChartCard title="Revenue by Channel" subtitle="Discogs · Storefront · In-store POS" action={<PinButton widgetId="analytics-revenue-by-channel" />}>
        {(() => {
         return (
          <BarChart data={channelRevenueData}>
           <CartesianGrid strokeDasharray="3 3" stroke="rgba(44,59,77,0.12)" />
           <XAxis dataKey="month" tick={{ fill: '#6A5D80', fontSize: 11 }} axisLine={false} tickLine={false} />
           <YAxis tick={{ fill: '#6A5D80', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
           <Tooltip {...chartTooltipStyle} formatter={(value) => [`$${Number(value).toLocaleString()}`, '']} />
           <Legend iconType="plainline" wrapperStyle={{ fontSize: '10px', fontFamily: 'var(--font-mono)', paddingTop: '8px' }} />
           <Bar dataKey="discogs" fill="#6A6090" name="Discogs" radius={[2, 2, 0, 0]} />
           <Bar dataKey="storefront" fill="#7B6FA0" name="Storefront" radius={[2, 2, 0, 0]} />
           <Bar dataKey="pos" fill="#E87B35" name="POS" radius={[2, 2, 0, 0]} />
          </BarChart>
         )
        })()}
       </ChartCard>

       <ChartCard title="Margin Trend" subtitle="Revenue vs. cost of goods" action={<PinButton widgetId="analytics-margin-trend" />}>
        <BarChart data={marginData}>
         <CartesianGrid strokeDasharray="3 3" stroke="rgba(44,59,77,0.15)" />
         <XAxis dataKey="month" tick={{ fill: '#6A5D80', fontSize: 11 }} axisLine={false} tickLine={false} />
         <YAxis tick={{ fill: '#6A5D80', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
         <Tooltip {...chartTooltipStyle} formatter={(value, name) => [`$${Number(value).toLocaleString()}`, name === 'margin' ? 'Margin' : name === 'cost' ? 'COGS' : String(name)]} />
         <Bar dataKey="cost" stackId="1" fill="#3D3050" name="COGS" radius={[0, 0, 0, 0]} />
         <Bar dataKey="margin" stackId="1" fill="#E87B35" name="Margin" radius={[2, 2, 0, 0]} />
        </BarChart>
       </ChartCard>
      </div>

      <div className="flex flex-col gap-4">
       <div className="relative bg-waxe-card border border-waxe-border flex flex-col clip-card">
        <PinButton widgetId="analytics-revenue-by-genre" />
        <h3 className="shrink-0 px-5 pt-5 pb-3 text-[11px] font-semibold text-waxe-text">Revenue — By Genre</h3>
        <div className="px-5 pb-5 space-y-3">
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
            <span className="text-[11px] text-waxe-text-muted w-10 shrink-0 text-right font-mono">{g.percentage}%</span>
           </div>
          </div>
         ))}
        </div>
       </div>

       <div className="relative shrink-0 bg-waxe-card border border-waxe-border p-5 clip-card">
        <PinButton widgetId="analytics-channel-split" />
        <h3 className="text-[11px] font-semibold text-waxe-text mb-4">Channel — Split</h3>
        <div className="space-y-3">
         {[
          { name: 'Discogs', pct: 43, color: '#6A6090' },
          { name: 'Storefront', pct: 33, color: '#7B6FA0' },
          { name: 'In-store', pct: 24, color: '#E87B35' },
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
    </section>

    {/* ── Inventory Health ── */}
    <section>
     <h2 className="text-[11px] font-medium text-waxe-text-muted mb-3">Inventory Health</h2>
     <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 grid grid-cols-1 gap-4">
       <ChartCard title="Days on Shelf" subtitle="How long inventory sits before selling" action={<PinButton widgetId="analytics-days-on-shelf" />}>
        <BarChart data={daysOnShelfData}>
         <CartesianGrid strokeDasharray="3 3" stroke="rgba(44,59,77,0.15)" />
         <XAxis dataKey="range" tick={{ fill: '#6A5D80', fontSize: 11 }} axisLine={false} tickLine={false} />
         <YAxis tick={{ fill: '#6A5D80', fontSize: 11 }} axisLine={false} tickLine={false} />
         <Tooltip {...chartTooltipStyle} formatter={(value, name) => [name === 'count' ? `${value} items` : `$${Number(value).toLocaleString()}`, name === 'count' ? 'Items' : 'Value']} />
         <Bar dataKey="count" radius={[2, 2, 0, 0]}>
          {daysOnShelfData.map((entry, index) => (
           <Cell key={index} fill={index >= 4 ? '#7B6FA0' : index >= 3 ? '#C0B8D0' : '#6A6090'} />
          ))}
         </Bar>
        </BarChart>
       </ChartCard>

       <ChartCard title="Your Price vs. Market" subtitle="Active listings compared to Discogs median" action={<PinButton widgetId="analytics-price-vs-market" />}>
        <BarChart data={priceVsMarketData} layout="vertical" barGap={2}>
         <CartesianGrid strokeDasharray="3 3" stroke="rgba(44,59,77,0.15)" horizontal={false} />
         <XAxis type="number" tick={{ fill: '#6A5D80', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
         <YAxis type="category" dataKey="artist" tick={{ fill: '#6A5D80', fontSize: 9 }} axisLine={false} tickLine={false} width={90} />
         <Tooltip {...chartTooltipStyle} formatter={(value) => [`$${value}`, '']} />
         <Legend iconType="plainline" wrapperStyle={{ fontSize: '10px', fontFamily: 'var(--font-mono)', paddingTop: '8px' }} />
         <Bar dataKey="yourPrice" fill="#6A6090" barSize={6} name="Your Price" radius={[0, 2, 2, 0]} />
         <Bar dataKey="discogsMedian" fill="#E87B35" barSize={6} name="Discogs Median" radius={[0, 2, 2, 0]} />
        </BarChart>
       </ChartCard>
      </div>

      <div className="flex flex-col gap-4">
       <div className="relative bg-waxe-card border border-waxe-border p-5 clip-card accent-strip-left accent-negative">
        <PinButton widgetId="analytics-dead-stock" />
        <div className="mb-4">
         <h3 className="text-[11px] font-semibold text-waxe-text">Aged Inventory — 90+ Days</h3>
        </div>
        <div className="space-y-3">
         <div className="flex justify-between items-baseline">
          <span className="text-xs text-waxe-text-muted">Items</span>
          <span className="text-2xl font-semibold text-waxe-negative font-mono">{deadStockSummary.totalItems}</span>
         </div>
         <div className="flex justify-between items-baseline">
          <span className="text-xs text-waxe-text-muted">Capital Tied Up</span>
          <span className="text-lg font-semibold text-waxe-text font-mono">${deadStockSummary.totalValue.toLocaleString()}</span>
         </div>
         <div className="flex justify-between items-baseline">
          <span className="text-xs text-waxe-text-muted">Avg Days Listed</span>
          <span className="text-sm font-medium text-waxe-text font-mono">{deadStockSummary.avgDaysListed}d</span>
         </div>
         <div className="flex justify-between items-baseline">
          <span className="text-xs text-waxe-text-muted">Top Genre</span>
          <span className="text-sm font-medium text-waxe-text">{deadStockSummary.topGenre}</span>
         </div>
        </div>
       </div>

       <div className="relative bg-waxe-card border border-waxe-border flex flex-col clip-card">
        <PinButton widgetId="analytics-condition" />
        <h3 className="shrink-0 px-5 pt-5 pb-3 text-[11px] font-semibold text-waxe-text">Condition — Distribution</h3>
        <div className="px-5 pb-5 space-y-3">
         {conditionBreakdowns.map((c) => (
          <div key={c.condition}>
           <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-waxe-text truncate">{c.condition}</span>
            <span className="text-sm font-bold text-waxe-text font-mono">{c.count}</span>
           </div>
           <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-waxe-surface overflow-hidden">
             <div className="h-full bg-waxe-text" style={{ width: `${c.percentage}%` }} />
            </div>
            <span className="text-xs font-medium w-10 shrink-0 text-right font-mono">{c.percentage}%</span>
           </div>
          </div>
         ))}
        </div>
       </div>
      </div>
     </div>
    </section>

    {/* ── Restocking Intelligence ── */}
    <section>
     <h2 className="text-[11px] font-medium text-waxe-text-muted mb-3">Restocking Intelligence</h2>
     <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 flex flex-col gap-4">
       <ChartCard title="Inventory Velocity" subtitle="Items sold vs. added per week" action={<PinButton widgetId="analytics-velocity" />}>
        <BarChart data={velocityData}>
         <CartesianGrid strokeDasharray="3 3" stroke="rgba(44,59,77,0.15)" />
         <XAxis dataKey="week" tick={{ fill: '#6A5D80', fontSize: 11 }} axisLine={false} tickLine={false} />
         <YAxis tick={{ fill: '#6A5D80', fontSize: 11 }} axisLine={false} tickLine={false} />
         <Tooltip {...chartTooltipStyle} />
         <Bar dataKey="sold" fill="#E87B35" radius={[2, 2, 0, 0]} name="Sold" />
         <Bar dataKey="added" fill="#6A6090" radius={[2, 2, 0, 0]} name="Added" />
        </BarChart>
       </ChartCard>

       <div className="relative">
        <PinButton widgetId="analytics-restock-table" />
        <DataTable headers={['Record', 'Genre', 'Demand', 'Avg Price', 'Last Sold', 'Velocity']} maxHeight="400px">
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

      <div className="flex flex-col gap-4">
       <div className="relative bg-waxe-card border border-waxe-border flex flex-col clip-card">
        <PinButton widgetId="analytics-missed-searches" />
        <div className="shrink-0 px-5 pt-5 pb-1">
         <h3 className="text-[11px] font-semibold text-waxe-text">Missed — Searches</h3>
        </div>
        <p className="shrink-0 px-5 pb-3 text-[11px] text-waxe-text-muted">What buyers searched for that you don&apos;t carry</p>
        <div className="px-5 pb-5 space-y-3">
         {missedSearches.map((s) => (
          <div key={s.query} className="flex items-start justify-between gap-2 py-1.5 border-b border-waxe-border/30 last:border-0">
           <div className="min-w-0">
            <p className="text-xs text-waxe-text font-medium truncate">{s.query}</p>
            <p className="text-[11px] text-waxe-text-muted">{s.lastSearched}</p>
           </div>
           <div className="shrink-0 text-right">
            <p className="text-sm font-bold text-waxe-warm font-mono">{s.searchCount}</p>
            <p className="text-[11px] text-waxe-text-muted">searches</p>
           </div>
          </div>
         ))}
        </div>
       </div>
      </div>
     </div>
    </section>

    {/* ── Inventory Intelligence ── */}
    <section>
     <h2 className="text-[11px] font-medium text-waxe-text-muted mb-3">Inventory Intelligence</h2>
     <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2">
       <div className="bg-waxe-card border border-waxe-border p-5 clip-card">
        <h3 className="text-[11px] font-semibold text-waxe-text mb-3">Aged Inventory</h3>
        <div className="space-y-2 max-h-[400px] overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
         {deadStockItems.map((item) => (
          <div key={item.id} className="flex items-center gap-3 py-2 px-3 bg-waxe-surface/30 hover:bg-waxe-surface/50 transition-colors">
           <div
            className="w-10 h-10 shrink-0 border border-waxe-border flex items-center justify-center relative overflow-hidden"
            style={{ backgroundColor: item.photoColor || '#3D3050' }}
           >
            {item.artworkUrl ? (
             <img src={item.artworkUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
            ) : (
             <span className="text-[6px] font-semibold text-white/50">LP</span>
            )}
           </div>
           <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-waxe-text truncate">{item.artist} — {item.title}</p>
            <p className="text-[11px] text-waxe-text-muted">{item.genre} &middot; ${item.price} &middot; {item.storefrontViews} views</p>
           </div>
           <span className={`shrink-0 text-[10px] font-semibold px-1.5 py-0.5 border ${
            item.daysInStock >= 90 ? 'border-waxe-negative/40 text-waxe-negative bg-waxe-negative/5' :
            'border-waxe-warm/40 text-waxe-warm bg-waxe-warm/5'
           }`}>
            {item.daysInStock}d
           </span>
           <span className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 border ${
            item.suggestedAction === 'swap' ? 'border-waxe-cool/40 text-waxe-cool bg-waxe-cool/5' :
            item.suggestedAction === 'discount' ? 'border-waxe-warm/40 text-waxe-warm bg-waxe-warm/5' :
            'border-waxe-positive/40 text-waxe-positive bg-waxe-positive/5'
           }`}>
            {item.suggestedAction === 'list_to_network' ? 'List' : item.suggestedAction === 'swap' ? 'Trade' : 'Reprice'}
           </span>
          </div>
         ))}
        </div>
       </div>
      </div>

      <div>
       <div className="bg-waxe-card border border-waxe-border p-5 clip-card">
        <h3 className="text-[11px] font-semibold text-waxe-text mb-3">Customer Wants</h3>
        <div className="space-y-3 max-h-[400px] overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
         {wantListItems.map((item) => (
          <div key={item.id} className="py-2 border-b border-waxe-border/30 last:border-0">
           <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-medium text-waxe-text truncate">
             {item.title ? `${item.artist} — ${item.title}` : `${item.genre} (genre)`}
            </p>
            <span className="text-sm font-bold text-waxe-warm font-mono ml-2">{item.requestCount}x</span>
           </div>
           <div className="flex items-center gap-2 text-[11px] text-waxe-text-muted">
            <span>{item.lastRequested}</span>
            {item.networkAvailable > 0 && (
             <span className="text-waxe-positive font-bold">{item.networkAvailable} in network</span>
            )}
           </div>
          </div>
         ))}
        </div>
       </div>
      </div>
     </div>
    </section>

    {/* ── Price Intelligence ── */}
    <section>
     <h2 className="text-[11px] font-medium text-waxe-text-muted mb-3">Price Intelligence</h2>
     <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2">
       <ChartCard title="Price History" subtitle="Your avg vs. Discogs median vs. suggested — 12 months" action={<PinButton widgetId="analytics-price-history" />}>
        <AreaChart data={priceHistoryData}>
         <defs>
          <linearGradient id="analyticsStoreGrad" x1="0" y1="0" x2="0" y2="1">
           <stop offset="5%" stopColor="#E87B35" stopOpacity={0.4} />
           <stop offset="95%" stopColor="#E87B35" stopOpacity={0.05} />
          </linearGradient>
          <linearGradient id="analyticsDiscogsGrad" x1="0" y1="0" x2="0" y2="1">
           <stop offset="5%" stopColor="#6A6090" stopOpacity={0.3} />
           <stop offset="95%" stopColor="#6A6090" stopOpacity={0.05} />
          </linearGradient>
          <linearGradient id="analyticsSuggestedGrad" x1="0" y1="0" x2="0" y2="1">
           <stop offset="5%" stopColor="#4A9A62" stopOpacity={0.3} />
           <stop offset="95%" stopColor="#4A9A62" stopOpacity={0.05} />
          </linearGradient>
         </defs>
         <CartesianGrid strokeDasharray="3 3" stroke="rgba(44,59,77,0.15)" />
         <XAxis dataKey="month" tick={{ fill: '#6A5D80', fontSize: 11 }} axisLine={false} tickLine={false} />
         <YAxis tick={{ fill: '#6A5D80', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} domain={['dataMin - 5', 'dataMax + 5']} />
         <Tooltip {...chartTooltipStyle} formatter={(value) => [`$${Number(value)}`, '']} />
         <Legend iconType="plainline" wrapperStyle={{ fontSize: '10px', fontFamily: 'var(--font-mono)', paddingTop: '8px' }} />
         <Area type="monotone" dataKey="storeAvg" stroke="#E87B35" fill="url(#analyticsStoreGrad)" strokeWidth={2.5} name="Your Store" />
         <Area type="monotone" dataKey="discogsAvg" stroke="#6A6090" fill="url(#analyticsDiscogsGrad)" strokeWidth={2} name="Discogs Median" />
         <Area type="monotone" dataKey="suggestedAvg" stroke="#4A9A62" fill="url(#analyticsSuggestedGrad)" strokeWidth={2} name="Suggested" />
        </AreaChart>
       </ChartCard>
       <div className="grid grid-cols-3 gap-3 mt-3">
        {priceIntelSummary.map((metric) => (
         <div key={metric.label} className="bg-waxe-card border border-waxe-border p-3 text-center clip-card">
          <p className={`text-lg font-semibold font-mono ${metric.positive ? 'text-waxe-positive' : 'text-waxe-warm'}`}>{metric.value}</p>
          <p className="text-[10px] text-waxe-text-muted mt-0.5">{metric.label}</p>
         </div>
        ))}
       </div>
      </div>

      <div>
       <div className="bg-waxe-card border border-waxe-border p-5 clip-card">
        <h3 className="text-[11px] font-semibold text-waxe-text mb-1">Channel Fee Comparison</h3>
        <p className="text-[10px] text-waxe-text-muted mb-4">$45 record + $5 shipping</p>
        <div className="space-y-3">
         {channelFeeStructures.map((ch) => {
          const saleFee = 45 * (ch.platformFeePct / 100)
          const shipFee = 5 * (ch.shippingFeePct / 100)
          const totalFee = saleFee + shipFee + ch.fixedFee
          const net = 50 - totalFee
          return (
           <div
            key={ch.channel}
            className={`p-3 ${ch.channel === 'WAXED' ? 'bg-waxe-positive/10 border-l border-waxe-positive' : 'bg-waxe-surface/30'}`}
           >
            <div className="flex items-center justify-between mb-1">
             <div className="flex items-center gap-2">
              <div className="w-2 h-2 shrink-0" style={{ backgroundColor: ch.color }} />
              <span className="text-xs text-waxe-text font-medium">{ch.channel}</span>
             </div>
             <span className="text-sm font-bold text-waxe-text font-mono">${net.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-waxe-text-muted">
             <span>{ch.description}</span>
             <span className="font-mono">-${totalFee.toFixed(2)}</span>
            </div>
           </div>
          )
         })}
        </div>
       </div>
      </div>
     </div>
    </section>

   </div>

  </div>
  </DashboardFilterProvider>
 )
}
