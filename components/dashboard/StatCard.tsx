import type { QuickStat } from '@/lib/dashboard-data'

export default function StatCard({ label, value, trend, trendUp }: QuickStat) {
  return (
    <div className="stat-card">
      <p className="text-xs font-medium text-waxe-text-muted uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-bold text-waxe-text mt-1">{value}</p>
      {trend && (
        <p className={`text-xs mt-2 font-medium ${trendUp ? 'text-[#7cb89a]' : 'text-red-400'}`}>
          {trendUp ? '↑' : '↓'} {trend}
        </p>
      )}
    </div>
  )
}
