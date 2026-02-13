'use client'

import type { SwapProposal, SwapRecord } from '@/lib/restock-data'
import { StatusBadge } from '@/components/dashboard'

function RecordThumb({ record }: { record: SwapRecord }) {
  return (
    <div className="flex items-center gap-2 py-1.5">
      <div
        className="w-8 h-8 shrink-0 border border-waxe-border flex items-center justify-center relative overflow-hidden"
        style={{ backgroundColor: record.photoColor || '#2C3B4D' }}
      >
        {record.artworkUrl ? (
          <img src={record.artworkUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <span className="text-[7px] font-black text-white/60">LP</span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-bold text-waxe-text truncate">{record.artist}</p>
        <p className="text-[9px] text-waxe-text-muted truncate">{record.title}</p>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-[10px] font-bold text-waxe-text font-mono">${record.marketValue}</p>
        <p className="text-[8px] text-waxe-text-muted">{record.genre}</p>
      </div>
    </div>
  )
}

function RecordColumn({ label, records, total }: { label: string; records: SwapRecord[]; total: number }) {
  return (
    <div className="flex-1 min-w-0">
      <p className="text-[9px] font-black uppercase tracking-[0.15em] text-waxe-text-muted mb-2">{label}</p>
      <div className="space-y-0.5">
        {records.map((r, i) => (
          <RecordThumb key={i} record={r} />
        ))}
      </div>
      <div className="mt-2 pt-2 border-t border-waxe-border flex justify-between items-center">
        <span className="text-[9px] text-waxe-text-muted uppercase tracking-wide">{records.length} record{records.length !== 1 ? 's' : ''}</span>
        <span className="text-[11px] font-black text-waxe-text font-mono">${total}</span>
      </div>
    </div>
  )
}

interface SwapCardProps {
  proposal: SwapProposal
  onAccept?: (id: string) => void
  onDecline?: (id: string) => void
  onViewDetails?: (id: string) => void
}

export default function SwapCard({ proposal, onAccept, onDecline, onViewDetails }: SwapCardProps) {
  const sendTotal = proposal.recordsYouSend.reduce((sum, r) => sum + r.marketValue, 0)
  const receiveTotal = proposal.recordsYouReceive.reduce((sum, r) => sum + r.marketValue, 0)

  return (
    <div className="bg-waxe-card border-2 border-waxe-border rounded-none p-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <p className="text-[11px] font-black text-waxe-text uppercase tracking-[0.1em]">
              Swap <span className="text-waxe-cool">{'>>'}</span> {proposal.storeB.name}
            </p>
            <StatusBadge status={proposal.status} />
          </div>
          <p className="text-[9px] text-waxe-text-muted">{proposal.storeB.location} &middot; {proposal.createdAt}</p>
        </div>
        {proposal.valueDelta > 0 && (
          <div className="text-right">
            <p className="text-[9px] font-bold uppercase tracking-wide text-waxe-positive">+${proposal.valueDelta} Value</p>
          </div>
        )}
      </div>

      {/* Two-column swap visual */}
      <div className="flex gap-3 items-stretch mb-4">
        <RecordColumn label="You Send" records={proposal.recordsYouSend} total={sendTotal} />

        {/* Center divider with arrow */}
        <div className="shrink-0 flex flex-col items-center justify-center px-1">
          <div className="w-px flex-1 bg-waxe-border" />
          <div className="my-2 w-8 h-8 border-2 border-waxe-border flex items-center justify-center bg-waxe-surface">
            <span className="text-sm text-waxe-text">⇄</span>
          </div>
          <div className="w-px flex-1 bg-waxe-border" />
        </div>

        <RecordColumn label="You Receive" records={proposal.recordsYouReceive} total={receiveTotal} />
      </div>

      {/* Mismatch score bar */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-waxe-text-muted">Genre Mismatch Resolution</span>
          <span className="text-[10px] font-black text-waxe-text font-mono">{proposal.mismatchScore}/100</span>
        </div>
        <div className="w-full h-1.5 bg-waxe-surface overflow-hidden">
          <div
            className="h-full bg-waxe-warm transition-all"
            style={{ width: `${proposal.mismatchScore}%` }}
          />
        </div>
      </div>

      {/* Savings callout */}
      <div className="bg-waxe-surface border border-waxe-border px-3 py-2 mb-3">
        <p className="text-[9px] font-bold uppercase tracking-wide text-waxe-positive mb-0.5">
          Network Savings: ${proposal.marketSavings} vs. open market
        </p>
        <p className="text-[10px] text-waxe-text-secondary leading-relaxed">{proposal.reasoning}</p>
      </div>

      {/* Action buttons */}
      {proposal.status === 'pending' && (
        <div className="flex gap-2">
          <button onClick={() => onAccept?.(proposal.id)} className="btn-primary text-[10px] px-4 py-2 flex-1">
            Accept Swap
          </button>
          <button onClick={() => onDecline?.(proposal.id)} className="btn-ghost text-[10px] px-4 py-2">
            Decline
          </button>
          <button onClick={() => onViewDetails?.(proposal.id)} className="btn-secondary text-[10px] px-4 py-2">
            Details
          </button>
        </div>
      )}
      {proposal.status === 'accepted' && (
        <div className="flex gap-2">
          <button onClick={() => onViewDetails?.(proposal.id)} className="btn-secondary text-[10px] px-4 py-2 flex-1">
            View Details
          </button>
        </div>
      )}
    </div>
  )
}
