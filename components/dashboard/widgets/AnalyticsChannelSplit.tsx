'use client'

import PinButton from '../PinButton'

const channels = [
  { name: 'Discogs', pct: 43, color: '#E8E0D8' },
  { name: 'Storefront', pct: 33, color: '#7B6FA0' },
  { name: 'In-store', pct: 24, color: '#E8837C' },
]

export default function AnalyticsChannelSplit() {
  return (
    <div className="relative bg-waxe-card border border-waxe-border p-5 flex flex-col h-[360px] clip-card-bl">
      <PinButton widgetId="analytics-channel-split" />
      <div className="mb-2 shrink-0">
        <div className="flex items-center gap-2">
          <h3 className="text-[11px] font-semibold text-waxe-text">Channel → Split</h3>
          <span className="hatch-inline flex-1 mr-10" style={{ width: 'auto' }} />
        </div>
      </div>
      <div className="hatch-divider mb-3 shrink-0" />
      <div className="space-y-3">
        {channels.map((ch) => (
          <div key={ch.name} className="flex items-center gap-2">
            <div className="w-2 h-2 shrink-0" style={{ backgroundColor: ch.color }} />
            <span className="text-xs text-waxe-text flex-1">{ch.name}</span>
            <span className="text-xs text-waxe-text font-mono font-medium">{ch.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
