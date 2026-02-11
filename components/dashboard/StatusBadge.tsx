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
  disconnected: 'bg-waxe-surface text-waxe-text-muted line-through',
  coming_soon: 'border-2 border-waxe-text-muted text-waxe-text-muted',
  draft: 'border-2 border-waxe-text-muted text-waxe-text-muted',
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
