// ─── Staff & Permissions ────────────────────────────────────────

export interface StaffMember {
  id: string
  name: string
  email: string
  role: 'owner' | 'manager' | 'cashier'
  lastActive: string
  invitedAt: string
  status: 'active' | 'invited' | 'disabled'
}

export interface RolePermission {
  feature: string
  owner: boolean
  manager: boolean
  cashier: boolean
}

export interface AuditLogEntry {
  id: string
  userId: string
  userName: string
  action: string
  category: 'inventory' | 'orders' | 'settings' | 'pricing' | 'customers'
  timestamp: string
  details?: string
}

export interface DiscountRule {
  id: string
  name: string
  type: 'store_wide' | 'customer_tier' | 'volume'
  active: boolean
  value: number
  conditions?: string
  appliesTo: 'all' | 'genre' | 'crate'
  targetId?: string
  customerTier?: string
  minQty?: number
  startDate?: string
  endDate?: string
  createdBy: string
}

// ─── Mock Data ──────────────────────────────────────────────────

export const staffMembers: StaffMember[] = [
  {
    id: 'staff-001',
    name: 'Jordan Reeves',
    email: 'jordan@waxandgroove.com',
    role: 'owner',
    lastActive: '2 min ago',
    invitedAt: '2024-01-15',
    status: 'active',
  },
  {
    id: 'staff-002',
    name: 'Maya Chen',
    email: 'maya@waxandgroove.com',
    role: 'manager',
    lastActive: '1 hr ago',
    invitedAt: '2024-03-01',
    status: 'active',
  },
  {
    id: 'staff-003',
    name: 'Dex Ortega',
    email: 'dex@waxandgroove.com',
    role: 'cashier',
    lastActive: 'Yesterday',
    invitedAt: '2024-06-10',
    status: 'active',
  },
  {
    id: 'staff-004',
    name: 'Riley Park',
    email: 'riley@waxandgroove.com',
    role: 'cashier',
    lastActive: '—',
    invitedAt: '2025-02-20',
    status: 'invited',
  },
]

export const rolePermissions: RolePermission[] = [
  { feature: 'View Inventory', owner: true, manager: true, cashier: true },
  { feature: 'Edit Inventory', owner: true, manager: true, cashier: false },
  { feature: 'Delete Records', owner: true, manager: false, cashier: false },
  { feature: 'View Orders', owner: true, manager: true, cashier: true },
  { feature: 'Fulfill Orders', owner: true, manager: true, cashier: true },
  { feature: 'Refund Orders', owner: true, manager: true, cashier: false },
  { feature: 'View Analytics', owner: true, manager: true, cashier: false },
  { feature: 'Export Data', owner: true, manager: true, cashier: false },
  { feature: 'Manage Discounts', owner: true, manager: true, cashier: false },
  { feature: 'Manage Staff', owner: true, manager: false, cashier: false },
  { feature: 'Manage Customers', owner: true, manager: true, cashier: true },
  { feature: 'Process POS Sales', owner: true, manager: true, cashier: true },
  { feature: 'View Consignments', owner: true, manager: true, cashier: true },
  { feature: 'Manage Consignments', owner: true, manager: true, cashier: false },
  { feature: 'Run Inventory Audits', owner: true, manager: true, cashier: false },
]

export const auditLog: AuditLogEntry[] = [
  {
    id: 'log-001',
    userId: 'staff-001',
    userName: 'Jordan Reeves',
    action: 'Updated pricing on 12 records',
    category: 'pricing',
    timestamp: '2025-02-27 14:32',
    details: 'Bulk reprice — genre: Electronic',
  },
  {
    id: 'log-002',
    userId: 'staff-002',
    userName: 'Maya Chen',
    action: 'Fulfilled order ORD-0247',
    category: 'orders',
    timestamp: '2025-02-27 13:15',
  },
  {
    id: 'log-003',
    userId: 'staff-003',
    userName: 'Dex Ortega',
    action: 'Processed POS sale — $47.00',
    category: 'orders',
    timestamp: '2025-02-27 11:48',
  },
  {
    id: 'log-004',
    userId: 'staff-002',
    userName: 'Maya Chen',
    action: 'Added 8 records from Discogs import',
    category: 'inventory',
    timestamp: '2025-02-26 16:20',
  },
  {
    id: 'log-005',
    userId: 'staff-001',
    userName: 'Jordan Reeves',
    action: 'Created discount "Winter Clearance"',
    category: 'pricing',
    timestamp: '2025-02-26 10:05',
    details: 'Store-wide 15% off, ends Mar 15',
  },
  {
    id: 'log-006',
    userId: 'staff-001',
    userName: 'Jordan Reeves',
    action: 'Invited Riley Park as cashier',
    category: 'settings',
    timestamp: '2025-02-20 09:30',
  },
  {
    id: 'log-007',
    userId: 'staff-002',
    userName: 'Maya Chen',
    action: 'Updated customer tier — Alex Chen → VIP',
    category: 'customers',
    timestamp: '2025-02-19 14:12',
  },
  {
    id: 'log-008',
    userId: 'staff-001',
    userName: 'Jordan Reeves',
    action: 'Started inventory count IC-003',
    category: 'inventory',
    timestamp: '2025-02-18 08:00',
  },
]

export const discountRules: DiscountRule[] = [
  {
    id: 'disc-001',
    name: 'Winter Clearance',
    type: 'store_wide',
    active: true,
    value: 15,
    appliesTo: 'all',
    startDate: '2025-02-01',
    endDate: '2025-03-15',
    createdBy: 'Jordan Reeves',
  },
  {
    id: 'disc-002',
    name: 'VIP Member Discount',
    type: 'customer_tier',
    active: true,
    value: 10,
    appliesTo: 'all',
    customerTier: 'vip',
    createdBy: 'Jordan Reeves',
  },
  {
    id: 'disc-003',
    name: 'Bulk Buyer — 5+',
    type: 'volume',
    active: true,
    value: 12,
    appliesTo: 'all',
    minQty: 5,
    createdBy: 'Maya Chen',
  },
  {
    id: 'disc-004',
    name: 'Jazz Crate Promo',
    type: 'store_wide',
    active: false,
    value: 20,
    appliesTo: 'genre',
    targetId: 'Jazz',
    startDate: '2025-01-10',
    endDate: '2025-01-31',
    createdBy: 'Jordan Reeves',
  },
  {
    id: 'disc-005',
    name: 'Wholesale Pricing',
    type: 'customer_tier',
    active: true,
    value: 18,
    appliesTo: 'all',
    customerTier: 'wholesale',
    createdBy: 'Jordan Reeves',
  },
]
