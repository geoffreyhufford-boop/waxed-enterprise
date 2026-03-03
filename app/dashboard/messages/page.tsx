'use client'

import { useState } from 'react'
import { DashboardHeader, MessageThread, StatusBadge } from '@/components/dashboard'
import { conversations, networkConversations } from '@/lib/dashboard-data'
import { customerProfiles } from '@/lib/customer-data'

export default function MessagesPage() {
 const [activeTab, setActiveTab] = useState<'marketplace' | 'network'>('marketplace')
 const [activeConv, setActiveConv] = useState(0)
 const [search, setSearch] = useState('')
 const [showCompose, setShowCompose] = useState(false)
 const [showBroadcast, setShowBroadcast] = useState(false)

 const allConversations = activeTab === 'marketplace' ? conversations : networkConversations
 const active = allConversations[activeConv] || allConversations[0]

 const filteredConversations = allConversations.filter((c) =>
  c.customerName.toLowerCase().includes(search.toLowerCase()) ||
  c.lastMessage.toLowerCase().includes(search.toLowerCase())
 )

 const totalUnread = conversations.reduce((sum, c) => sum + c.unread, 0) +
  networkConversations.reduce((sum, c) => sum + c.unread, 0)

 return (
  <div className="flex flex-col flex-1 min-h-0">
   <DashboardHeader
    title="Messages"
    subtitle={`${totalUnread} unread messages`}
    actions={
     <div className="flex gap-2">
      <button className="btn-secondary text-sm px-4 py-2" onClick={() => setShowBroadcast(true)}>Broadcast</button>
      <button className="btn-primary text-sm px-4 py-2" onClick={() => setShowCompose(true)}>+ Compose</button>
     </div>
    }
   />

   {/* Tab bar */}
   <div className="shrink-0 flex gap-1.5 pb-3 mb-3 w-fit border-b border-waxe-border pr-4">
    {([
     { key: 'marketplace' as const, label: 'Marketplace', count: conversations.reduce((s, c) => s + c.unread, 0) },
     { key: 'network' as const, label: 'Network', count: networkConversations.reduce((s, c) => s + c.unread, 0) },
    ]).map((tab) => (
     <button
      key={tab.key}
      onClick={() => { setActiveTab(tab.key); setActiveConv(0) }}
      className={`text-[11px] font-medium px-3 py-1.5 border ${
       activeTab === tab.key
        ? 'bg-waxe-text text-waxe-deep border-waxe-text'
        : 'text-waxe-text bg-waxe-card/80 backdrop-blur-sm border-waxe-border hover:border-waxe-border-hover'
      }`}
     >
      {tab.label}
      {tab.count > 0 && (
       <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 text-[11px] font-medium bg-waxe-warm text-waxe-deep">{tab.count}</span>
      )}
     </button>
    ))}
   </div>

   <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-0 border border-waxe-border overflow-hidden clip-card">
    {/* Left: Conversation List */}
    <div className="lg:col-span-1 border-r border-waxe-border bg-waxe-card/30 flex flex-col">
     <div className="p-3 border-b border-waxe-border">
      <input
       type="text"
       placeholder="Search conversations..."
       className="input-field text-sm py-2"
       value={search}
       onChange={(e) => setSearch(e.target.value)}
      />
     </div>
     <div className="flex-1 overflow-y-auto">
      {filteredConversations.map((conv) => (
       <MessageThread
        key={conv.id}
        conversation={conv}
        isActive={allConversations.indexOf(conv) === activeConv}
        onClick={() => setActiveConv(allConversations.indexOf(conv))}
       />
      ))}
     </div>
    </div>

    {/* Right: Active Chat */}
    <div className="lg:col-span-2 flex flex-col bg-waxe-deep/50">
     {/* Chat Header */}
     <div className="px-6 py-4 border-b border-waxe-border flex items-center justify-between">
      <div className="relative z-10 flex items-center gap-3">
       <div className="glyph-box" style={{ width: '36px', height: '36px', fontSize: '12px', borderRadius: '50%' }}>
        {active.customerName.split(' ').map(n => n[0]).join('')}
       </div>
       <div>
        <p className="text-sm font-semibold text-waxe-text">{active.customerName}</p>
        <p className="text-xs text-waxe-text-muted">Last active: {active.lastTime}</p>
       </div>
      </div>
     </div>

     {/* Messages */}
     <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {active.messages.map((msg) => (
       <div key={msg.id} className={`flex ${msg.sender === 'dealer' ? 'justify-end' : 'justify-start'}`}>
        <div>
         <div className={msg.sender === 'dealer' ? 'message-outbound' : 'message-inbound'}>
          {msg.text}
         </div>
         <div className={`flex items-center gap-2 mt-1 ${msg.sender === 'dealer' ? 'justify-end' : 'justify-start'}`}>
          <span className="text-[11px] text-waxe-text-muted">{msg.time}</span>
          {msg.linkedItem && (
           <span className="text-[11px] text-waxe-cool font-mono">&#x27C1; {msg.linkedItem}</span>
          )}
         </div>
        </div>
       </div>
      ))}
     </div>

     {/* Message Input */}
     <div className="p-4 border-t border-waxe-border">
      <div className="flex items-center gap-3">
       <input
        type="text"
        placeholder="Type a message..."
        className="input-field flex-1"
       />
       <button className="btn-primary px-5 py-3">Send</button>
      </div>
     </div>
    </div>
   </div>

   {/* Compose Modal */}
   {showCompose && (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
     <div className="absolute inset-0 bg-waxe-text/40" onClick={() => setShowCompose(false)} />
     <div className="relative w-full max-w-lg bg-waxe-base border border-waxe-border shadow-xl clip-modal p-5">
      <div className="flex items-center justify-between mb-4">
       <h2 className="text-lg font-semibold text-waxe-text">New Message</h2>
       <button onClick={() => setShowCompose(false)} className="text-waxe-text-muted hover:text-waxe-text text-lg">&times;</button>
      </div>
      <div className="space-y-3">
       <div>
        <label className="text-xs font-medium text-waxe-text-muted mb-1.5 block">To:</label>
        <input type="text" className="input-field" placeholder="Customer or store name..." autoFocus />
       </div>
       <div>
        <label className="text-xs font-medium text-waxe-text-muted mb-1.5 block">Message:</label>
        <textarea className="input-field min-h-[100px] resize-y" placeholder="Type your message..." />
       </div>
       <div className="flex justify-end gap-2 pt-2">
        <button className="btn-secondary text-sm px-4 py-2" onClick={() => setShowCompose(false)}>Cancel</button>
        <button className="btn-primary text-sm px-4 py-2" onClick={() => setShowCompose(false)}>Send</button>
       </div>
      </div>
     </div>
    </div>
   )}

   {/* Broadcast Modal */}
   {showBroadcast && (
    <BroadcastModal onClose={() => setShowBroadcast(false)} />
   )}
  </div>
 )
}

