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
    <div className={`relative bg-waxe-card border-2 border-waxe-border rounded-none p-5 ${className}`}>
      {action}
      <div className="mb-4 flex items-baseline gap-2">
        <h3 className="text-[11px] font-black text-waxe-text uppercase tracking-[0.1em]">{title}</h3>
        {subtitle && (
          <>
            <span className="text-[10px] text-waxe-cool font-bold">{'>>'}</span>
            <p className="text-[10px] text-waxe-text-muted uppercase tracking-[0.1em]">{subtitle}</p>
          </>
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
