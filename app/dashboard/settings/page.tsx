'use client'

import { useState, useMemo } from 'react'
import { DashboardHeader, StatusBadge, DataTable } from '@/components/dashboard'
import { staffMembers, rolePermissions, auditLog, type AuditLogEntry } from '@/lib/settings-data'

export default function SettingsPage() {
 const [activeTab, setActiveTab] = useState<'team' | 'activity' | 'store' | 'operations'>('team')
 const [categoryFilter, setCategoryFilter] = useState<string>('All')
 const [staffFilter, setStaffFilter] = useState<string>('All')

 // Store Profile state
 const [storeName, setStoreName] = useState('Wax & Groove')
 const [storeEmail, setStoreEmail] = useState('')
 const [storePhone, setStorePhone] = useState('')
 const [storeStreet, setStoreStreet] = useState('')
 const [storeCity, setStoreCity] = useState('')
 const [storeState, setStoreState] = useState('')
 const [storeZip, setStoreZip] = useState('')
 const [businessType, setBusinessType] = useState('LLC')
 const [taxId, setTaxId] = useState('')
 const [currency, setCurrency] = useState('USD')
 const [timezone, setTimezone] = useState('America/New_York')

 // Operations state
 const [autoConfirmOrders, setAutoConfirmOrders] = useState(false)
 const [fulfillmentMethod, setFulfillmentMethod] = useState('Manual')
 const [orderPrefix, setOrderPrefix] = useState('WG-')
 const [lowStockThreshold, setLowStockThreshold] = useState(5)
 const [autoDelistSoldOut, setAutoDelistSoldOut] = useState(true)
 const [defaultCondition, setDefaultCondition] = useState('Near Mint')
 const [defaultCarrier, setDefaultCarrier] = useState('USPS')
 const [freeShippingThreshold, setFreeShippingThreshold] = useState(75)
 const [packingSlip, setPackingSlip] = useState(true)
 const [orderNotifEmail, setOrderNotifEmail] = useState(true)
 const [lowStockAlerts, setLowStockAlerts] = useState(true)
 const [dailySummary, setDailySummary] = useState(false)
 const [acceptStoreCredit, setAcceptStoreCredit] = useState(true)
 const [requirePhone, setRequirePhone] = useState(false)
 const [orderNotes, setOrderNotes] = useState(true)

 const filteredLog = useMemo(() =>
  auditLog.filter((entry) => {
   if (categoryFilter !== 'All' && entry.category !== categoryFilter) return false
   if (staffFilter !== 'All' && entry.userName !== staffFilter) return false
   return true
  }),
  [categoryFilter, staffFilter]
 )

 const staffNames = [...new Set(auditLog.map((e) => e.userName))]

 return (
  <div className="flex flex-col flex-1 min-h-0">
   <DashboardHeader
    title="Settings"
    subtitle="Team management, permissions & activity log"
   />

   {/* Tab bar */}
   <div className="shrink-0 flex gap-1.5 pb-3 mb-4 w-fit border-b border-waxe-border pr-4">
    {([
     { key: 'team' as const, label: 'Team & Permissions' },
     { key: 'activity' as const, label: 'Activity Log' },
     { key: 'store' as const, label: 'Store Profile' },
     { key: 'operations' as const, label: 'Operations' },
    ]).map((tab) => (
     <button
      key={tab.key}
      onClick={() => setActiveTab(tab.key)}
      className={`text-[11px] font-medium px-3 py-1.5 border ${
       activeTab === tab.key
        ? 'bg-waxe-text text-waxe-deep border-waxe-text'
        : 'text-waxe-text bg-waxe-card/80 backdrop-blur-sm border-waxe-border hover:border-waxe-border-hover'
      }`}
     >
      {tab.label}
     </button>
    ))}
   </div>

   <div className="flex-1 min-h-0 overflow-y-auto pb-6">
    {activeTab === 'team' && (
     <div className="space-y-6">
      {/* Staff Members */}
      <section>
       <div className="flex items-center justify-between mb-3">
        <h2 className="text-[11px] font-medium text-waxe-text-muted">Team Members</h2>
        <button className="btn-ghost text-sm">+ Invite</button>
       </div>
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {staffMembers.map((member) => (
         <div key={member.id} className="bg-waxe-card border border-waxe-border p-4 clip-card">
          <div className="flex items-start justify-between">
           <div className="flex items-center gap-3">
            <div className="glyph-box" style={{ width: '36px', height: '36px', fontSize: '12px', borderRadius: '50%' }}>
             {member.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
             <p className="text-sm font-medium text-waxe-text">{member.name}</p>
             <p className="text-xs text-waxe-text-muted">{member.email}</p>
            </div>
           </div>
           <div className="flex items-center gap-2">
            <StatusBadge status={member.role} label={member.role} />
            {member.status !== 'active' && (
             <StatusBadge status={member.status} />
            )}
           </div>
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-waxe-border/30">
           <span className="text-[11px] text-waxe-text-muted">Last active: {member.lastActive}</span>
           <span className="text-[11px] text-waxe-text-muted">Joined: {member.invitedAt}</span>
          </div>
         </div>
        ))}
       </div>
      </section>

      {/* Permissions Matrix */}
      <section>
       <h2 className="text-[11px] font-medium text-waxe-text-muted mb-3">Role Permissions</h2>
       <DataTable headers={['Feature', 'Owner', 'Manager', 'Cashier']}>
        {rolePermissions.map((perm) => (
         <tr key={perm.feature} className="table-row hover:bg-waxe-surface/30">
          <td className="px-4 py-2.5 text-sm text-waxe-text">{perm.feature}</td>
          <td className="px-4 py-2.5 text-center">
           <span className={`text-sm font-bold ${perm.owner ? 'text-waxe-positive' : 'text-waxe-text-muted'}`}>
            {perm.owner ? '✓' : '—'}
           </span>
          </td>
          <td className="px-4 py-2.5 text-center">
           <span className={`text-sm font-bold ${perm.manager ? 'text-waxe-positive' : 'text-waxe-text-muted'}`}>
            {perm.manager ? '✓' : '—'}
           </span>
          </td>
          <td className="px-4 py-2.5 text-center">
           <span className={`text-sm font-bold ${perm.cashier ? 'text-waxe-positive' : 'text-waxe-text-muted'}`}>
            {perm.cashier ? '✓' : '—'}
           </span>
          </td>
         </tr>
        ))}
       </DataTable>
      </section>
     </div>
    )}

    {activeTab === 'activity' && (
     <div>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
       <div className="flex items-center gap-1.5">
        <span className="text-[10px] font-medium text-waxe-text-muted">Category:</span>
        {['All', 'inventory', 'orders', 'settings', 'pricing', 'customers', 'store_credit'].map((cat) => (
         <button
          key={cat}
          onClick={() => setCategoryFilter(cat)}
          className={`text-[10px] font-medium px-2 py-1 border ${
           categoryFilter === cat
            ? 'bg-waxe-text text-waxe-deep border-waxe-text'
            : 'text-waxe-text bg-waxe-card/80 backdrop-blur-sm border-waxe-border hover:border-waxe-border-hover'
          }`}
         >
          {cat}
         </button>
        ))}
       </div>
       <div className="flex items-center gap-1.5 ml-4">
        <span className="text-[10px] font-medium text-waxe-text-muted">Staff:</span>
        <select
         className="bg-waxe-card border border-waxe-border text-xs text-waxe-text px-2 py-1 focus:outline-none"
         value={staffFilter}
         onChange={(e) => setStaffFilter(e.target.value)}
        >
         <option value="All">All</option>
         {staffNames.map((name) => (
          <option key={name} value={name}>{name}</option>
         ))}
        </select>
       </div>
      </div>

      {/* Activity Log */}
      <div className="space-y-2">
       {filteredLog.map((entry) => (
        <div key={entry.id} className="bg-waxe-card border border-waxe-border p-4 flex items-start gap-4 clip-stat">
         <div className="shrink-0 glyph-box" style={{ width: '32px', height: '32px', fontSize: '11px', borderRadius: '50%' }}>
          {entry.userName.split(' ').map(n => n[0]).join('')}
         </div>
         <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
           <span className="text-sm font-medium text-waxe-text">{entry.userName}</span>
           <StatusBadge status={entry.category} label={entry.category} />
          </div>
          <p className="text-sm text-waxe-text-secondary">{entry.action}</p>
          {entry.details && (
           <p className="text-xs text-waxe-text-muted mt-1">{entry.details}</p>
          )}
         </div>
         <span className="shrink-0 text-xs text-waxe-text-muted font-mono">{entry.timestamp}</span>
        </div>
       ))}
      </div>
     </div>
    )}

    {activeTab === 'store' && (
     <div className="space-y-6">
      {/* Store Info */}
      <section>
       <h2 className="text-[11px] font-medium text-waxe-text-muted mb-3">Store Information</h2>
       <div className="bg-waxe-card border border-waxe-border p-4 clip-card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div>
          <label className="text-[11px] font-medium text-waxe-text-muted block mb-1">Store Name</label>
          <input className="input-field w-full" value={storeName} onChange={(e) => setStoreName(e.target.value)} />
         </div>
         <div>
          <label className="text-[11px] font-medium text-waxe-text-muted block mb-1">Store Email</label>
          <input className="input-field w-full" type="email" placeholder="hello@waxandgroove.com" value={storeEmail} onChange={(e) => setStoreEmail(e.target.value)} />
         </div>
         <div>
          <label className="text-[11px] font-medium text-waxe-text-muted block mb-1">Store Phone</label>
          <input className="input-field w-full" type="tel" placeholder="(555) 000-0000" value={storePhone} onChange={(e) => setStorePhone(e.target.value)} />
         </div>
        </div>
       </div>
      </section>

      {/* Address */}
      <section>
       <h2 className="text-[11px] font-medium text-waxe-text-muted mb-3">Store Address</h2>
       <div className="bg-waxe-card border border-waxe-border p-4 clip-card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div className="md:col-span-2">
          <label className="text-[11px] font-medium text-waxe-text-muted block mb-1">Street Address</label>
          <input className="input-field w-full" placeholder="123 Main St" value={storeStreet} onChange={(e) => setStoreStreet(e.target.value)} />
         </div>
         <div>
          <label className="text-[11px] font-medium text-waxe-text-muted block mb-1">City</label>
          <input className="input-field w-full" placeholder="New York" value={storeCity} onChange={(e) => setStoreCity(e.target.value)} />
         </div>
         <div className="grid grid-cols-2 gap-4">
          <div>
           <label className="text-[11px] font-medium text-waxe-text-muted block mb-1">State</label>
           <input className="input-field w-full" placeholder="NY" value={storeState} onChange={(e) => setStoreState(e.target.value)} />
          </div>
          <div>
           <label className="text-[11px] font-medium text-waxe-text-muted block mb-1">ZIP Code</label>
           <input className="input-field w-full" placeholder="10001" value={storeZip} onChange={(e) => setStoreZip(e.target.value)} />
          </div>
         </div>
        </div>
       </div>
      </section>

      {/* Business & Tax */}
      <section>
       <h2 className="text-[11px] font-medium text-waxe-text-muted mb-3">Business & Tax</h2>
       <div className="bg-waxe-card border border-waxe-border p-4 clip-card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div>
          <label className="text-[11px] font-medium text-waxe-text-muted block mb-1">Business Type</label>
          <select className="input-field w-full" value={businessType} onChange={(e) => setBusinessType(e.target.value)}>
           <option value="Sole Proprietor">Sole Proprietor</option>
           <option value="LLC">LLC</option>
           <option value="Corporation">Corporation</option>
          </select>
         </div>
         <div>
          <label className="text-[11px] font-medium text-waxe-text-muted block mb-1">Tax ID (EIN)</label>
          <input className="input-field w-full" placeholder="XX-XXXXXXX" value={taxId} onChange={(e) => setTaxId(e.target.value)} />
         </div>
        </div>
       </div>
      </section>

      {/* Locale */}
      <section>
       <h2 className="text-[11px] font-medium text-waxe-text-muted mb-3">Locale</h2>
       <div className="bg-waxe-card border border-waxe-border p-4 clip-card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div>
          <label className="text-[11px] font-medium text-waxe-text-muted block mb-1">Currency</label>
          <select className="input-field w-full" value={currency} onChange={(e) => setCurrency(e.target.value)}>
           <option value="USD">USD — US Dollar</option>
           <option value="EUR">EUR — Euro</option>
           <option value="GBP">GBP — British Pound</option>
           <option value="CAD">CAD — Canadian Dollar</option>
           <option value="JPY">JPY — Japanese Yen</option>
          </select>
         </div>
         <div>
          <label className="text-[11px] font-medium text-waxe-text-muted block mb-1">Timezone</label>
          <select className="input-field w-full" value={timezone} onChange={(e) => setTimezone(e.target.value)}>
           <option value="America/New_York">Eastern (ET)</option>
           <option value="America/Chicago">Central (CT)</option>
           <option value="America/Denver">Mountain (MT)</option>
           <option value="America/Los_Angeles">Pacific (PT)</option>
           <option value="America/Anchorage">Alaska (AKT)</option>
           <option value="Pacific/Honolulu">Hawaii (HT)</option>
           <option value="Europe/London">London (GMT)</option>
           <option value="Europe/Paris">Central European (CET)</option>
           <option value="Asia/Tokyo">Japan (JST)</option>
          </select>
         </div>
        </div>
       </div>
      </section>
     </div>
    )}

    {activeTab === 'operations' && (
     <div className="space-y-6">
      {/* Order Processing */}
      <section>
       <h2 className="text-[11px] font-medium text-waxe-text-muted mb-3">Order Processing</h2>
       <div className="bg-waxe-card border border-waxe-border p-4 clip-card space-y-4">
        <div className="flex items-center justify-between">
         <div>
          <p className="text-sm font-medium text-waxe-text">Auto-confirm orders</p>
          <p className="text-xs text-waxe-text-muted">Automatically confirm new orders without manual review</p>
         </div>
         <button
          onClick={() => setAutoConfirmOrders(!autoConfirmOrders)}
          className={`text-[11px] font-medium px-3 py-1.5 border ${
           autoConfirmOrders
            ? 'bg-waxe-text text-waxe-deep border-waxe-text'
            : 'text-waxe-text bg-waxe-card/80 backdrop-blur-sm border-waxe-border hover:border-waxe-border-hover'
          }`}
         >
          {autoConfirmOrders ? 'ON' : 'OFF'}
         </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div>
          <label className="text-[11px] font-medium text-waxe-text-muted block mb-1">Default Fulfillment Method</label>
          <select className="input-field w-full" value={fulfillmentMethod} onChange={(e) => setFulfillmentMethod(e.target.value)}>
           <option value="Manual">Manual</option>
           <option value="Auto">Auto</option>
          </select>
         </div>
         <div>
          <label className="text-[11px] font-medium text-waxe-text-muted block mb-1">Order Numbering Prefix</label>
          <input className="input-field w-full" value={orderPrefix} onChange={(e) => setOrderPrefix(e.target.value)} />
         </div>
        </div>
       </div>
      </section>

      {/* Inventory */}
      <section>
       <h2 className="text-[11px] font-medium text-waxe-text-muted mb-3">Inventory</h2>
       <div className="bg-waxe-card border border-waxe-border p-4 clip-card space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div>
          <label className="text-[11px] font-medium text-waxe-text-muted block mb-1">Low Stock Threshold</label>
          <input className="input-field w-full" type="number" min={0} value={lowStockThreshold} onChange={(e) => setLowStockThreshold(Number(e.target.value))} />
         </div>
         <div>
          <label className="text-[11px] font-medium text-waxe-text-muted block mb-1">Default Condition Grade</label>
          <select className="input-field w-full" value={defaultCondition} onChange={(e) => setDefaultCondition(e.target.value)}>
           <option value="Mint">Mint</option>
           <option value="Near Mint">Near Mint</option>
           <option value="Very Good Plus">Very Good Plus</option>
           <option value="Very Good">Very Good</option>
           <option value="Good">Good</option>
           <option value="Fair">Fair</option>
          </select>
         </div>
        </div>
        <div className="flex items-center justify-between">
         <div>
          <p className="text-sm font-medium text-waxe-text">Auto-delist when sold out</p>
          <p className="text-xs text-waxe-text-muted">Automatically hide items from storefront when stock hits zero</p>
         </div>
         <button
          onClick={() => setAutoDelistSoldOut(!autoDelistSoldOut)}
          className={`text-[11px] font-medium px-3 py-1.5 border ${
           autoDelistSoldOut
            ? 'bg-waxe-text text-waxe-deep border-waxe-text'
            : 'text-waxe-text bg-waxe-card/80 backdrop-blur-sm border-waxe-border hover:border-waxe-border-hover'
          }`}
         >
          {autoDelistSoldOut ? 'ON' : 'OFF'}
         </button>
        </div>
       </div>
      </section>

      {/* Shipping */}
      <section>
       <h2 className="text-[11px] font-medium text-waxe-text-muted mb-3">Shipping</h2>
       <div className="bg-waxe-card border border-waxe-border p-4 clip-card space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div>
          <label className="text-[11px] font-medium text-waxe-text-muted block mb-1">Default Shipping Carrier</label>
          <select className="input-field w-full" value={defaultCarrier} onChange={(e) => setDefaultCarrier(e.target.value)}>
           <option value="USPS">USPS</option>
           <option value="UPS">UPS</option>
           <option value="FedEx">FedEx</option>
           <option value="DHL">DHL</option>
          </select>
         </div>
         <div>
          <label className="text-[11px] font-medium text-waxe-text-muted block mb-1">Free Shipping Threshold ($)</label>
          <input className="input-field w-full" type="number" min={0} value={freeShippingThreshold} onChange={(e) => setFreeShippingThreshold(Number(e.target.value))} />
         </div>
        </div>
        <div className="flex items-center justify-between">
         <div>
          <p className="text-sm font-medium text-waxe-text">Include packing slip</p>
          <p className="text-xs text-waxe-text-muted">Print a packing slip with each shipment</p>
         </div>
         <button
          onClick={() => setPackingSlip(!packingSlip)}
          className={`text-[11px] font-medium px-3 py-1.5 border ${
           packingSlip
            ? 'bg-waxe-text text-waxe-deep border-waxe-text'
            : 'text-waxe-text bg-waxe-card/80 backdrop-blur-sm border-waxe-border hover:border-waxe-border-hover'
          }`}
         >
          {packingSlip ? 'ON' : 'OFF'}
         </button>
        </div>
       </div>
      </section>

      {/* Notifications */}
      <section>
       <h2 className="text-[11px] font-medium text-waxe-text-muted mb-3">Notifications</h2>
       <div className="bg-waxe-card border border-waxe-border p-4 clip-card space-y-4">
        <div className="flex items-center justify-between">
         <div>
          <p className="text-sm font-medium text-waxe-text">Order notification emails</p>
          <p className="text-xs text-waxe-text-muted">Send email notifications for new orders</p>
         </div>
         <button
          onClick={() => setOrderNotifEmail(!orderNotifEmail)}
          className={`text-[11px] font-medium px-3 py-1.5 border ${
           orderNotifEmail
            ? 'bg-waxe-text text-waxe-deep border-waxe-text'
            : 'text-waxe-text bg-waxe-card/80 backdrop-blur-sm border-waxe-border hover:border-waxe-border-hover'
          }`}
         >
          {orderNotifEmail ? 'ON' : 'OFF'}
         </button>
        </div>
        <div className="flex items-center justify-between">
         <div>
          <p className="text-sm font-medium text-waxe-text">Low stock alerts</p>
          <p className="text-xs text-waxe-text-muted">Get notified when items fall below the low stock threshold</p>
         </div>
         <button
          onClick={() => setLowStockAlerts(!lowStockAlerts)}
          className={`text-[11px] font-medium px-3 py-1.5 border ${
           lowStockAlerts
            ? 'bg-waxe-text text-waxe-deep border-waxe-text'
            : 'text-waxe-text bg-waxe-card/80 backdrop-blur-sm border-waxe-border hover:border-waxe-border-hover'
          }`}
         >
          {lowStockAlerts ? 'ON' : 'OFF'}
         </button>
        </div>
        <div className="flex items-center justify-between">
         <div>
          <p className="text-sm font-medium text-waxe-text">Daily summary</p>
          <p className="text-xs text-waxe-text-muted">Receive a daily email summary of store activity</p>
         </div>
         <button
          onClick={() => setDailySummary(!dailySummary)}
          className={`text-[11px] font-medium px-3 py-1.5 border ${
           dailySummary
            ? 'bg-waxe-text text-waxe-deep border-waxe-text'
            : 'text-waxe-text bg-waxe-card/80 backdrop-blur-sm border-waxe-border hover:border-waxe-border-hover'
          }`}
         >
          {dailySummary ? 'ON' : 'OFF'}
         </button>
        </div>
       </div>
      </section>

      {/* Checkout */}
      <section>
       <h2 className="text-[11px] font-medium text-waxe-text-muted mb-3">Checkout</h2>
       <div className="bg-waxe-card border border-waxe-border p-4 clip-card space-y-4">
        <div className="flex items-center justify-between">
         <div>
          <p className="text-sm font-medium text-waxe-text">Accept store credit</p>
          <p className="text-xs text-waxe-text-muted">Allow customers to pay with store credit at checkout</p>
         </div>
         <button
          onClick={() => setAcceptStoreCredit(!acceptStoreCredit)}
          className={`text-[11px] font-medium px-3 py-1.5 border ${
           acceptStoreCredit
            ? 'bg-waxe-text text-waxe-deep border-waxe-text'
            : 'text-waxe-text bg-waxe-card/80 backdrop-blur-sm border-waxe-border hover:border-waxe-border-hover'
          }`}
         >
          {acceptStoreCredit ? 'ON' : 'OFF'}
         </button>
        </div>
        <div className="flex items-center justify-between">
         <div>
          <p className="text-sm font-medium text-waxe-text">Require phone number</p>
          <p className="text-xs text-waxe-text-muted">Require customers to provide a phone number at checkout</p>
         </div>
         <button
          onClick={() => setRequirePhone(!requirePhone)}
          className={`text-[11px] font-medium px-3 py-1.5 border ${
           requirePhone
            ? 'bg-waxe-text text-waxe-deep border-waxe-text'
            : 'text-waxe-text bg-waxe-card/80 backdrop-blur-sm border-waxe-border hover:border-waxe-border-hover'
          }`}
         >
          {requirePhone ? 'ON' : 'OFF'}
         </button>
        </div>
        <div className="flex items-center justify-between">
         <div>
          <p className="text-sm font-medium text-waxe-text">Order notes</p>
          <p className="text-xs text-waxe-text-muted">Allow customers to add notes to their order</p>
         </div>
         <button
          onClick={() => setOrderNotes(!orderNotes)}
          className={`text-[11px] font-medium px-3 py-1.5 border ${
           orderNotes
            ? 'bg-waxe-text text-waxe-deep border-waxe-text'
            : 'text-waxe-text bg-waxe-card/80 backdrop-blur-sm border-waxe-border hover:border-waxe-border-hover'
          }`}
         >
          {orderNotes ? 'ON' : 'OFF'}
         </button>
        </div>
       </div>
      </section>
     </div>
    )}
   </div>
  </div>
 )
}
