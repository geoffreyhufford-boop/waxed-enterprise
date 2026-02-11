interface DashboardHeaderProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
}

export default function DashboardHeader({ title, subtitle, actions }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-6 border-b-2 border-waxe-border">
      <div>
        <h1 className="text-4xl font-black uppercase tracking-tight text-waxe-text leading-none">{title}</h1>
        {subtitle && (
          <p className="text-[10px] text-waxe-text-muted mt-2 uppercase tracking-[0.1em]">
            <span className="text-waxe-cool">{'>>'}</span> {subtitle}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  )
}
