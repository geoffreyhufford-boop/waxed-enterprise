'use client'

import { useState } from 'react'
import { DashboardHeader, StatusBadge, ShelfCard } from '@/components/dashboard'
import { shelves, storefrontConfig, inventoryRecords } from '@/lib/dashboard-data'

const artworkMap = Object.fromEntries(inventoryRecords.map(r => [r.id, r.artworkUrl]))

export default function StorefrontPage() {
  const [selectedShelf, setSelectedShelf] = useState(0)
  const activeShelf = shelves[selectedShelf]

  return (
    <>
      <DashboardHeader
        title="Storefront Builder"
        subtitle="Customize your online record store"
        actions={
          <div className="flex items-center gap-3">
            <StatusBadge status={storefrontConfig.status} label={storefrontConfig.status === 'live' ? 'Live' : 'Draft'} />
            <button className="btn-secondary text-sm px-4 py-2">Preview</button>
            <button className="btn-primary text-sm px-4 py-2">Publish</button>
          </div>
        }
      />

      {/* Status Bar */}
      <div className="bg-waxe-card backdrop-blur-md border border-waxe-border rounded-2xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold" style={{ background: `${storefrontConfig.primaryColor}20`, color: storefrontConfig.primaryColor }}>
            {storefrontConfig.logoText}
          </div>
          <div>
            <p className="text-sm font-semibold text-waxe-text">{storefrontConfig.storeName}</p>
            <p className="text-xs text-waxe-cool">{storefrontConfig.url}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs text-waxe-text-muted">
          <span>{shelves.reduce((sum, s) => sum + s.recordCount, 0)} records across {shelves.length} shelves</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Shelf Manager */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-waxe-card backdrop-blur-md border border-waxe-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-waxe-text">Shelves</h2>
              <button className="btn-ghost text-xs">+ Add Shelf</button>
            </div>
            <div className="space-y-3">
              {shelves.map((shelf, i) => (
                <ShelfCard
                  key={shelf.id}
                  shelf={shelf}
                  isSelected={i === selectedShelf}
                  onSelect={() => setSelectedShelf(i)}
                  artworkMap={artworkMap}
                />
              ))}
            </div>
          </div>

          {/* Selected Shelf Details */}
          <div className="bg-waxe-card backdrop-blur-md border border-waxe-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-waxe-text">{activeShelf.name} — Records</h2>
              <button className="btn-ghost text-xs">+ Add Records</button>
            </div>
            <div className="space-y-2">
              {activeShelf.records.map((record) => (
                <div key={record.id} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-waxe-surface/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-waxe-surface border border-waxe-border overflow-hidden shrink-0">
                      {artworkMap[record.id] ? (
                        <img src={artworkMap[record.id]} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs font-bold text-waxe-text-muted">
                          {record.artist.split(' ').pop()?.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-waxe-text">{record.artist}</p>
                      <p className="text-xs text-waxe-text-muted">{record.title}</p>
                    </div>
                  </div>
                  <button
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-colors ${
                      record.featured
                        ? 'bg-waxe-warm/15 text-waxe-warm border border-waxe-warm/25'
                        : 'bg-waxe-surface text-waxe-text-muted border border-waxe-border hover:border-waxe-border-hover'
                    }`}
                    title={record.featured ? 'Featured' : 'Feature this record'}
                  >
                    ★
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Customization Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-waxe-card backdrop-blur-md border border-waxe-border rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-waxe-text mb-4">Store Customization</h2>
            <div className="space-y-4">
              <div>
                <label className="label-text">Store Name</label>
                <input type="text" className="input-field" defaultValue={storefrontConfig.storeName} readOnly />
              </div>
              <div>
                <label className="label-text">Description</label>
                <textarea className="input-field resize-none h-20" defaultValue={storefrontConfig.description} readOnly />
              </div>
              <div>
                <label className="label-text">Logo Text</label>
                <input type="text" className="input-field" defaultValue={storefrontConfig.logoText} readOnly />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-text">Primary Color</label>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg border border-waxe-border" style={{ background: storefrontConfig.primaryColor }} />
                    <span className="text-xs font-mono text-waxe-text-muted">{storefrontConfig.primaryColor}</span>
                  </div>
                </div>
                <div>
                  <label className="label-text">Accent Color</label>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg border border-waxe-border" style={{ background: storefrontConfig.accentColor }} />
                    <span className="text-xs font-mono text-waxe-text-muted">{storefrontConfig.accentColor}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Store Preview Card */}
          <div className="bg-waxe-card backdrop-blur-md border border-waxe-border rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-waxe-text mb-4">Preview</h2>
            <div className="rounded-xl border border-waxe-border overflow-hidden">
              {/* Mini browser chrome */}
              <div className="bg-waxe-surface px-3 py-2 flex items-center gap-2 border-b border-waxe-border">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-400/60" />
                  <div className="w-2 h-2 rounded-full bg-yellow-400/60" />
                  <div className="w-2 h-2 rounded-full bg-green-400/60" />
                </div>
                <div className="flex-1 text-center">
                  <span className="text-[10px] text-waxe-text-muted font-mono">{storefrontConfig.url}</span>
                </div>
              </div>
              {/* Preview content */}
              <div className="p-4 bg-waxe-deep/50">
                <div className="text-center mb-4">
                  <span className="text-lg font-bold" style={{ color: storefrontConfig.primaryColor }}>{storefrontConfig.logoText}</span>
                  <p className="text-xs text-waxe-text-muted mt-1">{storefrontConfig.storeName}</p>
                </div>
                <div className="space-y-2">
                  {shelves.slice(0, 3).map((shelf) => (
                    <div key={shelf.id} className="bg-waxe-surface/50 rounded-lg p-2">
                      <p className="text-[10px] font-semibold text-waxe-text-secondary mb-1">{shelf.name}</p>
                      <div className="flex gap-1">
                        {shelf.records.slice(0, 3).map((r) => (
                          <div key={r.id} className="w-6 h-6 rounded bg-waxe-card border border-waxe-border overflow-hidden">
                            {artworkMap[r.id] ? (
                              <img src={artworkMap[r.id]} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[8px] text-waxe-text-muted">{r.artist.charAt(0)}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
