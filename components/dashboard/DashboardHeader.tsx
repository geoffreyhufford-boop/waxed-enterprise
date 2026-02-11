interface DashboardHeaderProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
}

export default function DashboardHeader({ title, subtitle, actions }: DashboardHeaderProps) {
  return (
    <div className="shrink-0 bg-waxe-deep -mx-5 lg:-mx-6 px-5 lg:px-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-4 border-b-2 border-waxe-border mb-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-waxe-text leading-none">{title}</h1>
          {subtitle && (
            <p className="text-[10px] text-waxe-text-muted mt-2 uppercase tracking-[0.1em]">
              <span className="text-waxe-cool">{'>>'}</span> {subtitle}
            </p>
          )}
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
    </div>
  )
}
