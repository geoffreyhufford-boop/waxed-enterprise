// ─── Type Definitions ────────────────────────────────────────

export interface NetworkStore {
  id: string
  name: string
  location: string
  specialtyGenres: string[]
  trustScore: number       // 0-100
  completedSwaps: number
  memberSince: string
  responseTime: string     // e.g. "< 2 hours"
}

export interface NetworkRecord {
  id: string
  artist: string
  title: string
  genre: string
  condition: number        // 1-5 star scale
  price: number
  qty: number
  storeId: string
  storeName: string
  storeLocation: string
  format: string
  year: number
  label: string
  photoColor?: string
  artworkUrl?: string
}

export interface SwapRecord {
  artist: string
  title: string
  genre: string
  condition: number
  marketValue: number
  photoColor?: string
  artworkUrl?: string
}

export interface SwapProposal {
  id: string
  status: 'pending' | 'accepted' | 'declined'
  storeA: { name: string; location: string }
  storeB: { name: string; location: string }
  recordsYouSend: SwapRecord[]
  recordsYouReceive: SwapRecord[]
  valueDelta: number         // positive = you gain value
  mismatchScore: number      // 0-100 how well it resolves genre mismatch
  marketSavings: number      // $ saved vs buying on open market
  reasoning: string
  createdAt: string
}

export interface DeadStockItem {
  id: string
  artist: string
  title: string
  genre: string
  condition: number
  price: number
  artworkUrl?: string
  photoColor?: string
  daysInStock: number
  storefrontViews: number
  networkDemand: number        // stores that want this genre
  matchedStores: string[]
  suggestedAction: 'swap' | 'discount' | 'list_to_network'
  reasoning: string
}

export interface WantListItem {
  id: string
  artist: string
  title?: string
  genre: string
  requestCount: number
  lastRequested: string
  source: 'in_store' | 'storefront_search' | 'customer_request'
  networkAvailable: number
  bestPrice?: number
  matchedStoreName?: string
  matchedStoreLocation?: string
}

// ─── Mock Dead Stock ─────────────────────────────────────────

