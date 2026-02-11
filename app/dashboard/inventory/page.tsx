'use client'

import { useState, useRef } from 'react'
import { DashboardHeader, StatCard, StatusBadge, FilterDropdown, DataTable } from '@/components/dashboard'
import { inventoryRecords, catalogResults, importBatch, type InventoryRecord } from '@/lib/dashboard-data'

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
  10: 'Sealed', 9: 'Pristine', 8: 'Excellent', 7: 'Very Good',
  6: 'Good', 5: 'Fair', 4: 'Worn', 3: 'Rough', 2: 'Damaged', 1: 'Trashed',
}

export default function InventoryPage() {
  const [search, setSearch] = useState('')
  const [genreFilter, setGenreFilter] = useState('All')
  const [conditionFilter, setConditionFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [showCatalog, setShowCatalog] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [catalogSearch, setCatalogSearch] = useState('Aphex Twin')
  const scrollRef = useRef<HTMLDivElement>(null)
  const [selectedRecord, setSelectedRecord] = useState<InventoryRecord | null>(null)
  const [activePanel, setActivePanel] = useState(0)
  const panelCount = 2

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

  const filtered = inventoryRecords.filter((r) => {
    if (search) {
      const q = search.toLowerCase()
      if (!r.artist.toLowerCase().includes(q) && !r.title.toLowerCase().includes(q) && !r.id.toLowerCase().includes(q) && !r.label.toLowerCase().includes(q)) return false
    }
    if (genreFilter !== 'All' && r.genre !== genreFilter) return false
    if (conditionFilter !== 'All' && String(r.condition) !== conditionFilter) return false
    if (statusFilter !== 'All' && r.status !== statusFilter) return false
    return true
  })

  const printQueue = inventoryRecords.filter(r => r.inPrintQueue)

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <DashboardHeader
        title="Inventory"
        subtitle={`${inventoryRecords.length} records across all channels`}
        actions={
          <div className="flex gap-2">
            <button className="btn-secondary text-sm px-4 py-2" onClick={() => setShowImport(true)}>Import</button>
            <button className="btn-primary text-sm px-4 py-2" onClick={() => setShowCatalog(true)}>+ Add Record</button>
          </div>
        }
      />

      {/* Stats Row */}
      <div className="shrink-0 grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
        <StatCard label="Total Records" value="2,847" trend="+124" trendUp={true} />
        <StatCard label="Active Listings" value="2,412" trend="+98" trendUp={true} />
        <StatCard label="Avg Price" value="$47.20" trend="+$2.30" trendUp={true} />
        <StatCard label="Print Queue" value={String(printQueue.length)} />
      </div>

      {/* Search + Filters */}
      <div className="shrink-0 flex flex-wrap items-center gap-2 mb-3">
        <input
          type="text"
          placeholder="Search artist, title, label, ID..."
          className="bg-waxe-card border-2 border-waxe-border text-sm text-waxe-text placeholder:text-waxe-text-muted px-3 py-1.5 w-48 lg:w-56 focus:outline-none focus:border-waxe-border-hover"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <FilterDropdown label="Genre" options={['All', 'Jazz', 'Rock', 'Hip-Hop', 'Electronic', 'Soul']} value={genreFilter} onChange={setGenreFilter} />
        <FilterDropdown label="Condition" options={['All', '10', '9', '8', '7', '6', '5']} value={conditionFilter} onChange={setConditionFilter} />
        <FilterDropdown label="Status" options={['All', 'active', 'sold', 'reserved', 'pending']} value={statusFilter} onChange={setStatusFilter} />
        <div className="flex-1" />
        <button className="btn-secondary text-sm px-3 py-1.5" onClick={() => scrollToPanel(activePanel === 1 ? 0 : 1)}>
          {activePanel === 0 ? (
            <>
              ⎙ Print Queue
              {printQueue.length > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold bg-waxe-warm text-waxe-deep">{printQueue.length}</span>
              )}
            </>
          ) : (
            <>{'<< '}Inventory</>
          )}
        </button>
      </div>

      {/* Horizontal swipe panels */}
      <div ref={scrollRef} onScroll={handleScroll} className="flex-1 min-h-0 overflow-x-auto overflow-y-hidden snap-x snap-mandatory flex scrollbar-hide" style={{ scrollbarWidth: 'none' }}>

        {/* ── Panel 1: Inventory Table ── */}
        <div className="snap-start shrink-0 w-full min-h-0">
        <DataTable headers={['Photo', 'Record', 'Condition', 'Price', 'Suggested', 'Source', 'Status', 'Queue']} maxHeight="100%">
        {filtered.map((record) => (
          <tr key={record.id} className="table-row hover:bg-waxe-surface/30 transition-colors cursor-pointer" onClick={() => setSelectedRecord(record)}>
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
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-waxe-deep/60">
                      {record.artist.split(' ').pop()?.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-t from-black/40 to-transparent" />
                  </>
                )}
              </div>
            </td>
            <td className="px-4 py-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-waxe-text truncate">{record.artist}</p>
                <p className="text-xs text-waxe-text-muted truncate">{record.title} · {record.label} · {record.year}</p>
              </div>
            </td>
            <td className="px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-5 rounded bg-waxe-surface flex items-center justify-center">
                  <span className={`text-xs font-bold ${
                    record.condition >= 9 ? 'text-waxe-cond-9' :
                    record.condition >= 7 ? 'text-waxe-cond-7' :
                    record.condition >= 5 ? 'text-waxe-cond-5' :
                    record.condition >= 3 ? 'text-waxe-cond-3' :
                    'text-waxe-cond-1'
                  }`}>{record.condition}</span>
                </div>
                <div className="w-10 h-1.5 bg-waxe-surface rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${
                    record.condition >= 9 ? 'bg-waxe-cond-9' :
                    record.condition >= 7 ? 'bg-waxe-cond-7' :
                    record.condition >= 5 ? 'bg-waxe-cond-5' :
                    record.condition >= 3 ? 'bg-waxe-cond-3' :
                    'bg-waxe-cond-1'
                  }`} style={{ width: `${record.condition * 10}%` }} />
                </div>
              </div>
            </td>
            <td className="px-4 py-3 text-sm font-medium text-waxe-text">${record.price.toFixed(2)}</td>
            <td className="px-4 py-3">
              {record.suggestedPrice && record.priceDelta !== undefined && (
                <div className="flex items-center gap-1.5">
                  <span className="text-sm text-waxe-text-secondary">${record.suggestedPrice.toFixed(2)}</span>
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
        </div>

        {/* ── Panel 2: Print Queue ── */}
        <div className="snap-start shrink-0 w-full flex flex-col min-h-0">
          <div className="bg-waxe-card border-2 border-waxe-border rounded-none flex flex-col flex-1 min-h-0">
            <div className="shrink-0 flex items-center justify-between p-5 border-b-2 border-waxe-border">
              <div className="flex items-center gap-3">
                <button className="btn-ghost text-sm px-2 py-1" onClick={() => scrollToPanel(0)}>
                  {'<< '}Back
                </button>
                <div>
                  <h3 className="text-[11px] font-black text-waxe-text uppercase tracking-[0.1em]">Label Print Queue</h3>
                  <p className="text-[10px] text-waxe-text-muted uppercase tracking-[0.1em] mt-1">{printQueue.length} labels ready</p>
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

        {/* No spacer needed — panels are full width */}
      </div>


      {/* ─── Record Detail / Edit Modal ─── */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[5vh]">
          <div className="absolute inset-0 bg-waxe-text/40" onClick={() => setSelectedRecord(null)} />
          <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-waxe-base border-2 border-waxe-border rounded-none shadow-xl">
            {/* Header */}
            <div className="sticky top-0 bg-waxe-base border-b border-waxe-border p-5 rounded-none z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Album art — click to upload custom photo */}
                  <button
                    className="w-16 h-16 overflow-hidden relative shrink-0"
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
                      <span className="text-xs text-waxe-deep">📷</span>
                      <span className="text-[9px] text-waxe-deep/70">Upload</span>
                    </div>
                  </button>
                  <div>
                    <h2 className="text-xl font-black text-waxe-text uppercase tracking-tight">{selectedRecord.artist}</h2>
                    <p className="text-sm text-waxe-text-muted">{selectedRecord.title}</p>
                    <span className="text-xs font-mono text-waxe-text-muted">{selectedRecord.id}</span>
                  </div>
                </div>
                <button onClick={() => setSelectedRecord(null)} className="text-waxe-text-muted hover:text-waxe-text text-lg">✕</button>
              </div>
            </div>

            {/* Form Body */}
            <div className="p-5 space-y-5">
              {/* Status + Sync row */}
              <div className="flex items-center gap-3 flex-wrap">
                <StatusBadge status={selectedRecord.status} />
                <span className={`text-xs font-medium ${syncSourceColor[selectedRecord.syncSource]}`}>
                  via {syncSourceLabel[selectedRecord.syncSource]}
                </span>
                {selectedRecord.inPrintQueue && (
                  <span className="text-xs text-waxe-cool bg-waxe-warm/10 px-2 py-0.5 rounded-full border border-waxe-warm/15">In print queue</span>
                )}
                {selectedRecord.discogsReleaseId && (
                  <span className="text-xs font-mono text-waxe-text-secondary bg-waxe-text-secondary/10 px-2 py-0.5 border border-waxe-text-secondary/15">{selectedRecord.discogsReleaseId}</span>
                )}
              </div>

              {/* Core Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-waxe-text-muted uppercase tracking-wider mb-1.5 block">Artist</label>
                  <input type="text" className="input-field" defaultValue={selectedRecord.artist} />
                </div>
                <div>
                  <label className="text-xs font-medium text-waxe-text-muted uppercase tracking-wider mb-1.5 block">Title</label>
                  <input type="text" className="input-field" defaultValue={selectedRecord.title} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-medium text-waxe-text-muted uppercase tracking-wider mb-1.5 block">Label</label>
                  <input type="text" className="input-field" defaultValue={selectedRecord.label} />
                </div>
                <div>
                  <label className="text-xs font-medium text-waxe-text-muted uppercase tracking-wider mb-1.5 block">Year</label>
                  <input type="number" className="input-field" defaultValue={selectedRecord.year} />
                </div>
                <div>
                  <label className="text-xs font-medium text-waxe-text-muted uppercase tracking-wider mb-1.5 block">Genre</label>
                  <input type="text" className="input-field" defaultValue={selectedRecord.genre} />
                </div>
              </div>

              {/* ── Pressing Identity ── */}
              <div className="bg-waxe-surface/30 rounded-none p-4">
                <h3 className="text-[10px] font-black text-waxe-text uppercase tracking-[0.1em] mb-3">Pressing Details</h3>
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

              {/* ── Physical Specs ── */}
              <div className="bg-waxe-surface/30 rounded-none p-4">
                <h3 className="text-[10px] font-black text-waxe-text uppercase tracking-[0.1em] mb-3">Physical Specs</h3>
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
                  <div className="flex gap-4">
                    <select className="input-field flex-1" defaultValue={selectedRecord.mastering || ''}>
                      <option value="">Unknown</option>
                      <option value="AAA">AAA — All Analog</option>
                      <option value="AAD">AAD — Analog/Analog/Digital</option>
                      <option value="ADD">ADD — Analog/Digital/Digital</option>
                      <option value="DDD">DDD — All Digital</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* ── Condition ── */}
              <div className="bg-waxe-surface/30 rounded-none p-4">
                <h3 className="text-[10px] font-black text-waxe-text uppercase tracking-[0.1em] mb-3">Condition</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-xs text-waxe-text-muted mb-1.5 block">
                      Media — {selectedRecord.condition}/10 ({conditionLabels[selectedRecord.condition] || 'Unknown'})
                    </label>
                    <div className="flex items-center gap-3">
                      <input type="range" min="1" max="10" defaultValue={selectedRecord.condition} className="flex-1 accent-waxe-text" />
                      <div className={`w-10 h-7 flex items-center justify-center text-sm font-bold ${
                        selectedRecord.condition >= 9 ? 'bg-waxe-cond-9/15 text-waxe-cond-9' :
                        selectedRecord.condition >= 7 ? 'bg-waxe-cond-7/15 text-waxe-cond-7' :
                        selectedRecord.condition >= 5 ? 'bg-waxe-cond-5/15 text-waxe-cond-5' :
                        selectedRecord.condition >= 3 ? 'bg-waxe-cond-3/15 text-waxe-cond-3' :
                        'bg-waxe-cond-1/15 text-waxe-cond-1'
                      }`}>{selectedRecord.condition}</div>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-waxe-text-muted mb-1.5 block">
                      Sleeve — {selectedRecord.sleeveCondition}/10 ({conditionLabels[selectedRecord.sleeveCondition] || 'Unknown'})
                    </label>
                    <div className="flex items-center gap-3">
                      <input type="range" min="1" max="10" defaultValue={selectedRecord.sleeveCondition} className="flex-1 accent-waxe-text-secondary" />
                      <div className={`w-10 h-7 flex items-center justify-center text-sm font-bold ${
                        selectedRecord.sleeveCondition >= 9 ? 'bg-waxe-cond-9/15 text-waxe-cond-9' :
                        selectedRecord.sleeveCondition >= 7 ? 'bg-waxe-cond-7/15 text-waxe-cond-7' :
                        selectedRecord.sleeveCondition >= 5 ? 'bg-waxe-cond-5/15 text-waxe-cond-5' :
                        selectedRecord.sleeveCondition >= 3 ? 'bg-waxe-cond-3/15 text-waxe-cond-3' :
                        'bg-waxe-cond-1/15 text-waxe-cond-1'
                      }`}>{selectedRecord.sleeveCondition}</div>
                    </div>
                  </div>
                </div>

                {/* Sleeve & Packaging */}
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

                {/* Flaw Notes */}
                <div>
                  <label className="text-xs text-waxe-text-muted mb-1.5 block">Condition Notes</label>
                  <textarea className="input-field min-h-[60px] resize-y" defaultValue={selectedRecord.flawNotes || ''} placeholder="Ring wear, seam splits, surface noise, warping..." />
                </div>
              </div>

              {/* ── Pricing & Market ── */}
              <div className="bg-waxe-surface/30 rounded-none p-4">
                <h3 className="text-[10px] font-black text-waxe-text uppercase tracking-[0.1em] mb-3">Pricing & Market Data</h3>
                <div className="grid grid-cols-3 gap-4 mb-4">
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
                {/* Discogs market data */}
                {selectedRecord.discogsMedian && (
                  <div className="flex items-center gap-3 pt-3 border-t border-waxe-border">
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
                    {/* Visual price position */}
                    <div className="flex-1 ml-2">
                      <div className="relative h-2 bg-waxe-surface rounded-full">
                        <div className="absolute h-2 bg-waxe-border rounded-full" style={{
                          left: '0%',
                          width: '100%',
                        }} />
                        <div
                          className="absolute w-3 h-3 rounded-full bg-waxe-warm border-2 border-waxe-base -top-0.5"
                          title={`Your price: $${selectedRecord.price}`}
                          style={{
                            left: `${Math.min(100, Math.max(0, ((selectedRecord.price - (selectedRecord.discogsLow || 0)) / ((selectedRecord.discogsHigh || 1) - (selectedRecord.discogsLow || 0))) * 100))}%`,
                          }}
                        />
                      </div>
                      <p className="text-[9px] text-waxe-text-muted text-center mt-1">Your price vs. market</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Status + Source + Print Queue */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-waxe-text-muted uppercase tracking-wider mb-1.5 block">Status</label>
                  <select className="input-field" defaultValue={selectedRecord.status}>
                    <option value="active">Active</option>
                    <option value="sold">Sold</option>
                    <option value="reserved">Reserved</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-waxe-text-muted uppercase tracking-wider mb-1.5 block">Sync Source</label>
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

            {/* Footer */}
            <div className="sticky bottom-0 bg-waxe-base border-t border-waxe-border p-5 flex items-center justify-between">
              <button className="text-sm text-red-400 hover:text-red-300 transition-colors">Delete Record</button>
              <div className="flex gap-2">
                <button className="btn-secondary text-sm px-4 py-2" onClick={() => setSelectedRecord(null)}>Cancel</button>
                <button className="btn-primary text-sm px-4 py-2" onClick={() => setSelectedRecord(null)}>Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Catalog Search Modal ─── */}
      {showCatalog && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[5vh]">
          <div className="absolute inset-0 bg-waxe-text/40" onClick={() => setShowCatalog(false)} />
          <div className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto bg-waxe-base border-2 border-waxe-border rounded-none shadow-xl">
            <div className="sticky top-0 bg-waxe-base border-b border-waxe-border p-5 rounded-none z-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-black text-waxe-text uppercase tracking-tight">Catalog Search</h2>
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
                  <div key={result.discogsId} className="bg-waxe-card border-2 border-waxe-border rounded-none p-4 hover:border-waxe-border-hover transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-black text-waxe-text uppercase tracking-[0.1em]">{result.artist} — {result.title}</p>
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
                        <p className="text-[10px] text-waxe-text-muted">median</p>
                        <p className="text-xs text-waxe-text-muted mt-1">${result.lowestPrice} — ${result.highestPrice}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-waxe-border">
                      <div className="flex items-center gap-2">
                        {result.want > result.have && (
                          <span className="text-[10px] font-medium px-2 py-0.5 bg-waxe-text/10 text-waxe-text border border-waxe-text/15">
                            High demand
                          </span>
                        )}
                        <span className="text-[10px] font-mono text-waxe-text-muted">{result.discogsId}</span>
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
          <div className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto bg-waxe-base border-2 border-waxe-border rounded-none shadow-xl">
            <div className="sticky top-0 bg-waxe-base border-b border-waxe-border p-5 rounded-none z-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-black text-waxe-text uppercase tracking-tight">Import Records</h2>
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
                    className={`p-3 rounded-none border text-center transition-all ${
                      source.id === importBatch.source
                        ? 'bg-waxe-text/5 border-waxe-text text-waxe-text'
                        : 'bg-waxe-card border-waxe-border text-waxe-text-secondary hover:border-waxe-border-hover'
                    }`}
                  >
                    <span className="text-lg block mb-1">{source.icon}</span>
                    <span className="text-xs font-medium block">{source.label}</span>
                    <span className="text-[10px] text-waxe-text-muted block">{source.desc}</span>
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
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isComplete ? 'bg-waxe-text text-waxe-base' :
                        isCurrent ? 'bg-waxe-text-secondary text-waxe-base' :
                        'bg-waxe-surface text-waxe-text-muted border-2 border-waxe-border'
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
              <div className="bg-waxe-surface/50 rounded-none p-4 mb-5 flex items-center justify-between">
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
                    <p className="text-[10px] text-waxe-text-muted">auto-matched</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-waxe-text-muted">{importBatch.needsReview}</p>
                    <p className="text-[10px] text-waxe-text-muted">needs review</p>
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
                  <div key={i} className={`flex items-center justify-between p-3 rounded-none border transition-colors ${
                    record.matched
                      ? 'bg-waxe-card/30 border-waxe-border'
                      : 'bg-waxe-text-muted/5 border-waxe-text-muted/20'
                  }`}>
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${
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
                        <p className="text-[10px] text-waxe-text-muted">{record.matchConfidence}% match</p>
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
    </div>
  )
}
