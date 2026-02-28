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
    <div className={`relative p-5 card ${className}`}>
      {action}
      <div className="mb-3">
        <h3 className="text-xs font-medium text-waxe-text">{title}</h3>
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
