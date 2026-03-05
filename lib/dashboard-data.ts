// ─── Type Definitions ────────────────────────────────────────

export interface QuickStat {
  label: string
  value: string
  trend?: string
  trendUp?: boolean
}

export interface Integration {
  name: string
  icon: string
  status: 'connected' | 'disconnected' | 'syncing'
  lastSync?: string
}

export interface FeatureStatus {
  name: string
  status: 'active' | 'beta' | 'coming_soon'
  description: string
}

export interface InventoryRecord {
  id: string
  artist: string
  title: string
  label: string
  year: number
  condition: number // 1-5 star scale: 5=mint, 4=excellent, 3=good, 2=fair, 1=poor
  price: number
  suggestedPrice?: number
  priceDelta?: number
  syncSource: 'discogs' | 'shopify' | 'csv' | 'manual'
  status: 'active' | 'draft' | 'sold_out' | 'on_hold' | 'pending'
  genre: string
  inPrintQueue: boolean
  hasPhoto: boolean
  photoColor?: string
  artworkUrl?: string
  // Pressing identity
  pressing: string           // '1st Press', 'Reissue', 'Repress', 'Limited Edition', 'Promo'
  countryOfPressing: string  // 'US', 'UK', 'Japan', 'Germany', etc.
  catalogNo: string
  matrixRunout?: string
  discogsReleaseId?: string
  // Physical specs
  vinylWeight?: string       // '120g', '140g', '180g', '200g'
  vinylColor: string         // 'Black', 'Red', 'Clear', 'Splatter', etc.
  format: string             // '12"', '7"', '10"', '2x12"', '3x12"'
  speed: string              // '33 RPM', '45 RPM'
  // Sleeve & packaging
  sleeveCondition: number    // 1-5 same star scale as media
  sleeveType: string         // 'Gatefold', 'Single', 'Box Set'
  innerSleeve?: string       // 'Original printed', 'Generic white', 'Poly-lined'
  inserts?: string[]         // ['Lyric sheet', 'OBI strip', 'Poster', etc.]
  // Mastering
  mastering?: string         // 'AAA', 'AAD', 'ADD', 'DDD'
  pressingPlant?: string     // 'RTI', 'Pallas', 'GZ', 'Optimal'
  // Condition notes
  flawNotes?: string
  // Market data
  discogsMedian?: number
  discogsLow?: number
  discogsHigh?: number
}

export interface CatalogResult {
  discogsId: string
  artist: string
  title: string
  label: string
  year: number
  country: string
  format: string
  catNo: string
  pressings: number
  medianPrice: number
  lowestPrice: number
  highestPrice: number
  have: number
  want: number
}

export interface ImportBatch {
  id: string
  source: 'csv' | 'discogs' | 'shopify' | 'scan'
  fileName?: string
  totalRecords: number
  matched: number
  needsReview: number
  status: 'uploading' | 'matching' | 'review' | 'complete'
  records: ImportRecord[]
}

export interface ImportRecord {
  artist: string
  title: string
  matchConfidence: number
  suggestedPrice?: number
  matched: boolean
  discogsMatch?: string
}

export interface Shelf {
  id: string
  name: string
  type: 'algorithmic' | 'curated' | 'genre' | 'featured'
  recordCount: number
  records: { id: string; artist: string; title: string; featured: boolean }[]
}

export interface StorefrontSocialLinks {
  instagram?: string
  twitter?: string
  tiktok?: string
  facebook?: string
  youtube?: string
  bandcamp?: string
}

export interface StorefrontConfig {
  storeName: string
  url: string
  status: 'live' | 'draft'
  primaryColor: string
  accentColor: string
  logoText: string
  logoUrl?: string
  headerImageUrl?: string
  description: string
  socialLinks: StorefrontSocialLinks
}

export interface RevenueDataPoint {
  month: string
  revenue: number
  orders: number
}

export interface ChannelRevenuePoint {
  month: string
  discogs: number
  storefront: number
  pos: number
}

export interface MarginDataPoint {
  month: string
  revenue: number
  cost: number
  margin: number
  marginPct: number
}

export interface DaysOnShelfBucket {
  range: string
  count: number
  value: number
}

export interface PriceVsMarketItem {
  artist: string
  title: string
  yourPrice: number
  discogsMedian: number
  delta: number
  deltaPct: number
}

export interface DeadStockSummary {
  totalItems: number
  totalValue: number
  avgDaysListed: number
  topGenre: string
}

export interface MissedSearch {
  query: string
  searchCount: number
  lastSearched: string
  available: boolean
}

export interface GenreDemandPoint {
  month: string
  techno: number
  house: number
  ambient: number
  electro: number
  breakbeat: number
}

export interface PriceTrendPoint {
  month: string
  c5: number // 5★ mint
  c4: number // 4★ excellent
  c3: number // 3★ good
  c2: number // 2★ fair
}

export interface RestockRecommendation {
  artist: string
  title: string
  genre: string
  demandScore: number
  avgSalePrice: number
  lastSold: string
  velocity: 'high' | 'medium' | 'low'
}

export interface Transaction {
  id: string
  time: string
  customer: string
  items: string
  total: number
  method: 'card' | 'cash' | 'tap'
  synced: boolean
}

export interface HourlySalesPoint {
  hour: string
  sales: number
  transactions: number
}

export interface Message {
  id: string
  sender: 'dealer' | 'customer'
  text: string
  time: string
  linkedItem?: string
}

export interface Conversation {
  id: string
  customerName: string
  lastMessage: string
  lastTime: string
  unread: number
  messages: Message[]
}

export interface OrderItem {
  recordId: string
  artist: string
  title: string
  price: number
  qty: number
}

export interface Order {
  id: string
  date: string
  customer: { name: string; email: string; address: string }
  items: OrderItem[]
  total: number
  status: 'draft' | 'processing' | 'unfulfilled' | 'label_printed' | 'in_transit' | 'delivered' | 'refunded' | 'cancelled'
  shippingMethod: 'standard' | 'priority' | 'pickup'
  orderType: 'b2b' | 'd2c'
  trackingNumber?: string
  carrier?: string
  weight: string
  labelPrinted: boolean
}

export interface GenreBreakdown {
  genre: string
  count: number
  revenue: number
  percentage: number
}

export interface ConditionBreakdown {
  condition: string
  count: number
  percentage: number
}

export interface VelocityDataPoint {
  week: string
  sold: number
  added: number
}

export interface Crate {
  id: string
  name: string
  type: 'manual' | 'smart' | 'dead_stock'
  records: string[]
  createdAt: string
}

// ─── Mock Data ───────────────────────────────────────────────

export const quickStats: QuickStat[] = [
  { label: 'Total Sales', value: '$42,860', trend: '+18%', trendUp: true },
  { label: 'Orders Count', value: '186', trend: '+23%', trendUp: true },
  { label: 'Items Sold', value: '312', trend: '+44', trendUp: true },
  { label: 'Orders to Fulfill', value: '5', trend: '+2', trendUp: false },
]

