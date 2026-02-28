'use client'

import { useState, useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts'
import { channelFeeStructures } from '@/lib/dashboard-data'
import { useTheme } from '@/lib/theme-context'
import { getChartPalette } from '@/lib/chart-theme'
import PinButton from '../PinButton'

export default function OverviewMarginCalculator() {
  const { theme } = useTheme()
  const c = getChartPalette(theme)

  const [salePrice, setSalePrice] = useState(45)
  const [shipping, setShipping] = useState(5)

  const channelColors: Record<string, string> = {
    'Discogs': c.channels.discogs,
    'Shopify': c.channels.storefront,
    'In-Store POS': c.channels.pos,
    'WAXED': c.channels.waxed,
  }

  const channelData = useMemo(() => {
    return channelFeeStructures.map((ch) => {
      const saleFee = salePrice * (ch.platformFeePct / 100)
      const shipFee = shipping * (ch.shippingFeePct / 100)
      const totalFee = saleFee + shipFee + ch.fixedFee
      const netProfit = salePrice + shipping - totalFee
      const marginPct = ((netProfit / (salePrice + shipping)) * 100)
      return {
        channel: ch.channel,
        netProfit: Math.round(netProfit * 100) / 100,
        totalFee: Math.round(totalFee * 100) / 100,
        marginPct: Math.round(marginPct * 10) / 10,
        feePct: Math.round((ch.platformFeePct + ch.shippingFeePct) * 10) / 10,
        color: channelColors[ch.channel] || ch.color,
        description: ch.description,
      }
    })
  }, [salePrice, shipping, channelColors])

  return (
    <div className="relative bg-waxe-card border border-waxe-border p-5 flex flex-col h-[360px] clip-card-bl">
      <PinButton widgetId="overview-margin-calculator" />
      <div className="flex items-center justify-between mb-2 shrink-0">
        <div className="flex items-center gap-2">
          <h2 className="text-[11px] font-semibold text-waxe-text">Fee Comparison</h2>
          <span className="text-[11px] text-waxe-cool font-medium">→</span>
          <p className="text-[11px] text-waxe-text-muted">By Channel</p>
          <span className="hatch-inline ml-1" />
        </div>
        <div className="flex items-center gap-3 mr-11">
          <div className="flex items-center gap-1.5">
            <label className="text-[10px] text-waxe-text-muted">Sale $</label>
            <input
              type="number"
              value={salePrice}
              onChange={(e) => setSalePrice(Number(e.target.value) || 0)}
              className="w-14 bg-waxe-surface border border-waxe-border text-xs text-waxe-text text-center py-0.5 font-mono"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <label className="text-[10px] text-waxe-text-muted">Ship $</label>
            <input
              type="number"
              value={shipping}
              onChange={(e) => setShipping(Number(e.target.value) || 0)}
              className="w-14 bg-waxe-surface border border-waxe-border text-xs text-waxe-text text-center py-0.5 font-mono"
            />
          </div>
        </div>
      </div>
      <div className="hatch-divider-strong mb-3 shrink-0" />
      <div className="flex-1 min-h-0 flex gap-4">
        {/* Chart — left ~55% */}
        <div className="w-[55%] min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={channelData} layout="vertical" margin={{ left: 10, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={c.grid} horizontal={false} />
              <XAxis type="number" tick={{ fill: c.axisLabel, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
              <YAxis type="category" dataKey="channel" tick={{ fill: c.axisLabel, fontSize: 10 }} axisLine={false} tickLine={false} width={70} />
              <Tooltip {...c.tooltip} formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Net Profit']} />
              <Bar dataKey="netProfit" radius={[0, 2, 2, 0]} barSize={14} name="Net Profit">
                {channelData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Table — right ~45% */}
        <div className="w-[45%] overflow-y-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="text-waxe-text-muted">
                <th className="text-left pb-2 font-medium">Channel</th>
                <th className="text-right pb-2 font-medium">Fee %</th>
                <th className="text-right pb-2 font-medium">Net</th>
                <th className="text-right pb-2 font-medium">Margin</th>
              </tr>
            </thead>
            <tbody>
              {channelData.map((ch) => (
                <tr
                  key={ch.channel}
                  className={ch.channel === 'WAXED' ? 'bg-waxe-positive/10 border-l border-waxe-positive' : ''}
                >
                  <td className="py-1.5 pl-1 text-waxe-text font-medium">{ch.channel}</td>
                  <td className="py-1.5 text-right text-waxe-text-muted font-mono">{ch.feePct > 0 ? `${ch.feePct}%` : '—'}</td>
                  <td className="py-1.5 text-right text-waxe-text font-mono font-medium">${ch.netProfit.toFixed(2)}</td>
                  <td className="py-1.5 pr-1 text-right text-waxe-text-muted font-mono">{ch.marginPct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
