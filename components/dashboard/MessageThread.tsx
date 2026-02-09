import type { Conversation } from '@/lib/dashboard-data'

interface MessageThreadProps {
  conversation: Conversation
  isActive: boolean
  onClick: () => void
}

export default function MessageThread({ conversation, isActive, onClick }: MessageThreadProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 border-b border-waxe-border transition-colors ${
        isActive ? 'bg-waxe-surface' : 'hover:bg-waxe-card/50'
      }`}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-waxe-warm/15 flex items-center justify-center text-xs font-bold text-waxe-warm">
            {conversation.customerName.split(' ').map(n => n[0]).join('')}
          </div>
          <span className="text-sm font-medium text-waxe-text">{conversation.customerName}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-waxe-text-muted">{conversation.lastTime}</span>
          {conversation.unread > 0 && (
            <span className="w-5 h-5 rounded-full bg-waxe-warm flex items-center justify-center text-[10px] font-bold text-waxe-deep">
              {conversation.unread}
            </span>
          )}
        </div>
      </div>
      <p className="text-xs text-waxe-text-muted truncate pl-[42px]">{conversation.lastMessage}</p>
    </button>
  )
}
