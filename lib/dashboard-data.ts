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
  condition: number // 1-10 scale: 10=sealed, 9=pristine, 8=excellent, 7=very good, 6=good, 5=fair, 4=worn, 3=rough, 2=damaged, 1=trashed
  price: number
  suggestedPrice?: number
  priceDelta?: number
  syncSource: 'discogs' | 'shopify' | 'csv' | 'manual'
  status: 'active' | 'sold' | 'reserved' | 'pending'
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
  sleeveCondition: number    // 1-10 same scale as media
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

export interface StorefrontConfig {
  storeName: string
  url: string
  status: 'live' | 'draft'
  primaryColor: string
  accentColor: string
  logoText: string
  description: string
}

export interface RevenueDataPoint {
  month: string
  revenue: number
  orders: number
}

export interface GenreDemandPoint {
  month: string
  jazz: number
  rock: number
  hiphop: number
  electronic: number
  soul: number
}

export interface PriceTrendPoint {
  month: string
  c10: number // sealed/mint
  c9: number  // pristine
  c7: number  // very good
  c5: number  // fair
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

// ─── Mock Data ───────────────────────────────────────────────

export const quickStats: QuickStat[] = [
  { label: 'Total Listings', value: '2,847', trend: '+124', trendUp: true },
  { label: 'Orders This Month', value: '186', trend: '+23%', trendUp: true },
  { label: 'Revenue (MTD)', value: '$14,230', trend: '+18%', trendUp: true },
  { label: 'POS Sales Today', value: '$1,420', trend: '+$340', trendUp: true },
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
    id: 'WX-001', artist: 'Miles Davis', title: 'Kind of Blue', label: 'Columbia', year: 1959, condition: 9, price: 85.00, suggestedPrice: 92.00, priceDelta: 7, syncSource: 'discogs', status: 'active', genre: 'Jazz', inPrintQueue: false, hasPhoto: true, photoColor: '#1a3a5c', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music/7f/9f/d6/mzi.vtnaewef.jpg/300x300bb.jpg',
    pressing: '1st Press', countryOfPressing: 'US', catalogNo: 'CL 1355', matrixRunout: '1A/1A', discogsReleaseId: 'r1235678',
    vinylWeight: '140g', vinylColor: 'Black', format: '12"', speed: '33 RPM',
    sleeveCondition: 7, sleeveType: 'Single', innerSleeve: 'Original printed',
    mastering: 'AAA', pressingPlant: 'Columbia Pitman',
    flawNotes: 'Light ring wear on cover, vinyl plays clean with minor surface noise on Side B',
    discogsMedian: 88, discogsLow: 45, discogsHigh: 320,
  },
  {
    id: 'WX-002', artist: 'Fleetwood Mac', title: 'Rumours', label: 'Warner Bros.', year: 1977, condition: 7, price: 42.00, suggestedPrice: 38.00, priceDelta: -4, syncSource: 'shopify', status: 'active', genre: 'Rock', inPrintQueue: true, hasPhoto: true, photoColor: '#4a3728', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/4d/13/ba/4d13bac3-d3d5-7581-2c74-034219eadf2b/081227970949.jpg/300x300bb.jpg',
    pressing: 'Repress', countryOfPressing: 'US', catalogNo: 'BSK 3010', matrixRunout: 'BSK-1-3010-A SM2',
    vinylWeight: '120g', vinylColor: 'Black', format: '12"', speed: '33 RPM',
    sleeveCondition: 6, sleeveType: 'Gatefold', innerSleeve: 'Original printed', inserts: ['Lyric insert'],
    mastering: 'AAA', pressingPlant: 'Capitol Records',
    flawNotes: 'Seam split on top edge (~2"), inner sleeve has wear. Vinyl has light marks but plays through',
    discogsMedian: 35, discogsLow: 12, discogsHigh: 85,
  },
  {
    id: 'WX-003', artist: 'Kendrick Lamar', title: 'To Pimp a Butterfly', label: 'Interscope', year: 2015, condition: 10, price: 35.00, suggestedPrice: 40.00, priceDelta: 5, syncSource: 'csv', status: 'active', genre: 'Hip-Hop', inPrintQueue: false, hasPhoto: true, photoColor: '#2c4a2c', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/b5/a6/91/b5a69171-5232-3d5b-9c15-8963802f83dd/15UMGIM15814.rgb.jpg/300x300bb.jpg',
    pressing: '1st Press', countryOfPressing: 'US', catalogNo: 'B0022986-01', discogsReleaseId: 'r6854831',
    vinylWeight: '140g', vinylColor: 'Black', format: '2x12"', speed: '33 RPM',
    sleeveCondition: 10, sleeveType: 'Gatefold', innerSleeve: 'Poly-lined', inserts: ['Download card'],
    mastering: 'AAD',
    discogsMedian: 38, discogsLow: 22, discogsHigh: 65,
  },
  {
    id: 'WX-004', artist: 'Tame Impala', title: 'Currents', label: 'Modular', year: 2015, condition: 9, price: 28.00, suggestedPrice: 30.00, priceDelta: 2, syncSource: 'discogs', status: 'sold', genre: 'Electronic', inPrintQueue: false, hasPhoto: true, photoColor: '#3a2a4a', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/64/48/5c/64485cc9-968c-68cc-764e-9a7c71733def/00602567155454.rgb.jpg/300x300bb.jpg',
    pressing: 'Reissue', countryOfPressing: 'EU', catalogNo: '4795518', discogsReleaseId: 'r7241049',
    vinylWeight: '180g', vinylColor: 'Black', format: '2x12"', speed: '33 RPM',
    sleeveCondition: 9, sleeveType: 'Gatefold', innerSleeve: 'Poly-lined', inserts: ['Download card', 'Poster'],
    mastering: 'AAD', pressingPlant: 'GZ Media',
    discogsMedian: 30, discogsLow: 18, discogsHigh: 55,
  },
  {
    id: 'WX-005', artist: 'Nina Simone', title: 'I Put a Spell on You', label: 'Philips', year: 1965, condition: 6, price: 55.00, suggestedPrice: 60.00, priceDelta: 5, syncSource: 'manual', status: 'active', genre: 'Soul', inPrintQueue: true, hasPhoto: true, photoColor: '#3d2a4a', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/18/db/05/18db0507-f276-d93d-a4a7-e856a3f1590a/13UAAIM08283.rgb.jpg/300x300bb.jpg',
    pressing: '1st Press', countryOfPressing: 'US', catalogNo: 'PHM 200-172', matrixRunout: 'A-5770',
    vinylWeight: '120g', vinylColor: 'Black', format: '12"', speed: '33 RPM',
    sleeveCondition: 5, sleeveType: 'Single', innerSleeve: 'Generic white',
    mastering: 'AAA',
    flawNotes: 'Cover has water stain on back, ring wear on front. Vinyl has surface noise in quiet passages. Original Philips mono pressing.',
    discogsMedian: 62, discogsLow: 25, discogsHigh: 180,
  },
  {
    id: 'WX-006', artist: 'Radiohead', title: 'OK Computer', label: 'Parlophone', year: 1997, condition: 8, price: 38.00, suggestedPrice: 42.00, priceDelta: 4, syncSource: 'discogs', status: 'active', genre: 'Rock', inPrintQueue: false, hasPhoto: true, photoColor: '#2a3a4a', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/07/60/ba/0760ba0f-148c-b18f-d0ff-169ee96f3af5/634904078164.png/300x300bb.jpg',
    pressing: 'Reissue', countryOfPressing: 'UK', catalogNo: 'NODATA 02', discogsReleaseId: 'r5765734',
    vinylWeight: '180g', vinylColor: 'Black', format: '2x12"', speed: '33 RPM',
    sleeveCondition: 8, sleeveType: 'Gatefold', innerSleeve: 'Poly-lined',
    mastering: 'AAD', pressingPlant: 'GZ Media',
    discogsMedian: 40, discogsLow: 25, discogsHigh: 70,
  },
  {
    id: 'WX-007', artist: 'J Dilla', title: 'Donuts', label: 'Stones Throw', year: 2006, condition: 10, price: 95.00, suggestedPrice: 110.00, priceDelta: 15, syncSource: 'discogs', status: 'active', genre: 'Hip-Hop', inPrintQueue: false, hasPhoto: true, photoColor: '#c9a87c', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/63/d3/c5/63d3c537-ac30-86e7-8e69-8a03a5346209/792.jpg/300x300bb.jpg',
    pressing: '1st Press', countryOfPressing: 'US', catalogNo: 'STH 2126', matrixRunout: 'STH2126A1', discogsReleaseId: 'r632876',
    vinylWeight: '140g', vinylColor: 'Black', format: '2x12"', speed: '45 RPM',
    sleeveCondition: 10, sleeveType: 'Gatefold', innerSleeve: 'Original printed', inserts: ['Poster', 'Sticker sheet'],
    mastering: 'AAA', pressingPlant: 'RTI',
    discogsMedian: 105, discogsLow: 60, discogsHigh: 350,
  },
  {
    id: 'WX-008', artist: 'Boards of Canada', title: 'Music Has the Right to Children', label: 'Warp', year: 1998, condition: 7, price: 65.00, suggestedPrice: 68.00, priceDelta: 3, syncSource: 'shopify', status: 'reserved', genre: 'Electronic', inPrintQueue: true, hasPhoto: true, photoColor: '#2a3a2a', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Features125/v4/b5/4c/c2/b54cc20d-03f5-f2c4-4a0d-9b51ad65af89/dj.txuslqgv.jpg/300x300bb.jpg',
    pressing: '1st Press', countryOfPressing: 'UK', catalogNo: 'WARP LP 55', matrixRunout: 'WARPLP55 A2 MPO', discogsReleaseId: 'r28384',
    vinylWeight: '140g', vinylColor: 'Black', format: '2x12"', speed: '33 RPM',
    sleeveCondition: 7, sleeveType: 'Gatefold', innerSleeve: 'Original printed',
    mastering: 'AAA', pressingPlant: 'MPO',
    flawNotes: 'Corner ding on bottom left, light shelf wear. Vinyl plays well with occasional light tick on Side C.',
    discogsMedian: 72, discogsLow: 35, discogsHigh: 200,
  },
  {
    id: 'WX-009', artist: 'Marvin Gaye', title: "What's Going On", label: 'Tamla', year: 1971, condition: 8, price: 72.00, suggestedPrice: 75.00, priceDelta: 3, syncSource: 'csv', status: 'active', genre: 'Soul', inPrintQueue: false, hasPhoto: true, photoColor: '#4a6a3a', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/76/36/2d/76362d74-cb7a-8ef9-104e-cde1d858e9a9/20UMGIM95279.rgb.jpg/300x300bb.jpg',
    pressing: '1st Press', countryOfPressing: 'US', catalogNo: 'TS 310', matrixRunout: 'T-310-A-RE2 MR TS',
    vinylWeight: '120g', vinylColor: 'Black', format: '12"', speed: '33 RPM',
    sleeveCondition: 7, sleeveType: 'Gatefold', innerSleeve: 'Original printed',
    mastering: 'AAA',
    flawNotes: 'Name written in pen on back cover. Vinyl is clean.',
    discogsMedian: 70, discogsLow: 30, discogsHigh: 250,
  },
  {
    id: 'WX-010', artist: 'John Coltrane', title: 'A Love Supreme', label: 'Impulse!', year: 1965, condition: 6, price: 120.00, suggestedPrice: 135.00, priceDelta: 15, syncSource: 'discogs', status: 'active', genre: 'Jazz', inPrintQueue: false, hasPhoto: true, photoColor: '#5a3a1a', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/e5/24/aa/e524aacd-467b-66f3-8931-0fcd6750a4b9/08UMGIM07914.rgb.jpg/300x300bb.jpg',
    pressing: '1st Press', countryOfPressing: 'US', catalogNo: 'A-77', matrixRunout: 'A-77 A VAN GELDER', discogsReleaseId: 'r1238902',
    vinylWeight: '140g', vinylColor: 'Black', format: '12"', speed: '33 RPM',
    sleeveCondition: 5, sleeveType: 'Gatefold', innerSleeve: 'Generic white',
    mastering: 'AAA', pressingPlant: 'Van Gelder Studio',
    flawNotes: 'Cover has ring wear and edge wear. RVG stamp in dead wax. Vinyl has light surface noise throughout, plays without skips. Rare original orange/black label.',
    discogsMedian: 140, discogsLow: 60, discogsHigh: 800,
  },
  {
    id: 'WX-011', artist: 'MF DOOM', title: 'Mm..Food', label: 'Rhymesayers', year: 2004, condition: 9, price: 48.00, suggestedPrice: 52.00, priceDelta: 4, syncSource: 'manual', status: 'active', genre: 'Hip-Hop', inPrintQueue: false, hasPhoto: true, photoColor: '#4a3a2a', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/1c/0f/81/1c0f818a-e458-dd84-6f1b-ccbdf5fe14d6/825646291045.jpg/300x300bb.jpg',
    pressing: 'Reissue', countryOfPressing: 'US', catalogNo: 'RSE-0150-1', discogsReleaseId: 'r4768503',
    vinylWeight: '180g', vinylColor: 'Black', format: '2x12"', speed: '33 RPM',
    sleeveCondition: 9, sleeveType: 'Gatefold', innerSleeve: 'Poly-lined',
    mastering: 'AAD', pressingPlant: 'RTI',
    discogsMedian: 50, discogsLow: 30, discogsHigh: 80,
  },
  {
    id: 'WX-012', artist: 'Stevie Wonder', title: 'Songs in the Key of Life', label: 'Tamla', year: 1976, condition: 7, price: 58.00, suggestedPrice: 55.00, priceDelta: -3, syncSource: 'discogs', status: 'active', genre: 'Soul', inPrintQueue: true, hasPhoto: true, photoColor: '#6a5a2a', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music118/v4/eb/1f/12/eb1f12ec-474c-63aa-43af-09282f423b9d/00602537004737.rgb.jpg/300x300bb.jpg',
    pressing: '1st Press', countryOfPressing: 'US', catalogNo: 'T13-340C2', matrixRunout: 'T-13-340-C-2 RE1',
    vinylWeight: '120g', vinylColor: 'Black', format: '2x12" + 7"', speed: '33 RPM',
    sleeveCondition: 6, sleeveType: 'Gatefold', innerSleeve: 'Original printed', inserts: ['24-page booklet', 'Bonus 7"'],
    mastering: 'AAA', pressingPlant: 'ARP (Allied Record Pressing)',
    flawNotes: 'Cover has edge wear and light staining. Bonus 7" included. All vinyl plays well, light ticks on Side A.',
    discogsMedian: 55, discogsLow: 18, discogsHigh: 120,
  },
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
    { artist: 'Burial', title: 'Untrue', matchConfidence: 98, suggestedPrice: 45, matched: true, discogsMatch: 'Hyperdub — HDBCD002' },
    { artist: 'Four Tet', title: 'Rounds', matchConfidence: 95, suggestedPrice: 32, matched: true, discogsMatch: 'Domino — WIGCD136' },
    { artist: 'Floating Points', title: 'Crush', matchConfidence: 97, suggestedPrice: 28, matched: true, discogsMatch: 'Ninja Tune — ZENCD260' },
    { artist: 'DJ Shadow', title: 'Endtroducing...', matchConfidence: 92, suggestedPrice: 35, matched: true, discogsMatch: 'Mo\' Wax — MW059' },
    { artist: 'Bonobo', title: 'Black Sands', matchConfidence: 96, suggestedPrice: 30, matched: true, discogsMatch: 'Ninja Tune — ZENCD150' },
    { artist: 'Theo Parrish', title: 'First Floor', matchConfidence: 64, suggestedPrice: undefined, matched: false, discogsMatch: undefined },
    { artist: 'Moodymann', title: 'Silentintroduction', matchConfidence: 58, suggestedPrice: undefined, matched: false, discogsMatch: undefined },
    { artist: 'Kerri Chandler', title: 'Spaces and Places', matchConfidence: 72, suggestedPrice: 42, matched: false, discogsMatch: 'Kaoz Theory — KT042 (?)' },
  ],
}

