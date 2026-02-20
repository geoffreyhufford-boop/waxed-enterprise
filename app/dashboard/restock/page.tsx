'use client'

import { useState, useRef, useMemo } from 'react'
import { DashboardHeader, StatCard, DataTable, FilterDropdown, StatusBadge } from '@/components/dashboard'
import { networkStores, networkRecords, deadStockItems, wantListItems } from '@/lib/restock-data'
import type { NetworkRecord, NetworkStore } from '@/lib/restock-data'
import { packPurchases } from '@/lib/pack-data'
import type { PackPurchase } from '@/lib/pack-data'

// ─── Record Request Modal ────────────────────────────────────

function RecordModal({ record, store, onClose }: { record: NetworkRecord; store?: NetworkStore; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-waxe-text/60" onClick={onClose} />
      <div className="relative bg-waxe-card border-2 border-waxe-border rounded-none w-full max-w-lg max-h-[85vh] overflow-y-auto clip-modal">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-5">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.1em] text-waxe-text-muted mb-1">Request Record</p>
              <h2 className="text-xl font-black text-waxe-text tracking-tight">{record.artist}</h2>
              <p className="text-sm text-waxe-text-secondary">{record.title}</p>
            </div>
            <button onClick={onClose} className="text-waxe-text-muted hover:text-waxe-text text-lg font-black">✕</button>
          </div>

          {/* Record artwork */}
          <div
            className="w-full h-40 border-2 border-waxe-border mb-5 flex items-center justify-center relative overflow-hidden"
            style={{ backgroundColor: record.photoColor || '#2C3B4D' }}
          >
            {record.artworkUrl ? (
              <img src={record.artworkUrl} alt={`${record.artist} — ${record.title}`} className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-black text-white/30">LP</span>
            )}
          </div>

          {/* Record details */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-waxe-text-muted mb-0.5">Genre</p>
              <p className="text-sm text-waxe-text">{record.genre}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-waxe-text-muted mb-0.5">Condition</p>
              <p className="text-sm text-waxe-text">{'★'.repeat(record.condition)}{'☆'.repeat(5 - record.condition)}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-waxe-text-muted mb-0.5">Format</p>
              <p className="text-sm text-waxe-text">{record.format}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-waxe-text-muted mb-0.5">Year</p>
              <p className="text-sm text-waxe-text">{record.year}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-waxe-text-muted mb-0.5">Label</p>
              <p className="text-sm text-waxe-text">{record.label}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-waxe-text-muted mb-0.5">Price</p>
              <p className="text-sm font-bold text-waxe-text font-mono">${record.price}</p>
            </div>
          </div>

          {/* Store profile */}
          {store && (
            <div className="border-t-2 border-waxe-border pt-4 mb-5">
              <p className="text-[11px] font-black uppercase tracking-[0.15em] text-waxe-text-muted mb-2">Selling Store</p>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold text-waxe-text">{store.name}</p>
                  <p className="text-xs text-waxe-text-muted">{store.location}</p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-bold text-waxe-text font-mono">Trust: {store.trustScore}/100</p>
                  <p className="text-[11px] text-waxe-text-muted">{store.completedSwaps} swaps &middot; {store.responseTime}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {store.specialtyGenres.map((g) => (
                  <span key={g} className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border border-waxe-border text-waxe-text-muted">{g}</span>
                ))}
              </div>
            </div>
          )}

          {/* Request form */}
          <div className="border-t-2 border-waxe-border pt-4">
            <label className="block text-[11px] font-black uppercase tracking-[0.15em] text-waxe-text-muted mb-1.5">Message to Store</label>
            <textarea
              className="input-field w-full h-20 resize-none text-sm"
              placeholder="Add a note about your request..."
            />
            <div className="flex gap-2 mt-3">
              <button className="btn-primary text-sm px-5 py-2.5 flex-1">Send Request</button>
              <button onClick={onClose} className="btn-ghost text-sm px-4 py-2.5">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ───────────────────────────────────────────────

const allGenres = ['All', ...Array.from(new Set(networkRecords.map((r) => r.genre))).sort()]
const allConditions = ['All', '★★★★★', '★★★★', '★★★', '★★', '★']
const allStores = ['All', ...Array.from(new Set(networkRecords.map((r) => r.storeName))).sort()]

export default function RestockPage() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activePanel, setActivePanel] = useState(0)
  const panelCount = 3

  // Filters
  const [search, setSearch] = useState('')
  const [genreFilter, setGenreFilter] = useState('All')
  const [conditionFilter, setConditionFilter] = useState('All')
  const [storeFilter, setStoreFilter] = useState('All')

  // Swap queue
  const [swapQueue, setSwapQueue] = useState<Set<string>>(new Set())
  const toggleSwapQueue = (id: string) => {
    setSwapQueue((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }
  const swapQueueItems = deadStockItems.filter((d) => swapQueue.has(d.id))
  const swapQueueValue = swapQueueItems.reduce((sum, d) => sum + d.price, 0)

  // Modals
  const [selectedRecord, setSelectedRecord] = useState<NetworkRecord | null>(null)
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

  // Filtered records
  const filteredRecords = useMemo(() => {
    return networkRecords.filter((r) => {
      if (search) {
        const q = search.toLowerCase()
        if (!r.artist.toLowerCase().includes(q) && !r.title.toLowerCase().includes(q) && !r.genre.toLowerCase().includes(q)) return false
      }
      if (genreFilter !== 'All' && r.genre !== genreFilter) return false
      if (conditionFilter !== 'All' && r.condition !== conditionFilter.length) return false
      if (storeFilter !== 'All' && r.storeName !== storeFilter) return false
      return true
    })
  }, [search, genreFilter, conditionFilter, storeFilter])

  const getStore = (storeId: string) => networkStores.find((s) => s.id === storeId)

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <DashboardHeader
        title="Restock"
        subtitle="B2B network marketplace and intelligent swap engine"
        actions={
          <div className="flex gap-2 items-center">
            <button className="btn-secondary text-sm px-4 py-2">Request List</button>
          </div>
        }
      />

      {/* Stats Row */}
      <div className="shrink-0 grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <StatCard label="Stores in Network" value="47" trend="+6 this month" trendUp={true} />
        <StatCard label="Dead Stock Items" value={String(deadStockItems.filter(d => d.daysInStock >= 60).length)} trend="60+ days sitting" trendUp={false} />
        <StatCard label="Pack Orders" value={String(packPurchases.length)} trend={`${packPurchases.filter(p => p.status !== 'completed').length} active`} trendUp={true} />
        <StatCard label="Customer Wants" value={String(wantListItems.length)} trend={`${wantListItems.filter(w => w.networkAvailable > 0).length} available in network`} trendUp={true} />
      </div>

      {/* Panel tabs — directly above panels */}
      <div className="shrink-0 flex gap-1.5 pb-3 mb-3 w-fit border-b border-waxe-border pr-4">
        {['Marketplace', 'Intelligence', 'Orders'].map((label, i) => (
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
          </button>
        ))}
      </div>

      {/* Horizontal swipe panels */}
      <div className="relative flex-1 min-h-0 -mr-5 lg:-mr-6">
        <div ref={scrollRef} onScroll={handleScroll} className="absolute inset-0 overflow-x-auto overflow-y-hidden snap-x snap-mandatory flex gap-4 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>

        {/* ── Panel 1: Network Marketplace ── */}
        <div className="snap-start shrink-0 w-[92%] flex flex-col gap-4 min-h-0">

          {/* Search + Filters */}
          <div className="shrink-0 flex flex-wrap items-center gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search artist, title, genre..."
              className="input-field text-sm px-3 py-1.5 w-64"
            />
            <FilterDropdown label="Genre" options={allGenres} value={genreFilter} onChange={setGenreFilter} />
            <FilterDropdown label="Condition" options={allConditions} value={conditionFilter} onChange={setConditionFilter} />
            <FilterDropdown label="Store" options={allStores} value={storeFilter} onChange={setStoreFilter} />
            <span className="text-[11px] text-waxe-text-muted ml-auto font-mono">{filteredRecords.length} records</span>
          </div>

          {/* Records table */}
          <div className="flex-1 min-h-0">
            <DataTable headers={['', 'Artist / Title', 'Store', 'Genre', 'Condition', 'Price', 'Qty', '']} maxHeight="100%">
              {filteredRecords.map((rec) => (
                <tr key={rec.id} className="table-row hover:bg-waxe-surface/30 transition-colors">
                  <td className="px-3 py-2.5">
                    <div
                      className="w-8 h-8 border border-waxe-border flex items-center justify-center relative overflow-hidden"
                      style={{ backgroundColor: rec.photoColor || '#2C3B4D' }}
                    >
                      {rec.artworkUrl ? (
                        <img src={rec.artworkUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
                      ) : (
                        <span className="text-[6px] font-black text-white/50">LP</span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <p className="text-sm font-medium text-waxe-text">{rec.artist}</p>
                    <p className="text-xs text-waxe-text-muted">{rec.title} &middot; {rec.label} ({rec.year})</p>
                  </td>
                  <td className="px-3 py-2.5">
                    <p className="text-sm text-waxe-text-secondary">{rec.storeName}</p>
                    <p className="text-[11px] text-waxe-text-muted">{rec.storeLocation}</p>
                  </td>
                  <td className="px-3 py-2.5 text-sm text-waxe-text-secondary">{rec.genre}</td>
                  <td className="px-3 py-2.5 text-sm text-waxe-text-secondary">{'★'.repeat(rec.condition)}{'☆'.repeat(5 - rec.condition)}</td>
                  <td className="px-3 py-2.5 text-sm font-bold text-waxe-text font-mono">${rec.price}</td>
                  <td className="px-3 py-2.5 text-sm text-waxe-text-muted font-mono">{rec.qty}</td>
                  <td className="px-3 py-2.5">
                    <button
                      onClick={() => setSelectedRecord(rec)}
                      className="btn-secondary text-[11px] px-3 py-1"
                    >
                      Request
                    </button>
                  </td>
                </tr>
              ))}
            </DataTable>
          </div>
        </div>

        {/* ── Panel 2: Inventory Intelligence ── */}
        <div className="snap-start shrink-0 w-[92%] flex flex-col gap-4 min-h-0">

          <div className="shrink-0 flex items-center justify-between">
            <div>
              <h3 className="text-[11px] font-black text-waxe-text uppercase tracking-[0.1em]">
                Inventory Intelligence <span className="text-waxe-warm">{'>>'}</span> <span className="hatch-inline mx-1" /> {deadStockItems.length} Dead · {wantListItems.length} Wanted
              </h3>
              <p className="text-[11px] text-waxe-text-muted mt-0.5">What&apos;s sitting vs. what your customers need</p>
            </div>
          </div>

          <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* Left: Dead Stock Table */}
            <div className="lg:col-span-2 min-h-0 flex flex-col">
              <p className="text-[11px] font-black uppercase tracking-[0.15em] text-waxe-text-muted mb-2">Dead Stock</p>
              <div className="flex-1 min-h-0 overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin' }}>
                <div className="space-y-2">
                  {deadStockItems.map((item) => (
                    <div key={item.id} className="bg-waxe-card border-2 border-waxe-border p-3 clip-card">
                      <div className="flex items-start gap-3">
                        {/* Artwork */}
                        <div
                          className="w-12 h-12 shrink-0 border border-waxe-border flex items-center justify-center relative overflow-hidden"
                          style={{ backgroundColor: item.photoColor || '#2C3B4D' }}
                        >
                          {item.artworkUrl ? (
                            <img src={item.artworkUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
                          ) : (
                            <span className="text-[7px] font-black text-white/60">LP</span>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className="text-sm font-bold text-waxe-text truncate">{item.artist}</p>
                            <span className={`shrink-0 text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 border ${
                              item.daysInStock >= 90 ? 'border-waxe-negative/40 text-waxe-negative bg-waxe-negative/5' :
                              item.daysInStock >= 60 ? 'border-waxe-warm/40 text-waxe-warm bg-waxe-warm/5' :
                              'border-waxe-border text-waxe-text-muted'
                            }`}>
                              {item.daysInStock}d
                            </span>
                          </div>
                          <p className="text-[11px] text-waxe-text-muted truncate">{item.title}</p>

                          {/* Metrics row */}
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className="text-[11px] text-waxe-text-muted font-mono">{item.genre}</span>
                            <span className="text-[11px] text-waxe-text-muted font-mono">${item.price}</span>
                            <span className="text-[11px] text-waxe-text-muted">{item.storefrontViews} views</span>
                            {/* Network demand bar */}
                            <div className="flex items-center gap-1">
                              <div className="w-12 h-1.5 bg-waxe-border overflow-hidden">
                                <div className="h-full bg-waxe-cool" style={{ width: `${Math.min(item.networkDemand * 8, 100)}%` }} />
                              </div>
                              <span className="text-[10px] text-waxe-text-muted">{item.networkDemand} stores want</span>
                            </div>
                          </div>

                          {/* Reasoning */}
                          <p className="text-[11px] text-waxe-text-secondary mt-1.5 leading-relaxed">{item.reasoning}</p>
                        </div>

                        {/* Action */}
                        <div className="shrink-0 flex flex-col gap-1.5 items-end">
                          <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 text-center border ${
                            item.suggestedAction === 'swap' ? 'border-waxe-cool/40 text-waxe-cool bg-waxe-cool/5' :
                            item.suggestedAction === 'discount' ? 'border-waxe-warm/40 text-waxe-warm bg-waxe-warm/5' :
                            'border-waxe-positive/40 text-waxe-positive bg-waxe-positive/5'
                          }`}>
                            {item.suggestedAction === 'list_to_network' ? 'List' : item.suggestedAction}
                          </span>
                          {item.suggestedAction === 'swap' ? (
                            <button
                              onClick={() => toggleSwapQueue(item.id)}
                              className={`text-[11px] px-2 py-1 ${swapQueue.has(item.id) ? 'btn-primary' : 'btn-secondary'}`}
                            >
                              {swapQueue.has(item.id) ? '✕ Remove' : '+ Add to Swap'}
                            </button>
                          ) : (
                            <button className="btn-secondary text-[11px] px-2 py-1">
                              {item.suggestedAction === 'discount' ? 'Reprice' : 'List Now'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Swap Queue Bar */}
              {swapQueue.size > 0 && (
                <div className="shrink-0 mt-2 bg-waxe-cool/5 border-2 border-waxe-cool/30 p-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-black text-waxe-cool uppercase tracking-wider">Swap Bundle</span>
                    <span className="text-[11px] text-waxe-text font-mono">{swapQueue.size} {swapQueue.size === 1 ? 'record' : 'records'}</span>
                    <span className="text-[11px] text-waxe-text-muted">&middot;</span>
                    <span className="text-[11px] font-bold text-waxe-text font-mono">${swapQueueValue} total value</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setSwapQueue(new Set())} className="btn-ghost text-[11px] px-2 py-1">Clear</button>
                    <button className="btn-primary text-[11px] px-3 py-1">Add to Pack Draft</button>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Want List Feed */}
            <div className="lg:col-span-1 min-h-0 flex flex-col">
              <p className="text-[11px] font-black uppercase tracking-[0.15em] text-waxe-text-muted mb-2">Customer Wants</p>
              <div className="flex-1 min-h-0 overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin' }}>
                <div className="space-y-2">
                  {wantListItems.map((item) => (
                    <div key={item.id} className="bg-waxe-card border-2 border-waxe-border p-3 clip-card">
                      <div className="flex items-start justify-between mb-1.5">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-waxe-text truncate">
                            {item.title ? `${item.artist} — ${item.title}` : item.genre}
                          </p>
                          {!item.title && <p className="text-[11px] text-waxe-text-muted">Genre request</p>}
                        </div>
                        <span className={`shrink-0 ml-2 text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 border ${
                          item.source === 'in_store' ? 'border-waxe-warm/40 text-waxe-warm' :
                          item.source === 'storefront_search' ? 'border-waxe-cool/40 text-waxe-cool' :
                          'border-waxe-text-muted/40 text-waxe-text-muted'
                        }`}>
                          {item.source === 'in_store' ? 'In-Store' : item.source === 'storefront_search' ? 'Search' : 'Request'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-waxe-text-muted mb-2">
                        <span className="font-mono font-bold">{item.requestCount}x asked</span>
                        <span>&middot;</span>
                        <span>{item.lastRequested}</span>
                      </div>

                      {item.networkAvailable > 0 ? (
                        <div className="flex items-center justify-between bg-waxe-surface border border-waxe-border px-2 py-1.5">
                          <div>
                            <p className="text-[11px] font-bold text-waxe-positive">{item.networkAvailable} in network</p>
                            <p className="text-[10px] text-waxe-text-muted">{item.matchedStoreName} &middot; {item.matchedStoreLocation}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {item.bestPrice && <span className="text-[11px] font-black text-waxe-text font-mono">${item.bestPrice}</span>}
                            <button className="btn-primary text-[10px] px-2 py-0.5">Source</button>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-waxe-surface border border-waxe-border px-2 py-1.5">
                          <p className="text-[11px] text-waxe-text-muted">Not available in network</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ── Panel 3: Orders ── */}
        <div className="snap-start shrink-0 w-[92%] flex flex-col gap-4 min-h-0">

          <div className="shrink-0 flex items-center justify-between">
            <div>
              <h3 className="text-[11px] font-black text-waxe-text uppercase tracking-[0.1em]">
                Pack Orders <span className="text-waxe-cool">{'>>'}</span> {packPurchases.filter((p) => p.status !== 'completed').length} Active
              </h3>
              <p className="text-[11px] text-waxe-text-muted mt-0.5">Buy/sell order history across your dealer network</p>
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto space-y-3 pr-1" style={{ scrollbarWidth: 'thin' }}>
            {packPurchases.map((order) => (
              <PurchaseCard key={order.id} order={order} />
            ))}
          </div>
        </div>

        {/* Spacer so last panel can fully snap */}
        <div className="shrink-0 w-[8%]" />

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

      {/* Modals */}
      {selectedRecord && (
        <RecordModal
          record={selectedRecord}
          store={getStore(selectedRecord.storeId)}
          onClose={() => setSelectedRecord(null)}
        />
      )}
    </div>
  )
}

// ─── Purchase Card (inline) ─────────────────────────────────

function PurchaseCard({ order }: { order: PackPurchase }) {
  const isSale = order.type === 'sale'

  return (
    <div className="bg-waxe-card border-2 border-waxe-border rounded-none p-4 clip-card">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 border ${
              isSale ? 'border-waxe-positive/40 text-waxe-positive bg-waxe-positive/5' : 'border-waxe-cool/40 text-waxe-cool bg-waxe-cool/5'
            }`}>
              {isSale ? 'You Sold' : 'You Bought'}
            </span>
            <StatusBadge status={order.status} />
          </div>
          <p className="text-sm font-black text-waxe-text">{order.pack.name}</p>
          <p className="text-[11px] text-waxe-text-muted">
            {order.pack.genre} &middot; {order.pack.recordCount} records &middot; {order.counterparty.name}, {order.counterparty.location}
          </p>
        </div>
        <p className="text-[10px] text-waxe-text-muted">{order.createdAt}</p>
      </div>

      {/* Fee breakdown */}
      <div className="bg-waxe-surface border border-waxe-border p-3 grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-waxe-text-muted mb-0.5">Pack Price</p>
          <p className="text-sm font-black text-waxe-text font-mono">${order.pack.packPrice}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-waxe-text-muted mb-0.5">WAXED Fee</p>
          <p className="text-sm font-black text-waxe-warm font-mono">${order.waxedFee}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-waxe-text-muted mb-0.5">Shipping</p>
          <p className="text-sm font-black text-waxe-text font-mono">${order.shipping}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-waxe-text-muted mb-0.5">
            {isSale ? 'You Receive' : 'You Pay'}
          </p>
          <p className={`text-sm font-black font-mono ${isSale ? 'text-waxe-positive' : 'text-waxe-text'}`}>
            ${isSale ? order.sellerReceives : order.buyerPays}
          </p>
        </div>
      </div>
    </div>
  )
}
