// ─── Type Definitions ────────────────────────────────────────

export type PackStatus = 'draft' | 'listed_network' | 'listed_storefront' | 'listed_instore' | 'sold'

export interface PackRecord {
  artist: string
  title: string
  genre: string
  condition: number          // 1-5 star scale
  marketValue: number
  photoColor?: string
  artworkUrl?: string
}

export interface CuratedPack {
  id: string
  name: string
  genre: string
  records: PackRecord[]
  totalValue: number
  packPrice: number
  discountPercent: number
  status: PackStatus
  generatedAt: string
  generationReason: string
  avgCondition: number
  deadStockCount: number
  slowMoverCount: number
}

export interface NetworkPackListing {
  id: string
  store: { name: string; location: string; trustScore: number }
  pack: CuratedPack
  listedAt: string
}

export interface PackPurchase {
  id: string
  type: 'sale' | 'purchase'
  pack: { name: string; genre: string; recordCount: number; packPrice: number }
  counterparty: { name: string; location: string }
  waxedFee: number
  sellerReceives: number
  shipping: number
  buyerPays: number
  status: 'pending' | 'confirmed' | 'shipped' | 'completed'
  createdAt: string
}

export interface InboundPackRequest {
  id: string
  fromStore: { name: string; location: string; trustScore: number }
  requestedPackId: string
  requestedPackName: string
  requestedGenre: string
  offeredPrice: number
  status: 'pending' | 'accepted' | 'declined' | 'countered'
  requestedAt: string
  message?: string
}

// ─── Fee Constants & Calculator ─────────────────────────────

export const WAXED_FEE_STANDARD = 0.08  // 8% for 1-2 packs
export const WAXED_FEE_BULK = 0.03      // 3% for 3+ packs (75+ records)
export const BULK_THRESHOLD = 3          // packs
export const SHIPPING_PER_PACK = 17      // ~$17 per 25-record pack

export function calculateFees(packPrice: number, packCount: number) {
  const rate = packCount >= BULK_THRESHOLD ? WAXED_FEE_BULK : WAXED_FEE_STANDARD
  const fee = Math.round(packPrice * rate)
  const sellerReceives = packPrice - fee
  const shipping = packCount * SHIPPING_PER_PACK
  const buyerPays = packPrice + shipping
  return { rate, fee, sellerReceives, shipping, buyerPays }
}

// ─── Fill Helper ─────────────────────────────────────────────
// First 5 records per pack have full details + artworkUrl.
// Remaining 20 are compact tuples: [artist, title, condition, value]
// expanded by this helper.

type CompactRecord = [string, string, number, number]

function fillPack(
  genre: string,
  featured: PackRecord[],
  compact: CompactRecord[],
  photoColor: string,
): PackRecord[] {
  const expanded: PackRecord[] = compact.map(([artist, title, condition, marketValue]) => ({
    artist,
    title,
    genre,
    condition,
    marketValue,
    photoColor,
  }))
  return [...featured, ...expanded]
}

// ─── Your Store's Packs ──────────────────────────────────────

