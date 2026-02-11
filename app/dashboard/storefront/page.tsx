'use client'

import { useState } from 'react'
import { DashboardHeader, StatusBadge, ShelfCard } from '@/components/dashboard'
import { shelves, storefrontConfig, inventoryRecords } from '@/lib/dashboard-data'

const artworkMap = Object.fromEntries(inventoryRecords.map(r => [r.id, r.artworkUrl]))
const recordMap = Object.fromEntries(inventoryRecords.map(r => [r.id, r]))
const featuredRecords = inventoryRecords.filter(r => r.artworkUrl).slice(0, 8)

const marqueeItems = [
  { text: 'Listen', icon: '🎵', sep: '→' },
  { text: 'Our small independent', icon: '◉', sep: '' },
  { text: 'radio station', icon: '📻', sep: '→' },
]

const marqueeItems2 = [
  { text: 'Exclusive vinyl', icon: '◉', sep: '' },
  { text: 'releases now', icon: '🛒', sep: '→' },
  { text: 'Shop', icon: '💿', sep: '→' },
  { text: 'The new exclusive vinyl', icon: '◉', sep: '' },
]

const marqueeItems3 = [
  { text: 'Selections of unique and new picks', icon: '🎶', sep: '' },
  { text: 'from the creative rhythm team', icon: '📧', sep: '→' },
  { text: 'Subscribe', icon: '', sep: '→' },
]

