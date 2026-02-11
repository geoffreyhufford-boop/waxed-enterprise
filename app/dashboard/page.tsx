'use client'

import { useState, useRef } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { DashboardHeader, StatCard, IntegrationCard, StatusBadge } from '@/components/dashboard'
import { quickStats, integrations, revenueData, genreBreakdowns } from '@/lib/dashboard-data'

const chartTooltipStyle = {
  contentStyle: { background: '#EEE9DF', border: '2px solid #2C3B4D', borderRadius: '0', fontSize: '10px', fontFamily: 'var(--font-mono)' },
  labelStyle: { color: '#4A5B6D', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', fontSize: '9px' },
  itemStyle: { color: '#1B2632', fontFamily: 'var(--font-mono)' },
}

const channelBreakdown = [
  { channel: 'Online (Storefront)', revenue: 6240, percentage: 44, color: '#1B2632' },
  { channel: 'In-Store (POS)', revenue: 4980, percentage: 35, color: '#2C3B4D' },
  { channel: 'Discogs', revenue: 2150, percentage: 15, color: '#A35139' },
  { channel: 'Other', revenue: 860, percentage: 6, color: '#FFB162' },
]

const topSellers = [
  { artist: 'Aphex Twin', title: 'Selected Ambient Works 85-92', sold: 14, revenue: 1190, genre: 'Ambient', artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/5f/b3/e0/5fb3e08d-c2cd-3da4-6ad7-c5dc61803683/cover.jpg/300x300bb.jpg' },
  { artist: 'Daft Punk', title: 'Homework', sold: 11, revenue: 605, genre: 'House', artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/dc/68/45/dc684589-af57-6895-1177-4f2acbb93e47/190296240911.jpg/300x300bb.jpg' },
  { artist: 'Burial', title: 'Untrue', sold: 9, revenue: 432, genre: 'Techno', artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/9d/0f/1c/9d0f1c2b-2fae-d8ac-3920-ce9ec5bc85b5/7982.jpg/300x300bb.jpg' },
  { artist: 'Drexciya', title: "Neptune's Lair", sold: 7, revenue: 980, genre: 'Electro', artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/95/a4/3f/95a43f9d-4eb9-e5a9-ee64-910d3fb95e6c/3663729188892_3000.jpg/300x300bb.jpg' },
  { artist: 'Boards of Canada', title: 'Music Has the Right to Children', sold: 6, revenue: 390, genre: 'Ambient', artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Features125/v4/b5/4c/c2/b54cc20d-03f5-f2c4-4a0d-9b51ad65af89/dj.txuslqgv.jpg/300x300bb.jpg' },
]

const inventoryAlerts = [
  { label: 'Low stock (< 3 copies)', count: 18, status: 'medium' as const },
  { label: 'Price suggestions pending', count: 7, status: 'high' as const },
  { label: 'Sync conflicts', count: 2, status: 'high' as const },
  { label: 'Unlisted inventory', count: 34, status: 'low' as const },
]

const activityFeed = [
  { time: '2:34 PM', event: 'POS sale recorded', detail: 'Aphex Twin — SAW 85-92 — $85.00' },
  { time: '2:15 PM', event: 'New message', detail: 'Sarah Mitchell asked about SAW 85-92' },
  { time: '2:12 PM', event: 'POS sale recorded', detail: '2 records — $103.00' },
  { time: '1:48 PM', event: 'Inventory synced', detail: 'Discogs — 2,847 listings verified' },
  { time: '1:42 PM', event: 'Record reserved', detail: "Drexciya — Neptune's Lair reserved for James R." },
  { time: '12:30 PM', event: 'Price suggestion', detail: 'Robert Hood — Minimal Nation: suggested $200 (+$20)' },
]

export default function OverviewPage() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activePanel, setActivePanel] = useState(0)
  const panelCount = 2

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
        title="Overview"
        subtitle="Wax & Groove Records — Enterprise Plan"
        actions={
          <button className="btn-primary text-sm px-4 py-2">+ Add Record</button>
        }
      />

      {/* Stats Row */}
      <div className="shrink-0 grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {quickStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Horizontal swipe panels */}
      <div ref={scrollRef} onScroll={handleScroll} className="flex-1 min-h-0 overflow-x-auto overflow-y-hidden snap-x snap-mandatory flex gap-4 -mr-5 lg:-mr-6 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>

        {/* ── Panel 1: Daily Snapshot ── */}
        <div className="snap-start shrink-0 w-[92%] grid grid-cols-1 lg:grid-cols-3 grid-rows-2 gap-4 min-h-0">

          {/* Revenue Chart — top, spans 2 cols */}
          <div className="lg:col-span-2 bg-waxe-card border-2 border-waxe-border rounded-none p-5 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-3 shrink-0">
              <div className="flex items-baseline gap-2">
                <h2 className="text-[11px] font-black text-waxe-text uppercase tracking-[0.1em]">Revenue</h2>
                <span className="text-[10px] text-waxe-cool font-bold">{'>>'}</span>
                <p className="text-[10px] text-waxe-text-muted uppercase tracking-[0.1em]">Last 7 months</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-waxe-text tracking-tight leading-none">$14,230</p>
                <p className="text-[10px] text-waxe-positive font-bold uppercase tracking-[0.1em]">{'>> '}+18% vs last month</p>
              </div>
            </div>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="overviewRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FFB162" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#FFB162" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(44,59,77,0.15)" />
                  <XAxis dataKey="month" tick={{ fill: '#4A5B6D', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#4A5B6D', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip {...chartTooltipStyle} formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']} />
                  <Area type="monotone" dataKey="revenue" stroke="#FFB162" fill="url(#overviewRevenueGradient)" strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Alerts — top right */}
          <div className="bg-waxe-card border-2 border-waxe-border rounded-none p-5 flex flex-col min-h-0">
            <h2 className="text-[11px] font-black text-waxe-text uppercase tracking-[0.1em] mb-4 shrink-0">Inventory <span className="text-waxe-cool">{'>>'}</span> Alerts</h2>
            <div className="flex-1 min-h-0 overflow-y-auto space-y-3">
              {inventoryAlerts.map((alert, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-waxe-text-secondary">{alert.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black text-waxe-text">{alert.count}</span>
                    <StatusBadge status={alert.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Sellers — bottom, spans 2 cols */}
          <div className="lg:col-span-2 bg-waxe-card border-2 border-waxe-border rounded-none p-5 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-3 shrink-0">
              <h2 className="text-[11px] font-black text-waxe-text uppercase tracking-[0.1em]">Top Sellers <span className="text-waxe-cool">{'>>'}</span> This Month</h2>
              <span className="text-[10px] text-waxe-text-muted uppercase tracking-[0.1em]">by units sold</span>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto space-y-1">
              {topSellers.map((record, i) => (
                <div key={i} className="flex items-center gap-3 py-2 px-3 hover:bg-waxe-surface/30 transition-colors">
                  <span className="text-xs font-bold text-waxe-text-muted w-5 text-center shrink-0">{i + 1}</span>
                  <div className="w-9 h-9 bg-waxe-surface overflow-hidden shrink-0">
                    <img src={record.artwork} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-waxe-text truncate">{record.artist} — {record.title}</p>
                    <p className="text-xs text-waxe-text-muted">{record.genre}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-medium text-waxe-text">${record.revenue.toLocaleString()}</p>
                    <p className="text-xs text-waxe-text-muted">{record.sold} sold</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Feed — bottom right */}
          <div className="bg-waxe-card border-2 border-waxe-border rounded-none p-5 flex flex-col min-h-0">
            <h2 className="text-[11px] font-black text-waxe-text uppercase tracking-[0.1em] mb-3 shrink-0">Recent <span className="text-waxe-cool">{'>>'}</span> Activity</h2>
            <div className="flex-1 min-h-0 overflow-y-auto space-y-2">
              {activityFeed.slice(0, 5).map((item, i) => (
                <div key={i} className="flex items-start gap-3 py-1.5">
                  <span className="text-[10px] text-waxe-text-muted w-14 shrink-0 pt-0.5">{item.time}</span>
                  <div className="min-w-0">
                    <p className="text-xs text-waxe-text">{item.event}</p>
                    <p className="text-[10px] text-waxe-text-muted truncate">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Panel 2: Details & Insights ── */}
        <div className="snap-start shrink-0 w-[92%] grid grid-cols-1 lg:grid-cols-3 grid-rows-2 gap-4 min-h-0">

          {/* Channel Breakdown — top left, spans 2 cols */}
          <div className="lg:col-span-2 bg-waxe-card border-2 border-waxe-border rounded-none p-5 flex flex-col min-h-0">
            <h2 className="text-[11px] font-black text-waxe-text uppercase tracking-[0.1em] mb-4 shrink-0">Sales <span className="text-waxe-cool">{'>>'}</span> By Channel</h2>
            <div className="flex-1 min-h-0 overflow-y-auto space-y-4">
              {channelBreakdown.map((ch) => (
                <div key={ch.channel}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-waxe-text">{ch.channel}</span>
                    <span className="text-sm font-medium text-waxe-text">${ch.revenue.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-waxe-surface rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${ch.percentage}%`, background: ch.color }} />
                    </div>
                    <span className="text-xs text-waxe-text-muted w-8 text-right">{ch.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Connected Services — top right */}
          <div className="bg-waxe-card border-2 border-waxe-border rounded-none p-5 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-3 shrink-0">
              <h2 className="text-[11px] font-black text-waxe-text uppercase tracking-[0.1em]">Connected <span className="text-waxe-cool">{'>>'}</span> Services</h2>
              <span className="text-[10px] text-waxe-text-muted">
                {integrations.filter(i => i.status === 'connected').length}/{integrations.length}
              </span>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto space-y-1">
              {integrations.map((integration) => (
                <IntegrationCard key={integration.name} {...integration} />
              ))}
            </div>
          </div>

          {/* Genre Mix — bottom left, spans 2 cols */}
          <div className="lg:col-span-2 bg-waxe-card border-2 border-waxe-border rounded-none p-5 flex flex-col min-h-0">
            <h2 className="text-[11px] font-black text-waxe-text uppercase tracking-[0.1em] mb-4 shrink-0">Genre <span className="text-waxe-cool">{'>>'}</span> Breakdown</h2>
            <div className="flex-1 min-h-0 overflow-y-auto space-y-3">
              {genreBreakdowns.map((g) => (
                <div key={g.genre} className="flex items-center gap-3">
                  <span className="text-sm text-waxe-text w-24">{g.genre}</span>
                  <div className="flex-1 h-2 bg-waxe-surface rounded-full overflow-hidden">
                    <div className="h-full bg-waxe-warm rounded-full" style={{ width: `${g.percentage}%` }} />
                  </div>
                  <span className="text-xs text-waxe-text-muted w-16 text-right">{g.count} · {g.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Full Activity Feed — bottom right */}
          <div className="bg-waxe-card border-2 border-waxe-border rounded-none p-5 flex flex-col min-h-0">
            <h2 className="text-[11px] font-black text-waxe-text uppercase tracking-[0.1em] mb-3 shrink-0">Full <span className="text-waxe-cool">{'>>'}</span> Activity</h2>
            <div className="flex-1 min-h-0 overflow-y-auto space-y-2">
              {activityFeed.map((item, i) => (
                <div key={i} className="flex items-start gap-3 py-1.5">
                  <span className="text-[10px] text-waxe-text-muted w-14 shrink-0 pt-0.5">{item.time}</span>
                  <div className="min-w-0">
                    <p className="text-xs text-waxe-text">{item.event}</p>
                    <p className="text-[10px] text-waxe-text-muted truncate">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Spacer so last panel can fully snap */}
        <div className="shrink-0 w-[8%]" />

      </div>

    </div>
  )
}
