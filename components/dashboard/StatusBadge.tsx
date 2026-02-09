const statusStyles: Record<string, string> = {
  active: 'bg-[#7cb89a]/15 text-[#7cb89a] border-[#7cb89a]/25',
  connected: 'bg-[#7cb89a]/15 text-[#7cb89a] border-[#7cb89a]/25',
  live: 'bg-[#7cb89a]/15 text-[#7cb89a] border-[#7cb89a]/25',
  synced: 'bg-[#7c9ec9]/15 text-[#7c9ec9] border-[#7c9ec9]/25',
  syncing: 'bg-[#c9a87c]/15 text-[#c9a87c] border-[#c9a87c]/25',
  beta: 'bg-[#c9a87c]/15 text-[#c9a87c] border-[#c9a87c]/25',
  pending: 'bg-[#c9a87c]/15 text-[#c9a87c] border-[#c9a87c]/25',
  reserved: 'bg-[#7c9ec9]/15 text-[#7c9ec9] border-[#7c9ec9]/25',
  sold: 'bg-waxe-text-muted/15 text-waxe-text-muted border-waxe-text-muted/25',
  disconnected: 'bg-red-500/15 text-red-400 border-red-500/25',
  coming_soon: 'bg-waxe-text-muted/15 text-waxe-text-muted border-waxe-text-muted/25',
  draft: 'bg-waxe-text-muted/15 text-waxe-text-muted border-waxe-text-muted/25',
  high: 'bg-[#7cb89a]/15 text-[#7cb89a] border-[#7cb89a]/25',
  medium: 'bg-[#c9a87c]/15 text-[#c9a87c] border-[#c9a87c]/25',
  low: 'bg-waxe-text-muted/15 text-waxe-text-muted border-waxe-text-muted/25',
}

interface StatusBadgeProps {
  status: string
  label?: string
}

export default function StatusBadge({ status, label }: StatusBadgeProps) {
  const display = label || status.replace('_', ' ')
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full border capitalize ${statusStyles[status] || statusStyles.pending}`}>
      {display}
    </span>
  )
}
