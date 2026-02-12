'use client'

import { useState } from 'react'
import { DashboardHeader, StatCard, StatusBadge, FilterDropdown, DataTable } from '@/components/dashboard'
import { orders, fulfillmentStats, type Order } from '@/lib/dashboard-data'

const shippingMethodLabel: Record<string, string> = {
  standard: 'Standard',
  priority: 'Priority',
  express: 'Express',
}

const shippingMethodStyle: Record<string, string> = {
  standard: 'text-waxe-text-muted bg-waxe-surface',
  priority: 'text-waxe-text-secondary bg-waxe-text-secondary/10',
  express: 'text-waxe-cool bg-waxe-warm/10',
}

function itemSummary(order: Order) {
  const first = order.items[0]
  const label = `${first.artist} — ${first.title}`
  if (order.items.length > 1) return `${label} +${order.items.length - 1} more`
  return label
}

export default function FulfillmentPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [shippingFilter, setShippingFilter] = useState('All')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const filtered = orders.filter((o) => {
    if (search) {
      const q = search.toLowerCase()
      if (
        !o.id.toLowerCase().includes(q) &&
        !o.customer.name.toLowerCase().includes(q) &&
        !o.items.some(i => i.artist.toLowerCase().includes(q) || i.title.toLowerCase().includes(q))
      ) return false
    }
    if (statusFilter !== 'All' && o.status !== statusFilter) return false
    if (shippingFilter !== 'All' && o.shippingMethod !== shippingFilter) return false
    return true
  })

  const nextAction = (order: Order) => {
    switch (order.status) {
      case 'pending': return 'Print Label'
      case 'processing': return 'Mark as Packed'
      case 'packed': return 'Mark as Shipped'
      default: return null
    }
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <DashboardHeader
        title="Fulfillment"
        subtitle="Pack, ship & track orders"
        actions={
          <div className="flex gap-2">
            <button className="btn-secondary text-sm px-4 py-2">Batch Labels</button>
            <button className="btn-primary text-sm px-4 py-2">Export</button>
          </div>
        }
      />

      <div className="flex-1 min-h-0 overflow-y-auto">
        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {fulfillmentStats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        {/* Search + Filters */}
        <div className="shrink-0 flex flex-wrap items-center gap-2 mb-3">
          <input
            type="text"
            placeholder="Search order, customer, artist..."
            className="bg-waxe-card border-2 border-waxe-border text-sm text-waxe-text placeholder:text-waxe-text-muted px-3 py-1.5 w-48 lg:w-56 focus:outline-none focus:border-waxe-border-hover"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <FilterDropdown
            label="Status"
            options={['All', 'pending', 'processing', 'packed', 'shipped', 'delivered']}
            value={statusFilter}
            onChange={setStatusFilter}
          />
          <FilterDropdown
            label="Shipping"
            options={['All', 'standard', 'priority', 'express']}
            value={shippingFilter}
            onChange={setShippingFilter}
          />
        </div>

        {/* Order Table */}
        <DataTable headers={['Order', 'Date', 'Customer', 'Items', 'Total', 'Shipping', 'Status', 'Tracking']}>
          {filtered.map((order) => (
            <tr key={order.id} className="table-row hover:bg-waxe-surface/30 transition-colors cursor-pointer" onClick={() => setSelectedOrder(order)}>
              <td className="px-4 py-3">
                <span className="text-xs font-mono text-waxe-text-muted">{order.id}</span>
              </td>
              <td className="px-4 py-3 text-sm text-waxe-text-secondary">{order.date}</td>
              <td className="px-4 py-3 text-sm text-waxe-text">{order.customer.name}</td>
              <td className="px-4 py-3 text-sm text-waxe-text-secondary max-w-[220px] truncate">{itemSummary(order)}</td>
              <td className="px-4 py-3 text-sm font-medium text-waxe-text">${order.total.toFixed(2)}</td>
              <td className="px-4 py-3">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 ${shippingMethodStyle[order.shippingMethod]}`}>
                  {shippingMethodLabel[order.shippingMethod]}
                </span>
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={order.status} />
              </td>
              <td className="px-4 py-3">
                {order.trackingNumber ? (
                  <span className="text-xs font-mono text-waxe-text-muted">{order.trackingNumber.slice(0, 12)}…</span>
                ) : (
                  <span className="text-xs text-waxe-text-muted">—</span>
                )}
              </td>
            </tr>
          ))}
        </DataTable>
      </div>

      {/* ─── Order Detail Modal ─── */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[5vh]">
          <div className="absolute inset-0 bg-waxe-text/40" onClick={() => setSelectedOrder(null)} />
          <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-waxe-base border-2 border-waxe-border rounded-none shadow-xl">
            {/* Header */}
            <div className="sticky top-0 bg-waxe-base border-b border-waxe-border p-5 z-10">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-black text-waxe-text uppercase tracking-tight">{selectedOrder.id}</h2>
                    <StatusBadge status={selectedOrder.status} />
                  </div>
                  <p className="text-xs text-waxe-text-muted mt-1">{selectedOrder.date}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="text-waxe-text-muted hover:text-waxe-text text-lg">✕</button>
              </div>
            </div>

            {/* Body */}
            <div className="p-5 space-y-5">
              {/* Customer */}
              <div className="bg-waxe-surface/30 rounded-none p-4">
                <h3 className="text-[10px] font-black text-waxe-text uppercase tracking-[0.1em] mb-3">Customer</h3>
                <div className="space-y-1.5">
                  <p className="text-sm font-medium text-waxe-text">{selectedOrder.customer.name}</p>
                  <p className="text-xs text-waxe-text-secondary">{selectedOrder.customer.email}</p>
                  <p className="text-xs text-waxe-text-muted">{selectedOrder.customer.address}</p>
                </div>
              </div>

              {/* Items */}
              <div className="bg-waxe-surface/30 rounded-none p-4">
                <h3 className="text-[10px] font-black text-waxe-text uppercase tracking-[0.1em] mb-3">Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div key={item.recordId} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-waxe-deep flex items-center justify-center text-[10px] font-bold text-waxe-text-muted">
                          {item.artist.split(' ').pop()?.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-waxe-text">{item.artist}</p>
                          <p className="text-xs text-waxe-text-muted">{item.title}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-waxe-text">${item.price.toFixed(2)}</p>
                        <p className="text-[10px] text-waxe-text-muted">Qty: {item.qty}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-waxe-border">
                  <span className="text-xs text-waxe-text-muted">Order Total</span>
                  <span className="text-sm font-bold text-waxe-text">${selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Shipping */}
              <div className="bg-waxe-surface/30 rounded-none p-4">
                <h3 className="text-[10px] font-black text-waxe-text uppercase tracking-[0.1em] mb-3">Shipping</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-waxe-text-muted mb-1 block">Method</label>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 ${shippingMethodStyle[selectedOrder.shippingMethod]}`}>
                      {shippingMethodLabel[selectedOrder.shippingMethod]}
                    </span>
                  </div>
                  <div>
                    <label className="text-xs text-waxe-text-muted mb-1 block">Weight</label>
                    <p className="text-sm text-waxe-text">{selectedOrder.weight}</p>
                  </div>
                  <div>
                    <label className="text-xs text-waxe-text-muted mb-1 block">Carrier</label>
                    <p className="text-sm text-waxe-text">{selectedOrder.carrier || '—'}</p>
                  </div>
                  <div>
                    <label className="text-xs text-waxe-text-muted mb-1 block">Tracking #</label>
                    <p className="text-sm font-mono text-waxe-text">{selectedOrder.trackingNumber || '—'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-waxe-border">
                  <input type="checkbox" checked={selectedOrder.labelPrinted} readOnly className="accent-waxe-text w-4 h-4" />
                  <span className="text-sm text-waxe-text">Label printed</span>
                </div>
              </div>

              {/* Actions */}
              {nextAction(selectedOrder) && (
                <div className="flex gap-2">
                  {selectedOrder.status === 'pending' && (
                    <button className="btn-secondary text-sm px-4 py-2 flex-1">Print Label</button>
                  )}
                  {selectedOrder.status === 'processing' && (
                    <button className="btn-primary text-sm px-4 py-2 flex-1">Mark as Packed</button>
                  )}
                  {selectedOrder.status === 'packed' && (
                    <button className="btn-primary text-sm px-4 py-2 flex-1">Mark as Shipped</button>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-waxe-base border-t border-waxe-border p-5 flex items-center justify-end">
              <button className="btn-secondary text-sm px-4 py-2" onClick={() => setSelectedOrder(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
