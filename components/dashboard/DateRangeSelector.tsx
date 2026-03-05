'use client'

import { useState, useRef, useEffect, useMemo } from 'react'

interface DateRangeSelectorProps {
  presets: string[]
  value: string
  onChange: (value: string) => void
  showComparison?: boolean
}

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function isInRange(day: Date, start: Date | null, end: Date | null) {
  if (!start || !end) return false
  return day >= start && day <= end
}

function formatDate(d: Date) {
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
}

function formatShortRange(start: Date, end: Date) {
  if (start.getFullYear() === end.getFullYear() && start.getMonth() === end.getMonth()) {
    return `${MONTHS[start.getMonth()]} ${start.getDate()}\u2013${end.getDate()}, ${start.getFullYear()}`
  }
  if (start.getFullYear() === end.getFullYear()) {
    return `${MONTHS[start.getMonth()]} ${start.getDate()} \u2013 ${MONTHS[end.getMonth()]} ${end.getDate()}, ${start.getFullYear()}`
  }
  return `${formatDate(start)} \u2013 ${formatDate(end)}`
}

const COMPARE_OPTIONS = [
  { label: 'Previous period', value: 'previous_period' },
  { label: 'Same period last year', value: 'previous_year' },
]

function MiniCalendar({
  year, month, rangeStart, rangeEnd, hoverDate, selecting,
  onSelect, onHover, onMonthChange,
}: {
  year: number
  month: number
  rangeStart: Date | null
  rangeEnd: Date | null
  hoverDate: Date | null
  selecting: boolean
  onSelect: (d: Date) => void
  onHover: (d: Date | null) => void
  onMonthChange: (y: number, m: number) => void
}) {
  const daysInMonth = getDaysInMonth(year, month)
  const firstDayOfWeek = new Date(year, month, 1).getDay()
  const today = new Date()

  const effectiveEnd = selecting && hoverDate ? hoverDate : rangeEnd

  const cells = useMemo(() => {
    const result: (Date | null)[] = []
    for (let i = 0; i < firstDayOfWeek; i++) result.push(null)
    for (let d = 1; d <= daysInMonth; d++) result.push(new Date(year, month, d))
    return result
  }, [year, month, daysInMonth, firstDayOfWeek])

  return (
    <div className="w-[220px]">
      <div className="flex items-center justify-between mb-2">
        <button onClick={() => onMonthChange(month === 0 ? year - 1 : year, month === 0 ? 11 : month - 1)} className="w-6 h-6 flex items-center justify-center text-waxe-text-muted hover:text-waxe-text text-xs">&lsaquo;</button>
        <span className="text-xs font-medium text-waxe-text">{MONTHS[month]} {year}</span>
        <button onClick={() => onMonthChange(month === 11 ? year + 1 : year, month === 11 ? 0 : month + 1)} className="w-6 h-6 flex items-center justify-center text-waxe-text-muted hover:text-waxe-text text-xs">&rsaquo;</button>
      </div>
      <div className="grid grid-cols-7 gap-0">
        {DAYS.map(d => (
          <div key={d} className="text-center text-[9px] text-waxe-text-muted font-medium py-1">{d}</div>
        ))}
        {cells.map((date, i) => {
          if (!date) return <div key={`empty-${i}`} />
          const isStart = rangeStart && isSameDay(date, rangeStart)
          const isEnd = effectiveEnd && isSameDay(date, effectiveEnd)
          const inRange = isInRange(date, rangeStart, effectiveEnd)
          const isToday = isSameDay(date, today)
          const isFuture = date > today

          return (
            <button
              key={date.getTime()}
              onClick={() => !isFuture && onSelect(date)}
              onMouseEnter={() => !isFuture && onHover(date)}
              onMouseLeave={() => onHover(null)}
              disabled={isFuture}
              className={`
                h-7 text-[11px] font-mono relative transition-colors
                ${isFuture ? 'text-waxe-text-muted/30 cursor-not-allowed' : 'cursor-pointer'}
                ${isStart || isEnd ? 'bg-waxe-cool text-white font-semibold z-10' : ''}
                ${!isStart && !isEnd && inRange ? 'bg-waxe-cool/15 text-waxe-text' : ''}
                ${!isStart && !isEnd && !inRange && !isFuture ? 'text-waxe-text-secondary hover:bg-waxe-surface' : ''}
                ${isToday && !isStart && !isEnd ? 'font-bold text-waxe-warm' : ''}
              `}
            >
              {date.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function DateRangeSelector({ presets, value, onChange, showComparison }: DateRangeSelectorProps) {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<'presets' | 'custom'>('presets')
  const [compare, setCompare] = useState(false)
  const [compareType, setCompareType] = useState('previous_period')
  const ref = useRef<HTMLDivElement>(null)

  const now = new Date()
  const [leftYear, setLeftYear] = useState(now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear())
  const [leftMonth, setLeftMonth] = useState(now.getMonth() === 0 ? 11 : now.getMonth() - 1)

  const rightYear = leftMonth === 11 ? leftYear + 1 : leftYear
  const rightMonth = leftMonth === 11 ? 0 : leftMonth + 1

  const [rangeStart, setRangeStart] = useState<Date | null>(null)
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null)
  const [hoverDate, setHoverDate] = useState<Date | null>(null)
  const [selecting, setSelecting] = useState(false)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleDaySelect = (d: Date) => {
    if (!selecting || !rangeStart) {
      setRangeStart(d)
      setRangeEnd(null)
      setSelecting(true)
    } else {
      if (d < rangeStart) {
        setRangeEnd(rangeStart)
        setRangeStart(d)
      } else {
        setRangeEnd(d)
      }
      setSelecting(false)
    }
  }

  const handleApply = () => {
    if (rangeStart && rangeEnd) {
      const label = formatShortRange(rangeStart, rangeEnd)
      onChange(label)
      setOpen(false)
    }
  }

  const handleLeftMonthChange = (y: number, m: number) => {
    setLeftYear(y)
    setLeftMonth(m)
  }

  const handleRightMonthChange = (y: number, m: number) => {
    if (m === 0) {
      setLeftYear(y - 1)
      setLeftMonth(11)
    } else {
      setLeftYear(y)
      setLeftMonth(m - 1)
    }
  }

  const isCustom = mode === 'custom'

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="btn-secondary text-sm px-4 py-2 flex items-center gap-1.5"
      >
        {value} <span className="text-[11px]">{'\u25BE'}</span>
      </button>
      {open && (
        <div className="absolute top-full mt-1 right-0 z-40 bg-waxe-surface border border-waxe-border shadow-xl clip-card">
          {/* Tab toggle */}
          <div className="flex border-b border-waxe-border">
            <button
              onClick={() => setMode('presets')}
              className={`flex-1 px-4 py-2 text-[11px] font-medium transition-colors ${!isCustom ? 'text-waxe-cool bg-waxe-cool/10' : 'text-waxe-text-muted hover:text-waxe-text'}`}
            >
              Presets
            </button>
            <button
              onClick={() => setMode('custom')}
              className={`flex-1 px-4 py-2 text-[11px] font-medium transition-colors ${isCustom ? 'text-waxe-cool bg-waxe-cool/10' : 'text-waxe-text-muted hover:text-waxe-text'}`}
            >
              Custom
            </button>
          </div>

          {!isCustom ? (
            <div className="py-1 min-w-[180px]">
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
          ) : (
            <div className="p-4">
              {/* Two-month calendar */}
              <div className="flex gap-4">
                <MiniCalendar
                  year={leftYear}
                  month={leftMonth}
                  rangeStart={rangeStart}
                  rangeEnd={rangeEnd}
                  hoverDate={hoverDate}
                  selecting={selecting}
                  onSelect={handleDaySelect}
                  onHover={setHoverDate}
                  onMonthChange={handleLeftMonthChange}
                />
                <div className="w-px bg-waxe-border" />
                <MiniCalendar
                  year={rightYear}
                  month={rightMonth}
                  rangeStart={rangeStart}
                  rangeEnd={rangeEnd}
                  hoverDate={hoverDate}
                  selecting={selecting}
                  onSelect={handleDaySelect}
                  onHover={setHoverDate}
                  onMonthChange={handleRightMonthChange}
                />
              </div>

              {/* Selected range display */}
              <div className="mt-3 pt-3 border-t border-waxe-border">
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="text-waxe-text-muted">From:</span>
                  <span className="text-waxe-text font-mono font-medium">{rangeStart ? formatDate(rangeStart) : '\u2014'}</span>
                  <span className="text-waxe-text-muted ml-2">To:</span>
                  <span className="text-waxe-text font-mono font-medium">{rangeEnd ? formatDate(rangeEnd) : selecting ? 'select end date' : '\u2014'}</span>
                </div>
              </div>

              {/* Comparison selector */}
              {showComparison && (
                <div className="mt-3 pt-3 border-t border-waxe-border">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={compare}
                      onChange={(e) => setCompare(e.target.checked)}
                      className="accent-waxe-text w-3.5 h-3.5"
                    />
                    <span className="text-[11px] text-waxe-text-secondary">Compare to</span>
                  </label>
                  {compare && (
                    <div className="flex gap-2 mt-2">
                      {COMPARE_OPTIONS.map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => setCompareType(opt.value)}
                          className={`text-[10px] px-2 py-1 border transition-colors ${
                            compareType === opt.value
                              ? 'border-waxe-cool text-waxe-cool bg-waxe-cool/10'
                              : 'border-waxe-border text-waxe-text-muted hover:text-waxe-text'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Apply button */}
              <div className="mt-3 flex justify-end">
                <button
                  onClick={handleApply}
                  disabled={!rangeStart || !rangeEnd}
                  className="btn-primary text-xs px-4 py-1.5 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
