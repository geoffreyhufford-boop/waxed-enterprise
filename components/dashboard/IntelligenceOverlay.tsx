'use client'

import { useState, useRef, useEffect } from 'react'
import { useIntelligence } from '@/lib/intelligence-context'

function TypingIndicator() {
 return (
  <div className="flex items-center gap-1.5 py-3">
   <div className="w-1.5 h-1.5 rounded-full bg-waxe-warm/60 animate-pulse" />
   <div className="w-1.5 h-1.5 rounded-full bg-waxe-warm/60 animate-pulse [animation-delay:150ms]" />
   <div className="w-1.5 h-1.5 rounded-full bg-waxe-warm/60 animate-pulse [animation-delay:300ms]" />
  </div>
 )
}

function MockChart({ title, data }: { title: string; data: { label: string; value: number }[] }) {
 const max = Math.max(...data.map(d => d.value))
 return (
  <div className="intel-card">
   <p className="text-[11px] font-medium text-waxe-text-muted uppercase tracking-wider mb-3">{title}</p>
   <div className="flex items-end gap-1.5 h-32">
    {data.map((d, i) => (
     <div key={i} className="flex-1 flex flex-col items-center gap-1">
      <div
       className="w-full rounded-sm transition-all duration-500 ease-out"
       style={{
        height: `${(d.value / max) * 100}%`,
        background: `linear-gradient(to top, var(--color-waxe-warm), color-mix(in srgb, var(--color-waxe-warm) 60%, var(--color-waxe-cool)))`,
        opacity: 0.8 + (d.value / max) * 0.2,
       }}
      />
      <span className="text-[9px] text-waxe-text-muted truncate w-full text-center">{d.label}</span>
     </div>
    ))}
   </div>
  </div>
 )
}

function MockTable({ title, headers, rows }: { title: string; headers: string[]; rows: string[][] }) {
 return (
  <div className="intel-card">
   <p className="text-[11px] font-medium text-waxe-text-muted uppercase tracking-wider mb-3">{title}</p>
   <table className="w-full text-[12px]">
    <thead>
     <tr className="border-b border-waxe-border">
      {headers.map((h, i) => (
       <th key={i} className="text-left py-1.5 pr-3 text-waxe-text-muted font-medium">{h}</th>
      ))}
     </tr>
    </thead>
    <tbody>
     {rows.map((row, i) => (
      <tr key={i} className="border-b border-waxe-border/50">
       {row.map((cell, j) => (
        <td key={j} className="py-1.5 pr-3 text-waxe-text-secondary">{cell}</td>
       ))}
      </tr>
     ))}
    </tbody>
   </table>
  </div>
 )
}

function MockStat({ stats }: { stats: { label: string; value: string; delta?: string }[] }) {
 return (
  <div className="flex gap-4">
   {stats.map((s, i) => (
    <div key={i} className="intel-card">
     <p className="text-[10px] text-waxe-text-muted uppercase tracking-wider">{s.label}</p>
     <p className="text-lg font-semibold text-waxe-text mt-0.5" style={{ fontFamily: 'var(--font-mono)' }}>{s.value}</p>
     {s.delta && (
      <p className={`text-[11px] mt-0.5 ${s.delta.startsWith('+') ? 'text-waxe-positive' : 'text-waxe-negative'}`}>
       {s.delta}
      </p>
     )}
    </div>
   ))}
  </div>
 )
}

function MockAction({ action, details }: { action: string; details: string }) {
 const [confirmed, setConfirmed] = useState(false)
 return (
  <div className="intel-card">
   <div className="flex items-start gap-3">
    <span className="text-waxe-warm text-sm mt-0.5">{confirmed ? '\u2713' : '\u26A0'}</span>
    <div className="flex-1 min-w-0">
     <p className="text-[13px] font-medium text-waxe-text">{action}</p>
     <p className="text-[12px] text-waxe-text-muted mt-0.5">{details}</p>
     {!confirmed ? (
      <div className="flex gap-2 mt-3">
       <button
        onClick={() => setConfirmed(true)}
        className="px-3 py-1.5 text-[11px] font-medium bg-waxe-warm text-white rounded-md hover:opacity-90 transition-opacity"
       >
        Confirm
       </button>
       <button className="px-3 py-1.5 text-[11px] font-medium border border-waxe-border text-waxe-text-secondary rounded-md hover:border-waxe-border-hover transition-colors">
        Cancel
       </button>
      </div>
     ) : (
      <p className="text-[11px] text-waxe-positive mt-2">Done.</p>
     )}
    </div>
   </div>
  </div>
 )
}

