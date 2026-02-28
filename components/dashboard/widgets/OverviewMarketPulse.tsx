'use client'

import { competitorPainPoints, competitorMentions } from '@/lib/dashboard-data'
import PinButton from '../PinButton'

const sentimentColor: Record<string, string> = {
  negative: 'border-waxe-negative text-waxe-negative',
  mixed: 'border-waxe-warm text-waxe-warm',
  neutral: 'border-waxe-text-muted text-waxe-text-muted',
  positive: 'border-waxe-positive text-waxe-positive',
}

function severityColor(score: number): string {
  if (score > 8) return 'bg-waxe-negative text-waxe-deep'
  if (score > 7) return 'bg-waxe-warm text-waxe-deep'
  return 'bg-waxe-surface text-waxe-text-muted'
}

function severityBarColor(score: number): string {
  if (score > 8) return 'bg-waxe-negative'
  if (score > 7) return 'bg-waxe-warm'
  return 'bg-waxe-text-muted'
}

export default function OverviewMarketPulse() {
  return (
    <div className="relative bg-waxe-card border border-waxe-border p-5 flex flex-col h-[360px] clip-card-bl">
      <PinButton widgetId="overview-market-pulse" />
      <div className="mb-2 shrink-0">
        <div className="flex items-center gap-2">
          <h2 className="text-[11px] font-semibold text-waxe-text">Market Pulse → Competitor Intel</h2>
          <span className="hatch-inline flex-1 mr-10" style={{ width: 'auto' }} />
        </div>
        <p className="text-[10px] text-waxe-text-muted mt-1">802 user comments analyzed</p>
      </div>
      <div className="hatch-divider mb-3 shrink-0" />

      {/* Scrollable pain points */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-2.5">
        {competitorPainPoints.map((point) => (
          <div key={point.category} className="py-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-waxe-text font-medium">{point.category}</span>
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 ${severityColor(point.severityScore)}`}>
                {point.severityScore}
              </span>
            </div>
            <div className="h-1.5 bg-waxe-surface overflow-hidden mb-1">
              <div className={`h-full ${severityBarColor(point.severityScore)}`} style={{ width: `${(point.severityScore / 10) * 100}%` }} />
            </div>
            <p className="text-[10px] text-waxe-text-muted italic leading-snug truncate">{point.sampleQuote}</p>
          </div>
        ))}
      </div>

      {/* Competitor mention pills */}
      <div className="shrink-0 mt-3 pt-3 border-t border-waxe-border/30 flex items-center gap-2 flex-wrap">
        {competitorMentions.map((m) => (
          <span
            key={m.platform}
            className={`text-[10px] font-medium px-2 py-0.5 border ${sentimentColor[m.sentiment]}`}
          >
            {m.platform} ({m.mentionCount})
          </span>
        ))}
      </div>
    </div>
  )
}
