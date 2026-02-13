'use client'

import { useState, useRef, useMemo } from 'react'
import { DashboardHeader, StatCard, StatusBadge, FilterDropdown, PackCard } from '@/components/dashboard'
import { networkStores, networkTransactions } from '@/lib/network-data'
import type { NetworkStore, NetworkTransaction } from '@/lib/network-data'
import { curatedPacks, inboundPackRequests } from '@/lib/pack-data'
import type { InboundPackRequest } from '@/lib/pack-data'

// ─── Helpers ─────────────────────────────────────────────────

const allGenres = ['All', ...Array.from(new Set(networkStores.flatMap((s) => s.specialtyGenres))).sort()]
const sortOptions = ['Trust Score', 'Swaps', 'Response Time', 'Name']

function trustColor(score: number) {
  if (score >= 95) return 'bg-waxe-positive'
  if (score >= 90) return 'bg-waxe-cool'
  if (score >= 80) return 'bg-waxe-warm'
  return 'bg-waxe-negative'
}

function typeColor(type: NetworkTransaction['type']) {
  switch (type) {
    case 'swap': return 'border-waxe-cool/40 text-waxe-cool bg-waxe-cool/5'
    case 'purchase': return 'border-waxe-warm/40 text-waxe-warm bg-waxe-warm/5'
    case 'sale': return 'border-waxe-positive/40 text-waxe-positive bg-waxe-positive/5'
  }
}

// ─── Main Page ───────────────────────────────────────────────

