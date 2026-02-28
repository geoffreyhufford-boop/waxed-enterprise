'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { velocityData } from '@/lib/dashboard-data'
import PinButton from '../PinButton'

const chartTooltipStyle = {
  contentStyle: { background: '#141020', border: '1px solid #2D2540', borderRadius: '12px', fontSize: '10px', fontFamily: 'var(--font-mono)' },
  labelStyle: { color: '#5A4D70', fontWeight: 500, fontSize: '9px' },
  itemStyle: { color: '#E8E0D8', fontFamily: 'var(--font-mono)' },
}

export default function AnalyticsVelocity() {
  return (
    <div className="relative bg-waxe-card border border-waxe-border p-5 flex flex-col h-[360px] clip-card-bl">
      <PinButton widgetId="analytics-velocity" />
      <div className="mb-2 flex items-center gap-2">
        <h3 className="text-[11px] font-semibold text-waxe-text">Inventory Velocity</h3>
        <span className="text-[11px] text-waxe-cool font-medium">→</span>
        <p className="text-[11px] text-waxe-text-muted">Items sold vs. added per week</p>
        <span className="hatch-inline flex-1 mr-10" style={{ width: 'auto' }} />
      </div>
      <div className="hatch-divider mb-3" />
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={velocityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(238,233,223,0.08)" />
            <XAxis dataKey="week" tick={{ fill: '#5A4D70', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#5A4D70', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip {...chartTooltipStyle} />
            <Bar dataKey="sold" fill="#E8837C" radius={[2, 2, 0, 0]} name="Sold" />
            <Bar dataKey="added" fill="#2D2540" radius={[2, 2, 0, 0]} name="Added" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
