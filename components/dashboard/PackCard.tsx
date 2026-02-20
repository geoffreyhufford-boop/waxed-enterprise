'use client'

import { useState } from 'react'
import type { CuratedPack, PackRecord } from '@/lib/pack-data'
import { calculateFees } from '@/lib/pack-data'
import { StatusBadge } from '@/components/dashboard'

// ─── Genre Color Bar ─────────────────────────────────────────

const genreColors: Record<string, string> = {
  Jazz: '#2C3B4D',
  House: '#3D7A4F',
  Ambient: '#4A5B6D',
  Techno: '#0A0E14',
  Disco: '#E89A40',
  'R&B': '#A35139',
  Soul: '#C04040',
  Electronic: '#2C3B4D',
}

// ─── Pack Artwork Grid (3-over-2) ────────────────────────────

export function PackArtworkGrid({ records, size = 'md' }: { records: PackRecord[]; size?: 'sm' | 'md' }) {
  const shown = records.filter((r) => r.artworkUrl).slice(0, 5)
  const dim = size === 'sm' ? 'w-7 h-7' : 'w-9 h-9'
  const gap = size === 'sm' ? 'gap-0.5' : 'gap-0.5'

  return (
    <div className={`shrink-0 ${gap}`}>
      {/* Row 1: 3 */}
      <div className={`flex ${gap} mb-0.5`}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`${dim} border border-waxe-border flex items-center justify-center relative overflow-hidden`}
            style={{ backgroundColor: shown[i]?.photoColor || '#2C3B4D' }}
          >
            {shown[i]?.artworkUrl ? (
              <img src={shown[i].artworkUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <span className="text-[5px] font-black text-white/40">LP</span>
            )}
          </div>
        ))}
      </div>
      {/* Row 2: 2 */}
      <div className={`flex ${gap}`}>
        {[3, 4].map((i) => (
          <div
            key={i}
            className={`${dim} border border-waxe-border flex items-center justify-center relative overflow-hidden`}
            style={{ backgroundColor: shown[i]?.photoColor || '#2C3B4D' }}
          >
            {shown[i]?.artworkUrl ? (
              <img src={shown[i].artworkUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <span className="text-[5px] font-black text-white/40">LP</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── View Contents Modal ─────────────────────────────────────

function PackContentsModal({ pack, onClose }: { pack: CuratedPack; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-waxe-text/60" onClick={onClose} />
      <div className="relative bg-waxe-card border-2 border-waxe-border rounded-none w-full max-w-2xl max-h-[85vh] overflow-y-auto clip-modal">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="designation-tag">Pack Contents</span>
                <StatusBadge status={pack.status} />
              </div>
              <h2 className="text-xl font-black text-waxe-text tracking-tight">{pack.name}</h2>
              <p className="text-xs text-waxe-text-muted">{pack.genre} &middot; {pack.records.length} records &middot; Avg {'★'.repeat(Math.round(pack.avgCondition))}{'☆'.repeat(5 - Math.round(pack.avgCondition))}</p>
            </div>
            <button onClick={onClose} className="text-waxe-text-muted hover:text-waxe-text text-lg font-black">✕</button>
          </div>

          {/* Value summary */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="bg-waxe-surface border border-waxe-border p-3 text-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-waxe-text-muted mb-1">Total Value</p>
              <p className="text-lg font-black text-waxe-text font-mono">${pack.totalValue}</p>
            </div>
            <div className="bg-waxe-surface border border-waxe-border p-3 text-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-waxe-text-muted mb-1">Pack Price</p>
              <p className="text-lg font-black text-waxe-positive font-mono">${pack.packPrice}</p>
            </div>
            <div className="bg-waxe-surface border border-waxe-border p-3 text-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-waxe-text-muted mb-1">Discount</p>
              <p className="text-lg font-black text-waxe-warm font-mono">-{pack.discountPercent}%</p>
            </div>
          </div>

          {/* All records */}
          <div className="space-y-1">
            {pack.records.map((r, i) => (
              <div key={i} className="flex items-center gap-3 py-1.5 border-b border-waxe-surface last:border-0">
                <span className="text-[11px] text-waxe-text-muted font-mono w-5 text-right shrink-0">{i + 1}</span>
                <div
                  className="w-8 h-8 shrink-0 border border-waxe-border flex items-center justify-center relative overflow-hidden"
                  style={{ backgroundColor: r.photoColor || '#2C3B4D' }}
                >
                  {r.artworkUrl ? (
                    <img src={r.artworkUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <span className="text-[6px] font-black text-white/50">LP</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold text-waxe-text truncate">{r.artist}</p>
                  <p className="text-[11px] text-waxe-text-muted truncate">{r.title}</p>
                </div>
                <span className="text-[11px] text-waxe-text-muted shrink-0">{'★'.repeat(r.condition)}{'☆'.repeat(5 - r.condition)}</span>
                <span className="text-[11px] font-bold text-waxe-text font-mono shrink-0">${r.marketValue}</span>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-4 pt-4 border-t-2 border-waxe-border">
            <p className="text-[11px] text-waxe-text-secondary leading-relaxed mb-3">{pack.generationReason}</p>
            <button onClick={onClose} className="btn-secondary text-sm px-5 py-2.5 w-full">Close</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Pack Card ───────────────────────────────────────────────

interface PackCardProps {
  pack: CuratedPack
  onListNetwork?: (id: string) => void
  onSellInStore?: (id: string) => void
}

export default function PackCard({ pack, onListNetwork, onSellInStore }: PackCardProps) {
  const [showContents, setShowContents] = useState(false)
  const barColor = genreColors[pack.genre] || '#2C3B4D'

  return (
    <>
      <div className="bg-waxe-card border-2 border-waxe-border rounded-none overflow-hidden clip-card">
        {/* Genre color bar */}
        <div className="h-1" style={{ backgroundColor: barColor }} />

        <div className="p-5 corner-marks">
          {/* Top section: artwork grid + info */}
          <div className="flex items-start gap-4 mb-4">
            <PackArtworkGrid records={pack.records} />

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-[11px] font-black text-waxe-text uppercase tracking-[0.1em] truncate">{pack.name}</p>
                <StatusBadge status={pack.status} />
              </div>
              <p className="text-[11px] text-waxe-text-muted">
                {pack.genre} &middot; {pack.records.length} records &middot; Avg {'★'.repeat(Math.round(pack.avgCondition))}{'☆'.repeat(5 - Math.round(pack.avgCondition))}
              </p>
              <p className="text-[11px] text-waxe-text-muted mt-0.5">
                {pack.deadStockCount} dead stock &middot; {pack.slowMoverCount} slow movers
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[11px] text-waxe-text-muted line-through font-mono">${pack.totalValue}</span>
                <span className="text-[11px] font-black text-waxe-text font-mono">${pack.packPrice}</span>
                <span className="text-[11px] font-bold text-waxe-positive">(-{pack.discountPercent}%)</span>
              </div>
              <p className="text-[10px] text-waxe-text-muted mt-0.5">Generated {pack.generatedAt}</p>
              {pack.status === 'listed_network' && (() => {
                const { fee, sellerReceives, rate } = calculateFees(pack.packPrice, 1)
                return (
                  <p className="text-[10px] text-waxe-text-muted mt-1">
                    WAXED fee: <span className="font-mono font-bold text-waxe-warm">${fee}</span> ({Math.round(rate * 100)}%) · You receive: <span className="font-mono font-bold text-waxe-positive">${sellerReceives}</span>
                  </p>
                )
              })()}
            </div>
          </div>

          {/* Action buttons — vary by status */}
          <div className="hatch-divider mb-3" />
          <div className="flex gap-2 pt-1">
            {pack.status === 'draft' && (
              <>
                <button onClick={() => onListNetwork?.(pack.id)} className="btn-primary text-[11px] px-3 py-1.5 flex-1">List to Network</button>
                <button onClick={() => onSellInStore?.(pack.id)} className="btn-secondary text-[11px] px-3 py-1.5 flex-1">Sell In-Store</button>
                <button onClick={() => setShowContents(true)} className="btn-ghost text-[11px] px-3 py-1.5">Edit</button>
              </>
            )}
            {(pack.status === 'listed_network' || pack.status === 'listed_storefront' || pack.status === 'listed_instore') && (
              <>
                <button className="btn-secondary text-[11px] px-3 py-1.5 flex-1">Delist</button>
                <button onClick={() => setShowContents(true)} className="btn-ghost text-[11px] px-3 py-1.5 flex-1">View Contents</button>
              </>
            )}
            {pack.status === 'sold' && (
              <button onClick={() => setShowContents(true)} className="btn-ghost text-[11px] px-3 py-1.5 flex-1">View Contents</button>
            )}
          </div>
        </div>
      </div>

      {showContents && <PackContentsModal pack={pack} onClose={() => setShowContents(false)} />}
    </>
  )
}