export default function NetworkPage() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activePanel, setActivePanel] = useState(0)
  const panelCount = 3

  // Panel 1 filters
  const [storeSearch, setStoreSearch] = useState('')
  const [genreFilter, setGenreFilter] = useState('All')
  const [sortBy, setSortBy] = useState('Trust Score')

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

  // Filtered + sorted stores
  const filteredStores = useMemo(() => {
    let stores = [...networkStores]
    if (storeSearch) {
      const q = storeSearch.toLowerCase()
      stores = stores.filter((s) =>
        s.name.toLowerCase().includes(q) || s.location.toLowerCase().includes(q) || s.specialtyGenres.some((g) => g.toLowerCase().includes(q))
      )
    }
    if (genreFilter !== 'All') {
      stores = stores.filter((s) => s.specialtyGenres.includes(genreFilter))
    }
    switch (sortBy) {
      case 'Trust Score': stores.sort((a, b) => b.trustScore - a.trustScore); break
      case 'Swaps': stores.sort((a, b) => b.completedSwaps - a.completedSwaps); break
      case 'Response Time': stores.sort((a, b) => a.responseTime.localeCompare(b.responseTime)); break
      case 'Name': stores.sort((a, b) => a.name.localeCompare(b.name)); break
    }
    return stores
  }, [storeSearch, genreFilter, sortBy])

  // Stats
  const pendingRequests = inboundPackRequests.filter((r) => r.status === 'pending')
  const tradeVolume = networkTransactions.reduce((sum, t) => sum + Math.abs(t.netValue), 0)

  // Transaction mini-stats
  const totalTxns = networkTransactions.length
  const valueMoved = tradeVolume
  const avgValue = Math.round(valueMoved / totalTxns)
  const partnerCounts: Record<string, number> = {}
  networkTransactions.forEach((t) => { partnerCounts[t.counterparty.name] = (partnerCounts[t.counterparty.name] || 0) + 1 })
  const topPartner = Object.entries(partnerCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '—'

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <DashboardHeader
        title="Network"
        subtitle="B2B dealer relationships, inbound demand, and trade history"
        actions={
          <div className="flex gap-2 items-center">
            <button className="btn-secondary text-sm px-4 py-2">Invite Store</button>
          </div>
        }
      />

      {/* Stats Row */}
      <div className="shrink-0 grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <StatCard label="Network Stores" value="47" trend="+6 this month" trendUp={true} />
        <StatCard label="Your Packs" value={String(curatedPacks.length)} trend={`${curatedPacks.filter(p => p.status !== 'draft').length} listed`} trendUp={true} />
        <StatCard label="Inbound Requests" value={String(pendingRequests.length)} trend={`${inboundPackRequests.length} total`} trendUp={pendingRequests.length > 0} />
        <StatCard label="Trade Volume" value={`$${tradeVolume}`} trend={`${totalTxns} completed`} trendUp={true} />
      </div>

      {/* Panel tabs — directly above panels */}
      <div className="shrink-0 flex gap-1.5 pb-3 mb-3 w-fit border-b-2 border-waxe-border pr-4">
        {['Directory', 'Packs', 'History'].map((label, i) => (
          <button
            key={label}
            onClick={() => scrollToPanel(i)}
            className={`text-[9px] font-bold uppercase tracking-[0.1em] px-3 py-1.5 border-2 ${
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

        {/* ── Panel 1: Store Directory ── */}
        <div className="snap-start shrink-0 w-[92%] flex flex-col gap-4 min-h-0">

          {/* Search + Filters */}
          <div className="shrink-0 flex flex-wrap items-center gap-2">
            <input
              type="text"
              value={storeSearch}
              onChange={(e) => setStoreSearch(e.target.value)}
              placeholder="Search stores, locations, genres..."
              className="input-field text-sm px-3 py-1.5 w-64"
            />
            <FilterDropdown label="Genre" options={allGenres} value={genreFilter} onChange={setGenreFilter} />
            <FilterDropdown label="Sort" options={sortOptions} value={sortBy} onChange={setSortBy} />
            <span className="text-[10px] text-waxe-text-muted ml-auto font-mono">{filteredStores.length} stores</span>
          </div>

          {/* Store Grid */}
          <div className="flex-1 min-h-0 overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {filteredStores.map((store) => (
                <StoreCard key={store.id} store={store} />
              ))}
            </div>
          </div>
        </div>

        {/* ── Panel 2: Packs & Inbound ── */}
        <div className="snap-start shrink-0 w-[92%] flex flex-col gap-4 min-h-0">

          <div className="shrink-0 flex items-center justify-between">
            <div>
              <h3 className="text-[11px] font-black text-waxe-text uppercase tracking-[0.1em]">
                Packs & Inbound <span className="text-waxe-warm">{'>>'}</span> {pendingRequests.length} Pending Requests
              </h3>
              <p className="text-[9px] text-waxe-text-muted mt-0.5">Your curated 25-record packs &middot; inbound pack requests from the network</p>
            </div>
          </div>

          <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* Left: Your Packs */}
            <div className="lg:col-span-2 min-h-0 flex flex-col">
              <p className="text-[9px] font-black uppercase tracking-[0.15em] text-waxe-text-muted mb-2">Your Packs</p>
              <div className="flex-1 min-h-0 overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin' }}>
                <div className="space-y-3">
                  {curatedPacks.map((pack) => (
                    <PackCard key={pack.id} pack={pack} />
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Inbound Pack Requests */}
            <div className="lg:col-span-1 min-h-0 flex flex-col">
              <p className="text-[9px] font-black uppercase tracking-[0.15em] text-waxe-text-muted mb-2">Inbound Requests</p>
              <div className="flex-1 min-h-0 overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin' }}>
                <div className="space-y-2">
                  {inboundPackRequests.map((req) => (
                    <InboundPackRequestCard key={req.id} request={req} />
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ── Panel 3: Transaction History ── */}
        <div className="snap-start shrink-0 w-[92%] flex flex-col gap-4 min-h-0">

          <div className="shrink-0 flex items-center justify-between">
            <div>
              <h3 className="text-[11px] font-black text-waxe-text uppercase tracking-[0.1em]">
                Transaction History <span className="text-waxe-cool">{'>>'}</span> {totalTxns} Completed
              </h3>
              <p className="text-[9px] text-waxe-text-muted mt-0.5">All B2B trades across your dealer network</p>
            </div>
            <button className="btn-ghost text-[10px]">Export CSV</button>
          </div>

          {/* Mini Stats */}
          <div className="shrink-0 grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-waxe-card border-2 border-waxe-border p-3">
              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-waxe-text-muted mb-1">Total Txns</p>
              <p className="text-xl font-black text-waxe-text font-mono">{totalTxns}</p>
            </div>
            <div className="bg-waxe-card border-2 border-waxe-border p-3">
              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-waxe-text-muted mb-1">Value Moved</p>
              <p className="text-xl font-black text-waxe-text font-mono">${valueMoved}</p>
            </div>
            <div className="bg-waxe-card border-2 border-waxe-border p-3">
              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-waxe-text-muted mb-1">Avg Value</p>
              <p className="text-xl font-black text-waxe-text font-mono">${avgValue}</p>
            </div>
            <div className="bg-waxe-card border-2 border-waxe-border p-3">
              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-waxe-text-muted mb-1">Top Partner</p>
              <p className="text-sm font-black text-waxe-text truncate">{topPartner}</p>
            </div>
          </div>

          {/* Transaction Timeline */}
          <div className="flex-1 min-h-0 overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin' }}>
            <div className="space-y-2">
              {networkTransactions.map((txn) => (
                <TransactionRow key={txn.id} transaction={txn} />
              ))}
            </div>
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
    </div>
  )
}

// ─── Store Card ──────────────────────────────────────────────

function StoreCard({ store }: { store: NetworkStore }) {
  return (
    <div className="bg-waxe-card border-2 border-waxe-border p-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="min-w-0">
          <p className="text-sm font-black text-waxe-text truncate">{store.name}</p>
          <p className="text-[10px] text-waxe-text-muted">{store.location}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-[10px] font-black text-waxe-text font-mono">{store.trustScore}</p>
          <p className="text-[8px] text-waxe-text-muted uppercase tracking-wider">Trust</p>
        </div>
      </div>

      {/* Trust bar */}
      <div className="w-full h-1.5 bg-waxe-border mb-3 overflow-hidden">
        <div className={`h-full ${trustColor(store.trustScore)}`} style={{ width: `${store.trustScore}%` }} />
      </div>

      {/* Genre tags */}
      <div className="flex flex-wrap gap-1 mb-3">
        {store.specialtyGenres.map((g) => (
          <span key={g} className="text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 border border-waxe-border text-waxe-text-muted">{g}</span>
        ))}
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-3 mb-3 text-[9px] text-waxe-text-muted">
        <span className="font-mono">{store.completedSwaps} swaps</span>
        <span>&middot;</span>
        <span>{store.responseTime}</span>
        <span>&middot;</span>
        <span>Since {store.memberSince}</span>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button className="btn-secondary text-[9px] px-3 py-1.5 flex-1">View Catalog</button>
        <button className="btn-secondary text-[9px] px-3 py-1.5 flex-1">Message</button>
        <button className="btn-primary text-[9px] px-3 py-1.5 flex-1">Propose Swap</button>
      </div>
    </div>
  )
}

// ─── Inbound Pack Request Card ──────────────────────────────

function InboundPackRequestCard({ request }: { request: InboundPackRequest }) {
  return (
    <div className="bg-waxe-card border-2 border-waxe-border p-3">
      <div className="flex items-center gap-2 mb-1.5">
        <p className="text-sm font-bold text-waxe-text truncate">{request.requestedPackName}</p>
        <StatusBadge status={request.status} />
      </div>

      <span className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 border border-waxe-border text-waxe-text-muted">{request.requestedGenre}</span>

      {/* Requesting store */}
      <div className="flex items-center gap-2 mt-2">
        <span className="text-[9px] font-bold text-waxe-text-secondary">{request.fromStore.name}</span>
        <span className="text-[9px] text-waxe-text-muted">{request.fromStore.location}</span>
      </div>
      <span className="text-[8px] text-waxe-text-muted font-mono">Trust: {request.fromStore.trustScore}</span>

      {/* Message quote */}
      {request.message && (
        <p className="text-[9px] text-waxe-text-secondary mt-1.5 leading-relaxed italic">&ldquo;{request.message}&rdquo;</p>
      )}

      {/* Price + timestamp */}
      <div className="flex items-center gap-3 mt-2">
        <span className="text-[11px] font-black text-waxe-text font-mono">${request.offeredPrice}</span>
        <span className="text-[8px] text-waxe-text-muted">{request.requestedAt}</span>
      </div>

      {/* Actions */}
      {request.status === 'pending' && (
        <div className="flex gap-2 mt-2.5">
          <button className="btn-primary text-[9px] px-3 py-1 flex-1">Accept</button>
          <button className="btn-secondary text-[9px] px-3 py-1">Counter</button>
          <button className="btn-ghost text-[9px] px-3 py-1">Decline</button>
        </div>
      )}
    </div>
  )
}

// ─── Transaction Row ─────────────────────────────────────────

function TransactionRow({ transaction }: { transaction: NetworkTransaction }) {
  return (
    <div className="bg-waxe-card border-2 border-waxe-border p-3">
      <div className="flex items-start gap-3">
        {/* Type badge */}
        <span className={`shrink-0 text-[8px] font-black uppercase tracking-wider px-2 py-1 border ${typeColor(transaction.type)}`}>
          {transaction.type}
        </span>

        {/* Details */}
        <div className="flex-1 min-w-0">
          {/* Counterparty */}
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm font-bold text-waxe-text">{transaction.counterparty.name}</p>
            <span className="text-[9px] text-waxe-text-muted">{transaction.counterparty.location}</span>
          </div>

          {/* Records with arrows */}
          <div className="space-y-0.5">
            {transaction.records.map((rec, i) => (
              <div key={i} className="flex items-center gap-2 text-[10px]">
                <span className={`font-mono font-bold ${rec.direction === 'sent' ? 'text-waxe-negative' : 'text-waxe-positive'}`}>
                  {rec.direction === 'sent' ? '↑' : '↓'}
                </span>
                <span className="text-waxe-text-secondary">{rec.artist} — {rec.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Net value + timestamp */}
        <div className="shrink-0 text-right">
          <p className={`text-sm font-black font-mono ${transaction.netValue >= 0 ? 'text-waxe-positive' : 'text-waxe-negative'}`}>
            {transaction.netValue >= 0 ? '+' : ''}${transaction.netValue}
          </p>
          <p className="text-[8px] text-waxe-text-muted mt-0.5">{transaction.completedAt}</p>
        </div>
      </div>
    </div>
  )
}
