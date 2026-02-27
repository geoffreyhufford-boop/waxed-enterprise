'use client'

import { useState, useRef } from 'react'
import { DashboardHeader, StatCard, StatusBadge, FilterDropdown, DataTable, DateRangeSelector } from '@/components/dashboard'
import { orders, fulfillmentStats, inventoryRecords, type Order } from '@/lib/dashboard-data'

const shippingMethodLabel: Record<string, string> = {
  standard: 'Standard',
  priority: 'Priority',
  pickup: 'Pickup',
}

const shippingMethodStyle: Record<string, string> = {
  standard: 'text-waxe-text-muted bg-waxe-surface',
  priority: 'text-waxe-text-secondary bg-waxe-text-secondary/10',
  pickup: 'text-waxe-cool bg-waxe-warm/10',
}

function itemSummary(order: Order) {
  const first = order.items[0]
  const label = `${first.artist} — ${first.title}`
  if (order.items.length > 1) return `${label} +${order.items.length - 1} more`
  return label
}

export default function OrdersPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [shippingFilter, setShippingFilter] = useState('All')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [dateRange, setDateRange] = useState('This Month')
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activePanel, setActivePanel] = useState(0)
  const panelCount = 2

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

  const printQueue = inventoryRecords.filter(r => r.inPrintQueue)

  const nextAction = (order: Order) => {
    switch (order.status) {
      case 'unfulfilled': return 'Print Label'
      case 'processing': return 'Mark as Packed'
      case 'label_printed': return 'Mark as Shipped'
      default: return null
    }
  }

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
        title="Orders"
        subtitle="Pack, ship & track orders"
        actions={
          <div className="flex gap-2 items-center">
            <DateRangeSelector presets={['Today', 'This Week', 'This Month']} value={dateRange} onChange={setDateRange} />
            <button className="btn-secondary text-sm px-4 py-2">Batch Labels</button>
            <button className="btn-primary text-sm px-4 py-2">Export</button>
          </div>
        }
      />

      <div className="flex-1 min-h-0 flex flex-col">
        {/* Stats Row */}
        <div className="shrink-0 grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {fulfillmentStats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        {/* Panel tabs */}
        <div className="shrink-0 flex gap-1.5 pb-3 mb-3 w-fit border-b border-waxe-border pr-4">
          {['Orders', 'Print Queue'].map((label, i) => (
            <button
              key={label}
              onClick={() => scrollToPanel(i)}
              className={`text-[11px] font-bold uppercase tracking-[0.1em] px-3 py-1.5 border ${
                activePanel === i
                  ? 'bg-waxe-text text-waxe-deep border-waxe-text'
                  : 'text-waxe-text-muted border-waxe-border hover:text-waxe-text'
              }`}
            >
              {label}
              {label === 'Print Queue' && printQueue.length > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 text-[11px] font-bold bg-waxe-warm text-waxe-deep">{printQueue.length}</span>
              )}
            </button>
          ))}
        </div>

        {/* Horizontal swipe panels */}
        <div className="relative flex-1 min-h-0">
          <div ref={scrollRef} onScroll={handleScroll} className="absolute inset-0 overflow-x-auto overflow-y-hidden snap-x snap-mandatory flex scrollbar-hide" style={{ scrollbarWidth: 'none' }}>

          {/* ── Panel 1: Orders ── */}
          <div className="snap-start shrink-0 w-full flex flex-col min-h-0">
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
                options={['All', 'processing', 'unfulfilled', 'label_printed', 'in_transit', 'delivered']}
                value={statusFilter}
                onChange={setStatusFilter}
              />
              <FilterDropdown
                label="Shipping"
                options={['All', 'standard', 'priority', 'pickup']}
                value={shippingFilter}
                onChange={setShippingFilter}
              />
            </div>

            {/* Order Table */}
            <div className="flex-1 min-h-0">
              <DataTable headers={['Order', 'Date', 'Customer', 'Items', 'Total', 'Type', 'Shipping', 'Status', 'Tracking']} maxHeight="100%">
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
                      <StatusBadge status={order.orderType === 'b2b' ? 'b2b' : 'd2c'} />
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 ${shippingMethodStyle[order.shippingMethod]}`}>
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
          </div>

          {/* ── Panel 2: Print Queue ── */}
          <div className="snap-start shrink-0 w-full flex flex-col min-h-0">
            <div className="bg-waxe-card border-2 border-waxe-border rounded-none flex flex-col flex-1 min-h-0 clip-card">
              <div className="shrink-0 flex items-center justify-between p-5 border-b border-waxe-border">
                <div className="flex items-center gap-3">
                  <button className="btn-ghost text-sm px-2 py-1" onClick={() => scrollToPanel(0)}>
                    {'<< '}Back
                  </button>
                  <div>
                    <h3 className="text-[11px] font-black text-waxe-text uppercase tracking-[0.1em]">Label Print Queue</h3>
                    <p className="text-[11px] text-waxe-text-muted uppercase tracking-[0.1em] mt-1">{printQueue.length} labels ready</p>
                  </div>
                </div>
                {printQueue.length > 0 && (
                  <button className="btn-primary text-sm px-4 py-2">Print All ({printQueue.length})</button>
                )}
              </div>
              <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-2">
                {printQueue.length > 0 ? printQueue.map((record) => (
                  <div key={record.id} className="flex items-center justify-between py-2.5 px-3 bg-waxe-surface/30">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-waxe-text-muted">{record.id}</span>
                      <span className="text-sm text-waxe-text">{record.artist} — {record.title}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-waxe-text">${record.price.toFixed(2)}</span>
                      <button className="text-xs text-waxe-cool hover:text-waxe-warm-hover">Print</button>
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-waxe-text-muted text-center py-8">No labels in queue</p>
                )}
              </div>
            </div>
          </div>

          </div>

          {/* Edge fade + arrow hint */}
          {activePanel < panelCount - 1 && (
            <button
              onClick={() => scrollToPanel(activePanel + 1)}
              className="absolute right-0 top-0 bottom-0 w-32 flex items-center justify-end pr-3 pointer-events-auto z-10"
              style={{ background: 'linear-gradient(to right, transparent 0%, var(--color-waxe-deep) 100%)' }}
              aria-label="Next panel"
            >
              <span className="text-waxe-text-muted text-lg font-black">→</span>
            </button>
          )}
        </div>
      </div>

      {/* ─── Order Detail Modal ─── */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[5vh]">
          <div className="absolute inset-0 bg-waxe-text/40" onClick={() => setSelectedOrder(null)} />
          <div className="relative w-full max-w-2xl h-[90vh] flex flex-col overflow-hidden bg-waxe-base border-2 border-waxe-border rounded-none shadow-xl clip-modal">
            {/* Header */}
            <div className="shrink-0 bg-waxe-base border-b border-waxe-border p-5 z-10">
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
            <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-5">
              {/* Customer */}
              <div className="bg-waxe-surface/30 rounded-none p-4">
                <p className="text-[10px] font-bold text-waxe-text-muted uppercase tracking-[0.1em] mb-3">Customer</p>
                <div className="space-y-1.5">
                  <p className="text-sm font-medium text-waxe-text">{selectedOrder.customer.name}</p>
                  <p className="text-xs text-waxe-text-secondary">{selectedOrder.customer.email}</p>
                  <p className="text-xs text-waxe-text-muted">{selectedOrder.customer.address}</p>
                </div>
              </div>

              {/* Items */}
              <div className="bg-waxe-surface/30 rounded-none p-4">
                <p className="text-[10px] font-bold text-waxe-text-muted uppercase tracking-[0.1em] mb-3">Items</p>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div key={item.recordId} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-waxe-deep flex items-center justify-center text-[11px] font-bold text-waxe-text-muted">
                          {item.artist.split(' ').pop()?.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-waxe-text">{item.artist}</p>
                          <p className="text-xs text-waxe-text-muted">{item.title}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-waxe-text">${item.price.toFixed(2)}</p>
                        <p className="text-[11px] text-waxe-text-muted">Qty: {item.qty}</p>
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
                <p className="text-[10px] font-bold text-waxe-text-muted uppercase tracking-widest mb-3">Shipping</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-waxe-text-muted mb-1 block">Method</label>
                    <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 ${shippingMethodStyle[selectedOrder.shippingMethod]}`}>
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
                  {selectedOrder.status === 'unfulfilled' && (
                    <button className="btn-secondary text-sm px-4 py-2 flex-1">Print Label</button>
                  )}
                  {selectedOrder.status === 'processing' && (
                    <button className="btn-primary text-sm px-4 py-2 flex-1">Mark as Packed</button>
                  )}
                  {selectedOrder.status === 'label_printed' && (
                    <button className="btn-primary text-sm px-4 py-2 flex-1">Mark as Shipped</button>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="shrink-0 bg-waxe-base border-t border-waxe-border p-5 flex items-center justify-end">
              <button className="btn-secondary text-sm px-4 py-2" onClick={() => setSelectedOrder(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
