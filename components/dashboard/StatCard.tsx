import type { QuickStat } from '@/lib/dashboard-data'

export default function StatCard({ label, value, trend, trendUp }: QuickStat) {
  return (
    <div className="stat-card">
      <p className="text-[9px] font-bold text-waxe-text-muted uppercase tracking-[0.15em] mb-3">{label}</p>
      <p className="text-3xl font-black text-waxe-text tracking-tight leading-none">{value}</p>
      {trend && (
        <p className={`text-[10px] mt-3 font-bold uppercase tracking-[0.1em] ${trendUp ? 'text-waxe-positive' : 'text-waxe-negative'}`}>
          {trendUp ? '>> ' : '   '}{trend}
        </p>
      )}
    </div>
  )
}
