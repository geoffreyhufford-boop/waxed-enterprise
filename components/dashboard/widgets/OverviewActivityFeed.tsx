'use client'

import PinButton from '../PinButton'

const activityFeed = [
  { time: '2:34 PM', event: 'POS sale recorded', detail: 'Aphex Twin — SAW 85-92 — $85.00' },
  { time: '2:15 PM', event: 'New message', detail: 'Sarah Mitchell asked about SAW 85-92' },
  { time: '2:12 PM', event: 'POS sale recorded', detail: '2 records — $103.00' },
  { time: '1:48 PM', event: 'Inventory synced', detail: 'Discogs — 2,847 listings verified' },
  { time: '1:42 PM', event: 'Record reserved', detail: "Drexciya — Neptune's Lair reserved for James R." },
  { time: '12:30 PM', event: 'Price suggestion', detail: 'Robert Hood — Minimal Nation: suggested $200 (+$20)' },
]

export default function OverviewActivityFeed() {
  return (
    <div className="relative bg-waxe-card border-2 border-waxe-border rounded-none p-5 flex flex-col h-[360px]">
      <PinButton widgetId="overview-activity-feed" />
      <div className="mb-3 shrink-0">
        <h2 className="text-[11px] font-black text-waxe-text uppercase tracking-[0.1em]">Recent <span className="text-waxe-cool">{'>>'}</span> Activity</h2>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto space-y-2">
        {activityFeed.map((item, i) => (
          <div key={i} className="flex items-start gap-3 py-1.5">
            <span className="text-[10px] text-waxe-text-muted w-14 shrink-0 pt-0.5">{item.time}</span>
            <div className="min-w-0">
              <p className="text-xs text-waxe-text">{item.event}</p>
              <p className="text-[10px] text-waxe-text-muted truncate">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
