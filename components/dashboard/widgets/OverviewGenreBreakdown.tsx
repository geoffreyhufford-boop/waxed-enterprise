'use client'

import { genreBreakdowns } from '@/lib/dashboard-data'
import PinButton from '../PinButton'

export default function OverviewGenreBreakdown() {
  return (
    <div className="relative bg-waxe-card border border-waxe-border p-5 flex flex-col h-[360px] clip-card-bl">
      <PinButton widgetId="overview-genre-breakdown" />
      <div className="mb-2 shrink-0">
        <div className="flex items-center gap-2">
          <h2 className="text-[11px] font-semibold text-waxe-text">Genre → Breakdown</h2>
          <span className="hatch-inline flex-1 mr-10" style={{ width: 'auto' }} />
        </div>
      </div>
      <div className="hatch-divider mb-3 shrink-0" />
      <div className="flex-1 min-h-0 overflow-y-auto space-y-3">
        {genreBreakdowns.map((g) => (
          <div key={g.genre} className="flex items-center gap-3">
            <span className="text-sm text-waxe-text w-24">{g.genre}</span>
            <div className="flex-1 h-2 bg-waxe-surface rounded-full overflow-hidden">
              <div className="h-full bg-waxe-warm rounded-full" style={{ width: `${g.percentage}%` }} />
            </div>
            <span className="text-xs text-waxe-text-muted w-16 text-right">{g.count} · {g.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
