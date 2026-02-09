'use client'

import { useState, useRef, useEffect } from 'react'

interface FilterDropdownProps {
  label: string
  options: string[]
  value: string
  onChange: (value: string) => void
}

export default function FilterDropdown({ label, options, value, onChange }: FilterDropdownProps) {
  const [open, setOpen] = useState(false)
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
        className={`pill ${value !== 'All' ? 'pill-active' : ''} cursor-pointer hover:border-waxe-border-hover transition-colors`}
      >
        {label}: {value} <span className="ml-1 text-[10px]">▾</span>
      </button>
      {open && (
        <div className="absolute top-full mt-1 left-0 z-40 min-w-[140px] bg-waxe-surface border border-waxe-border rounded-xl py-1 shadow-xl">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false) }}
              className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                opt === value ? 'text-waxe-warm bg-waxe-warm/10' : 'text-waxe-text-secondary hover:text-waxe-text hover:bg-waxe-card'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
