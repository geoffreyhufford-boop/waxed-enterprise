'use client'

import { useState } from 'react'
import { DashboardHeader, StatCard, StatusBadge, DataTable, DateRangeSelector } from '@/components/dashboard'
import { transactions, posQuickStats, inventoryRecords } from '@/lib/dashboard-data'

const methodIcons: Record<string, string> = {
 card: '▰',
 cash: '▤',
 tap: '◎',
}

const quickLookupResults = inventoryRecords.slice(0, 5)

export default function POSPage() {
 const [lookupQuery, setLookupQuery] = useState('')
 const [dateRange, setDateRange] = useState('Today')

 const lookupResults = lookupQuery
  ? inventoryRecords.filter(r => {
    const q = lookupQuery.toLowerCase()
    return r.artist.toLowerCase().includes(q) || r.title.toLowerCase().includes(q) || r.id.toLowerCase().includes(q)
   }).slice(0, 6)
  : quickLookupResults

 return (
  <div className="flex flex-col flex-1 min-h-0">
   <DashboardHeader
    title="Point of Sale"
    subtitle="Square integration — live sync active"
    actions={
     <div className="flex items-center gap-3">
      <StatusBadge status="connected" label="Square Connected" />
      <DateRangeSelector presets={['Today', 'This Week', 'This Month']} value={dateRange} onChange={setDateRange} />
      <button className="btn-secondary text-sm px-4 py-2">Sync Now</button>
     </div>
    }
   />

   <div className="flex-1 min-h-0 overflow-y-auto p-2 -m-2">
   {/* Quick Stats */}
   <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    {posQuickStats.map((stat) => (
     <StatCard key={stat.label} {...stat} />
    ))}
   </div>

   <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
    {/* Quick Record Lookup */}
    <div className="lg:col-span-2 bg-waxe-card border border-waxe-border p-5 flex flex-col clip-card">
     <div className="flex items-center justify-between mb-4 shrink-0">
      <h3 className="text-[11px] font-semibold text-waxe-text">Quick Lookup</h3>
      <span className="text-[11px] text-waxe-text-muted">search to check price or ring up</span>
     </div>
     <input
      type="text"
      placeholder="Search artist, title, or ID..."
      className="bg-waxe-card border border-waxe-border text-sm text-waxe-text placeholder:text-waxe-text-secondary px-3 py-2 mb-4 focus:outline-none focus:border-waxe-border-hover shrink-0"
      style={{ fontFamily: 'var(--font-mono)' }}
      value={lookupQuery}
      onChange={(e) => setLookupQuery(e.target.value)}
     />
     <div className="flex-1 space-y-1 overflow-y-auto">
      {lookupResults.map((record) => (
       <div key={record.id} className="flex items-center justify-between py-2.5 px-3 hover:bg-waxe-surface/30 transition-colors cursor-pointer">
        <div className="flex items-center gap-3 min-w-0">
         <span className="text-xs font-mono text-waxe-text-muted shrink-0">{record.id}</span>
         <div className="min-w-0">
          <p className="text-sm font-medium text-waxe-text truncate">{record.artist} — {record.title}</p>
          <p className="text-[11px] text-waxe-text-muted">{record.genre} · {record.label} · {record.year}</p>
         </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
         <div className="text-right">
          <p className="text-sm font-bold text-waxe-text">${record.price.toFixed(2)}</p>
          <p className="text-[11px] text-waxe-text-muted">{'★'.repeat(record.condition)}{'☆'.repeat(5 - record.condition)}</p>
         </div>
         <StatusBadge status={record.status} />
        </div>
       </div>
      ))}
      {lookupQuery && lookupResults.length === 0 && (
       <p className="text-sm text-waxe-text-muted text-center py-6">No records found for &ldquo;{lookupQuery}&rdquo;</p>
      )}
     </div>
    </div>

    {/* Auto-Sync Status Panel */}
    <div className="bg-waxe-card border border-waxe-border p-5 flex flex-col clip-card">
     <h3 className="text-[11px] font-semibold text-waxe-text mb-4 shrink-0">Auto-Sync Flow</h3>
     <div className="flex-1 flex flex-col justify-between">
      <div className="space-y-0">
       {[
        { step: 'Square POS', status: 'Sale recorded', active: true },
        { step: 'Inventory', status: 'Stock updated', active: true },
        { step: 'Storefront', status: 'Listing removed', active: true },
        { step: 'Analytics', status: 'Stats refreshed', active: true },
       ].map((item, i) => (
        <div key={i}>
         <div className="flex items-center gap-3 py-3">
          <div className={`glyph-box ${
           item.active ? 'border-waxe-warm text-waxe-warm' : ''
          }`} style={{ width: '32px', height: '32px', fontSize: '12px' }}>
           {i + 1}
          </div>
          <div>
           <p className="text-sm font-medium text-waxe-text">{item.step}</p>
           <p className="text-xs text-waxe-text-muted">{item.status}</p>
          </div>
         </div>
         {i < 3 && (
          <div className="ml-4 h-4 border-l border-dashed border-waxe-text/20" />
         )}
        </div>
       ))}
      </div>
      <div className="pt-4 border-t border-waxe-border">
       <p className="text-xs text-waxe-text-muted">Last full sync: 2 minutes ago</p>
       <p className="text-xs text-waxe-text mt-1">All systems operational</p>
      </div>
     </div>
    </div>
   </div>

   {/* Recent Transactions */}
   <DataTable headers={['Transaction', 'Time', 'Customer', 'Items', 'Total', 'Method', 'Synced']}>
    {transactions.map((txn) => (
     <tr key={txn.id} className="table-row hover:bg-waxe-surface/30 transition-colors">
      <td className="px-4 py-3">
       <span className="text-xs font-mono text-waxe-text-secondary">{txn.id}</span>
      </td>
      <td className="px-4 py-3 text-sm text-waxe-text">{txn.time}</td>
      <td className="px-4 py-3 text-sm text-waxe-text">{txn.customer}</td>
      <td className="px-4 py-3 text-sm text-waxe-text max-w-[200px] truncate">{txn.items}</td>
      <td className="px-4 py-3 text-sm font-medium text-waxe-text">${txn.total.toFixed(2)}</td>
      <td className="px-4 py-3">
       <span className="flex items-center gap-1.5 text-sm text-waxe-text">
        <span className="glyph-box-sm">{methodIcons[txn.method]}</span>
        <span className="capitalize">{txn.method}</span>
       </span>
      </td>
      <td className="px-4 py-3">
       {txn.synced ? (
        <span className="text-xs text-waxe-text">✓</span>
       ) : (
        <span className="text-xs text-waxe-text-secondary">⟳</span>
       )}
      </td>
     </tr>
    ))}
   </DataTable>
   </div>
  </div>
 )
}
