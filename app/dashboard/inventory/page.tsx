'use client'

import { useState, useCallback } from 'react'
import { DashboardHeader, StatCard, StatusBadge, FilterDropdown, DataTable } from '@/components/dashboard'
import { inventoryRecords, catalogResults, importBatch, crates, type InventoryRecord } from '@/lib/dashboard-data'
import { useMemo } from 'react'
import { exportToCSV } from '@/lib/export-utils'
import { discountRules } from '@/lib/settings-data'
import { consignors, consignmentPayouts, consignedRecords } from '@/lib/consignment-data'
import { inventoryAudits } from '@/lib/audit-data'
import { creditAccounts, creditTransactions, getCreditStats, getCreditTransactions, type StoreCreditAccount, type CreditTransaction } from '@/lib/store-credit-data'
import { customerProfiles } from '@/lib/customer-data'

const syncSourceLabel: Record<string, string> = {
 discogs: 'Discogs',
 shopify: 'Shopify',
 csv: 'CSV',
 manual: 'Manual',
}

const syncSourceColor: Record<string, string> = {
 discogs: 'text-waxe-text',
 shopify: 'text-waxe-text-secondary',
 csv: 'text-waxe-text-muted',
 manual: 'text-waxe-text-muted',
}

function autoColor(str: string) {
 let hash = 0
 for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash)
 const h = Math.abs(hash) % 360
 return `hsl(${h}, 30%, 22%)`
}

const conditionLabels: Record<number, string> = {
 5: 'Mint', 4: 'Excellent', 3: 'Good', 2: 'Fair', 1: 'Poor',
}

