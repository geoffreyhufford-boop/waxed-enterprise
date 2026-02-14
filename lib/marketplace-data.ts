// ─── Type Definitions ────────────────────────────────────────

export type SellerType = 'label' | 'distributor' | 'store'

export interface MarketplaceSeller {
  id: string
  name: string
  type: SellerType
  location: string
  verified: boolean
  rating?: number
}

export interface MarketplaceListing {
  id: string
  artist: string
  title: string
  genre: string
  label: string
  format: string
  year: number
  condition: number              // 1-5
  wholesalePrice: number         // per unit
  retailSuggested?: number
  availableQty: number
  minOrderQty: number
  seller: MarketplaceSeller
  sellerType: SellerType
  listingType: 'pre_order' | 'in_stock' | 'backorder'
  releaseDate?: string
  listedAt: string
  photoColor?: string
  artworkUrl?: string
  tags?: string[]
}

export interface MarketplaceRecommendation {
  id: string
  listing: MarketplaceListing
  reason: string
  relevanceScore: number         // 0-100
  basedOn: 'sales_history' | 'genre_gap' | 'trending' | 'want_list'
}

// ─── Sellers ─────────────────────────────────────────────────

export const marketplaceSellers: MarketplaceSeller[] = [
  // Labels
  { id: 'sl-001', name: 'Sonic Groove', type: 'label', location: 'New York, NY', verified: true, rating: 98 },
  { id: 'sl-002', name: 'Tresor Records', type: 'label', location: 'Berlin, DE', verified: true, rating: 99 },
  { id: 'sl-003', name: 'Hyperdub', type: 'label', location: 'London, UK', verified: true, rating: 97 },
  { id: 'sl-004', name: 'Stones Throw', type: 'label', location: 'Los Angeles, CA', verified: true, rating: 96 },
  { id: 'sl-005', name: 'Rush Hour', type: 'label', location: 'Amsterdam, NL', verified: true, rating: 98 },
  // Distributors
  { id: 'sd-001', name: 'Alliance Entertainment', type: 'distributor', location: 'Louisville, KY', verified: true, rating: 95 },
  { id: 'sd-002', name: 'SRD / Cargo', type: 'distributor', location: 'London, UK', verified: true, rating: 93 },
  // Stores
  { id: 'ss-001', name: 'BPM Supply', type: 'store', location: 'Berlin, DE', verified: true, rating: 94 },
  { id: 'ss-002', name: 'Crate Diggers Union', type: 'store', location: 'Chicago, IL', verified: true, rating: 93 },
  { id: 'ss-003', name: 'Deep Groove Records', type: 'store', location: 'Brooklyn, NY', verified: true, rating: 97 },
  { id: 'ss-004', name: 'Wax Poetics', type: 'store', location: 'Los Angeles, CA', verified: true, rating: 91 },
  { id: 'ss-005', name: 'Ambient Works', type: 'store', location: 'Portland, OR', verified: true, rating: 89 },
  { id: 'ss-006', name: 'Dub Merchant', type: 'store', location: 'London, UK', verified: true, rating: 96 },
  { id: 'ss-007', name: 'Klassik Wax', type: 'store', location: 'Vienna, AT', verified: true, rating: 98 },
  { id: 'ss-008', name: 'Twang & Tone', type: 'store', location: 'Nashville, TN', verified: true, rating: 85 },
]

// ─── Helper ──────────────────────────────────────────────────

function seller(id: string): MarketplaceSeller {
  return marketplaceSellers.find((s) => s.id === id)!
}

// ─── Listings ────────────────────────────────────────────────

