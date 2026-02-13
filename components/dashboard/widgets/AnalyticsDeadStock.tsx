'use client'

import { deadStockSummary } from '@/lib/dashboard-data'
import PinButton from '../PinButton'

export default function AnalyticsDeadStock() {
  return (
    <div className="relative bg-waxe-card border-2 border-waxe-border rounded-none p-5 flex flex-col h-[360px]">
      <PinButton widgetId="analytics-dead-stock" />
      <div className="mb-4 shrink-0">
        <h3 className="text-[11px] font-black text-waxe-text uppercase tracking-[0.1em]">Dead Stock <span className="text-waxe-cool">{'>>'}</span> 90+ Days</h3>
      </div>
      <div className="flex-1 min-h-0 space-y-3">
        <div className="flex justify-between items-baseline">
          <span className="text-xs text-waxe-text-muted uppercase tracking-wider">Items</span>
          <span className="text-2xl font-semibold text-waxe-negative font-mono">{deadStockSummary.totalItems}</span>
        </div>
        <div className="flex justify-between items-baseline">
          <span className="text-xs text-waxe-text-muted uppercase tracking-wider">Capital Tied Up</span>
          <span className="text-lg font-semibold text-waxe-text font-mono">${deadStockSummary.totalValue.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-baseline">
          <span className="text-xs text-waxe-text-muted uppercase tracking-wider">Avg Days Listed</span>
          <span className="text-sm font-medium text-waxe-text font-mono">{deadStockSummary.avgDaysListed}d</span>
        </div>
        <div className="flex justify-between items-baseline">
          <span className="text-xs text-waxe-text-muted uppercase tracking-wider">Top Genre</span>
          <span className="text-sm font-medium text-waxe-text">{deadStockSummary.topGenre}</span>
        </div>
      </div>
    </div>
  )
}
