'use client'

import PinButton from '../PinButton'

const channelBreakdown = [
  { channel: 'Online (Storefront)', revenue: 6240, percentage: 44, color: '#D8D0C4' },
  { channel: 'In-Store (POS)', revenue: 4980, percentage: 35, color: '#546878' },
  { channel: 'Discogs', revenue: 2150, percentage: 15, color: '#A35139' },
  { channel: 'Other', revenue: 860, percentage: 6, color: '#E89A40' },
]

export default function OverviewChannelBreakdown() {
  return (
    <div className="relative bg-waxe-card border-2 border-waxe-border rounded-none p-5 flex flex-col h-[360px] clip-card-bl">
      <PinButton widgetId="overview-channel-breakdown" />
      <div className="mb-2 shrink-0">
        <div className="flex items-center gap-2">
          <h2 className="text-[11px] font-black text-waxe-text uppercase tracking-[0.1em]">Sales <span className="text-waxe-cool">{'>>'}</span> By Channel</h2>
          <span className="hatch-inline flex-1 mr-10" style={{ width: 'auto' }} />
        </div>
      </div>
      <div className="hatch-divider mb-3 shrink-0" />
      <div className="flex-1 min-h-0 overflow-y-auto space-y-4">
        {channelBreakdown.map((ch) => (
          <div key={ch.channel}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm text-waxe-text">{ch.channel}</span>
              <span className="text-sm font-medium text-waxe-text">${ch.revenue.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-waxe-surface rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${ch.percentage}%`, background: ch.color }} />
              </div>
              <span className="text-xs text-waxe-text-muted w-8 text-right">{ch.percentage}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