export const integrations: Integration[] = [
  { name: 'Square', icon: '◻', status: 'connected', lastSync: '2 min ago' },
  { name: 'Discogs', icon: '◉', status: 'connected', lastSync: '15 min ago' },
  { name: 'Shopify', icon: '◆', status: 'connected', lastSync: '1 hr ago' },
  { name: 'Stripe', icon: '▰', status: 'connected', lastSync: 'Live' },
  { name: 'Shippo', icon: '◈', status: 'disconnected' },
]

export const featureStatuses: FeatureStatus[] = [
  { name: 'Dynamic Pricing', status: 'active', description: 'Market-aware price suggestions' },
  { name: 'Inventory Sync', status: 'active', description: 'Real-time multi-channel sync' },
  { name: 'Label Printing', status: 'beta', description: 'Barcode & shipping labels' },
  { name: 'Storefront', status: 'active', description: 'Custom online store' },
  { name: 'Database Search', status: 'active', description: 'Discogs catalog lookup' },
  { name: 'Messaging', status: 'beta', description: 'Customer communication' },
]

export const inventoryRecords: InventoryRecord[] = [
  {
    id: 'WX-001', artist: 'Aphex Twin', title: 'Selected Ambient Works 85-92', label: 'Apollo', year: 1992, condition: 4, price: 85.00, suggestedPrice: 92.00, priceDelta: 7, syncSource: 'discogs', status: 'active', genre: 'Ambient', inPrintQueue: false, hasPhoto: true, photoColor: '#1a2a3c', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/5f/b3/e0/5fb3e08d-c2cd-3da4-6ad7-c5dc61803683/cover.jpg/300x300bb.jpg',
    pressing: '1st Press', countryOfPressing: 'UK', catalogNo: 'AMB LP 3922', matrixRunout: 'AMB3922-A1 MPO',
    vinylWeight: '140g', vinylColor: 'Black', format: '2x12"', speed: '33 RPM',
    sleeveCondition: 4, sleeveType: 'Gatefold', innerSleeve: 'Generic white',
    mastering: 'AAA', pressingPlant: 'MPO',
    flawNotes: 'Light shelf wear on cover, vinyl plays clean throughout. Original Apollo/R&S pressing.',
    discogsMedian: 88, discogsLow: 45, discogsHigh: 320,
  },
  {
    id: 'WX-002', artist: 'Basic Channel', title: 'BCD', label: 'Basic Channel', year: 1995, condition: 3, price: 120.00, suggestedPrice: 135.00, priceDelta: 15, syncSource: 'discogs', status: 'active', genre: 'Dub Techno', inPrintQueue: true, hasPhoto: true, photoColor: '#2a2a2a', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music/y2005/m02/d25/h00/s05.zgibqflu.jpg/300x300bb.jpg',
    pressing: '1st Press', countryOfPressing: 'Germany', catalogNo: 'BC-CD', matrixRunout: 'BC-CD A1',
    vinylWeight: '140g', vinylColor: 'Black', format: '12"', speed: '33 RPM',
    sleeveCondition: 3, sleeveType: 'Single', innerSleeve: 'Generic white',
    mastering: 'AAA', pressingPlant: 'Dubplates & Mastering',
    flawNotes: 'Minimal plain sleeve has edge wear. Vinyl has light marks but plays through. Hard to find original press.',
    discogsMedian: 130, discogsLow: 60, discogsHigh: 280,
  },
  {
    id: 'WX-003', artist: 'Underworld', title: 'Dubnobasswithmyheadman', label: "Junior Boy's Own", year: 1994, condition: 5, price: 45.00, suggestedPrice: 48.00, priceDelta: 3, syncSource: 'shopify', status: 'active', genre: 'Techno', inPrintQueue: false, hasPhoto: true, photoColor: '#3a3a5a', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music118/v4/6b/ab/57/6bab57d0-7a4f-51fa-865f-cb0b4710c8cd/00602537908103.rgb.jpg/300x300bb.jpg',
    pressing: 'Reissue', countryOfPressing: 'UK', catalogNo: 'COLLECT005LP',
    vinylWeight: '180g', vinylColor: 'Black', format: '2x12"', speed: '33 RPM',
    sleeveCondition: 5, sleeveType: 'Gatefold', innerSleeve: 'Poly-lined', inserts: ['Download card'],
    mastering: 'AAD', pressingPlant: 'Optimal',
    discogsMedian: 42, discogsLow: 28, discogsHigh: 75,
  },
  {
    id: 'WX-004', artist: 'Burial', title: 'Untrue', label: 'Hyperdub', year: 2007, condition: 4, price: 48.00, suggestedPrice: 52.00, priceDelta: 4, syncSource: 'discogs', status: 'active', genre: 'Techno', inPrintQueue: false, hasPhoto: true, photoColor: '#1a1a2a', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/9d/0f/1c/9d0f1c2b-2fae-d8ac-3920-ce9ec5bc85b5/7982.jpg/300x300bb.jpg',
    pressing: '1st Press', countryOfPressing: 'UK', catalogNo: 'HDBCD002', matrixRunout: 'HDBLP002-A2',
    vinylWeight: '140g', vinylColor: 'Black', format: '2x12"', speed: '33 RPM',
    sleeveCondition: 4, sleeveType: 'Gatefold', innerSleeve: 'Poly-lined',
    mastering: 'AAD', pressingPlant: 'The Vinyl Factory',
    discogsMedian: 50, discogsLow: 30, discogsHigh: 95,
  },
  {
    id: 'WX-005', artist: 'Jeff Mills', title: 'Waveform Transmission Vol. 1', label: 'Tresor', year: 1992, condition: 3, price: 95.00, suggestedPrice: 110.00, priceDelta: 15, syncSource: 'manual', status: 'active', genre: 'Techno', inPrintQueue: true, hasPhoto: true, photoColor: '#0a0a0a',
    pressing: '1st Press', countryOfPressing: 'Germany', catalogNo: 'Tresor 9', matrixRunout: 'TR009-A',
    vinylWeight: '140g', vinylColor: 'Black', format: '3x12"', speed: '33 RPM',
    sleeveCondition: 2, sleeveType: 'Single', innerSleeve: 'Generic white',
    mastering: 'AAA', pressingPlant: 'Pallas',
    flawNotes: 'Cover has ring wear and edge scuffs. Original Tresor pressing. Vinyl has surface noise in quiet passages.',
    discogsMedian: 105, discogsLow: 45, discogsHigh: 350,
  },
  {
    id: 'WX-006', artist: 'Boards of Canada', title: 'Music Has the Right to Children', label: 'Warp', year: 1998, condition: 3, price: 65.00, suggestedPrice: 68.00, priceDelta: 3, syncSource: 'shopify', status: 'on_hold', genre: 'Ambient', inPrintQueue: true, hasPhoto: true, photoColor: '#2a3a2a', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Features125/v4/b5/4c/c2/b54cc20d-03f5-f2c4-4a0d-9b51ad65af89/dj.txuslqgv.jpg/300x300bb.jpg',
    pressing: '1st Press', countryOfPressing: 'UK', catalogNo: 'WARP LP 55', matrixRunout: 'WARPLP55 A2 MPO', discogsReleaseId: 'r28384',
    vinylWeight: '140g', vinylColor: 'Black', format: '2x12"', speed: '33 RPM',
    sleeveCondition: 3, sleeveType: 'Gatefold', innerSleeve: 'Original printed',
    mastering: 'AAA', pressingPlant: 'MPO',
    flawNotes: 'Corner ding on bottom left, light shelf wear. Vinyl plays well with occasional light tick on Side C.',
    discogsMedian: 72, discogsLow: 35, discogsHigh: 200,
  },
  {
    id: 'WX-007', artist: 'Drexciya', title: "Neptune's Lair", label: 'Tresor', year: 1999, condition: 5, price: 140.00, suggestedPrice: 160.00, priceDelta: 20, syncSource: 'discogs', status: 'active', genre: 'Electro', inPrintQueue: false, hasPhoto: true, photoColor: '#0a2a4a', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/95/a4/3f/95a43f9d-4eb9-e5a9-ee64-910d3fb95e6c/3663729188892_3000.jpg/300x300bb.jpg',
    pressing: '1st Press', countryOfPressing: 'Germany', catalogNo: 'Tresor 56', matrixRunout: 'TR056-A1', discogsReleaseId: 'r28901',
    vinylWeight: '140g', vinylColor: 'Black', format: '2x12"', speed: '33 RPM',
    sleeveCondition: 5, sleeveType: 'Gatefold', innerSleeve: 'Original printed', inserts: ['Liner notes'],
    mastering: 'AAA', pressingPlant: 'Pallas',
    discogsMedian: 155, discogsLow: 80, discogsHigh: 450,
  },
  {
    id: 'WX-008', artist: 'Daft Punk', title: 'Homework', label: 'Virgin', year: 1997, condition: 4, price: 55.00, suggestedPrice: 58.00, priceDelta: 3, syncSource: 'discogs', status: 'active', genre: 'House', inPrintQueue: false, hasPhoto: true, photoColor: '#3a2a1a', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/dc/68/45/dc684589-af57-6895-1177-4f2acbb93e47/190296240911.jpg/300x300bb.jpg',
    pressing: '1st Press', countryOfPressing: 'France', catalogNo: 'V 2821', matrixRunout: 'V2821 A1',
    vinylWeight: '140g', vinylColor: 'Black', format: '2x12"', speed: '33 RPM',
    sleeveCondition: 4, sleeveType: 'Gatefold', innerSleeve: 'Original printed',
    mastering: 'AAD', pressingPlant: 'MPO',
    discogsMedian: 55, discogsLow: 30, discogsHigh: 120,
  },
  {
    id: 'WX-009', artist: 'Orbital', title: 'Orbital 2', label: 'Internal', year: 1993, condition: 4, price: 38.00, suggestedPrice: 42.00, priceDelta: 4, syncSource: 'csv', status: 'active', genre: 'Techno', inPrintQueue: false, hasPhoto: true, photoColor: '#4a3a2a', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/e0/5a/1f/e05a1f95-1c5a-cd76-52ef-0e72ac9d7726/639842823128.jpg/300x300bb.jpg',
    pressing: '1st Press', countryOfPressing: 'UK', catalogNo: 'TRUCD 5', matrixRunout: 'TRULP5-A1',
    vinylWeight: '140g', vinylColor: 'Black', format: '2x12"', speed: '33 RPM',
    sleeveCondition: 3, sleeveType: 'Gatefold', innerSleeve: 'Original printed',
    mastering: 'AAD',
    flawNotes: 'Light ring wear on cover. Vinyl clean with minor surface marks.',
    discogsMedian: 40, discogsLow: 20, discogsHigh: 85,
  },
  {
    id: 'WX-010', artist: 'Robert Hood', title: 'Minimal Nation', label: 'M-Plant', year: 1994, condition: 3, price: 180.00, suggestedPrice: 200.00, priceDelta: 20, syncSource: 'discogs', status: 'active', genre: 'Techno', inPrintQueue: false, hasPhoto: true, photoColor: '#1a1a1a', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/cd/12/ed/cd12ed3b-6879-74ce-18c5-18dd5c72cf34/mzi.ugxsyblg.jpg/300x300bb.jpg',
    pressing: '1st Press', countryOfPressing: 'US', catalogNo: 'M.PM5', matrixRunout: 'MPM5-A', discogsReleaseId: 'r9284',
    vinylWeight: '140g', vinylColor: 'Black', format: '3x12"', speed: '33 RPM',
    sleeveCondition: 2, sleeveType: 'Single', innerSleeve: 'Generic white',
    mastering: 'AAA',
    flawNotes: 'Plain sleeve has shelf wear and minor ring wear. Vinyl has surface noise. Extremely rare original M-Plant pressing.',
    discogsMedian: 195, discogsLow: 90, discogsHigh: 800,
  },
  {
    id: 'WX-011', artist: 'Plastikman', title: 'Sheet One', label: 'NovaMute', year: 1993, condition: 4, price: 72.00, suggestedPrice: 78.00, priceDelta: 6, syncSource: 'manual', status: 'active', genre: 'Acid', inPrintQueue: false, hasPhoto: true, photoColor: '#2a2a3a', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music113/v4/1b/2d/ca/1b2dcad1-2b98-ddb8-2470-c515cc609b13/192641477133_Cover.jpg/300x300bb.jpg',
    pressing: 'Reissue', countryOfPressing: 'UK', catalogNo: 'NoMu 22L',
    vinylWeight: '180g', vinylColor: 'Clear', format: '2x12"', speed: '33 RPM',
    sleeveCondition: 4, sleeveType: 'Gatefold', innerSleeve: 'Poly-lined',
    mastering: 'AAD', pressingPlant: 'GZ Media',
    discogsMedian: 75, discogsLow: 40, discogsHigh: 130,
  },
  {
    id: 'WX-012', artist: 'The KLF', title: 'Chill Out', label: 'KLF Communications', year: 1990, condition: 3, price: 68.00, suggestedPrice: 72.00, priceDelta: 4, syncSource: 'discogs', status: 'active', genre: 'Ambient', inPrintQueue: true, hasPhoto: true, photoColor: '#5a6a3a', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/37/b5/53/37b5534a-a270-feff-710d-e82395e4d9dc/193483938530.jpg/300x300bb.jpg',
    pressing: '1st Press', countryOfPressing: 'UK', catalogNo: 'JAMS LP 5', matrixRunout: 'JAMSLP5 A1',
    vinylWeight: '120g', vinylColor: 'Black', format: '12"', speed: '33 RPM',
    sleeveCondition: 3, sleeveType: 'Single', innerSleeve: 'Generic white',
    mastering: 'AAA',
    flawNotes: 'Cover has light staining on back. Vinyl plays well with occasional tick. Original UK pressing.',
    discogsMedian: 70, discogsLow: 30, discogsHigh: 180,
  },
]

