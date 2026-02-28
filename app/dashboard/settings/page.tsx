'use client'

import { useState, useMemo } from 'react'
import { DashboardHeader, StatusBadge, DataTable } from '@/components/dashboard'
import { staffMembers, rolePermissions, auditLog, type AuditLogEntry } from '@/lib/settings-data'

export default function SettingsPage() {
 const [activeTab, setActiveTab] = useState<'team' | 'activity'>('team')
 const [categoryFilter, setCategoryFilter] = useState<string>('All')
 const [staffFilter, setStaffFilter] = useState<string>('All')

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
    {activeTab === 'team' ? (
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
    ) : (
     <div>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
       <div className="flex items-center gap-1.5">
        <span className="text-[10px] font-medium text-waxe-text-muted">Category:</span>
        {['All', 'inventory', 'orders', 'settings', 'pricing', 'customers'].map((cat) => (
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
   </div>
  </div>
 )
}
