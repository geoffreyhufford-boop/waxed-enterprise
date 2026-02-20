import type { QuickStat } from '@/lib/dashboard-data'

const statCodes: Record<string, string> = {
  'Total Records': 'REC',
  'Revenue (30d)': 'REV',
  'Avg Price': 'AVG',
  'Dead Stock': 'DSK',
  'Today\'s Revenue': 'TDY',
  'Transactions': 'TXN',
  'Avg Sale': 'AVS',
  'Returns': 'RTN',
}

export default function StatCard({ label, value, trend, trendUp }: QuickStat) {
  const code = statCodes[label] || label.replace(/[aeiou\s()]/gi, '').slice(0, 3).toUpperCase()

  return (
    <div className="stat-card">
      <div className="flex items-center gap-1.5 mb-0.5">
        <div className="badge-compound" style={{ transform: 'scale(0.75)', transformOrigin: 'left center' }}>
          <span className="badge-compound-label">DAT</span>
          <span className="badge-compound-code">{code}</span>
        </div>
        <span className="hatch-inline flex-1" style={{ width: 'auto', height: '4px' }} />
      </div>
      <p className="designation-tag text-[8px]">{label}</p>
      <p className="text-xl font-black text-waxe-text tracking-tight leading-none mt-1">{value}</p>
      {trend && (
        <p className={`mt-1 text-[10px] font-bold uppercase tracking-[0.1em] ${trendUp ? 'text-waxe-positive' : 'text-waxe-negative'}`}>
          <span className="inline-block text-[8px] mr-0.5" style={{ verticalAlign: '1px' }}>{trendUp ? '▲' : '▼'}</span>{trend}
        </p>
      )}
    </div>
  )
}
