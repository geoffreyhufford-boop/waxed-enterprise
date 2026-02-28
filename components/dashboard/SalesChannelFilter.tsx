'use client'

import { useState, useRef, useEffect } from 'react'

interface SalesChannelFilterProps {
  value: string
  onChange: (value: string) => void
}

const channels = ['All Channels', 'Discogs', 'Storefront', 'In-Store POS', 'Marketplace']

export default function SalesChannelFilter({ value, onChange }: SalesChannelFilterProps) {
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
        className={`pill ${value !== 'All Channels' ? 'pill-active' : ''} cursor-pointer hover:border-waxe-border-hover transition-colors`}
      >
        {value} <span className="ml-1 text-[11px]">▾</span>
      </button>
      {open && (
        <div className="absolute top-full mt-1 left-0 z-40 min-w-[160px] bg-waxe-surface border border-waxe-border py-1 shadow-xl clip-card">
          {channels.map((ch) => (
            <button
              key={ch}
              onClick={() => { onChange(ch); setOpen(false) }}
              className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                ch === value ? 'text-waxe-cool bg-waxe-cool/10' : 'text-waxe-text-secondary hover:text-waxe-text hover:bg-waxe-card'
              }`}
            >
              {ch}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
