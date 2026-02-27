import type { QuickStat } from '@/lib/dashboard-data'

export default function StatCard({ label, value, trend, trendUp }: QuickStat) {
  return (
    <div className="stat-card">
      <p className="text-[10px] font-bold text-waxe-text-muted uppercase tracking-[0.1em]">{label}</p>
      <p className="text-xl font-black text-waxe-text tracking-tight leading-none mt-1">{value}</p>
      {trend && (
        <p className={`mt-1 text-[10px] font-bold ${trendUp ? 'text-waxe-positive' : 'text-waxe-negative'}`}>
          {trend}
        </p>
      )}
    </div>
  )
}