export const deadStockItems: DeadStockItem[] = [
  {
    id: 'ds-001',
    artist: 'John Coltrane',
    title: 'Blue Train',
    genre: 'Jazz',
    condition: 4,
    price: 65,
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/6e/1a/13/6e1a134d-8f6f-d90f-b855-ea69436a2e8b/17UM1IM45370.rgb.jpg/300x300bb.jpg',
    photoColor: '#3D3050',
    daysInStock: 94,
    storefrontViews: 3,
    networkDemand: 12,
    matchedStores: ['Deep Groove Records', 'Wax Poetics'],
    suggestedAction: 'swap',
    reasoning: 'Jazz is 3% of your sales but 18% of your inventory. Deep Groove Records actively looking for Blue Note pressings.',
  },
  {
    id: 'ds-002',
    artist: 'Charles Mingus',
    title: 'The Black Saint and the Sinner Lady',
    genre: 'Jazz',
    condition: 3,
    price: 58,
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/24/65/64/2465645a-7d7f-63a9-e0bb-097cdc6bd6a8/19UMGIM32054.rgb.jpg/300x300bb.jpg',
    photoColor: '#1A1428',
    daysInStock: 107,
    storefrontViews: 1,
    networkDemand: 8,
    matchedStores: ['Deep Groove Records'],
    suggestedAction: 'swap',
    reasoning: '107 days, 1 view. Your customer base skews electronic — jazz collectors shop elsewhere. Swap to Deep Groove for house/techno stock.',
  },
  {
    id: 'ds-003',
    artist: 'Brian Eno',
    title: 'Ambient 1: Music for Airports (2024 Reissue)',
    genre: 'Ambient',
    condition: 5,
    price: 52,
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/ee/71/42/ee71425d-6bc9-3df8-c90b-8539f59144ab/00724386649553.rgb.jpg/300x300bb.jpg',
    photoColor: '#F8F5F0',
    daysInStock: 68,
    storefrontViews: 7,
    networkDemand: 4,
    matchedStores: ['Ambient Works'],
    suggestedAction: 'discount',
    reasoning: 'Overpriced for a reissue — Discogs median is $34. Views are decent but no conversions. Drop to $38 or list to network.',
  },
  {
    id: 'ds-004',
    artist: 'Gram Parsons',
    title: 'GP / Grievous Angel',
    genre: 'Country',
    condition: 4,
    price: 62,
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/d2/60/71/d26071ab-2aaf-3c39-010a-48b4c761c37c/mzi.frxdfvyk.jpg/300x300bb.jpg',
    photoColor: '#FFB162',
    daysInStock: 83,
    storefrontViews: 0,
    networkDemand: 6,
    matchedStores: ['Twang & Tone'],
    suggestedAction: 'list_to_network',
    reasoning: 'Collection buy leftover — zero views. Country has 0% of your sales. Twang & Tone in Nashville will snap this up.',
  },
  {
    id: 'ds-005',
    artist: 'Aphex Twin',
    title: 'Selected Ambient Works 85-92',
    genre: 'Techno',
    condition: 4,
    price: 55,
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/5f/b3/e0/5fb3e08d-c2cd-3da4-6ad7-c5dc61803683/cover.jpg/300x300bb.jpg',
    photoColor: '#1A1428',
    daysInStock: 45,
    storefrontViews: 22,
    networkDemand: 2,
    matchedStores: ['BPM Supply'],
    suggestedAction: 'discount',
    reasoning: 'Duplicate copy — you already have one in the front bin. High views but buyers see the other copy first. Discount or swap the spare.',
  },
  {
    id: 'ds-006',
    artist: 'Thelonious Monk',
    title: 'Brilliant Corners',
    genre: 'Jazz',
    condition: 4,
    price: 58,
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music128/v4/06/52/05/06520545-6d9e-c568-60cb-24c4b019a1e2/00888072373068.rgb.jpg/300x300bb.jpg',
    photoColor: '#7B6FA0',
    daysInStock: 91,
    storefrontViews: 2,
    networkDemand: 9,
    matchedStores: ['Deep Groove Records', 'Wax Poetics'],
    suggestedAction: 'swap',
    reasoning: 'Third jazz title sitting 90+ days. Pattern is clear — your neighborhood doesn\'t buy jazz on vinyl. Swap all three as a bundle.',
  },
]

// ─── Mock Want List ──────────────────────────────────────────

export const wantListItems: WantListItem[] = [
  {
    id: 'wl-001',
    artist: 'Burial',
    title: 'Rival Dealer',
    genre: 'Electronic',
    requestCount: 4,
    lastRequested: '2 days ago',
    source: 'customer_request',
    networkAvailable: 2,
    bestPrice: 38,
    matchedStoreName: 'BPM Supply',
    matchedStoreLocation: 'Berlin, DE',
  },
  {
    id: 'wl-002',
    artist: 'Boards of Canada',
    title: 'Music Has the Right to Children',
    genre: 'Electronic',
    requestCount: 12,
    lastRequested: '1 day ago',
    source: 'storefront_search',
    networkAvailable: 0,
  },
  {
    id: 'wl-003',
    artist: 'Various',
    title: undefined,
    genre: 'Italo Disco',
    requestCount: 3,
    lastRequested: '3 days ago',
    source: 'in_store',
    networkAvailable: 5,
    bestPrice: 22,
    matchedStoreName: 'Crate Diggers Union',
    matchedStoreLocation: 'Chicago, IL',
  },
  {
    id: 'wl-004',
    artist: 'DJ Rashad',
    title: 'Double Cup',
    genre: 'Footwork',
    requestCount: 6,
    lastRequested: '1 day ago',
    source: 'customer_request',
    networkAvailable: 1,
    bestPrice: 45,
    matchedStoreName: 'Crate Diggers Union',
    matchedStoreLocation: 'Chicago, IL',
  },
  {
    id: 'wl-005',
    artist: 'Autechre',
    title: 'Tri Repetae',
    genre: 'Electronic',
    requestCount: 2,
    lastRequested: '5 days ago',
    source: 'storefront_search',
    networkAvailable: 1,
    bestPrice: 55,
    matchedStoreName: 'BPM Supply',
    matchedStoreLocation: 'Berlin, DE',
  },
  {
    id: 'wl-006',
    artist: 'Various',
    title: undefined,
    genre: 'Detroit Techno',
    requestCount: 8,
    lastRequested: 'today',
    source: 'storefront_search',
    networkAvailable: 7,
    bestPrice: 28,
    matchedStoreName: 'Crate Diggers Union',
    matchedStoreLocation: 'Chicago, IL',
  },
  {
    id: 'wl-007',
    artist: 'Floating Points',
    title: 'Crush',
    genre: 'Electronic',
    requestCount: 3,
    lastRequested: '4 days ago',
    source: 'customer_request',
    networkAvailable: 2,
    bestPrice: 32,
    matchedStoreName: 'Ambient Works',
    matchedStoreLocation: 'Portland, OR',
  },
  {
    id: 'wl-008',
    artist: 'Theo Parrish',
    title: 'First Floor',
    genre: 'House',
    requestCount: 5,
    lastRequested: 'today',
    source: 'in_store',
    networkAvailable: 1,
    bestPrice: 110,
    matchedStoreName: 'Crate Diggers Union',
    matchedStoreLocation: 'Chicago, IL',
  },
]