const jazzFeatured: PackRecord[] = [
  { artist: 'John Coltrane', title: 'Blue Train', genre: 'Jazz', condition: 4, marketValue: 65, photoColor: '#2C3B4D', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/6e/1a/13/6e1a134d-8f6f-d90f-b855-ea69436a2e8b/17UM1IM45370.rgb.jpg/300x300bb.jpg' },
  { artist: 'Charles Mingus', title: 'The Black Saint and the Sinner Lady', genre: 'Jazz', condition: 3, marketValue: 58, photoColor: '#1B2632', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/24/65/64/2465645a-7d7f-63a9-e0bb-097cdc6bd6a8/19UMGIM32054.rgb.jpg/300x300bb.jpg' },
  { artist: 'Thelonious Monk', title: 'Brilliant Corners', genre: 'Jazz', condition: 4, marketValue: 58, photoColor: '#A35139', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music128/v4/06/52/05/06520545-6d9e-c568-60cb-24c4b019a1e2/00888072373068.rgb.jpg/300x300bb.jpg' },
  { artist: 'Art Blakey', title: "Moanin'", genre: 'Jazz', condition: 4, marketValue: 52, photoColor: '#1B2632', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/4f/e5/f5/4fe5f511-462e-e87b-0711-d4e42809fb17/dj.goshfswo.jpg/300x300bb.jpg' },
  { artist: 'Herbie Hancock', title: 'Head Hunters', genre: 'Jazz', condition: 3, marketValue: 42, photoColor: '#A35139', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/e5/24/aa/e524aacd-467b-66f3-8931-0fcd6750a4b9/08UMGIM07914.rgb.jpg/300x300bb.jpg' },
]

const jazzCompact: CompactRecord[] = [
  ['Miles Davis', 'Kind of Blue', 4, 55],
  ['Bill Evans', 'Waltz for Debby', 3, 48],
  ['Sonny Rollins', 'Saxophone Colossus', 4, 62],
  ['Wayne Shorter', 'Speak No Evil', 3, 44],
  ['Cannonball Adderley', 'Somethin\' Else', 4, 52],
  ['Ornette Coleman', 'The Shape of Jazz to Come', 3, 45],
  ['Eric Dolphy', 'Out to Lunch', 4, 58],
  ['Freddie Hubbard', 'Red Clay', 3, 38],
  ['Ahmad Jamal', 'But Not for Me', 4, 50],
  ['Lee Morgan', 'The Sidewinder', 3, 42],
  ['McCoy Tyner', 'The Real McCoy', 4, 48],
  ['Dexter Gordon', 'Go', 3, 40],
  ['Kenny Dorham', 'Quiet Kenny', 4, 55],
  ['Horace Silver', 'Song for My Father', 3, 44],
  ['Grant Green', 'Idle Moments', 4, 52],
  ['Andrew Hill', 'Point of Departure', 3, 38],
  ['Joe Henderson', 'Page One', 4, 48],
  ['Hank Mobley', 'Soul Station', 3, 42],
  ['Cecil Taylor', 'Unit Structures', 3, 35],
  ['Sun Ra', 'Lanquidity', 4, 48],
]

const houseFeatured: PackRecord[] = [
  { artist: 'Kerri Chandler', title: 'Spaces and Places', genre: 'House', condition: 5, marketValue: 48, photoColor: '#3D7A4F', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/14/d2/77/14d277cd-1c90-3908-9c6f-951c54f7e481/cover.jpg/300x300bb.jpg' },
  { artist: 'Larry Heard', title: 'Sceneries Not Songs', genre: 'House', condition: 4, marketValue: 58, photoColor: '#2C3B4D', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/c9/4b/ed/c94bedd8-5c5e-df56-1fb9-000a16537f01/8718723149693.jpg/300x300bb.jpg' },
  { artist: 'Frankie Knuckles', title: 'Beyond the Mix', genre: 'House', condition: 5, marketValue: 42, photoColor: '#3D7A4F', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music6/v4/9d/65/21/9d6521c3-fc50-8d5a-6ddc-7628ff7d307f/05099909472952.jpg/300x300bb.jpg' },
  { artist: 'Donna Summer', title: 'I Feel Love (12" Single)', genre: 'House', condition: 3, marketValue: 35, photoColor: '#C04040', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music118/v4/1c/46/60/1c46600c-6c43-0ed3-ed6d-8217e61a5f2a/00600753626030.rgb.jpg/300x300bb.jpg' },
  { artist: 'Theo Parrish', title: 'First Floor', genre: 'House', condition: 4, marketValue: 110, photoColor: '#1B2632', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music/34/08/8f/mzi.dtxcmahx.tif/300x300bb.jpg' },
]

const houseCompact: CompactRecord[] = [
  ['Marshall Jefferson', 'Move Your Body', 3, 38],
  ['Ron Trent', 'Altered States', 4, 55],
  ['Moodymann', 'Silentintroduction', 4, 85],
  ['Mr. Fingers', 'Amnesia', 3, 32],
  ['DJ Sprinkles', 'Midtown 120 Blues', 4, 48],
  ['Boo Williams', 'Residual', 3, 28],
  ['Glenn Underground', 'Atmosfear', 4, 42],
  ['Chez Damier', 'Untitled', 3, 25],
  ['Robert Hood', 'Minimal Nation', 4, 52],
  ['Green Velvet', 'Flash', 3, 30],
  ['Derrick Carter', 'Squaredancing in a Roundhouse', 4, 35],
  ['Cajmere', 'Brighter Days', 3, 22],
  ['Lil Louis', 'French Kiss', 4, 38],
  ['Inner City', 'Big Fun', 3, 28],
  ['Adonis', 'No Way Back', 3, 25],
  ['Phuture', 'Acid Tracks', 4, 45],
  ['Jamie Principle', 'Your Love', 3, 30],
  ['Steve Poindexter', 'Work That Mutha Fucker', 4, 35],
  ['Bam Bam', 'Where\'s Your Child', 3, 22],
  ['Farley Jackmaster Funk', 'Love Can\'t Turn Around', 3, 25],
]

const ambientFeatured: PackRecord[] = [
  { artist: 'Brian Eno', title: 'Ambient 1: Music for Airports', genre: 'Ambient', condition: 5, marketValue: 52, photoColor: '#EEE9DF', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/ee/71/42/ee71425d-6bc9-3df8-c90b-8539f59144ab/00724386649553.rgb.jpg/300x300bb.jpg' },
  { artist: 'Brian Eno', title: 'Another Green World', genre: 'Ambient', condition: 4, marketValue: 48, photoColor: '#EEE9DF', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/a4/fe/b1/a4feb15b-126f-ce68-c6a0-a525005eb8e8/13UABIM29259.rgb.jpg/300x300bb.jpg' },
  { artist: 'Tim Hecker', title: 'Ravedeath, 1972', genre: 'Ambient', condition: 5, marketValue: 35, photoColor: '#4A5B6D', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/4a/68/4c/4a684c10-456b-8442-9ed3-764d57a32aed/mzi.ukvgcwzt.jpg/300x300bb.jpg' },
  { artist: 'Gas', title: 'Pop', genre: 'Ambient', condition: 4, marketValue: 78, photoColor: '#3D7A4F', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/5d/6a/00/5d6a0054-5145-6011-c638-3e2666d0e8dd/192641833472_Cover.jpg/300x300bb.jpg' },
  { artist: 'Boards of Canada', title: 'Geogaddi', genre: 'Ambient', condition: 5, marketValue: 55, photoColor: '#4A5B6D', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/2e/77/7c/2e777c13-60e3-c231-8be0-b0d43dc91598/mzi.yseuvnlj.jpg/300x300bb.jpg' },
]

const ambientCompact: CompactRecord[] = [
  ['Stars of the Lid', 'And Their Refinement of the Decline', 4, 42],
  ['William Basinski', 'The Disintegration Loops', 3, 38],
  ['Grouper', 'Dragging a Dead Deer Up a Hill', 4, 35],
  ['Fennesz', 'Endless Summer', 3, 32],
  ['Biosphere', 'Substrata', 4, 45],
  ['Harold Budd', 'The Pavilion of Dreams', 3, 38],
  ['Robert Rich', 'Somnium', 4, 28],
  ['Steve Roach', 'Structures from Silence', 3, 32],
  ['Éliane Radigue', 'Trilogie de la Mort', 4, 55],
  ['Loscil', 'Submers', 3, 22],
  ['Rafael Anton Irisarri', 'The North Bend', 4, 28],
  ['Lawrence English', 'Wilderness of Mirrors', 3, 25],
  ['Ian William Craig', 'Centres', 4, 30],
  ['Celer', 'Without Retrospect, the Morning', 3, 22],
  ['Chihei Hatakeyama', 'Minima Moralia', 4, 28],
  ['Taylor Deupree', 'Shoals', 3, 25],
  ['Nils Frahm', 'Screws', 4, 32],
  ['Kara-Lis Coverdale', 'Grafts', 3, 20],
  ['Jefre Cantu-Ledesma', 'Love Is a Stream', 4, 28],
  ['Sarah Davachi', 'All My Circles Run', 3, 22],
]

export const curatedPacks: CuratedPack[] = [
  {
    id: 'pack-001',
    name: 'Jazz Essentials Vol. 1',
    genre: 'Jazz',
    records: fillPack('Jazz', jazzFeatured, jazzCompact, '#2C3B4D'),
    totalValue: 1250,
    packPrice: 1062,
    discountPercent: 15,
    status: 'listed_network',
    generatedAt: '2 hours ago',
    generationReason: 'Jazz is 3% of your sales but 18% of your inventory. Auto-generated from 6 dead stock + 8 slow movers.',
    avgCondition: 3.6,
    deadStockCount: 6,
    slowMoverCount: 8,
  },
  {
    id: 'pack-002',
    name: 'House & Groove Vol. 1',
    genre: 'House',
    records: fillPack('House', houseFeatured, houseCompact, '#3D7A4F'),
    totalValue: 1100,
    packPrice: 935,
    discountPercent: 15,
    status: 'draft',
    generatedAt: '1 day ago',
    generationReason: 'House duplicate copies and slow movers. You have 2x of 8 titles — bundling spares into a network-ready pack.',
    avgCondition: 3.5,
    deadStockCount: 4,
    slowMoverCount: 10,
  },
  {
    id: 'pack-003',
    name: 'Ambient Landscapes Vol. 1',
    genre: 'Ambient',
    records: fillPack('Ambient', ambientFeatured, ambientCompact, '#4A5B6D'),
    totalValue: 950,
    packPrice: 808,
    discountPercent: 15,
    status: 'listed_storefront',
    generatedAt: '3 days ago',
    generationReason: 'Ambient demand is seasonal — peaked in winter, now declining. Move surplus before summer slowdown.',
    avgCondition: 3.6,
    deadStockCount: 3,
    slowMoverCount: 9,
  },
]

// ─── Network Pack Listings (from other stores) ──────────────

const technoFeatured: PackRecord[] = [
  { artist: 'Aphex Twin', title: 'Selected Ambient Works 85-92', genre: 'Techno', condition: 5, marketValue: 65, photoColor: '#1B2632', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/5f/b3/e0/5fb3e08d-c2cd-3da4-6ad7-c5dc61803683/cover.jpg/300x300bb.jpg' },
  { artist: 'Jeff Mills', title: 'Waveform Transmission Vol. 1', genre: 'Techno', condition: 4, marketValue: 120, photoColor: '#4A5B6D' },
  { artist: 'Drexciya', title: 'Neptune\'s Lair', genre: 'Techno', condition: 4, marketValue: 95, photoColor: '#2C3B4D', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/95/a4/3f/95a43f9d-4eb9-e5a9-ee64-910d3fb95e6c/3663729188892_3000.jpg/300x300bb.jpg' },
  { artist: 'Plastikman', title: 'Sheet One', genre: 'Techno', condition: 4, marketValue: 55, photoColor: '#1B2632' },
  { artist: 'Basic Channel', title: 'BCD', genre: 'Techno', condition: 5, marketValue: 48, photoColor: '#4A5B6D' },
]

const technoCompact: CompactRecord[] = [
  ['Underground Resistance', 'Revolution for Change', 4, 62],
  ['Juan Atkins', 'Wax Trax! Mastermix', 3, 45],
  ['Surgeon', 'Force + Form', 4, 38],
  ['Regis', 'Gymnastics', 3, 35],
  ['Oscar Mulero', 'About Discipline and Education', 4, 42],
  ['Robert Hood', 'Internal Empire', 3, 48],
  ['Joey Beltram', 'Energy Flash', 4, 55],
  ['Dave Clarke', 'Red Three', 3, 32],
  ['Luke Slater', 'Freek Funk', 4, 38],
  ['Speedy J', 'Ginger', 3, 35],
  ['Maurizio', 'M-Series', 4, 52],
  ['Monolake', 'Interstate', 3, 32],
  ['Shed', 'Shedding the Past', 4, 35],
  ['Marcel Dettmann', 'Dettmann', 3, 28],
  ['Ben Klock', 'One', 4, 38],
  ['Blawan', 'His He She & She', 3, 30],
  ['Helena Hauff', 'Discreet Desires', 4, 35],
  ['Objekt', 'Flatland', 3, 42],
  ['Dasha Rush', 'Sleepstep', 4, 28],
  ['Paula Temple', 'Deathvox', 3, 25],
]

const discoFeatured: PackRecord[] = [
  { artist: 'Donna Summer', title: 'Bad Girls', genre: 'Disco', condition: 4, marketValue: 42, photoColor: '#C04040', artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music118/v4/1c/46/60/1c46600c-6c43-0ed3-ed6d-8217e61a5f2a/00600753626030.rgb.jpg/300x300bb.jpg' },
  { artist: 'Chic', title: 'C\'est Chic', genre: 'Disco', condition: 5, marketValue: 38, photoColor: '#FFB162' },
  { artist: 'Sister Sledge', title: 'We Are Family', genre: 'Disco', condition: 4, marketValue: 35, photoColor: '#A35139' },
  { artist: 'Sylvester', title: 'Step II', genre: 'Disco', condition: 4, marketValue: 48, photoColor: '#3D7A4F' },
  { artist: 'Patrick Cowley', title: 'Megatron Man', genre: 'Disco', condition: 3, marketValue: 52, photoColor: '#4A5B6D' },
]

const discoCompact: CompactRecord[] = [
  ['Cerrone', 'Supernature', 4, 38],
  ['Giorgio Moroder', 'From Here to Eternity', 3, 35],
  ['Bee Gees', 'Saturday Night Fever OST', 4, 28],
  ['Earth, Wind & Fire', 'All \'N All', 3, 32],
  ['Kool & The Gang', 'Ladies\' Night', 4, 25],
  ['KC and the Sunshine Band', 'Do You Wanna Go Party', 3, 22],
  ['Tavares', 'Madam Butterfly', 4, 35],
  ['Voyage', 'Voyage', 3, 28],
  ['Gino Soccio', 'Outline', 4, 42],
  ['Space', 'Magic Fly', 3, 30],
  ['Lime', 'Lime III', 4, 22],
  ['Lipps Inc.', 'Mouth to Mouth', 3, 20],
  ['Teena Marie', 'Wild and Peaceful', 4, 35],
  ['Evelyn "Champagne" King', 'Get Loose', 3, 28],
  ['D-Train', 'You\'re the One for Me', 4, 32],
  ['Shalamar', 'Big Fun', 3, 25],
  ['Imagination', 'Body Talk', 4, 30],
  ['Mtume', 'Juicy Fruit', 3, 28],
  ['The Jones Girls', 'Get as Much Love as You Can', 4, 25],
  ['First Choice', 'Armed and Extremely Dangerous', 3, 22],
]

const soulFeatured: PackRecord[] = [
  { artist: 'Marvin Gaye', title: 'What\'s Going On', genre: 'Soul', condition: 4, marketValue: 55, photoColor: '#A35139' },
  { artist: 'Stevie Wonder', title: 'Innervisions', genre: 'Soul', condition: 5, marketValue: 48, photoColor: '#C04040' },
  { artist: 'Curtis Mayfield', title: 'Superfly', genre: 'Soul', condition: 4, marketValue: 42, photoColor: '#3D7A4F' },
  { artist: 'Al Green', title: 'Let\'s Stay Together', genre: 'Soul', condition: 3, marketValue: 38, photoColor: '#2C3B4D' },
  { artist: 'Donny Hathaway', title: 'Live', genre: 'Soul', condition: 4, marketValue: 52, photoColor: '#1B2632' },
]

const soulCompact: CompactRecord[] = [
  ['Otis Redding', 'Otis Blue', 4, 45],
  ['Sam Cooke', 'Live at the Harlem Square Club', 3, 38],
  ['Isaac Hayes', 'Hot Buttered Soul', 4, 42],
  ['Bill Withers', 'Still Bill', 3, 35],
  ['Bobby Womack', 'Understanding', 4, 32],
  ['The Temptations', 'Cloud Nine', 3, 28],
  ['Aretha Franklin', 'Spirit in the Dark', 4, 40],
  ['The Isley Brothers', 'The Heat Is On', 3, 30],
  ['Sly & the Family Stone', 'There\'s a Riot Goin\' On', 4, 48],
  ['Gil Scott-Heron', 'Pieces of a Man', 3, 35],
  ['Roy Ayers', 'Everybody Loves the Sunshine', 4, 42],
  ['Earth, Wind & Fire', 'That\'s the Way of the World', 3, 32],
  ['D\'Angelo', 'Voodoo', 4, 38],
  ['Erykah Badu', 'Baduizm', 3, 30],
  ['Lauryn Hill', 'The Miseducation of Lauryn Hill', 4, 45],
  ['Maxwell', 'Urban Hang Suite', 3, 28],
  ['Musiq Soulchild', 'Aijuswanaseing', 4, 25],
  ['Jill Scott', 'Who Is Jill Scott?', 3, 30],
  ['Anita Baker', 'Rapture', 4, 35],
  ['Luther Vandross', 'Never Too Much', 3, 28],
]

export const networkPackListings: NetworkPackListing[] = [
  {
    id: 'npl-001',
    store: { name: 'BPM Supply', location: 'Berlin, DE', trustScore: 96 },
    pack: {
      id: 'pack-bpm-001',
      name: 'Berlin Techno Vault Vol. 1',
      genre: 'Techno',
      records: fillPack('Techno', technoFeatured, technoCompact, '#1B2632'),
      totalValue: 1280,
      packPrice: 1088,
      discountPercent: 15,
      status: 'listed_network',
      generatedAt: '4 hours ago',
      generationReason: 'BPM Supply rotating excess techno from recent warehouse acquisition.',
      avgCondition: 3.6,
      deadStockCount: 5,
      slowMoverCount: 7,
    },
    listedAt: '4 hours ago',
  },
  {
    id: 'npl-002',
    store: { name: 'Crate Diggers Union', location: 'Chicago, IL', trustScore: 91 },
    pack: {
      id: 'pack-cd-001',
      name: 'Disco & Boogie Classics Vol. 1',
      genre: 'Disco',
      records: fillPack('Disco', discoFeatured, discoCompact, '#FFB162'),
      totalValue: 920,
      packPrice: 782,
      discountPercent: 15,
      status: 'listed_network',
      generatedAt: '1 day ago',
      generationReason: 'Crate Diggers Union clearing disco surplus — Chicago market skews house/footwork.',
      avgCondition: 3.5,
      deadStockCount: 4,
      slowMoverCount: 8,
    },
    listedAt: '1 day ago',
  },
  {
    id: 'npl-003',
    store: { name: 'Vinyl Soul', location: 'Atlanta, GA', trustScore: 88 },
    pack: {
      id: 'pack-vs-001',
      name: 'Southern Soul Essentials Vol. 1',
      genre: 'Soul',
      records: fillPack('Soul', soulFeatured, soulCompact, '#A35139'),
      totalValue: 1050,
      packPrice: 892,
      discountPercent: 15,
      status: 'listed_network',
      generatedAt: '2 days ago',
      generationReason: 'Atlanta market shifted to hip-hop and R&B — classic soul moving slower. Great condition lot.',
      avgCondition: 3.6,
      deadStockCount: 5,
      slowMoverCount: 8,
    },
    listedAt: '2 days ago',
  },
  {
    id: 'npl-004',
    store: { name: 'Wax Temple', location: 'Tokyo, JP', trustScore: 94 },
    pack: {
      id: 'pack-wt-001',
      name: 'Deep House Selections Vol. 1',
      genre: 'House',
      records: fillPack('House', houseFeatured, houseCompact, '#3D7A4F'),
      totalValue: 1100,
      packPrice: 935,
      discountPercent: 15,
      status: 'listed_network',
      generatedAt: '12 hours ago',
      generationReason: 'Wax Temple downsizing US house section — Japanese market prefers techno and city pop.',
      avgCondition: 3.5,
      deadStockCount: 3,
      slowMoverCount: 9,
    },
    listedAt: '12 hours ago',
  },
]

// ─── Pack Purchases (completed/pending orders) ──────────────

export const packPurchases: PackPurchase[] = [
  {
    id: 'po-001',
    type: 'sale',
    pack: { name: 'Funk & Breaks Vol. 2', genre: 'Funk', recordCount: 25, packPrice: 890 },
    counterparty: { name: 'Deep Groove Records', location: 'Brooklyn, NY' },
    waxedFee: 71,
    sellerReceives: 819,
    shipping: 17,
    buyerPays: 907,
    status: 'shipped',
    createdAt: '2 days ago',
  },
  {
    id: 'po-002',
    type: 'purchase',
    pack: { name: 'UK Garage Essentials Vol. 1', genre: 'Garage', recordCount: 25, packPrice: 1150 },
    counterparty: { name: 'Plastic People Records', location: 'London, UK' },
    waxedFee: 92,
    sellerReceives: 1058,
    shipping: 17,
    buyerPays: 1167,
    status: 'confirmed',
    createdAt: '3 days ago',
  },
  {
    id: 'po-003',
    type: 'sale',
    pack: { name: 'Jazz Essentials Vol. 1', genre: 'Jazz', recordCount: 25, packPrice: 1062 },
    counterparty: { name: 'Ambient Works', location: 'Portland, OR' },
    waxedFee: 85,
    sellerReceives: 977,
    shipping: 17,
    buyerPays: 1079,
    status: 'completed',
    createdAt: '1 week ago',
  },
]

// ─── Inbound Pack Requests ───────────────────────────────────

export const inboundPackRequests: InboundPackRequest[] = [
  {
    id: 'ipr-001',
    fromStore: { name: 'Deep Groove Records', location: 'Brooklyn, NY', trustScore: 97 },
    requestedPackId: 'pack-001',
    requestedPackName: 'Jazz Essentials Vol. 1',
    requestedGenre: 'Jazz',
    offeredPrice: 1000,
    status: 'pending',
    requestedAt: '3 hours ago',
    message: 'We\'ll take the full jazz pack at $1,000. Blue Note and Impulse pressings sell fast in Brooklyn — can move the whole set within a month.',
  },
  {
    id: 'ipr-002',
    fromStore: { name: 'Ambient Works', location: 'Portland, OR', trustScore: 89 },
    requestedPackId: 'pack-003',
    requestedPackName: 'Ambient Landscapes Vol. 1',
    requestedGenre: 'Ambient',
    offeredPrice: 780,
    status: 'pending',
    requestedAt: '6 hours ago',
    message: 'Portland ambient scene is still strong through spring. $780 for the full 25 — we can pay and ship this week.',
  },
]