interface Message {
 id: string
 role: 'user' | 'assistant'
 content: string
 widget?: 'chart' | 'table' | 'action' | 'stat'
 data?: Record<string, unknown>
}

function ResultBlock({ message }: { message: Message }) {
 if (message.role === 'user') {
  return (
   <div className="flex items-baseline gap-2">
    <span className="text-waxe-warm text-[11px] font-mono shrink-0">{'>_'}</span>
    <p className="text-[13px] text-waxe-text">{message.content}</p>
   </div>
  )
 }

 return (
  <div className="flex flex-col gap-3 pl-5">
   <p className="text-[12px] text-waxe-text-secondary">{message.content}</p>
   {message.widget === 'chart' && message.data && (
    <MockChart
     title={message.data.title as string}
     data={message.data.chartData as { label: string; value: number }[]}
    />
   )}
   {message.widget === 'table' && message.data && (
    <MockTable
     title={message.data.title as string}
     headers={message.data.headers as string[]}
     rows={message.data.rows as string[][]}
    />
   )}
   {message.widget === 'action' && message.data && (
    <MockAction
     action={message.data.action as string}
     details={message.data.details as string}
    />
   )}
   {message.widget === 'stat' && message.data && (
    <MockStat stats={message.data.stats as { label: string; value: string; delta?: string }[]} />
   )}
  </div>
 )
}

const PROMPTS = [
 'Techno sales this month',
 'Top 5 sellers this week',
 'Inactive customers 90 days',
 'Aged inventory over $500',
]

export default function IntelligenceOverlay() {
 const { active, messages, isTyping, submit, close } = useIntelligence()
 const [value, setValue] = useState('')
 const inputRef = useRef<HTMLInputElement>(null)
 const scrollRef = useRef<HTMLDivElement>(null)

 useEffect(() => {
  if (active) inputRef.current?.focus()
 }, [active])

 useEffect(() => {
  if (scrollRef.current) {
   scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }
 }, [messages, isTyping])

 if (!active) return null

 return (
  <div className="absolute inset-0 z-[5] bg-waxe-deep flex flex-col p-5 lg:p-6 overflow-hidden">
   {/* Top: input + suggestions */}
   <div className="shrink-0 max-w-2xl">
    <form
     onSubmit={(e) => {
      e.preventDefault()
      if (value.trim()) {
       submit(value)
       setValue('')
      }
     }}
     className="flex items-center gap-2.5 input-field"
    >
     <span className="text-waxe-warm text-[12px] shrink-0" style={{ fontFamily: 'var(--font-mono)' }}>{'>_'}</span>
     <input
      ref={inputRef}
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={(e) => {
       if (e.key === 'Escape') { setValue(''); close() }
      }}
      placeholder="Query inventory, sales, customers..."
      className="flex-1 min-w-0 bg-transparent text-[13px] text-waxe-text placeholder:text-waxe-text-muted outline-none"
      style={{ fontFamily: 'var(--font-mono)' }}
     />
    </form>
    <div className="flex items-center gap-1.5 mt-3">
     {PROMPTS.map((p, i) => (
      <button
       key={i}
       onClick={() => submit(p)}
       className="text-[10px] text-waxe-text-muted px-2 py-1 border border-waxe-border rounded-md hover:text-waxe-text hover:border-waxe-border-hover transition-colors"
      >
       {p}
      </button>
     ))}
    </div>
   </div>

   {/* Results */}
   <div ref={scrollRef} className="flex-1 overflow-y-auto mt-5 max-w-2xl">
    <div className="flex flex-col gap-4">
     {messages.map((msg) => (
      <ResultBlock key={msg.id} message={msg} />
     ))}
     {isTyping && <div className="pl-5"><TypingIndicator /></div>}
    </div>
   </div>
  </div>
 )
}