export default function InventoryPage() {
 const [search, setSearch] = useState('')
 const [genreFilter, setGenreFilter] = useState('All')
 const [conditionFilter, setConditionFilter] = useState('All')
 const [statusFilter, setStatusFilter] = useState('All')
 const [showCatalog, setShowCatalog] = useState(false)
 const [showImport, setShowImport] = useState(false)
 const [catalogSearch, setCatalogSearch] = useState('Aphex Twin')
 const [selectedRecord, setSelectedRecord] = useState<InventoryRecord | null>(null)
 const [detailMode, setDetailMode] = useState<'view' | 'edit'>('view')
 const [activeCrate, setActiveCrate] = useState('crate-all')
 const [selectedRecords, setSelectedRecords] = useState<Set<string>>(new Set())
 const [lastClickedIndex, setLastClickedIndex] = useState<number | null>(null)
 const [showPriceAdjust, setShowPriceAdjust] = useState(false)
 const [priceMode, setPriceMode] = useState<'percentage' | 'suggested' | 'discogs' | 'flat'>('percentage')
 const [priceValue, setPriceValue] = useState('')
 const [priceApplied, setPriceApplied] = useState(false)
 const [showDiscounts, setShowDiscounts] = useState(false)
 const [showConsignment, setShowConsignment] = useState(false)
 const [showAudit, setShowAudit] = useState(false)
 const [showStoreCredit, setShowStoreCredit] = useState(false)

 const consignedIds = useMemo(() => new Set(consignedRecords.filter(c => c.status === 'active').map(c => c.inventoryId)), [])
 const activeDiscounts = discountRules.filter(d => d.active)
 const activeAudit = inventoryAudits.find(a => a.status === 'in_progress')

 const filtered = inventoryRecords.filter((r) => {
  // Crate filter
  if (activeCrate !== 'crate-all') {
   const crate = crates.find((c) => c.id === activeCrate)
   if (crate && !crate.records.includes(r.id)) return false
  }
  if (search) {
   const q = search.toLowerCase()
   if (!r.artist.toLowerCase().includes(q) && !r.title.toLowerCase().includes(q) && !r.id.toLowerCase().includes(q) && !r.label.toLowerCase().includes(q)) return false
  }
  if (genreFilter !== 'All' && r.genre !== genreFilter) return false
  if (conditionFilter !== 'All' && String(r.condition) !== conditionFilter) return false
  if (statusFilter !== 'All' && r.status !== statusFilter) return false
  return true
 })

 const pricePreview = useMemo(() => {
  const selected = filtered.filter((r) => selectedRecords.has(r.id))
  const count = selected.length
  const currentTotal = selected.reduce((sum, r) => sum + r.price, 0)
  let newTotal = currentTotal

  if (priceMode === 'percentage' && priceValue) {
   const pct = parseFloat(priceValue) / 100
   newTotal = selected.reduce((sum, r) => sum + r.price * (1 + pct), 0)
  } else if (priceMode === 'suggested') {
   newTotal = selected.reduce((sum, r) => sum + (r.suggestedPrice || r.price), 0)
  } else if (priceMode === 'discogs') {
   newTotal = selected.reduce((sum, r) => sum + (r.discogsMedian || r.price), 0)
  } else if (priceMode === 'flat' && priceValue) {
   const flat = parseFloat(priceValue)
   newTotal = selected.reduce((sum, r) => sum + r.price + flat, 0)
  }

  const change = newTotal - currentTotal
  const changePct = currentTotal > 0 ? (change / currentTotal) * 100 : 0
  return { count, currentTotal, newTotal, change, changePct }
 }, [filtered, selectedRecords, priceMode, priceValue])

 const handleRowClick = useCallback((record: InventoryRecord, index: number, e: React.MouseEvent) => {
  if (e.shiftKey && lastClickedIndex !== null) {
   // Range select
   const start = Math.min(lastClickedIndex, index)
   const end = Math.max(lastClickedIndex, index)
   const next = new Set(selectedRecords)
   for (let i = start; i <= end; i++) {
    next.add(filtered[i].id)
   }
   setSelectedRecords(next)
  } else if (e.metaKey || e.ctrlKey) {
   // Toggle single
   const next = new Set(selectedRecords)
   if (next.has(record.id)) {
    next.delete(record.id)
   } else {
    next.add(record.id)
   }
   setSelectedRecords(next)
  } else {
   // Normal click — open detail
   setSelectedRecord(record)
   return
  }
  setLastClickedIndex(index)
 }, [lastClickedIndex, selectedRecords, filtered])

 return (
  <div className="flex flex-col flex-1 min-h-0">
   <DashboardHeader
    title="Inventory"
    subtitle={`${inventoryRecords.length} titles across all channels`}
    actions={
     <div className="flex gap-2">
      <button className="btn-ghost text-sm px-3 py-2" onClick={() => exportToCSV(filtered as unknown as Record<string, unknown>[], `inventory-${new Date().toISOString().slice(0,10)}`, [
       { key: 'id', header: 'ID' }, { key: 'artist', header: 'Artist' }, { key: 'title', header: 'Title' },
       { key: 'label', header: 'Label' }, { key: 'year', header: 'Year' }, { key: 'condition', header: 'Condition' },
       { key: 'price', header: 'Price' }, { key: 'genre', header: 'Genre' }, { key: 'status', header: 'Status' },
       { key: 'format', header: 'Format' }, { key: 'pressing', header: 'Pressing' }, { key: 'catalogNo', header: 'Catalog No' },
      ])}>Export CSV</button>
      <button className="btn-ghost text-sm px-3 py-2" onClick={() => setShowDiscounts(true)}>
       Discounts{activeDiscounts.length > 0 && <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 text-[11px] font-medium bg-waxe-warm text-waxe-deep">{activeDiscounts.length}</span>}
      </button>
      <button className="btn-ghost text-sm px-3 py-2" onClick={() => setShowStoreCredit(true)}>
       Store Credit
      </button>
      <button className="btn-ghost text-sm px-3 py-2" onClick={() => setShowConsignment(true)}>Consignment</button>
      <button className="btn-ghost text-sm px-3 py-2" onClick={() => setShowAudit(true)}>Audit</button>
      <button className="btn-secondary text-sm px-4 py-2" onClick={() => setShowImport(true)}>Import</button>
      <button className="btn-primary text-sm px-4 py-2" onClick={() => setShowCatalog(true)}>+ Add Record</button>
     </div>
    }
   />

   {/* Stats Row */}
   <div className="shrink-0 grid grid-cols-2 lg:grid-cols-3 gap-3 mb-3 p-2 -m-2">
    <StatCard label="Total Records" value="2,847" trend="+124" trendUp={true} />
    <StatCard label="Active Listings" value="2,412" trend="+98" trendUp={true} />
    <StatCard label="Sell Thru Rate" value="6.5%" trend="+0.8%" trendUp={true} />
   </div>

   {/* Search + Filters */}
   <div className="shrink-0 flex flex-wrap items-center gap-2 mb-3">
    <input
     type="text"
     placeholder="Search artist, title, label, ID..."
     className="bg-waxe-card border border-waxe-border text-sm text-waxe-text placeholder:text-waxe-text-secondary px-3 py-1.5 w-48 lg:w-56 focus:outline-none focus:border-waxe-border-hover"
     value={search}
     onChange={(e) => setSearch(e.target.value)}
    />
    <FilterDropdown label="Genre" options={['All', 'Techno', 'House', 'Ambient', 'Electro', 'Dub Techno', 'Acid']} value={genreFilter} onChange={setGenreFilter} />
    <FilterDropdown label="Condition" options={['All', '5', '4', '3', '2', '1']} value={conditionFilter} onChange={setConditionFilter} />
    <FilterDropdown label="Status" options={['All', 'active', 'sold', 'reserved', 'pending']} value={statusFilter} onChange={setStatusFilter} />
   </div>

   {/* Crate Tabs */}
   <div className="shrink-0 flex items-center gap-1.5 mb-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
    {crates.map((crate) => (
     <button
      key={crate.id}
      onClick={() => { setActiveCrate(crate.id); setSelectedRecords(new Set()); setLastClickedIndex(null) }}
      className={`text-[11px] font-medium px-3 py-1.5 border whitespace-nowrap ${
       activeCrate === crate.id
        ? 'bg-waxe-text text-waxe-deep border-waxe-text'
        : 'text-waxe-text bg-waxe-card/80 backdrop-blur-sm border-waxe-border hover:border-waxe-border-hover'
      }`}
     >
      {crate.name}
      {crate.id !== 'crate-all' && (
       <span className="ml-1 text-[10px] opacity-70">{crate.records.length}</span>
      )}
     </button>
    ))}
    <button className="text-[11px] font-medium px-3 py-1.5 border border-dashed border-waxe-border text-waxe-text-muted hover:text-waxe-text whitespace-nowrap">
     + New Crate
    </button>
   </div>

   {/* Inventory Table */}
   <div className="flex-1 min-h-0 relative">
    <DataTable headers={['Photo', 'Record', 'Condition', 'Price', 'Suggested', 'Source', 'Status', 'Queue']} maxHeight="100%">
    {filtered.map((record, i) => (
     <tr key={record.id} className={`table-row hover:bg-waxe-surface/30 transition-colors cursor-pointer ${selectedRecords.has(record.id) ? 'bg-waxe-cool/10' : ''}`} onClick={(e) => handleRowClick(record, i, e)}>
      {/* Album Art */}
      <td className="px-4 py-3 w-[72px]">
       <div
        className="w-10 h-10 overflow-hidden relative"
        style={{ background: record.photoColor || autoColor(record.artist + record.title) }}
       >
        {record.artworkUrl ? (
         <img src={record.artworkUrl} alt={`${record.artist} — ${record.title}`} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
         <>
          <div className="absolute inset-0 flex items-center justify-center text-[11px] font-medium text-waxe-deep/60">
           {record.artist.split(' ').pop()?.slice(0, 2).toUpperCase()}
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-t from-black/40 to-transparent" />
         </>
        )}
       </div>
      </td>
      <td className="px-4 py-3">
       <div className="min-w-0">
        <p className="text-sm font-medium text-waxe-text truncate">
         {record.artist}
         {consignedIds.has(record.id) && <span className="ml-1.5 text-[9px] font-semibold px-1.5 py-0.5 border border-waxe-cool/40 text-waxe-cool bg-waxe-cool/5">CSG</span>}
        </p>
        <p className="text-xs text-waxe-text-secondary truncate">{record.title} · {record.label} · {record.year}</p>
       </div>
      </td>
      <td className="px-4 py-3">
       <div className="flex items-center gap-2">
        <div className="flex items-center gap-px">
         {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={`text-xs ${
           star <= record.condition
            ? record.condition >= 4 ? 'text-waxe-cond-9' :
             record.condition >= 3 ? 'text-waxe-cond-7' :
             'text-waxe-cond-5'
            : 'text-waxe-surface'
          }`}>★</span>
         ))}
        </div>
       </div>
      </td>
      <td className="px-4 py-3 text-sm font-medium text-waxe-text">
       ${record.price.toFixed(2)}
       {activeDiscounts.some(d => d.appliesTo === 'all' || (d.appliesTo === 'genre' && d.targetId === record.genre)) && (
        <span className="ml-1 text-[9px] font-semibold text-waxe-positive">-{activeDiscounts.find(d => d.appliesTo === 'all' || (d.appliesTo === 'genre' && d.targetId === record.genre))?.value}%</span>
       )}
      </td>
      <td className="px-4 py-3">
       {record.suggestedPrice && record.priceDelta !== undefined && (
        <div className="flex items-center gap-1.5">
         <span className="text-sm text-waxe-text">${record.suggestedPrice.toFixed(2)}</span>
         <span className={`text-xs font-medium ${record.priceDelta > 0 ? 'text-waxe-positive' : record.priceDelta < 0 ? 'text-waxe-negative' : 'text-waxe-text-muted'}`}>
          {record.priceDelta > 0 ? '+' : ''}{record.priceDelta}
         </span>
        </div>
       )}
      </td>
      <td className="px-4 py-3">
       <span className={`text-xs font-medium ${syncSourceColor[record.syncSource]}`}>
        {syncSourceLabel[record.syncSource]}
       </span>
      </td>
      <td className="px-4 py-3">
       <StatusBadge status={record.status} />
      </td>
      <td className="px-4 py-3">
       {record.inPrintQueue && (
        <span className="text-xs text-waxe-cool" title="In print queue">⎙</span>
       )}
      </td>
     </tr>
    ))}
   </DataTable>

    {/* Floating Action Bar */}
    {selectedRecords.size > 0 && (
     <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 bg-waxe-card border border-waxe-border shadow-xl px-5 py-3 clip-card">
      <span className="text-xs font-bold text-waxe-text font-mono">{selectedRecords.size} selected</span>
      <div className="w-px h-5 bg-waxe-border" />
      <button className="btn-secondary text-[11px] px-3 py-1.5">Add to Crate</button>
      <div className="relative">
       <button
        className="btn-secondary text-[11px] px-3 py-1.5"
        onClick={() => { setShowPriceAdjust(!showPriceAdjust); setPriceApplied(false) }}
       >
        Adjust Price
       </button>

       {/* Price Adjustment Popover */}
       {showPriceAdjust && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-30 w-[320px] bg-waxe-card border border-waxe-border shadow-xl p-4 clip-card">
         <p className="text-[11px] font-semibold text-waxe-text mb-3">Bulk Price Adjustment</p>

         {/* Mode Tabs */}
         <div className="flex gap-1 mb-3">
          {([
           { id: 'percentage' as const, label: '% Adjust' },
           { id: 'suggested' as const, label: 'Suggested' },
           { id: 'discogs' as const, label: 'Discogs Med.' },
           { id: 'flat' as const, label: '$ Flat' },
          ]).map((mode) => (
           <button
            key={mode.id}
            className={`text-[10px] font-medium px-2 py-1 border ${
             priceMode === mode.id
              ? 'bg-waxe-text/10 border-waxe-text text-waxe-text'
              : 'border-waxe-border text-waxe-text-muted hover:border-waxe-border-hover'
            }`}
            onClick={() => { setPriceMode(mode.id); setPriceValue(''); setPriceApplied(false) }}
           >
            {mode.label}
           </button>
          ))}
         </div>

         {/* Conditional Input */}
         {priceMode === 'percentage' && (
          <div className="mb-3">
           <label className="text-[10px] text-waxe-text-muted block mb-1">Percentage change</label>
           <div className="relative">
            <input
             type="number"
             value={priceValue}
             onChange={(e) => { setPriceValue(e.target.value); setPriceApplied(false) }}
             placeholder="+10 or -5"
             className="w-full bg-waxe-surface border border-waxe-border text-xs text-waxe-text py-1.5 px-2 font-mono pr-6"
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-waxe-text-muted">%</span>
           </div>
          </div>
         )}
         {priceMode === 'flat' && (
          <div className="mb-3">
           <label className="text-[10px] text-waxe-text-muted block mb-1">Flat amount change</label>
           <div className="relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-waxe-text-muted">$</span>
            <input
             type="number"
             value={priceValue}
             onChange={(e) => { setPriceValue(e.target.value); setPriceApplied(false) }}
             placeholder="+5 or -3"
             className="w-full bg-waxe-surface border border-waxe-border text-xs text-waxe-text py-1.5 pl-6 pr-2 font-mono"
            />
           </div>
          </div>
         )}
         {priceMode === 'suggested' && (
          <p className="text-[10px] text-waxe-text-muted mb-3">Set all selected records to their WAXED suggested price based on market data and condition.</p>
         )}
         {priceMode === 'discogs' && (
          <p className="text-[10px] text-waxe-text-muted mb-3">Set all selected records to the current Discogs median sale price.</p>
         )}

         {/* Preview */}
         <div className="bg-waxe-surface/50 p-2.5 mb-3 space-y-1.5">
          <div className="flex justify-between text-[10px]">
           <span className="text-waxe-text-muted">Records</span>
           <span className="text-waxe-text font-mono font-bold">{pricePreview.count}</span>
          </div>
          <div className="flex justify-between text-[10px]">
           <span className="text-waxe-text-muted">Current Total</span>
           <span className="text-waxe-text font-mono">${pricePreview.currentTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-[10px]">
           <span className="text-waxe-text-muted">New Total</span>
           <span className="text-waxe-text font-mono font-bold">${pricePreview.newTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-[10px]">
           <span className="text-waxe-text-muted">Change</span>
           <span className={`font-mono font-bold ${pricePreview.change >= 0 ? 'text-waxe-positive' : 'text-waxe-negative'}`}>
            {pricePreview.change >= 0 ? '+' : ''}${pricePreview.change.toFixed(2)} ({pricePreview.changePct >= 0 ? '+' : ''}{pricePreview.changePct.toFixed(1)}%)
           </span>
          </div>
         </div>

         {/* Actions */}
         <div className="flex items-center justify-between">
          <button
           className="text-[10px] text-waxe-text-muted hover:text-waxe-text"
           onClick={() => setShowPriceAdjust(false)}
          >
           Cancel
          </button>
          <button
           className="btn-primary text-[10px] px-3 py-1"
           onClick={() => {
            setPriceApplied(true)
            setTimeout(() => { setPriceApplied(false); setShowPriceAdjust(false) }, 1200)
           }}
          >
           {priceApplied ? 'Applied' : 'Apply'}
          </button>
         </div>
        </div>
       )}
      </div>
      <button className="btn-secondary text-[11px] px-3 py-1.5">Send to Marketplace</button>
      <button
       className="text-[11px] text-waxe-text-muted hover:text-waxe-text px-2 py-1.5"
       onClick={() => { setSelectedRecords(new Set()); setLastClickedIndex(null); setShowPriceAdjust(false) }}
      >
       Clear
      </button>
     </div>
    )}
   </div>


   {/* ─── Record Detail Modal ─── */}
   {selectedRecord && (() => {
    const closeModal = () => { setSelectedRecord(null); setDetailMode('view') }
    // Mock price history sparkline data (last 12 months)
    const priceHistory = [
     selectedRecord.price * 0.85, selectedRecord.price * 0.88, selectedRecord.price * 0.82,
     selectedRecord.price * 0.90, selectedRecord.price * 0.95, selectedRecord.price * 0.92,
     selectedRecord.price * 0.97, selectedRecord.price * 0.94, selectedRecord.price * 1.02,
     selectedRecord.price * 0.98, selectedRecord.price * 1.05, selectedRecord.price,
    ]
    const sparkMin = Math.min(...priceHistory)
    const sparkMax = Math.max(...priceHistory)
    const sparkRange = sparkMax - sparkMin || 1
    const sparkPoints = priceHistory.map((v, i) =>
     `${(i / (priceHistory.length - 1)) * 120},${32 - ((v - sparkMin) / sparkRange) * 28}`
    ).join(' ')

    return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[3vh]">
     <div className="absolute inset-0 bg-waxe-text/40" onClick={closeModal} />
     <div className="relative w-full max-w-2xl h-[90vh] flex flex-col bg-waxe-base border border-waxe-border shadow-xl clip-modal overflow-hidden">

      {detailMode === 'view' ? (
       <>
        {/* ── Hero Section ── */}
        <div className="shrink-0 relative h-44 overflow-hidden" style={{ background: selectedRecord.photoColor || autoColor(selectedRecord.artist + selectedRecord.title) }}>
         {selectedRecord.artworkUrl ? (
          <img src={selectedRecord.artworkUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
         ) : (
          <div className="absolute inset-0 flex items-center justify-center text-4xl font-semibold text-waxe-deep/20">
           {selectedRecord.artist.split(' ').pop()?.slice(0, 3).toUpperCase()}
          </div>
         )}
         <div className="absolute inset-0 bg-gradient-to-t from-waxe-base via-waxe-base/40 to-transparent" />
         <button onClick={closeModal} className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center bg-waxe-base/60 text-waxe-text hover:bg-waxe-base/80 transition-colors text-sm">✕</button>
         <div className="absolute bottom-4 left-5 right-5 z-10">
          <h2 className="text-2xl font-semibold text-waxe-text leading-tight">{selectedRecord.artist}</h2>
          <p className="text-sm text-waxe-text-secondary mt-0.5">{selectedRecord.title}</p>
          <div className="flex items-center gap-2 mt-1.5">
           <span className="text-xs text-waxe-text-muted">{selectedRecord.label} · {selectedRecord.year} · {selectedRecord.format} · {selectedRecord.genre}</span>
          </div>
         </div>
        </div>

        {/* ── Status Row ── */}
        <div className="shrink-0 px-5 py-3 border-b border-waxe-border flex items-center gap-2 flex-wrap">
         <StatusBadge status={selectedRecord.status} />
         <span className={`text-xs font-medium ${syncSourceColor[selectedRecord.syncSource]}`}>
          via {syncSourceLabel[selectedRecord.syncSource]}
         </span>
         {selectedRecord.inPrintQueue && (
          <span className="text-xs text-waxe-cool bg-waxe-warm/10 px-2 py-0.5 border border-waxe-warm/15">In print queue</span>
         )}
         {selectedRecord.discogsReleaseId && (
          <span className="text-xs font-mono text-waxe-text-secondary bg-waxe-text-secondary/10 px-2 py-0.5 border border-waxe-text-secondary/15">{selectedRecord.discogsReleaseId}</span>
         )}
         <span className="text-xs font-mono text-waxe-text-muted ml-auto">{selectedRecord.id}</span>
        </div>

        {/* ── Scrollable Body ── */}
        <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-5">

         {/* Two-column: Pressing Details | Physical Specs */}
         <div className="grid grid-cols-2 gap-4">
          {/* Pressing Details */}
          <div className="bg-waxe-surface/30 p-4">
           <p className="text-[10px] font-medium text-waxe-text-muted mb-3">Pressing Details</p>
           <div className="space-y-2">
            <div className="flex justify-between">
             <span className="text-xs text-waxe-text-muted">Pressing</span>
             <span className="text-xs font-medium text-waxe-text">{selectedRecord.pressing}</span>
            </div>
            <div className="flex justify-between">
             <span className="text-xs text-waxe-text-muted">Country</span>
             <span className="text-xs font-medium text-waxe-text">{selectedRecord.countryOfPressing}</span>
            </div>
            <div className="flex justify-between">
             <span className="text-xs text-waxe-text-muted">Catalog #</span>
             <span className="text-xs font-medium font-mono text-waxe-text">{selectedRecord.catalogNo}</span>
            </div>
            {selectedRecord.matrixRunout && (
             <div className="flex justify-between">
              <span className="text-xs text-waxe-text-muted">Matrix</span>
              <span className="text-xs font-medium font-mono text-waxe-text">{selectedRecord.matrixRunout}</span>
             </div>
            )}
            {selectedRecord.pressingPlant && (
             <div className="flex justify-between">
              <span className="text-xs text-waxe-text-muted">Plant</span>
              <span className="text-xs font-medium text-waxe-text">{selectedRecord.pressingPlant}</span>
             </div>
            )}
           </div>
          </div>

          {/* Physical Specs */}
          <div className="bg-waxe-surface/30 p-4">
           <p className="text-[10px] font-medium text-waxe-text-muted mb-3">Physical Specs</p>
           <div className="space-y-2">
            <div className="flex justify-between">
             <span className="text-xs text-waxe-text-muted">Format</span>
             <span className="text-xs font-medium text-waxe-text">{selectedRecord.format}</span>
            </div>
            <div className="flex justify-between">
             <span className="text-xs text-waxe-text-muted">Speed</span>
             <span className="text-xs font-medium text-waxe-text">{selectedRecord.speed}</span>
            </div>
            {selectedRecord.vinylWeight && (
             <div className="flex justify-between">
              <span className="text-xs text-waxe-text-muted">Weight</span>
              <span className="text-xs font-medium text-waxe-text">{selectedRecord.vinylWeight}</span>
             </div>
            )}
            <div className="flex justify-between">
             <span className="text-xs text-waxe-text-muted">Color</span>
             <span className="text-xs font-medium text-waxe-text">{selectedRecord.vinylColor}</span>
            </div>
            {selectedRecord.mastering && (
             <div className="flex justify-between">
              <span className="text-xs text-waxe-text-muted">Mastering</span>
              <span className="text-xs font-medium text-waxe-text">{selectedRecord.mastering}</span>
             </div>
            )}
           </div>
          </div>
         </div>

         {/* Condition */}
         <div className="bg-waxe-surface/30 p-4">
          <p className="text-[10px] font-medium text-waxe-text-muted mb-3">Condition</p>
          <div className="grid grid-cols-2 gap-4">
           <div className="flex items-center justify-between">
            <span className="text-xs text-waxe-text-muted">Media</span>
            <div className="flex items-center gap-2">
             <div className="flex items-center gap-px">
              {[1, 2, 3, 4, 5].map((star) => (
               <span key={star} className={`text-sm ${
                star <= selectedRecord.condition
                 ? selectedRecord.condition >= 4 ? 'text-waxe-cond-9' :
                  selectedRecord.condition >= 3 ? 'text-waxe-cond-7' :
                  'text-waxe-cond-5'
                 : 'text-waxe-surface'
               }`}>★</span>
              ))}
             </div>
             <span className="text-xs font-medium text-waxe-text">{conditionLabels[selectedRecord.condition]}</span>
            </div>
           </div>
           <div className="flex items-center justify-between">
            <span className="text-xs text-waxe-text-muted">Sleeve</span>
            <div className="flex items-center gap-2">
             <div className="flex items-center gap-px">
              {[1, 2, 3, 4, 5].map((star) => (
               <span key={star} className={`text-sm ${
                star <= selectedRecord.sleeveCondition
                 ? selectedRecord.sleeveCondition >= 4 ? 'text-waxe-cond-9' :
                  selectedRecord.sleeveCondition >= 3 ? 'text-waxe-cond-7' :
                  'text-waxe-cond-5'
                 : 'text-waxe-surface'
               }`}>★</span>
              ))}
             </div>
             <span className="text-xs font-medium text-waxe-text">{conditionLabels[selectedRecord.sleeveCondition]}</span>
            </div>
           </div>
          </div>
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-waxe-border/50">
           <span className="text-xs text-waxe-text-muted">Sleeve: {selectedRecord.sleeveType}</span>
           {selectedRecord.innerSleeve && <span className="text-xs text-waxe-text-muted">Inner: {selectedRecord.innerSleeve}</span>}
           {selectedRecord.inserts && selectedRecord.inserts.length > 0 && (
            <span className="text-xs text-waxe-text-muted">Inserts: {selectedRecord.inserts.join(', ')}</span>
           )}
          </div>
          {selectedRecord.flawNotes && (
           <p className="text-xs text-waxe-text-muted mt-2 italic">{selectedRecord.flawNotes}</p>
          )}
         </div>

         {/* Pricing & Market Data */}
         <div className="bg-waxe-surface/30 p-4">
          <p className="text-[10px] font-medium text-waxe-text-muted mb-3">Pricing & Market Data</p>
          <div className="flex items-start gap-6">
           {/* Your Price + Delta */}
           <div>
            <p className="text-2xl font-semibold text-waxe-text">${selectedRecord.price.toFixed(2)}</p>
            <p className="text-xs text-waxe-text-muted mt-0.5">Your price</p>
           </div>
           {selectedRecord.suggestedPrice && (
            <div>
             <p className="text-lg font-medium text-waxe-text-secondary">${selectedRecord.suggestedPrice.toFixed(2)}</p>
             <p className="text-xs text-waxe-text-muted mt-0.5">Suggested</p>
            </div>
           )}
           {selectedRecord.priceDelta !== undefined && (
            <div className={`px-2 py-1 text-sm font-bold ${
             selectedRecord.priceDelta > 0 ? 'bg-waxe-positive/10 text-waxe-positive' :
             selectedRecord.priceDelta < 0 ? 'bg-waxe-negative/10 text-waxe-negative' :
             'bg-waxe-surface text-waxe-text-muted'
            }`}>
             {selectedRecord.priceDelta > 0 ? '+' : ''}{selectedRecord.priceDelta}
            </div>
           )}

           {/* Price History Sparkline */}
           <div className="ml-auto text-right">
            <svg width="120" height="36" viewBox="0 0 120 36" className="inline-block">
             <polyline
              fill="none"
              stroke="var(--color-waxe-cool, #6A6090)"
              strokeWidth="1.5"
              points={sparkPoints}
             />
             <circle
              cx="120"
              cy={32 - ((priceHistory[priceHistory.length - 1] - sparkMin) / sparkRange) * 28}
              r="2.5"
              fill="var(--color-waxe-warm, #C4956A)"
             />
            </svg>
            <p className="text-[10px] text-waxe-text-muted mt-0.5">12-month trend</p>
           </div>
          </div>

          {/* Discogs market data */}
          {selectedRecord.discogsMedian && (
           <div className="flex items-center gap-3 pt-3 mt-3 border-t border-waxe-border/50">
            <span className="text-xs text-waxe-text-muted">Discogs:</span>
            <div className="flex items-center gap-4">
             <div className="text-center">
              <p className="text-xs text-waxe-text-muted">Low</p>
              <p className="text-sm font-medium text-waxe-text">${selectedRecord.discogsLow}</p>
             </div>
             <div className="text-center">
              <p className="text-xs text-waxe-text-muted">Median</p>
              <p className="text-sm font-bold text-waxe-cool">${selectedRecord.discogsMedian}</p>
             </div>
             <div className="text-center">
              <p className="text-xs text-waxe-text-muted">High</p>
              <p className="text-sm font-medium text-waxe-text">${selectedRecord.discogsHigh}</p>
             </div>
            </div>
            <div className="flex-1 ml-2">
             <div className="relative h-2 bg-waxe-surface rounded-full">
              <div className="absolute h-2 bg-waxe-border rounded-full" style={{ left: '0%', width: '100%' }} />
              <div
               className="absolute w-3 h-3 rounded-full bg-waxe-warm border border-waxe-base -top-0.5"
               title={`Your price: $${selectedRecord.price}`}
               style={{
                left: `${Math.min(100, Math.max(0, ((selectedRecord.price - (selectedRecord.discogsLow || 0)) / ((selectedRecord.discogsHigh || 1) - (selectedRecord.discogsLow || 0))) * 100))}%`,
               }}
              />
             </div>
             <p className="text-[11px] text-waxe-text-muted text-center mt-1">Your price vs. market</p>
            </div>
           </div>
          )}
         </div>
        </div>

        {/* ── View Footer: Actions ── */}
        <div className="shrink-0 border-t border-waxe-border p-4 flex items-center justify-between">
         <button className="btn-secondary text-sm px-4 py-2" onClick={() => setDetailMode('edit')}>Edit Details</button>
         <div className="flex gap-2">
          <button className="btn-secondary text-xs px-3 py-2">Send to Marketplace</button>
          <button className="btn-secondary text-xs px-3 py-2">Add to Crate</button>
          <button className="btn-secondary text-xs px-3 py-2">Print Label</button>
         </div>
        </div>
       </>
      ) : (
       <>
        {/* ── Edit Mode Header ── */}
        <div className="shrink-0 bg-waxe-base border-b border-waxe-border p-5">
         <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
           <button
            className="w-16 h-16 overflow-hidden relative shrink-0 group"
            style={{ background: selectedRecord.photoColor || autoColor(selectedRecord.artist + selectedRecord.title) }}
           >
            {selectedRecord.artworkUrl ? (
             <img src={selectedRecord.artworkUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
            ) : (
             <>
              <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-waxe-deep/60">
               {selectedRecord.artist.split(' ').pop()?.slice(0, 2).toUpperCase()}
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-black/40 to-transparent" />
             </>
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-waxe-text/50 opacity-0 group-hover:opacity-100 transition-opacity">
             <span className="text-[11px] text-waxe-deep font-medium">Upload</span>
            </div>
           </button>
           <div>
            <h2 className="text-xl font-semibold text-waxe-text">{selectedRecord.artist}</h2>
            <p className="text-sm text-waxe-text-muted">{selectedRecord.title}</p>
            <span className="text-xs font-mono text-waxe-text-muted">{selectedRecord.id}</span>
           </div>
          </div>
          <button onClick={closeModal} className="text-waxe-text-muted hover:text-waxe-text text-lg">✕</button>
         </div>
        </div>

        {/* ── Edit Form Body ── */}
        <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-5">
         {/* Core Info */}
         <div className="grid grid-cols-2 gap-4">
          <div>
           <label className="text-xs font-medium text-waxe-text-muted mb-1.5 block">Artist</label>
           <input type="text" className="input-field" defaultValue={selectedRecord.artist} />
          </div>
          <div>
           <label className="text-xs font-medium text-waxe-text-muted mb-1.5 block">Title</label>
           <input type="text" className="input-field" defaultValue={selectedRecord.title} />
          </div>
         </div>

         <div className="grid grid-cols-3 gap-4">
          <div>
           <label className="text-xs font-medium text-waxe-text-muted mb-1.5 block">Label</label>
           <input type="text" className="input-field" defaultValue={selectedRecord.label} />
          </div>
          <div>
           <label className="text-xs font-medium text-waxe-text-muted mb-1.5 block">Year</label>
           <input type="number" className="input-field" defaultValue={selectedRecord.year} />
          </div>
          <div>
           <label className="text-xs font-medium text-waxe-text-muted mb-1.5 block">Genre</label>
           <input type="text" className="input-field" defaultValue={selectedRecord.genre} />
          </div>
         </div>

         {/* Pressing Identity */}
         <div className="bg-waxe-surface/30 p-4">
          <p className="text-[10px] font-medium text-waxe-text-muted mb-3">Pressing Details</p>
          <div className="grid grid-cols-3 gap-4 mb-4">
           <div>
            <label className="text-xs text-waxe-text-muted mb-1.5 block">Pressing</label>
            <select className="input-field" defaultValue={selectedRecord.pressing}>
             <option value="1st Press">1st Press</option>
             <option value="Reissue">Reissue</option>
             <option value="Repress">Repress</option>
             <option value="Limited Edition">Limited Edition</option>
             <option value="Promo">Promo / DJ Copy</option>
            </select>
           </div>
           <div>
            <label className="text-xs text-waxe-text-muted mb-1.5 block">Country</label>
            <input type="text" className="input-field" defaultValue={selectedRecord.countryOfPressing} />
           </div>
           <div>
            <label className="text-xs text-waxe-text-muted mb-1.5 block">Catalog #</label>
            <input type="text" className="input-field font-mono" defaultValue={selectedRecord.catalogNo} />
           </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
           <div>
            <label className="text-xs text-waxe-text-muted mb-1.5 block">Matrix / Runout</label>
            <input type="text" className="input-field font-mono" defaultValue={selectedRecord.matrixRunout || ''} placeholder="Dead wax etchings" />
           </div>
           <div>
            <label className="text-xs text-waxe-text-muted mb-1.5 block">Pressing Plant</label>
            <input type="text" className="input-field" defaultValue={selectedRecord.pressingPlant || ''} placeholder="RTI, Pallas, GZ..." />
           </div>
          </div>
         </div>

         {/* Physical Specs */}
         <div className="bg-waxe-surface/30 p-4">
          <p className="text-[10px] font-medium text-waxe-text-muted mb-3">Physical Specs</p>
          <div className="grid grid-cols-4 gap-4 mb-4">
           <div>
            <label className="text-xs text-waxe-text-muted mb-1.5 block">Format</label>
            <input type="text" className="input-field" defaultValue={selectedRecord.format} placeholder='12"' />
           </div>
           <div>
            <label className="text-xs text-waxe-text-muted mb-1.5 block">Speed</label>
            <select className="input-field" defaultValue={selectedRecord.speed}>
             <option value="33 RPM">33 RPM</option>
             <option value="45 RPM">45 RPM</option>
             <option value="78 RPM">78 RPM</option>
            </select>
           </div>
           <div>
            <label className="text-xs text-waxe-text-muted mb-1.5 block">Weight</label>
            <select className="input-field" defaultValue={selectedRecord.vinylWeight || ''}>
             <option value="">Unknown</option>
             <option value="120g">120g</option>
             <option value="140g">140g</option>
             <option value="180g">180g</option>
             <option value="200g">200g</option>
            </select>
           </div>
           <div>
            <label className="text-xs text-waxe-text-muted mb-1.5 block">Color</label>
            <input type="text" className="input-field" defaultValue={selectedRecord.vinylColor} placeholder="Black" />
           </div>
          </div>
          <div>
           <label className="text-xs text-waxe-text-muted mb-1.5 block">Mastering</label>
           <select className="input-field flex-1" defaultValue={selectedRecord.mastering || ''}>
            <option value="">Unknown</option>
            <option value="AAA">AAA — All Analog</option>
            <option value="AAD">AAD — Analog/Analog/Digital</option>
            <option value="ADD">ADD — Analog/Digital/Digital</option>
            <option value="DDD">DDD — All Digital</option>
           </select>
          </div>
         </div>

         {/* Condition */}
         <div className="bg-waxe-surface/30 p-4">
          <p className="text-[10px] font-medium text-waxe-text-muted mb-3">Condition</p>
          <div className="grid grid-cols-2 gap-4 mb-4">
           <div>
            <label className="text-xs text-waxe-text-muted mb-1.5 block">
             Media — {conditionLabels[selectedRecord.condition] || 'Unknown'}
            </label>
            <div className="flex items-center gap-3">
             <input type="range" min="1" max="5" defaultValue={selectedRecord.condition} className="flex-1 accent-waxe-text" />
             <div className="flex items-center gap-px">
              {[1, 2, 3, 4, 5].map((star) => (
               <span key={star} className={`text-sm ${
                star <= selectedRecord.condition
                 ? selectedRecord.condition >= 4 ? 'text-waxe-cond-9' :
                  selectedRecord.condition >= 3 ? 'text-waxe-cond-7' :
                  'text-waxe-cond-5'
                 : 'text-waxe-surface'
               }`}>★</span>
              ))}
             </div>
            </div>
           </div>
           <div>
            <label className="text-xs text-waxe-text-muted mb-1.5 block">
             Sleeve — {conditionLabels[selectedRecord.sleeveCondition] || 'Unknown'}
            </label>
            <div className="flex items-center gap-3">
             <input type="range" min="1" max="5" defaultValue={selectedRecord.sleeveCondition} className="flex-1 accent-waxe-text-secondary" />
             <div className="flex items-center gap-px">
              {[1, 2, 3, 4, 5].map((star) => (
               <span key={star} className={`text-sm ${
                star <= selectedRecord.sleeveCondition
                 ? selectedRecord.sleeveCondition >= 4 ? 'text-waxe-cond-9' :
                  selectedRecord.sleeveCondition >= 3 ? 'text-waxe-cond-7' :
                  'text-waxe-cond-5'
                 : 'text-waxe-surface'
               }`}>★</span>
              ))}
             </div>
            </div>
           </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
           <div>
            <label className="text-xs text-waxe-text-muted mb-1.5 block">Sleeve Type</label>
            <select className="input-field" defaultValue={selectedRecord.sleeveType}>
             <option value="Single">Single</option>
             <option value="Gatefold">Gatefold</option>
             <option value="Box Set">Box Set</option>
             <option value="None">No Sleeve</option>
            </select>
           </div>
           <div>
            <label className="text-xs text-waxe-text-muted mb-1.5 block">Inner Sleeve</label>
            <select className="input-field" defaultValue={selectedRecord.innerSleeve || ''}>
             <option value="">None / Missing</option>
             <option value="Original printed">Original printed</option>
             <option value="Generic white">Generic white</option>
             <option value="Poly-lined">Poly-lined</option>
            </select>
           </div>
           <div>
            <label className="text-xs text-waxe-text-muted mb-1.5 block">Inserts</label>
            <input type="text" className="input-field" defaultValue={selectedRecord.inserts?.join(', ') || ''} placeholder="Lyric sheet, poster..." />
           </div>
          </div>

          <div>
           <label className="text-xs text-waxe-text-muted mb-1.5 block">Condition Notes</label>
           <textarea className="input-field min-h-[60px] resize-y" defaultValue={selectedRecord.flawNotes || ''} placeholder="Ring wear, seam splits, surface noise, warping..." />
          </div>
         </div>

         {/* Pricing */}
         <div className="bg-waxe-surface/30 p-4">
          <p className="text-[10px] font-medium text-waxe-text-muted mb-3">Pricing</p>
          <div className="grid grid-cols-3 gap-4">
           <div>
            <label className="text-xs text-waxe-text-muted mb-1.5 block">Your Price</label>
            <div className="relative">
             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-waxe-text-muted">$</span>
             <input type="number" step="0.01" className="input-field pl-7" defaultValue={selectedRecord.price.toFixed(2)} />
            </div>
           </div>
           <div>
            <label className="text-xs text-waxe-text-muted mb-1.5 block">Suggested</label>
            <div className="relative">
             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-waxe-text-muted">$</span>
             <input type="number" step="0.01" className="input-field pl-7 opacity-60" defaultValue={selectedRecord.suggestedPrice?.toFixed(2) || ''} readOnly />
            </div>
           </div>
           <div>
            <label className="text-xs text-waxe-text-muted mb-1.5 block">Delta</label>
            {selectedRecord.priceDelta !== undefined && (
             <div className={`h-[42px] flex items-center justify-center text-sm font-bold ${
              selectedRecord.priceDelta > 0 ? 'bg-waxe-positive/10 text-waxe-positive' :
              selectedRecord.priceDelta < 0 ? 'bg-waxe-negative/10 text-waxe-negative' :
              'bg-waxe-surface text-waxe-text-muted'
             }`}>
              {selectedRecord.priceDelta > 0 ? '+' : ''}{selectedRecord.priceDelta}
             </div>
            )}
           </div>
          </div>
         </div>

         {/* Status + Source */}
         <div className="grid grid-cols-2 gap-4">
          <div>
           <label className="text-xs font-medium text-waxe-text-muted mb-1.5 block">Status</label>
           <select className="input-field" defaultValue={selectedRecord.status}>
            <option value="active">Active</option>
            <option value="sold">Sold</option>
            <option value="reserved">Reserved</option>
            <option value="pending">Pending</option>
           </select>
          </div>
          <div>
           <label className="text-xs font-medium text-waxe-text-muted mb-1.5 block">Sync Source</label>
           <select className="input-field" defaultValue={selectedRecord.syncSource}>
            <option value="discogs">Discogs</option>
            <option value="shopify">Shopify</option>
            <option value="csv">CSV</option>
            <option value="manual">Manual</option>
           </select>
          </div>
         </div>

         <div className="flex items-center gap-6 py-2">
          <label className="flex items-center gap-2 cursor-pointer">
           <input type="checkbox" defaultChecked={selectedRecord.inPrintQueue} className="accent-waxe-text w-4 h-4" />
           <span className="text-sm text-waxe-text">In print queue</span>
          </label>
         </div>
        </div>

        {/* ── Edit Footer ── */}
        <div className="shrink-0 bg-waxe-base border-t border-waxe-border p-5 flex items-center justify-between">
         <button className="text-sm text-red-400 hover:text-red-300 transition-colors">Delete Record</button>
         <div className="flex gap-2">
          <button className="btn-secondary text-sm px-4 py-2" onClick={() => setDetailMode('view')}>Cancel</button>
          <button className="btn-primary text-sm px-4 py-2" onClick={() => { setDetailMode('view') }}>Save Changes</button>
         </div>
        </div>
       </>
      )}
     </div>
    </div>
    )
   })()}

   {/* ─── Catalog Search Modal ─── */}
   {showCatalog && (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[5vh]">
     <div className="absolute inset-0 bg-waxe-text/40" onClick={() => setShowCatalog(false)} />
     <div className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto bg-waxe-base border border-waxe-border shadow-xl clip-modal">
      <div className="sticky top-0 bg-waxe-base border-b border-waxe-border p-5 z-10">
       <div className="flex items-center justify-between mb-4">
        <div>
         <h2 className="text-xl font-semibold text-waxe-text">Catalog Search</h2>
         <p className="text-xs text-waxe-text-muted">Search the Discogs database to add records</p>
        </div>
        <button onClick={() => setShowCatalog(false)} className="text-waxe-text-muted hover:text-waxe-text text-lg">✕</button>
       </div>
       <input
        type="text"
        placeholder="Search artist, album, label, catalog number..."
        className="input-field"
        value={catalogSearch}
        onChange={(e) => setCatalogSearch(e.target.value)}
        autoFocus
       />
      </div>

      <div className="p-5">
       <p className="text-xs text-waxe-text-muted mb-4">
        {catalogResults.length} results for &ldquo;{catalogSearch}&rdquo; — showing pressings with market data
       </p>

       <div className="space-y-3">
        {catalogResults.map((result) => (
         <div key={result.discogsId} className="bg-waxe-card border border-waxe-border p-4 hover:border-waxe-border-hover transition-colors">
          <div className="flex items-start justify-between gap-4">
           <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold text-waxe-text">{result.artist} — {result.title}</p>
            <p className="text-xs text-waxe-text-muted mt-0.5">
             {result.label} · {result.catNo} · {result.year} · {result.country} · {result.format}
            </p>
            <div className="flex items-center gap-4 mt-2">
             <span className="text-xs text-waxe-text-muted">{result.pressings} pressings</span>
             <span className="text-xs text-waxe-text-muted">Have: {result.have.toLocaleString()}</span>
             <span className="text-xs text-waxe-cool">Want: {result.want.toLocaleString()}</span>
            </div>
           </div>
           <div className="text-right shrink-0">
            <p className="text-sm font-bold text-waxe-text">${result.medianPrice}</p>
            <p className="text-[11px] text-waxe-text-muted">median</p>
            <p className="text-xs text-waxe-text-muted mt-1">${result.lowestPrice} — ${result.highestPrice}</p>
           </div>
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-waxe-border">
           <div className="flex items-center gap-2">
            {result.want > result.have && (
             <span className="text-[11px] font-medium px-2 py-0.5 bg-waxe-text/10 text-waxe-text border border-waxe-text/15">
              High demand
             </span>
            )}
            <span className="text-[11px] font-mono text-waxe-text-muted">{result.discogsId}</span>
           </div>
           <button className="btn-primary text-xs px-3 py-1.5">Add to Inventory</button>
          </div>
         </div>
        ))}
       </div>
      </div>
     </div>
    </div>
   )}

   {/* ─── Bulk Import Modal ─── */}
   {showImport && (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[5vh]">
     <div className="absolute inset-0 bg-waxe-text/40" onClick={() => setShowImport(false)} />
     <div className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto bg-waxe-base border border-waxe-border shadow-xl clip-modal">
      <div className="sticky top-0 bg-waxe-base border-b border-waxe-border p-5 z-10">
       <div className="flex items-center justify-between mb-4">
        <div>
         <h2 className="text-xl font-semibold text-waxe-text">Import Records</h2>
         <p className="text-xs text-waxe-text-muted">Bulk import from CSV, Discogs export, Shopify, or scan</p>
        </div>
        <button onClick={() => setShowImport(false)} className="text-waxe-text-muted hover:text-waxe-text text-lg">✕</button>
       </div>

       {/* Import source selector */}
       <div className="grid grid-cols-4 gap-2">
        {[
         { id: 'csv', label: 'CSV Upload', icon: '⬆', desc: 'Spreadsheet file' },
         { id: 'discogs', label: 'Discogs', icon: '◉', desc: 'Export your collection' },
         { id: 'shopify', label: 'Shopify', icon: '◆', desc: 'Sync products' },
         { id: 'scan', label: 'Batch Scan', icon: '⌗', desc: 'Camera / barcode' },
        ].map((source) => (
         <button
          key={source.id}
          className={`p-3 border text-center transition-all ${
           source.id === importBatch.source
            ? 'bg-waxe-text/5 border-waxe-text text-waxe-text'
            : 'bg-waxe-card border-waxe-border text-waxe-text-secondary hover:border-waxe-border-hover'
          }`}
         >
          <span className="glyph-box mx-auto mb-1">{source.icon}</span>
          <span className="text-xs font-medium block">{source.label}</span>
          <span className="text-[11px] text-waxe-text-muted block">{source.desc}</span>
         </button>
        ))}
       </div>
      </div>

      <div className="p-5">
       {/* Progress steps */}
       <div className="flex items-center gap-2 mb-6">
        {['Upload', 'Auto-Match', 'Review', 'Confirm'].map((step, i) => {
         const stepIndex = ['uploading', 'matching', 'review', 'complete'].indexOf(importBatch.status)
         const isComplete = i < stepIndex
         const isCurrent = i === stepIndex
         return (
          <div key={step} className="flex items-center gap-2 flex-1">
           <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-medium ${
            isComplete ? 'bg-waxe-text text-waxe-base' :
            isCurrent ? 'bg-waxe-text-secondary text-waxe-base' :
            'bg-waxe-surface text-waxe-text-muted border border-waxe-border'
           }`}>
            {isComplete ? '✓' : i + 1}
           </div>
           <span className={`text-xs ${isCurrent ? 'text-waxe-text font-medium' : 'text-waxe-text-muted'}`}>{step}</span>
           {i < 3 && <div className={`flex-1 h-px ${isComplete ? 'bg-waxe-text' : 'bg-waxe-border'}`} />}
          </div>
         )
        })}
       </div>

       {/* File info */}
       <div className="bg-waxe-surface/50 p-4 mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
         <div className="w-10 h-10 bg-waxe-text/10 flex items-center justify-center text-sm text-waxe-text">⬆</div>
         <div>
          <p className="text-sm font-medium text-waxe-text">{importBatch.fileName}</p>
          <p className="text-xs text-waxe-text-muted">{importBatch.totalRecords} records found</p>
         </div>
        </div>
        <div className="flex items-center gap-4 text-right">
         <div>
          <p className="text-sm font-bold text-waxe-text">{importBatch.matched}</p>
          <p className="text-[11px] text-waxe-text-muted">auto-matched</p>
         </div>
         <div>
          <p className="text-sm font-bold text-waxe-text-muted">{importBatch.needsReview}</p>
          <p className="text-[11px] text-waxe-text-muted">needs review</p>
         </div>
        </div>
       </div>

       {/* Match progress bar */}
       <div className="mb-5">
        <div className="flex items-center justify-between mb-1.5">
         <span className="text-xs text-waxe-text-muted">Match rate</span>
         <span className="text-xs font-medium text-waxe-text">{Math.round((importBatch.matched / importBatch.totalRecords) * 100)}%</span>
        </div>
        <div className="h-2 bg-waxe-surface rounded-full overflow-hidden flex">
         <div className="h-full bg-waxe-text rounded-l-full" style={{ width: `${(importBatch.matched / importBatch.totalRecords) * 100}%` }} />
         <div className="h-full bg-waxe-text-muted" style={{ width: `${(importBatch.needsReview / importBatch.totalRecords) * 100}%` }} />
        </div>
       </div>

       {/* Records list */}
       <div className="space-y-2">
        {importBatch.records.map((record, i) => (
         <div key={i} className={`flex items-center justify-between p-3 border transition-colors ${
          record.matched
           ? 'bg-waxe-card/30 border-waxe-border'
           : 'bg-waxe-text-muted/5 border-waxe-text-muted/20'
         }`}>
          <div className="flex items-center gap-3 flex-1 min-w-0">
           <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${
            record.matched ? 'bg-waxe-text/10 text-waxe-text' : 'bg-waxe-text-muted/15 text-waxe-text-muted'
           }`}>
            {record.matched ? '✓' : '?'}
           </div>
           <div className="min-w-0">
            <p className="text-sm text-waxe-text truncate">{record.artist} — {record.title}</p>
            {record.discogsMatch ? (
             <p className="text-xs text-waxe-text-muted truncate">{record.discogsMatch}</p>
            ) : (
             <p className="text-xs text-waxe-text-muted">No confident match — manual lookup needed</p>
            )}
           </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
           <div className="text-right">
            {record.suggestedPrice && (
             <p className="text-sm font-medium text-waxe-text">${record.suggestedPrice}</p>
            )}
            <p className="text-[11px] text-waxe-text-muted">{record.matchConfidence}% match</p>
           </div>
           {!record.matched && (
            <button className="text-xs text-waxe-cool hover:text-waxe-warm-hover transition-colors">Lookup</button>
           )}
          </div>
         </div>
        ))}
       </div>

       <div className="flex items-center justify-between mt-6 pt-4 border-t border-waxe-border">
        <p className="text-xs text-waxe-text-muted">
         Showing {importBatch.records.length} of {importBatch.totalRecords} records
        </p>
        <div className="flex gap-2">
         <button className="btn-secondary text-sm px-4 py-2">Review All</button>
         <button className="btn-primary text-sm px-4 py-2">Import {importBatch.matched} Matched</button>
        </div>
       </div>
      </div>
     </div>
    </div>
   )}

   {/* ─── Store Credit Modal ─── */}
   {showStoreCredit && (
    <StoreCreditModal onClose={() => setShowStoreCredit(false)} />
   )}

   {/* ─── Discounts Modal ─── */}
   {showDiscounts && (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[5vh]">
     <div className="absolute inset-0 bg-waxe-text/40" onClick={() => setShowDiscounts(false)} />
     <div className="relative w-full max-w-2xl h-[85vh] flex flex-col overflow-hidden bg-waxe-base border border-waxe-border shadow-xl clip-modal">
      <div className="shrink-0 bg-waxe-base border-b border-waxe-border p-5 z-10">
       <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-waxe-text">Discounts</h2>
        <div className="flex items-center gap-3">
         <button className="btn-ghost text-sm">+ New Discount</button>
         <button onClick={() => setShowDiscounts(false)} className="text-waxe-text-muted hover:text-waxe-text text-lg">✕</button>
        </div>
       </div>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-3">
       {discountRules.map((rule) => (
        <div key={rule.id} className={`bg-waxe-card border border-waxe-border p-4 clip-stat ${rule.active ? 'accent-strip-left accent-positive' : ''}`}>
         <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
           <span className="text-sm font-medium text-waxe-text">{rule.name}</span>
           <StatusBadge status={rule.type} />
          </div>
          <span className={`text-lg font-semibold font-mono ${rule.active ? 'text-waxe-positive' : 'text-waxe-text-muted'}`}>
           {rule.value}% off
          </span>
         </div>
         <div className="flex flex-wrap items-center gap-3 text-xs text-waxe-text-muted">
          <span>Applies to: <strong className="text-waxe-text-secondary">{rule.appliesTo === 'all' ? 'All records' : rule.appliesTo === 'genre' ? `Genre: ${rule.targetId}` : rule.appliesTo}</strong></span>
          {rule.customerTier && <span>Tier: <strong className="text-waxe-text-secondary">{rule.customerTier}</strong></span>}
          {rule.minQty && <span>Min qty: <strong className="text-waxe-text-secondary">{rule.minQty}</strong></span>}
          {rule.startDate && <span>{rule.startDate} → {rule.endDate || 'ongoing'}</span>}
          <span>Created by: {rule.createdBy}</span>
         </div>
         <div className="flex items-center gap-2 mt-2">
          <span className={`text-[10px] font-semibold ${rule.active ? 'text-waxe-positive' : 'text-waxe-text-muted'}`}>
           {rule.active ? '● Active' : '○ Inactive'}
          </span>
         </div>
        </div>
       ))}
      </div>
     </div>
    </div>
   )}

   {/* ─── Consignment Modal ─── */}
   {showConsignment && (() => {
    const consignmentTab = 'consignors'
    const totalOwed = consignors.reduce((s, c) => s + c.balance, 0)
    const totalActive = consignors.reduce((s, c) => s + c.activeItems, 0)
    return (
     <ConsignmentModal
      onClose={() => setShowConsignment(false)}
      consignors={consignors}
      payouts={consignmentPayouts}
      totalOwed={totalOwed}
      totalActive={totalActive}
     />
    )
   })()}

   {/* ─── Audit Modal ─── */}
   {showAudit && (
    <AuditModal onClose={() => setShowAudit(false)} audits={inventoryAudits} activeAudit={activeAudit} />
   )}
  </div>
 )
}

// ─── Consignment Modal Component ─────────────────────────────

function ConsignmentModal({ onClose, consignors: csgrs, payouts, totalOwed, totalActive }: {
 onClose: () => void
 consignors: typeof consignors
 payouts: typeof consignmentPayouts
 totalOwed: number
 totalActive: number
}) {
 const [tab, setTab] = useState<'consignors' | 'payouts'>('consignors')

 return (
  <div className="fixed inset-0 z-50 flex items-start justify-center pt-[5vh]">
   <div className="absolute inset-0 bg-waxe-text/40" onClick={onClose} />
   <div className="relative w-full max-w-3xl h-[85vh] flex flex-col overflow-hidden bg-waxe-base border border-waxe-border shadow-xl clip-modal">
    <div className="shrink-0 bg-waxe-base border-b border-waxe-border p-5 z-10">
     <div className="flex items-center justify-between mb-3">
      <h2 className="text-xl font-semibold text-waxe-text">Consignment</h2>
      <button onClick={onClose} className="text-waxe-text-muted hover:text-waxe-text text-lg">✕</button>
     </div>
     <div className="grid grid-cols-3 gap-3 p-2 -m-2">
      <div className="stat-card">
       <p className="text-[10px] font-medium text-waxe-text-muted">Consignors</p>
       <p className="text-lg font-semibold text-waxe-text font-mono">{csgrs.length}</p>
      </div>
      <div className="stat-card">
       <p className="text-[10px] font-medium text-waxe-text-muted">Active Items</p>
       <p className="text-lg font-semibold text-waxe-text font-mono">{totalActive}</p>
      </div>
      <div className="stat-card">
       <p className="text-[10px] font-medium text-waxe-text-muted">Total Owed</p>
       <p className="text-lg font-semibold text-waxe-warm font-mono">${totalOwed.toFixed(2)}</p>
      </div>
     </div>
     <div className="flex gap-1.5 mt-3">
      {(['consignors', 'payouts'] as const).map((t) => (
       <button
        key={t}
        onClick={() => setTab(t)}
        className={`text-[11px] font-medium px-3 py-1.5 border ${
         tab === t ? 'bg-waxe-text text-waxe-deep border-waxe-text' : 'text-waxe-text bg-waxe-card/80 backdrop-blur-sm border-waxe-border hover:border-waxe-border-hover'
        }`}
       >
        {t === 'consignors' ? 'Consignors' : 'Payout History'}
       </button>
      ))}
     </div>
    </div>

    <div className="flex-1 min-h-0 overflow-y-auto p-5">
     {tab === 'consignors' ? (
      <div className="space-y-3">
       {csgrs.map((c) => (
        <div key={c.id} className="bg-waxe-card border border-waxe-border p-4 clip-stat">
         <div className="flex items-start justify-between mb-2">
          <div>
           <p className="text-sm font-medium text-waxe-text">{c.name}</p>
           <p className="text-xs text-waxe-text-muted">{c.email}{c.phone ? ` · ${c.phone}` : ''}</p>
          </div>
          <div className="text-right">
           <p className="text-xs text-waxe-text-muted">Balance</p>
           <p className={`text-sm font-bold font-mono ${c.balance > 0 ? 'text-waxe-warm' : 'text-waxe-text-muted'}`}>${c.balance.toFixed(2)}</p>
          </div>
         </div>
         <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-waxe-text-muted">
          <div>Split: <strong className="text-waxe-text">{c.splitRate}%</strong></div>
          <div>Payout: <strong className="text-waxe-text">{c.payoutMethod}</strong></div>
          <div>Active: <strong className="text-waxe-text">{c.activeItems}</strong> / Sold: <strong className="text-waxe-text">{c.soldItems}</strong></div>
          <div>Earned: <strong className="text-waxe-text font-mono">${c.totalEarned.toFixed(2)}</strong></div>
         </div>
         {c.notes && <p className="text-xs text-waxe-text-muted mt-2 italic">{c.notes}</p>}
         <div className="flex gap-2 mt-3">
          <button className="btn-ghost text-[11px] px-2 py-1">View Items</button>
          <button className="btn-ghost text-[11px] px-2 py-1">Record Payout</button>
         </div>
        </div>
       ))}
      </div>
     ) : (
      <DataTable headers={['Date', 'Consignor', 'Amount', 'Method', 'Items Sold', 'Notes']}>
       {payouts.map((p) => (
        <tr key={p.id} className="table-row hover:bg-waxe-surface/30">
         <td className="px-4 py-3 text-sm text-waxe-text">{p.date}</td>
         <td className="px-4 py-3 text-sm text-waxe-text">{p.consignorName}</td>
         <td className="px-4 py-3 text-sm font-medium text-waxe-text font-mono">${p.amount.toFixed(2)}</td>
         <td className="px-4 py-3 text-sm text-waxe-text">{p.method}</td>
         <td className="px-4 py-3 text-sm text-waxe-text">{p.itemsSold}</td>
         <td className="px-4 py-3 text-xs text-waxe-text-secondary">{p.notes || '—'}</td>
        </tr>
       ))}
      </DataTable>
     )}
    </div>
   </div>
  </div>
 )
}

// ─── Audit Modal Component ───────────────────────────────────

function AuditModal({ onClose, audits, activeAudit }: {
 onClose: () => void
 audits: typeof inventoryAudits
 activeAudit: typeof inventoryAudits[0] | undefined
}) {
 const [tab, setTab] = useState<'active' | 'history'>(activeAudit ? 'active' : 'history')

 return (
  <div className="fixed inset-0 z-50 flex items-start justify-center pt-[5vh]">
   <div className="absolute inset-0 bg-waxe-text/40" onClick={onClose} />
   <div className="relative w-full max-w-3xl h-[85vh] flex flex-col overflow-hidden bg-waxe-base border border-waxe-border shadow-xl clip-modal">
    <div className="shrink-0 bg-waxe-base border-b border-waxe-border p-5 z-10">
     <div className="flex items-center justify-between mb-3">
      <h2 className="text-xl font-semibold text-waxe-text">Inventory Audit</h2>
      <button onClick={onClose} className="text-waxe-text-muted hover:text-waxe-text text-lg">✕</button>
     </div>
     <div className="flex gap-1.5">
      {(['active', 'history'] as const).map((t) => (
       <button
        key={t}
        onClick={() => setTab(t)}
        className={`text-[11px] font-medium px-3 py-1.5 border ${
         tab === t ? 'bg-waxe-text text-waxe-deep border-waxe-text' : 'text-waxe-text bg-waxe-card/80 backdrop-blur-sm border-waxe-border hover:border-waxe-border-hover'
        }`}
       >
        {t === 'active' ? 'Active Count' : 'History'}
       </button>
      ))}
     </div>
    </div>

    <div className="flex-1 min-h-0 overflow-y-auto p-5">
     {tab === 'active' && activeAudit ? (
      <div className="space-y-4">
       {/* Progress */}
       <div className="bg-waxe-card border border-waxe-border p-4 clip-stat">
        <div className="flex items-center justify-between mb-2">
         <div>
          <p className="text-sm font-medium text-waxe-text">{activeAudit.name}</p>
          <p className="text-xs text-waxe-text-muted">Started {activeAudit.startDate} · Counted by {activeAudit.countedBy}</p>
         </div>
         <StatusBadge status={activeAudit.status} />
        </div>
        <div className="mb-2">
         <div className="flex items-center justify-between text-xs text-waxe-text-muted mb-1">
          <span>Progress</span>
          <span className="font-mono">{activeAudit.itemsCounted}/{activeAudit.totalItems} ({Math.round((activeAudit.itemsCounted / activeAudit.totalItems) * 100)}%)</span>
         </div>
         <div className="w-full h-2 bg-waxe-surface overflow-hidden">
          <div className="h-full bg-waxe-warm transition-all" style={{ width: `${(activeAudit.itemsCounted / activeAudit.totalItems) * 100}%` }} />
         </div>
        </div>
        {/* Variance summary */}
        <div className="grid grid-cols-4 gap-2 mt-3">
         <div className="text-center">
          <p className="text-lg font-semibold text-waxe-positive font-mono">{activeAudit.matchCount}</p>
          <p className="text-[10px] text-waxe-text-muted">Matches</p>
         </div>
         <div className="text-center">
          <p className="text-lg font-semibold text-waxe-text-muted font-mono">{activeAudit.varianceCount}</p>
          <p className="text-[10px] text-waxe-text-muted">Variances</p>
         </div>
         <div className="text-center">
          <p className="text-lg font-semibold text-waxe-negative font-mono">{activeAudit.missingCount}</p>
          <p className="text-[10px] text-waxe-text-muted">Missing</p>
         </div>
         <div className="text-center">
          <p className="text-lg font-semibold text-waxe-warm font-mono">{activeAudit.extraCount}</p>
          <p className="text-[10px] text-waxe-text-muted">Extra</p>
         </div>
        </div>
       </div>

       {/* Items table */}
       <DataTable headers={['Record', 'Expected', 'Counted', 'Variance', 'Note']}>
        {activeAudit.items.map((item) => (
         <tr key={item.inventoryId} className="table-row hover:bg-waxe-surface/30">
          <td className="px-4 py-2.5">
           <p className="text-sm text-waxe-text">{item.artist}</p>
           <p className="text-xs text-waxe-text-secondary">{item.title}</p>
          </td>
          <td className="px-4 py-2.5 text-sm text-waxe-text text-center font-mono">{item.expectedQty}</td>
          <td className="px-4 py-2.5 text-sm text-center font-mono">
           {item.countedQty !== null ? (
            <span className="text-waxe-text">{item.countedQty}</span>
           ) : (
            <span className="text-waxe-text-secondary">—</span>
           )}
          </td>
          <td className="px-4 py-2.5 text-sm text-center font-mono font-bold">
           {item.variance !== null ? (
            <span className={
             item.variance === 0 ? 'text-waxe-positive' :
             item.variance < 0 ? 'text-waxe-negative' :
             'text-waxe-warm'
            }>
             {item.variance === 0 ? '✓' : item.variance > 0 ? `+${item.variance}` : item.variance}
            </span>
           ) : (
            <span className="text-waxe-text-secondary">—</span>
           )}
          </td>
          <td className="px-4 py-2.5 text-xs text-waxe-text-secondary max-w-[200px] truncate">{item.note || '—'}</td>
         </tr>
        ))}
       </DataTable>

       <button className="btn-primary text-sm px-4 py-2">Approve Adjustments</button>
      </div>
     ) : tab === 'active' && !activeAudit ? (
      <div className="text-center py-12">
       <p className="text-sm text-waxe-text-muted">No active inventory count</p>
       <button className="btn-primary text-sm px-4 py-2 mt-4">Start New Count</button>
      </div>
     ) : (
      <div className="space-y-3">
       {audits.map((audit) => (
        <div key={audit.id} className="bg-waxe-card border border-waxe-border p-4 flex items-center justify-between clip-stat">
         <div>
          <div className="flex items-center gap-2 mb-1">
           <span className="text-xs font-mono text-waxe-text-muted">{audit.id}</span>
           <span className="text-sm font-medium text-waxe-text">{audit.name}</span>
           <StatusBadge status={audit.status} />
          </div>
          <p className="text-xs text-waxe-text-muted">
           {audit.startDate}{audit.endDate ? ` → ${audit.endDate}` : ''} · {audit.countedBy}
          </p>
         </div>
         <div className="text-right">
          <p className="text-sm font-bold text-waxe-text font-mono">
           {audit.totalItems > 0 ? `${Math.round((audit.matchCount / audit.totalItems) * 100)}%` : '—'}
          </p>
          <p className="text-[10px] text-waxe-text-muted">Match Rate</p>
         </div>
        </div>
       ))}
      </div>
     )}
    </div>
   </div>
  </div>
 )
}

// ─── Store Credit Modal Component ────────────────────────────

function StoreCreditModal({ onClose }: { onClose: () => void }) {
 const [tab, setTab] = useState<'accounts' | 'transactions'>('accounts')
 const [showIssueForm, setShowIssueForm] = useState(false)
 const [issueCustomer, setIssueCustomer] = useState('')
 const [issueAmount, setIssueAmount] = useState('')
 const [issueNote, setIssueNote] = useState('')

 const stats = getCreditStats()

 return (
  <div className="fixed inset-0 z-50 flex items-start justify-center pt-[5vh]">
   <div className="absolute inset-0 bg-waxe-text/40" onClick={onClose} />
   <div className="relative w-full max-w-3xl h-[85vh] flex flex-col overflow-hidden bg-waxe-base border border-waxe-border shadow-xl clip-modal">
    <div className="shrink-0 bg-waxe-base border-b border-waxe-border p-5 z-10">
     <div className="flex items-center justify-between mb-3">
      <h2 className="text-xl font-semibold text-waxe-text">Store Credit</h2>
      <div className="flex items-center gap-3">
       <button className="btn-ghost text-sm" onClick={() => setShowIssueForm(!showIssueForm)}>+ Issue Credit</button>
       <button onClick={onClose} className="text-waxe-text-muted hover:text-waxe-text text-lg">✕</button>
      </div>
     </div>
     <div className="grid grid-cols-3 gap-3 p-2 -m-2">
      <div className="stat-card">
       <p className="text-[10px] font-medium text-waxe-text-muted">Active Accounts</p>
       <p className="text-lg font-semibold text-waxe-text font-mono">{stats.activeAccounts}</p>
      </div>
      <div className="stat-card">
       <p className="text-[10px] font-medium text-waxe-text-muted">Outstanding Balance</p>
       <p className="text-lg font-semibold text-waxe-warm font-mono">${stats.outstandingBalance.toFixed(2)}</p>
      </div>
      <div className="stat-card">
       <p className="text-[10px] font-medium text-waxe-text-muted">Total Redeemed</p>
       <p className="text-lg font-semibold text-waxe-positive font-mono">${stats.totalRedeemed.toFixed(2)}</p>
      </div>
     </div>
     <div className="flex gap-1.5 mt-3">
      {(['accounts', 'transactions'] as const).map((t) => (
       <button
        key={t}
        onClick={() => setTab(t)}
        className={`text-[11px] font-medium px-3 py-1.5 border ${
         tab === t ? 'bg-waxe-text text-waxe-deep border-waxe-text' : 'text-waxe-text bg-waxe-card/80 backdrop-blur-sm border-waxe-border hover:border-waxe-border-hover'
        }`}
       >
        {t === 'accounts' ? 'Accounts' : 'Transactions'}
       </button>
      ))}
     </div>
    </div>

    <div className="flex-1 min-h-0 overflow-y-auto p-5">
     {/* Inline Issue Credit Form */}
     {showIssueForm && (
      <div className="bg-waxe-card border border-waxe-border p-4 mb-4 clip-stat">
       <p className="text-[10px] font-medium text-waxe-text-muted mb-3">Issue Store Credit</p>
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <select
         className="bg-waxe-deep border border-waxe-border text-sm text-waxe-text px-3 py-2 focus:outline-none focus:border-waxe-border-hover"
         value={issueCustomer}
         onChange={(e) => setIssueCustomer(e.target.value)}
        >
         <option value="">Select customer...</option>
         {customerProfiles.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
         ))}
        </select>
        <input
         type="number"
         placeholder="Amount ($)"
         className="bg-waxe-deep border border-waxe-border text-sm text-waxe-text px-3 py-2 focus:outline-none focus:border-waxe-border-hover"
         value={issueAmount}
         onChange={(e) => setIssueAmount(e.target.value)}
        />
        <input
         type="text"
         placeholder="Note (optional)"
         className="bg-waxe-deep border border-waxe-border text-sm text-waxe-text px-3 py-2 focus:outline-none focus:border-waxe-border-hover"
         value={issueNote}
         onChange={(e) => setIssueNote(e.target.value)}
        />
       </div>
       <div className="flex items-center gap-2 mt-3">
        <button
         className="btn-primary text-sm px-4 py-2"
         onClick={() => {
          setShowIssueForm(false)
          setIssueCustomer('')
          setIssueAmount('')
          setIssueNote('')
         }}
        >
         Issue Credit
        </button>
        <button className="btn-ghost text-sm px-3 py-2" onClick={() => setShowIssueForm(false)}>Cancel</button>
       </div>
      </div>
     )}

     {tab === 'accounts' ? (
      <div className="space-y-3">
       {creditAccounts.map((account) => {
        const txns = getCreditTransactions(account.id)
        return (
         <div key={account.id} className="bg-waxe-card border border-waxe-border p-4 clip-stat">
          <div className="flex items-start justify-between mb-2">
           <div>
            <div className="flex items-center gap-2">
             <p className="text-sm font-medium text-waxe-text">{account.customerName}</p>
             <StatusBadge status={account.status} />
            </div>
            <p className="text-xs text-waxe-text-muted mt-0.5">Since {account.createdAt} · Last activity {account.lastActivity}</p>
           </div>
           <div className="text-right">
            <p className="text-xs text-waxe-text-muted">Balance</p>
            <p className="text-lg font-bold font-mono text-waxe-text">${account.balance.toFixed(2)}</p>
           </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-waxe-text-muted">
           <div>Total Issued: <strong className="text-waxe-text font-mono">${account.totalIssued.toFixed(2)}</strong></div>
           <div>Total Redeemed: <strong className="text-waxe-text font-mono">${account.totalRedeemed.toFixed(2)}</strong></div>
           <div>Transactions: <strong className="text-waxe-text">{txns.length}</strong></div>
           <div>Status: <strong className="text-waxe-text">{account.status}</strong></div>
          </div>
          <div className="flex gap-2 mt-3">
           <button className="btn-ghost text-[11px] px-2 py-1" onClick={() => setTab('transactions')}>View Transactions</button>
           <button className="btn-ghost text-[11px] px-2 py-1">Adjust Balance</button>
          </div>
         </div>
        )
       })}
      </div>
     ) : (
      <DataTable headers={['Date', 'Customer', 'Type', 'Amount', 'Balance', 'Note', 'By']}>
       {creditTransactions.map((tx) => (
        <tr key={tx.id} className="table-row hover:bg-waxe-surface/30">
         <td className="px-4 py-3 text-sm text-waxe-text whitespace-nowrap">{tx.createdAt}</td>
         <td className="px-4 py-3 text-sm text-waxe-text">{tx.customerName}</td>
         <td className="px-4 py-3"><StatusBadge status={tx.type} /></td>
         <td className="px-4 py-3 text-sm font-medium font-mono">
          <span className={tx.amount >= 0 ? 'text-waxe-positive' : 'text-waxe-negative'}>
           {tx.amount >= 0 ? '+' : ''}{tx.amount.toFixed(2)}
          </span>
         </td>
         <td className="px-4 py-3 text-sm font-mono text-waxe-text">${tx.balanceAfter.toFixed(2)}</td>
         <td className="px-4 py-3 text-xs text-waxe-text-secondary max-w-[200px] truncate">{tx.note}</td>
         <td className="px-4 py-3 text-xs text-waxe-text-muted whitespace-nowrap">{tx.issuedBy}</td>
        </tr>
       ))}
      </DataTable>
     )}
    </div>
   </div>
  </div>
 )
}