export const crates: Crate[] = [
  { id: 'crate-all', name: 'All Inventory', type: 'smart', records: [], createdAt: '2025-01-01' },
  { id: 'crate-dead', name: 'Aged Inventory', type: 'dead_stock', records: ['WX-006', 'WX-012'], createdAt: '2025-01-01' },
  { id: 'crate-new', name: 'New Arrivals', type: 'manual', records: ['WX-003', 'WX-004', 'WX-011'], createdAt: '2026-02-01' },
  { id: 'crate-techno', name: 'Techno Essentials', type: 'manual', records: ['WX-003', 'WX-004', 'WX-005', 'WX-009', 'WX-010'], createdAt: '2026-01-15' },
  { id: 'crate-rare', name: 'Rare Pressings', type: 'manual', records: ['WX-002', 'WX-005', 'WX-007', 'WX-010'], createdAt: '2026-01-20' },
]

export const catalogResults: CatalogResult[] = [
  { discogsId: 'r1234567', artist: 'Aphex Twin', title: 'Selected Ambient Works 85-92', label: 'Apollo', year: 1992, country: 'UK', format: 'LP, Album', catNo: 'AMB LP 3922', pressings: 47, medianPrice: 42, lowestPrice: 28, highestPrice: 185, have: 8420, want: 12800 },
  { discogsId: 'r2345678', artist: 'Aphex Twin', title: 'Selected Ambient Works 85-92', label: 'Apollo', year: 2006, country: 'UK', format: '2xLP, RE', catNo: 'AMB LP 3922', pressings: 47, medianPrice: 35, lowestPrice: 22, highestPrice: 65, have: 4200, want: 6100 },
  { discogsId: 'r3456789', artist: 'Aphex Twin', title: 'Selected Ambient Works Volume II', label: 'Warp', year: 1994, country: 'UK', format: '3xLP', catNo: 'WARP LP 21', pressings: 32, medianPrice: 68, lowestPrice: 45, highestPrice: 320, have: 6100, want: 9400 },
  { discogsId: 'r4567890', artist: 'Aphex Twin', title: '...I Care Because You Do', label: 'Warp', year: 1995, country: 'UK', format: '2xLP', catNo: 'WARP LP 30', pressings: 18, medianPrice: 52, lowestPrice: 30, highestPrice: 150, have: 3200, want: 5600 },
  { discogsId: 'r5678901', artist: 'Aphex Twin', title: 'Richard D. James Album', label: 'Warp', year: 1996, country: 'UK', format: 'LP', catNo: 'WARP LP 43', pressings: 22, medianPrice: 38, lowestPrice: 25, highestPrice: 120, have: 5400, want: 7800 },
]

