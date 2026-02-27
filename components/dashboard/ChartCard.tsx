'use client'

import { ResponsiveContainer } from 'recharts'

interface ChartCardProps {
  title: string
  subtitle?: string
  children: React.ReactElement
  className?: string
  action?: React.ReactNode
}

export default function ChartCard({ title, subtitle, children, className = '', action }: ChartCardProps) {
  return (
    <div className={`relative bg-waxe-card border-2 border-waxe-border rounded-none p-5 clip-card ${className}`}>
      {action}
      <div className="mb-3">
        <h3 className="text-xs font-bold text-waxe-text uppercase tracking-[0.08em]">{title}</h3>
        {subtitle && (
          <p className="text-[11px] text-waxe-text-muted mt-0.5">{subtitle}</p>
        )}
      </div>
      <div className="h-[240px] min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  )
}
