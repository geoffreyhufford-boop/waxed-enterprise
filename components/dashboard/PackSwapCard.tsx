'use client'

import { useState } from 'react'
import type { PackSwapProposal, CuratedPack, PackRecord } from '@/lib/pack-data'
import { StatusBadge } from '@/components/dashboard'
import { PackArtworkGrid } from './PackCard'

// ─── Pack Swap Detail Modal ──────────────────────────────────

function PackSwapDetailModal({ proposal, onClose }: { proposal: PackSwapProposal; onClose: () => void }) {
  const [viewSide, setViewSide] = useState<'send' | 'receive'>('send')
  const activePack = viewSide === 'send' ? proposal.packYouSend : proposal.packYouReceive

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-waxe-text/60" onClick={onClose} />
      <div className="relative bg-waxe-card border-2 border-waxe-border rounded-none w-full max-w-3xl max-h-[85vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-[11px] font-black uppercase tracking-[0.1em] text-waxe-text-muted">Pack Swap Details</p>
                <StatusBadge status={proposal.status} />
              </div>
              <h2 className="text-xl font-black text-waxe-text tracking-tight">
                {proposal.packYouSend.name} <span className="text-waxe-cool">⇄</span> {proposal.packYouReceive.name}
              </h2>
              <p className="text-xs text-waxe-text-muted">{proposal.storeB.name} &middot; {proposal.storeB.location} &middot; Proposed {proposal.createdAt}</p>
            </div>
            <button onClick={onClose} className="text-waxe-text-muted hover:text-waxe-text text-lg font-black">✕</button>
          </div>

          {/* Pack summaries side by side */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div className="bg-waxe-surface border border-waxe-border p-3">
              <p className="text-[9px] font-black uppercase tracking-[0.15em] text-waxe-text-muted mb-2">You Send</p>
              <p className="text-sm font-black text-waxe-text">{proposal.packYouSend.name}</p>
              <p className="text-[9px] text-waxe-text-muted">{proposal.packYouSend.genre} &middot; {proposal.packYouSend.records.length} records</p>
              <p className="text-[11px] font-black text-waxe-text font-mono mt-1">${proposal.packYouSend.packPrice}</p>
            </div>
            <div className="bg-waxe-surface border border-waxe-border p-3">
              <p className="text-[9px] font-black uppercase tracking-[0.15em] text-waxe-text-muted mb-2">You Receive</p>
              <p className="text-sm font-black text-waxe-text">{proposal.packYouReceive.name}</p>
              <p className="text-[9px] text-waxe-text-muted">{proposal.packYouReceive.genre} &middot; {proposal.packYouReceive.records.length} records</p>
              <p className="text-[11px] font-black text-waxe-text font-mono mt-1">${proposal.packYouReceive.packPrice}</p>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="bg-waxe-surface border border-waxe-border p-3 text-center">
              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-waxe-text-muted mb-1">Value Delta</p>
              <p className={`text-lg font-black font-mono ${proposal.valueDelta >= 0 ? 'text-waxe-positive' : 'text-waxe-negative'}`}>
                {proposal.valueDelta >= 0 ? '+' : ''}${proposal.valueDelta}
              </p>
            </div>
            <div className="bg-waxe-surface border border-waxe-border p-3 text-center">
              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-waxe-text-muted mb-1">Mismatch Score</p>
              <p className="text-lg font-black text-waxe-text font-mono">{proposal.mismatchScore}/100</p>
            </div>
            <div className="bg-waxe-surface border border-waxe-border p-3 text-center">
              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-waxe-text-muted mb-1">Market Savings</p>
              <p className="text-lg font-black text-waxe-positive font-mono">${proposal.marketSavings}</p>
            </div>
          </div>

          {/* Toggle to view records per side */}
          <div className="flex gap-1.5 mb-3">
            <button
              onClick={() => setViewSide('send')}
              className={`text-[9px] font-bold uppercase tracking-[0.1em] px-3 py-1.5 border-2 ${
                viewSide === 'send' ? 'bg-waxe-text text-waxe-deep border-waxe-text' : 'text-waxe-text-muted border-waxe-border'
              }`}
            >
              You Send ({proposal.packYouSend.records.length})
            </button>
            <button
              onClick={() => setViewSide('receive')}
              className={`text-[9px] font-bold uppercase tracking-[0.1em] px-3 py-1.5 border-2 ${
                viewSide === 'receive' ? 'bg-waxe-text text-waxe-deep border-waxe-text' : 'text-waxe-text-muted border-waxe-border'
              }`}
            >
              You Receive ({proposal.packYouReceive.records.length})
            </button>
          </div>

          {/* All 25 records for selected side */}
          <div className="space-y-1 mb-5">
            {activePack.records.map((r: PackRecord, i: number) => (
              <div key={i} className="flex items-center gap-3 py-1.5 border-b border-waxe-surface last:border-0">
                <span className="text-[9px] text-waxe-text-muted font-mono w-5 text-right shrink-0">{i + 1}</span>
                <div
                  className="w-8 h-8 shrink-0 border border-waxe-border flex items-center justify-center relative overflow-hidden"
                  style={{ backgroundColor: r.photoColor || '#2C3B4D' }}
                >
                  {r.artworkUrl ? (
                    <img src={r.artworkUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <span className="text-[6px] font-black text-white/50">LP</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold text-waxe-text truncate">{r.artist}</p>
                  <p className="text-[9px] text-waxe-text-muted truncate">{r.title}</p>
                </div>
                <span className="text-[9px] text-waxe-text-muted shrink-0">{'★'.repeat(r.condition)}{'☆'.repeat(5 - r.condition)}</span>
                <span className="text-[10px] font-bold text-waxe-text font-mono shrink-0">${r.marketValue}</span>
              </div>
            ))}
          </div>

          {/* AI Reasoning */}
          <div className="bg-waxe-surface border border-waxe-border p-4 mb-5">
            <p className="text-[9px] font-black uppercase tracking-[0.15em] text-waxe-text-muted mb-2">Analysis</p>
            <p className="text-sm text-waxe-text-secondary leading-relaxed">{proposal.reasoning}</p>
          </div>

          {/* Actions */}
          {proposal.status === 'pending' && (
            <div className="flex gap-2">
              <button className="btn-primary text-sm px-5 py-2.5 flex-1">Accept Swap</button>
              <button className="btn-ghost text-sm px-4 py-2.5">Decline</button>
              <button onClick={onClose} className="btn-secondary text-sm px-4 py-2.5">Close</button>
            </div>
          )}
          {proposal.status !== 'pending' && (
            <div className="flex gap-2">
              <button onClick={onClose} className="btn-secondary text-sm px-5 py-2.5 flex-1">Close</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Pack Column (summary for swap card) ─────────────────────

function PackColumn({ label, pack }: { label: string; pack: CuratedPack }) {
  return (
    <div className="flex-1 min-w-0">
      <p className="text-[9px] font-black uppercase tracking-[0.15em] text-waxe-text-muted mb-2">{label}</p>
      <PackArtworkGrid records={pack.records} size="sm" />
      <p className="text-[11px] font-black text-waxe-text uppercase tracking-[0.05em] mt-2 truncate">{pack.name}</p>
      <p className="text-[9px] text-waxe-text-muted">{pack.genre} &middot; {pack.records.length} records</p>
      <div className="mt-1.5 pt-1.5 border-t border-waxe-border flex justify-between items-center">
        <span className="text-[9px] text-waxe-text-muted uppercase tracking-wide">Pack value</span>
        <span className="text-[11px] font-black text-waxe-text font-mono">${pack.packPrice}</span>
      </div>
    </div>
  )
}

// ─── Pack Swap Card ──────────────────────────────────────────

interface PackSwapCardProps {
  proposal: PackSwapProposal
  onAccept?: (id: string) => void
  onDecline?: (id: string) => void
}

export default function PackSwapCard({ proposal, onAccept, onDecline }: PackSwapCardProps) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <>
      <div className="bg-waxe-card border-2 border-waxe-border rounded-none p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-[11px] font-black text-waxe-text uppercase tracking-[0.1em]">
                Pack Swap <span className="text-waxe-cool">{'>>'}</span> {proposal.storeB.name}
              </p>
              <StatusBadge status={proposal.status} />
            </div>
            <p className="text-[9px] text-waxe-text-muted">{proposal.storeB.location} &middot; {proposal.createdAt}</p>
          </div>
          {proposal.valueDelta !== 0 && (
            <div className="text-right">
              <p className={`text-[9px] font-bold uppercase tracking-wide ${proposal.valueDelta > 0 ? 'text-waxe-positive' : 'text-waxe-negative'}`}>
                {proposal.valueDelta > 0 ? '+' : ''}${proposal.valueDelta} Value
              </p>
            </div>
          )}
        </div>

        {/* Two-column pack swap visual */}
        <div className="flex gap-3 items-stretch mb-4">
          <PackColumn label="You Send" pack={proposal.packYouSend} />

          {/* Center divider with arrow */}
          <div className="shrink-0 flex flex-col items-center justify-center px-1">
            <div className="w-px flex-1 bg-waxe-border" />
            <div className="my-2 w-8 h-8 border-2 border-waxe-border flex items-center justify-center bg-waxe-surface">
              <span className="text-sm text-waxe-text">⇄</span>
            </div>
            <div className="w-px flex-1 bg-waxe-border" />
          </div>

          <PackColumn label="You Receive" pack={proposal.packYouReceive} />
        </div>

        {/* Mismatch score bar */}
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-waxe-text-muted">Genre Mismatch Resolution</span>
            <span className="text-[10px] font-black text-waxe-text font-mono">{proposal.mismatchScore}/100</span>
          </div>
          <div className="w-full h-1.5 bg-waxe-surface overflow-hidden">
            <div
              className="h-full bg-waxe-warm"
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
            <button onClick={() => setShowDetails(true)} className="btn-secondary text-[10px] px-4 py-2">
              Details
            </button>
          </div>
        )}
        {proposal.status === 'accepted' && (
          <div className="flex gap-2">
            <button onClick={() => setShowDetails(true)} className="btn-secondary text-[10px] px-4 py-2 flex-1">
              View Details
            </button>
          </div>
        )}
      </div>

      {showDetails && <PackSwapDetailModal proposal={proposal} onClose={() => setShowDetails(false)} />}
    </>
  )
}