export const importBatch: ImportBatch = {
  id: 'IMP-042',
  source: 'csv',
  fileName: 'spring_inventory_2026.csv',
  totalRecords: 156,
  matched: 142,
  needsReview: 14,
  status: 'review',
  records: [
    { artist: 'Surgeon', title: 'Force + Form', matchConfidence: 98, suggestedPrice: 45, matched: true, discogsMatch: 'Tresor — Tresor 65' },
    { artist: 'Four Tet', title: 'Rounds', matchConfidence: 95, suggestedPrice: 32, matched: true, discogsMatch: 'Domino — WIGCD136' },
    { artist: 'Floating Points', title: 'Crush', matchConfidence: 97, suggestedPrice: 28, matched: true, discogsMatch: 'Ninja Tune — ZENCD260' },
    { artist: 'Autechre', title: 'Tri Repetae', matchConfidence: 92, suggestedPrice: 35, matched: true, discogsMatch: 'Warp — WARP LP 38' },
    { artist: 'Carl Craig', title: 'Landcruising', matchConfidence: 96, suggestedPrice: 30, matched: true, discogsMatch: 'Blanco y Negro — 0630-14511-1' },
    { artist: 'Theo Parrish', title: 'First Floor', matchConfidence: 64, suggestedPrice: undefined, matched: false, discogsMatch: undefined },
    { artist: 'Moodymann', title: 'Silentintroduction', matchConfidence: 58, suggestedPrice: undefined, matched: false, discogsMatch: undefined },
    { artist: 'Kerri Chandler', title: 'Spaces and Places', matchConfidence: 72, suggestedPrice: 42, matched: false, discogsMatch: 'Kaoz Theory — KT042 (?)' },
  ],
}

export const shelves: Shelf[] = [
  {
    id: 'shelf-1', name: 'New Arrivals', type: 'curated', recordCount: 24,
    records: [
      { id: 'WX-003', artist: 'Underworld', title: 'Dubnobasswithmyheadman', featured: false },
      { id: 'WX-004', artist: 'Burial', title: 'Untrue', featured: true },
      { id: 'WX-011', artist: 'Plastikman', title: 'Sheet One', featured: false },
    ],
  },
  {
    id: 'shelf-2', name: 'Hot Shelf', type: 'algorithmic', recordCount: 18,
    records: [
      { id: 'WX-001', artist: 'Aphex Twin', title: 'Selected Ambient Works 85-92', featured: true },
      { id: 'WX-008', artist: 'Daft Punk', title: 'Homework', featured: true },
      { id: 'WX-009', artist: 'Orbital', title: 'Orbital 2', featured: false },
    ],
  },
  {
    id: 'shelf-3', name: 'Staff Picks', type: 'featured', recordCount: 12,
    records: [
      { id: 'WX-007', artist: 'Drexciya', title: "Neptune's Lair", featured: true },
      { id: 'WX-006', artist: 'Boards of Canada', title: 'Music Has the Right to Children', featured: true },
    ],
  },
  {
    id: 'shelf-4', name: 'Deep Cuts', type: 'genre', recordCount: 31,
    records: [
      { id: 'WX-005', artist: 'Jeff Mills', title: 'Waveform Transmission Vol. 1', featured: false },
      { id: 'WX-010', artist: 'Robert Hood', title: 'Minimal Nation', featured: false },
      { id: 'WX-002', artist: 'Basic Channel', title: 'BCD', featured: true },
    ],
  },
  {
    id: 'shelf-5', name: 'Rare Pressings', type: 'curated', recordCount: 8,
    records: [
      { id: 'WX-010', artist: 'Robert Hood', title: 'Minimal Nation', featured: true },
      { id: 'WX-007', artist: 'Drexciya', title: "Neptune's Lair", featured: true },
    ],
  },
]

export const storefrontConfig: StorefrontConfig = {
  storeName: 'Wax & Groove Records',
  url: 'waxandgroove.waxe.io',
  status: 'live',
  primaryColor: '#FFFFFF',
  accentColor: '#2400FF',
  logoText: 'W&G',
  description: 'Portland\'s finest curated vinyl since 2018',
  socialLinks: {
    instagram: 'waxandgroove',
    twitter: 'waxandgroove',
    bandcamp: 'waxandgroove',
  },
}

export const revenueData: RevenueDataPoint[] = [
  { month: 'Aug', revenue: 8200, orders: 98 },
  { month: 'Sep', revenue: 9100, orders: 112 },
  { month: 'Oct', revenue: 10400, orders: 128 },
  { month: 'Nov', revenue: 12800, orders: 156 },
  { month: 'Dec', revenue: 15600, orders: 192 },
  { month: 'Jan', revenue: 13200, orders: 164 },
  { month: 'Feb', revenue: 14230, orders: 186 },
]

