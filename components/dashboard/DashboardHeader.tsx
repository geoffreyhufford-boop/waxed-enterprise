interface DashboardHeaderProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
}

export default function DashboardHeader({ title, subtitle, actions }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl font-bold text-waxe-text">{title}</h1>
        {subtitle && <p className="text-sm text-waxe-text-secondary mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  )
}