export const marketplaceListings: MarketplaceListing[] = [
  // ── Labels: Sonic Groove (techno, NYC) ─────────────────────
  {
    id: 'ml-001', artist: 'Adam X', title: 'Irreformable', genre: 'Techno', label: 'Sonic Groove', format: '12"', year: 2025,
    condition: 5, wholesalePrice: 6.50, retailSuggested: 14.99, availableQty: 200, minOrderQty: 25,
    seller: seller('sl-001'), sellerType: 'label', listingType: 'in_stock', listedAt: '2 days ago',
    photoColor: '#1B2632', tags: ['industrial', 'techno'],
  },
  {
    id: 'ml-002', artist: 'Phase', title: 'Moving Through Systems', genre: 'Techno', label: 'Sonic Groove', format: '12"', year: 2026,
    condition: 5, wholesalePrice: 7.00, retailSuggested: 15.99, availableQty: 150, minOrderQty: 25,
    seller: seller('sl-001'), sellerType: 'label', listingType: 'pre_order', releaseDate: 'Mar 14, 2026', listedAt: '1 day ago',
    photoColor: '#4A5B6D', tags: ['techno', 'electro'],
  },

  // ── Labels: Tresor Records (techno, Berlin) ────────────────
  {
    id: 'ml-003', artist: 'Robert Hood', title: 'Mirror Man', genre: 'Techno', label: 'Tresor', format: '2x12"', year: 2025,
    condition: 5, wholesalePrice: 8.00, retailSuggested: 18.99, availableQty: 120, minOrderQty: 25,
    seller: seller('sl-002'), sellerType: 'label', listingType: 'in_stock', listedAt: '5 days ago',
    photoColor: '#2C3B4D', tags: ['minimal', 'techno'],
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/5f/b3/e0/5fb3e08d-c2cd-3da4-6ad7-c5dc61803683/cover.jpg/300x300bb.jpg',
  },
  {
    id: 'ml-004', artist: 'Juan Atkins', title: 'Transport', genre: 'Techno', label: 'Tresor', format: '12"', year: 2026,
    condition: 5, wholesalePrice: 7.50, retailSuggested: 16.99, availableQty: 80, minOrderQty: 25,
    seller: seller('sl-002'), sellerType: 'label', listingType: 'pre_order', releaseDate: 'Apr 4, 2026', listedAt: '3 days ago',
    photoColor: '#1B2632', tags: ['detroit', 'techno'],
  },

  // ── Labels: Hyperdub (bass, London) ────────────────────────
  {
    id: 'ml-005', artist: 'Burial', title: 'Dreamfear / Boy Sent From Above', genre: 'Electronic', label: 'Hyperdub', format: '12"', year: 2025,
    condition: 5, wholesalePrice: 6.00, retailSuggested: 13.99, availableQty: 300, minOrderQty: 25,
    seller: seller('sl-003'), sellerType: 'label', listingType: 'in_stock', listedAt: '1 day ago',
    photoColor: '#2C3B4D', tags: ['bass', 'uk garage'],
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/95/a4/3f/95a43f9d-4eb9-e5a9-ee64-910d3fb95e6c/3663729188892_3000.jpg/300x300bb.jpg',
  },
  {
    id: 'ml-006', artist: 'Kode9', title: 'Escapology', genre: 'Electronic', label: 'Hyperdub', format: '2x12"', year: 2025,
    condition: 5, wholesalePrice: 7.50, retailSuggested: 17.99, availableQty: 100, minOrderQty: 25,
    seller: seller('sl-003'), sellerType: 'label', listingType: 'in_stock', listedAt: '4 days ago',
    photoColor: '#4A5B6D', tags: ['bass', 'grime'],
  },

  // ── Labels: Stones Throw (hip-hop, LA) ─────────────────────
  {
    id: 'ml-007', artist: 'Madlib', title: 'Sound Ancestors Arrangements', genre: 'Hip-Hop', label: 'Stones Throw', format: '2x12"', year: 2025,
    condition: 5, wholesalePrice: 8.00, retailSuggested: 19.99, availableQty: 180, minOrderQty: 25,
    seller: seller('sl-004'), sellerType: 'label', listingType: 'in_stock', listedAt: '3 days ago',
    photoColor: '#A35139', tags: ['hip-hop', 'beats'],
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/0d/96/1d/0d961d09-8e54-e2f5-f5ce-b08690b1e797/00602537641079.rgb.jpg/300x300bb.jpg',
  },
  {
    id: 'ml-008', artist: 'Mach-Hommy', title: 'Dollar Menu 4', genre: 'Hip-Hop', label: 'Stones Throw', format: '12"', year: 2026,
    condition: 5, wholesalePrice: 7.00, retailSuggested: 16.99, availableQty: 250, minOrderQty: 25,
    seller: seller('sl-004'), sellerType: 'label', listingType: 'pre_order', releaseDate: 'Mar 28, 2026', listedAt: '1 day ago',
    photoColor: '#C04040', tags: ['hip-hop', 'underground'],
  },

  // ── Labels: Rush Hour (house, Amsterdam) ───────────────────
  {
    id: 'ml-009', artist: 'Hunee', title: 'Hunchin\' All Night', genre: 'House', label: 'Rush Hour', format: '2x12"', year: 2025,
    condition: 5, wholesalePrice: 7.00, retailSuggested: 16.99, availableQty: 90, minOrderQty: 25,
    seller: seller('sl-005'), sellerType: 'label', listingType: 'in_stock', listedAt: '6 days ago',
    photoColor: '#FFB162', tags: ['house', 'disco'],
  },
  {
    id: 'ml-010', artist: 'Antal', title: 'Rush Hour Compilation Vol. 4', genre: 'House', label: 'Rush Hour', format: '3x12"', year: 2026,
    condition: 5, wholesalePrice: 8.00, retailSuggested: 22.99, availableQty: 60, minOrderQty: 25,
    seller: seller('sl-005'), sellerType: 'label', listingType: 'pre_order', releaseDate: 'May 2, 2026', listedAt: '2 days ago',
    photoColor: '#3D7A4F', tags: ['house', 'compilation'],
  },

  // ── Distributors: Alliance Entertainment ───────────────────
  {
    id: 'ml-011', artist: 'Kendrick Lamar', title: 'GNX', genre: 'Hip-Hop', label: 'pgLang / Interscope', format: '2x12"', year: 2025,
    condition: 5, wholesalePrice: 12.00, retailSuggested: 29.99, availableQty: 500, minOrderQty: 10,
    seller: seller('sd-001'), sellerType: 'distributor', listingType: 'in_stock', listedAt: '1 day ago',
    photoColor: '#1B2632', tags: ['hip-hop', 'major'],
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/21/46/90/214690e5-2299-2158-0e72-d944b8c3a590/25UMGIM01268.rgb.jpg/300x300bb.jpg',
  },
  {
    id: 'ml-012', artist: 'Billie Eilish', title: 'Hit Me Hard and Soft', genre: 'Pop', label: 'Darkroom / Interscope', format: '12"', year: 2024,
    condition: 5, wholesalePrice: 10.00, retailSuggested: 24.99, availableQty: 350, minOrderQty: 10,
    seller: seller('sd-001'), sellerType: 'distributor', listingType: 'in_stock', listedAt: '2 days ago',
    photoColor: '#4A5B6D', tags: ['pop', 'major'],
  },
  {
    id: 'ml-013', artist: 'Tyler, The Creator', title: 'Chromakopia', genre: 'Hip-Hop', label: 'Columbia', format: '2x12"', year: 2024,
    condition: 5, wholesalePrice: 14.00, retailSuggested: 34.99, availableQty: 280, minOrderQty: 10,
    seller: seller('sd-001'), sellerType: 'distributor', listingType: 'in_stock', listedAt: '4 days ago',
    photoColor: '#A35139', tags: ['hip-hop', 'major'],
  },

  // ── Distributors: SRD / Cargo ──────────────────────────────
  {
    id: 'ml-014', artist: 'Four Tet', title: 'Three', genre: 'Electronic', label: 'Text', format: '3x12"', year: 2024,
    condition: 5, wholesalePrice: 13.00, retailSuggested: 32.99, availableQty: 150, minOrderQty: 10,
    seller: seller('sd-002'), sellerType: 'distributor', listingType: 'in_stock', listedAt: '3 days ago',
    photoColor: '#2C3B4D', tags: ['electronic', 'indie'],
  },
  {
    id: 'ml-015', artist: 'Floating Points', title: 'Cascade', genre: 'Electronic', label: 'Ninja Tune', format: '2x12"', year: 2025,
    condition: 5, wholesalePrice: 11.00, retailSuggested: 27.99, availableQty: 200, minOrderQty: 10,
    seller: seller('sd-002'), sellerType: 'distributor', listingType: 'in_stock', listedAt: '2 days ago',
    photoColor: '#3D7A4F', tags: ['electronic', 'ambient'],
  },

  // ── Stores: BPM Supply ─────────────────────────────────────
  {
    id: 'ml-016', artist: 'Jeff Mills', title: 'Waveform Transmission Vol. 1', genre: 'Techno', label: 'Tresor', format: '12"', year: 1992,
    condition: 4, wholesalePrice: 28.00, availableQty: 1, minOrderQty: 1,
    seller: seller('ss-001'), sellerType: 'store', listingType: 'in_stock', listedAt: '1 day ago',
    photoColor: '#4A5B6D', tags: ['techno', 'detroit'],
  },
  {
    id: 'ml-017', artist: 'Drexciya', title: 'Neptune\'s Lair', genre: 'Electro', label: 'Tresor', format: '2x12"', year: 1999,
    condition: 4, wholesalePrice: 22.00, availableQty: 1, minOrderQty: 1,
    seller: seller('ss-001'), sellerType: 'store', listingType: 'in_stock', listedAt: '3 days ago',
    photoColor: '#2C3B4D', tags: ['electro', 'detroit'],
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/95/a4/3f/95a43f9d-4eb9-e5a9-ee64-910d3fb95e6c/3663729188892_3000.jpg/300x300bb.jpg',
  },
  {
    id: 'ml-018', artist: 'Kerri Chandler', title: 'Spaces and Places', genre: 'House', label: 'Kaoz Theory', format: '2x12"', year: 2022,
    condition: 5, wholesalePrice: 12.00, availableQty: 3, minOrderQty: 1,
    seller: seller('ss-001'), sellerType: 'store', listingType: 'in_stock', listedAt: '2 days ago',
    photoColor: '#3D7A4F', tags: ['house', 'deep'],
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/14/d2/77/14d277cd-1c90-3908-9c6f-951c54f7e481/cover.jpg/300x300bb.jpg',
  },

  // ── Stores: Crate Diggers Union ────────────────────────────
  {
    id: 'ml-019', artist: 'Larry Heard', title: 'Sceneries Not Songs', genre: 'House', label: 'Black Market', format: '2x12"', year: 1994,
    condition: 4, wholesalePrice: 15.00, availableQty: 1, minOrderQty: 1,
    seller: seller('ss-002'), sellerType: 'store', listingType: 'in_stock', listedAt: '1 day ago',
    photoColor: '#2C3B4D', tags: ['house', 'chicago'],
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/c9/4b/ed/c94bedd8-5c5e-df56-1fb9-000a16537f01/8718723149693.jpg/300x300bb.jpg',
  },
  {
    id: 'ml-020', artist: 'Donna Summer', title: 'I Feel Love (12" Single)', genre: 'Disco', label: 'Casablanca', format: '12"', year: 1977,
    condition: 3, wholesalePrice: 8.00, availableQty: 2, minOrderQty: 1,
    seller: seller('ss-002'), sellerType: 'store', listingType: 'in_stock', listedAt: '5 days ago',
    photoColor: '#C04040', tags: ['disco', 'classic'],
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music118/v4/1c/46/60/1c46600c-6c43-0ed3-ed6d-8217e61a5f2a/00600753626030.rgb.jpg/300x300bb.jpg',
  },
  {
    id: 'ml-021', artist: 'Theo Parrish', title: 'First Floor', genre: 'House', label: 'Peacefrog', format: '3x12"', year: 1998,
    condition: 4, wholesalePrice: 30.00, availableQty: 1, minOrderQty: 1,
    seller: seller('ss-002'), sellerType: 'store', listingType: 'in_stock', listedAt: '2 days ago',
    photoColor: '#1B2632', tags: ['house', 'detroit'],
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music/34/08/8f/mzi.dtxcmahx.tif/300x300bb.jpg',
  },
  {
    id: 'ml-022', artist: 'Frankie Knuckles', title: 'Beyond the Mix', genre: 'House', label: 'Virgin', format: '12"', year: 1991,
    condition: 5, wholesalePrice: 10.00, availableQty: 1, minOrderQty: 1,
    seller: seller('ss-002'), sellerType: 'store', listingType: 'in_stock', listedAt: '4 days ago',
    photoColor: '#3D7A4F', tags: ['house', 'chicago'],
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music6/v4/9d/65/21/9d6521c3-fc50-8d5a-6ddc-7628ff7d307f/05099909472952.jpg/300x300bb.jpg',
  },

  // ── Stores: Deep Groove Records ────────────────────────────
  {
    id: 'ml-023', artist: 'John Coltrane', title: 'A Love Supreme', genre: 'Jazz', label: 'Impulse!', format: '12"', year: 1965,
    condition: 4, wholesalePrice: 20.00, availableQty: 1, minOrderQty: 1,
    seller: seller('ss-003'), sellerType: 'store', listingType: 'in_stock', listedAt: '2 days ago',
    photoColor: '#2C3B4D', tags: ['jazz', 'modal'],
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/e5/24/aa/e524aacd-467b-66f3-8931-0fcd6750a4b9/08UMGIM07914.rgb.jpg/300x300bb.jpg',
  },
  {
    id: 'ml-024', artist: 'Curtis Mayfield', title: 'Superfly', genre: 'Soul', label: 'Curtom', format: '12"', year: 1972,
    condition: 4, wholesalePrice: 14.00, availableQty: 1, minOrderQty: 1,
    seller: seller('ss-003'), sellerType: 'store', listingType: 'in_stock', listedAt: '3 days ago',
    photoColor: '#FFB162', tags: ['soul', 'funk'],
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/c4/34/f0/c434f094-4c7e-3c62-8f15-cd02028e1ce7/603497885978.jpg/300x300bb.jpg',
  },

  // ── Stores: Wax Poetics ────────────────────────────────────
  {
    id: 'ml-025', artist: 'MF DOOM', title: 'Mm..Food', genre: 'Hip-Hop', label: 'Rhymesayers', format: '2x12"', year: 2004,
    condition: 4, wholesalePrice: 9.00, availableQty: 2, minOrderQty: 1,
    seller: seller('ss-004'), sellerType: 'store', listingType: 'in_stock', listedAt: '1 day ago',
    photoColor: '#C04040', tags: ['hip-hop', 'underground'],
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/c7/64/4f/c7644f59-5d3c-459b-e716-02256550a333/mzi.viarkgrc.jpg/300x300bb.jpg',
  },
  {
    id: 'ml-026', artist: 'D\'Angelo', title: 'Voodoo', genre: 'R&B', label: 'Virgin', format: '2x12"', year: 2000,
    condition: 5, wholesalePrice: 11.00, availableQty: 1, minOrderQty: 1,
    seller: seller('ss-004'), sellerType: 'store', listingType: 'in_stock', listedAt: '4 days ago',
    photoColor: '#A35139', tags: ['r&b', 'neo-soul'],
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/e9/b9/9e/e9b99e73-58a5-1e31-f57c-b11e78419dcf/16UMGIM86249.rgb.jpg/300x300bb.jpg',
  },

  // ── Stores: Ambient Works ──────────────────────────────────
  {
    id: 'ml-027', artist: 'Tim Hecker', title: 'Ravedeath, 1972', genre: 'Ambient', label: 'Kranky', format: '2x12"', year: 2011,
    condition: 5, wholesalePrice: 8.00, availableQty: 2, minOrderQty: 1,
    seller: seller('ss-005'), sellerType: 'store', listingType: 'in_stock', listedAt: '2 days ago',
    photoColor: '#4A5B6D', tags: ['ambient', 'noise'],
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/4a/68/4c/4a684c10-456b-8442-9ed3-764d57a32aed/mzi.ukvgcwzt.jpg/300x300bb.jpg',
  },
  {
    id: 'ml-028', artist: 'Gas', title: 'Pop', genre: 'Ambient', label: 'Mille Plateaux', format: '3x12"', year: 2000,
    condition: 4, wholesalePrice: 18.00, availableQty: 1, minOrderQty: 1,
    seller: seller('ss-005'), sellerType: 'store', listingType: 'in_stock', listedAt: '5 days ago',
    photoColor: '#3D7A4F', tags: ['ambient', 'minimal'],
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/5d/6a/00/5d6a0054-5145-6011-c638-3e2666d0e8dd/192641833472_Cover.jpg/300x300bb.jpg',
  },

  // ── Stores: Dub Merchant ───────────────────────────────────
  {
    id: 'ml-029', artist: 'King Tubby', title: 'Dub from the Roots', genre: 'Dub', label: 'Total Sounds', format: '12"', year: 1974,
    condition: 3, wholesalePrice: 16.00, availableQty: 1, minOrderQty: 1,
    seller: seller('ss-006'), sellerType: 'store', listingType: 'in_stock', listedAt: '3 days ago',
    photoColor: '#FFB162', tags: ['dub', 'reggae'],
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music6/v4/f2/89/dc/f289dc0f-92e7-40ba-ee35-c2ba78d1721e/cover.jpg/300x300bb.jpg',
  },
  {
    id: 'ml-030', artist: 'Augustus Pablo', title: 'King Tubbys Meets Rockers Uptown', genre: 'Dub', label: 'Yard Music', format: '12"', year: 1976,
    condition: 5, wholesalePrice: 20.00, availableQty: 1, minOrderQty: 1,
    seller: seller('ss-006'), sellerType: 'store', listingType: 'in_stock', listedAt: '1 day ago',
    photoColor: '#A35139', tags: ['dub', 'roots'],
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/23/86/5f/23865ff8-4f99-c071-25ce-a0f950400cda/881626559765_cover.jpg/300x300bb.jpg',
  },

  // ── Stores: Klassik Wax ────────────────────────────────────
  {
    id: 'ml-031', artist: 'Glenn Gould', title: 'Goldberg Variations', genre: 'Classical', label: 'Columbia', format: '12"', year: 1956,
    condition: 4, wholesalePrice: 28.00, availableQty: 1, minOrderQty: 1,
    seller: seller('ss-007'), sellerType: 'store', listingType: 'in_stock', listedAt: '6 days ago',
    photoColor: '#1B2632', tags: ['classical', 'piano'],
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music/3a/14/e4/mzi.xxiekocw.jpg/300x300bb.jpg',
  },
  {
    id: 'ml-032', artist: 'Arvo Pärt', title: 'Tabula Rasa', genre: 'Classical', label: 'ECM', format: '12"', year: 1984,
    condition: 5, wholesalePrice: 12.00, availableQty: 2, minOrderQty: 1,
    seller: seller('ss-007'), sellerType: 'store', listingType: 'in_stock', listedAt: '4 days ago',
    photoColor: '#EEE9DF', tags: ['classical', 'minimalist'],
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/d4/96/0b/d4960b8c-a1c3-4cf1-31c2-31d35cc3e2b7/00028948109326.rgb.jpg/300x300bb.jpg',
  },

  // ── Stores: Twang & Tone ───────────────────────────────────
  {
    id: 'ml-033', artist: 'Townes Van Zandt', title: 'Live at the Old Quarter', genre: 'Country', label: 'Tomato', format: '2x12"', year: 1977,
    condition: 3, wholesalePrice: 22.00, availableQty: 1, minOrderQty: 1,
    seller: seller('ss-008'), sellerType: 'store', listingType: 'in_stock', listedAt: '3 days ago',
    photoColor: '#A35139', tags: ['country', 'folk'],
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music49/v4/ed/19/88/ed198893-ccf8-f123-4e9d-2c2296bca744/886445720600.jpg/300x300bb.jpg',
  },

  // ── Backorder items ────────────────────────────────────────
  {
    id: 'ml-034', artist: 'Aphex Twin', title: 'Selected Ambient Works 85-92 (Repress)', genre: 'Techno', label: 'Apollo', format: '2x12"', year: 2025,
    condition: 5, wholesalePrice: 8.00, retailSuggested: 18.99, availableQty: 0, minOrderQty: 25,
    seller: seller('sl-002'), sellerType: 'label', listingType: 'backorder', listedAt: '1 day ago',
    photoColor: '#1B2632', tags: ['ambient', 'techno'],
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/5f/b3/e0/5fb3e08d-c2cd-3da4-6ad7-c5dc61803683/cover.jpg/300x300bb.jpg',
  },
  {
    id: 'ml-035', artist: 'Boards of Canada', title: 'Music Has the Right to Children (Repress)', genre: 'Electronic', label: 'Warp', format: '2x12"', year: 2025,
    condition: 5, wholesalePrice: 9.00, retailSuggested: 22.99, availableQty: 0, minOrderQty: 10,
    seller: seller('sd-002'), sellerType: 'distributor', listingType: 'backorder', listedAt: '3 days ago',
    photoColor: '#4A5B6D', tags: ['electronic', 'ambient'],
  },
]