export const channelRevenueData: ChannelRevenuePoint[] = [
  { month: 'Aug', discogs: 3800, storefront: 2400, pos: 2000 },
  { month: 'Sep', discogs: 4200, storefront: 2700, pos: 2200 },
  { month: 'Oct', discogs: 4800, storefront: 3100, pos: 2500 },
  { month: 'Nov', discogs: 5600, storefront: 4000, pos: 3200 },
  { month: 'Dec', discogs: 6400, storefront: 5200, pos: 4000 },
  { month: 'Jan', discogs: 5800, storefront: 4200, pos: 3200 },
  { month: 'Feb', discogs: 6100, storefront: 4630, pos: 3500 },
]

export const marginData: MarginDataPoint[] = [
  { month: 'Aug', revenue: 8200, cost: 4920, margin: 3280, marginPct: 40 },
  { month: 'Sep', revenue: 9100, cost: 5280, margin: 3820, marginPct: 42 },
  { month: 'Oct', revenue: 10400, cost: 5820, margin: 4580, marginPct: 44 },
  { month: 'Nov', revenue: 12800, cost: 7040, margin: 5760, marginPct: 45 },
  { month: 'Dec', revenue: 15600, cost: 8580, margin: 7020, marginPct: 45 },
  { month: 'Jan', revenue: 13200, cost: 7260, margin: 5940, marginPct: 45 },
  { month: 'Feb', revenue: 14230, cost: 7690, margin: 6540, marginPct: 46 },
]

export const daysOnShelfData: DaysOnShelfBucket[] = [
  { range: '0–7d', count: 124, value: 4960 },
  { range: '8–14d', count: 218, value: 8720 },
  { range: '15–30d', count: 386, value: 15440 },
  { range: '31–60d', count: 542, value: 21680 },
  { range: '61–90d', count: 312, value: 12480 },
  { range: '90+', count: 187, value: 9350 },
]

export const priceVsMarketData: PriceVsMarketItem[] = [
  { artist: 'Robert Hood', title: 'Minimal Nation', yourPrice: 180, discogsMedian: 195, delta: -15, deltaPct: -8 },
  { artist: 'Drexciya', title: "Neptune's Lair", yourPrice: 140, discogsMedian: 155, delta: -15, deltaPct: -10 },
  { artist: 'Basic Channel', title: 'BCD', yourPrice: 120, discogsMedian: 130, delta: -10, deltaPct: -8 },
  { artist: 'Jeff Mills', title: 'Waveform Transmission', yourPrice: 95, discogsMedian: 105, delta: -10, deltaPct: -10 },
  { artist: 'Aphex Twin', title: 'SAW 85-92', yourPrice: 85, discogsMedian: 88, delta: -3, deltaPct: -3 },
  { artist: 'Plastikman', title: 'Sheet One', yourPrice: 72, discogsMedian: 75, delta: -3, deltaPct: -4 },
  { artist: 'The KLF', title: 'Chill Out', yourPrice: 68, discogsMedian: 70, delta: -2, deltaPct: -3 },
  { artist: 'Boards of Canada', title: 'MHTRTC', yourPrice: 65, discogsMedian: 72, delta: -7, deltaPct: -10 },
  { artist: 'Daft Punk', title: 'Homework', yourPrice: 55, discogsMedian: 55, delta: 0, deltaPct: 0 },
  { artist: 'Burial', title: 'Untrue', yourPrice: 48, discogsMedian: 50, delta: -2, deltaPct: -4 },
  { artist: 'Underworld', title: 'Dubnobasswithmyheadman', yourPrice: 45, discogsMedian: 42, delta: 3, deltaPct: 7 },
  { artist: 'Orbital', title: 'Orbital 2', yourPrice: 38, discogsMedian: 40, delta: -2, deltaPct: -5 },
]

export const deadStockSummary: DeadStockSummary = {
  totalItems: 187,
  totalValue: 9350,
  avgDaysListed: 128,
  topGenre: 'Jazz',
}

export const missedSearches: MissedSearch[] = [
  { query: 'Actress — Splazsh', searchCount: 18, lastSearched: '2 days ago', available: false },
  { query: 'DJ Rashad — Double Cup', searchCount: 14, lastSearched: '1 day ago', available: false },
  { query: 'Arca — Arca', searchCount: 12, lastSearched: '3 days ago', available: false },
  { query: 'Andy Stott — Luxury Problems', searchCount: 11, lastSearched: 'today', available: false },
  { query: 'Objekt — Flatland', searchCount: 9, lastSearched: '5 days ago', available: false },
  { query: 'Helena Hauff — Qualm', searchCount: 8, lastSearched: '1 week ago', available: false },
  { query: 'Levon Vincent — Fabric 63', searchCount: 7, lastSearched: '4 days ago', available: false },
  { query: 'Ricardo Villalobos — Alcachofa', searchCount: 6, lastSearched: '2 days ago', available: false },
]

export const genreDemandData: GenreDemandPoint[] = [
  { month: 'Aug', techno: 82, house: 75, ambient: 48, electro: 55, breakbeat: 38 },
  { month: 'Sep', techno: 85, house: 78, ambient: 52, electro: 58, breakbeat: 42 },
  { month: 'Oct', techno: 88, house: 80, ambient: 55, electro: 62, breakbeat: 45 },
  { month: 'Nov', techno: 92, house: 85, ambient: 58, electro: 65, breakbeat: 50 },
  { month: 'Dec', techno: 95, house: 88, ambient: 62, electro: 70, breakbeat: 55 },
  { month: 'Jan', techno: 90, house: 82, ambient: 58, electro: 66, breakbeat: 48 },
  { month: 'Feb', techno: 93, house: 86, ambient: 60, electro: 68, breakbeat: 52 },
]

export const priceTrendData: PriceTrendPoint[] = [
  { month: 'Aug', c5: 48, c4: 35, c3: 22, c2: 14 },
  { month: 'Sep', c5: 50, c4: 36, c3: 23, c2: 14 },
  { month: 'Oct', c5: 52, c4: 38, c3: 24, c2: 15 },
  { month: 'Nov', c5: 55, c4: 40, c3: 25, c2: 15 },
  { month: 'Dec', c5: 58, c4: 42, c3: 26, c2: 16 },
  { month: 'Jan', c5: 56, c4: 41, c3: 25, c2: 15 },
  { month: 'Feb', c5: 60, c4: 43, c3: 27, c2: 16 },
]