export const shelves: Shelf[] = [
  {
    id: 'shelf-1', name: 'New Arrivals', type: 'curated', recordCount: 24,
    records: [
      { id: 'WX-003', artist: 'Kendrick Lamar', title: 'To Pimp a Butterfly', featured: false },
      { id: 'WX-007', artist: 'J Dilla', title: 'Donuts', featured: true },
      { id: 'WX-011', artist: 'MF DOOM', title: 'Mm..Food', featured: false },
    ],
  },
  {
    id: 'shelf-2', name: 'Hot Shelf', type: 'algorithmic', recordCount: 18,
    records: [
      { id: 'WX-001', artist: 'Miles Davis', title: 'Kind of Blue', featured: true },
      { id: 'WX-010', artist: 'John Coltrane', title: 'A Love Supreme', featured: false },
      { id: 'WX-009', artist: 'Marvin Gaye', title: "What's Going On", featured: true },
    ],
  },
  {
    id: 'shelf-3', name: 'Staff Picks', type: 'featured', recordCount: 12,
    records: [
      { id: 'WX-006', artist: 'Radiohead', title: 'OK Computer', featured: true },
      { id: 'WX-008', artist: 'Boards of Canada', title: 'Music Has the Right to Children', featured: true },
    ],
  },
  {
    id: 'shelf-4', name: 'Jazz Essentials', type: 'genre', recordCount: 31,
    records: [
      { id: 'WX-001', artist: 'Miles Davis', title: 'Kind of Blue', featured: false },
      { id: 'WX-010', artist: 'John Coltrane', title: 'A Love Supreme', featured: false },
    ],
  },
  {
    id: 'shelf-5', name: 'Rare Pressings', type: 'curated', recordCount: 8,
    records: [
      { id: 'WX-007', artist: 'J Dilla', title: 'Donuts', featured: true },
      { id: 'WX-010', artist: 'John Coltrane', title: 'A Love Supreme', featured: true },
    ],
  },
]

