// ─── Inventory Audits ───────────────────────────────────────────

export interface AuditCountItem {
  inventoryId: string
  artist: string
  title: string
  expectedQty: number
  countedQty: number | null
  variance: number | null
  note?: string
}

export interface InventoryAudit {
  id: string
  name: string
  startDate: string
  endDate?: string
  status: 'in_progress' | 'review' | 'completed' | 'cancelled'
  countedBy: string
  totalItems: number
  itemsCounted: number
  matchCount: number
  varianceCount: number
  missingCount: number
  extraCount: number
  items: AuditCountItem[]
  notes?: string
}

// ─── Mock Data ──────────────────────────────────────────────────

export const inventoryAudits: InventoryAudit[] = [
  {
    id: 'IC-003',
    name: 'February Floor Count',
    startDate: '2025-02-18',
    status: 'in_progress',
    countedBy: 'Maya Chen',
    totalItems: 12,
    itemsCounted: 8,
    matchCount: 6,
    varianceCount: 0,
    missingCount: 1,
    extraCount: 1,
    items: [
      { inventoryId: 'WX-001', artist: 'Aphex Twin', title: 'Selected Ambient Works 85-92', expectedQty: 1, countedQty: 1, variance: 0 },
      { inventoryId: 'WX-002', artist: 'Floating Points', title: 'Crush', expectedQty: 1, countedQty: 1, variance: 0 },
      { inventoryId: 'WX-003', artist: 'MF DOOM', title: 'Mm..Food', expectedQty: 1, countedQty: 1, variance: 0 },
      { inventoryId: 'WX-004', artist: 'Nala Sinephro', title: 'Space 1.8', expectedQty: 1, countedQty: 1, variance: 0 },
      { inventoryId: 'WX-005', artist: 'Sault', title: 'Untitled (Black Is)', expectedQty: 1, countedQty: 1, variance: 0 },
      { inventoryId: 'WX-006', artist: 'DJ Shadow', title: 'Endtroducing...', expectedQty: 1, countedQty: 0, variance: -1, note: 'Not found on shelf — check hold area' },
      { inventoryId: 'WX-007', artist: 'Boards of Canada', title: 'Music Has the Right to Children', expectedQty: 1, countedQty: 1, variance: 0 },
      { inventoryId: 'WX-008', artist: 'Burial', title: 'Untrue', expectedQty: 0, countedQty: 1, variance: 1, note: 'Extra copy found — not in system' },
      { inventoryId: 'WX-009', artist: 'Four Tet', title: 'Rounds', expectedQty: 1, countedQty: null, variance: null },
      { inventoryId: 'WX-010', artist: 'Khruangbin', title: 'Con Todo El Mundo', expectedQty: 1, countedQty: null, variance: null },
      { inventoryId: 'WX-011', artist: 'Caribou', title: 'Swim', expectedQty: 1, countedQty: null, variance: null },
      { inventoryId: 'WX-012', artist: 'Bonobo', title: 'Black Sands', expectedQty: 1, countedQty: null, variance: null },
    ],
    notes: 'Partial count — front section and electronic crates completed.',
  },
  {
    id: 'IC-002',
    name: 'January Full Audit',
    startDate: '2025-01-15',
    endDate: '2025-01-17',
    status: 'completed',
    countedBy: 'Jordan Reeves',
    totalItems: 248,
    itemsCounted: 248,
    matchCount: 241,
    varianceCount: 3,
    missingCount: 2,
    extraCount: 2,
    items: [],
    notes: 'Full bi-annual audit. 97.2% match rate. 2 missing items written off, 2 extras added to inventory.',
  },
  {
    id: 'IC-001',
    name: 'Q3 2024 Spot Check',
    startDate: '2024-09-28',
    endDate: '2024-09-28',
    status: 'completed',
    countedBy: 'Maya Chen',
    totalItems: 50,
    itemsCounted: 50,
    matchCount: 49,
    varianceCount: 1,
    missingCount: 1,
    extraCount: 0,
    items: [],
    notes: 'Random spot check — 50 records sampled. 1 missing (likely mis-shelved, found later).',
  },
]