export const restockRecommendations: RestockRecommendation[] = [
  { artist: 'Autechre', title: 'Tri Repetae', genre: 'IDM', demandScore: 94, avgSalePrice: 45, lastSold: '3 days ago', velocity: 'high' },
  { artist: 'Carl Craig', title: 'Landcruising', genre: 'Techno', demandScore: 91, avgSalePrice: 38, lastSold: '1 week ago', velocity: 'high' },
  { artist: 'Theo Parrish', title: 'First Floor', genre: 'House', demandScore: 88, avgSalePrice: 55, lastSold: '5 days ago', velocity: 'high' },
  { artist: 'Moodymann', title: 'Silentintroduction', genre: 'House', demandScore: 85, avgSalePrice: 65, lastSold: '2 weeks ago', velocity: 'medium' },
  { artist: 'Surgeon', title: 'Force + Form', genre: 'Techno', demandScore: 82, avgSalePrice: 32, lastSold: '1 week ago', velocity: 'medium' },
  { artist: 'Kerri Chandler', title: 'Spaces and Places', genre: 'House', demandScore: 78, avgSalePrice: 42, lastSold: '4 days ago', velocity: 'medium' },
  { artist: 'Biosphere', title: 'Substrata', genre: 'Ambient', demandScore: 75, avgSalePrice: 35, lastSold: '3 weeks ago', velocity: 'low' },
]

export const velocityData: VelocityDataPoint[] = [
  { week: 'W1', sold: 32, added: 45 },
  { week: 'W2', sold: 28, added: 38 },
  { week: 'W3', sold: 41, added: 30 },
  { week: 'W4', sold: 35, added: 52 },
  { week: 'W5', sold: 44, added: 36 },
  { week: 'W6', sold: 38, added: 42 },
]

export const transactions: Transaction[] = [
  { id: 'TXN-4821', time: '2:34 PM', customer: 'Walk-in', items: 'Aphex Twin — SAW 85-92', total: 85.00, method: 'card', synced: true },
  { id: 'TXN-4820', time: '2:12 PM', customer: 'Sarah M.', items: '2 records', total: 103.00, method: 'tap', synced: true },
  { id: 'TXN-4819', time: '1:48 PM', customer: 'Walk-in', items: 'Burial — Untrue', total: 48.00, method: 'cash', synced: true },
  { id: 'TXN-4818', time: '12:30 PM', customer: 'James R.', items: '3 records', total: 178.00, method: 'card', synced: true },
  { id: 'TXN-4817', time: '11:55 AM', customer: 'Walk-in', items: 'Daft Punk — Homework', total: 55.00, method: 'tap', synced: true },
  { id: 'TXN-4816', time: '11:20 AM', customer: 'Mike D.', items: 'Jeff Mills — Waveform Transmission', total: 95.00, method: 'card', synced: false },
  { id: 'TXN-4815', time: '10:45 AM', customer: 'Walk-in', items: '2 records', total: 68.00, method: 'cash', synced: true },
]

export const hourlySalesData: HourlySalesPoint[] = [
  { hour: '9 AM', sales: 85, transactions: 2 },
  { hour: '10 AM', sales: 148, transactions: 3 },
  { hour: '11 AM', sales: 193, transactions: 4 },
  { hour: '12 PM', sales: 242, transactions: 5 },
  { hour: '1 PM', sales: 177, transactions: 3 },
  { hour: '2 PM', sales: 287, transactions: 4 },
  { hour: '3 PM', sales: 0, transactions: 0 },
  { hour: '4 PM', sales: 0, transactions: 0 },
]

export const conversations: Conversation[] = [
  {
    id: 'conv-1', customerName: 'Sarah Mitchell', lastMessage: 'Is the Aphex Twin still available?', lastTime: '2:15 PM', unread: 2,
    messages: [
      { id: 'm1', sender: 'customer', text: 'Hi! I saw the Aphex Twin — SAW 85-92 listing. Is it still available?', time: '2:10 PM' },
      { id: 'm2', sender: 'dealer', text: 'Hey Sarah! Yes, it\'s still here. 4★ condition, original Apollo pressing.', time: '2:12 PM' },
      { id: 'm3', sender: 'customer', text: 'Amazing! Can I see a closer photo of the sleeve?', time: '2:13 PM' },
      { id: 'm4', sender: 'customer', text: 'Is the Aphex Twin still available?', time: '2:15 PM', linkedItem: 'WX-001' },
    ],
  },
  {
    id: 'conv-2', customerName: 'James Rodriguez', lastMessage: 'Thanks, I\'ll pick it up tomorrow', lastTime: '1:45 PM', unread: 0,
    messages: [
      { id: 'm5', sender: 'customer', text: 'Do you have any Drexciya records in stock?', time: '1:30 PM' },
      { id: 'm6', sender: 'dealer', text: 'We have Neptune\'s Lair — Sealed, original Tresor pressing. $140.', time: '1:32 PM', linkedItem: 'WX-007' },
      { id: 'm7', sender: 'customer', text: 'That\'s perfect. Can you hold it for me?', time: '1:40 PM' },
      { id: 'm8', sender: 'dealer', text: 'Done! Reserved under your name. We\'re open until 7 PM.', time: '1:42 PM' },
      { id: 'm9', sender: 'customer', text: 'Thanks, I\'ll pick it up tomorrow', time: '1:45 PM' },
    ],
  },
  {
    id: 'conv-3', customerName: 'Alex Chen', lastMessage: 'Looking for rare techno vinyl', lastTime: '12:30 PM', unread: 1,
    messages: [
      { id: 'm10', sender: 'customer', text: 'Looking for rare techno vinyl. Do you have any Robert Hood?', time: '12:28 PM' },
      { id: 'm11', sender: 'dealer', text: 'Yes! Minimal Nation, original M-Plant pressing. $180. It\'s a grail.', time: '12:30 PM', linkedItem: 'WX-010' },
    ],
  },
  {
    id: 'conv-4', customerName: 'Maria Santos', lastMessage: 'Shipped! Tracking: 1Z999AA10..', lastTime: 'Yesterday', unread: 0,
    messages: [
      { id: 'm12', sender: 'customer', text: 'Hi, just placed order #1847 for the Orbital LP', time: 'Yesterday' },
      { id: 'm13', sender: 'dealer', text: 'Got it! Packing now. Should ship today.', time: 'Yesterday' },
      { id: 'm14', sender: 'dealer', text: 'Shipped! Tracking: 1Z999AA10..', time: 'Yesterday' },
    ],
  },
  {
    id: 'conv-5', customerName: 'David Park', lastMessage: 'Any Basic Channel besides BCD?', lastTime: 'Yesterday', unread: 0,
    messages: [
      { id: 'm15', sender: 'customer', text: 'Any Basic Channel besides BCD?', time: 'Yesterday' },
    ],
  },
]

