'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { DashboardHeader, FilterDropdown, StatusBadge } from '@/components/dashboard'
import { marketplaceListings, marketplaceRecommendations } from '@/lib/marketplace-data'
import type { MarketplaceListing } from '@/lib/marketplace-data'
import { useCart } from '@/lib/cart-context'

// ─── MarketplaceListingCard ──────────────────────────────────

function MarketplaceListingCard({ listing }: { listing: MarketplaceListing }) {
  const { addItem, toggleDrawer } = useCart()
  const [qty, setQty] = useState(listing.minOrderQty)

  const handleAdd = () => {
    addItem(listing, qty)
    toggleDrawer()
  }

  return (
    <div className="border-2 border-waxe-border bg-waxe-card flex flex-col">
      <div className="p-4 flex-1">
        {/* Artwork + info + price */}
        <div className="flex gap-3 mb-3">
          <div
            className="w-14 h-14 shrink-0 border-2 border-waxe-border flex items-center justify-center overflow-hidden"
            style={{ backgroundColor: listing.photoColor || '#2C3B4D' }}
          >
            {listing.artworkUrl ? (
              <img src={listing.artworkUrl} alt={`${listing.artist} — ${listing.title}`} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs font-black text-white/30">LP</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-waxe-text truncate">{listing.title}</p>
            <p className="text-[11px] font-bold text-waxe-text-muted truncate">{listing.artist}</p>
            <p className="text-[9px] text-waxe-text-muted uppercase tracking-wider mt-1">
              {listing.label} &middot; {listing.year} &middot; {listing.format}
              &middot; {'★'.repeat(listing.condition)}{'☆'.repeat(5 - listing.condition)}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-lg font-black font-mono text-waxe-text leading-none">${listing.wholesalePrice.toFixed(2)}</p>
            <p className="text-[9px] text-waxe-text-muted uppercase mt-0.5">/unit</p>
            {listing.retailSuggested && (
              <p className="text-[9px] text-waxe-text-muted mt-0.5">MSRP ${listing.retailSuggested.toFixed(2)}</p>
            )}
          </div>
        </div>

        {/* Seller + availability in one row */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-none ${
            listing.sellerType === 'label' ? 'bg-waxe-text text-waxe-deep' :
            listing.sellerType === 'distributor' ? 'bg-waxe-cool text-waxe-deep' :
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
      <div className="flex items-center gap-2 px-4 py-3 border-t-2 border-waxe-border bg-waxe-surface/30">
        <input
          type="number"
          min={listing.minOrderQty}
          max={listing.availableQty || undefined}
          value={qty}
          onChange={(e) => setQty(Math.max(listing.minOrderQty, parseInt(e.target.value) || listing.minOrderQty))}
          className="w-20 px-2 py-1.5 text-sm bg-waxe-deep border-2 border-waxe-border text-waxe-text rounded-none text-center font-mono"
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
    <div className="border-2 border-waxe-border bg-waxe-card min-w-[260px] max-w-[300px] shrink-0 snap-start flex flex-col">
      <div className="p-3 flex-1">
        <div className="flex gap-2.5 mb-2">
          <div
            className="w-10 h-10 shrink-0 border border-waxe-border flex items-center justify-center overflow-hidden"
            style={{ backgroundColor: listing.photoColor || '#2C3B4D' }}
          >
            {listing.artworkUrl ? (
              <img src={listing.artworkUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-[9px] font-black text-white/30">LP</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-waxe-text truncate">{listing.title}</p>
            <p className="text-[11px] font-bold text-waxe-text-muted truncate">{listing.artist}</p>
          </div>
          <p className="text-sm font-black font-mono text-waxe-text shrink-0">${listing.wholesalePrice.toFixed(2)}</p>
        </div>
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 bg-waxe-warm text-waxe-text rounded-none">
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

// ─── Page ────────────────────────────────────────────────────

export default function MarketplacePage() {
  const { state, toggleDrawer } = useCart()
  const [search, setSearch] = useState('')
  const [sourceFilter, setSourceFilter] = useState('All')
  const [genreFilter, setGenreFilter] = useState('All')
  const [conditionFilter, setConditionFilter] = useState('All')
  const [availFilter, setAvailFilter] = useState('All')

  // Extract genres from listings
  const genres = useMemo(() => {
    const set = new Set(marketplaceListings.map((l) => l.genre))
    return ['All', ...Array.from(set).sort()]
  }, [])

  // Filter listings
  const filtered = useMemo(() => {
    return marketplaceListings.filter((l) => {
      if (search) {
        const q = search.toLowerCase()
        const match = [l.artist, l.title, l.genre, l.label, ...(l.tags || [])].some((f) => f.toLowerCase().includes(q))
        if (!match) return false
      }
      if (sourceFilter === 'Labels' && l.sellerType !== 'label') return false
      if (sourceFilter === 'Distributors' && l.sellerType !== 'distributor') return false
      if (sourceFilter === 'Stores' && l.sellerType !== 'store') return false
      if (genreFilter !== 'All' && l.genre !== genreFilter) return false
      if (conditionFilter === 'Mint 5' && l.condition !== 5) return false
      if (conditionFilter === 'Excellent 4' && l.condition !== 4) return false
      if (conditionFilter === 'Good 3' && l.condition !== 3) return false
      if (conditionFilter === 'Fair 2' && l.condition !== 2) return false
      if (availFilter === 'In Stock' && l.listingType !== 'in_stock') return false
      if (availFilter === 'Pre-Order' && l.listingType !== 'pre_order') return false
      return true
    })
  }, [search, sourceFilter, genreFilter, conditionFilter, availFilter])

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <DashboardHeader
        title="Marketplace"
        subtitle="Wholesale B2B marketplace — labels, distributors, and dealer inventory"
        actions={
          <button onClick={toggleDrawer} className="btn-secondary text-[11px] px-4 py-2">
            Cart {state.items.length > 0 && `(${state.items.length})`}
          </button>
        }
      />

      {/* Recommended — auto-scrolling ticker */}
      <div className="shrink-0 mb-4">
        <p className="text-[11px] font-black uppercase tracking-[0.15em] text-waxe-text-muted mb-2">
          <span className="text-waxe-cool">{'>>'}</span> Recommended for you
        </p>
        <RecommendationTicker />
      </div>

      {/* Search + Filters — single block */}
      <div className="shrink-0 mb-3 space-y-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search artists, titles, labels, genres..."
          className="input-field py-3 text-sm"
        />
        <div className="flex flex-wrap items-center gap-2">
          <FilterDropdown label="Source" options={['All', 'Labels', 'Distributors', 'Stores']} value={sourceFilter} onChange={setSourceFilter} />
          <FilterDropdown label="Genre" options={genres} value={genreFilter} onChange={setGenreFilter} />
          <FilterDropdown label="Condition" options={['All', 'Mint 5', 'Excellent 4', 'Good 3', 'Fair 2']} value={conditionFilter} onChange={setConditionFilter} />
          <FilterDropdown label="Availability" options={['All', 'In Stock', 'Pre-Order']} value={availFilter} onChange={setAvailFilter} />
          <span className="ml-auto text-[11px] font-bold text-waxe-text-muted uppercase tracking-[0.1em]">
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Results Grid */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg font-black text-waxe-text-muted uppercase tracking-wider">No results</p>
            <p className="text-[11px] text-waxe-text-muted mt-2">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 pb-4">
            {filtered.map((listing) => (
              <MarketplaceListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
