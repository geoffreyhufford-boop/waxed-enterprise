'use client'

import { useState, useRef } from 'react'
import { DashboardHeader, StatCard, StatusBadge, FilterDropdown, DataTable, DateRangeSelector } from '@/components/dashboard'
import { orders, fulfillmentStats, inventoryRecords, type Order } from '@/lib/dashboard-data'
import { exportToCSV } from '@/lib/export-utils'
import { purchaseOrders, type PurchaseOrder } from '@/lib/purchase-order-data'

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
 const panelCount = 3
 const [poStatusFilter, setPOStatusFilter] = useState('All')
 const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null)

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

 const filteredPOs = purchaseOrders.filter((po) => {
  if (poStatusFilter !== 'All' && po.status !== poStatusFilter) return false
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

 const handleExport = () => {
  const exportData = filtered.map((o) => ({
   id: o.id,
   date: o.date,
   customer: o.customer.name,
   items: o.items.map(i => `${i.artist} - ${i.title}`).join('; '),
   total: o.total.toFixed(2),
   status: o.status,
   shipping: o.shippingMethod,
   tracking: o.trackingNumber || '',
  }))
  exportToCSV(exportData as unknown as Record<string, unknown>[], `orders-${new Date().toISOString().slice(0, 10)}`, [
   { key: 'id', header: 'Order ID' },
   { key: 'date', header: 'Date' },
   { key: 'customer', header: 'Customer' },
   { key: 'items', header: 'Items' },
   { key: 'total', header: 'Total' },
   { key: 'status', header: 'Status' },
   { key: 'shipping', header: 'Shipping' },
   { key: 'tracking', header: 'Tracking' },
  ])
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
      <button className="btn-primary text-sm px-4 py-2" onClick={handleExport}>Export</button>
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
     {['Orders', 'Print Queue', 'Purchase Orders'].map((label, i) => (
      <button
       key={label}
       onClick={() => scrollToPanel(i)}
       className={`text-[11px] font-medium px-3 py-1.5 border transition-colors ${
        activePanel === i
         ? 'bg-waxe-text text-waxe-deep border-waxe-text'
         : 'text-waxe-text bg-waxe-card/80 backdrop-blur-sm border-waxe-border hover:border-waxe-border-hover'
       }`}
      >
       {label}
       {label === 'Print Queue' && printQueue.length > 0 && (
        <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 text-[11px] font-medium bg-waxe-warm text-waxe-deep">{printQueue.length}</span>
       )}
       {label === 'Purchase Orders' && (
        <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 text-[11px] font-medium bg-waxe-cool text-waxe-deep">{purchaseOrders.length}</span>
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
        className="bg-waxe-card border border-waxe-border text-sm text-waxe-text placeholder:text-waxe-text-secondary px-3 py-1.5 w-48 lg:w-56 focus:outline-none focus:border-waxe-border-hover"
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
           <span className="text-xs font-mono text-waxe-text-secondary">{order.id}</span>
          </td>
          <td className="px-4 py-3 text-sm text-waxe-text">{order.date}</td>
          <td className="px-4 py-3 text-sm text-waxe-text">{order.customer.name}</td>
          <td className="px-4 py-3 text-sm text-waxe-text max-w-[220px] truncate">{itemSummary(order)}</td>
          <td className="px-4 py-3 text-sm font-medium text-waxe-text">${order.total.toFixed(2)}</td>
          <td className="px-4 py-3">
           <StatusBadge status={order.orderType === 'b2b' ? 'b2b' : 'd2c'} />
          </td>
          <td className="px-4 py-3">
           <span className={`text-[11px] font-medium px-2 py-0.5 ${shippingMethodStyle[order.shippingMethod]}`}>
            {shippingMethodLabel[order.shippingMethod]}
           </span>
          </td>
          <td className="px-4 py-3">
           <StatusBadge status={order.status} />
          </td>
          <td className="px-4 py-3">
           {order.trackingNumber ? (
            <span className="text-xs font-mono text-waxe-text-secondary">{order.trackingNumber.slice(0, 12)}…</span>
           ) : (
            <span className="text-xs text-waxe-text-secondary">—</span>
           )}
          </td>
         </tr>
        ))}
       </DataTable>
      </div>
     </div>

     {/* ── Panel 2: Print Queue ── */}
     <div className="snap-start shrink-0 w-full flex flex-col min-h-0">
      <div className="bg-waxe-card border border-waxe-border flex flex-col flex-1 min-h-0 clip-card">
       <div className="shrink-0 flex items-center justify-between p-5 border-b border-waxe-border">
        <div className="flex items-center gap-3">
         <button className="btn-ghost text-sm px-2 py-1" onClick={() => scrollToPanel(0)}>
          {'<< '}Back
         </button>
         <div>
          <h3 className="text-[11px] font-semibold text-waxe-text">Label Print Queue</h3>
          <p className="text-[11px] text-waxe-text-muted mt-1">{printQueue.length} labels ready</p>
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

     {/* ── Panel 3: Purchase Orders ── */}
     <div className="snap-start shrink-0 w-full flex flex-col min-h-0">
      <div className="bg-waxe-card border border-waxe-border flex flex-col flex-1 min-h-0 clip-card">
       <div className="shrink-0 flex items-center justify-between p-5 border-b border-waxe-border">
        <div className="flex items-center gap-3">
         <button className="btn-ghost text-sm px-2 py-1" onClick={() => scrollToPanel(0)}>
          {'<< '}Back
         </button>
         <div>
          <h3 className="text-[11px] font-semibold text-waxe-text">Purchase Orders</h3>
          <p className="text-[11px] text-waxe-text-muted mt-1">{purchaseOrders.length} orders</p>
         </div>
        </div>
        <button className="btn-primary text-sm px-4 py-2">+ New PO</button>
       </div>
       <div className="shrink-0 flex items-center gap-2 px-5 pt-3">
        <FilterDropdown
         label="Status"
         options={['All', 'draft', 'sent', 'partially_received', 'received', 'closed']}
         value={poStatusFilter}
         onChange={setPOStatusFilter}
        />
       </div>
       <div className="flex-1 min-h-0 overflow-y-auto p-5">
        <DataTable headers={['PO #', 'Supplier', 'Date', 'Items', 'Total', 'Status']} maxHeight="100%">
         {filteredPOs.map((po) => (
          <tr key={po.id} className="table-row hover:bg-waxe-surface/30 transition-colors cursor-pointer" onClick={() => setSelectedPO(po)}>
           <td className="px-4 py-3 text-xs font-mono text-waxe-text-secondary">{po.id}</td>
           <td className="px-4 py-3 text-sm text-waxe-text">{po.supplierName}</td>
           <td className="px-4 py-3 text-sm text-waxe-text">{po.createdDate}</td>
           <td className="px-4 py-3 text-sm text-waxe-text">{po.lineItems.length}</td>
           <td className="px-4 py-3 text-sm font-medium text-waxe-text font-mono">${po.total.toFixed(2)}</td>
           <td className="px-4 py-3"><StatusBadge status={po.status} /></td>
          </tr>
         ))}
        </DataTable>
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
       <span className="text-waxe-text-muted text-lg font-semibold">→</span>
      </button>
     )}
    </div>
   </div>

   {/* ─── Order Detail Modal ─── */}
   {selectedOrder && (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[5vh]">
     <div className="absolute inset-0 bg-waxe-text/40" onClick={() => setSelectedOrder(null)} />
     <div className="relative w-full max-w-2xl h-[90vh] flex flex-col overflow-hidden bg-waxe-base border border-waxe-border shadow-xl clip-modal">
      {/* Header */}
      <div className="shrink-0 bg-waxe-base border-b border-waxe-border p-5 z-10">
       <div className="flex items-center justify-between">
        <div>
         <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-waxe-text">{selectedOrder.id}</h2>
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
       <div className="bg-waxe-surface/30 p-4">
        <p className="text-[10px] font-medium text-waxe-text-muted mb-3">Customer</p>
        <div className="space-y-1.5">
         <a href="/dashboard/customers" className="text-sm font-medium text-waxe-text hover:text-waxe-warm">{selectedOrder.customer.name}</a>
         <p className="text-xs text-waxe-text-secondary">{selectedOrder.customer.email}</p>
         <p className="text-xs text-waxe-text-muted">{selectedOrder.customer.address}</p>
        </div>
       </div>

       {/* Items */}
       <div className="bg-waxe-surface/30 p-4">
        <p className="text-[10px] font-medium text-waxe-text-muted mb-3">Items</p>
        <div className="space-y-3">
         {selectedOrder.items.map((item) => (
          <div key={item.recordId} className="flex items-center justify-between">
           <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-waxe-deep flex items-center justify-center text-[11px] font-medium text-waxe-text-muted">
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
       <div className="bg-waxe-surface/30 p-4">
        <p className="text-[10px] font-medium text-waxe-text-mutedst mb-3">Shipping</p>
        <div className="grid grid-cols-2 gap-4">
         <div>
          <label className="text-xs text-waxe-text-muted mb-1 block">Method</label>
          <span className={`text-[11px] font-medium px-2 py-0.5 ${shippingMethodStyle[selectedOrder.shippingMethod]}`}>
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

   {/* ─── PO Detail Modal ─── */}
   {selectedPO && (() => {
    const totalOrdered = selectedPO.lineItems.reduce((s, li) => s + li.qtyOrdered, 0)
    const totalReceived = selectedPO.lineItems.reduce((s, li) => s + li.qtyReceived, 0)
    const receivePct = totalOrdered > 0 ? Math.round((totalReceived / totalOrdered) * 100) : 0
    return (
     <div className="fixed inset-0 z-50 flex items-start justify-center pt-[5vh]">
      <div className="absolute inset-0 bg-waxe-text/40" onClick={() => setSelectedPO(null)} />
      <div className="relative w-full max-w-2xl h-[90vh] flex flex-col overflow-hidden bg-waxe-base border border-waxe-border shadow-xl clip-modal">
       {/* Header */}
       <div className="shrink-0 bg-waxe-base border-b border-waxe-border p-5 z-10">
        <div className="flex items-center justify-between">
         <div>
          <div className="flex items-center gap-3">
           <h2 className="text-xl font-semibold text-waxe-text">{selectedPO.id}</h2>
           <StatusBadge status={selectedPO.status} />
          </div>
          <p className="text-xs text-waxe-text-muted mt-1">{selectedPO.supplierName} · Created {selectedPO.createdDate}</p>
         </div>
         <button onClick={() => setSelectedPO(null)} className="text-waxe-text-muted hover:text-waxe-text text-lg">✕</button>
        </div>
       </div>

       {/* Body */}
       <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-5">
        {/* Progress */}
        <div className="bg-waxe-surface/30 p-4">
         <div className="flex items-center justify-between text-xs text-waxe-text-muted mb-1">
          <span>Receiving Progress</span>
          <span className="font-mono">{totalReceived}/{totalOrdered} items ({receivePct}%)</span>
         </div>
         <div className="w-full h-2 bg-waxe-surface overflow-hidden">
          <div className="h-full bg-waxe-positive transition-all" style={{ width: `${receivePct}%` }} />
         </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
         <div className="bg-waxe-surface/30 p-3">
          <p className="text-[10px] text-waxe-text-muted">Created</p>
          <p className="text-sm text-waxe-text">{selectedPO.createdDate}</p>
         </div>
         <div className="bg-waxe-surface/30 p-3">
          <p className="text-[10px] text-waxe-text-muted">Sent</p>
          <p className="text-sm text-waxe-text">{selectedPO.sentDate || '—'}</p>
         </div>
         <div className="bg-waxe-surface/30 p-3">
          <p className="text-[10px] text-waxe-text-muted">Expected</p>
          <p className="text-sm text-waxe-text">{selectedPO.expectedDelivery || '—'}</p>
         </div>
         <div className="bg-waxe-surface/30 p-3">
          <p className="text-[10px] text-waxe-text-muted">Received</p>
          <p className="text-sm text-waxe-text">{selectedPO.receivedDate || '—'}</p>
         </div>
        </div>

        {/* Line Items */}
        <DataTable headers={['Record', 'Format', 'Catalog #', 'Unit Cost', 'Ordered', 'Received', '']}>
         {selectedPO.lineItems.map((li) => (
          <tr key={li.id} className="table-row hover:bg-waxe-surface/30">
           <td className="px-4 py-2.5">
            <p className="text-sm text-waxe-text">{li.artist}</p>
            <p className="text-xs text-waxe-text-secondary">{li.title}</p>
           </td>
           <td className="px-4 py-2.5 text-sm text-waxe-text">{li.format}</td>
           <td className="px-4 py-2.5 text-xs font-mono text-waxe-text-secondary">{li.catalogNo || '—'}</td>
           <td className="px-4 py-2.5 text-sm text-waxe-text font-mono">${li.unitCost.toFixed(2)}</td>
           <td className="px-4 py-2.5 text-sm text-waxe-text text-center font-mono">{li.qtyOrdered}</td>
           <td className="px-4 py-2.5 text-sm text-center font-mono">
            <span className={li.qtyReceived >= li.qtyOrdered ? 'text-waxe-positive' : li.qtyReceived > 0 ? 'text-waxe-warm' : 'text-waxe-text-secondary'}>
             {li.qtyReceived}
            </span>
           </td>
           <td className="px-4 py-2.5">
            {li.qtyReceived < li.qtyOrdered && (
             <button className="text-[10px] font-medium text-waxe-cool hover:text-waxe-warm">Receive</button>
            )}
           </td>
          </tr>
         ))}
        </DataTable>

        {/* Totals */}
        <div className="bg-waxe-surface/30 p-4">
         <div className="space-y-2">
          <div className="flex justify-between text-sm">
           <span className="text-waxe-text-muted">Subtotal</span>
           <span className="text-waxe-text font-mono">${selectedPO.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
           <span className="text-waxe-text-muted">Shipping</span>
           <span className="text-waxe-text font-mono">${selectedPO.shippingCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm font-bold pt-2 border-t border-waxe-border">
           <span className="text-waxe-text">Total</span>
           <span className="text-waxe-text font-mono">${selectedPO.total.toFixed(2)}</span>
          </div>
         </div>
        </div>

        {/* Notes */}
        {selectedPO.notes && (
         <div className="bg-waxe-surface/30 p-4">
          <p className="text-[10px] font-medium text-waxe-text-muted mb-2">Notes</p>
          <p className="text-sm text-waxe-text-secondary">{selectedPO.notes}</p>
         </div>
        )}

        <p className="text-xs text-waxe-text-muted">Created by {selectedPO.createdBy}</p>
       </div>

       {/* Footer */}
       <div className="shrink-0 bg-waxe-base border-t border-waxe-border p-5 flex items-center justify-end">
        <button className="btn-secondary text-sm px-4 py-2" onClick={() => setSelectedPO(null)}>Close</button>
       </div>
      </div>
     </div>
    )
   })()}
  </div>
 )
}
