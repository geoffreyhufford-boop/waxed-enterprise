'use client'

import { useState, useMemo } from 'react'
import { DashboardHeader, StatusBadge, MessageThread } from '@/components/dashboard'
import { customerProfiles, type CustomerProfile } from '@/lib/customer-data'
import { conversations, networkConversations } from '@/lib/dashboard-data'
import { getCreditAccount, getCreditTransactions } from '@/lib/store-credit-data'
import { discountRules } from '@/lib/settings-data'

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

export default function CustomersPage() {
 const [search, setSearch] = useState('')
 const [tierFilter, setTierFilter] = useState<string>('All')
 const [selectedCustomer, setSelectedCustomer] = useState<CustomerProfile>(customerProfiles[0])
 const [showIssueCredit, setShowIssueCredit] = useState(false)
 const [issueCreditAmount, setIssueCreditAmount] = useState('')
 const [issueCreditNote, setIssueCreditNote] = useState('')
 const [detailView, setDetailView] = useState<'info' | 'messages'>('info')
 const [showBroadcast, setShowBroadcast] = useState(false)
 const [showCompose, setShowCompose] = useState(false)

 const filtered = useMemo(() =>
  customerProfiles.filter((c) => {
   if (search) {
    const q = search.toLowerCase()
    if (!c.name.toLowerCase().includes(q) && !c.email.toLowerCase().includes(q)) return false
   }
   if (tierFilter !== 'All' && c.tier !== tierFilter) return false
   return true
  }),
  [search, tierFilter]
 )

 // Find conversation for the selected customer
 const allConversations = [...conversations, ...networkConversations]
 const customerConversation = selectedCustomer.conversationId
  ? allConversations.find((c) => c.id === selectedCustomer.conversationId)
  : null

 const totalUnread = conversations.reduce((sum, c) => sum + c.unread, 0) +
  networkConversations.reduce((sum, c) => sum + c.unread, 0)

 return (
  <div className="flex flex-col flex-1 min-h-0">
   <DashboardHeader
    title="Customers"
    subtitle={`${customerProfiles.length} customers · ${totalUnread} unread messages`}
    actions={
     <div className="flex gap-2">
      <button className="btn-secondary text-sm px-4 py-2" onClick={() => setShowBroadcast(true)}>Broadcast</button>
      <button className="btn-primary text-sm px-4 py-2" onClick={() => setShowCompose(true)}>+ Compose</button>
     </div>
    }
   />

   {/* Main Grid */}
   <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-0 border border-waxe-border overflow-hidden clip-card">

    {/* Left: Customer List */}
    <div className="lg:col-span-1 border-r border-waxe-border bg-waxe-card/30 flex flex-col">
     <div className="p-3 border-b border-waxe-border space-y-2">
      <input
       type="text"
       placeholder="Search customers..."
       className="input-field text-sm py-2"
       value={search}
       onChange={(e) => setSearch(e.target.value)}
      />
      <div className="flex gap-1">
       {['All', 'vip', 'wholesale', 'retail'].map((tier) => (
        <button
         key={tier}
         onClick={() => setTierFilter(tier)}
         className={`text-[10px] font-medium px-2 py-1 border ${
          tierFilter === tier
           ? 'bg-waxe-text text-waxe-deep border-waxe-text'
           : 'text-waxe-text bg-waxe-card/80 backdrop-blur-sm border-waxe-border hover:border-waxe-border-hover'
         }`}
        >
         {tier}
        </button>
       ))}
      </div>
     </div>
     <div className="flex-1 overflow-y-auto">
      {filtered.map((customer) => (
       <button
        key={customer.id}
        onClick={() => { setSelectedCustomer(customer); setDetailView('info') }}
        className={`w-full text-left px-4 py-3 border-b border-waxe-border/30 transition-colors ${
         selectedCustomer.id === customer.id
          ? 'bg-waxe-surface/50'
          : 'hover:bg-waxe-surface/20'
        }`}
       >
        <div className="flex items-center justify-between mb-1">
         <span className="text-sm font-medium text-waxe-text">{customer.name}</span>
         <StatusBadge status={customer.tier} />
        </div>
        <div className="flex items-center justify-between">
         <span className="text-xs text-waxe-text-muted">{customer.email}</span>
         <span className="text-xs font-mono text-waxe-text-secondary">${customer.totalSpend.toLocaleString()}</span>
        </div>
       </button>
      ))}
     </div>
    </div>

    {/* Right: Customer Detail */}
    <div className="lg:col-span-2 flex flex-col bg-waxe-deep/50">
     {/* Header with toggle */}
     <div className="px-6 py-4 border-b border-waxe-border flex items-center justify-between">
      <div className="relative z-10 flex items-center gap-3">
       <div className="glyph-box" style={{ width: '36px', height: '36px', fontSize: '12px', borderRadius: '50%' }}>
        {selectedCustomer.name.split(' ').map(n => n[0]).join('')}
       </div>
       <div>
        <div className="flex items-center gap-2">
         <p className="text-sm font-semibold text-waxe-text">{selectedCustomer.name}</p>
         <StatusBadge status={selectedCustomer.tier} />
        </div>
        <p className="text-xs text-waxe-text-muted">{selectedCustomer.email}{selectedCustomer.phone ? ` · ${selectedCustomer.phone}` : ''}</p>
       </div>
      </div>
      <div className="flex gap-1">
       <button
        onClick={() => setDetailView('info')}
        className={`text-[11px] font-medium px-3 py-1.5 border transition-colors ${
         detailView === 'info'
          ? 'bg-waxe-text text-waxe-deep border-waxe-text'
          : 'text-waxe-text bg-waxe-card/80 border-waxe-border hover:border-waxe-border-hover'
        }`}
       >
        Info
       </button>
       <button
        onClick={() => setDetailView('messages')}
        className={`text-[11px] font-medium px-3 py-1.5 border transition-colors ${
         detailView === 'messages'
          ? 'bg-waxe-text text-waxe-deep border-waxe-text'
          : 'text-waxe-text bg-waxe-card/80 border-waxe-border hover:border-waxe-border-hover'
        }`}
       >
        Messages
        {customerConversation && customerConversation.unread > 0 && (
         <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 text-[9px] font-medium bg-waxe-warm text-waxe-deep">{customerConversation.unread}</span>
        )}
       </button>
      </div>
     </div>

     {detailView === 'info' ? (
      /* ─── Info View ─── */
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
       {/* Purchase Summary */}
       <div className="bg-waxe-surface/30 p-4">
        <p className="text-[10px] font-medium text-waxe-text-muted mb-3">Purchase Summary</p>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
         <div>
          <p className="text-xs text-waxe-text-muted mb-0.5">Total Spend</p>
          <p className="text-lg font-semibold text-waxe-text font-mono">${selectedCustomer.totalSpend.toLocaleString()}</p>
         </div>
         <div>
          <p className="text-xs text-waxe-text-muted mb-0.5">Orders</p>
          <p className="text-lg font-semibold text-waxe-text font-mono">{selectedCustomer.orderCount}</p>
         </div>
         <div>
          <p className="text-xs text-waxe-text-muted mb-0.5">Avg Order Value</p>
          <p className="text-lg font-semibold text-waxe-text font-mono">${selectedCustomer.avgOrderValue.toFixed(2)}</p>
         </div>
         <div>
          <p className="text-xs text-waxe-text-muted mb-0.5">Last Purchase</p>
          <p className="text-sm text-waxe-text">{selectedCustomer.lastPurchase}</p>
         </div>
         <div>
          <p className="text-xs text-waxe-text-muted mb-0.5">First Purchase</p>
          <p className="text-sm text-waxe-text">{selectedCustomer.firstPurchase}</p>
         </div>
         <div>
          <p className="text-xs text-waxe-text-muted mb-0.5">Favorite Genres</p>
          <div className="flex flex-wrap gap-1">
           {selectedCustomer.favoriteGenres.map((g) => (
            <span key={g} className="text-[10px] font-medium px-1.5 py-0.5 border border-waxe-border text-waxe-text-secondary">{g}</span>
           ))}
          </div>
         </div>
        </div>
       </div>

       {/* Store Credit */}
       {(() => {
        const creditAccount = getCreditAccount(selectedCustomer.id)
        const recentTxns = creditAccount ? getCreditTransactions(creditAccount.id).slice(-3).reverse() : []
        return (
         <div className="bg-waxe-surface/30 p-4">
          <p className="text-[10px] font-medium text-waxe-text-muted mb-3">Store Credit</p>
          {creditAccount ? (
           <div>
            <div className="grid grid-cols-3 gap-4 mb-3">
             <div>
              <p className="text-xs text-waxe-text-muted mb-0.5">Balance</p>
              <p className="text-xl font-bold text-waxe-text font-mono">${creditAccount.balance.toFixed(2)}</p>
             </div>
             <div>
              <p className="text-xs text-waxe-text-muted mb-0.5">Total Issued</p>
              <p className="text-sm font-medium text-waxe-text font-mono">${creditAccount.totalIssued.toFixed(2)}</p>
             </div>
             <div>
              <p className="text-xs text-waxe-text-muted mb-0.5">Total Redeemed</p>
              <p className="text-sm font-medium text-waxe-text font-mono">${creditAccount.totalRedeemed.toFixed(2)}</p>
             </div>
            </div>
            {recentTxns.length > 0 && (
             <div className="border-t border-waxe-border/30 pt-3">
              <p className="text-[10px] text-waxe-text-muted mb-2">Recent Transactions</p>
              <div className="space-y-1.5">
               {recentTxns.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between text-xs">
                 <div className="flex items-center gap-2">
                  <StatusBadge status={tx.type} />
                  <span className="text-waxe-text-secondary truncate max-w-[200px]">{tx.note}</span>
                 </div>
                 <span className={`font-mono font-medium ${tx.amount >= 0 ? 'text-waxe-positive' : 'text-waxe-negative'}`}>
                  {tx.amount >= 0 ? '+' : ''}{tx.amount.toFixed(2)}
                 </span>
                </div>
               ))}
              </div>
             </div>
            )}
            <button className="btn-ghost text-[11px] px-2 py-1 mt-3" onClick={() => setShowIssueCredit(true)}>+ Issue More Credit</button>
           </div>
          ) : (
           <div className="flex items-center justify-between">
            <p className="text-sm text-waxe-text-muted">No store credit account</p>
            <button className="btn-ghost text-[11px] px-2 py-1" onClick={() => setShowIssueCredit(true)}>Issue Credit</button>
           </div>
          )}
         </div>
        )
       })()}

       {/* Applicable Discounts */}
       {(() => {
        const applicable = discountRules.filter((d) => {
         if (!d.active) return false
         if (d.type === 'customer_tier' && d.customerTier !== selectedCustomer.tier) return false
         return true
        })
        return applicable.length > 0 ? (
         <div className="bg-waxe-surface/30 p-4">
          <p className="text-[10px] font-medium text-waxe-text-muted mb-3">Active Discounts ({applicable.length})</p>
          <div className="space-y-2">
           {applicable.map((rule) => (
            <div key={rule.id} className="flex items-center justify-between py-1.5">
             <div className="flex items-center gap-2">
              <StatusBadge status={rule.type} />
              <span className="text-sm text-waxe-text">{rule.name}</span>
             </div>
             <span className="text-sm font-semibold font-mono text-waxe-positive">{rule.value}% off</span>
            </div>
           ))}
          </div>
         </div>
        ) : null
       })()}

       {/* Want List */}
       <div className="bg-waxe-surface/30 p-4">
        <p className="text-[10px] font-medium text-waxe-text-muted mb-3">
         Want List ({selectedCustomer.wantList.length})
        </p>
        {selectedCustomer.wantList.length > 0 ? (
         <div className="space-y-2">
          {selectedCustomer.wantList.map((item) => (
           <div key={item.id} className="flex items-center justify-between py-2 border-b border-waxe-border/30 last:border-0">
            <div className="min-w-0">
             <p className="text-sm text-waxe-text font-medium truncate">
              {item.artist}{item.title ? ` — ${item.title}` : ''}
             </p>
             <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[11px] text-waxe-text-muted">Added {item.addedDate}</span>
              {item.genre && <span className="text-[10px] text-waxe-text-muted">({item.genre})</span>}
              {item.notes && <span className="text-[10px] text-waxe-cool italic">{item.notes}</span>}
             </div>
            </div>
            <span className={`text-sm ${item.notifyWhenAvailable ? 'text-waxe-warm' : 'text-waxe-text-muted'}`}>
             {item.notifyWhenAvailable ? '🔔' : '—'}
            </span>
           </div>
          ))}
         </div>
        ) : (
         <p className="text-sm text-waxe-text-muted">No items on want list</p>
        )}
       </div>

       {/* Notes */}
       <div className="bg-waxe-surface/30 p-4">
        <p className="text-[10px] font-medium text-waxe-text-muted mb-3">Notes</p>
        <p className="text-sm text-waxe-text-secondary leading-relaxed">{selectedCustomer.notes}</p>
       </div>
      </div>
     ) : (
      /* ─── Messages View ─── */
      customerConversation ? (
       <div className="flex-1 flex flex-col min-h-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
         {customerConversation.messages.map((msg) => (
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
        <div className="shrink-0 p-4 border-t border-waxe-border">
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
      ) : (
       <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-3">
         <p className="text-sm text-waxe-text-secondary">No conversation with {selectedCustomer.name}</p>
         <button className="btn-primary text-sm px-4 py-2" onClick={() => setShowCompose(true)}>Start Conversation</button>
        </div>
       </div>
      )
     )}
    </div>
   </div>

   {/* ─── Issue Credit Dialog ─── */}
   {showIssueCredit && (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
     <div className="absolute inset-0 bg-waxe-text/50" onClick={() => setShowIssueCredit(false)} />
     <div className="relative w-full max-w-sm bg-waxe-base border border-waxe-border shadow-xl p-6">
      <h3 className="text-lg font-semibold text-waxe-text mb-1">Issue Store Credit</h3>
      <p className="text-sm text-waxe-text-secondary mb-4">Credit for {selectedCustomer.name}</p>
      <div className="space-y-3">
       <div>
        <label className="text-xs text-waxe-text-muted mb-1 block">Amount</label>
        <input
         type="number"
         placeholder="0.00"
         className="w-full bg-waxe-deep border border-waxe-border text-sm text-waxe-text px-3 py-2 focus:outline-none focus:border-waxe-border-hover font-mono"
         value={issueCreditAmount}
         onChange={(e) => setIssueCreditAmount(e.target.value)}
        />
       </div>
       <div>
        <label className="text-xs text-waxe-text-muted mb-1 block">Note</label>
        <input
         type="text"
         placeholder="Reason for credit..."
         className="w-full bg-waxe-deep border border-waxe-border text-sm text-waxe-text px-3 py-2 focus:outline-none focus:border-waxe-border-hover"
         value={issueCreditNote}
         onChange={(e) => setIssueCreditNote(e.target.value)}
        />
       </div>
      </div>
      <div className="flex items-center justify-end gap-3 mt-5">
       <button className="btn-secondary text-sm px-4 py-2" onClick={() => { setShowIssueCredit(false); setIssueCreditAmount(''); setIssueCreditNote('') }}>Cancel</button>
       <button
        className="btn-primary text-sm px-4 py-2"
        onClick={() => { setShowIssueCredit(false); setIssueCreditAmount(''); setIssueCreditNote('') }}
       >
        Issue Credit
       </button>
      </div>
     </div>
    </div>
   )}

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
        <input type="text" className="input-field" placeholder="Customer or store name..." autoFocus defaultValue={detailView === 'messages' ? selectedCustomer.name : ''} />
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
   {showBroadcast && <BroadcastModal onClose={() => setShowBroadcast(false)} />}
  </div>
 )
}

// ─── Broadcast Modal Component ───────────────────────────────

const savedTemplates = [
 { id: 'tpl-1', name: 'Weekly Newsletter', subject: 'This Week at {{store}}', body: 'Hey {{name}}, here\'s what just hit the shelves this week...' },
 { id: 'tpl-2', name: 'New Drop Alert', subject: 'Fresh Arrivals', body: 'Hi {{name}}, we just got some heat in — come check it out before it\'s gone.' },
 { id: 'tpl-3', name: 'VIP Early Access', subject: 'Early Access — Just for You', body: '{{name}}, as a VIP you get first dibs on our latest stock. Browse now before we open it up.' },
]

function BroadcastModal({ onClose }: { onClose: () => void }) {
 const [channels, setChannels] = useState<Set<BroadcastChannel>>(new Set(['email']))
 const [audience, setAudience] = useState<AudienceSegment>('all')
 const [subject, setSubject] = useState('')
 const [body, setBody] = useState('')
 const [sent, setSent] = useState(false)
 const [showTemplates, setShowTemplates] = useState(false)
 const [savedAsTemplate, setSavedAsTemplate] = useState(false)

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
    <div className="shrink-0 bg-waxe-base border-b border-waxe-border p-5 z-10">
     <div className="flex items-center justify-between">
      <div>
       <h2 className="text-xl font-semibold text-waxe-text">Broadcast Message</h2>
       <p className="text-xs text-waxe-text-muted mt-1">Send to multiple customers at once</p>
      </div>
      <div className="flex items-center gap-2">
       <div className="relative">
        <button className="btn-ghost text-[11px] px-3 py-1" onClick={() => setShowTemplates(!showTemplates)}>
         Templates
        </button>
        {showTemplates && (
         <div className="absolute top-full right-0 mt-1 w-64 bg-waxe-card border border-waxe-border shadow-lg z-20">
          <p className="text-[10px] font-medium text-waxe-text-muted px-3 pt-2 pb-1">Saved Templates</p>
          {savedTemplates.map((tpl) => (
           <button
            key={tpl.id}
            className="w-full text-left px-3 py-2 hover:bg-waxe-surface/50 transition-colors border-t border-waxe-border/50"
            onClick={() => {
             setSubject(tpl.subject)
             setBody(tpl.body)
             setShowTemplates(false)
            }}
           >
            <p className="text-[12px] font-medium text-waxe-text">{tpl.name}</p>
            <p className="text-[10px] text-waxe-text-muted truncate">{tpl.body.slice(0, 60)}...</p>
           </button>
          ))}
         </div>
        )}
       </div>
       <button onClick={onClose} className="text-waxe-text-muted hover:text-waxe-text text-lg">✕</button>
      </div>
     </div>
    </div>

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
       <div className="flex items-center justify-center gap-3 mt-6">
        {!savedAsTemplate ? (
         <button className="btn-ghost text-sm px-4 py-2" onClick={() => setSavedAsTemplate(true)}>
          Save as Template
         </button>
        ) : (
         <span className="text-[12px] text-waxe-positive">Template saved</span>
        )}
        <button className="btn-secondary text-sm px-4 py-2" onClick={onClose}>Done</button>
       </div>
      </div>
     ) : (
      <>
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
