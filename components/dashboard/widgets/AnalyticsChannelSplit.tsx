'use client'

import PinButton from '../PinButton'

const channels = [
  { name: 'Discogs', pct: 43, color: '#1B2632' },
  { name: 'Storefront', pct: 33, color: '#A35139' },
  { name: 'In-store', pct: 24, color: '#FFB162' },
]

export default function AnalyticsChannelSplit() {
  return (
    <div className="relative bg-waxe-card border-2 border-waxe-border rounded-none p-5 flex flex-col h-[360px]">
      <PinButton widgetId="analytics-channel-split" />
      <div className="mb-4 shrink-0">
        <h3 className="text-[11px] font-black text-waxe-text uppercase tracking-[0.1em]">Channel <span className="text-waxe-cool">{'>>'}</span> Split</h3>
      </div>
      <div className="space-y-3">
        {channels.map((ch) => (
          <div key={ch.name} className="flex items-center gap-2">
            <div className="w-2 h-2 shrink-0" style={{ backgroundColor: ch.color }} />
            <span className="text-xs text-waxe-text flex-1">{ch.name}</span>
            <span className="text-xs text-waxe-text font-mono font-bold">{ch.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
