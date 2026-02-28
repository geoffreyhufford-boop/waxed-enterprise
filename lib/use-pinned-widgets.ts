'use client'

import { useSyncExternalStore, useCallback } from 'react'

const STORAGE_KEY = 'waxed-pinned-widgets'

const DEFAULT_PINS = [
  'overview-getting-started',
  'overview-revenue-chart',
  'overview-margin-calculator',
  'overview-top-sellers',
  'overview-activity-feed',
  'overview-inventory-alerts',
  'overview-market-pulse',
  'overview-channel-breakdown',
]

// ── Shared module-level store ──────────────────────────────
let cached: string[] = DEFAULT_PINS
let listeners = new Set<() => void>()

function read(): string[] {
  if (typeof window === 'undefined') return DEFAULT_PINS
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_PINS
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : DEFAULT_PINS
  } catch {
    return DEFAULT_PINS
  }
}

function write(next: string[]) {
  cached = next
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch { /* ignore */ }
  listeners.forEach((l) => l())
}

// Hydrate cache on first client load
if (typeof window !== 'undefined') {
  cached = read()
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => { listeners.delete(listener) }
}

function getSnapshot() {
  return cached
}

function getServerSnapshot() {
  return DEFAULT_PINS
}

// ── Hook ───────────────────────────────────────────────────
export function usePinnedWidgets() {
  const pinned = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const togglePin = useCallback((id: string) => {
    const current = cached
    const next = current.includes(id)
      ? current.filter((p) => p !== id)
      : [...current, id]
    write(next)
  }, [])

  const isPinned = useCallback((id: string) => cached.includes(id), [pinned])

  const reorder = useCallback((newOrder: string[]) => {
    write(newOrder)
  }, [])

  return { pinned, togglePin, isPinned, reorder } as const
}
