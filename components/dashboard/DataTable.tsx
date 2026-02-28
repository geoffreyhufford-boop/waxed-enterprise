interface DataTableProps {
  headers: string[]
  children: React.ReactNode
  maxHeight?: string
}

export default function DataTable({ headers, children, maxHeight }: DataTableProps) {
  return (
    <div className="rounded-xl overflow-x-auto bg-waxe-card/60 backdrop-blur-sm" style={maxHeight ? { maxHeight, overflowY: 'auto' } : undefined}>
      <table className="w-full text-sm">
        <thead className={maxHeight ? 'sticky top-0 z-10' : ''}>
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="table-header">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-waxe-border/30">
          {children}
        </tbody>
      </table>
    </div>
  )
}