export const storefrontConfig: StorefrontConfig = {
  storeName: 'Wax & Groove Records',
  url: 'waxandgroove.waxe.io',
  status: 'live',
  primaryColor: '#1B2632',
  accentColor: '#FFB162',
  logoText: 'W&G',
  description: 'Portland\'s finest curated vinyl since 2018',
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

export const genreDemandData: GenreDemandPoint[] = [
  { month: 'Aug', jazz: 82, rock: 65, hiphop: 48, electronic: 35, soul: 58 },
  { month: 'Sep', jazz: 78, rock: 70, hiphop: 55, electronic: 40, soul: 52 },
  { month: 'Oct', jazz: 85, rock: 68, hiphop: 62, electronic: 45, soul: 60 },
  { month: 'Nov', jazz: 90, rock: 72, hiphop: 70, electronic: 50, soul: 65 },
  { month: 'Dec', jazz: 95, rock: 80, hiphop: 75, electronic: 55, soul: 70 },
  { month: 'Jan', jazz: 88, rock: 75, hiphop: 68, electronic: 48, soul: 72 },
  { month: 'Feb', jazz: 92, rock: 78, hiphop: 72, electronic: 52, soul: 68 },
]

export const priceTrendData: PriceTrendPoint[] = [
  { month: 'Aug', c10: 48, c9: 35, c7: 22, c5: 14 },
  { month: 'Sep', c10: 50, c9: 36, c7: 23, c5: 14 },
  { month: 'Oct', c10: 52, c9: 38, c7: 24, c5: 15 },
  { month: 'Nov', c10: 55, c9: 40, c7: 25, c5: 15 },
  { month: 'Dec', c10: 58, c9: 42, c7: 26, c5: 16 },
  { month: 'Jan', c10: 56, c9: 41, c7: 25, c5: 15 },
  { month: 'Feb', c10: 60, c9: 43, c7: 27, c5: 16 },
]

export const restockRecommendations: RestockRecommendation[] = [
  { artist: 'Daft Punk', title: 'Discovery', genre: 'Electronic', demandScore: 94, avgSalePrice: 45, lastSold: '3 days ago', velocity: 'high' },
  { artist: 'Amy Winehouse', title: 'Back to Black', genre: 'Soul', demandScore: 91, avgSalePrice: 32, lastSold: '1 week ago', velocity: 'high' },
  { artist: 'The Beatles', title: 'Abbey Road', genre: 'Rock', demandScore: 88, avgSalePrice: 38, lastSold: '5 days ago', velocity: 'high' },
  { artist: 'Madvillain', title: 'Madvillainy', genre: 'Hip-Hop', demandScore: 85, avgSalePrice: 55, lastSold: '2 weeks ago', velocity: 'medium' },
  { artist: 'Bill Evans', title: 'Waltz for Debby', genre: 'Jazz', demandScore: 82, avgSalePrice: 72, lastSold: '1 week ago', velocity: 'medium' },
  { artist: 'Khruangbin', title: 'Con Todo El Mundo', genre: 'Rock', demandScore: 78, avgSalePrice: 28, lastSold: '4 days ago', velocity: 'medium' },
  { artist: 'Erykah Badu', title: 'Baduizm', genre: 'Soul', demandScore: 75, avgSalePrice: 35, lastSold: '3 weeks ago', velocity: 'low' },
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
  { id: 'TXN-4821', time: '2:34 PM', customer: 'Walk-in', items: 'Miles Davis — Kind of Blue', total: 85.00, method: 'card', synced: true },
  { id: 'TXN-4820', time: '2:12 PM', customer: 'Sarah M.', items: '2 records', total: 67.00, method: 'tap', synced: true },
  { id: 'TXN-4819', time: '1:48 PM', customer: 'Walk-in', items: 'Kendrick Lamar — TPAB', total: 35.00, method: 'cash', synced: true },
  { id: 'TXN-4818', time: '12:30 PM', customer: 'James R.', items: '3 records', total: 142.00, method: 'card', synced: true },
  { id: 'TXN-4817', time: '11:55 AM', customer: 'Walk-in', items: 'Radiohead — OK Computer', total: 38.00, method: 'tap', synced: true },
  { id: 'TXN-4816', time: '11:20 AM', customer: 'Mike D.', items: 'Nina Simone — I Put a Spell on You', total: 55.00, method: 'card', synced: false },
  { id: 'TXN-4815', time: '10:45 AM', customer: 'Walk-in', items: '2 records', total: 48.00, method: 'cash', synced: true },
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
    id: 'conv-1', customerName: 'Sarah Mitchell', lastMessage: 'Is the Kind of Blue still available?', lastTime: '2:15 PM', unread: 2,
    messages: [
      { id: 'm1', sender: 'customer', text: 'Hi! I saw the Miles Davis — Kind of Blue listing. Is it still available?', time: '2:10 PM' },
      { id: 'm2', sender: 'dealer', text: 'Hey Sarah! Yes, it\'s still here. Condition 9, original Columbia pressing.', time: '2:12 PM' },
      { id: 'm3', sender: 'customer', text: 'Amazing! Can I see a closer photo of the sleeve?', time: '2:13 PM' },
      { id: 'm4', sender: 'customer', text: 'Is the Kind of Blue still available?', time: '2:15 PM', linkedItem: 'WX-001' },
    ],
  },
  {
    id: 'conv-2', customerName: 'James Rodriguez', lastMessage: 'Thanks, I\'ll pick it up tomorrow', lastTime: '1:45 PM', unread: 0,
    messages: [
      { id: 'm5', sender: 'customer', text: 'Do you have any J Dilla records in stock?', time: '1:30 PM' },
      { id: 'm6', sender: 'dealer', text: 'We have Donuts — Condition 10, Stones Throw pressing. $95.', time: '1:32 PM', linkedItem: 'WX-007' },
      { id: 'm7', sender: 'customer', text: 'That\'s perfect. Can you hold it for me?', time: '1:40 PM' },
      { id: 'm8', sender: 'dealer', text: 'Done! Reserved under your name. We\'re open until 7 PM.', time: '1:42 PM' },
      { id: 'm9', sender: 'customer', text: 'Thanks, I\'ll pick it up tomorrow', time: '1:45 PM' },
    ],
  },
  {
    id: 'conv-3', customerName: 'Alex Chen', lastMessage: 'Looking for rare electronic vinyl', lastTime: '12:30 PM', unread: 1,
    messages: [
      { id: 'm10', sender: 'customer', text: 'Looking for rare electronic vinyl. Do you have any Boards of Canada?', time: '12:28 PM' },
      { id: 'm11', sender: 'dealer', text: 'Yes! Music Has the Right to Children, VG+ on Warp. $65.', time: '12:30 PM', linkedItem: 'WX-008' },
    ],
  },
  {
    id: 'conv-4', customerName: 'Maria Santos', lastMessage: 'Shipped! Tracking: 1Z999AA10..', lastTime: 'Yesterday', unread: 0,
    messages: [
      { id: 'm12', sender: 'customer', text: 'Hi, just placed order #1847 for the Marvin Gaye LP', time: 'Yesterday' },
      { id: 'm13', sender: 'dealer', text: 'Got it! Packing now. Should ship today.', time: 'Yesterday' },
      { id: 'm14', sender: 'dealer', text: 'Shipped! Tracking: 1Z999AA10..', time: 'Yesterday' },
    ],
  },
  {
    id: 'conv-5', customerName: 'David Park', lastMessage: 'Any Coltrane pressings besides Love Supreme?', lastTime: 'Yesterday', unread: 0,
    messages: [
      { id: 'm15', sender: 'customer', text: 'Any Coltrane pressings besides Love Supreme?', time: 'Yesterday' },
    ],
  },
]

