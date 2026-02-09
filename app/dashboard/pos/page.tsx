'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { DashboardHeader, StatCard, StatusBadge, DataTable, ChartCard } from '@/components/dashboard'
import { transactions, hourlySalesData, posQuickStats } from '@/lib/dashboard-data'

const methodIcons: Record<string, string> = {
  card: '▰',
  cash: '▤',
  tap: '◎',
}

const chartTooltipStyle = {
  contentStyle: { background: '#1a1a24', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', fontSize: '12px' },
  labelStyle: { color: '#a0a0b0' },
  itemStyle: { color: '#f0f0f5' },
}

export default function POSPage() {
  return (
    <>
      <DashboardHeader
        title="Point of Sale"
        subtitle="Square integration — live sync active"
        actions={
          <div className="flex items-center gap-3">
            <StatusBadge status="connected" label="Square Connected" />
            <button className="btn-secondary text-sm px-4 py-2">Sync Now</button>
          </div>
        }
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {posQuickStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Hourly Sales Chart */}
        <div className="lg:col-span-2">
          <ChartCard title="Today's Sales" subtitle="Hourly breakdown">
            <BarChart data={hourlySalesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="hour" tick={{ fill: '#6a6a7a', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6a6a7a', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
              <Tooltip {...chartTooltipStyle} formatter={(value) => [`$${value}`, 'Sales']} />
              <Bar dataKey="sales" fill="#c9a87c" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ChartCard>
        </div>

        {/* Auto-Sync Status Panel */}
        <div className="bg-waxe-card backdrop-blur-md border border-waxe-border rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-waxe-text mb-4">Auto-Sync Flow</h3>
          <div className="space-y-0">
            {[
              { step: 'Square POS', status: 'Sale recorded', active: true },
              { step: 'Inventory', status: 'Stock updated', active: true },
              { step: 'Storefront', status: 'Listing removed', active: true },
              { step: 'Analytics', status: 'Stats refreshed', active: true },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex items-center gap-3 py-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                    item.active ? 'bg-[#7cb89a]/15 text-[#7cb89a] border border-[#7cb89a]/25' : 'bg-waxe-surface text-waxe-text-muted border border-waxe-border'
                  }`}>
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-waxe-text">{item.step}</p>
                    <p className="text-xs text-waxe-text-muted">{item.status}</p>
                  </div>
                </div>
                {i < 3 && (
                  <div className="ml-4 h-4 border-l border-dashed border-[#7cb89a]/30" />
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-waxe-border">
            <p className="text-xs text-waxe-text-muted">Last full sync: 2 minutes ago</p>
            <p className="text-xs text-[#7cb89a] mt-1">All systems operational</p>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <DataTable headers={['Transaction', 'Time', 'Customer', 'Items', 'Total', 'Method', 'Synced']}>
        {transactions.map((txn) => (
          <tr key={txn.id} className="table-row hover:bg-waxe-surface/30 transition-colors">
            <td className="px-4 py-3">
              <span className="text-xs font-mono text-waxe-text-muted">{txn.id}</span>
            </td>
            <td className="px-4 py-3 text-sm text-waxe-text-secondary">{txn.time}</td>
            <td className="px-4 py-3 text-sm text-waxe-text">{txn.customer}</td>
            <td className="px-4 py-3 text-sm text-waxe-text-secondary max-w-[200px] truncate">{txn.items}</td>
            <td className="px-4 py-3 text-sm font-medium text-waxe-text">${txn.total.toFixed(2)}</td>
            <td className="px-4 py-3">
              <span className="flex items-center gap-1.5 text-sm text-waxe-text-secondary">
                <span className="text-xs">{methodIcons[txn.method]}</span>
                <span className="capitalize">{txn.method}</span>
              </span>
            </td>
            <td className="px-4 py-3">
              {txn.synced ? (
                <span className="text-xs text-[#7cb89a]">✓</span>
              ) : (
                <span className="text-xs text-[#c9a87c]">⟳</span>
              )}
            </td>
          </tr>
        ))}
      </DataTable>
    </>
  )
}
