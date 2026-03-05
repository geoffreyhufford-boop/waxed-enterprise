'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { DashboardHeader, FilterDropdown, StatusBadge, DataTable, PackCard, ShelfCard } from '@/components/dashboard'
import { marketplaceListings, marketplaceRecommendations } from '@/lib/marketplace-data'
import type { MarketplaceListing } from '@/lib/marketplace-data'
import { networkStores as restockStores, networkRecords, deadStockItems, wantListItems } from '@/lib/restock-data'
import type { NetworkRecord, NetworkStore as RestockStore } from '@/lib/restock-data'
import { networkStores, networkTransactions } from '@/lib/network-data'
import type { NetworkStore, NetworkTransaction } from '@/lib/network-data'
import { curatedPacks, inboundPackRequests, networkPackListings, calculateFees, packPurchases } from '@/lib/pack-data'
import type { InboundPackRequest, NetworkPackListing, PackPurchase } from '@/lib/pack-data'
import { PackArtworkGrid } from '@/components/dashboard/PackCard'
import { useCart } from '@/lib/cart-context'
import { shelves, storefrontConfig, inventoryRecords, type StorefrontSocialLinks } from '@/lib/dashboard-data'

// ─── MarketplaceListingCard ──────────────────────────────────

function MarketplaceListingCard({ listing }: { listing: MarketplaceListing }) {
 const { addItem, toggleDrawer } = useCart()
 const [qty, setQty] = useState(listing.minOrderQty)

 const handleAdd = () => {
  addItem(listing, qty)
  toggleDrawer()
 }

 return (
  <div className="border border-waxe-border bg-waxe-card flex flex-col clip-card">
   <div className="p-4 flex-1">
    {/* Artwork + info + price */}
    <div className="flex gap-3 mb-3">
     <div
      className="w-14 h-14 shrink-0 border border-waxe-border flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: listing.photoColor || '#3D3050' }}
     >
      {listing.artworkUrl ? (
       <img src={listing.artworkUrl} alt={`${listing.artist} — ${listing.title}`} className="w-full h-full object-cover" />
      ) : (
       <span className="text-xs font-semibold text-white/30">LP</span>
      )}
     </div>
     <div className="flex-1 min-w-0">
      <p className="text-sm font-bold text-waxe-text truncate">{listing.title}</p>
      <p className="text-[11px] font-medium text-waxe-text-muted truncate">{listing.artist}</p>
      <p className="text-[9px] text-waxe-text-muted mt-1">
       {listing.label} &middot; {listing.year} &middot; {listing.format}
       &middot; {'★'.repeat(listing.condition)}{'☆'.repeat(5 - listing.condition)}
      </p>
     </div>
     <div className="shrink-0 text-right">
      <p className="text-lg font-semibold font-mono text-waxe-text leading-none">${listing.wholesalePrice.toFixed(2)}</p>
      <p className="text-[9px] text-waxe-text-muted mt-0.5">/unit</p>
      {listing.retailSuggested && (
       <p className="text-[9px] text-waxe-text-muted mt-0.5">MSRP ${listing.retailSuggested.toFixed(2)}</p>
      )}
     </div>
    </div>

    {/* Seller + availability in one row */}
    <div className="flex items-center gap-2 flex-wrap">
     <span className={`text-[9px] font-semibold px-1.5 py-0.5 ${
      listing.sellerType === 'label' ? 'bg-waxe-text text-waxe-deep clip-badge' :
      listing.sellerType === 'distributor' ? 'bg-waxe-cool text-waxe-deep clip-badge' :
      'border border-waxe-border text-waxe-text-muted'
     }`}>
      {listing.sellerType}
     </span>
     <span className="text-[11px] text-waxe-text-secondary truncate">{listing.seller.name}</span>
     <span className="text-[9px] text-waxe-text-muted">{listing.seller.location}</span>
     {listing.sellerType === 'store' && listing.seller.rating && (
      <span className="text-[9px] font-mono text-waxe-text-muted ml-auto">T:{listing.seller.rating}</span>
     )}
    </div>

    {/* Status line */}
    <div className="flex items-center gap-2 mt-2">
     <StatusBadge status={listing.listingType} />
     <span className="text-[10px] text-waxe-text-muted">
      {listing.listingType === 'backorder' ? 'Awaiting repress' : `${listing.availableQty} avail`} &middot; Min {listing.minOrderQty}
     </span>
     {listing.listingType === 'pre_order' && listing.releaseDate && (
      <span className="text-[10px] text-waxe-warm font-bold ml-auto">{listing.releaseDate}</span>
     )}
    </div>
   </div>

   {/* Action row — pinned to bottom */}
   <div className="flex items-center gap-2 px-4 py-3 border-t border-waxe-border bg-waxe-surface/30">
    <input
     type="number"
     min={listing.minOrderQty}
     max={listing.availableQty || undefined}
     value={qty}
     onChange={(e) => setQty(Math.max(listing.minOrderQty, parseInt(e.target.value) || listing.minOrderQty))}
     className="w-20 px-2 py-1.5 text-sm bg-waxe-deep border border-waxe-border text-waxe-text text-center font-mono"
    />
    <button
     onClick={handleAdd}
     className="btn-primary text-[11px] px-4 py-1.5 flex-1"
     disabled={listing.listingType === 'backorder'}
    >
     Add to Cart
    </button>
   </div>
  </div>
 )
}

// ─── RecommendationCard ──────────────────────────────────────

