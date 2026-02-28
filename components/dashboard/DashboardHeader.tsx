interface DashboardHeaderProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
}

export default function DashboardHeader({ title, subtitle, actions }: DashboardHeaderProps) {
  return (
    <div className="shrink-0 -mx-5 lg:-mx-6 px-5 lg:px-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-5 border-b border-waxe-border mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-waxe-text leading-none">{title}</h1>
          {subtitle && (
            <p className="text-xs text-waxe-text-secondary mt-1.5">{subtitle}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
    </div>
  )
}