export const networkConversations: Conversation[] = [
  {
    id: 'nconv-1', customerName: 'BPM Supply', lastMessage: 'We have 3 copies of the Jeff Mills you wanted', lastTime: '11:30 AM', unread: 1,
    messages: [
      { id: 'nm1', sender: 'customer', text: 'Hey, we just got in a collection with some Tresor pressings. Interested?', time: '11:15 AM' },
      { id: 'nm2', sender: 'dealer', text: 'Absolutely! Looking for Waveform Transmission and anything Surgeon.', time: '11:20 AM' },
      { id: 'nm3', sender: 'customer', text: 'We have 3 copies of the Jeff Mills you wanted', time: '11:30 AM' },
    ],
  },
  {
    id: 'nconv-2', customerName: 'Crate Diggers Union', lastMessage: 'Pack shipped — tracking sent', lastTime: 'Yesterday', unread: 0,
    messages: [
      { id: 'nm4', sender: 'dealer', text: 'Chicago house pack is ready. 12 records, mostly Trax and DJ International.', time: 'Yesterday' },
      { id: 'nm5', sender: 'customer', text: 'Pack shipped — tracking sent', time: 'Yesterday' },
    ],
  },
  {
    id: 'nconv-3', customerName: 'Deep Groove Records', lastMessage: 'Deal — swapping 3 jazz for 2 techno', lastTime: '2 days ago', unread: 0,
    messages: [
      { id: 'nm6', sender: 'customer', text: 'Interested in your Blue Train and Monk pressings. We can trade Detroit techno.', time: '2 days ago' },
      { id: 'nm7', sender: 'dealer', text: 'Deal — swapping 3 jazz for 2 techno', time: '2 days ago' },
    ],
  },
]

export const genreBreakdowns: GenreBreakdown[] = [
  { genre: 'Techno', count: 482, revenue: 4820, percentage: 32 },
  { genre: 'House', count: 398, revenue: 3580, percentage: 22 },
  { genre: 'Ambient', count: 356, revenue: 3200, percentage: 18 },
  { genre: 'Electro', count: 312, revenue: 2800, percentage: 15 },
  { genre: 'Dub Techno', count: 224, revenue: 1800, percentage: 10 },
  { genre: 'Other', count: 75, revenue: 530, percentage: 3 },
]

export const conditionBreakdowns: ConditionBreakdown[] = [
  { condition: '★★★★★ Mint', count: 382, percentage: 20 },
  { condition: '★★★★ Excellent', count: 796, percentage: 43 },
  { condition: '★★★ Good', count: 456, percentage: 25 },
  { condition: '★★ Fair', count: 159, percentage: 9 },
  { condition: '★ Poor', count: 54, percentage: 3 },
]

export const posQuickStats: QuickStat[] = [
  { label: 'Sales Today', value: '$1,420', trend: '+$340', trendUp: true },
  { label: 'Transactions', value: '21', trend: '+5', trendUp: true },
  { label: 'Avg Transaction', value: '$67.60', trend: '+$8', trendUp: true },
  { label: 'Items Sold', value: '21', trend: '+5', trendUp: true },
]

export const orders: Order[] = [
  {
    id: 'ORD-1901', date: 'Feb 11, 2026', status: 'unfulfilled', shippingMethod: 'standard', weight: '0.8 lb', labelPrinted: false, orderType: 'd2c',
    customer: { name: 'Lena Kowalski', email: 'lena.k@proton.me', address: '412 NW 23rd Ave, Portland, OR 97210' },
    items: [
      { recordId: 'WX-001', artist: 'Aphex Twin', title: 'Selected Ambient Works 85-92', price: 85.00, qty: 1 },
      { recordId: 'WX-011', artist: 'Plastikman', title: 'Sheet One', price: 72.00, qty: 1 },
    ],
    total: 162.99,
  },
  {
    id: 'ORD-1900', date: 'Feb 11, 2026', status: 'processing', shippingMethod: 'priority', weight: '0.5 lb', labelPrinted: true, orderType: 'd2c',
    customer: { name: 'Marcus Chen', email: 'mchen@gmail.com', address: '88 Division St, Brooklyn, NY 11211' },
    items: [
      { recordId: 'WX-004', artist: 'Burial', title: 'Untrue', price: 48.00, qty: 1 },
    ],
    total: 55.99,
  },
  {
    id: 'ORD-1899', date: 'Feb 10, 2026', status: 'label_printed', shippingMethod: 'pickup', weight: '1.2 lb', labelPrinted: true, orderType: 'b2b',
    customer: { name: 'Sofia Ramirez', email: 'sofia.r@icloud.com', address: '1420 S Congress Ave, Austin, TX 78704' },
    items: [
      { recordId: 'WX-007', artist: 'Drexciya', title: "Neptune's Lair", price: 140.00, qty: 1 },
      { recordId: 'WX-008', artist: 'Daft Punk', title: 'Homework', price: 55.00, qty: 1 },
    ],
    total: 207.99,
  },
  {
    id: 'ORD-1898', date: 'Feb 10, 2026', status: 'in_transit', shippingMethod: 'priority', weight: '0.9 lb', labelPrinted: true, orderType: 'd2c',
    trackingNumber: '1Z999AA10123456784', carrier: 'UPS',
    customer: { name: 'James Rodriguez', email: 'jrod@fastmail.com', address: '2200 Michigan Ave, Chicago, IL 60616' },
    items: [
      { recordId: 'WX-009', artist: 'Orbital', title: 'Orbital 2', price: 38.00, qty: 1 },
      { recordId: 'WX-003', artist: 'Underworld', title: 'Dubnobasswithmyheadman', price: 45.00, qty: 1 },
    ],
    total: 90.99,
  },
  {
    id: 'ORD-1897', date: 'Feb 9, 2026', status: 'in_transit', shippingMethod: 'standard', weight: '0.5 lb', labelPrinted: true, orderType: 'd2c',
    trackingNumber: '9400111899223100684717', carrier: 'USPS',
    customer: { name: 'Yuki Tanaka', email: 'yuki.t@outlook.com', address: '540 Howard St, San Francisco, CA 94105' },
    items: [
      { recordId: 'WX-012', artist: 'The KLF', title: 'Chill Out', price: 68.00, qty: 1 },
    ],
    total: 73.99,
  },
  {
    id: 'ORD-1896', date: 'Feb 9, 2026', status: 'delivered', shippingMethod: 'pickup', weight: '0.6 lb', labelPrinted: true, orderType: 'b2b',
    trackingNumber: '1Z999AA10123456790', carrier: 'UPS',
    customer: { name: 'Alex Petrov', email: 'apetrov@pm.me', address: '710 Peachtree St NE, Atlanta, GA 30308' },
    items: [
      { recordId: 'WX-005', artist: 'Jeff Mills', title: 'Waveform Transmission Vol. 1', price: 95.00, qty: 1 },
    ],
    total: 107.99,
  },
  {
    id: 'ORD-1895', date: 'Feb 8, 2026', status: 'delivered', shippingMethod: 'priority', weight: '1.0 lb', labelPrinted: true, orderType: 'd2c',
    trackingNumber: '9261290100130435082878', carrier: 'USPS',
    customer: { name: 'Nina Okafor', email: 'nina.ok@hey.com', address: '345 Flatbush Ave, Brooklyn, NY 11238' },
    items: [
      { recordId: 'WX-002', artist: 'Basic Channel', title: 'BCD', price: 120.00, qty: 1 },
      { recordId: 'WX-006', artist: 'Boards of Canada', title: 'Music Has the Right to Children', price: 65.00, qty: 1 },
    ],
    total: 192.99,
  },
  {
    id: 'ORD-1894', date: 'Feb 8, 2026', status: 'unfulfilled', shippingMethod: 'standard', weight: '0.5 lb', labelPrinted: false, orderType: 'd2c',
    customer: { name: 'Tomás Herrera', email: 'therrera@gmail.com', address: '1501 Vine St, Los Angeles, CA 90028' },
    items: [
      { recordId: 'WX-010', artist: 'Robert Hood', title: 'Minimal Nation', price: 180.00, qty: 1 },
    ],
    total: 185.99,
  },
  {
    id: 'ORD-1893', date: 'Feb 7, 2026', status: 'delivered', shippingMethod: 'standard', weight: '0.7 lb', labelPrinted: true, orderType: 'd2c',
    trackingNumber: '9400111899223100684731', carrier: 'USPS',
    customer: { name: 'Elise Dumont', email: 'elise.d@laposte.net', address: '920 SW 6th Ave, Portland, OR 97204' },
    items: [
      { recordId: 'WX-008', artist: 'Daft Punk', title: 'Homework', price: 55.00, qty: 1 },
    ],
    total: 60.99,
  },
  {
    id: 'ORD-1892', date: 'Feb 7, 2026', status: 'processing', shippingMethod: 'pickup', weight: '0.6 lb', labelPrinted: false, orderType: 'b2b',
    customer: { name: 'Ryan Walsh', email: 'rwalsh@me.com', address: '800 Boylston St, Boston, MA 02199' },
    items: [
      { recordId: 'WX-004', artist: 'Burial', title: 'Untrue', price: 48.00, qty: 1 },
      { recordId: 'WX-009', artist: 'Orbital', title: 'Orbital 2', price: 38.00, qty: 1 },
    ],
    total: 98.99,
  },
]

