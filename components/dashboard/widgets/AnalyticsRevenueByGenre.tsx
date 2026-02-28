'use client'

import { genreBreakdowns } from '@/lib/dashboard-data'
import PinButton from '../PinButton'

export default function AnalyticsRevenueByGenre() {
  return (
    <div className="relative bg-waxe-card border border-waxe-border p-5 flex flex-col h-[360px] clip-card-bl">
      <PinButton widgetId="analytics-revenue-by-genre" />
      <div className="mb-2 shrink-0">
        <div className="flex items-center gap-2">
          <h3 className="text-[11px] font-semibold text-waxe-text">Revenue → By Genre</h3>
          <span className="hatch-inline flex-1 mr-10" style={{ width: 'auto' }} />
        </div>
      </div>
      <div className="hatch-divider mb-3 shrink-0" />
      <div className="flex-1 min-h-0 overflow-y-auto space-y-3">
        {genreBreakdowns.map((g) => (
          <div key={g.genre}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-waxe-text truncate">{g.genre}</span>
              <span className="text-xs text-waxe-text font-mono font-medium">${g.revenue.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-waxe-surface overflow-hidden">
                <div className="h-full bg-waxe-warm" style={{ width: `${g.percentage}%` }} />
              </div>
              <span className="text-[11px] text-waxe-text-muted w-10 shrink-0 text-right font-mono">{g.percentage}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
