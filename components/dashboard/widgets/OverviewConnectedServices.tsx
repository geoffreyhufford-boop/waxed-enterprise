'use client'

import { IntegrationCard } from '@/components/dashboard'
import { integrations } from '@/lib/dashboard-data'
import PinButton from '../PinButton'

export default function OverviewConnectedServices() {
  return (
    <div className="relative bg-waxe-card border-2 border-waxe-border rounded-none p-5 flex flex-col h-[360px]">
      <PinButton widgetId="overview-connected-services" />
      <div className="flex items-center justify-between mb-3 shrink-0">
        <h2 className="text-[11px] font-black text-waxe-text uppercase tracking-[0.1em]">Connected <span className="text-waxe-cool">{'>>'}</span> Services</h2>
        <span className="text-[10px] text-waxe-text-muted mr-11">
          {integrations.filter(i => i.status === 'connected').length}/{integrations.length}
        </span>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto space-y-1">
        {integrations.map((integration) => (
          <IntegrationCard key={integration.name} {...integration} />
        ))}
      </div>
    </div>
  )
}
