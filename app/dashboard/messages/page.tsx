'use client'

import { useState } from 'react'
import { DashboardHeader, MessageThread } from '@/components/dashboard'
import { conversations } from '@/lib/dashboard-data'

export default function MessagesPage() {
  const [activeConv, setActiveConv] = useState(0)
  const [search, setSearch] = useState('')
  const active = conversations[activeConv]

  const filteredConversations = conversations.filter((c) =>
    c.customerName.toLowerCase().includes(search.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <DashboardHeader
        title="Messages"
        subtitle={`${conversations.reduce((sum, c) => sum + c.unread, 0)} unread messages`}
      />

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
            {filteredConversations.map((conv, i) => (
              <MessageThread
                key={conv.id}
                conversation={conv}
                isActive={conversations.indexOf(conv) === activeConv}
                onClick={() => setActiveConv(conversations.indexOf(conv))}
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
                      <span className="text-[11px] text-waxe-cool font-mono">⟁ {msg.linkedItem}</span>
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
    </div>
  )
}