// ─── Mock Network Stores ─────────────────────────────────────

export const networkStores: NetworkStore[] = [
  {
    id: 'store-001',
    name: 'Deep Groove Records',
    location: 'Brooklyn, NY',
    specialtyGenres: ['Jazz', 'Soul', 'Funk'],
    trustScore: 97,
    completedSwaps: 34,
    memberSince: 'Mar 2024',
    responseTime: '< 2 hours',
  },
  {
    id: 'store-002',
    name: 'BPM Supply',
    location: 'Berlin, DE',
    specialtyGenres: ['Techno', 'House', 'Electro'],
    trustScore: 94,
    completedSwaps: 28,
    memberSince: 'Jan 2024',
    responseTime: '< 4 hours',
  },
  {
    id: 'store-003',
    name: 'Wax Poetics',
    location: 'Los Angeles, CA',
    specialtyGenres: ['Hip-Hop', 'R&B', 'Funk'],
    trustScore: 91,
    completedSwaps: 19,
    memberSince: 'Jun 2024',
    responseTime: '< 1 hour',
  },
  {
    id: 'store-004',
    name: 'Ambient Works',
    location: 'Portland, OR',
    specialtyGenres: ['Ambient', 'Drone', 'Experimental'],
    trustScore: 89,
    completedSwaps: 12,
    memberSince: 'Sep 2024',
    responseTime: '< 6 hours',
  },
  {
    id: 'store-005',
    name: 'Dub Merchant',
    location: 'London, UK',
    specialtyGenres: ['Dub', 'Reggae', 'Dancehall'],
    trustScore: 96,
    completedSwaps: 41,
    memberSince: 'Nov 2023',
    responseTime: '< 3 hours',
  },
  {
    id: 'store-006',
    name: 'Klassik Wax',
    location: 'Vienna, AT',
    specialtyGenres: ['Classical', 'Opera', 'Chamber'],
    trustScore: 98,
    completedSwaps: 22,
    memberSince: 'Feb 2024',
    responseTime: '< 1 hour',
  },
  {
    id: 'store-007',
    name: 'Twang & Tone',
    location: 'Nashville, TN',
    specialtyGenres: ['Country', 'Bluegrass', 'Americana'],
    trustScore: 85,
    completedSwaps: 8,
    memberSince: 'Dec 2024',
    responseTime: '< 8 hours',
  },
  {
    id: 'store-008',
    name: 'Crate Diggers Union',
    location: 'Chicago, IL',
    specialtyGenres: ['House', 'Disco', 'Boogie'],
    trustScore: 93,
    completedSwaps: 31,
    memberSince: 'Apr 2024',
    responseTime: '< 2 hours',
  },
]

