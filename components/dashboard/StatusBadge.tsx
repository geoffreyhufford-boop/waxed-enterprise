const statusStyles: Record<string, string> = {
  active: 'bg-waxe-positive text-waxe-deep',
  connected: 'bg-waxe-text text-waxe-deep',
  live: 'bg-waxe-text text-waxe-deep',
  synced: 'border-2 border-waxe-border text-waxe-text',
  syncing: 'border-2 border-waxe-text-muted text-waxe-text-muted',
  beta: 'border-2 border-waxe-text-muted text-waxe-text-muted',
  pending: 'border-2 border-waxe-text-muted text-waxe-text-muted',
  reserved: 'bg-waxe-warm text-waxe-text',
  sold: 'bg-waxe-negative text-waxe-deep',
  accepted: 'bg-waxe-positive text-waxe-deep',
  declined: 'bg-waxe-negative text-waxe-deep',
  countered: 'bg-waxe-warm text-waxe-text',
  purchased: 'bg-waxe-positive text-waxe-deep',
  shipped: 'bg-waxe-cool text-waxe-deep',
  confirmed: 'bg-waxe-warm text-waxe-text',
  disconnected: 'bg-waxe-surface text-waxe-text-muted line-through',
  coming_soon: 'border-2 border-waxe-text-muted text-waxe-text-muted',
  draft: 'border-2 border-waxe-text-muted text-waxe-text-muted',
  listed_network: 'bg-waxe-cool text-waxe-deep',
  listed_storefront: 'bg-waxe-text text-waxe-deep',
  listed_instore: 'bg-waxe-warm text-waxe-text',
  high: 'bg-waxe-negative text-waxe-deep',
  medium: 'bg-waxe-warm text-waxe-deep',
  low: 'border-2 border-waxe-text-muted text-waxe-text-muted',
}

interface StatusBadgeProps {
  status: string
  label?: string
}

export default function StatusBadge({ status, label }: StatusBadgeProps) {
  const display = label || status.replace('_', ' ')
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 text-[9px] font-black uppercase tracking-[0.2em] rounded-none ${statusStyles[status] || statusStyles.pending}`}>
      {display}
    </span>
  )
}
