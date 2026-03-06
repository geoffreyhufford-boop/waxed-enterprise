'use client'

import { useState } from 'react'
import { DashboardHeader, StatusBadge, ShelfCard } from '@/components/dashboard'
import { shelves, storefrontConfig, inventoryRecords, type StorefrontSocialLinks } from '@/lib/dashboard-data'

const recordMap = Object.fromEntries(inventoryRecords.map(r => [r.id, r]))
const artworkMap = Object.fromEntries(inventoryRecords.map(r => [r.id, r.artworkUrl]))
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

const socialPlatforms: { key: keyof StorefrontSocialLinks; label: string; icon: string }[] = [
 { key: 'instagram', label: 'Instagram', icon: '◎' },
 { key: 'twitter', label: 'X / Twitter', icon: '𝕏' },
 { key: 'tiktok', label: 'TikTok', icon: '♪' },
 { key: 'facebook', label: 'Facebook', icon: 'f' },
 { key: 'youtube', label: 'YouTube', icon: '▶' },
 { key: 'bandcamp', label: 'Bandcamp', icon: '◆' },
]

export default function StorefrontPage() {
 const [selectedShelf, setSelectedShelf] = useState(0)
 const activeShelf = shelves[selectedShelf]
 const [socialLinks, setSocialLinks] = useState(storefrontConfig.socialLinks)
 const [editingShelf, setEditingShelf] = useState<string | null>(null)
 const [autoManagedShelves, setAutoManagedShelves] = useState<Record<string, boolean>>({})
 const [previewExpanded, setPreviewExpanded] = useState(false)
 const activeSocials = socialPlatforms.filter((p) => socialLinks[p.key])

 return (
  <div className="flex flex-col flex-1 min-h-0">
   <DashboardHeader
    title="Storefront"
    subtitle="Customize your online record store"
    actions={
     <div className="flex items-center gap-3">
      <StatusBadge status={storefrontConfig.status} label={storefrontConfig.status === 'live' ? 'Live' : 'Draft'} />
      <button className="btn-secondary text-sm px-3 py-1.5" onClick={() => setPreviewExpanded(true)}>Preview</button>
      <button className="btn-primary text-sm px-3 py-1.5">Publish</button>
     </div>
    }
   />

   <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-5 gap-4">

    {/* ── Left: Live Storefront Preview ── */}
    <div className="lg:col-span-3 min-h-0 flex flex-col">
     {/* Browser chrome */}
     <div className="shrink-0 bg-waxe-surface px-3 py-2 flex items-center gap-2 border border-b-0 border-waxe-border">
      <div className="flex gap-1">
       <div className="w-2 h-2 rounded-full bg-waxe-negative/40" />
       <div className="w-2 h-2 rounded-full bg-waxe-warm/50" />
       <div className="w-2 h-2 rounded-full bg-waxe-positive/40" />
      </div>
      <div className="flex-1 text-center">
       <span className="text-[11px] text-waxe-text-muted font-mono">{storefrontConfig.url}</span>
      </div>
      <button
       onClick={() => setPreviewExpanded(true)}
       className="text-[10px] text-waxe-text-muted hover:text-waxe-text transition-colors"
      >
       Expand ↗
      </button>
     </div>

     {/* Storefront content */}
     <div
      className="flex-1 min-h-0 overflow-y-auto border border-waxe-border cursor-pointer"
      style={{ background: storefrontConfig.primaryColor, color: '#111', fontFamily: 'system-ui, -apple-system, sans-serif' }}
      onClick={() => setPreviewExpanded(true)}
     >
      {/* Nav bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b" style={{ borderColor: '#E5E5E5' }}>
       <div className="flex items-center gap-4">
        <span className="text-[11px] font-medium" style={{ color: '#888' }}>Vinyl</span>
        <span className="text-[11px] font-medium" style={{ color: '#888' }}>New Arrivals</span>
        <span className="text-[11px] font-medium" style={{ color: '#888' }}>Genres</span>
       </div>
       <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] text-white font-bold" style={{ background: storefrontConfig.accentColor }}>
        {storefrontConfig.logoText}
       </div>
       <div className="flex items-center gap-3">
        {activeSocials.map((p) => (
         <span key={p.key} className="text-[11px] font-medium" style={{ color: '#888' }}>{p.icon}</span>
        ))}
        <span className="text-[11px]" style={{ color: '#888' }}>♡</span>
        <span className="text-[11px]" style={{ color: '#888' }}>☰</span>
       </div>
      </div>

      {/* Hero section */}
      <div className="px-6 pt-6 pb-2">
       <p className="text-[11px] leading-relaxed mb-3" style={{ color: '#999', maxWidth: '60%' }}>
        {storefrontConfig.description}
       </p>
       <h1 className="font-semibold leading-[0.85]" style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', color: '#111' }}>
        {storefrontConfig.storeName.split(' ').map((word, i) => (
         <span key={i} className="block">{word}</span>
        ))}
       </h1>
       <button className="mt-4 px-4 py-1.5 text-[11px] font-medium text-white rounded-full" style={{ background: storefrontConfig.accentColor }}>
        Go to e-shop
       </button>
      </div>

      {/* Marquee strips */}
      <div className="border-y overflow-hidden" style={{ borderColor: '#E5E5E5' }}>
       <div className="py-2 px-4 flex items-center gap-3 whitespace-nowrap text-[11px]" style={{ color: '#555' }}>
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
       <div className="py-2 px-4 flex items-center gap-3 whitespace-nowrap text-[11px]" style={{ color: '#555' }}>
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
       <div className="py-2 px-4 flex items-center gap-3 whitespace-nowrap text-[11px]" style={{ color: '#555' }}>
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
         <h2 className={`font-semibold ${si === 0 ? 'text-xl' : 'text-base'}`} style={{ color: storefrontConfig.accentColor }}>
          {shelf.name} {si === 0 && <span className="text-xs">({'\u266B'})</span>}
         </h2>
         <span className="text-[11px]" style={{ color: '#999' }}>{shelf.recordCount} records</span>
         <span className="ml-auto text-[11px] underline" style={{ color: '#666' }}>View all →</span>
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
           <p className="text-[11px] truncate" style={{ color: '#333' }}>{record.artist} — {record.title}</p>
           <p className="text-[11px] font-medium" style={{ color: '#111' }}>${record.price.toFixed(2)}</p>
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
        <blockquote className="text-sm font-semibold italic leading-tight mb-3" style={{ color: storefrontConfig.accentColor }}>
         &laquo;This isn&apos;t merely a store where you can purchase records, it&apos;s a sanctuary for true vinyl aficionados&raquo;
        </blockquote>
        <p className="text-[11px]" style={{ color: '#999' }}>— Store Owner</p>
       </div>
      </div>

      {/* Genre list */}
      <div className="px-6 py-6">
       <h3 className="text-sm font-semibold mb-3" style={{ color: '#111' }}>Browse by genre</h3>
       <div className="space-y-1">
        {['Techno', 'House', 'Ambient', 'Electro', 'Dub Techno', 'Acid', 'Breakbeat', 'IDM'].map((genre) => (
         <p key={genre} className="text-xs font-medium py-1 border-b" style={{ borderColor: '#EEE', color: '#333' }}>{genre}</p>
        ))}
       </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-6 border-t" style={{ borderColor: '#E5E5E5', background: '#F9F9F9' }}>
       <div className="flex items-center justify-between mb-4">
        <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] text-white font-bold" style={{ background: storefrontConfig.accentColor }}>
         {storefrontConfig.logoText}
        </div>
        {activeSocials.length > 0 && (
         <div className="flex items-center gap-3">
          {activeSocials.map((p) => (
           <span key={p.key} className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold text-white" style={{ background: '#333' }}>
            {p.icon}
           </span>
          ))}
         </div>
        )}
       </div>
       <div className="flex items-center justify-between">
        <p className="text-[10px]" style={{ color: '#999' }}>{storefrontConfig.storeName}</p>
        <p className="text-[10px]" style={{ color: '#BBB' }}>Powered by WAXED</p>
       </div>
      </div>
     </div>
    </div>

    {/* ── Right: Editor Panel ── */}
    <div className="lg:col-span-2 min-h-0 overflow-y-auto space-y-4 pb-6">

     {/* Customize */}
     <div className="bg-waxe-card border border-waxe-border p-5 clip-card">
      <h2 className="text-[11px] font-semibold text-waxe-text mb-2">Customize</h2>
      <div className="hatch-divider mb-4" />
      <div className="space-y-3">
       <div>
        <label className="label-text">Store Name</label>
        <input type="text" className="input-field" defaultValue={storefrontConfig.storeName} />
       </div>
       <div>
        <label className="label-text">Description</label>
        <textarea className="input-field resize-none h-16" defaultValue={storefrontConfig.description} />
       </div>
       <div className="grid grid-cols-2 gap-3">
        <div>
         <label className="label-text">Primary</label>
         <div className="flex items-center gap-2">
          <div className="w-7 h-7 border border-waxe-border" style={{ background: storefrontConfig.primaryColor }} />
          <span className="text-[11px] font-mono text-waxe-text-muted">{storefrontConfig.primaryColor}</span>
         </div>
        </div>
        <div>
         <label className="label-text">Accent</label>
         <div className="flex items-center gap-2">
          <div className="w-7 h-7 border border-waxe-border" style={{ background: storefrontConfig.accentColor }} />
          <span className="text-[11px] font-mono text-waxe-text-muted">{storefrontConfig.accentColor}</span>
         </div>
        </div>
       </div>
       <div className="grid grid-cols-2 gap-3">
        <div>
         <label className="label-text">Logo</label>
         <div className="border border-dashed border-waxe-border hover:border-waxe-border-hover p-3 text-center cursor-pointer transition-colors">
          <p className="text-xs text-waxe-text-muted mb-0.5">↑ Upload</p>
          <p className="text-[10px] text-waxe-text-muted">PNG, SVG</p>
         </div>
        </div>
        <div>
         <label className="label-text">Header Image</label>
         <div className="border border-dashed border-waxe-border hover:border-waxe-border-hover p-3 text-center cursor-pointer transition-colors">
          <p className="text-xs text-waxe-text-muted mb-0.5">↑ Upload</p>
          <p className="text-[10px] text-waxe-text-muted">JPG, PNG</p>
         </div>
        </div>
       </div>
      </div>
     </div>

     {/* Social Links */}
     <div className="bg-waxe-card border border-waxe-border p-5 clip-card">
      <h2 className="text-[11px] font-semibold text-waxe-text mb-2">Social Links</h2>
      <div className="hatch-divider mb-4" />
      <div className="space-y-2">
       {socialPlatforms.map((platform) => (
        <div key={platform.key} className="flex items-center gap-2">
         <span className="w-6 h-6 flex items-center justify-center text-sm text-waxe-text-muted shrink-0">{platform.icon}</span>
         <input
          type="text"
          placeholder={platform.label}
          className="input-field text-xs flex-1"
          value={socialLinks[platform.key] || ''}
          onChange={(e) => setSocialLinks({ ...socialLinks, [platform.key]: e.target.value || undefined })}
         />
        </div>
       ))}
      </div>
     </div>

     {/* Shelves */}
     <div className="bg-waxe-card border border-waxe-border p-5 clip-card">
      <div className="flex items-center justify-between mb-2">
       <h2 className="text-[11px] font-semibold text-waxe-text">Shelves</h2>
       <button className="btn-ghost text-xs">+ Add</button>
      </div>
      <div className="hatch-divider mb-3" />
      <div className="space-y-2">
       {shelves.map((shelf, i) => (
        <div key={shelf.id} className="relative">
         <div className="flex items-start gap-2">
          <div className="flex-1 min-w-0">
           <ShelfCard
            shelf={shelf}
            isSelected={i === selectedShelf}
            onSelect={() => setSelectedShelf(i)}
            artworkMap={artworkMap}
           />
          </div>
          <div className="relative shrink-0 pt-1">
           <button
            onClick={() => setEditingShelf(editingShelf === shelf.id ? null : shelf.id)}
            className={`text-[10px] font-medium px-2 py-1 border transition-colors ${
             editingShelf === shelf.id
              ? 'bg-waxe-text text-waxe-deep border-waxe-text'
              : 'text-waxe-text-muted border-waxe-border hover:border-waxe-border-hover hover:text-waxe-text'
            }`}
           >
            Edit
           </button>
           {editingShelf === shelf.id && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-waxe-card border border-waxe-border shadow-lg z-20">
             <button
              className="w-full text-left text-[11px] text-waxe-text px-3 py-2 hover:bg-waxe-surface/50 transition-colors"
              onClick={() => setEditingShelf(null)}
             >
              Replace — add/remove items
             </button>
             <button
              className="w-full text-left text-[11px] text-waxe-text px-3 py-2 hover:bg-waxe-surface/50 transition-colors border-t border-waxe-border"
              onClick={() => setEditingShelf(null)}
             >
              Reorder — rearrange items
             </button>
             <div className="flex items-center justify-between px-3 py-2 border-t border-waxe-border">
              <span className="text-[11px] text-waxe-text-muted">Auto-manage shelf</span>
              <button
               onClick={() => setAutoManagedShelves(prev => ({ ...prev, [shelf.id]: !prev[shelf.id] }))}
               className={`w-8 h-4 rounded-full relative transition-colors ${
                autoManagedShelves[shelf.id] ? 'bg-waxe-positive' : 'bg-waxe-border'
               }`}
              >
               <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${
                autoManagedShelves[shelf.id] ? 'translate-x-4' : 'translate-x-0.5'
               }`} />
              </button>
             </div>
            </div>
           )}
          </div>
         </div>
        </div>
       ))}
      </div>
     </div>

     {/* Selected shelf records */}
     <div className="bg-waxe-card border border-waxe-border p-5 clip-card">
      <div className="flex items-center justify-between mb-2">
       <h2 className="text-[11px] font-semibold text-waxe-text">{activeShelf.name}</h2>
       <button className="btn-ghost text-xs">+ Add</button>
      </div>
      <div className="hatch-divider mb-3" />
      <div className="space-y-1">
       {activeShelf.records.map((record) => (
        <div key={record.id} className="flex items-center justify-between py-2 px-2 hover:bg-waxe-surface/30 transition-colors">
         <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 bg-waxe-surface overflow-hidden shrink-0">
           {artworkMap[record.id] ? (
            <img src={artworkMap[record.id]} alt="" className="w-full h-full object-cover" />
           ) : (
            <div className="w-full h-full flex items-center justify-center text-[11px] font-medium text-waxe-text-muted">
             {record.artist.split(' ').pop()?.charAt(0)}
            </div>
           )}
          </div>
          <div className="min-w-0">
           <p className="text-xs text-waxe-text truncate">{record.artist}</p>
           <p className="text-[11px] text-waxe-text-muted truncate">{record.title}</p>
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

   {/* Full-size Preview Modal */}
   {previewExpanded && (
    <div className="fixed inset-0 z-50 flex flex-col">
     <div className="absolute inset-0 bg-waxe-text/50 backdrop-blur-sm" onClick={() => setPreviewExpanded(false)} />
     <div className="relative flex-1 m-4 lg:m-8 bg-white shadow-2xl flex flex-col overflow-hidden" style={{ borderRadius: '12px' }}>
      {/* Browser chrome */}
      <div className="shrink-0 flex items-center justify-between px-4 py-2.5 border-b" style={{ borderColor: '#E5E5E5', background: '#F5F5F5' }}>
       <div className="flex items-center gap-2">
        <div className="flex gap-1.5">
         <button onClick={() => setPreviewExpanded(false)} className="w-3 h-3 rounded-full bg-[#FF5F57] hover:bg-[#FF3B30] transition-colors" />
         <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
         <span className="w-3 h-3 rounded-full bg-[#28C840]" />
        </div>
        <div className="ml-4 px-3 py-1 bg-white border text-[11px] text-[#888] font-mono" style={{ borderColor: '#DDD', borderRadius: '6px', minWidth: '300px' }}>
         {storefrontConfig.url}
        </div>
       </div>
       <button onClick={() => setPreviewExpanded(false)} className="text-[11px] text-[#888] hover:text-[#333] transition-colors px-2 py-1">
        ✕ Close
       </button>
      </div>
      {/* Full preview content */}
      <div className="flex-1 overflow-y-auto" style={{ background: storefrontConfig.primaryColor, color: '#111', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
       {/* Nav bar */}
       <div className="flex items-center justify-between px-8 py-4 border-b" style={{ borderColor: '#E5E5E5' }}>
        <div className="flex items-center gap-6">
         <span className="text-xs font-medium" style={{ color: '#888' }}>Vinyl</span>
         <span className="text-xs font-medium" style={{ color: '#888' }}>New Arrivals</span>
         <span className="text-xs font-medium" style={{ color: '#888' }}>Genres</span>
        </div>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm text-white font-bold" style={{ background: storefrontConfig.accentColor }}>
         {storefrontConfig.logoText}
        </div>
        <div className="flex items-center gap-4">
         {activeSocials.map((p) => (
          <span key={p.key} className="text-xs font-medium" style={{ color: '#888' }}>{p.icon}</span>
         ))}
         <span className="text-xs" style={{ color: '#888' }}>♡</span>
         <span className="text-xs" style={{ color: '#888' }}>☰</span>
        </div>
       </div>

       {/* Hero */}
       <div className="px-8 pt-8 pb-4">
        <p className="text-xs leading-relaxed mb-4" style={{ color: '#999', maxWidth: '50%' }}>
         {storefrontConfig.description}
        </p>
        <h1 className="font-semibold leading-[0.85]" style={{ fontSize: 'clamp(3rem, 10vw, 6rem)', color: '#111' }}>
         {storefrontConfig.storeName.split(' ').map((word, i) => (
          <span key={i} className="block">{word}</span>
         ))}
        </h1>
        <button className="mt-6 px-5 py-2 text-xs font-medium text-white rounded-full" style={{ background: storefrontConfig.accentColor }}>
         Go to e-shop
        </button>
       </div>

       {/* Shelves */}
       {shelves.map((shelf, si) => (
        <div key={shelf.id} className="px-8 py-6">
         <div className="flex items-baseline gap-2 mb-4">
          <h2 className={`font-semibold ${si === 0 ? 'text-2xl' : 'text-lg'}`} style={{ color: storefrontConfig.accentColor }}>
           {shelf.name}
          </h2>
          <span className="text-xs" style={{ color: '#999' }}>{shelf.recordCount} records</span>
          <span className="ml-auto text-xs underline" style={{ color: '#666' }}>View all →</span>
         </div>
         <div className={`grid gap-3 ${si === 0 ? 'grid-cols-4 lg:grid-cols-6' : 'grid-cols-3 lg:grid-cols-5'}`}>
          {(si === 0 ? featuredRecords : shelf.records.map(r => recordMap[r.id]).filter(Boolean)).map((record) => (
           <div key={record.id}>
            <div className="aspect-square overflow-hidden mb-1.5" style={{ background: '#EFEFEF' }}>
             {record.artworkUrl ? (
              <img src={record.artworkUrl} alt="" className="w-full h-full object-cover" />
             ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl" style={{ color: '#CCC' }}>
               {record.artist.charAt(0)}
              </div>
             )}
            </div>
            <p className="text-xs truncate" style={{ color: '#333' }}>{record.artist} — {record.title}</p>
            <p className="text-xs font-medium" style={{ color: '#111' }}>${record.price.toFixed(2)}</p>
           </div>
          ))}
         </div>
        </div>
       ))}

       {/* Footer */}
       <div className="px-8 py-8 border-t" style={{ borderColor: '#E5E5E5', background: '#F9F9F9' }}>
        <div className="flex items-center justify-between mb-4">
         <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm text-white font-bold" style={{ background: storefrontConfig.accentColor }}>
          {storefrontConfig.logoText}
         </div>
         {activeSocials.length > 0 && (
          <div className="flex items-center gap-3">
           {activeSocials.map((p) => (
            <span key={p.key} className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: '#333' }}>
             {p.icon}
            </span>
           ))}
          </div>
         )}
        </div>
        <div className="flex items-center justify-between">
         <p className="text-xs" style={{ color: '#999' }}>{storefrontConfig.storeName}</p>
         <p className="text-xs" style={{ color: '#BBB' }}>Powered by WAXED</p>
        </div>
       </div>
      </div>
     </div>
    </div>
   )}
  </div>
 )
}
