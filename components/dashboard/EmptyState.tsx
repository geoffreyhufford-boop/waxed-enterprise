interface EmptyStateProps {
  icon?: string
  title: string
  description: string
  action?: React.ReactNode
}

export default function EmptyState({ icon = '◇', title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center corner-marks">
      <div className="glyph-box mb-4" style={{ width: '48px', height: '48px', fontSize: '24px', opacity: 0.4 }}>{icon}</div>
      <div className="hatch-divider mb-4" style={{ width: '80px' }} />
      <h3 className="text-lg font-black text-waxe-text mb-1 uppercase tracking-tight">{title}</h3>
      <p className="text-sm text-waxe-text-muted max-w-sm mb-2">{description}</p>
      <div className="hatch-inline mb-2" />
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
