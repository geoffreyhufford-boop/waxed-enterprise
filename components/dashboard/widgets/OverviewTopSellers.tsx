'use client'

import PinButton from '../PinButton'
import { useDashboardFilters } from '@/lib/dashboard-filter-context'

const topSellers = [
  { artist: 'Aphex Twin', title: 'Selected Ambient Works 85-92', sold: 14, revenue: 1190, genre: 'Ambient', artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/5f/b3/e0/5fb3e08d-c2cd-3da4-6ad7-c5dc61803683/cover.jpg/300x300bb.jpg' },
  { artist: 'Daft Punk', title: 'Homework', sold: 11, revenue: 605, genre: 'House', artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/dc/68/45/dc684589-af57-6895-1177-4f2acbb93e47/190296240911.jpg/300x300bb.jpg' },
  { artist: 'Burial', title: 'Untrue', sold: 9, revenue: 432, genre: 'Techno', artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/9d/0f/1c/9d0f1c2b-2fae-d8ac-3920-ce9ec5bc85b5/7982.jpg/300x300bb.jpg' },
  { artist: 'Drexciya', title: "Neptune's Lair", sold: 7, revenue: 980, genre: 'Electro', artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/95/a4/3f/95a43f9d-4eb9-e5a9-ee64-910d3fb95e6c/3663729188892_3000.jpg/300x300bb.jpg' },
  { artist: 'Boards of Canada', title: 'Music Has the Right to Children', sold: 6, revenue: 390, genre: 'Ambient', artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Features125/v4/b5/4c/c2/b54cc20d-03f5-f2c4-4a0d-9b51ad65af89/dj.txuslqgv.jpg/300x300bb.jpg' },
]

export default function OverviewTopSellers() {
  const { dateRange } = useDashboardFilters()
  return (
    <div className="relative bg-waxe-card border border-waxe-border p-5 flex flex-col h-[360px] clip-card-bl">
      <PinButton widgetId="overview-top-sellers" />
      <div className="flex items-center justify-between mb-2 shrink-0">
        <div className="flex items-center gap-2">
          <h2 className="text-[11px] font-semibold text-waxe-text">Top Sellers → {dateRange}</h2>
          <span className="hatch-inline" />
        </div>
        <span className="text-[11px] text-waxe-text-muted mr-11">by units sold</span>
      </div>
      <div className="hatch-divider mb-3 shrink-0" />
      <div className="flex-1 min-h-0 overflow-y-auto space-y-1">
        {topSellers.map((record, i) => (
          <div key={i} className="flex items-center gap-3 py-2 px-3 hover:bg-waxe-surface/30">
            <span className="text-xs font-bold text-waxe-text-muted w-5 text-center shrink-0">{i + 1}</span>
            <div className="w-9 h-9 bg-waxe-surface overflow-hidden shrink-0">
              <img src={record.artwork} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-waxe-text truncate">{record.artist} — {record.title}</p>
              <p className="text-xs text-waxe-text-muted">{record.genre}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-medium text-waxe-text">${record.revenue.toLocaleString()}</p>
              <p className="text-xs text-waxe-text-muted">{record.sold} sold</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
