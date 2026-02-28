// ─── Customer Profiles ──────────────────────────────────────────

export interface CustomerWantItem {
  id: string
  artist: string
  title?: string
  genre?: string
  addedDate: string
  notifyWhenAvailable: boolean
  notes?: string
}

export interface CustomerProfile {
  id: string
  name: string
  email: string
  phone?: string
  tier: 'retail' | 'wholesale' | 'vip'
  totalSpend: number
  orderCount: number
  lastPurchase: string
  firstPurchase: string
  avgOrderValue: number
  favoriteGenres: string[]
  notes: string
  wantList: CustomerWantItem[]
  conversationId?: string
}

// ─── Mock Data ──────────────────────────────────────────────────

export const customerProfiles: CustomerProfile[] = [
  {
    id: 'cust-001',
    name: 'Sarah Mitchell',
    email: 'sarah.m@email.com',
    phone: '+1 (212) 555-0134',
    tier: 'vip',
    totalSpend: 4280,
    orderCount: 34,
    lastPurchase: '2025-02-25',
    firstPurchase: '2023-08-12',
    avgOrderValue: 125.88,
    favoriteGenres: ['Electronic', 'Ambient', 'Jazz'],
    notes: 'Prefers Japanese pressings. Always asks about OBI strips. Willing to pay premium for mint condition.',
    wantList: [
      { id: 'want-001', artist: 'Ryuichi Sakamoto', title: 'Async', addedDate: '2025-01-15', notifyWhenAvailable: true },
      { id: 'want-002', artist: 'Midori Takada', title: 'Through the Looking Glass', addedDate: '2025-02-01', notifyWhenAvailable: true, notes: 'Original RCA pressing only' },
      { id: 'want-003', artist: 'Yellow Magic Orchestra', genre: 'Electronic', addedDate: '2024-12-10', notifyWhenAvailable: false },
    ],
    conversationId: 'conv-1',
  },
  {
    id: 'cust-002',
    name: 'James Rodriguez',
    email: 'j.rodriguez@vinyldealer.co',
    phone: '+1 (718) 555-0289',
    tier: 'wholesale',
    totalSpend: 12650,
    orderCount: 18,
    lastPurchase: '2025-02-22',
    firstPurchase: '2024-02-05',
    avgOrderValue: 702.78,
    favoriteGenres: ['Hip-Hop', 'Soul', 'Funk'],
    notes: 'Wholesale buyer — operates 2 shops in Brooklyn. Orders bulk lots monthly. Net-30 terms approved.',
    wantList: [
      { id: 'want-004', artist: 'MF DOOM', title: 'MM..FOOD', addedDate: '2025-02-10', notifyWhenAvailable: true, notes: 'Green vinyl variant' },
      { id: 'want-005', artist: 'J Dilla', title: 'Donuts', addedDate: '2025-01-20', notifyWhenAvailable: true },
    ],
    conversationId: 'conv-2',
  },
  {
    id: 'cust-003',
    name: 'Alex Chen',
    email: 'alex.chen@gmail.com',
    tier: 'vip',
    totalSpend: 3120,
    orderCount: 28,
    lastPurchase: '2025-02-20',
    firstPurchase: '2023-11-30',
    avgOrderValue: 111.43,
    favoriteGenres: ['Electronic', 'Techno', 'House'],
    notes: 'DJ — buys playable copies, not collector grade. Interested in 12" singles and white labels.',
    wantList: [
      { id: 'want-006', artist: 'Drexciya', title: 'Neptune\'s Lair', addedDate: '2025-02-05', notifyWhenAvailable: true },
      { id: 'want-007', artist: 'Underground Resistance', genre: 'Techno', addedDate: '2025-01-28', notifyWhenAvailable: true },
      { id: 'want-008', artist: 'Theo Parrish', title: 'First Floor', addedDate: '2024-11-15', notifyWhenAvailable: false },
    ],
    conversationId: 'conv-3',
  },
  {
    id: 'cust-004',
    name: 'Lena Kowalski',
    email: 'lena.k@protonmail.com',
    phone: '+1 (312) 555-0471',
    tier: 'retail',
    totalSpend: 890,
    orderCount: 8,
    lastPurchase: '2025-01-30',
    firstPurchase: '2024-09-15',
    avgOrderValue: 111.25,
    favoriteGenres: ['Post-Punk', 'Shoegaze', 'Indie'],
    notes: 'Collects UK pressings. Interested in obscure 80s post-punk.',
    wantList: [
      { id: 'want-009', artist: 'Cocteau Twins', title: 'Treasure', addedDate: '2025-01-12', notifyWhenAvailable: true },
    ],
  },
  {
    id: 'cust-005',
    name: 'Nina Okafor',
    email: 'nina.okafor@outlook.com',
    tier: 'retail',
    totalSpend: 560,
    orderCount: 5,
    lastPurchase: '2025-02-14',
    firstPurchase: '2024-11-01',
    avgOrderValue: 112.00,
    favoriteGenres: ['Afrobeat', 'Jazz', 'World'],
    notes: 'New customer — growing collection. Asked about Fela Kuti box sets.',
    wantList: [
      { id: 'want-010', artist: 'Fela Kuti', title: 'Zombie', addedDate: '2025-02-14', notifyWhenAvailable: true },
      { id: 'want-011', artist: 'Tony Allen', genre: 'Afrobeat', addedDate: '2025-02-14', notifyWhenAvailable: true },
    ],
    conversationId: 'conv-5',
  },
]
