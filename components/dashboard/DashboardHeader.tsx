interface DashboardHeaderProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
}

const sectionCodes: Record<string, string> = {
  'Overview': 'OVR',
  'Inventory': 'INV',
  'Restock': 'RST',
  'Analytics': 'ANL',
  'Point of Sale': 'POS',
  'Fulfillment': 'FUL',
  'Marketplace': 'MKT',
  'Network': 'NET',
  'Messages': 'MSG',
  'Storefront Builder': 'STR',
}

export default function DashboardHeader({ title, subtitle, actions }: DashboardHeaderProps) {
  const code = sectionCodes[title] || title.replace(/[aeiou\s]/gi, '').slice(0, 3).toUpperCase()

  return (
    <div className="shrink-0 bg-waxe-deep -mx-5 lg:-mx-6 px-5 lg:px-6 scanline">
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-4 border-b border-waxe-border mb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="badge-compound">
              <span className="badge-compound-label">SEC</span>
              <span className="badge-compound-code">{code}</span>
            </div>
            <span className="hatch-inline-lg hatch-inline-strong" />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-waxe-text leading-none">{title}</h1>
          {subtitle && (
            <p className="text-[11px] text-waxe-text-muted mt-2 uppercase tracking-[0.1em]">
              <span className="text-waxe-cool">{'>>'}</span> {subtitle} <span className="hatch-inline ml-2" />
            </p>
          )}
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
    </div>
  )
}