export const fulfillmentStats: QuickStat[] = [
  { label: 'Unfulfilled Orders', value: '5', trend: '+2', trendUp: false },
  { label: 'Orders Fulfilled', value: '3', trend: '+1', trendUp: true },
  { label: 'Items Ordered', value: '14', trend: '+3', trendUp: true },
  { label: 'Avg Time to Fulfillment', value: '1.4d', trend: '-0.3d', trendUp: true },
]

// ─── Competitor Intelligence ─────────────────────────────────

export interface ChannelFeeStructure {
  channel: string
  platformFeePct: number
  shippingFeePct: number
  fixedFee: number
  color: string
  description: string
}

export const channelFeeStructures: ChannelFeeStructure[] = [
  { channel: 'Discogs', platformFeePct: 8, shippingFeePct: 8, fixedFee: 0, color: '#6A6090', description: '8% on sale + 8% on shipping' },
  { channel: 'Shopify', platformFeePct: 2.9, shippingFeePct: 0, fixedFee: 0.30, color: '#7B6FA0', description: '2.9% + $0.30 per transaction' },
  { channel: 'In-Store POS', platformFeePct: 0, shippingFeePct: 0, fixedFee: 0, color: '#E87B35', description: 'No platform fees' },
  { channel: 'WAXED', platformFeePct: 5, shippingFeePct: 0, fixedFee: 0, color: '#4A9A62', description: '5% flat — no shipping commission' },
]

export interface CompetitorPainPoint {
  category: string
  severityScore: number
  commentCount: number
  sampleQuote: string
  waxedAdvantage: string
}

export const competitorPainPoints: CompetitorPainPoint[] = [
  { category: 'Session Issues', severityScore: 9.2, commentCount: 156, sampleQuote: '"App logs me out every 5 minutes, cart empties mid-purchase"', waxedAdvantage: 'Persistent sessions with offline support' },
  { category: 'UX Regression', severityScore: 8.7, commentCount: 134, sampleQuote: '"New UI is a disaster — can\'t find anything anymore"', waxedAdvantage: 'Purpose-built dealer interface' },
  { category: 'High Fees', severityScore: 8.5, commentCount: 118, sampleQuote: '"8% on shipping too? That\'s insane for a $4 media mail"', waxedAdvantage: 'No shipping commission' },
  { category: 'Missing Features', severityScore: 7.9, commentCount: 102, sampleQuote: '"They removed price graphs — how do I price anything now?"', waxedAdvantage: 'Built-in price intelligence' },
  { category: 'Seller Tools Gutted', severityScore: 7.6, commentCount: 96, sampleQuote: '"Bulk editing is gone. I have 3000 listings to update"', waxedAdvantage: 'Bulk pricing & crate management' },
  { category: 'Mobile Unusable', severityScore: 7.1, commentCount: 88, sampleQuote: '"App crashes when scrolling my inventory past 200 records"', waxedAdvantage: 'Mobile-first responsive design' },
  { category: 'Search Degraded', severityScore: 6.8, commentCount: 78, sampleQuote: '"Search doesn\'t find exact catalog numbers anymore"', waxedAdvantage: 'Catalog-number & matrix search' },
]

export interface CompetitorMention {
  platform: string
  sentiment: 'negative' | 'mixed' | 'neutral' | 'positive'
  mentionCount: number
}

export const competitorMentions: CompetitorMention[] = [
  { platform: 'Discogs', sentiment: 'negative', mentionCount: 442 },
  { platform: 'eBay', sentiment: 'mixed', mentionCount: 128 },
  { platform: 'Personal sites', sentiment: 'neutral', mentionCount: 64 },
]

export interface PriceHistoryPoint {
  month: string
  storeAvg: number
  discogsAvg: number
  suggestedAvg: number
}

export const priceHistoryData: PriceHistoryPoint[] = [
  { month: 'Mar', storeAvg: 62, discogsAvg: 58, suggestedAvg: 64 },
  { month: 'Apr', storeAvg: 63, discogsAvg: 59, suggestedAvg: 65 },
  { month: 'May', storeAvg: 65, discogsAvg: 60, suggestedAvg: 66 },
  { month: 'Jun', storeAvg: 64, discogsAvg: 59, suggestedAvg: 66 },
  { month: 'Jul', storeAvg: 66, discogsAvg: 61, suggestedAvg: 68 },
  { month: 'Aug', storeAvg: 68, discogsAvg: 62, suggestedAvg: 70 },
  { month: 'Sep', storeAvg: 70, discogsAvg: 63, suggestedAvg: 72 },
  { month: 'Oct', storeAvg: 72, discogsAvg: 64, suggestedAvg: 74 },
  { month: 'Nov', storeAvg: 74, discogsAvg: 65, suggestedAvg: 75 },
  { month: 'Dec', storeAvg: 76, discogsAvg: 66, suggestedAvg: 77 },
  { month: 'Jan', storeAvg: 75, discogsAvg: 67, suggestedAvg: 77 },
  { month: 'Feb', storeAvg: 78, discogsAvg: 68, suggestedAvg: 79 },
]

export interface PriceIntelSummary {
  label: string
  value: string
  positive: boolean
}

export const priceIntelSummary: PriceIntelSummary[] = [
  { label: 'Avg Margin vs Market', value: '+12%', positive: true },
  { label: 'Records Above Market', value: '34%', positive: true },
  { label: 'Records Below Market', value: '18%', positive: false },
]
