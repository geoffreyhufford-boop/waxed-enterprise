'use client'

import { useState, useMemo } from 'react'
import { DashboardHeader, StatCard, StatusBadge } from '@/components/dashboard'
import { customerProfiles, type CustomerProfile } from '@/lib/customer-data'
import { getCreditAccount, getCreditTransactions } from '@/lib/store-credit-data'
import { discountRules } from '@/lib/settings-data'

export default function CustomersPage() {
 const [search, setSearch] = useState('')
 const [tierFilter, setTierFilter] = useState<string>('All')
 const [selectedCustomer, setSelectedCustomer] = useState<CustomerProfile>(customerProfiles[0])
 const [showIssueCredit, setShowIssueCredit] = useState(false)
 const [issueCreditAmount, setIssueCreditAmount] = useState('')
 const [issueCreditNote, setIssueCreditNote] = useState('')

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

 const totalRevenue = customerProfiles.reduce((s, c) => s + c.totalSpend, 0)
 const vipCount = customerProfiles.filter((c) => c.tier === 'vip').length

 return (
  <div className="flex flex-col flex-1 min-h-0">
   <DashboardHeader
    title="Customers"
    subtitle="Profiles, want lists & purchase history"
   />

   {/* Stats Row */}
   <div className="shrink-0 grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4 p-2 -m-2">
    <StatCard label="Total Customers" value={String(customerProfiles.length)} />
    <StatCard label="VIP Customers" value={String(vipCount)} />
    <StatCard label="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} />
    <StatCard label="Avg Order Value" value={`$${(totalRevenue / customerProfiles.reduce((s, c) => s + c.orderCount, 0)).toFixed(2)}`} />
   </div>

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
        onClick={() => setSelectedCustomer(customer)}
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
    <div className="lg:col-span-2 flex flex-col bg-waxe-deep/50 overflow-y-auto">
     {/* Header */}
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
      {selectedCustomer.conversationId && (
       <a href="/dashboard/messages" className="btn-ghost text-sm">Open Conversation →</a>
      )}
     </div>

     <div className="p-6 space-y-5">
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
  </div>
 )
}
