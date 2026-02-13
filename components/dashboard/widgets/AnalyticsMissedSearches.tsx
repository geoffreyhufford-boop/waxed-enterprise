'use client'

import { missedSearches } from '@/lib/dashboard-data'
import PinButton from '../PinButton'

export default function AnalyticsMissedSearches() {
  return (
    <div className="relative bg-waxe-card border-2 border-waxe-border rounded-none p-5 flex flex-col h-[360px]">
      <PinButton widgetId="analytics-missed-searches" />
      <div className="mb-1 shrink-0">
        <h3 className="text-[11px] font-black text-waxe-text uppercase tracking-[0.1em]">Missed <span className="text-waxe-cool">{'>>'}</span> Searches</h3>
      </div>
      <p className="shrink-0 pb-3 text-[10px] text-waxe-text-muted">What buyers searched for that you don&apos;t carry</p>
      <div className="flex-1 min-h-0 overflow-y-auto space-y-3">
        {missedSearches.map((s) => (
          <div key={s.query} className="flex items-start justify-between gap-2 py-1.5 border-b border-waxe-border/30 last:border-0">
            <div className="min-w-0">
              <p className="text-xs text-waxe-text font-medium truncate">{s.query}</p>
              <p className="text-[10px] text-waxe-text-muted">{s.lastSearched}</p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-sm font-bold text-waxe-warm font-mono">{s.searchCount}</p>
              <p className="text-[9px] text-waxe-text-muted uppercase">searches</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