export const genreBreakdowns: GenreBreakdown[] = [
  { genre: 'Jazz', count: 482, revenue: 4820, percentage: 32 },
  { genre: 'Rock', count: 398, revenue: 3580, percentage: 22 },
  { genre: 'Hip-Hop', count: 356, revenue: 3200, percentage: 18 },
  { genre: 'Soul', count: 312, revenue: 2800, percentage: 15 },
  { genre: 'Electronic', count: 224, revenue: 1800, percentage: 10 },
  { genre: 'Other', count: 75, revenue: 530, percentage: 3 },
]

export const conditionBreakdowns: ConditionBreakdown[] = [
  { condition: '10 — Sealed', count: 98, percentage: 5 },
  { condition: '9 — Pristine', count: 284, percentage: 15 },
  { condition: '8 — Excellent', count: 512, percentage: 28 },
  { condition: '7 — Very Good', count: 548, percentage: 30 },
  { condition: '6 — Good', count: 246, percentage: 13 },
  { condition: '5 — Fair', count: 110, percentage: 6 },
  { condition: '4 or below', count: 49, percentage: 3 },
]

export const posQuickStats: QuickStat[] = [
  { label: 'Sales Today', value: '$1,420', trend: '+$340', trendUp: true },
  { label: 'Transactions', value: '21', trend: '+5', trendUp: true },
  { label: 'Avg Transaction', value: '$67.60', trend: '+$8', trendUp: true },
  { label: 'Items Synced', value: '21/21', trend: '100%', trendUp: true },
]
