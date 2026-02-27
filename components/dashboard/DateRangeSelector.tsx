'use client'

import { useState, useRef, useEffect } from 'react'

interface DateRangeSelectorProps {
  presets: string[]
  value: string
  onChange: (value: string) => void
  showComparison?: boolean
}

export default function DateRangeSelector({ presets, value, onChange, showComparison }: DateRangeSelectorProps) {
  const [open, setOpen] = useState(false)
  const [compare, setCompare] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="btn-secondary text-sm px-4 py-2 flex items-center gap-1.5"
      >
        {value} <span className="text-[11px]">▾</span>
      </button>
      {open && (
        <div className="absolute top-full mt-1 right-0 z-40 min-w-[180px] bg-waxe-surface border border-waxe-border rounded-none py-1 shadow-xl clip-card">
          {presets.map((preset) => (
            <button
              key={preset}
              onClick={() => { onChange(preset); setOpen(false) }}
              className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                preset === value ? 'text-waxe-cool bg-waxe-cool/10' : 'text-waxe-text-secondary hover:text-waxe-text hover:bg-waxe-card'
              }`}
            >
              {preset}
            </button>
          ))}
          {showComparison && (
            <>
              <div className="border-t border-waxe-border my-1" />
              <label className="flex items-center gap-2 px-4 py-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={compare}
                  onChange={(e) => setCompare(e.target.checked)}
                  className="accent-waxe-text w-3.5 h-3.5"
                />
                <span className="text-xs text-waxe-text-secondary">Compare to previous</span>
              </label>
            </>
          )}
        </div>
      )}
    </div>
  )
}
