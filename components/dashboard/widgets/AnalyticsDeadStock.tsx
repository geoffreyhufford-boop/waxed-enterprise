'use client'

import { deadStockSummary } from '@/lib/dashboard-data'
import PinButton from '../PinButton'

export default function AnalyticsDeadStock() {
  return (
    <div className="relative bg-waxe-card border border-waxe-border p-5 flex flex-col h-[360px] clip-card-bl">
      <PinButton widgetId="analytics-dead-stock" />
      <div className="mb-2 shrink-0">
        <div className="flex items-center gap-2">
          <h3 className="text-[11px] font-semibold text-waxe-text">Aged Inventory → 90+ Days</h3>
          <span className="hatch-inline flex-1 mr-10" style={{ width: 'auto' }} />
        </div>
      </div>
      <div className="hatch-divider-strong mb-3 shrink-0" />
      <div className="flex-1 min-h-0 space-y-3">
        <div className="flex justify-between items-baseline">
          <span className="text-xs text-waxe-text-muted">Items</span>
          <span className="text-2xl font-semibold text-waxe-negative font-mono">{deadStockSummary.totalItems}</span>
        </div>
        <div className="flex justify-between items-baseline">
          <span className="text-xs text-waxe-text-muted">Capital Tied Up</span>
          <span className="text-lg font-semibold text-waxe-text font-mono">${deadStockSummary.totalValue.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-baseline">
          <span className="text-xs text-waxe-text-muted">Avg Days Listed</span>
          <span className="text-sm font-medium text-waxe-text font-mono">{deadStockSummary.avgDaysListed}d</span>
        </div>
        <div className="flex justify-between items-baseline">
          <span className="text-xs text-waxe-text-muted">Top Genre</span>
          <span className="text-sm font-medium text-waxe-text">{deadStockSummary.topGenre}</span>
        </div>
      </div>
    </div>
  )
}
