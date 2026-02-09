'use client'

import type { Shelf } from '@/lib/dashboard-data'

interface ShelfCardProps {
  shelf: Shelf
  isSelected: boolean
  onSelect: () => void
  artworkMap?: Record<string, string | undefined>
}

const typeLabels: Record<string, string> = {
  algorithmic: 'Auto',
  curated: 'Curated',
  genre: 'Genre',
  featured: 'Featured',
}

const typeBg: Record<string, string> = {
  algorithmic: 'bg-[#7c9ec9]/15 text-[#7c9ec9]',
  curated: 'bg-[#c9a87c]/15 text-[#c9a87c]',
  genre: 'bg-[#7cb89a]/15 text-[#7cb89a]',
  featured: 'bg-waxe-warm/15 text-waxe-warm',
}

export default function ShelfCard({ shelf, isSelected, onSelect, artworkMap = {} }: ShelfCardProps) {
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
        isSelected
          ? 'bg-waxe-surface border-waxe-warm/30'
          : 'bg-waxe-card/40 border-waxe-border hover:border-waxe-border-hover'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold text-waxe-text">{shelf.name}</h4>
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${typeBg[shelf.type]}`}>
          {typeLabels[shelf.type]}
        </span>
      </div>
      <p className="text-xs text-waxe-text-muted">{shelf.recordCount} records</p>
      <div className="flex gap-1.5 mt-3">
        {shelf.records.slice(0, 4).map((r) => (
          <div
            key={r.id}
            className="w-8 h-8 rounded bg-waxe-surface border border-waxe-border overflow-hidden"
          >
            {artworkMap[r.id] ? (
              <img src={artworkMap[r.id]} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-waxe-text-muted">
                {r.artist.charAt(0)}
              </div>
            )}
          </div>
        ))}
        {shelf.recordCount > 4 && (
          <div className="w-8 h-8 rounded bg-waxe-surface/50 border border-waxe-border flex items-center justify-center text-[10px] text-waxe-text-muted">
            +{shelf.recordCount - 4}
          </div>
        )}
      </div>
    </button>
  )
}
