// ─── Export Utilities ────────────────────────────────────────────

export interface ExportColumn {
  key: string
  header: string
}

export function exportToCSV<T extends Record<string, unknown>>(
  data: T[],
  filename: string,
  columns: ExportColumn[]
) {
  const header = columns.map((c) => c.header).join(',')
  const rows = data.map((row) =>
    columns
      .map((c) => {
        const val = row[c.key]
        const str = val === null || val === undefined ? '' : String(val)
        return str.includes(',') || str.includes('"') || str.includes('\n')
          ? `"${str.replace(/"/g, '""')}"`
          : str
      })
      .join(',')
  )
  const csv = [header, ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

export function exportToPDF(elementId: string) {
  const el = document.getElementById(elementId)
  if (!el) return
  el.classList.add('print-target')
  window.print()
  el.classList.remove('print-target')
}