function RecommendationCard({ listing, reason, basedOn }: { listing: MarketplaceListing; reason: string; basedOn: string }) {
 const { addItem, toggleDrawer } = useCart()

 const basedOnLabel: Record<string, string> = {
  sales_history: 'Sales Data',
  genre_gap: 'Genre Gap',
  trending: 'Trending',
  want_list: 'Want List',
 }

 return (
  <div className="border border-waxe-border bg-waxe-card min-w-[260px] max-w-[300px] shrink-0 snap-start flex flex-col clip-card">
   <div className="p-3 flex-1">
    <div className="flex gap-2.5 mb-2">
     <div
      className="w-10 h-10 shrink-0 border border-waxe-border flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: listing.photoColor || '#3D3050' }}
     >
      {listing.artworkUrl ? (
       <img src={listing.artworkUrl} alt="" className="w-full h-full object-cover" />
      ) : (
       <span className="text-[9px] font-semibold text-white/30">LP</span>
      )}
     </div>
     <div className="flex-1 min-w-0">
      <p className="text-sm font-bold text-waxe-text truncate">{listing.title}</p>
      <p className="text-[11px] font-medium text-waxe-text-muted truncate">{listing.artist}</p>
     </div>
     <p className="text-sm font-semibold font-mono text-waxe-text shrink-0">${listing.wholesalePrice.toFixed(2)}</p>
    </div>
    <div className="flex items-center gap-1.5 mb-1.5">
     <span className="text-[9px] font-semibold px-1.5 py-0.5 bg-waxe-warm text-waxe-text">
      {basedOnLabel[basedOn] || basedOn}
     </span>
     <span className="text-[9px] text-waxe-text-muted truncate">{listing.seller.name}</span>
    </div>
    <p className="text-[10px] text-waxe-text-secondary leading-relaxed line-clamp-2">{reason}</p>
   </div>
   <div className="px-3 pb-3">
    <button
     onClick={() => { addItem(listing, listing.minOrderQty); toggleDrawer() }}
     className="btn-primary text-[11px] px-4 py-1.5 w-full"
    >
     Add {listing.minOrderQty} Units
    </button>
   </div>
  </div>
 )
}

// ─── RecommendationTicker ────────────────────────────────────

function RecommendationTicker() {
 const scrollRef = useRef<HTMLDivElement>(null)
 const pausedRef = useRef(false)

 useEffect(() => {
  const el = scrollRef.current
  if (!el) return
  let raf: number

  const step = () => {
   if (!pausedRef.current && el) {
    el.scrollLeft += 0.5
    // Loop: when we've scrolled past the first set, jump back
    if (el.scrollLeft >= el.scrollWidth / 2) {
     el.scrollLeft = 0
    }
   }
   raf = requestAnimationFrame(step)
  }
  raf = requestAnimationFrame(step)
  return () => cancelAnimationFrame(raf)
 }, [])

 // Duplicate cards for seamless loop
 const cards = [...marketplaceRecommendations, ...marketplaceRecommendations]

 return (
  <div
   ref={scrollRef}
   onMouseEnter={() => { pausedRef.current = true }}
   onMouseLeave={() => { pausedRef.current = false }}
   className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide"
   style={{ scrollbarWidth: 'none' }}
  >
   {cards.map((rec, i) => (
    <RecommendationCard
     key={`${rec.id}-${i}`}
     listing={rec.listing}
     reason={rec.reason}
     basedOn={rec.basedOn}
    />
   ))}
  </div>
 )
}

// ─── Record Request Modal ────────────────────────────────────

