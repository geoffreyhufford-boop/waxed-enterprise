// ─── Consignment Tracking ───────────────────────────────────────

export interface Consignor {
  id: string
  name: string
  email: string
  phone?: string
  splitRate: number
  payoutMethod: string
  balance: number
  totalPaid: number
  totalEarned: number
  activeItems: number
  soldItems: number
  joinedDate: string
  notes?: string
}

export interface ConsignmentPayout {
  id: string
  consignorId: string
  consignorName: string
  amount: number
  method: string
  date: string
  itemsSold: number
  notes?: string
}

export interface ConsignedRecord {
  inventoryId: string
  consignorId: string
  consignorName: string
  splitRate: number
  consignedDate: string
  status: 'active' | 'sold' | 'returned'
  salePrice?: number
  consignorEarnings?: number
  storeEarnings?: number
}

// ─── Mock Data ──────────────────────────────────────────────────

export const consignors: Consignor[] = [
  {
    id: 'csg-001',
    name: 'Dave Kowalski',
    email: 'dave.k@email.com',
    phone: '+1 (347) 555-0192',
    splitRate: 70,
    payoutMethod: 'Venmo',
    balance: 84.00,
    totalPaid: 520.00,
    totalEarned: 604.00,
    activeItems: 8,
    soldItems: 14,
    joinedDate: '2024-06-15',
    notes: 'Local collector downsizing. Mostly jazz and soul. Reliable — records always graded accurately.',
  },
  {
    id: 'csg-002',
    name: 'Priya Sharma',
    email: 'priya.s@email.com',
    splitRate: 65,
    payoutMethod: 'PayPal',
    balance: 156.00,
    totalPaid: 890.00,
    totalEarned: 1046.00,
    activeItems: 22,
    soldItems: 31,
    joinedDate: '2024-03-01',
    notes: 'Estate sale buyer — brings in large batches. Mixed quality, needs grading review.',
  },
  {
    id: 'csg-003',
    name: 'Marcus Webb',
    email: 'marcus.w@email.com',
    phone: '+1 (917) 555-0384',
    splitRate: 60,
    payoutMethod: 'Check',
    balance: 0,
    totalPaid: 340.00,
    totalEarned: 340.00,
    activeItems: 5,
    soldItems: 9,
    joinedDate: '2024-09-20',
    notes: 'DJ offloading duplicates. Electronic and house focused.',
  },
]

export const consignmentPayouts: ConsignmentPayout[] = [
  {
    id: 'pay-001',
    consignorId: 'csg-001',
    consignorName: 'Dave Kowalski',
    amount: 245.00,
    method: 'Venmo',
    date: '2025-02-15',
    itemsSold: 6,
  },
  {
    id: 'pay-002',
    consignorId: 'csg-002',
    consignorName: 'Priya Sharma',
    amount: 420.00,
    method: 'PayPal',
    date: '2025-02-10',
    itemsSold: 12,
    notes: 'Monthly batch payout',
  },
  {
    id: 'pay-003',
    consignorId: 'csg-003',
    consignorName: 'Marcus Webb',
    amount: 180.00,
    method: 'Check',
    date: '2025-01-28',
    itemsSold: 5,
  },
  {
    id: 'pay-004',
    consignorId: 'csg-001',
    consignorName: 'Dave Kowalski',
    amount: 275.00,
    method: 'Venmo',
    date: '2025-01-12',
    itemsSold: 8,
  },
]

export const consignedRecords: ConsignedRecord[] = [
  {
    inventoryId: 'WX-001',
    consignorId: 'csg-001',
    consignorName: 'Dave Kowalski',
    splitRate: 70,
    consignedDate: '2025-01-20',
    status: 'active',
  },
  {
    inventoryId: 'WX-012',
    consignorId: 'csg-002',
    consignorName: 'Priya Sharma',
    splitRate: 65,
    consignedDate: '2025-02-05',
    status: 'sold',
    salePrice: 45.00,
    consignorEarnings: 29.25,
    storeEarnings: 15.75,
  },
  {
    inventoryId: 'WX-005',
    consignorId: 'csg-003',
    consignorName: 'Marcus Webb',
    splitRate: 60,
    consignedDate: '2025-02-10',
    status: 'active',
  },
]
