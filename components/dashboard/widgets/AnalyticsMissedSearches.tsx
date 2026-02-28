'use client'

import { missedSearches } from '@/lib/dashboard-data'
import PinButton from '../PinButton'

export default function AnalyticsMissedSearches() {
  return (
    <div className="relative bg-waxe-card border border-waxe-border p-5 flex flex-col h-[360px] clip-card-bl">
      <PinButton widgetId="analytics-missed-searches" />
      <div className="mb-2 shrink-0">
        <div className="flex items-center gap-2">
          <h3 className="text-[11px] font-semibold text-waxe-text">Missed → Searches</h3>
          <span className="hatch-inline flex-1 mr-10" style={{ width: 'auto' }} />
        </div>
        <p className="text-[11px] text-waxe-text-muted mt-1">What buyers searched for that you don&apos;t carry</p>
      </div>
      <div className="hatch-divider mb-3 shrink-0" />
      <div className="flex-1 min-h-0 overflow-y-auto space-y-3">
        {missedSearches.map((s) => (
          <div key={s.query} className="flex items-start justify-between gap-2 py-1.5 border-b border-waxe-border/30 last:border-0">
            <div className="min-w-0">
              <p className="text-xs text-waxe-text font-medium truncate">{s.query}</p>
              <p className="text-[11px] text-waxe-text-muted">{s.lastSearched}</p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-sm font-medium text-waxe-warm font-mono">{s.searchCount}</p>
              <p className="text-[11px] text-waxe-text-muted">searches</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