export default function StorefrontPage() {
  const [selectedShelf, setSelectedShelf] = useState(0)
  const activeShelf = shelves[selectedShelf]

  return (
    <div className="flex flex-col flex-1 min-h-0">
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

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-5 gap-4">

        {/* ── Left: Live Storefront Preview ── */}
        <div className="lg:col-span-3 min-h-0 flex flex-col">
          {/* Browser chrome */}
          <div className="shrink-0 bg-waxe-surface px-3 py-2 flex items-center gap-2 border-2 border-b-0 border-waxe-border">
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-waxe-negative/40" />
              <div className="w-2 h-2 rounded-full bg-waxe-warm/50" />
              <div className="w-2 h-2 rounded-full bg-waxe-positive/40" />
            </div>
            <div className="flex-1 text-center">
              <span className="text-[10px] text-waxe-text-muted font-mono">{storefrontConfig.url}</span>
            </div>
          </div>

          {/* Storefront content */}
          <div className="flex-1 min-h-0 overflow-y-auto border-2 border-waxe-border" style={{ background: storefrontConfig.primaryColor, color: '#111', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

            {/* Nav bar */}
            <div className="flex items-center justify-between px-6 py-3 border-b" style={{ borderColor: '#E5E5E5' }}>
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-medium" style={{ color: '#888' }}>Vinyl</span>
                <span className="text-[10px] font-medium" style={{ color: '#888' }}>New Arrivals</span>
                <span className="text-[10px] font-medium" style={{ color: '#888' }}>Genres</span>
              </div>
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] text-white font-bold" style={{ background: storefrontConfig.accentColor }}>
                {storefrontConfig.logoText}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px]" style={{ color: '#888' }}>♡</span>
                <span className="text-[10px]" style={{ color: '#888' }}>☰</span>
              </div>
            </div>

            {/* Hero section */}
            <div className="px-6 pt-6 pb-2">
              <p className="text-[10px] leading-relaxed mb-3" style={{ color: '#999', maxWidth: '60%' }}>
                {storefrontConfig.description}
              </p>
              <h1 className="font-black tracking-tighter leading-[0.85]" style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', color: '#111' }}>
                {storefrontConfig.storeName.split(' ').map((word, i) => (
                  <span key={i} className="block">{word}</span>
                ))}
              </h1>
              <button className="mt-4 px-4 py-1.5 text-[10px] font-bold text-white rounded-full" style={{ background: storefrontConfig.accentColor }}>
                Go to e-shop
              </button>
            </div>

            {/* Marquee strips */}
            <div className="border-y overflow-hidden" style={{ borderColor: '#E5E5E5' }}>
              <div className="py-2 px-4 flex items-center gap-3 whitespace-nowrap text-[10px]" style={{ color: '#555' }}>
                {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
                  <span key={i} className="flex items-center gap-1.5">
                    <span className="underline font-medium" style={{ color: '#111' }}>{item.text}</span>
                    {item.sep && <span style={{ color: '#111' }}>{item.sep}</span>}
                    {item.icon && <span>{item.icon}</span>}
                  </span>
                ))}
              </div>
            </div>
            <div className="border-b overflow-hidden" style={{ borderColor: '#E5E5E5' }}>
              <div className="py-2 px-4 flex items-center gap-3 whitespace-nowrap text-[10px]" style={{ color: '#555' }}>
                {[...marqueeItems2, ...marqueeItems2].map((item, i) => (
                  <span key={i} className="flex items-center gap-1.5">
                    {item.icon && <span>{item.icon}</span>}
                    <span className="font-medium" style={{ color: '#111' }}>{item.text}</span>
                    {item.sep && <span style={{ color: '#111' }}>{item.sep}</span>}
                  </span>
                ))}
              </div>
            </div>
            <div className="border-b overflow-hidden" style={{ borderColor: '#E5E5E5' }}>
              <div className="py-2 px-4 flex items-center gap-3 whitespace-nowrap text-[10px]" style={{ color: '#555' }}>
                {[...marqueeItems3, ...marqueeItems3].map((item, i) => (
                  <span key={i} className="flex items-center gap-1.5">
                    {item.icon && <span>{item.icon}</span>}
                    <span className="font-medium" style={{ color: '#111' }}>{item.text}</span>
                    {item.sep && <span style={{ color: '#111' }}>{item.sep}</span>}
                  </span>
                ))}
              </div>
            </div>

            {/* Shelf sections */}
            {shelves.map((shelf, si) => (
              <div key={shelf.id} className="px-6 py-4">
                <div className="flex items-baseline gap-2 mb-3">
                  <h2 className={`font-black ${si === 0 ? 'text-xl' : 'text-base'}`} style={{ color: storefrontConfig.accentColor }}>
                    {shelf.name} {si === 0 && <span className="text-xs">({'\u266B'})</span>}
                  </h2>
                  <span className="text-[10px]" style={{ color: '#999' }}>{shelf.recordCount} records</span>
                  <span className="ml-auto text-[10px] underline" style={{ color: '#666' }}>View all →</span>
                </div>
                <div className={`grid gap-2 ${si === 0 ? 'grid-cols-4' : 'grid-cols-3'}`}>
                  {(si === 0 ? featuredRecords : shelf.records.map(r => recordMap[r.id]).filter(Boolean)).map((record) => (
                    <div key={record.id}>
                      <div className="aspect-square overflow-hidden mb-1" style={{ background: '#EFEFEF' }}>
                        {record.artworkUrl ? (
                          <img src={record.artworkUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xl" style={{ color: '#CCC' }}>
                            {record.artist.charAt(0)}
                          </div>
                        )}
                      </div>
                      <p className="text-[9px] truncate" style={{ color: '#333' }}>{record.artist} — {record.title}</p>
                      <p className="text-[9px] font-medium" style={{ color: '#111' }}>${record.price.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Quote section */}
            <div className="grid grid-cols-2 gap-0">
              <div className="aspect-square overflow-hidden" style={{ background: '#DDD' }}>
                <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${storefrontConfig.accentColor} 0%, #1A00B8 100%)` }}>
                  <span className="text-3xl">📀</span>
                </div>
              </div>
              <div className="flex flex-col justify-center px-5 py-4" style={{ background: storefrontConfig.primaryColor }}>
                <blockquote className="text-sm font-black italic leading-tight mb-3 uppercase" style={{ color: storefrontConfig.accentColor }}>
                  &laquo;This isn&apos;t merely a store where you can purchase records, it&apos;s a sanctuary for true vinyl aficionados&raquo;
                </blockquote>
                <p className="text-[10px]" style={{ color: '#999' }}>— Store Owner</p>
              </div>
            </div>

            {/* Genre list */}
            <div className="px-6 py-6">
              <h3 className="text-sm font-black mb-3" style={{ color: '#111' }}>Browse by genre</h3>
              <div className="space-y-1">
                {['Techno', 'House', 'Ambient', 'Electro', 'Dub Techno', 'Acid', 'Breakbeat', 'IDM'].map((genre) => (
                  <p key={genre} className="text-xs font-medium py-1 border-b" style={{ borderColor: '#EEE', color: '#333' }}>{genre}</p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: Editor Panel ── */}
        <div className="lg:col-span-2 min-h-0 overflow-y-auto space-y-4">

          {/* Customization */}
          <div className="bg-waxe-card border-2 border-waxe-border rounded-none p-5">
            <h2 className="text-[11px] font-black text-waxe-text uppercase tracking-[0.1em] mb-4">Customize</h2>
            <div className="space-y-3">
              <div>
                <label className="label-text">Store Name</label>
                <input type="text" className="input-field" defaultValue={storefrontConfig.storeName} />
              </div>
              <div>
                <label className="label-text">Description</label>
                <textarea className="input-field resize-none h-16" defaultValue={storefrontConfig.description} />
              </div>
              <div>
                <label className="label-text">Quote</label>
                <textarea className="input-field resize-none h-16" defaultValue="This isn't merely a store where you can purchase records, it's a sanctuary for true vinyl aficionados" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label-text">Primary</label>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 border-2 border-waxe-border" style={{ background: storefrontConfig.primaryColor }} />
                    <span className="text-[10px] font-mono text-waxe-text-muted">{storefrontConfig.primaryColor}</span>
                  </div>
                </div>
                <div>
                  <label className="label-text">Accent</label>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 border-2 border-waxe-border" style={{ background: storefrontConfig.accentColor }} />
                    <span className="text-[10px] font-mono text-waxe-text-muted">{storefrontConfig.accentColor}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Shelves */}
          <div className="bg-waxe-card border-2 border-waxe-border rounded-none p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[11px] font-black text-waxe-text uppercase tracking-[0.1em]">Shelves</h2>
              <button className="btn-ghost text-xs">+ Add</button>
            </div>
            <div className="space-y-2">
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

          {/* Selected shelf records */}
          <div className="bg-waxe-card border-2 border-waxe-border rounded-none p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[11px] font-black text-waxe-text uppercase tracking-[0.1em]">{activeShelf.name}</h2>
              <button className="btn-ghost text-xs">+ Add</button>
            </div>
            <div className="space-y-1">
              {activeShelf.records.map((record) => (
                <div key={record.id} className="flex items-center justify-between py-2 px-2 hover:bg-waxe-surface/30 transition-colors">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-8 h-8 bg-waxe-surface overflow-hidden shrink-0">
                      {artworkMap[record.id] ? (
                        <img src={artworkMap[record.id]} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-waxe-text-muted">
                          {record.artist.split(' ').pop()?.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-waxe-text truncate">{record.artist}</p>
                      <p className="text-[10px] text-waxe-text-muted truncate">{record.title}</p>
                    </div>
                  </div>
                  <button
                    className={`w-6 h-6 flex items-center justify-center text-xs shrink-0 ${
                      record.featured
                        ? 'bg-waxe-warm/15 text-waxe-cool border border-waxe-warm/25'
                        : 'bg-waxe-surface text-waxe-text-muted border border-waxe-border'
                    }`}
                  >
                    ★
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
