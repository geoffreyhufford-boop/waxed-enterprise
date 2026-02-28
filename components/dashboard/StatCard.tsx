import type { QuickStat } from '@/lib/dashboard-data'

export default function StatCard({ label, value, trend, trendUp }: QuickStat) {
  return (
    <div className="stat-card">
      <p className="text-[10px] font-medium text-waxe-text-secondary">{label}</p>
      <p className="text-xl font-semibold text-waxe-text leading-none mt-1">{value}</p>
      {trend && (
        <p className={`mt-1 text-[10px] font-medium ${trendUp ? 'text-waxe-positive' : 'text-waxe-negative'}`}>
          {trend}
        </p>
      )}
    </div>
  )
}
