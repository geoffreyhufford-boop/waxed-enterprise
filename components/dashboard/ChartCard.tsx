'use client'

import { ResponsiveContainer } from 'recharts'

interface ChartCardProps {
  title: string
  subtitle?: string
  children: React.ReactElement
  className?: string
  action?: React.ReactNode
}

const chartCodes: Record<string, string> = {
  'Revenue': 'REV',
  'Sales Velocity': 'VEL',
  'Genre Breakdown': 'GNR',
  'Margin Trend': 'MRG',
  'Price vs Market': 'PVM',
  'Days on Shelf': 'DOS',
  'Revenue by Genre': 'RBG',
  'Revenue by Channel': 'RBC',
  'Channel Split': 'CHS',
  'Condition': 'CND',
}

export default function ChartCard({ title, subtitle, children, className = '', action }: ChartCardProps) {
  const code = chartCodes[title] || title.replace(/[aeiou\s]/gi, '').slice(0, 3).toUpperCase()

  return (
    <div className={`relative bg-waxe-card border-2 border-waxe-border rounded-none p-5 clip-card-bl corner-marks ${className}`}>
      {action}
      <div className="mb-2 flex items-center gap-2">
        <div className="badge-compound" style={{ transform: 'scale(0.85)', transformOrigin: 'left center' }}>
          <span className="badge-compound-label">VIZ</span>
          <span className="badge-compound-code">{code}</span>
        </div>
        <span className="hatch-inline-lg hatch-inline-strong flex-1" style={{ width: 'auto' }} />
      </div>
      <div className="mb-3 flex items-baseline gap-2">
        <h3 className="text-[11px] font-black text-waxe-text uppercase tracking-[0.1em]">{title}</h3>
        {subtitle && (
          <>
            <span className="text-[11px] text-waxe-cool font-bold">{'>>'}</span>
            <p className="text-[11px] text-waxe-text-muted uppercase tracking-[0.1em]">{subtitle}</p>
          </>
        )}
      </div>
      <div className="hatch-divider-strong mb-3" />
      <div className="h-[240px] min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  )
}
