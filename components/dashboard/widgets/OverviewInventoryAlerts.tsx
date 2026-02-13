'use client'

import { StatusBadge } from '@/components/dashboard'
import PinButton from '../PinButton'

const inventoryAlerts = [
  { label: 'Low stock (< 3 copies)', count: 18, status: 'medium' as const },
  { label: 'Price suggestions pending', count: 7, status: 'high' as const },
  { label: 'Sync conflicts', count: 2, status: 'high' as const },
  { label: 'Unlisted inventory', count: 34, status: 'low' as const },
]

export default function OverviewInventoryAlerts() {
  return (
    <div className="relative bg-waxe-card border-2 border-waxe-border rounded-none p-5 flex flex-col h-[360px]">
      <PinButton widgetId="overview-inventory-alerts" />
      <div className="mb-4 shrink-0">
        <h2 className="text-[11px] font-black text-waxe-text uppercase tracking-[0.1em]">Inventory <span className="text-waxe-cool">{'>>'}</span> Alerts</h2>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto space-y-3">
        {inventoryAlerts.map((alert, i) => (
          <div key={i} className="flex items-center justify-between">
            <span className="text-sm text-waxe-text-secondary">{alert.label}</span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black text-waxe-text">{alert.count}</span>
              <StatusBadge status={alert.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
