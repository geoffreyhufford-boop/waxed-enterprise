import type { Integration } from '@/lib/dashboard-data'
import StatusBadge from './StatusBadge'

export default function IntegrationCard({ name, icon, status, lastSync }: Integration) {
  return (
    <div className="flex items-center justify-between py-3 px-4 hover:bg-waxe-surface/30 transition-colors">
      <div className="flex items-center gap-3">
        <span className="w-8 h-8 bg-waxe-surface border border-waxe-border flex items-center justify-center text-sm">
          {icon}
        </span>
        <span className="text-sm font-medium text-waxe-text">{name}</span>
      </div>
      <div className="flex items-center gap-3">
        {lastSync && <span className="text-xs text-waxe-text-muted">{lastSync}</span>}
        <StatusBadge status={status} />
      </div>
    </div>
  )
}
