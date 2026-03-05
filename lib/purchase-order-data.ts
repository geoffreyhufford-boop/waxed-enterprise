// ─── Purchase Orders ────────────────────────────────────────────

export interface PurchaseOrderLineItem {
  id: string
  artist: string
  title: string
  format: string
  unitCost: number
  qtyOrdered: number
  qtyReceived: number
  catalogNo?: string
}

export interface PurchaseOrder {
  id: string
  supplierId: string
  supplierName: string
  status: 'draft' | 'delivered' | 'partially_received' | 'received' | 'closed'
  createdDate: string
  sentDate?: string
  expectedDelivery?: string
  receivedDate?: string
  lineItems: PurchaseOrderLineItem[]
  subtotal: number
  shippingCost: number
  total: number
  notes?: string
  createdBy: string
}

// ─── Mock Data ──────────────────────────────────────────────────

export const purchaseOrders: PurchaseOrder[] = [
  {
    id: 'PO-041',
    supplierId: 'sup-001',
    supplierName: 'Tresor Records',
    status: 'delivered',
    createdDate: '2025-02-20',
    sentDate: '2025-02-21',
    expectedDelivery: '2025-03-05',
    lineItems: [
      { id: 'poli-001', artist: 'Robert Hood', title: 'Internal Empire', format: '2x12"', unitCost: 18.50, qtyOrdered: 4, qtyReceived: 0, catalogNo: 'TRESOR 27' },
      { id: 'poli-002', artist: 'Surgeon', title: 'Balance', format: '12"', unitCost: 12.00, qtyOrdered: 3, qtyReceived: 0, catalogNo: 'TRESOR 138' },
      { id: 'poli-003', artist: 'Juan Atkins', title: 'Dimensions / Flash', format: '12"', unitCost: 10.00, qtyOrdered: 5, qtyReceived: 0, catalogNo: 'TRESOR 005' },
    ],
    subtotal: 160.00,
    shippingCost: 35.00,
    total: 195.00,
    notes: 'Confirmed stock via email Feb 21. DHL shipping.',
    createdBy: 'Jordan Reeves',
  },
  {
    id: 'PO-040',
    supplierId: 'sup-002',
    supplierName: 'Alliance Entertainment',
    status: 'partially_received',
    createdDate: '2025-02-12',
    sentDate: '2025-02-13',
    expectedDelivery: '2025-02-26',
    lineItems: [
      { id: 'poli-004', artist: 'Kendrick Lamar', title: 'GNX', format: '2x12"', unitCost: 22.00, qtyOrdered: 6, qtyReceived: 6, catalogNo: 'B0045123-01' },
      { id: 'poli-005', artist: 'Tyler, The Creator', title: 'Chromakopia', format: '12"', unitCost: 19.50, qtyOrdered: 4, qtyReceived: 4, catalogNo: 'B0043876-01' },
      { id: 'poli-006', artist: 'Billie Eilish', title: 'HIT ME HARD AND SOFT', format: '12"', unitCost: 18.00, qtyOrdered: 3, qtyReceived: 0, catalogNo: 'B0042198-01' },
      { id: 'poli-007', artist: 'Sabrina Carpenter', title: 'Short n\' Sweet', format: '12"', unitCost: 17.50, qtyOrdered: 3, qtyReceived: 0, catalogNo: 'B0042310-01' },
    ],
    subtotal: 361.50,
    shippingCost: 0,
    total: 361.50,
    notes: 'Partial shipment received Feb 24. Remaining items backordered — ETA Mar 3.',
    createdBy: 'Maya Chen',
  },
  {
    id: 'PO-039',
    supplierId: 'sup-003',
    supplierName: 'Hyperdub',
    status: 'received',
    createdDate: '2025-02-01',
    sentDate: '2025-02-02',
    expectedDelivery: '2025-02-18',
    receivedDate: '2025-02-17',
    lineItems: [
      { id: 'poli-008', artist: 'Burial', title: 'Untrue', format: '2x12"', unitCost: 20.00, qtyOrdered: 3, qtyReceived: 3, catalogNo: 'HDBCD002' },
      { id: 'poli-009', artist: 'Kode9 & Spaceape', title: 'Memories of the Future', format: '2x12"', unitCost: 18.00, qtyOrdered: 2, qtyReceived: 2, catalogNo: 'HDBCD001' },
    ],
    subtotal: 96.00,
    shippingCost: 22.00,
    total: 118.00,
    notes: 'All items received in good condition.',
    createdBy: 'Jordan Reeves',
  },
  {
    id: 'PO-042',
    supplierId: 'sup-004',
    supplierName: 'Rush Hour Distribution',
    status: 'draft',
    createdDate: '2025-02-27',
    lineItems: [
      { id: 'poli-010', artist: 'Hunee', title: 'Hunchin\' All Night', format: '2x12"', unitCost: 24.00, qtyOrdered: 2, qtyReceived: 0, catalogNo: 'RHM 030' },
      { id: 'poli-011', artist: 'San Proper', title: 'Animal', format: '12"', unitCost: 11.00, qtyOrdered: 3, qtyReceived: 0, catalogNo: 'RH-SMS 1218' },
      { id: 'poli-012', artist: 'Antal', title: 'Chase', format: '12"', unitCost: 10.50, qtyOrdered: 3, qtyReceived: 0, catalogNo: 'RH 024' },
    ],
    subtotal: 112.50,
    shippingCost: 28.00,
    total: 140.50,
    createdBy: 'Jordan Reeves',
  },
]
