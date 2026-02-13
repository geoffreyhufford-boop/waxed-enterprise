'use client'

import { StatusBadge } from '@/components/dashboard'
import { restockRecommendations } from '@/lib/dashboard-data'
import PinButton from '../PinButton'

export default function AnalyticsRestockTable() {
  return (
    <div className="relative bg-waxe-card border-2 border-waxe-border rounded-none p-5 flex flex-col h-[360px]">
      <PinButton widgetId="analytics-restock-table" />
      <div className="mb-3 shrink-0">
        <h3 className="text-[11px] font-black text-waxe-text uppercase tracking-[0.1em]">Restock <span className="text-waxe-cool">{'>>'}</span> Recommendations</h3>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto">
        <table className="w-full text-left">
          <thead className="sticky top-0 bg-waxe-card">
            <tr className="border-b-2 border-waxe-border">
              <th className="pb-2 text-[10px] font-black text-waxe-text-muted uppercase tracking-wider">Record</th>
              <th className="pb-2 text-[10px] font-black text-waxe-text-muted uppercase tracking-wider">Demand</th>
              <th className="pb-2 text-[10px] font-black text-waxe-text-muted uppercase tracking-wider">Price</th>
              <th className="pb-2 text-[10px] font-black text-waxe-text-muted uppercase tracking-wider">Velocity</th>
            </tr>
          </thead>
          <tbody>
            {restockRecommendations.map((rec, i) => (
              <tr key={i} className="border-b border-waxe-border/30">
                <td className="py-2 pr-3">
                  <p className="text-xs font-medium text-waxe-text truncate">{rec.artist}</p>
                  <p className="text-[10px] text-waxe-text-muted truncate">{rec.title}</p>
                </td>
                <td className="py-2 pr-3">
                  <span className="text-xs font-medium text-waxe-text font-mono">{rec.demandScore}</span>
                </td>
                <td className="py-2 pr-3">
                  <span className="text-xs text-waxe-text-secondary font-mono">${rec.avgSalePrice}</span>
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
