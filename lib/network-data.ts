// ─── Re-exports ─────────────────────────────────────────────
export { networkStores } from './restock-data'
export type { NetworkStore } from './restock-data'

// ─── Type Definitions ────────────────────────────────────────

export interface BundleRecord {
  artist: string
  title: string
  genre: string
  artworkUrl?: string
  photoColor?: string
}

export interface InboundRequest {
  id: string
  fromStore: { name: string; location: string; trustScore: number }
  records: BundleRecord[]
  offeredPrice: number
  requestedAt: string
  status: 'pending' | 'accepted' | 'declined' | 'countered'
  message?: string
}

export interface WholesaleListing {
  id: string
  lotName: string
  records: (BundleRecord & { condition: number })[]
  totalPrice: number
  genre: string
  daysListed: number
  inquiries: number
  views: number
}

export interface NetworkTransaction {
  id: string
  type: 'swap' | 'purchase' | 'sale'
  counterparty: { name: string; location: string }
  records: { artist: string; title: string; direction: 'sent' | 'received' }[]
  netValue: number
  completedAt: string
}

// ─── Mock Inbound Requests ──────────────────────────────────

export const inboundRequests: InboundRequest[] = [
  {
    id: 'inb-001',
    fromStore: { name: 'Deep Groove Records', location: 'Brooklyn, NY', trustScore: 97 },
    records: [
      { artist: 'John Coltrane', title: 'Blue Train', genre: 'Jazz', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/6e/1a/13/6e1a134d-8f6f-d90f-b855-ea69436a2e8b/17UM1IM45370.rgb.jpg/300x300bb.jpg', photoColor: '#2C3B4D' },
      { artist: 'Charles Mingus', title: 'The Black Saint and the Sinner Lady', genre: 'Jazz', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/24/65/64/2465645a-7d7f-63a9-e0bb-097cdc6bd6a8/19UMGIM32054.rgb.jpg/300x300bb.jpg', photoColor: '#1B2632' },
      { artist: 'Thelonious Monk', title: 'Brilliant Corners', genre: 'Jazz', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music128/v4/06/52/05/06520545-6d9e-c568-60cb-24c4b019a1e2/00888072373068.rgb.jpg/300x300bb.jpg', photoColor: '#A35139' },
    ],
    offeredPrice: 185,
    requestedAt: '2 hours ago',
    status: 'pending',
    message: 'Looking for clean Blue Note / Impulse pressings — will pay above market for the lot.',
  },
  {
    id: 'inb-002',
    fromStore: { name: 'Crate Diggers Union', location: 'Chicago, IL', trustScore: 93 },
    records: [
      { artist: 'Sade', title: 'Diamond Life', genre: 'R&B', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/4d/d5/a1/4dd5a1b7-7134-f0ec-b55c-54ac47cc88a5/886448655886.jpg/300x300bb.jpg', photoColor: '#A35139' },
      { artist: 'Marvin Gaye', title: 'I Want You', genre: 'Soul', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/38/6d/de/386dde81-f75b-944a-a8bf-efec51554486/14UMGIM55410.rgb.jpg/300x300bb.jpg', photoColor: '#C04040' },
    ],
    offeredPrice: 68,
    requestedAt: '5 hours ago',
    status: 'pending',
    message: 'Customers keep asking for R&B/Soul. Happy to swap Chicago house back if you need it.',
  },
  {
    id: 'inb-003',
    fromStore: { name: 'Ambient Works', location: 'Portland, OR', trustScore: 89 },
    records: [
      { artist: 'Brian Eno', title: 'Ambient 1: Music for Airports', genre: 'Ambient', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/ee/71/42/ee71425d-6bc9-3df8-c90b-8539f59144ab/00724386649553.rgb.jpg/300x300bb.jpg', photoColor: '#EEE9DF' },
      { artist: 'Brian Eno', title: 'Another Green World', genre: 'Ambient', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/a4/fe/b1/a4feb15b-126f-ce68-c6a0-a525005eb8e8/13UABIM29259.rgb.jpg/300x300bb.jpg', photoColor: '#EEE9DF' },
    ],
    offeredPrice: 100,
    requestedAt: '3 days ago',
    status: 'accepted',
    message: 'We can move both Eno titles same week — strong ambient demand in Portland right now.',
  },
  {
    id: 'inb-004',
    fromStore: { name: 'BPM Supply', location: 'Berlin, DE', trustScore: 94 },
    records: [
      { artist: 'Aphex Twin', title: 'Selected Ambient Works 85-92', genre: 'Techno', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/5f/b3/e0/5fb3e08d-c2cd-3da4-6ad7-c5dc61803683/cover.jpg/300x300bb.jpg', photoColor: '#1B2632' },
      { artist: 'Boards of Canada', title: 'Geogaddi', genre: 'Electronic', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/2e/77/7c/2e777c13-60e3-c231-8be0-b0d43dc91598/mzi.yseuvnlj.jpg/300x300bb.jpg', photoColor: '#4A5B6D' },
    ],
    offeredPrice: 105,
    requestedAt: '4 days ago',
    status: 'declined',
    message: 'Strong demand for both in Berlin. Can do $105 for the pair — saves you shipping twice.',
  },
  {
    id: 'inb-005',
    fromStore: { name: 'Dub Merchant', location: 'London, UK', trustScore: 96 },
    records: [
      { artist: 'Charles Mingus', title: 'The Black Saint and the Sinner Lady', genre: 'Jazz', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/24/65/64/2465645a-7d7f-63a9-e0bb-097cdc6bd6a8/19UMGIM32054.rgb.jpg/300x300bb.jpg', photoColor: '#1B2632' },
    ],
    offeredPrice: 65,
    requestedAt: '5 days ago',
    status: 'countered',
    message: 'Collector in London hunting Impulse pressings. Would you take $65 + a King Tubby 7"?',
  },
  {
    id: 'inb-006',
    fromStore: { name: 'Wax Poetics', location: 'Los Angeles, CA', trustScore: 91 },
    records: [
      { artist: 'Marvin Gaye', title: 'I Want You', genre: 'Soul', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/38/6d/de/386dde81-f75b-944a-a8bf-efec51554486/14UMGIM55410.rgb.jpg/300x300bb.jpg', photoColor: '#C04040' },
      { artist: 'Sade', title: 'Diamond Life', genre: 'R&B', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/4d/d5/a1/4dd5a1b7-7134-f0ec-b55c-54ac47cc88a5/886448655886.jpg/300x300bb.jpg', photoColor: '#A35139' },
      { artist: "D'Angelo", title: 'Voodoo', genre: 'R&B', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/e9/b9/9e/e9b99e73-58a5-1e31-f57c-b11e78419dcf/16UMGIM86249.rgb.jpg/300x300bb.jpg', photoColor: '#A35139' },
    ],
    offeredPrice: 95,
    requestedAt: '1 day ago',
    status: 'pending',
    message: 'Building out our Soul/R&B section — want to grab all three if you can do a bundle deal.',
  },
]

// ─── Mock Wholesale Listings ────────────────────────────────

export const wholesaleListings: WholesaleListing[] = [
  {
    id: 'wl-001',
    lotName: 'Jazz Dead Stock',
    genre: 'Jazz',
    records: [
      { artist: 'John Coltrane', title: 'Blue Train', genre: 'Jazz', condition: 4, artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/6e/1a/13/6e1a134d-8f6f-d90f-b855-ea69436a2e8b/17UM1IM45370.rgb.jpg/300x300bb.jpg', photoColor: '#2C3B4D' },
      { artist: 'Charles Mingus', title: 'The Black Saint and the Sinner Lady', genre: 'Jazz', condition: 3, artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/24/65/64/2465645a-7d7f-63a9-e0bb-097cdc6bd6a8/19UMGIM32054.rgb.jpg/300x300bb.jpg', photoColor: '#1B2632' },
      { artist: 'Thelonious Monk', title: 'Brilliant Corners', genre: 'Jazz', condition: 4, artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music128/v4/06/52/05/06520545-6d9e-c568-60cb-24c4b019a1e2/00888072373068.rgb.jpg/300x300bb.jpg', photoColor: '#A35139' },
    ],
    totalPrice: 155,
    daysListed: 12,
    inquiries: 4,
    views: 82,
  },
  {
    id: 'wl-002',
    lotName: 'Ambient / Electronic Surplus',
    genre: 'Ambient',
    records: [
      { artist: 'Brian Eno', title: 'Another Green World', genre: 'Ambient', condition: 4, artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/a4/fe/b1/a4feb15b-126f-ce68-c6a0-a525005eb8e8/13UABIM29259.rgb.jpg/300x300bb.jpg', photoColor: '#EEE9DF' },
      { artist: 'Boards of Canada', title: 'Geogaddi', genre: 'Electronic', condition: 5, artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/2e/77/7c/2e777c13-60e3-c231-8be0-b0d43dc91598/mzi.yseuvnlj.jpg/300x300bb.jpg', photoColor: '#4A5B6D' },
    ],
    totalPrice: 92,
    daysListed: 8,
    inquiries: 7,
    views: 104,
  },
  {
    id: 'wl-003',
    lotName: 'Country / Americana',
    genre: 'Country',
    records: [
      { artist: 'Gram Parsons', title: 'GP / Grievous Angel', genre: 'Country', condition: 4, artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/d2/60/71/d26071ab-2aaf-3c39-010a-48b4c761c37c/mzi.frxdfvyk.jpg/300x300bb.jpg', photoColor: '#FFB162' },
      { artist: 'Brian Eno', title: 'Ambient 1: Music for Airports (2024 Reissue)', genre: 'Ambient', condition: 5, artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/ee/71/42/ee71425d-6bc9-3df8-c90b-8539f59144ab/00724386649553.rgb.jpg/300x300bb.jpg', photoColor: '#EEE9DF' },
    ],
    totalPrice: 100,
    daysListed: 21,
    inquiries: 1,
    views: 23,
  },
  {
    id: 'wl-004',
    lotName: 'Spare Electronic',
    genre: 'Electronic',
    records: [
      { artist: 'Aphex Twin', title: 'Selected Ambient Works 85-92', genre: 'Techno', condition: 4, artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/5f/b3/e0/5fb3e08d-c2cd-3da4-6ad7-c5dc61803683/cover.jpg/300x300bb.jpg', photoColor: '#1B2632' },
    ],
    totalPrice: 48,
    daysListed: 5,
    inquiries: 3,
    views: 56,
  },
]

// ─── Mock Transactions ──────────────────────────────────────

export const networkTransactions: NetworkTransaction[] = [
  {
    id: 'txn-001',
    type: 'swap',
    counterparty: { name: 'Dub Merchant', location: 'London, UK' },
    records: [
      { artist: 'Bob Marley', title: 'Exodus', direction: 'sent' },
      { artist: 'King Tubby', title: 'Dub from the Roots', direction: 'received' },
    ],
    netValue: 40,
    completedAt: '3 days ago',
  },
  {
    id: 'txn-002',
    type: 'sale',
    counterparty: { name: 'Deep Groove Records', location: 'Brooklyn, NY' },
    records: [
      { artist: 'Art Blakey', title: "Moanin'", direction: 'sent' },
    ],
    netValue: 42,
    completedAt: '1 week ago',
  },
  {
    id: 'txn-003',
    type: 'purchase',
    counterparty: { name: 'BPM Supply', location: 'Berlin, DE' },
    records: [
      { artist: 'Kerri Chandler', title: 'Spaces and Places', direction: 'received' },
    ],
    netValue: -48,
    completedAt: '1 week ago',
  },
  {
    id: 'txn-004',
    type: 'swap',
    counterparty: { name: 'Wax Poetics', location: 'Los Angeles, CA' },
    records: [
      { artist: 'Marvin Gaye', title: "What's Going On", direction: 'sent' },
      { artist: 'MF DOOM', title: 'Mm..Food', direction: 'received' },
    ],
    netValue: 6,
    completedAt: '2 weeks ago',
  },
  {
    id: 'txn-005',
    type: 'sale',
    counterparty: { name: 'Klassik Wax', location: 'Vienna, AT' },
    records: [
      { artist: 'Glenn Gould', title: 'Goldberg Variations', direction: 'sent' },
    ],
    netValue: 120,
    completedAt: '3 weeks ago',
  },
  {
    id: 'txn-006',
    type: 'purchase',
    counterparty: { name: 'Crate Diggers Union', location: 'Chicago, IL' },
    records: [
      { artist: 'Theo Parrish', title: 'First Floor', direction: 'received' },
      { artist: 'Moodymann', title: 'Silentintroduction', direction: 'received' },
    ],
    netValue: -195,
    completedAt: '1 month ago',
  },
]
