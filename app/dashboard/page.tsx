'use client'

import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { DashboardHeader, StatCard, IntegrationCard, StatusBadge } from '@/components/dashboard'
import { quickStats, integrations, revenueData, genreBreakdowns } from '@/lib/dashboard-data'

const chartTooltipStyle = {
  contentStyle: { background: '#1a1a24', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', fontSize: '12px' },
  labelStyle: { color: '#a0a0b0' },
  itemStyle: { color: '#f0f0f5' },
}

const channelBreakdown = [
  { channel: 'Online (Storefront)', revenue: 6240, percentage: 44, color: '#c9a87c' },
  { channel: 'In-Store (POS)', revenue: 4980, percentage: 35, color: '#7c9ec9' },
  { channel: 'Discogs', revenue: 2150, percentage: 15, color: '#7cb89a' },
  { channel: 'Other', revenue: 860, percentage: 6, color: '#6a6a7a' },
]

const topSellers = [
  { artist: 'Miles Davis', title: 'Kind of Blue', sold: 14, revenue: 1190, genre: 'Jazz', artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music/7f/9f/d6/mzi.vtnaewef.jpg/300x300bb.jpg' },
  { artist: 'Fleetwood Mac', title: 'Rumours', sold: 11, revenue: 462, genre: 'Rock', artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/4d/13/ba/4d13bac3-d3d5-7581-2c74-034219eadf2b/081227970949.jpg/300x300bb.jpg' },
  { artist: 'Kendrick Lamar', title: 'To Pimp a Butterfly', sold: 9, revenue: 315, genre: 'Hip-Hop', artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/b5/a6/91/b5a69171-5232-3d5b-9c15-8963802f83dd/15UMGIM15814.rgb.jpg/300x300bb.jpg' },
  { artist: 'J Dilla', title: 'Donuts', sold: 7, revenue: 665, genre: 'Hip-Hop', artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/63/d3/c5/63d3c537-ac30-86e7-8e69-8a03a5346209/792.jpg/300x300bb.jpg' },
  { artist: 'Nina Simone', title: 'I Put a Spell on You', sold: 6, revenue: 330, genre: 'Soul', artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/18/db/05/18db0507-f276-d93d-a4a7-e856a3f1590a/13UAAIM08283.rgb.jpg/300x300bb.jpg' },
]

const inventoryAlerts = [
  { label: 'Low stock (< 3 copies)', count: 18, status: 'medium' as const },
  { label: 'Price suggestions pending', count: 7, status: 'high' as const },
  { label: 'Sync conflicts', count: 2, status: 'high' as const },
  { label: 'Unlisted inventory', count: 34, status: 'low' as const },
]

export default function OverviewPage() {
  return (
    <>
      <DashboardHeader
        title="Overview"
        subtitle="Wax & Groove Records — Enterprise Plan"
        actions={
          <button className="btn-primary text-sm px-4 py-2">+ Add Record</button>
        }
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {quickStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Revenue Chart + Channel Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-waxe-card backdrop-blur-md border border-waxe-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-waxe-text">Revenue</h2>
              <p className="text-xs text-waxe-text-muted">Last 7 months</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-waxe-text">$14,230</p>
              <p className="text-xs text-[#7cb89a] font-medium">↑ +18% vs last month</p>
            </div>
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="overviewRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c9a87c" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#c9a87c" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: '#6a6a7a', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6a6a7a', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip {...chartTooltipStyle} formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']} />
                <Area type="monotone" dataKey="revenue" stroke="#c9a87c" fill="url(#overviewRevenueGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Channel Breakdown */}
        <div className="bg-waxe-card backdrop-blur-md border border-waxe-border rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-waxe-text mb-4">Sales by Channel</h2>
          <div className="space-y-4">
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
      </div>

      {/* Top Sellers + Inventory Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Top Sellers */}
        <div className="lg:col-span-2 bg-waxe-card backdrop-blur-md border border-waxe-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-waxe-text">Top Sellers This Month</h2>
            <span className="text-xs text-waxe-text-muted">by units sold</span>
          </div>
          <div className="space-y-2">
            {topSellers.map((record, i) => (
              <div key={i} className="flex items-center gap-4 py-2.5 px-3 rounded-xl hover:bg-waxe-surface/30 transition-colors">
                <span className="text-xs font-bold text-waxe-text-muted w-5 text-center">{i + 1}</span>
                <div className="w-9 h-9 rounded-lg bg-waxe-surface border border-waxe-border overflow-hidden shrink-0">
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

        {/* Inventory Alerts + Genre Mix */}
        <div className="space-y-6">
          <div className="bg-waxe-card backdrop-blur-md border border-waxe-border rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-waxe-text mb-4">Inventory Alerts</h2>
            <div className="space-y-3">
              {inventoryAlerts.map((alert, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-waxe-text-secondary">{alert.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-waxe-text">{alert.count}</span>
                    <StatusBadge status={alert.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-waxe-card backdrop-blur-md border border-waxe-border rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-waxe-text mb-4">Genre Mix</h2>
            <div className="space-y-2.5">
              {genreBreakdowns.slice(0, 5).map((g) => (
                <div key={g.genre} className="flex items-center gap-3">
                  <span className="text-xs text-waxe-text-secondary w-20">{g.genre}</span>
                  <div className="flex-1 h-1.5 bg-waxe-surface rounded-full overflow-hidden">
                    <div className="h-full bg-waxe-warm rounded-full" style={{ width: `${g.percentage}%` }} />
                  </div>
                  <span className="text-xs text-waxe-text-muted w-8 text-right">{g.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Connected Services + Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Connected Services */}
        <div className="bg-waxe-card backdrop-blur-md border border-waxe-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-waxe-text">Connected Services</h2>
            <span className="text-xs text-waxe-text-muted">
              {integrations.filter(i => i.status === 'connected').length}/{integrations.length} active
            </span>
          </div>
          <div className="space-y-1">
            {integrations.map((integration) => (
              <IntegrationCard key={integration.name} {...integration} />
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-waxe-card backdrop-blur-md border border-waxe-border rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-waxe-text mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {[
              { time: '2:34 PM', event: 'POS sale recorded', detail: 'Miles Davis — Kind of Blue — $85.00' },
              { time: '2:15 PM', event: 'New message', detail: 'Sarah Mitchell asked about Kind of Blue' },
              { time: '2:12 PM', event: 'POS sale recorded', detail: '2 records — $67.00' },
              { time: '1:48 PM', event: 'Inventory synced', detail: 'Discogs — 2,847 listings verified' },
              { time: '1:42 PM', event: 'Record reserved', detail: 'J Dilla — Donuts reserved for James R.' },
              { time: '12:30 PM', event: 'Price suggestion', detail: 'J Dilla — Donuts: suggested $110 (+$15)' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 py-2 px-3 rounded-lg hover:bg-waxe-surface/30 transition-colors">
                <span className="text-xs text-waxe-text-muted w-16 shrink-0 pt-0.5">{item.time}</span>
                <div>
                  <p className="text-sm text-waxe-text">{item.event}</p>
                  <p className="text-xs text-waxe-text-muted">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
