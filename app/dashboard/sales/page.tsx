'use client'

import { useState, useRef, useEffect } from 'react'
import { DashboardHeader, StatusBadge, FilterDropdown, DataTable, DateRangeSelector } from '@/components/dashboard'
import { orders, fulfillmentStats, inventoryRecords, transactions, type Order } from '@/lib/dashboard-data'
import { exportToCSV } from '@/lib/export-utils'
import { purchaseOrders, type PurchaseOrder } from '@/lib/purchase-order-data'
import { getCreditAccount } from '@/lib/store-credit-data'

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

const methodIcons: Record<string, string> = {
 card: '\u25B0',
 cash: '\u25A4',
 tap: '\u25CE',
 store_credit: '\u25C7',
}

function itemSummary(order: Order) {
 const first = order.items[0]
 const label = `${first.artist} — ${first.title}`
 if (order.items.length > 1) return `${label} +${order.items.length - 1} more`
 return label
}

const quickLookupResults = inventoryRecords.slice(0, 5)

export default function SalesPage() {
 const [search, setSearch] = useState('')
 const [statusFilter, setStatusFilter] = useState('All')
 const [shippingFilter, setShippingFilter] = useState('All')
 const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
 const [dateRange, setDateRange] = useState('This Month')
 const scrollRef = useRef<HTMLDivElement>(null)
 const [activePanel, setActivePanel] = useState(0)
 const panelCount = 4
 const [poStatusFilter, setPOStatusFilter] = useState('All')
 const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null)
 const [actionsOpen, setActionsOpen] = useState(false)
 const actionsRef = useRef<HTMLDivElement>(null)
 const [toastMessage, setToastMessage] = useState<string | null>(null)
 const [confirmAction, setConfirmAction] = useState<{ type: 'refund' | 'cancel'; order: Order } | null>(null)
 const [refundMethod, setRefundMethod] = useState<'original' | 'store_credit'>('original')
 const [lookupQuery, setLookupQuery] = useState('')
 const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set())
 const [bulkMenuOpen, setBulkMenuOpen] = useState(false)
 const bulkRef = useRef<HTMLDivElement>(null)
 const [showDraftModal, setShowDraftModal] = useState(false)
 const [draftCustomer, setDraftCustomer] = useState('')
 const [draftCustomerSearch, setDraftCustomerSearch] = useState('')
 const [draftItems, setDraftItems] = useState<{ recordId: string; artist: string; title: string; price: number; qty: number }[]>([])
 const [draftItemSearch, setDraftItemSearch] = useState('')
 const [draftNotes, setDraftNotes] = useState('')
 const [draftHold, setDraftHold] = useState(false)
 const [mobilePOS, setMobilePOS] = useState(false)
 const [mobileTotal, setMobileTotal] = useState('')
 const [mobileItemSearch, setMobileItemSearch] = useState('')

 useEffect(() => {
  if (!bulkMenuOpen) return
  const handleClick = (e: MouseEvent) => {
   if (bulkRef.current && !bulkRef.current.contains(e.target as Node)) setBulkMenuOpen(false)
  }
  document.addEventListener('mousedown', handleClick)
  return () => document.removeEventListener('mousedown', handleClick)
 }, [bulkMenuOpen])

 const toggleOrderSelect = (id: string, e: React.MouseEvent) => {
  e.stopPropagation()
  const next = new Set(selectedOrders)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  setSelectedOrders(next)
 }

 const toggleSelectAll = () => {
  if (selectedOrders.size === filtered.length) setSelectedOrders(new Set())
  else setSelectedOrders(new Set(filtered.map(o => o.id)))
 }

 const handleBulkAction = (action: string) => {
  setToastMessage(`${action}: ${selectedOrders.size} order${selectedOrders.size !== 1 ? 's' : ''}`)
  setSelectedOrders(new Set())
  setBulkMenuOpen(false)
 }

 useEffect(() => {
  if (!toastMessage) return
  const t = setTimeout(() => setToastMessage(null), 3000)
  return () => clearTimeout(t)
 }, [toastMessage])

 useEffect(() => {
  if (!actionsOpen) return
  const handleClick = (e: MouseEvent) => {
   if (actionsRef.current && !actionsRef.current.contains(e.target as Node)) setActionsOpen(false)
  }
  document.addEventListener('mousedown', handleClick)
  return () => document.removeEventListener('mousedown', handleClick)
 }, [actionsOpen])

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

 const lookupResults = lookupQuery
  ? inventoryRecords.filter(r => {
    const q = lookupQuery.toLowerCase()
    return r.artist.toLowerCase().includes(q) || r.title.toLowerCase().includes(q) || r.id.toLowerCase().includes(q)
   }).slice(0, 6)
  : quickLookupResults

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

 const handleEditOrder = () => {
  if (!selectedOrder) return
  setActionsOpen(false)
  setToastMessage(`Edit mode for ${selectedOrder.id} (coming soon)`)
 }

 const handleRefundOrder = () => {
  if (!selectedOrder) return
  setActionsOpen(false)
  setRefundMethod('original')
  setConfirmAction({ type: 'refund', order: selectedOrder })
 }

 const handleCancelOrder = () => {
  if (!selectedOrder) return
  setActionsOpen(false)
  setConfirmAction({ type: 'cancel', order: selectedOrder })
 }

 const handleConfirmAction = () => {
  if (!confirmAction) return
  const newStatus = confirmAction.type === 'refund' ? 'refunded' : 'cancelled'
  const updated = { ...confirmAction.order, status: newStatus } as Order
  setSelectedOrder(updated)
  if (confirmAction.type === 'refund') {
   setToastMessage(
    refundMethod === 'store_credit'
     ? `$${confirmAction.order.total.toFixed(2)} credited to ${confirmAction.order.customer.name}'s store credit`
     : `${confirmAction.order.id} refunded to original payment method`
   )
  } else {
   setToastMessage(`${confirmAction.order.id} cancelled`)
  }
  setConfirmAction(null)
 }

 const handlePrintOrderSlip = () => {
  const el = document.getElementById('order-slip-content')
  if (!el) return
  el.classList.add('print-target')
  window.print()
  el.classList.remove('print-target')
 }

 return (
  <div className="flex flex-col flex-1 min-h-0">
   <DashboardHeader
    title="Orders"
    subtitle="Sales orders, POS transactions & fulfillment"
    actions={
     <div className="flex gap-2 items-center">
      <StatusBadge status="connected" label="Square" />
      <DateRangeSelector presets={['Today', 'This Week', 'This Month']} value={dateRange} onChange={setDateRange} />
      <button className="btn-ghost text-sm px-4 py-2" onClick={handleExport}>Export</button>
      <button className="btn-primary text-sm px-4 py-2" onClick={() => { setShowDraftModal(true); setDraftCustomer(''); setDraftCustomerSearch(''); setDraftItems([]); setDraftItemSearch(''); setDraftNotes(''); setDraftHold(false) }}>+ Draft Order</button>
     </div>
    }
   />

   <div className="flex-1 min-h-0 flex flex-col">
    {/* Panel tabs */}
    <div className="shrink-0 flex gap-1.5 pb-3 mb-3 w-fit border-b border-waxe-border pr-4">
     {['Sales Orders', 'POS', 'Print Queue', 'Purchase Orders'].map((label, i) => (
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

     {/* ── Panel 1: Sales Orders ── */}
     <div className="snap-start shrink-0 w-full flex flex-col min-h-0">
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
        options={['All', 'draft', 'processing', 'unfulfilled', 'label_printed', 'in_transit', 'delivered', 'refunded', 'cancelled']}
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

      {/* Bulk action bar */}
      {selectedOrders.size > 0 && (
       <div className="shrink-0 flex items-center gap-3 mb-3 px-3 py-2 bg-waxe-surface/50 border border-waxe-border">
        <span className="text-[12px] font-medium text-waxe-text">{selectedOrders.size} selected</span>
        <div className="relative" ref={bulkRef}>
         <button className="btn-ghost text-[11px] px-3 py-1" onClick={() => setBulkMenuOpen(!bulkMenuOpen)}>
          Actions ▾
         </button>
         {bulkMenuOpen && (
          <div className="absolute top-full left-0 mt-1 w-48 bg-waxe-card border border-waxe-border shadow-lg z-20">
           {['Print Labels', 'Mark Fulfilled', 'Mark Unfulfilled', 'Archive Orders', 'Delete Orders'].map((action) => (
            <button key={action} onClick={() => handleBulkAction(action)} className="w-full text-left px-3 py-2 text-[12px] text-waxe-text hover:bg-waxe-surface/50 transition-colors">
             {action}
            </button>
           ))}
          </div>
         )}
        </div>
        <button className="text-[11px] text-waxe-text-muted hover:text-waxe-text ml-auto" onClick={() => setSelectedOrders(new Set())}>
         Clear
        </button>
       </div>
      )}

      <div className="flex-1 min-h-0">
       <DataTable headers={[' ', 'Order', 'Date', 'Customer', 'Items', 'Total', 'Sales Channel', 'Shipping', 'Status', 'Tracking']} maxHeight="100%">
        {filtered.map((order) => (
         <tr key={order.id} className="table-row hover:bg-waxe-surface/30 transition-colors cursor-pointer" onClick={() => setSelectedOrder(order)}>
          <td className="px-4 py-3 w-8" onClick={(e) => toggleOrderSelect(order.id, e)}>
           <input type="checkbox" checked={selectedOrders.has(order.id)} readOnly className="accent-waxe-warm" />
          </td>
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

     {/* ── Panel 2: POS ── */}
     <div className="snap-start shrink-0 w-full flex flex-col min-h-0">
      <div className="flex-1 min-h-0 overflow-y-auto space-y-4">
       {/* Quick Record Lookup */}
       <div className="bg-waxe-card border border-waxe-border p-5 flex flex-col clip-card">
        <div className="flex items-center justify-between mb-4 shrink-0">
         <div className="flex items-center gap-3">
          <button className="btn-ghost text-sm px-2 py-1" onClick={() => scrollToPanel(0)}>
           {'<< '}Back
          </button>
          <h3 className="text-[11px] font-semibold text-waxe-text">Quick Lookup</h3>
         </div>
         <div className="flex items-center gap-3">
          <StatusBadge status="connected" label="Square" />
          <button className="btn-secondary text-sm px-3 py-1.5">Sync Now</button>
          <button className={`text-sm px-4 py-1.5 flex items-center gap-2 ${mobilePOS ? 'bg-waxe-positive text-waxe-deep' : 'btn-primary'}`} onClick={() => { setMobilePOS(!mobilePOS); if (!mobilePOS) setToastMessage('Mobile POS activated — record fair mode') }}>
           {'\u25CE'} {mobilePOS ? 'Live' : 'Go Mobile'}
          </button>
         </div>
        </div>
        <input
         type="text"
         placeholder="Search artist, title, or ID..."
         className="bg-waxe-card border border-waxe-border text-sm text-waxe-text placeholder:text-waxe-text-secondary px-3 py-2 mb-4 focus:outline-none focus:border-waxe-border-hover shrink-0"
         style={{ fontFamily: 'var(--font-mono)' }}
         value={lookupQuery}
         onChange={(e) => setLookupQuery(e.target.value)}
        />
        <div className="space-y-1">
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

       {/* Mobile POS Panel */}
       {mobilePOS && (
        <div className="bg-waxe-card border-2 border-waxe-positive p-5 clip-card">
         <div className="flex items-center justify-between mb-4">
          <div>
           <h3 className="text-[11px] font-semibold text-waxe-positive">Mobile POS — Record Fair Mode</h3>
           <p className="text-[11px] text-waxe-text-muted mt-1">Quick sale: search inventory, enter total, or add custom item</p>
          </div>
          <button className="text-xs text-waxe-text-muted hover:text-waxe-text" onClick={() => setMobilePOS(false)}>Deactivate</button>
         </div>
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Quick total */}
          <div className="bg-waxe-surface/30 border border-waxe-border p-4">
           <label className="text-[10px] font-medium text-waxe-text-muted mb-2 block">Quick Sale — Enter Total</label>
           <div className="flex gap-2">
            <input
             type="text"
             placeholder="$0.00"
             className="input-field flex-1 text-lg font-mono"
             value={mobileTotal}
             onChange={(e) => setMobileTotal(e.target.value)}
            />
            <button className="btn-primary text-sm px-4" disabled={!mobileTotal}>Charge</button>
           </div>
          </div>
          {/* Search inventory */}
          <div className="bg-waxe-surface/30 border border-waxe-border p-4">
           <label className="text-[10px] font-medium text-waxe-text-muted mb-2 block">Search Inventory</label>
           <input
            type="text"
            placeholder="Scan barcode or search..."
            className="input-field w-full text-sm"
            value={mobileItemSearch}
            onChange={(e) => setMobileItemSearch(e.target.value)}
           />
          </div>
          {/* Payment methods */}
          <div className="bg-waxe-surface/30 border border-waxe-border p-4">
           <label className="text-[10px] font-medium text-waxe-text-muted mb-2 block">Payment Method</label>
           <div className="grid grid-cols-2 gap-2">
            {[
             { icon: '\u25CE', label: 'NFC Tap', desc: 'Phone-to-phone' },
             { icon: '\u25B0', label: 'Card', desc: 'Swipe/dip' },
             { icon: '\u25A4', label: 'Cash', desc: 'Manual entry' },
             { icon: '\u25C7', label: 'Credit', desc: 'Store credit' },
            ].map(m => (
             <button key={m.label} className="p-2 border border-waxe-border hover:border-waxe-positive text-center transition-colors bg-waxe-card">
              <span className="text-lg block">{m.icon}</span>
              <span className="text-[11px] font-medium text-waxe-text block">{m.label}</span>
              <span className="text-[9px] text-waxe-text-muted">{m.desc}</span>
             </button>
            ))}
           </div>
          </div>
         </div>
        </div>
       )}

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

     {/* ── Panel 3: Print Queue ── */}
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

     {/* ── Panel 4: Purchase Orders ── */}
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
         options={['All', 'draft', 'delivered', 'partially_received', 'received', 'closed']}
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
      <div className="shrink-0 bg-waxe-card border-b border-waxe-border p-5 z-10">
       <div className="flex items-center justify-between">
        <div>
         <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-waxe-text">{selectedOrder.id}</h2>
          <StatusBadge status={selectedOrder.status} />
         </div>
         <p className="text-xs text-waxe-text-muted mt-1">{selectedOrder.date}</p>
        </div>
        <div className="flex items-center gap-2">
         <div ref={actionsRef} className="relative">
          <button onClick={() => setActionsOpen(!actionsOpen)} className="btn-ghost text-sm px-3 py-1.5">
           Actions <span className="ml-1 text-[10px]">&#9662;</span>
          </button>
          {actionsOpen && (
           <div className="absolute right-0 top-full mt-1 w-48 bg-waxe-card border border-waxe-border shadow-lg z-40 py-1">
            <button onClick={handleEditOrder} className="w-full text-left px-4 py-2 text-sm text-waxe-text hover:bg-waxe-surface/50 transition-colors">
             Edit Order
            </button>
            <button onClick={handleRefundOrder} className="w-full text-left px-4 py-2 text-sm text-waxe-text hover:bg-waxe-surface/50 transition-colors">
             Refund Order
            </button>
            <div className="my-1 border-t border-waxe-border" />
            <button onClick={handleCancelOrder} className="w-full text-left px-4 py-2 text-sm text-waxe-negative hover:bg-waxe-surface/50 transition-colors">
             Cancel Order
            </button>
           </div>
          )}
         </div>
         <button onClick={() => { setActionsOpen(false); setSelectedOrder(null) }} className="text-waxe-text-muted hover:text-waxe-text text-lg">✕</button>
        </div>
       </div>
      </div>

      <div id="order-slip-content" className="flex-1 min-h-0 overflow-y-auto p-5 space-y-5">
       <div className="bg-waxe-surface/30 border border-waxe-border/50 p-4">
        <p className="text-[10px] font-medium text-waxe-text-muted mb-3">Customer</p>
        <div className="space-y-1.5">
         <a href="/dashboard/customers" className="text-sm font-medium text-waxe-text hover:text-waxe-warm">{selectedOrder.customer.name}</a>
         <p className="text-xs text-waxe-text-secondary">{selectedOrder.customer.email}</p>
         <p className="text-xs text-waxe-text-muted">{selectedOrder.customer.address}</p>
        </div>
       </div>

       <div className="bg-waxe-surface/30 border border-waxe-border/50 p-4">
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

       <div className="bg-waxe-surface/30 border border-waxe-border/50 p-4">
        <p className="text-[10px] font-medium text-waxe-text-muted mb-3">Shipping</p>
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

      <div className="shrink-0 bg-waxe-card border-t border-waxe-border p-5 flex items-center justify-between">
       <button className="btn-secondary text-sm px-4 py-2" onClick={handlePrintOrderSlip}>Print Order Slip</button>
       <button className="btn-secondary text-sm px-4 py-2" onClick={() => setSelectedOrder(null)}>Close</button>
      </div>
     </div>
    </div>
   )}

   {/* ─── Confirmation Dialog ─── */}
   {confirmAction && (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
     <div className="absolute inset-0 bg-waxe-text/50" onClick={() => setConfirmAction(null)} />
     <div className="relative w-full max-w-sm bg-waxe-base border border-waxe-border shadow-xl p-6">
      <h3 className="text-lg font-semibold text-waxe-text mb-2">
       {confirmAction.type === 'refund' ? 'Refund Order' : 'Cancel Order'}
      </h3>
      {confirmAction.type === 'refund' ? (
       <div className="mb-5">
        <p className="text-sm text-waxe-text-secondary mb-4">
         Issue a full refund of ${confirmAction.order.total.toFixed(2)} for {confirmAction.order.id}?
        </p>
        <p className="text-[10px] font-medium text-waxe-text-muted mb-2">Refund Method</p>
        <div className="space-y-2">
         <label className={`flex items-center gap-3 p-3 border cursor-pointer transition-colors ${refundMethod === 'original' ? 'border-waxe-text bg-waxe-surface/30' : 'border-waxe-border hover:border-waxe-border-hover'}`}>
          <input
           type="radio"
           name="refundMethod"
           checked={refundMethod === 'original'}
           onChange={() => setRefundMethod('original')}
           className="accent-waxe-text"
          />
          <div>
           <p className="text-sm font-medium text-waxe-text">Refund to original payment</p>
           <p className="text-xs text-waxe-text-muted">Return funds to the customer&apos;s original payment method</p>
          </div>
         </label>
         <label className={`flex items-center gap-3 p-3 border cursor-pointer transition-colors ${refundMethod === 'store_credit' ? 'border-waxe-text bg-waxe-surface/30' : 'border-waxe-border hover:border-waxe-border-hover'}`}>
          <input
           type="radio"
           name="refundMethod"
           checked={refundMethod === 'store_credit'}
           onChange={() => setRefundMethod('store_credit')}
           className="accent-waxe-text"
          />
          <div>
           <p className="text-sm font-medium text-waxe-text">Refund to store credit</p>
           <p className="text-xs text-waxe-text-muted">
            Add ${confirmAction.order.total.toFixed(2)} to {confirmAction.order.customer.name}&apos;s credit balance
            {(() => {
             const existing = getCreditAccount(confirmAction.order.customer.name)
             return existing ? ` (current: $${existing.balance.toFixed(2)})` : ''
            })()}
           </p>
          </div>
         </label>
        </div>
       </div>
      ) : (
       <p className="text-sm text-waxe-text-secondary mb-5">
        This will cancel {confirmAction.order.id}. This action cannot be undone.
       </p>
      )}
      <div className="flex items-center justify-end gap-3">
       <button className="btn-secondary text-sm px-4 py-2" onClick={() => setConfirmAction(null)}>No, Go Back</button>
       <button
        className={`text-sm px-4 py-2 font-medium ${confirmAction.type === 'cancel' ? 'bg-waxe-negative text-waxe-deep hover:bg-waxe-negative/80' : 'btn-primary'}`}
        onClick={handleConfirmAction}
       >
        {confirmAction.type === 'refund' ? 'Confirm Refund' : 'Cancel Order'}
       </button>
      </div>
     </div>
    </div>
   )}

   {/* ─── Toast ─── */}
   {toastMessage && (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] bg-waxe-text text-waxe-deep text-sm font-medium px-5 py-2.5 shadow-lg">
     {toastMessage}
    </div>
   )}

   {/* ─── Draft Order Modal ─── */}
   {showDraftModal && (() => {
    const draftTotal = draftItems.reduce((s, i) => s + i.price * i.qty, 0)
    const draftSearchResults = draftItemSearch
     ? inventoryRecords.filter(r => {
       const q = draftItemSearch.toLowerCase()
       return (r.artist.toLowerCase().includes(q) || r.title.toLowerCase().includes(q)) && r.status === 'active'
      }).slice(0, 5)
     : []
    const customerResults = draftCustomerSearch
     ? orders
       .map(o => o.customer)
       .filter((c, i, arr) => arr.findIndex(x => x.email === c.email) === i)
       .filter(c => c.name.toLowerCase().includes(draftCustomerSearch.toLowerCase()) || c.email.toLowerCase().includes(draftCustomerSearch.toLowerCase()))
       .slice(0, 5)
     : []

    return (
     <div className="fixed inset-0 z-50 flex items-start justify-center pt-[5vh]">
      <div className="absolute inset-0 bg-waxe-text/40" onClick={() => setShowDraftModal(false)} />
      <div className="relative w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden bg-waxe-base border border-waxe-border shadow-xl clip-modal">
       <div className="shrink-0 bg-waxe-card border-b border-waxe-border p-5">
        <div className="flex items-center justify-between">
         <div>
          <h2 className="text-lg font-semibold text-waxe-text">Create Draft Order</h2>
          <p className="text-xs text-waxe-text-muted mt-1">Hold items for VIP customers, special orders, or no-POS situations</p>
         </div>
         <button onClick={() => setShowDraftModal(false)} className="text-waxe-text-muted hover:text-waxe-text text-lg">{'\u2715'}</button>
        </div>
       </div>

       <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-5">
        {/* Customer */}
        <div>
         <label className="text-[10px] font-medium text-waxe-text-muted mb-2 block">Customer</label>
         {draftCustomer ? (
          <div className="flex items-center justify-between bg-waxe-surface/30 border border-waxe-border p-3">
           <span className="text-sm font-medium text-waxe-text">{draftCustomer}</span>
           <button className="text-xs text-waxe-text-muted hover:text-waxe-text" onClick={() => { setDraftCustomer(''); setDraftCustomerSearch('') }}>Change</button>
          </div>
         ) : (
          <div className="relative">
           <input
            type="text"
            placeholder="Search customer name or email..."
            className="input-field w-full text-sm"
            value={draftCustomerSearch}
            onChange={(e) => setDraftCustomerSearch(e.target.value)}
           />
           {customerResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-waxe-card border border-waxe-border shadow-lg z-10 max-h-40 overflow-y-auto">
             {customerResults.map((c) => (
              <button
               key={c.email}
               onClick={() => { setDraftCustomer(c.name); setDraftCustomerSearch('') }}
               className="w-full text-left px-3 py-2 hover:bg-waxe-surface/50 transition-colors"
              >
               <p className="text-sm text-waxe-text">{c.name}</p>
               <p className="text-[11px] text-waxe-text-muted">{c.email}</p>
              </button>
             ))}
            </div>
           )}
           {!draftCustomerSearch && (
            <button className="mt-2 text-xs text-waxe-cool hover:text-waxe-warm" onClick={() => setDraftCustomer('Walk-in Customer')}>
             + Walk-in customer
            </button>
           )}
          </div>
         )}
        </div>

        {/* Items */}
        <div>
         <label className="text-[10px] font-medium text-waxe-text-muted mb-2 block">Items</label>
         {draftItems.length > 0 && (
          <div className="space-y-2 mb-3">
           {draftItems.map((item, idx) => (
            <div key={item.recordId} className="flex items-center justify-between bg-waxe-surface/30 border border-waxe-border/50 p-3">
             <div className="min-w-0">
              <p className="text-sm font-medium text-waxe-text truncate">{item.artist} — {item.title}</p>
              <p className="text-xs text-waxe-text-muted font-mono">${item.price.toFixed(2)} x {item.qty}</p>
             </div>
             <div className="flex items-center gap-2 shrink-0">
              <input
               type="number"
               min={1}
               value={item.qty}
               onChange={(e) => {
                const next = [...draftItems]
                next[idx] = { ...next[idx], qty: Math.max(1, parseInt(e.target.value) || 1) }
                setDraftItems(next)
               }}
               className="w-12 text-center text-sm bg-waxe-card border border-waxe-border px-1 py-0.5 text-waxe-text font-mono"
              />
              <button className="text-xs text-waxe-negative hover:text-waxe-negative/80" onClick={() => setDraftItems(draftItems.filter((_, i) => i !== idx))}>
               Remove
              </button>
             </div>
            </div>
           ))}
          </div>
         )}
         <div className="relative">
          <input
           type="text"
           placeholder="Search inventory to add items..."
           className="input-field w-full text-sm"
           value={draftItemSearch}
           onChange={(e) => setDraftItemSearch(e.target.value)}
          />
          {draftSearchResults.length > 0 && (
           <div className="absolute top-full left-0 right-0 mt-1 bg-waxe-card border border-waxe-border shadow-lg z-10 max-h-48 overflow-y-auto">
            {draftSearchResults.map((r) => (
             <button
              key={r.id}
              onClick={() => {
               setDraftItems([...draftItems, { recordId: r.id, artist: r.artist, title: r.title, price: r.price, qty: 1 }])
               setDraftItemSearch('')
              }}
              className="w-full text-left px-3 py-2 hover:bg-waxe-surface/50 transition-colors flex items-center justify-between"
             >
              <div>
               <p className="text-sm text-waxe-text">{r.artist} — {r.title}</p>
               <p className="text-[11px] text-waxe-text-muted">{r.genre} {'\u00B7'} {r.label}</p>
              </div>
              <span className="text-sm font-medium text-waxe-text font-mono">${r.price.toFixed(2)}</span>
             </button>
            ))}
           </div>
          )}
         </div>
         <button className="mt-2 text-xs text-waxe-cool hover:text-waxe-warm" onClick={() => {
          setDraftItems([...draftItems, { recordId: `custom-${Date.now()}`, artist: 'Custom', title: 'Custom Item', price: 0, qty: 1 }])
         }}>
          + Add custom item
         </button>
        </div>

        {/* Hold toggle */}
        <label className="flex items-center gap-3 bg-waxe-surface/30 border border-waxe-border p-3 cursor-pointer">
         <input type="checkbox" checked={draftHold} onChange={(e) => setDraftHold(e.target.checked)} className="accent-waxe-warm w-4 h-4" />
         <div>
          <p className="text-sm font-medium text-waxe-text">Hold items</p>
          <p className="text-[11px] text-waxe-text-muted">Reserve these items until pickup/payment — marks as On Hold in inventory</p>
         </div>
        </label>

        {/* Notes */}
        <div>
         <label className="text-[10px] font-medium text-waxe-text-muted mb-2 block">Notes (optional)</label>
         <textarea
          rows={3}
          placeholder="Special instructions, VIP details, pickup arrangements..."
          className="input-field w-full text-sm resize-none"
          value={draftNotes}
          onChange={(e) => setDraftNotes(e.target.value)}
         />
        </div>

        {/* Total */}
        {draftItems.length > 0 && (
         <div className="bg-waxe-surface/30 border border-waxe-border p-4">
          <div className="flex justify-between items-center">
           <span className="text-xs text-waxe-text-muted">Draft Total</span>
           <span className="text-lg font-bold text-waxe-text font-mono">${draftTotal.toFixed(2)}</span>
          </div>
         </div>
        )}
       </div>

       <div className="shrink-0 bg-waxe-card border-t border-waxe-border p-5 flex items-center justify-between">
        <button className="btn-secondary text-sm px-4 py-2" onClick={() => setShowDraftModal(false)}>Cancel</button>
        <div className="flex gap-2">
         <button
          className="btn-secondary text-sm px-4 py-2"
          disabled={!draftCustomer || draftItems.length === 0}
          onClick={() => {
           setToastMessage(`Draft order saved for ${draftCustomer}`)
           setShowDraftModal(false)
          }}
         >
          Save Draft
         </button>
         <button
          className="btn-primary text-sm px-4 py-2"
          disabled={!draftCustomer || draftItems.length === 0}
          onClick={() => {
           setToastMessage(`Order created for ${draftCustomer} — $${draftTotal.toFixed(2)}`)
           setShowDraftModal(false)
          }}
         >
          Create Order
         </button>
        </div>
       </div>
      </div>
     </div>
    )
   })()}

   {/* ─── PO Detail Modal ─── */}
   {selectedPO && (() => {
    const totalOrdered = selectedPO.lineItems.reduce((s, li) => s + li.qtyOrdered, 0)
    const totalReceived = selectedPO.lineItems.reduce((s, li) => s + li.qtyReceived, 0)
    const receivePct = totalOrdered > 0 ? Math.round((totalReceived / totalOrdered) * 100) : 0
    return (
     <div className="fixed inset-0 z-50 flex items-start justify-center pt-[5vh]">
      <div className="absolute inset-0 bg-waxe-text/40" onClick={() => setSelectedPO(null)} />
      <div className="relative w-full max-w-2xl h-[90vh] flex flex-col overflow-hidden bg-waxe-base border border-waxe-border shadow-xl clip-modal">
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

       <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-5">
        <div className="bg-waxe-surface/30 p-4">
         <div className="flex items-center justify-between text-xs text-waxe-text-muted mb-1">
          <span>Receiving Progress</span>
          <span className="font-mono">{totalReceived}/{totalOrdered} items ({receivePct}%)</span>
         </div>
         <div className="w-full h-2 bg-waxe-surface overflow-hidden">
          <div className="h-full bg-waxe-positive transition-all" style={{ width: `${receivePct}%` }} />
         </div>
        </div>

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

        {selectedPO.notes && (
         <div className="bg-waxe-surface/30 p-4">
          <p className="text-[10px] font-medium text-waxe-text-muted mb-2">Notes</p>
          <p className="text-sm text-waxe-text-secondary">{selectedPO.notes}</p>
         </div>
        )}

        <p className="text-xs text-waxe-text-muted">Created by {selectedPO.createdBy}</p>
       </div>

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
