'use client'

import { ResponsiveContainer } from 'recharts'

interface ChartCardProps {
  title: string
  subtitle?: string
  children: React.ReactElement
  className?: string
}

export default function ChartCard({ title, subtitle, children, className = '' }: ChartCardProps) {
  return (
    <div className={`bg-waxe-card backdrop-blur-md border border-waxe-border rounded-2xl p-5 ${className}`}>
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-waxe-text">{title}</h3>
        {subtitle && <p className="text-xs text-waxe-text-muted mt-0.5">{subtitle}</p>}
      </div>
      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  )
}
