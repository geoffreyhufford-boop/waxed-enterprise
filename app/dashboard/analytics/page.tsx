'use client'

import { AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
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
  return (
    <>
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

      {/* Store Performance */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Revenue (MTD)" value="$14,230" trend="+18%" trendUp={true} />
        <StatCard label="Orders" value="186" trend="+23%" trendUp={true} />
        <StatCard label="Avg Order Value" value="$76.50" trend="+$4.20" trendUp={true} />
        <StatCard label="Return Rate" value="1.2%" trend="-0.3%" trendUp={true} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard title="Revenue" subtitle="Last 7 months">
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

        <ChartCard title="Orders" subtitle="Monthly order volume">
          <BarChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(44,59,77,0.15)" />
            <XAxis dataKey="month" tick={{ fill: '#4A5B6D', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#4A5B6D', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip {...chartTooltipStyle} />
            <Bar dataKey="orders" fill="#1B2632" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ChartCard>
      </div>

      {/* Genre & Condition Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <div className="bg-waxe-card border-2 border-waxe-border rounded-none p-5">
          <h3 className="text-[11px] font-black text-waxe-text uppercase tracking-[0.1em] mb-4">Genre <span className="text-waxe-cool">{'>>'}</span> Breakdown</h3>
          <div className="space-y-3">
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

        <div className="bg-waxe-card border-2 border-waxe-border rounded-none p-5">
          <h3 className="text-[11px] font-black text-waxe-text uppercase tracking-[0.1em] mb-4">Condition <span className="text-waxe-cool">{'>>'}</span> Distribution</h3>
          <div className="space-y-3">
            {conditionBreakdowns.map((c) => (
              <div key={c.condition} className="flex items-center gap-3">
                <span className="text-sm text-waxe-text w-28">{c.condition}</span>
                <div className="flex-1 h-2 bg-waxe-surface rounded-full overflow-hidden">
                  <div className="h-full bg-waxe-text rounded-full" style={{ width: `${c.percentage}%` }} />
                </div>
                <span className="text-xs text-waxe-text-muted w-16 text-right">{c.count} · {c.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Market Trends */}
      <h2 className="text-[13px] font-black text-waxe-text uppercase tracking-[0.1em] mb-4">Market <span className="text-waxe-cool">{'>>'}</span> Trends</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard title="Genre Demand" subtitle="Search & purchase interest by genre">
          <LineChart data={genreDemandData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(44,59,77,0.15)" />
            <XAxis dataKey="month" tick={{ fill: '#4A5B6D', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#4A5B6D', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip {...chartTooltipStyle} />
            <Line type="monotone" dataKey="jazz" stroke="#1B2632" strokeWidth={2} dot={false} name="Jazz" />
            <Line type="monotone" dataKey="rock" stroke="#2C3B4D" strokeWidth={2} dot={false} name="Rock" />
            <Line type="monotone" dataKey="hiphop" stroke="#A35139" strokeWidth={2} dot={false} name="Hip-Hop" />
            <Line type="monotone" dataKey="electronic" stroke="#FFB162" strokeWidth={2} dot={false} name="Electronic" />
            <Line type="monotone" dataKey="soul" stroke="#C9C1B1" strokeWidth={2} dot={false} name="Soul" />
          </LineChart>
        </ChartCard>

        <ChartCard title="Price Trends by Condition" subtitle="Average sale price by rating">
          <LineChart data={priceTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(44,59,77,0.15)" />
            <XAxis dataKey="month" tick={{ fill: '#4A5B6D', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#4A5B6D', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
            <Tooltip {...chartTooltipStyle} formatter={(value) => [`$${value}`, '']} />
            <Line type="monotone" dataKey="c10" stroke="#1B2632" strokeWidth={2} dot={false} name="10 — Sealed" />
            <Line type="monotone" dataKey="c9" stroke="#2C3B4D" strokeWidth={2} dot={false} name="9 — Pristine" />
            <Line type="monotone" dataKey="c7" stroke="#A35139" strokeWidth={2} dot={false} name="7 — Very Good" />
            <Line type="monotone" dataKey="c5" stroke="#C9C1B1" strokeWidth={2} dot={false} name="5 — Fair" />
          </LineChart>
        </ChartCard>
      </div>

      {/* Vinyl-Relevant Releases */}
      <div className="bg-waxe-card border-2 border-waxe-border rounded-none p-5 mb-10">
        <h3 className="text-[11px] font-black text-waxe-text uppercase tracking-[0.1em] mb-1">Vinyl-Relevant <span className="text-waxe-cool">{'>>'}</span> Releases</h3>
        <p className="text-[10px] text-waxe-text-muted mb-4 uppercase tracking-[0.1em]">Trending albums with vinyl release potential based on streaming data</p>
        <div className="space-y-3">
          {[
            { artist: 'Tyler, The Creator', album: 'Chromakopia', streams: '2.1B', vinylDemand: 'high', genre: 'Hip-Hop' },
            { artist: 'Sabrina Carpenter', album: 'Short n\' Sweet', streams: '1.8B', vinylDemand: 'high', genre: 'Pop' },
            { artist: 'Fontaines D.C.', album: 'Romance', streams: '420M', vinylDemand: 'medium', genre: 'Rock' },
            { artist: 'Cindy Lee', album: 'Diamond Jubilee', streams: '85M', vinylDemand: 'high', genre: 'Experimental' },
            { artist: 'Mk.gee', album: 'Two Star & The Dream Police', streams: '180M', vinylDemand: 'medium', genre: 'Rock' },
          ].map((release, i) => (
            <div key={i} className="flex items-center justify-between py-2 px-3 hover:bg-waxe-surface/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-waxe-surface border-2 border-waxe-border flex items-center justify-center text-xs font-bold text-waxe-text-muted">
                  {release.artist.charAt(0)}
                </div>
                <div>
                  <p className="text-sm text-waxe-text">{release.artist} — {release.album}</p>
                  <p className="text-xs text-waxe-text-muted">{release.genre} · {release.streams} streams</p>
                </div>
              </div>
              <StatusBadge status={release.vinylDemand} label={`${release.vinylDemand} demand`} />
            </div>
          ))}
        </div>
      </div>

      {/* Restocking */}
      <h2 className="text-[13px] font-black text-waxe-text uppercase tracking-[0.1em] mb-4">Restocking <span className="text-waxe-cool">{'>>'}</span> Recommendations</h2>

      <ChartCard title="Inventory Velocity" subtitle="Items sold vs. added per week" className="mb-6">
        <BarChart data={velocityData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(44,59,77,0.15)" />
          <XAxis dataKey="week" tick={{ fill: '#4A5B6D', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#4A5B6D', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip {...chartTooltipStyle} />
          <Bar dataKey="sold" fill="#FFB162" radius={[2, 2, 0, 0]} name="Sold" />
          <Bar dataKey="added" fill="#1B2632" radius={[2, 2, 0, 0]} name="Added" />
        </BarChart>
      </ChartCard>

      <DataTable headers={['Record', 'Genre', 'Demand Score', 'Avg Sale Price', 'Last Sold', 'Velocity']}>
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
                <span className="text-sm font-medium text-waxe-text">{rec.demandScore}</span>
              </div>
            </td>
            <td className="px-4 py-3 text-sm text-waxe-text-secondary">${rec.avgSalePrice}</td>
            <td className="px-4 py-3 text-xs text-waxe-text-muted">{rec.lastSold}</td>
            <td className="px-4 py-3">
              <StatusBadge status={rec.velocity} />
            </td>
          </tr>
        ))}
      </DataTable>
    </>
  )
}
