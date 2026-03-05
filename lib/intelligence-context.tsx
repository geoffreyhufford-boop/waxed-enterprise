'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

interface Message {
 id: string
 role: 'user' | 'assistant'
 content: string
 widget?: 'chart' | 'table' | 'action' | 'stat'
 data?: Record<string, unknown>
}

interface IntelligenceState {
 active: boolean
 messages: Message[]
 isTyping: boolean
 open: () => void
 close: () => void
 toggle: () => void
 submit: (query: string) => void
 clear: () => void
}

const IntelligenceContext = createContext<IntelligenceState | null>(null)

function generateId() {
 return Math.random().toString(36).slice(2, 10)
}

function simulateResponse(query: string): Message {
 const q = query.toLowerCase()

 if (q.includes('graph') || q.includes('chart') || (q.includes('sales') && !q.includes('top'))) {
  return {
   id: generateId(), role: 'assistant',
   content: 'Here\'s the breakdown for the past 30 days:',
   widget: 'chart',
   data: {
    title: q.includes('techno') ? 'Techno Sales — Last 30 Days' : 'Sales — Last 30 Days',
    chartData: [
     { label: 'Wk 1', value: 42 }, { label: 'Wk 2', value: 58 },
     { label: 'Wk 3', value: 35 }, { label: 'Wk 4', value: 71 },
    ],
   },
  }
 }

 if (q.includes('top') && (q.includes('selling') || q.includes('seller'))) {
  return {
   id: generateId(), role: 'assistant',
   content: 'Your top sellers this week:',
   widget: 'table',
   data: {
    title: 'Top 5 Sellers — This Week',
    headers: ['#', 'Title', 'Artist', 'Units', 'Revenue'],
    rows: [
     ['1', 'Black Acid', 'DJ Rush', '12', '$359.88'],
     ['2', 'Plastic Dreams', 'Jaydee', '9', '$314.91'],
     ['3', 'Strings of Life', 'Rhythim Is Rhythim', '8', '$279.92'],
     ['4', 'Energy Flash', 'Joey Beltram', '7', '$244.93'],
     ['5', 'Windowlicker', 'Aphex Twin', '6', '$179.94'],
    ],
   },
  }
 }

 if (q.includes('remove') || q.includes('delete') || q.includes('hide')) {
  const match = q.match(/(?:remove|delete|hide)\s+(?:all\s+)?(.+?)(?:\s+from|\s+off|\s+on)/)
  const target = match ? match[1] : 'selected items'
  return {
   id: generateId(), role: 'assistant',
   content: 'I found the matching records. Please confirm:',
   widget: 'action',
   data: {
    action: `Remove ${target} from storefront`,
    details: 'This will hide 14 listings from your public storefront. The records will remain in your inventory and can be re-listed at any time.',
   },
  }
 }

 if (q.includes('customer') || q.includes('haven\'t') || q.includes('purchased') || q.includes('inactive')) {
  return {
   id: generateId(), role: 'assistant',
   content: 'Here are customers with no purchases in the last 90 days:',
   widget: 'table',
   data: {
    title: 'Inactive Customers (90+ Days)',
    headers: ['Customer', 'Last Purchase', 'Lifetime Value', 'Segment'],
    rows: [
     ['Marcus Chen', 'Nov 12, 2025', '$1,240', 'VIP'],
     ['Sarah Kim', 'Nov 28, 2025', '$380', 'Retail'],
     ['DJ Phantom', 'Oct 5, 2025', '$2,100', 'Wholesale'],
     ['Rico Suave', 'Dec 1, 2025', '$560', 'Retail'],
    ],
   },
  }
 }

 if (q.includes('compare') || q.includes('vs')) {
  return {
   id: generateId(), role: 'assistant',
   content: 'Here\'s the comparison:',
   widget: 'chart',
   data: {
    title: 'Hip-Hop vs Electronic — Sell-Through Rate',
    chartData: [
     { label: 'Jan', value: 62 }, { label: 'Feb', value: 58 },
     { label: 'Mar', value: 71 }, { label: 'Apr', value: 45 },
    ],
   },
  }
 }

 if (q.includes('aged') || q.includes('dead stock') || q.includes('stale')) {
  return {
   id: generateId(), role: 'assistant',
   content: 'Aged inventory exceeding $500 in estimated value:',
   widget: 'table',
   data: {
    title: 'Aged Inventory — Value > $500',
    headers: ['Title', 'Artist', 'Days Listed', 'Est. Value', 'Condition'],
    rows: [
     ['Neptune\'s Lair', 'Drexciya', '180', '$750', 'NM'],
     ['Endtroducing...', 'DJ Shadow', '142', '$520', 'VG+'],
     ['Selected Ambient Works 85-92', 'Aphex Twin', '210', '$680', 'NM'],
    ],
   },
  }
 }

 if (q.includes('average') || q.includes('aov') || q.includes('order value') || q.includes('quarter')) {
  return {
   id: generateId(), role: 'assistant',
   content: 'Here\'s your order metrics this quarter:',
   widget: 'stat',
   data: {
    stats: [
     { label: 'Avg Order Value', value: '$47.20', delta: '+8.3%' },
     { label: 'Total Orders', value: '342', delta: '+12.1%' },
     { label: 'Revenue', value: '$16,142', delta: '+19.7%' },
    ],
   },
  }
 }

 if (q.includes('restock') || q.includes('draft')) {
  return {
   id: generateId(), role: 'assistant',
   content: 'I\'ve drafted a restock order based on your sell-through velocity:',
   widget: 'action',
   data: {
    action: 'Create Restock Purchase Order',
    details: '8 titles, 24 units total. Estimated cost: $312.00. Supplier: Direct Distribution.',
   },
  }
 }

 return {
  id: generateId(), role: 'assistant',
  content: 'I can help with that. Try asking me to show sales data, compare genres, find inactive customers, manage storefront listings, or generate reports.',
 }
}

export function IntelligenceProvider({ children }: { children: ReactNode }) {
 const [active, setActive] = useState(false)
 const [messages, setMessages] = useState<Message[]>([])
 const [isTyping, setIsTyping] = useState(false)

 const open = useCallback(() => setActive(true), [])
 const close = useCallback(() => setActive(false), [])
 const toggle = useCallback(() => setActive(a => !a), [])
 const clear = useCallback(() => { setMessages([]); setActive(false) }, [])

 const submit = useCallback((query: string) => {
  if (!query.trim()) return
  const userMsg: Message = { id: generateId(), role: 'user', content: query.trim() }
  setMessages(prev => [...prev, userMsg])
  setIsTyping(true)

  setTimeout(() => {
   const response = simulateResponse(query)
   setMessages(prev => [...prev, response])
   setIsTyping(false)
  }, 800 + Math.random() * 600)
 }, [])

 return (
  <IntelligenceContext.Provider value={{ active, messages, isTyping, open, close, toggle, submit, clear }}>
   {children}
  </IntelligenceContext.Provider>
 )
}

export function useIntelligence() {
 const ctx = useContext(IntelligenceContext)
 if (!ctx) throw new Error('useIntelligence must be used within IntelligenceProvider')
 return ctx
}