// ─── Mock Network Records ────────────────────────────────────

export const networkRecords: NetworkRecord[] = [
  // Deep Groove Records — Jazz / Soul
  { id: 'nr-001', artist: 'John Coltrane', title: 'A Love Supreme', genre: 'Jazz', condition: 4, price: 85, qty: 1, storeId: 'store-001', storeName: 'Deep Groove Records', storeLocation: 'Brooklyn, NY', format: '12"', year: 1965, label: 'Impulse!', photoColor: '#3D3050', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/e5/24/aa/e524aacd-467b-66f3-8931-0fcd6750a4b9/08UMGIM07914.rgb.jpg/300x300bb.jpg' },
  { id: 'nr-002', artist: 'Herbie Hancock', title: 'Head Hunters', genre: 'Jazz', condition: 3, price: 42, qty: 2, storeId: 'store-001', storeName: 'Deep Groove Records', storeLocation: 'Brooklyn, NY', format: '12"', year: 1973, label: 'Columbia', photoColor: '#7B6FA0', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/4f/e5/f5/4fe5f511-462e-e87b-0711-d4e42809fb17/dj.goshfswo.jpg/300x300bb.jpg' },
  { id: 'nr-003', artist: 'Curtis Mayfield', title: 'Superfly', genre: 'Soul', condition: 4, price: 55, qty: 1, storeId: 'store-001', storeName: 'Deep Groove Records', storeLocation: 'Brooklyn, NY', format: '12"', year: 1972, label: 'Curtom', photoColor: '#FFB162', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/c4/34/f0/c434f094-4c7e-3c62-8f15-cd02028e1ce7/603497885978.jpg/300x300bb.jpg' },

  // BPM Supply — Techno / House
  { id: 'nr-004', artist: 'Aphex Twin', title: 'Selected Ambient Works 85-92', genre: 'Techno', condition: 5, price: 65, qty: 1, storeId: 'store-002', storeName: 'BPM Supply', storeLocation: 'Berlin, DE', format: '2x12"', year: 1992, label: 'Apollo', photoColor: '#1A1428', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/5f/b3/e0/5fb3e08d-c2cd-3da4-6ad7-c5dc61803683/cover.jpg/300x300bb.jpg' },
  { id: 'nr-005', artist: 'Jeff Mills', title: 'Waveform Transmission Vol. 1', genre: 'Techno', condition: 4, price: 120, qty: 1, storeId: 'store-002', storeName: 'BPM Supply', storeLocation: 'Berlin, DE', format: '12"', year: 1992, label: 'Tresor', photoColor: '#6A5D80' },
  { id: 'nr-006', artist: 'Kerri Chandler', title: 'Spaces and Places', genre: 'House', condition: 5, price: 48, qty: 3, storeId: 'store-002', storeName: 'BPM Supply', storeLocation: 'Berlin, DE', format: '2x12"', year: 2022, label: 'Kaoz Theory', photoColor: '#4A9A62', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/14/d2/77/14d277cd-1c90-3908-9c6f-951c54f7e481/cover.jpg/300x300bb.jpg' },
  { id: 'nr-007', artist: 'Drexciya', title: 'Neptune\'s Lair', genre: 'Electro', condition: 4, price: 95, qty: 1, storeId: 'store-002', storeName: 'BPM Supply', storeLocation: 'Berlin, DE', format: '2x12"', year: 1999, label: 'Tresor', photoColor: '#3D3050', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/95/a4/3f/95a43f9d-4eb9-e5a9-ee64-910d3fb95e6c/3663729188892_3000.jpg/300x300bb.jpg' },

  // Wax Poetics — Hip-Hop / R&B
  { id: 'nr-008', artist: 'MF DOOM', title: 'Mm..Food', genre: 'Hip-Hop', condition: 4, price: 38, qty: 2, storeId: 'store-003', storeName: 'Wax Poetics', storeLocation: 'Los Angeles, CA', format: '2x12"', year: 2004, label: 'Rhymesayers', photoColor: '#C04040', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/c7/64/4f/c7644f59-5d3c-459b-e716-02256550a333/mzi.viarkgrc.jpg/300x300bb.jpg' },
  { id: 'nr-009', artist: 'Madlib', title: 'Shades of Blue', genre: 'Hip-Hop', condition: 3, price: 32, qty: 1, storeId: 'store-003', storeName: 'Wax Poetics', storeLocation: 'Los Angeles, CA', format: '2x12"', year: 2003, label: 'Blue Note', photoColor: '#1A1428', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/0d/96/1d/0d961d09-8e54-e2f5-f5ce-b08690b1e797/00602537641079.rgb.jpg/300x300bb.jpg' },
  { id: 'nr-010', artist: 'D\'Angelo', title: 'Voodoo', genre: 'R&B', condition: 5, price: 45, qty: 1, storeId: 'store-003', storeName: 'Wax Poetics', storeLocation: 'Los Angeles, CA', format: '2x12"', year: 2000, label: 'Virgin', photoColor: '#7B6FA0', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/e9/b9/9e/e9b99e73-58a5-1e31-f57c-b11e78419dcf/16UMGIM86249.rgb.jpg/300x300bb.jpg' },

  // Ambient Works — Ambient / Experimental
  { id: 'nr-011', artist: 'Brian Eno', title: 'Ambient 1: Music for Airports', genre: 'Ambient', condition: 4, price: 52, qty: 1, storeId: 'store-004', storeName: 'Ambient Works', storeLocation: 'Portland, OR', format: '12"', year: 1978, label: 'Polydor', photoColor: '#F8F5F0', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/ee/71/42/ee71425d-6bc9-3df8-c90b-8539f59144ab/00724386649553.rgb.jpg/300x300bb.jpg' },
  { id: 'nr-012', artist: 'Tim Hecker', title: 'Ravedeath, 1972', genre: 'Ambient', condition: 5, price: 35, qty: 2, storeId: 'store-004', storeName: 'Ambient Works', storeLocation: 'Portland, OR', format: '2x12"', year: 2011, label: 'Kranky', photoColor: '#6A5D80', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/4a/68/4c/4a684c10-456b-8442-9ed3-764d57a32aed/mzi.ukvgcwzt.jpg/300x300bb.jpg' },
  { id: 'nr-013', artist: 'Gas', title: 'Pop', genre: 'Ambient', condition: 4, price: 78, qty: 1, storeId: 'store-004', storeName: 'Ambient Works', storeLocation: 'Portland, OR', format: '3x12"', year: 2000, label: 'Mille Plateaux', photoColor: '#4A9A62', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/5d/6a/00/5d6a0054-5145-6011-c638-3e2666d0e8dd/192641833472_Cover.jpg/300x300bb.jpg' },

  // Dub Merchant — Dub / Reggae
  { id: 'nr-014', artist: 'King Tubby', title: 'Dub from the Roots', genre: 'Dub', condition: 3, price: 68, qty: 1, storeId: 'store-005', storeName: 'Dub Merchant', storeLocation: 'London, UK', format: '12"', year: 1974, label: 'Total Sounds', photoColor: '#FFB162', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music6/v4/f2/89/dc/f289dc0f-92e7-40ba-ee35-c2ba78d1721e/cover.jpg/300x300bb.jpg' },
  { id: 'nr-015', artist: 'Lee "Scratch" Perry', title: 'Super Ape', genre: 'Dub', condition: 4, price: 72, qty: 1, storeId: 'store-005', storeName: 'Dub Merchant', storeLocation: 'London, UK', format: '12"', year: 1976, label: 'Island', photoColor: '#C04040', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music128/v4/32/75/0f/32750f44-3ee4-119e-ad0a-ca1d81119921/00602547748966.rgb.jpg/300x300bb.jpg' },
  { id: 'nr-016', artist: 'Augustus Pablo', title: 'King Tubbys Meets Rockers Uptown', genre: 'Dub', condition: 5, price: 88, qty: 1, storeId: 'store-005', storeName: 'Dub Merchant', storeLocation: 'London, UK', format: '12"', year: 1976, label: 'Yard Music', photoColor: '#7B6FA0', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/23/86/5f/23865ff8-4f99-c071-25ce-a0f950400cda/881626559765_cover.jpg/300x300bb.jpg' },

  // Klassik Wax — Classical
  { id: 'nr-017', artist: 'Glenn Gould', title: 'Goldberg Variations', genre: 'Classical', condition: 4, price: 120, qty: 1, storeId: 'store-006', storeName: 'Klassik Wax', storeLocation: 'Vienna, AT', format: '12"', year: 1956, label: 'Columbia', photoColor: '#1A1428', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music/3a/14/e4/mzi.xxiekocw.jpg/300x300bb.jpg' },
  { id: 'nr-018', artist: 'Arvo Pärt', title: 'Tabula Rasa', genre: 'Classical', condition: 5, price: 55, qty: 2, storeId: 'store-006', storeName: 'Klassik Wax', storeLocation: 'Vienna, AT', format: '12"', year: 1984, label: 'ECM', photoColor: '#F8F5F0', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/d4/96/0b/d4960b8c-a1c3-4cf1-31c2-31d35cc3e2b7/00028948109326.rgb.jpg/300x300bb.jpg' },

  // Twang & Tone — Country / Americana
  { id: 'nr-019', artist: 'Townes Van Zandt', title: 'Live at the Old Quarter', genre: 'Country', condition: 3, price: 95, qty: 1, storeId: 'store-007', storeName: 'Twang & Tone', storeLocation: 'Nashville, TN', format: '2x12"', year: 1977, label: 'Tomato', photoColor: '#7B6FA0', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music49/v4/ed/19/88/ed198893-ccf8-f123-4e9d-2c2296bca744/886445720600.jpg/300x300bb.jpg' },
  { id: 'nr-020', artist: 'Gram Parsons', title: 'GP / Grievous Angel', genre: 'Country', condition: 4, price: 62, qty: 1, storeId: 'store-007', storeName: 'Twang & Tone', storeLocation: 'Nashville, TN', format: '12"', year: 1974, label: 'Reprise', photoColor: '#FFB162', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/d2/60/71/d26071ab-2aaf-3c39-010a-48b4c761c37c/mzi.frxdfvyk.jpg/300x300bb.jpg' },

  // Crate Diggers Union — House / Disco
  { id: 'nr-021', artist: 'Larry Heard', title: 'Sceneries Not Songs', genre: 'House', condition: 4, price: 58, qty: 1, storeId: 'store-008', storeName: 'Crate Diggers Union', storeLocation: 'Chicago, IL', format: '2x12"', year: 1994, label: 'Black Market', photoColor: '#3D3050', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/c9/4b/ed/c94bedd8-5c5e-df56-1fb9-000a16537f01/8718723149693.jpg/300x300bb.jpg' },
  { id: 'nr-022', artist: 'Donna Summer', title: 'I Feel Love (12" Single)', genre: 'Disco', condition: 3, price: 35, qty: 2, storeId: 'store-008', storeName: 'Crate Diggers Union', storeLocation: 'Chicago, IL', format: '12"', year: 1977, label: 'Casablanca', photoColor: '#C04040', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music118/v4/1c/46/60/1c46600c-6c43-0ed3-ed6d-8217e61a5f2a/00600753626030.rgb.jpg/300x300bb.jpg' },
  { id: 'nr-023', artist: 'Frankie Knuckles', title: 'Beyond the Mix', genre: 'House', condition: 5, price: 42, qty: 1, storeId: 'store-008', storeName: 'Crate Diggers Union', storeLocation: 'Chicago, IL', format: '12"', year: 1991, label: 'Virgin', photoColor: '#4A9A62', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music6/v4/9d/65/21/9d6521c3-fc50-8d5a-6ddc-7628ff7d307f/05099909472952.jpg/300x300bb.jpg' },
  { id: 'nr-024', artist: 'Theo Parrish', title: 'First Floor', genre: 'House', condition: 4, price: 110, qty: 1, storeId: 'store-008', storeName: 'Crate Diggers Union', storeLocation: 'Chicago, IL', format: '3x12"', year: 1998, label: 'Peacefrog', photoColor: '#1A1428', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music/34/08/8f/mzi.dtxcmahx.tif/300x300bb.jpg' },
  { id: 'nr-025', artist: 'Moodymann', title: 'Silentintroduction', genre: 'House', condition: 4, price: 85, qty: 1, storeId: 'store-008', storeName: 'Crate Diggers Union', storeLocation: 'Chicago, IL', format: '2x12"', year: 1997, label: 'Planet E', photoColor: '#6A5D80' },
]

// ─── Mock Swap Proposals ─────────────────────────────────────

export const swapProposals: SwapProposal[] = [
  {
    id: 'swap-001',
    status: 'pending',
    storeA: { name: 'Wax & Groove', location: 'Your Store' },
    storeB: { name: 'BPM Supply', location: 'Berlin, DE' },
    recordsYouSend: [
      { artist: 'John Coltrane', title: 'Blue Train', genre: 'Jazz', condition: 4, marketValue: 65, photoColor: '#3D3050', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/6e/1a/13/6e1a134d-8f6f-d90f-b855-ea69436a2e8b/17UM1IM45370.rgb.jpg/300x300bb.jpg' },
      { artist: 'Art Blakey', title: 'Moanin\'', genre: 'Jazz', condition: 3, marketValue: 42, photoColor: '#1A1428', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/24/65/64/2465645a-7d7f-63a9-e0bb-097cdc6bd6a8/19UMGIM32054.rgb.jpg/300x300bb.jpg' },
      { artist: 'Thelonious Monk', title: 'Brilliant Corners', genre: 'Jazz', condition: 4, marketValue: 58, photoColor: '#7B6FA0', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music128/v4/06/52/05/06520545-6d9e-c568-60cb-24c4b019a1e2/00888072373068.rgb.jpg/300x300bb.jpg' },
    ],
    recordsYouReceive: [
      { artist: 'Jeff Mills', title: 'Waveform Transmission Vol. 1', genre: 'Techno', condition: 4, marketValue: 120, photoColor: '#6A5D80' },
      { artist: 'Kerri Chandler', title: 'Spaces and Places', genre: 'House', condition: 5, marketValue: 48, photoColor: '#4A9A62', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/14/d2/77/14d277cd-1c90-3908-9c6f-951c54f7e481/cover.jpg/300x300bb.jpg' },
      { artist: 'Drexciya', title: 'Neptune\'s Lair', genre: 'Electro', condition: 4, marketValue: 22, photoColor: '#3D3050', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/95/a4/3f/95a43f9d-4eb9-e5a9-ee64-910d3fb95e6c/3663729188892_3000.jpg/300x300bb.jpg' },
    ],
    valueDelta: 25,
    mismatchScore: 94,
    marketSavings: 200,
    reasoning: 'Your jazz inventory is 3x overweight vs. local demand. BPM Supply has excess techno/house stock that matches your customer search patterns from the last 90 days. This swap resolves genre imbalance on both sides and nets you +$25 in market value.',
    createdAt: '2 hours ago',
  },
  {
    id: 'swap-002',
    status: 'pending',
    storeA: { name: 'Wax & Groove', location: 'Your Store' },
    storeB: { name: 'Ambient Works', location: 'Portland, OR' },
    recordsYouSend: [
      { artist: 'Brian Eno', title: 'Another Green World', genre: 'Ambient', condition: 4, marketValue: 48, photoColor: '#F8F5F0', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/a4/fe/b1/a4feb15b-126f-ce68-c6a0-a525005eb8e8/13UABIM29259.rgb.jpg/300x300bb.jpg' },
      { artist: 'Boards of Canada', title: 'Geogaddi', genre: 'Ambient', condition: 5, marketValue: 55, photoColor: '#6A5D80', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/2e/77/7c/2e777c13-60e3-c231-8be0-b0d43dc91598/mzi.yseuvnlj.jpg/300x300bb.jpg' },
    ],
    recordsYouReceive: [
      { artist: 'Tim Hecker', title: 'Ravedeath, 1972', genre: 'Ambient', condition: 5, marketValue: 35, photoColor: '#6A5D80', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/4a/68/4c/4a684c10-456b-8442-9ed3-764d57a32aed/mzi.ukvgcwzt.jpg/300x300bb.jpg' },
      { artist: 'Gas', title: 'Pop', genre: 'Ambient', condition: 4, marketValue: 78, photoColor: '#4A9A62', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/5d/6a/00/5d6a0054-5145-6011-c638-3e2666d0e8dd/192641833472_Cover.jpg/300x300bb.jpg' },
    ],
    valueDelta: 10,
    mismatchScore: 72,
    marketSavings: 85,
    reasoning: 'Ambient Works has strong local demand for Eno and BoC, while your customers have been searching for Tim Hecker and Gas. Both titles have been in your "wanted" queue for 60+ days.',
    createdAt: '1 day ago',
  },
  {
    id: 'swap-003',
    status: 'accepted',
    storeA: { name: 'Wax & Groove', location: 'Your Store' },
    storeB: { name: 'Dub Merchant', location: 'London, UK' },
    recordsYouSend: [
      { artist: 'Bob Marley', title: 'Exodus', genre: 'Reggae', condition: 3, marketValue: 28, photoColor: '#FFB162', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/23/fa/f8/23faf820-c4fa-2bf1-d672-846971f5cf5c/06UMGIM31355.rgb.jpg/300x300bb.jpg' },
    ],
    recordsYouReceive: [
      { artist: 'King Tubby', title: 'Dub from the Roots', genre: 'Dub', condition: 3, marketValue: 68, photoColor: '#FFB162', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music6/v4/f2/89/dc/f289dc0f-92e7-40ba-ee35-c2ba78d1721e/cover.jpg/300x300bb.jpg' },
    ],
    valueDelta: 40,
    mismatchScore: 88,
    marketSavings: 55,
    reasoning: 'Dub Merchant has surplus King Tubby pressings from a recent collection buyout. Your Exodus copy is a Japanese pressing they\'ve been hunting. High perceived value on both sides.',
    createdAt: '3 days ago',
  },
  {
    id: 'swap-004',
    status: 'pending',
    storeA: { name: 'Wax & Groove', location: 'Your Store' },
    storeB: { name: 'Crate Diggers Union', location: 'Chicago, IL' },
    recordsYouSend: [
      { artist: 'Sade', title: 'Diamond Life', genre: 'R&B', condition: 4, marketValue: 35, photoColor: '#7B6FA0', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/4d/d5/a1/4dd5a1b7-7134-f0ec-b55c-54ac47cc88a5/886448655886.jpg/300x300bb.jpg' },
      { artist: 'Marvin Gaye', title: 'I Want You', genre: 'Soul', condition: 3, marketValue: 28, photoColor: '#C04040', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/38/6d/de/386dde81-f75b-944a-a8bf-efec51554486/14UMGIM55410.rgb.jpg/300x300bb.jpg' },
    ],
    recordsYouReceive: [
      { artist: 'Larry Heard', title: 'Sceneries Not Songs', genre: 'House', condition: 4, marketValue: 58, photoColor: '#3D3050', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/c9/4b/ed/c94bedd8-5c5e-df56-1fb9-000a16537f01/8718723149693.jpg/300x300bb.jpg' },
      { artist: 'Frankie Knuckles', title: 'Beyond the Mix', genre: 'House', condition: 5, marketValue: 42, photoColor: '#4A9A62', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music6/v4/9d/65/21/9d6521c3-fc50-8d5a-6ddc-7628ff7d307f/05099909472952.jpg/300x300bb.jpg' },
    ],
    valueDelta: 37,
    mismatchScore: 81,
    marketSavings: 120,
    reasoning: 'Chicago house demand is 40% higher in your area than R&B/soul. Crate Diggers has the reverse pattern. Sending soul classics for Chicago house originals aligns both inventories with local demand curves.',
    createdAt: '5 hours ago',
  },
]
