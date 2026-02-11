interface DataTableProps {
  headers: string[]
  children: React.ReactNode
}

export default function DataTable({ headers, children }: DataTableProps) {
  return (
    <div className="overflow-x-auto rounded-none border-2 border-waxe-border">
      <table className="w-full text-sm">
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="table-header">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-black/10">
          {children}
        </tbody>
      </table>
    </div>
  )
}