// ─── Recommendations ─────────────────────────────────────────

export const marketplaceRecommendations: MarketplaceRecommendation[] = [
  {
    id: 'rec-001',
    listing: marketplaceListings.find((l) => l.id === 'ml-003')!,
    reason: 'Robert Hood sells 3x faster than avg techno in your store. Tresor pressings have 94% sell-through.',
    relevanceScore: 96,
    basedOn: 'sales_history',
  },
  {
    id: 'rec-002',
    listing: marketplaceListings.find((l) => l.id === 'ml-005')!,
    reason: 'Burial is your #1 searched artist with 0 copies in stock. 4 customer requests in last 30 days.',
    relevanceScore: 98,
    basedOn: 'want_list',
  },
  {
    id: 'rec-003',
    listing: marketplaceListings.find((l) => l.id === 'ml-009')!,
    reason: 'House is 28% of your sales but only 12% of inventory. Rush Hour titles avg 22-day sell-through.',
    relevanceScore: 91,
    basedOn: 'genre_gap',
  },
  {
    id: 'rec-004',
    listing: marketplaceListings.find((l) => l.id === 'ml-011')!,
    reason: 'GNX is the #1 selling hip-hop LP across all WAXED stores this quarter. 340% above category avg.',
    relevanceScore: 88,
    basedOn: 'trending',
  },
  {
    id: 'rec-005',
    listing: marketplaceListings.find((l) => l.id === 'ml-015')!,
    reason: 'Floating Points matches your electronic buyer profile. Previous Ninja Tune titles sold out in < 2 weeks.',
    relevanceScore: 85,
    basedOn: 'sales_history',
  },
  {
    id: 'rec-006',
    listing: marketplaceListings.find((l) => l.id === 'ml-019')!,
    reason: 'Larry Heard "Sceneries Not Songs" has been on your want list for 60+ days. Only 1 copy available.',
    relevanceScore: 93,
    basedOn: 'want_list',
  },
]
