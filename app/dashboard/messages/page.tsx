'use client'

import { useState } from 'react'
import { DashboardHeader, MessageThread } from '@/components/dashboard'
import { conversations, networkConversations } from '@/lib/dashboard-data'

export default function MessagesPage() {
  const [activeTab, setActiveTab] = useState<'marketplace' | 'network'>('marketplace')
  const [activeConv, setActiveConv] = useState(0)
  const [search, setSearch] = useState('')
  const [showCompose, setShowCompose] = useState(false)

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
          <button className="btn-primary text-sm px-4 py-2" onClick={() => setShowCompose(true)}>+ Compose</button>
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
            className={`text-[11px] font-bold uppercase tracking-[0.1em] px-3 py-1.5 border ${
              activeTab === tab.key
                ? 'bg-waxe-text text-waxe-deep border-waxe-text'
                : 'text-waxe-text-muted border-waxe-border hover:text-waxe-text'
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 text-[11px] font-bold bg-waxe-warm text-waxe-deep">{tab.count}</span>
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-0 rounded-none border-2 border-waxe-border overflow-hidden clip-card">
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
          <div className="px-6 py-4 border-b border-waxe-border flex items-center justify-between scanline">
            <div className="relative z-10 flex items-center gap-3">
              <div className="glyph-box" style={{ width: '36px', height: '36px', fontSize: '12px', borderRadius: '50%' }}>
                {active.customerName.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="text-sm font-semibold text-waxe-text">{active.customerName}</p>
                <p className="text-xs text-waxe-text-muted">Last active: {active.lastTime}</p>
              </div>
              <span className="hatch-inline ml-2" />
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
          <div className="relative w-full max-w-lg bg-waxe-base border-2 border-waxe-border rounded-none shadow-xl clip-modal p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black text-waxe-text uppercase tracking-tight">New Message</h2>
              <button onClick={() => setShowCompose(false)} className="text-waxe-text-muted hover:text-waxe-text text-lg">&times;</button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-waxe-text-muted uppercase tracking-wider mb-1.5 block">To:</label>
                <input type="text" className="input-field" placeholder="Customer or store name..." autoFocus />
              </div>
              <div>
                <label className="text-xs font-medium text-waxe-text-muted uppercase tracking-wider mb-1.5 block">Message:</label>
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
    </div>
  )
}
