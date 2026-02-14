'use client'

import { useState, useMemo } from 'react'
import { DashboardHeader, StatCard, FilterDropdown, StatusBadge } from '@/components/dashboard'
import { marketplaceListings, marketplaceRecommendations, marketplaceSellers } from '@/lib/marketplace-data'
import type { MarketplaceListing } from '@/lib/marketplace-data'
import { useCart } from '@/lib/cart-context'

// ─── Genre color bars ────────────────────────────────────────

const genreColors: Record<string, string> = {
  Techno: '#1B2632',
  House: '#3D7A4F',
  Electronic: '#4A5B6D',
  'Hip-Hop': '#C04040',
  Ambient: '#DED8CC',
  Disco: '#FFB162',
  Jazz: '#2C3B4D',
  Soul: '#A35139',
  Dub: '#E89A4D',
  Classical: '#C9C1B1',
  Country: '#A35139',
  Electro: '#2C3B4D',
  'R&B': '#C04040',
  Pop: '#FFB162',
}

// ─── MarketplaceListingCard ──────────────────────────────────

function MarketplaceListingCard({ listing }: { listing: MarketplaceListing }) {
  const { addItem, toggleDrawer } = useCart()
  const [qty, setQty] = useState(listing.minOrderQty)

  const handleAdd = () => {
    addItem(listing, qty)
    toggleDrawer()
  }

  return (
    <div className="border-2 border-waxe-border bg-waxe-card">
      {/* Genre color bar */}
      <div className="h-[2px]" style={{ backgroundColor: genreColors[listing.genre] || '#4A5B6D' }} />

      <div className="p-4">
        {/* Top: artwork + info + price */}
        <div className="flex gap-3 mb-3">
          <div
            className="w-12 h-12 shrink-0 border border-waxe-border flex items-center justify-center overflow-hidden"
            style={{ backgroundColor: listing.photoColor || '#2C3B4D' }}
          >
            {listing.artworkUrl ? (
              <img src={listing.artworkUrl} alt={`${listing.artist} — ${listing.title}`} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs font-black text-white/30">LP</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-waxe-text truncate">{listing.artist}</p>
            <p className="text-[11px] text-waxe-text-muted truncate">{listing.title}</p>
            <p className="text-[9px] text-waxe-text-muted uppercase tracking-wider mt-0.5">
              {listing.label} &middot; {listing.year} &middot; {listing.format}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-sm font-black font-mono text-waxe-text">${listing.wholesalePrice.toFixed(2)}</p>
            <p className="text-[9px] text-waxe-text-muted uppercase">/unit</p>
          </div>
        </div>

        {/* Seller row */}
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-none ${
            listing.sellerType === 'label' ? 'bg-waxe-text text-waxe-deep' :
            listing.sellerType === 'distributor' ? 'bg-waxe-cool text-waxe-deep' :
            'border border-waxe-border text-waxe-text-muted'
          }`}>
            {listing.sellerType}
          </span>
          <span className="text-[11px] text-waxe-text-secondary truncate">{listing.seller.name}</span>
          <span className="text-[10px] text-waxe-text-muted">&middot; {listing.seller.location}</span>
          {listing.sellerType === 'store' && listing.seller.rating && (
            <span className="text-[10px] font-mono text-waxe-text-muted ml-auto shrink-0">Trust: {listing.seller.rating}</span>
          )}
        </div>

        {/* Availability */}
        <div className="flex items-center gap-2 mb-2">
          <StatusBadge status={listing.listingType} />
          <span className="text-[11px] text-waxe-text-muted">
            {listing.listingType === 'backorder' ? 'Awaiting repress' :
             `${listing.availableQty} available`} &middot; Min {listing.minOrderQty}
          </span>
        </div>

        {listing.listingType === 'pre_order' && listing.releaseDate && (
          <p className="text-[10px] text-waxe-warm font-bold uppercase tracking-wider mb-2">
            &gt;&gt; Release: {listing.releaseDate}
          </p>
        )}

        {/* Condition */}
        <p className="text-[11px] text-waxe-text-muted mb-3">
          {'★'.repeat(listing.condition)}{'☆'.repeat(5 - listing.condition)}
          {listing.retailSuggested && (
            <span className="ml-2 text-[10px]">MSRP ${listing.retailSuggested.toFixed(2)}</span>
          )}
        </p>

        {/* Action row */}
        <div className="flex items-center gap-2 pt-3 border-t border-waxe-border/40">
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
    <div className="border-2 border-waxe-border bg-waxe-card min-w-[280px] max-w-[320px] shrink-0 snap-start">
      <div className="h-[2px]" style={{ backgroundColor: genreColors[listing.genre] || '#4A5B6D' }} />
      <div className="p-4">
        <div className="flex gap-3 mb-2">
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
            <p className="text-sm font-bold text-waxe-text truncate">{listing.artist}</p>
            <p className="text-[11px] text-waxe-text-muted truncate">{listing.title}</p>
          </div>
          <p className="text-sm font-black font-mono text-waxe-text shrink-0">${listing.wholesalePrice.toFixed(2)}</p>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 bg-waxe-warm text-waxe-text rounded-none">
            {basedOnLabel[basedOn] || basedOn}
          </span>
          <span className="text-[10px] text-waxe-text-muted">{listing.seller.name}</span>
        </div>
        <p className="text-[11px] text-waxe-text-secondary leading-relaxed mb-3">{reason}</p>
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

// ─── Page ────────────────────────────────────────────────────

export default function MarketplacePage() {
  const { state, toggleDrawer } = useCart()
  const [search, setSearch] = useState('')
  const [sourceFilter, setSourceFilter] = useState('All')
  const [genreFilter, setGenreFilter] = useState('All')
  const [conditionFilter, setConditionFilter] = useState('All')
  const [availFilter, setAvailFilter] = useState('All')

  const { subtotal, totalUnits } = useMemo(() => {
    const sub = state.items.reduce((s, i) => s + i.qty * i.listing.wholesalePrice, 0)
    const units = state.items.reduce((s, i) => s + i.qty, 0)
    return { subtotal: sub, totalUnits: units }
  }, [state.items])

  // Extract genres from listings
  const genres = useMemo(() => {
    const set = new Set(marketplaceListings.map((l) => l.genre))
    return ['All', ...Array.from(set).sort()]
  }, [])

  // Filter listings
  const filtered = useMemo(() => {
    return marketplaceListings.filter((l) => {
      // Search
      if (search) {
        const q = search.toLowerCase()
        const match = [l.artist, l.title, l.genre, l.label, ...(l.tags || [])].some((f) => f.toLowerCase().includes(q))
        if (!match) return false
      }
      // Source
      if (sourceFilter === 'Labels' && l.sellerType !== 'label') return false
      if (sourceFilter === 'Distributors' && l.sellerType !== 'distributor') return false
      if (sourceFilter === 'Stores' && l.sellerType !== 'store') return false
      // Genre
      if (genreFilter !== 'All' && l.genre !== genreFilter) return false
      // Condition
      if (conditionFilter === 'Mint 5' && l.condition !== 5) return false
      if (conditionFilter === 'Excellent 4' && l.condition !== 4) return false
      if (conditionFilter === 'Good 3' && l.condition !== 3) return false
      if (conditionFilter === 'Fair 2' && l.condition !== 2) return false
      // Availability
      if (availFilter === 'In Stock' && l.listingType !== 'in_stock') return false
      if (availFilter === 'Pre-Order' && l.listingType !== 'pre_order') return false
      return true
    })
  }, [search, sourceFilter, genreFilter, conditionFilter, availFilter])

  // Stats
  const labelDistroCount = marketplaceSellers.filter((s) => s.type === 'label' || s.type === 'distributor').length
  const storeCount = marketplaceSellers.filter((s) => s.type === 'store').length

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Header */}
      <DashboardHeader
        title="Marketplace"
        subtitle="Wholesale B2B marketplace — labels, distributors, and dealer inventory"
        actions={
          <button onClick={toggleDrawer} className="btn-secondary text-[11px] px-4 py-2">
            Cart {state.items.length > 0 && `(${state.items.length})`}
          </button>
        }
      />

      {/* Stats */}
      <div className="shrink-0 grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
        <StatCard label="Available Listings" value={String(marketplaceListings.length)} trend={`${filtered.length} shown`} trendUp />
        <StatCard label="Labels & Distros" value={String(labelDistroCount)} trend="Verified sellers" trendUp />
        <StatCard label="Network Stores" value={String(storeCount)} trend="Dealer inventory" trendUp />
        <StatCard label="Your Cart" value={state.items.length > 0 ? `$${subtotal.toFixed(0)}` : '$0'} trend={state.items.length > 0 ? `${totalUnits} units` : 'Empty'} trendUp={state.items.length > 0} />
      </div>

      {/* Recommended */}
      <div className="shrink-0 mb-3">
        <div className="flex items-center gap-2 mb-2">
          <p className="text-[11px] font-black uppercase tracking-[0.15em] text-waxe-text">
            Recommended For You
          </p>
          <span className="text-[10px] text-waxe-text-muted uppercase tracking-wider">
            &gt;&gt; Based on your sales data
          </span>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
          {marketplaceRecommendations.map((rec) => (
            <RecommendationCard
              key={rec.id}
              listing={rec.listing}
              reason={rec.reason}
              basedOn={rec.basedOn}
            />
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="shrink-0 mb-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search artists, titles, labels, genres..."
          className="input-field py-3 text-sm"
        />
      </div>

      {/* Filters */}
      <div className="shrink-0 flex flex-wrap items-center gap-2 mb-3">
        <FilterDropdown label="Source" options={['All', 'Labels', 'Distributors', 'Stores']} value={sourceFilter} onChange={setSourceFilter} />
        <FilterDropdown label="Genre" options={genres} value={genreFilter} onChange={setGenreFilter} />
        <FilterDropdown label="Condition" options={['All', 'Mint 5', 'Excellent 4', 'Good 3', 'Fair 2']} value={conditionFilter} onChange={setConditionFilter} />
        <FilterDropdown label="Availability" options={['All', 'In Stock', 'Pre-Order']} value={availFilter} onChange={setAvailFilter} />
        <span className="ml-auto text-[11px] font-bold text-waxe-text-muted uppercase tracking-[0.1em]">
          {filtered.length} result{filtered.length !== 1 ? 's' : ''}
        </span>
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
