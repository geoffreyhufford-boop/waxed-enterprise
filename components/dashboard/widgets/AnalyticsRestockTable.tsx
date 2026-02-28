'use client'

import { StatusBadge } from '@/components/dashboard'
import { restockRecommendations } from '@/lib/dashboard-data'
import PinButton from '../PinButton'

export default function AnalyticsRestockTable() {
  return (
    <div className="relative bg-waxe-card border border-waxe-border p-5 flex flex-col h-[360px] clip-card-bl">
      <PinButton widgetId="analytics-restock-table" />
      <div className="mb-2 shrink-0">
        <div className="flex items-center gap-2">
          <h3 className="text-[11px] font-semibold text-waxe-text">Restock → Recommendations</h3>
          <span className="hatch-inline flex-1 mr-10" style={{ width: 'auto' }} />
        </div>
      </div>
      <div className="hatch-divider mb-3 shrink-0" />
      <div className="flex-1 min-h-0 overflow-y-auto">
        <table className="w-full text-left">
          <thead className="sticky top-0 bg-waxe-card">
            <tr className="border-b border-waxe-border">
              <th className="pb-2 text-[11px] font-medium text-waxe-text-muted">Record</th>
              <th className="pb-2 text-[11px] font-medium text-waxe-text-muted">Demand</th>
              <th className="pb-2 text-[11px] font-medium text-waxe-text-muted">Price</th>
              <th className="pb-2 text-[11px] font-medium text-waxe-text-muted">Velocity</th>
            </tr>
          </thead>
          <tbody>
            {restockRecommendations.map((rec, i) => (
              <tr key={i} className="border-b border-waxe-border/30">
                <td className="py-2 pr-3">
                  <p className="text-xs font-medium text-waxe-text truncate">{rec.artist}</p>
                  <p className="text-[11px] text-waxe-text-secondary truncate">{rec.title}</p>
                </td>
                <td className="py-2 pr-3">
                  <span className="text-xs font-medium text-waxe-text font-mono">{rec.demandScore}</span>
                </td>
                <td className="py-2 pr-3">
                  <span className="text-xs text-waxe-text font-mono">${rec.avgSalePrice}</span>
                </td>
                <td className="py-2">
                  <StatusBadge status={rec.velocity} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
