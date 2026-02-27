'use client'

import { useState } from 'react'
import PinButton from '../PinButton'

interface OnboardingStep {
  id: string
  label: string
  description: string
  completed: boolean
}

const initialSteps: OnboardingStep[] = [
  { id: 'payment', label: 'Set up payment details', description: 'Connect Stripe or Square for processing', completed: true },
  { id: 'billing', label: 'Configure billing & payouts', description: 'Set payout schedule and tax info', completed: true },
  { id: 'shipping', label: 'Shipping & tax settings', description: 'Shipping rates, tax collection rules', completed: true },
  { id: 'first-record', label: 'Add your first record', description: 'Search the catalog or add manually', completed: false },
  { id: 'bulk-upload', label: 'Bulk upload inventory', description: 'Import from CSV, Discogs, or Shopify', completed: false },
]

export default function OverviewGettingStarted() {
  const [steps, setSteps] = useState(initialSteps)
  const completedCount = steps.filter((s) => s.completed).length

  const toggle = (id: string) => {
    setSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s))
    )
  }

  return (
    <div className="relative bg-waxe-card border-2 border-waxe-border rounded-none p-5 flex flex-col h-[360px] clip-card-bl">
      <PinButton widgetId="overview-getting-started" />
      <div className="flex items-center justify-between mb-2 shrink-0">
        <div className="flex items-center gap-2">
          <h2 className="text-[11px] font-black text-waxe-text uppercase tracking-[0.1em]">Getting Started <span className="text-waxe-cool">{'>>'}</span></h2>
          <span className="hatch-inline" />
        </div>
        <span className="text-[11px] text-waxe-text-muted mr-11">
          {completedCount}/{steps.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="shrink-0 mb-3">
        <div className="h-1.5 bg-waxe-surface overflow-hidden">
          <div
            className="h-full bg-waxe-warm transition-all duration-300"
            style={{ width: `${(completedCount / steps.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="hatch-divider mb-3 shrink-0" />

      <div className="flex-1 min-h-0 overflow-y-auto space-y-1">
        {steps.map((step) => (
          <label
            key={step.id}
            className="flex items-start gap-3 py-2.5 px-2 hover:bg-waxe-surface/30 transition-colors cursor-pointer"
          >
            <input
              type="checkbox"
              checked={step.completed}
              onChange={() => toggle(step.id)}
              className="accent-waxe-text w-4 h-4 mt-0.5 shrink-0"
            />
            <div className="min-w-0">
              <p className={`text-sm font-medium ${step.completed ? 'text-waxe-text-muted line-through' : 'text-waxe-text'}`}>
                {step.label}
              </p>
              <p className="text-[11px] text-waxe-text-muted">{step.description}</p>
            </div>
          </label>
        ))}
      </div>
    </div>
  )
}
