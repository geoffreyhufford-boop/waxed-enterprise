'use client'

import { usePinnedWidgets } from '@/lib/use-pinned-widgets'

interface PinButtonProps {
  widgetId: string
}

export default function PinButton({ widgetId }: PinButtonProps) {
  const { isPinned, togglePin } = usePinnedWidgets()
  const pinned = isPinned(widgetId)

  return (
    <button
      onClick={() => togglePin(widgetId)}
      className={`absolute top-0 right-0 z-10 w-9 h-9 grid place-items-center border-l-2 border-b-2 hover:opacity-70 ${
        pinned
          ? 'border-waxe-warm bg-waxe-warm/10'
          : 'border-waxe-border bg-waxe-card hover:border-waxe-text-muted'
      }`}
      title={pinned ? 'Unpin from Overview' : 'Pin to Overview'}
      aria-label={pinned ? 'Unpin from Overview' : 'Pin to Overview'}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill={pinned ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinejoin="round" className={pinned ? 'text-waxe-warm' : 'text-waxe-text-muted'}>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    </button>
  )
}