function RecordModal({ record, store, onClose }: { record: NetworkRecord; store?: RestockStore; onClose: () => void }) {
 return (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
   <div className="absolute inset-0 bg-waxe-text/60" onClick={onClose} />
   <div className="relative bg-waxe-card border border-waxe-border w-full max-w-lg max-h-[85vh] overflow-y-auto clip-modal">
    <div className="p-6">
     <div className="flex justify-between items-start mb-5">
      <div>
       <p className="text-[11px] font-semibold text-waxe-text-muted mb-1">Request Record</p>
       <h2 className="text-xl font-semibold text-waxe-text">{record.artist}</h2>
       <p className="text-sm text-waxe-text-secondary">{record.title}</p>
      </div>
      <button onClick={onClose} className="text-waxe-text-muted hover:text-waxe-text text-lg font-semibold">✕</button>
     </div>
     <div
      className="w-full h-40 border border-waxe-border mb-5 flex items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: record.photoColor || '#3D3050' }}
     >
      {record.artworkUrl ? (
       <img src={record.artworkUrl} alt={`${record.artist} — ${record.title}`} className="absolute inset-0 w-full h-full object-cover" />
      ) : (
       <span className="text-2xl font-semibold text-white/30">LP</span>
      )}
     </div>
     <div className="grid grid-cols-2 gap-3 mb-5">
      <div>
       <p className="text-[11px] font-medium text-waxe-text-muted mb-0.5">Genre</p>
       <p className="text-sm text-waxe-text">{record.genre}</p>
      </div>
      <div>
       <p className="text-[11px] font-medium text-waxe-text-muted mb-0.5">Condition</p>
       <p className="text-sm text-waxe-text">{'★'.repeat(record.condition)}{'☆'.repeat(5 - record.condition)}</p>
      </div>
      <div>
       <p className="text-[11px] font-medium text-waxe-text-muted mb-0.5">Format</p>
       <p className="text-sm text-waxe-text">{record.format}</p>
      </div>
      <div>
       <p className="text-[11px] font-medium text-waxe-text-muted mb-0.5">Year</p>
       <p className="text-sm text-waxe-text">{record.year}</p>
      </div>
      <div>
       <p className="text-[11px] font-medium text-waxe-text-muted mb-0.5">Label</p>
       <p className="text-sm text-waxe-text">{record.label}</p>
      </div>
      <div>
       <p className="text-[11px] font-medium text-waxe-text-muted mb-0.5">Price</p>
       <p className="text-sm font-bold text-waxe-text font-mono">${record.price}</p>
      </div>
     </div>
     {store && (
      <div className="border-t border-waxe-border pt-4 mb-5">
       <p className="text-[11px] font-semibold text-waxe-text-muted mb-2">Selling Store</p>
       <div className="flex justify-between items-start">
        <div>
         <p className="text-sm font-bold text-waxe-text">{store.name}</p>
         <p className="text-xs text-waxe-text-muted">{store.location}</p>
        </div>
        <div className="text-right">
         <p className="text-[11px] font-medium text-waxe-text font-mono">Trust: {store.trustScore}/100</p>
         <p className="text-[11px] text-waxe-text-muted">{store.completedSwaps} swaps &middot; {store.responseTime}</p>
        </div>
       </div>
       <div className="flex flex-wrap gap-1 mt-2">
        {store.specialtyGenres.map((g) => (
         <span key={g} className="text-[10px] font-medium px-2 py-0.5 border border-waxe-border text-waxe-text-muted">{g}</span>
        ))}
       </div>
      </div>
     )}
     <div className="border-t border-waxe-border pt-4">
      <label className="block text-[11px] font-semibold text-waxe-text-muted mb-1.5">Message to Store</label>
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

// ─── Store Card ──────────────────────────────────────────────

function trustColor(score: number) {
 if (score >= 95) return 'bg-waxe-positive'
 if (score >= 90) return 'bg-waxe-cool'
 if (score >= 80) return 'bg-waxe-warm'
 return 'bg-waxe-negative'
}

function StoreCard({ store }: { store: NetworkStore }) {
 return (
  <div className="bg-waxe-card border border-waxe-border p-4 clip-card">
   <div className="flex items-start justify-between mb-3">
    <div className="min-w-0">
     <p className="text-sm font-semibold text-waxe-text truncate">{store.name}</p>
     <p className="text-[11px] text-waxe-text-muted">{store.location}</p>
    </div>
    <div className="shrink-0 text-right">
     <p className="designation-tag">Trust</p>
     <p className="text-lg font-semibold text-waxe-text font-mono leading-none mt-0.5">{store.trustScore}</p>
    </div>
   </div>
   <div className="w-full h-1.5 bg-waxe-border mb-2 overflow-hidden">
    <div className={`h-full ${trustColor(store.trustScore)}`} style={{ width: `${store.trustScore}%` }} />
   </div>
   <div className="hatch-divider mb-3" />
   <div className="flex flex-wrap gap-1 mb-3">
    {store.specialtyGenres.map((g) => (
     <span key={g} className="text-[10px] font-medium px-2 py-0.5 border border-waxe-border text-waxe-text-muted">{g}</span>
    ))}
   </div>
   <div className="flex items-center gap-3 mb-3 text-[10px] text-waxe-text-muted">
    <span className="font-mono">{store.completedSwaps} swaps</span>
    <span>&middot;</span>
    <span>{store.responseTime}</span>
    <span>&middot;</span>
    <span>Since {store.memberSince}</span>
   </div>
   <div className="flex gap-2">
    <button className="btn-secondary text-[10px] px-3 py-1.5 flex-1">View Catalog</button>
    <button className="btn-secondary text-[10px] px-3 py-1.5 flex-1">Message</button>
    <button className="btn-primary text-[10px] px-3 py-1.5 flex-1">Propose Trade</button>
   </div>
  </div>
 )
}

// ─── Transaction Row ─────────────────────────────────────────

function typeColor(type: NetworkTransaction['type']) {
 switch (type) {
  case 'swap': return 'border-waxe-cool/40 text-waxe-cool bg-waxe-cool/5'
  case 'purchase': return 'border-waxe-warm/40 text-waxe-warm bg-waxe-warm/5'
  case 'sale': return 'border-waxe-positive/40 text-waxe-positive bg-waxe-positive/5'
 }
}

function TransactionRow({ transaction }: { transaction: NetworkTransaction }) {
 return (
  <div className="bg-waxe-card border border-waxe-border p-3 clip-stat accent-strip-left">
   <div className="flex items-start gap-3">
    <span className={`shrink-0 text-[10px] font-semibold px-2 py-1 border clip-badge ${typeColor(transaction.type)}`}>
     {transaction.type}
    </span>
    <div className="flex-1 min-w-0">
     <div className="flex items-center gap-2 mb-1">
      <p className="text-sm font-bold text-waxe-text">{transaction.counterparty.name}</p>
      <span className="text-[10px] text-waxe-text-muted">{transaction.counterparty.location}</span>
     </div>
     <div className="space-y-0.5">
      {transaction.records.map((rec, i) => (
       <div key={i} className="flex items-center gap-2 text-[11px]">
        <span className={`font-mono font-bold ${rec.direction === 'sent' ? 'text-waxe-negative' : 'text-waxe-positive'}`}>
         {rec.direction === 'sent' ? '↑' : '↓'}
        </span>
        <span className="text-waxe-text-secondary">{rec.artist} — {rec.title}</span>
       </div>
      ))}
     </div>
    </div>
    <div className="shrink-0 text-right">
     <p className={`text-sm font-semibold font-mono ${transaction.netValue >= 0 ? 'text-waxe-positive' : 'text-waxe-negative'}`}>
      {transaction.netValue >= 0 ? '+' : ''}${transaction.netValue}
     </p>
     <p className="text-[10px] text-waxe-text-muted mt-0.5">{transaction.completedAt}</p>
    </div>
   </div>
  </div>
 )
}

// ─── Inbound Pack Request Card ──────────────────────────────

function InboundPackRequestCard({ request }: { request: InboundPackRequest }) {
 return (
  <div className="bg-waxe-card border border-waxe-border p-3 clip-card">
   <div className="flex items-center gap-2 mb-1.5">
    <p className="text-sm font-bold text-waxe-text truncate">{request.requestedPackName}</p>
    <StatusBadge status={request.status} />
   </div>
   <span className="text-[10px] font-medium px-1.5 py-0.5 border border-waxe-border text-waxe-text-muted">{request.requestedGenre}</span>
   <div className="flex items-center gap-2 mt-2">
    <span className="text-[10px] font-medium text-waxe-text-secondary">{request.fromStore.name}</span>
    <span className="text-[10px] text-waxe-text-muted">{request.fromStore.location}</span>
   </div>
   <span className="text-[10px] text-waxe-text-muted font-mono">Trust: {request.fromStore.trustScore}</span>
   {request.message && (
    <p className="text-[10px] text-waxe-text-secondary mt-1.5 leading-relaxed italic">&ldquo;{request.message}&rdquo;</p>
   )}
   <div className="flex items-center gap-3 mt-2">
    <span className="text-[11px] font-semibold text-waxe-text font-mono">${request.offeredPrice}</span>
    <span className="text-[10px] text-waxe-text-muted">{request.requestedAt}</span>
   </div>
   {request.status === 'pending' && (
    <div className="flex gap-2 mt-2.5">
     <button className="btn-primary text-[10px] px-3 py-1 flex-1">Accept</button>
     <button className="btn-secondary text-[10px] px-3 py-1">Counter</button>
     <button className="btn-ghost text-[10px] px-3 py-1">Decline</button>
    </div>
   )}
  </div>
 )
}

// ─── Network Pack Card ───────────────────────────────────────

const genreColors: Record<string, string> = {
 Jazz: '#2D2540', House: '#4A9A62', Ambient: '#5A4D70', Techno: '#0D0B14',
 Disco: '#E87B35', 'R&B': '#7B6FA0', Soul: '#C04040', Electronic: '#2D2540',
 Funk: '#7B6FA0', Garage: '#4A9A62',
}

function NetworkPackCard({ listing }: { listing: NetworkPackListing }) {
 const { pack, store } = listing
 const barColor = genreColors[pack.genre] || '#3D3050'
 const { fee, shipping, buyerPays, rate } = calculateFees(pack.packPrice, 1)

 return (
  <div className="bg-waxe-card border border-waxe-border overflow-hidden clip-card">
   <div className="h-1" style={{ backgroundColor: barColor }} />
   <div className="p-5">
    <div className="flex items-start gap-4 mb-3">
     <PackArtworkGrid records={pack.records} />
     <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-1">
       <p className="text-[11px] font-semibold text-waxe-text truncate">{pack.name}</p>
       <StatusBadge status={pack.status} />
      </div>
      <p className="text-[10px] text-waxe-text-muted">
       {pack.genre} &middot; {pack.records.length} records &middot; Avg {'★'.repeat(Math.round(pack.avgCondition))}{'☆'.repeat(5 - Math.round(pack.avgCondition))}
      </p>
      <p className="text-[10px] text-waxe-text-secondary mt-0.5">
       {store.name} &middot; {store.location} &middot; Trust: {store.trustScore}
      </p>
      <div className="flex items-center gap-2 mt-1.5">
       <span className="text-[11px] text-waxe-text-muted line-through font-mono">${pack.totalValue}</span>
       <span className="text-[11px] font-semibold text-waxe-text font-mono">${pack.packPrice}</span>
       <span className="text-[10px] font-medium text-waxe-positive">(-{pack.discountPercent}%)</span>
      </div>
      <p className="text-[10px] text-waxe-text-muted mt-1">
       WAXED fee: <span className="font-mono font-bold text-waxe-warm">${fee}</span> ({Math.round(rate * 100)}%) · Shipping: <span className="font-mono">${shipping}</span> · Total: <span className="font-mono font-bold text-waxe-text">${buyerPays}</span>
      </p>
     </div>
    </div>
    <div className="flex gap-2 border-t border-waxe-border pt-3">
     <button className="btn-primary text-[10px] px-3 py-1.5 flex-1">Buy Pack</button>
     <button className="btn-secondary text-[10px] px-3 py-1.5 flex-1">View Contents</button>
    </div>
   </div>
  </div>
 )
}

// ─── Purchase Card ───────────────────────────────────────────

function PurchaseCard({ order }: { order: PackPurchase }) {
 const isSale = order.type === 'sale'

 return (
  <div className="bg-waxe-card border border-waxe-border p-4 clip-card">
   <div className="flex items-start justify-between mb-3">
    <div>
     <div className="flex items-center gap-2 mb-1">
      <span className={`text-[10px] font-semibold px-2 py-0.5 border ${
       isSale ? 'border-waxe-positive/40 text-waxe-positive bg-waxe-positive/5' : 'border-waxe-cool/40 text-waxe-cool bg-waxe-cool/5'
      }`}>
       {isSale ? 'You Sold' : 'You Bought'}
      </span>
      <StatusBadge status={order.status} />
     </div>
     <p className="text-sm font-semibold text-waxe-text">{order.pack.name}</p>
     <p className="text-[11px] text-waxe-text-muted">
      {order.pack.genre} &middot; {order.pack.recordCount} records &middot; {order.counterparty.name}, {order.counterparty.location}
     </p>
    </div>
    <p className="text-[10px] text-waxe-text-muted">{order.createdAt}</p>
   </div>
   <div className="bg-waxe-surface border border-waxe-border p-3 grid grid-cols-2 lg:grid-cols-4 gap-3">
    <div>
     <p className="text-[10px] font-medium text-waxe-text-muted mb-0.5">Pack Price</p>
     <p className="text-sm font-semibold text-waxe-text font-mono">${order.pack.packPrice}</p>
    </div>
    <div>
     <p className="text-[10px] font-medium text-waxe-text-muted mb-0.5">WAXED Fee</p>
     <p className="text-sm font-semibold text-waxe-warm font-mono">${order.waxedFee}</p>
    </div>
    <div>
     <p className="text-[10px] font-medium text-waxe-text-muted mb-0.5">Shipping</p>
     <p className="text-sm font-semibold text-waxe-text font-mono">${order.shipping}</p>
    </div>
    <div>
     <p className="text-[10px] font-medium text-waxe-text-muted mb-0.5">
      {isSale ? 'You Receive' : 'You Pay'}
     </p>
     <p className={`text-sm font-semibold font-mono ${isSale ? 'text-waxe-positive' : 'text-waxe-text'}`}>
      ${isSale ? order.sellerReceives : order.buyerPays}
     </p>
    </div>
   </div>
  </div>
 )
}

// ─── Page ────────────────────────────────────────────────────

const allRecordGenres = ['All', ...Array.from(new Set(networkRecords.map((r) => r.genre))).sort()]
const allRecordConditions = ['All', '★★★★★', '★★★★', '★★★', '★★', '★']
const allRecordStores = ['All', ...Array.from(new Set(networkRecords.map((r) => r.storeName))).sort()]
const allStoreGenres = ['All', ...Array.from(new Set(networkStores.flatMap((s) => s.specialtyGenres))).sort()]
const storeSortOptions = ['Trust Score', 'Swaps', 'Response Time', 'Name']

export default function MarketplacePage() {
 const { state, toggleDrawer } = useCart()
 const scrollRef = useRef<HTMLDivElement>(null)
 const [activePanel, setActivePanel] = useState(0)
 const panelCount = 4
 const [headerCollapsed, setHeaderCollapsed] = useState(false)
 const [selectedShelf, setSelectedShelf] = useState(0)
 const activeShelf = shelves[selectedShelf]
 const [socialLinks, setSocialLinks] = useState(storefrontConfig.socialLinks)
 const artworkMap = Object.fromEntries(inventoryRecords.map(r => [r.id, r.artworkUrl]))

 // Restock panel filters
 const [restockSearch, setRestockSearch] = useState('')
 const [restockGenreFilter, setRestockGenreFilter] = useState('All')
 const [restockConditionFilter, setRestockConditionFilter] = useState('All')
 const [restockStoreFilter, setRestockStoreFilter] = useState('All')
 const [selectedRecord, setSelectedRecord] = useState<NetworkRecord | null>(null)

 // Network panel filters
 const [storeSearch, setStoreSearch] = useState('')
 const [storeGenreFilter, setStoreGenreFilter] = useState('All')
 const [storeSortBy, setStoreSortBy] = useState('Trust Score')

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

 // Filtered restock records
 const filteredRecords = useMemo(() => {
  return networkRecords.filter((r) => {
   if (restockSearch) {
    const q = restockSearch.toLowerCase()
    if (!r.artist.toLowerCase().includes(q) && !r.title.toLowerCase().includes(q) && !r.genre.toLowerCase().includes(q)) return false
   }
   if (restockGenreFilter !== 'All' && r.genre !== restockGenreFilter) return false
   if (restockConditionFilter !== 'All' && r.condition !== restockConditionFilter.length) return false
   if (restockStoreFilter !== 'All' && r.storeName !== restockStoreFilter) return false
   return true
  })
 }, [restockSearch, restockGenreFilter, restockConditionFilter, restockStoreFilter])

 // Filtered + sorted stores
 const filteredStores = useMemo(() => {
  let stores = [...networkStores]
  if (storeSearch) {
   const q = storeSearch.toLowerCase()
   stores = stores.filter((s) =>
    s.name.toLowerCase().includes(q) || s.location.toLowerCase().includes(q) || s.specialtyGenres.some((g) => g.toLowerCase().includes(q))
   )
  }
  if (storeGenreFilter !== 'All') {
   stores = stores.filter((s) => s.specialtyGenres.includes(storeGenreFilter))
  }
  switch (storeSortBy) {
   case 'Trust Score': stores.sort((a, b) => b.trustScore - a.trustScore); break
   case 'Swaps': stores.sort((a, b) => b.completedSwaps - a.completedSwaps); break
   case 'Response Time': stores.sort((a, b) => a.responseTime.localeCompare(b.responseTime)); break
   case 'Name': stores.sort((a, b) => a.name.localeCompare(b.name)); break
  }
  return stores
 }, [storeSearch, storeGenreFilter, storeSortBy])

 const getStore = (storeId: string) => restockStores.find((s) => s.id === storeId)

 // Stats
 const pendingRequests = inboundPackRequests.filter((r) => r.status === 'pending')
 const tradeVolume = networkTransactions.reduce((sum, t) => sum + Math.abs(t.netValue), 0)
 const totalTxns = networkTransactions.length

 return (
  <div className="flex flex-col flex-1 min-h-0">
   <DashboardHeader
    title="Marketplace"
    subtitle="B2B marketplace — restock, trade, and manage your dealer network"
    actions={
     <div className="flex gap-2 items-center">
      <button className="btn-ghost text-xs px-3 py-1.5">Invite Store</button>
      <button onClick={toggleDrawer} className="btn-primary text-sm px-5 py-2">
       Cart {state.items.length > 0 && `(${state.items.length})`}
      </button>
     </div>
    }
   />

   {/* Collapsible header area */}
   <div className={`shrink-0 overflow-hidden transition-all duration-300 ${headerCollapsed ? 'max-h-0 opacity-0 mb-0' : 'max-h-[300px] opacity-100'}`}>
    {/* Recommended — auto-scrolling ticker */}
    <div className="mb-4">
     <p className="text-[11px] font-semibold text-waxe-text-muted mb-2">
      Recommended for you
     </p>
     <RecommendationTicker />
    </div>

    {/* Compact stats strip */}
    <div className="flex items-center gap-6 text-[11px] text-waxe-text-muted mb-3">
     <span><span className="font-mono font-bold text-waxe-text">47</span> stores</span>
     <span><span className="font-mono font-bold text-waxe-text">{pendingRequests.length}</span> pending requests</span>
     <span><span className="font-mono font-bold text-waxe-text">${tradeVolume}</span> trade volume</span>
    </div>
   </div>

   {/* Panel tabs */}
   <div className="shrink-0 flex items-center gap-1.5 pb-3 mb-3 border-b border-waxe-border pr-4">
    {['Restock', 'Collections', 'Network', 'My Storefront'].map((label, i) => (
     <button
      key={label}
      onClick={() => scrollToPanel(i)}
      className={`text-[11px] font-medium px-3 py-1.5 border ${
       activePanel === i
        ? 'bg-waxe-text text-waxe-deep border-waxe-text'
        : 'text-waxe-text bg-waxe-card/80 backdrop-blur-sm border-waxe-border hover:border-waxe-border-hover'
      }`}
     >
      {label}
     </button>
    ))}
    <button
     onClick={() => setHeaderCollapsed(!headerCollapsed)}
     className="ml-auto text-[10px] text-waxe-text-muted hover:text-waxe-text transition-colors"
     title={headerCollapsed ? 'Show metrics' : 'Hide metrics'}
    >
     {headerCollapsed ? '&#9660; Show' : '&#9650; Hide'}
    </button>
   </div>

   {/* Horizontal swipe panels */}
   <div className="relative flex-1 min-h-0 -mr-5 lg:-mr-6">
    <div ref={scrollRef} onScroll={handleScroll} className="absolute inset-0 overflow-x-auto overflow-y-hidden snap-x snap-mandatory flex gap-4 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>

    {/* ── Panel 1: Restock ── */}
    <div className="snap-start shrink-0 w-[92%] flex flex-col gap-4 min-h-0">
     {/* Search + Filters */}
     <div className="shrink-0 flex flex-wrap items-center gap-2">
      <input
       type="text"
       value={restockSearch}
       onChange={(e) => setRestockSearch(e.target.value)}
       placeholder="Search artist, title, genre..."
       className="input-field text-sm px-3 py-1.5 w-64"
      />
      <FilterDropdown label="Genre" options={allRecordGenres} value={restockGenreFilter} onChange={setRestockGenreFilter} />
      <FilterDropdown label="Condition" options={allRecordConditions} value={restockConditionFilter} onChange={setRestockConditionFilter} />
      <FilterDropdown label="Store" options={allRecordStores} value={restockStoreFilter} onChange={setRestockStoreFilter} />
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
           style={{ backgroundColor: rec.photoColor || '#3D3050' }}
          >
           {rec.artworkUrl ? (
            <img src={rec.artworkUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
           ) : (
            <span className="text-[6px] font-semibold text-white/50">LP</span>
           )}
          </div>
         </td>
         <td className="px-3 py-2.5">
          <p className="text-sm font-medium text-waxe-text">{rec.artist}</p>
          <p className="text-xs text-waxe-text-secondary">{rec.title} &middot; {rec.label} ({rec.year})</p>
         </td>
         <td className="px-3 py-2.5">
          <p className="text-sm text-waxe-text">{rec.storeName}</p>
          <p className="text-[11px] text-waxe-text-secondary">{rec.storeLocation}</p>
         </td>
         <td className="px-3 py-2.5 text-sm text-waxe-text">{rec.genre}</td>
         <td className="px-3 py-2.5 text-sm text-waxe-text">{'★'.repeat(rec.condition)}{'☆'.repeat(5 - rec.condition)}</td>
         <td className="px-3 py-2.5 text-sm font-bold text-waxe-text font-mono">${rec.price}</td>
         <td className="px-3 py-2.5 text-sm text-waxe-text-secondary font-mono">{rec.qty}</td>
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

    {/* ── Panel 2: Collections ── */}
    <div className="snap-start shrink-0 w-[92%] flex flex-col gap-4 min-h-0">
     <div className="shrink-0 flex items-center justify-between">
      <div>
       <h3 className="text-[11px] font-semibold text-waxe-text">
        Packs & Collections — {pendingRequests.length} Pending Requests
       </h3>
       <p className="text-[10px] text-waxe-text-secondary mt-0.5">Your packs for sale &middot; network packs to buy &middot; inbound requests &middot; order history</p>
      </div>
     </div>

     <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Left: Packs + Network Packs + Purchase History */}
      <div className="lg:col-span-2 min-h-0 flex flex-col">
       <div className="flex-1 min-h-0 overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin' }}>
        {/* Your Packs */}
        <div className="flex items-center gap-2 mb-2">
         <span className="designation-tag">Your Packs</span>
        </div>
        <div className="space-y-3 mb-6">
         {curatedPacks.map((pack) => (
          <PackCard key={pack.id} pack={pack} />
         ))}
        </div>

        {/* Network Packs */}
        <div className="hatch-divider-strong mb-3" />
        <div className="flex items-center gap-2 mb-2">
         <span className="designation-tag">Network Packs</span>
        </div>
        <div className="space-y-3 mb-6">
         {networkPackListings.map((listing) => (
          <NetworkPackCard key={listing.id} listing={listing} />
         ))}
        </div>

        {/* Purchase History */}
        <div className="hatch-divider-strong mb-3" />
        <div className="flex items-center gap-2 mb-2">
         <span className="designation-tag">Order History</span>
        </div>
        <div className="space-y-3">
         {packPurchases.map((order) => (
          <PurchaseCard key={order.id} order={order} />
         ))}
        </div>
       </div>
      </div>

      {/* Right: Inbound Requests */}
      <div className="lg:col-span-1 min-h-0 flex flex-col">
       <div className="flex items-center gap-2 mb-2">
        <span className="designation-tag">Inbound Requests</span>
       </div>
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

    {/* ── Panel 3: Network ── */}
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
      <FilterDropdown label="Genre" options={allStoreGenres} value={storeGenreFilter} onChange={setStoreGenreFilter} />
      <FilterDropdown label="Sort" options={storeSortOptions} value={storeSortBy} onChange={setStoreSortBy} />
      <span className="text-[11px] text-waxe-text-muted ml-auto font-mono">{filteredStores.length} stores</span>
     </div>

     {/* Store Grid */}
     <div className="flex-1 min-h-0 overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin' }}>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 mb-6">
       {filteredStores.map((store) => (
        <StoreCard key={store.id} store={store} />
       ))}
      </div>

      {/* Transaction History */}
      <div className="hatch-divider-strong mb-3" />
      <div className="flex items-center justify-between mb-3">
       <div>
        <h3 className="text-[11px] font-semibold text-waxe-text">
         Transaction History — {totalTxns} Completed
        </h3>
        <p className="text-[10px] text-waxe-text-muted mt-0.5">All B2B trades across your dealer network</p>
       </div>
       <button className="btn-ghost text-[11px]">Export CSV</button>
      </div>
      <div className="space-y-2">
       {networkTransactions.map((txn) => (
        <TransactionRow key={txn.id} transaction={txn} />
       ))}
      </div>
     </div>
    </div>

    {/* ── Panel 4: My Storefront ── */}
    <div className="snap-start shrink-0 w-[92%] flex flex-col gap-4 min-h-0">
     <div className="shrink-0 flex items-center justify-between">
      <div className="flex items-center gap-3">
       <button className="btn-ghost text-sm px-2 py-1" onClick={() => scrollToPanel(0)}>
        {'<< '}Back
       </button>
       <div>
        <h3 className="text-[11px] font-semibold text-waxe-text">My Storefront</h3>
        <p className="text-[10px] text-waxe-text-muted">Customize your online record store</p>
       </div>
      </div>
      <div className="flex items-center gap-3">
       <StatusBadge status={storefrontConfig.status} label={storefrontConfig.status === 'live' ? 'Live' : 'Draft'} />
       <button className="btn-secondary text-sm px-3 py-1.5">Preview</button>
       <button className="btn-primary text-sm px-3 py-1.5">Publish</button>
      </div>
     </div>

     <div className="flex-1 min-h-0 overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin' }}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
       {/* Customize */}
       <div className="bg-waxe-card border border-waxe-border p-5 clip-card">
        <h2 className="text-[11px] font-semibold text-waxe-text mb-2">Customize</h2>
        <div className="hatch-divider mb-4" />
        <div className="space-y-3">
         <div>
          <label className="label-text">Store Name</label>
          <input type="text" className="input-field" defaultValue={storefrontConfig.storeName} />
         </div>
         <div>
          <label className="label-text">Description</label>
          <textarea className="input-field resize-none h-16" defaultValue={storefrontConfig.description} />
         </div>
         <div className="grid grid-cols-2 gap-3">
          <div>
           <label className="label-text">Primary</label>
           <div className="flex items-center gap-2">
            <div className="w-7 h-7 border border-waxe-border" style={{ background: storefrontConfig.primaryColor }} />
            <span className="text-[11px] font-mono text-waxe-text-muted">{storefrontConfig.primaryColor}</span>
           </div>
          </div>
          <div>
           <label className="label-text">Accent</label>
           <div className="flex items-center gap-2">
            <div className="w-7 h-7 border border-waxe-border" style={{ background: storefrontConfig.accentColor }} />
            <span className="text-[11px] font-mono text-waxe-text-muted">{storefrontConfig.accentColor}</span>
           </div>
          </div>
         </div>
         <div className="grid grid-cols-2 gap-3">
          <div>
           <label className="label-text">Logo</label>
           <div className="border border-dashed border-waxe-border hover:border-waxe-border-hover p-3 text-center cursor-pointer transition-colors">
            <p className="text-xs text-waxe-text-muted mb-0.5">↑ Upload</p>
            <p className="text-[10px] text-waxe-text-muted">PNG, SVG</p>
           </div>
          </div>
          <div>
           <label className="label-text">Header Image</label>
           <div className="border border-dashed border-waxe-border hover:border-waxe-border-hover p-3 text-center cursor-pointer transition-colors">
            <p className="text-xs text-waxe-text-muted mb-0.5">↑ Upload</p>
            <p className="text-[10px] text-waxe-text-muted">JPG, PNG</p>
           </div>
          </div>
         </div>
        </div>
       </div>

       {/* Social Links */}
       <div className="bg-waxe-card border border-waxe-border p-5 clip-card">
        <h2 className="text-[11px] font-semibold text-waxe-text mb-2">Social Links</h2>
        <div className="hatch-divider mb-4" />
        <div className="space-y-2">
         {([
          { key: 'instagram' as keyof StorefrontSocialLinks, label: 'Instagram', icon: '◎' },
          { key: 'twitter' as keyof StorefrontSocialLinks, label: 'X / Twitter', icon: '𝕏' },
          { key: 'tiktok' as keyof StorefrontSocialLinks, label: 'TikTok', icon: '♪' },
          { key: 'facebook' as keyof StorefrontSocialLinks, label: 'Facebook', icon: 'f' },
          { key: 'youtube' as keyof StorefrontSocialLinks, label: 'YouTube', icon: '▶' },
          { key: 'bandcamp' as keyof StorefrontSocialLinks, label: 'Bandcamp', icon: '◆' },
         ]).map((platform) => (
          <div key={platform.key} className="flex items-center gap-2">
           <span className="w-6 h-6 flex items-center justify-center text-sm text-waxe-text-muted shrink-0">{platform.icon}</span>
           <input
            type="text"
            placeholder={platform.label}
            className="input-field text-xs flex-1"
            value={socialLinks[platform.key] || ''}
            onChange={(e) => setSocialLinks({ ...socialLinks, [platform.key]: e.target.value || undefined })}
           />
          </div>
         ))}
        </div>
       </div>

       {/* Shelves */}
       <div className="bg-waxe-card border border-waxe-border p-5 clip-card">
        <div className="flex items-center justify-between mb-2">
         <h2 className="text-[11px] font-semibold text-waxe-text">Shelves</h2>
         <button className="btn-ghost text-xs">+ Add</button>
        </div>
        <div className="hatch-divider mb-3" />
        <div className="space-y-2">
         {shelves.map((shelf, i) => (
          <ShelfCard
           key={shelf.id}
           shelf={shelf}
           isSelected={i === selectedShelf}
           onSelect={() => setSelectedShelf(i)}
           artworkMap={artworkMap}
          />
         ))}
        </div>
       </div>

       {/* Selected shelf records */}
       <div className="bg-waxe-card border border-waxe-border p-5 clip-card">
        <div className="flex items-center justify-between mb-2">
         <h2 className="text-[11px] font-semibold text-waxe-text">{activeShelf.name}</h2>
         <button className="btn-ghost text-xs">+ Add</button>
        </div>
        <div className="hatch-divider mb-3" />
        <div className="space-y-1">
         {activeShelf.records.map((record) => (
          <div key={record.id} className="flex items-center justify-between py-2 px-2 hover:bg-waxe-surface/30 transition-colors">
           <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 bg-waxe-surface overflow-hidden shrink-0">
             {artworkMap[record.id] ? (
              <img src={artworkMap[record.id]} alt="" className="w-full h-full object-cover" />
             ) : (
              <div className="w-full h-full flex items-center justify-center text-[11px] font-medium text-waxe-text-muted">
               {record.artist.split(' ').pop()?.charAt(0)}
              </div>
             )}
            </div>
            <div className="min-w-0">
             <p className="text-xs text-waxe-text truncate">{record.artist}</p>
             <p className="text-[11px] text-waxe-text-muted truncate">{record.title}</p>
            </div>
           </div>
           <button
            className={`w-6 h-6 flex items-center justify-center text-xs shrink-0 ${
             record.featured
              ? 'bg-waxe-warm/15 text-waxe-cool border border-waxe-warm/25'
              : 'bg-waxe-surface text-waxe-text-muted border border-waxe-border'
            }`}
           >
            ★
           </button>
          </div>
         ))}
        </div>
       </div>
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
      className="absolute right-0 top-0 bottom-0 w-40 flex items-center justify-end pr-4 pointer-events-auto z-10"
      style={{ background: 'linear-gradient(to right, transparent 0%, var(--color-waxe-deep) 100%)' }}
      aria-label="Next panel"
     >
      <span className="w-10 h-10 flex items-center justify-center bg-waxe-card border border-waxe-border text-waxe-text text-xl font-bold shadow-lg">→</span>
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