// ─── Broadcast Modal Component ───────────────────────────────

type BroadcastChannel = 'email' | 'sms' | 'push'
type AudienceSegment = 'all' | 'vip' | 'wholesale' | 'retail'

const channelOptions: { key: BroadcastChannel; label: string; description: string }[] = [
 { key: 'email', label: 'Email', description: 'Send to customer email addresses' },
 { key: 'sms', label: 'SMS', description: 'Text message to phone numbers on file' },
 { key: 'push', label: 'Push Notification', description: 'In-app notification via storefront' },
]

const segmentOptions: { key: AudienceSegment; label: string }[] = [
 { key: 'all', label: 'All Customers' },
 { key: 'vip', label: 'VIP' },
 { key: 'wholesale', label: 'Wholesale' },
 { key: 'retail', label: 'Retail' },
]

function BroadcastModal({ onClose }: { onClose: () => void }) {
 const [channels, setChannels] = useState<Set<BroadcastChannel>>(new Set(['email']))
 const [audience, setAudience] = useState<AudienceSegment>('all')
 const [subject, setSubject] = useState('')
 const [body, setBody] = useState('')
 const [sent, setSent] = useState(false)

 const recipientCount = audience === 'all'
  ? customerProfiles.length
  : customerProfiles.filter((c) => c.tier === audience).length

 const toggleChannel = (ch: BroadcastChannel) => {
  const next = new Set(channels)
  if (next.has(ch)) {
   if (next.size > 1) next.delete(ch)
  } else {
   next.add(ch)
  }
  setChannels(next)
 }

 return (
  <div className="fixed inset-0 z-50 flex items-start justify-center pt-[5vh]">
   <div className="absolute inset-0 bg-waxe-text/40" onClick={onClose} />
   <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden bg-waxe-base border border-waxe-border shadow-xl clip-modal">
    {/* Header */}
    <div className="shrink-0 bg-waxe-base border-b border-waxe-border p-5 z-10">
     <div className="flex items-center justify-between">
      <div>
       <h2 className="text-xl font-semibold text-waxe-text">Broadcast Message</h2>
       <p className="text-xs text-waxe-text-muted mt-1">Send to multiple customers at once</p>
      </div>
      <button onClick={onClose} className="text-waxe-text-muted hover:text-waxe-text text-lg">✕</button>
     </div>
    </div>

    {/* Body */}
    <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-5">
     {sent ? (
      <div className="text-center py-12">
       <p className="text-2xl mb-2">✓</p>
       <p className="text-lg font-semibold text-waxe-text mb-1">Broadcast Queued</p>
       <p className="text-sm text-waxe-text-secondary mb-1">
        Sending to {recipientCount} {audience === 'all' ? 'customers' : `${audience} customers`}
       </p>
       <p className="text-xs text-waxe-text-muted">
        via {[...channels].map((ch) => channelOptions.find((c) => c.key === ch)?.label).join(' + ')}
       </p>
       <button className="btn-secondary text-sm px-4 py-2 mt-6" onClick={onClose}>Done</button>
      </div>
     ) : (
      <>
       {/* Channel Selection */}
       <div>
        <p className="text-[10px] font-medium text-waxe-text-muted mb-2">Channels</p>
        <div className="grid grid-cols-3 gap-2">
         {channelOptions.map((ch) => (
          <button
           key={ch.key}
           onClick={() => toggleChannel(ch.key)}
           className={`p-3 border text-left transition-colors ${
            channels.has(ch.key)
             ? 'border-waxe-text bg-waxe-surface/30'
             : 'border-waxe-border hover:border-waxe-border-hover'
           }`}
          >
           <p className="text-sm font-medium text-waxe-text mb-0.5">{ch.label}</p>
           <p className="text-[10px] text-waxe-text-muted">{ch.description}</p>
          </button>
         ))}
        </div>
       </div>

       {/* Audience Segment */}
       <div>
        <p className="text-[10px] font-medium text-waxe-text-muted mb-2">Audience</p>
        <div className="flex gap-1.5">
         {segmentOptions.map((seg) => {
          const count = seg.key === 'all'
           ? customerProfiles.length
           : customerProfiles.filter((c) => c.tier === seg.key).length
          return (
           <button
            key={seg.key}
            onClick={() => setAudience(seg.key)}
            className={`text-[11px] font-medium px-3 py-1.5 border transition-colors ${
             audience === seg.key
              ? 'bg-waxe-text text-waxe-deep border-waxe-text'
              : 'text-waxe-text bg-waxe-card/80 backdrop-blur-sm border-waxe-border hover:border-waxe-border-hover'
            }`}
           >
            {seg.label}
            <span className="ml-1.5 text-[10px] opacity-60">{count}</span>
           </button>
          )
         })}
        </div>
        <p className="text-xs text-waxe-text-muted mt-2">
         {recipientCount} recipient{recipientCount !== 1 ? 's' : ''} selected
        </p>
       </div>

       {/* Subject (email only) */}
       {channels.has('email') && (
        <div>
         <label className="text-xs font-medium text-waxe-text-muted mb-1.5 block">Subject</label>
         <input
          type="text"
          className="input-field"
          placeholder="Email subject line..."
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
         />
        </div>
       )}

       {/* Message Body */}
       <div>
        <label className="text-xs font-medium text-waxe-text-muted mb-1.5 block">Message</label>
        <textarea
         className="input-field min-h-[120px] resize-y"
         placeholder="Write your message..."
         value={body}
         onChange={(e) => setBody(e.target.value)}
        />
        <p className="text-[10px] text-waxe-text-muted mt-1">
         Use {'{{name}}'} to personalize with customer name
        </p>
       </div>

       {/* Preview */}
       {body && (
        <div className="bg-waxe-surface/30 border border-waxe-border/50 p-4">
         <p className="text-[10px] font-medium text-waxe-text-muted mb-2">Preview</p>
         <div className="bg-waxe-card border border-waxe-border p-3">
          {channels.has('email') && subject && (
           <p className="text-xs font-semibold text-waxe-text mb-1">{subject}</p>
          )}
          <p className="text-sm text-waxe-text-secondary leading-relaxed">
           {body.replace(/\{\{name\}\}/g, 'Sarah Mitchell')}
          </p>
         </div>
        </div>
       )}
      </>
     )}
    </div>

    {/* Footer */}
    {!sent && (
     <div className="shrink-0 bg-waxe-card border-t border-waxe-border p-5 flex items-center justify-between">
      <p className="text-xs text-waxe-text-muted">
       {[...channels].map((ch) => channelOptions.find((c) => c.key === ch)?.label).join(' + ')} → {recipientCount} recipients
      </p>
      <div className="flex gap-2">
       <button className="btn-secondary text-sm px-4 py-2" onClick={onClose}>Cancel</button>
       <button
        className="btn-primary text-sm px-4 py-2"
        onClick={() => setSent(true)}
       >
        Send Broadcast
       </button>
      </div>
     </div>
    )}
   </div>
  </div>
 )
}
