const statusStyles: Record<string, string> = {
  active: 'bg-waxe-positive text-waxe-deep',
  connected: 'bg-waxe-text text-waxe-deep',
  live: 'bg-waxe-text text-waxe-deep',
  synced: 'bg-waxe-surface text-waxe-text',
  syncing: 'bg-waxe-surface text-waxe-text-muted',
  beta: 'bg-waxe-surface text-waxe-text-muted',
  pending: 'bg-waxe-surface text-waxe-text-muted',
  reserved: 'bg-waxe-warm text-waxe-text',
  sold: 'bg-waxe-negative text-waxe-deep',
  accepted: 'bg-waxe-positive text-waxe-deep',
  declined: 'bg-waxe-negative text-waxe-deep',
  countered: 'bg-waxe-warm text-waxe-text',
  purchased: 'bg-waxe-positive text-waxe-deep',
  shipped: 'bg-waxe-cool text-waxe-deep',
  confirmed: 'bg-waxe-warm text-waxe-text',
  disconnected: 'bg-waxe-surface text-waxe-text-muted',
  coming_soon: 'bg-waxe-surface text-waxe-text-muted',
  draft: 'bg-waxe-surface text-waxe-text-muted',
  listed_network: 'bg-waxe-cool text-waxe-deep',
  listed_storefront: 'bg-waxe-text text-waxe-deep',
  listed_instore: 'bg-waxe-warm text-waxe-text',
  high: 'bg-waxe-negative text-waxe-deep',
  medium: 'bg-waxe-warm text-waxe-deep',
  low: 'bg-waxe-surface text-waxe-text-muted',
  pre_order: 'bg-waxe-warm text-waxe-text',
  in_stock: 'bg-waxe-positive text-waxe-deep',
  backorder: 'bg-waxe-surface text-waxe-text-muted',
  processing: 'bg-waxe-cool text-waxe-deep',
  packed: 'bg-waxe-text text-waxe-deep',
  delivered: 'bg-waxe-positive text-waxe-deep',
  unfulfilled: 'bg-waxe-warm text-waxe-text',
  label_printed: 'bg-waxe-text text-waxe-deep',
  in_transit: 'bg-waxe-cool text-waxe-deep',
  b2b: 'bg-waxe-cool text-waxe-deep',
  d2c: 'bg-waxe-surface text-waxe-text',
  // Customer tiers
  retail: 'bg-waxe-surface text-waxe-text',
  wholesale: 'bg-waxe-cool text-waxe-deep',
  vip: 'bg-waxe-warm text-waxe-text',
  // Discount types
  store_wide: 'bg-waxe-warm text-waxe-text',
  customer_tier: 'bg-waxe-cool text-waxe-deep',
  volume: 'bg-waxe-surface text-waxe-text',
  // PO statuses
  sent: 'bg-waxe-text text-waxe-deep',
  partially_received: 'bg-waxe-warm text-waxe-text',
  received: 'bg-waxe-positive text-waxe-deep',
  closed: 'bg-waxe-surface text-waxe-text-muted',
  // Audit statuses
  in_progress: 'bg-waxe-warm text-waxe-text',
  review: 'bg-waxe-cool text-waxe-deep',
  completed: 'bg-waxe-positive text-waxe-deep',
  cancelled: 'bg-waxe-surface text-waxe-text-muted',
  refunded: 'bg-waxe-negative/20 text-waxe-negative',
  // Staff statuses
  invited: 'bg-waxe-surface text-waxe-text',
  disabled: 'bg-waxe-surface text-waxe-text-muted',
  // Consignment statuses
  consigned: 'bg-waxe-cool text-waxe-deep',
  returned: 'bg-waxe-surface text-waxe-text-muted',
}

interface StatusBadgeProps {
  status: string
  label?: string
}

export default function StatusBadge({ status, label }: StatusBadgeProps) {
  const display = label || status.replaceAll('_', ' ')
  return (
    <span className={`inline-flex items-center clip-badge px-2.5 py-0.5 text-[11px] font-medium ${statusStyles[status] || 'bg-waxe-surface text-waxe-text-muted'}`}>
      {display}
    </span>
  )
}
