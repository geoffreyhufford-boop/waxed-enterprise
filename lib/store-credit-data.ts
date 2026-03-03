// ─── Store Credit ───────────────────────────────────────────

export interface StoreCreditAccount {
  id: string
  customerId: string
  customerName: string
  balance: number
  totalIssued: number
  totalRedeemed: number
  status: 'active' | 'frozen'
  createdAt: string
  lastActivity: string
}

export interface CreditTransaction {
  id: string
  accountId: string
  customerId: string
  customerName: string
  type: 'issued' | 'redeemed' | 'refund' | 'adjustment'
  amount: number
  balanceAfter: number
  note: string
  orderId?: string
  issuedBy: string
  createdAt: string
}

// ─── Mock Data ──────────────────────────────────────────────

export const creditAccounts: StoreCreditAccount[] = [
  {
    id: 'credit-001',
    customerId: 'cust-001',
    customerName: 'Sarah Mitchell',
    balance: 45.00,
    totalIssued: 120.00,
    totalRedeemed: 75.00,
    status: 'active',
    createdAt: '2024-11-10',
    lastActivity: '2025-02-20',
  },
  {
    id: 'credit-002',
    customerId: 'cust-002',
    customerName: 'James Rodriguez',
    balance: 207.99,
    totalIssued: 207.99,
    totalRedeemed: 0,
    status: 'active',
    createdAt: '2025-02-15',
    lastActivity: '2025-02-15',
  },
  {
    id: 'credit-003',
    customerId: 'cust-004',
    customerName: 'Lena Kowalski',
    balance: 15.00,
    totalIssued: 15.00,
    totalRedeemed: 0,
    status: 'active',
    createdAt: '2025-02-25',
    lastActivity: '2025-02-25',
  },
]

export const creditTransactions: CreditTransaction[] = [
  {
    id: 'ctx-001',
    accountId: 'credit-001',
    customerId: 'cust-001',
    customerName: 'Sarah Mitchell',
    type: 'issued',
    amount: 50.00,
    balanceAfter: 50.00,
    note: 'Loyalty reward — 30+ orders',
    issuedBy: 'Jordan Reeves',
    createdAt: '2024-11-10',
  },
  {
    id: 'ctx-002',
    accountId: 'credit-001',
    customerId: 'cust-001',
    customerName: 'Sarah Mitchell',
    type: 'redeemed',
    amount: -35.00,
    balanceAfter: 15.00,
    note: 'Applied to order ORD-0198',
    orderId: 'ORD-0198',
    issuedBy: 'System',
    createdAt: '2024-12-05',
  },
  {
    id: 'ctx-003',
    accountId: 'credit-001',
    customerId: 'cust-001',
    customerName: 'Sarah Mitchell',
    type: 'issued',
    amount: 70.00,
    balanceAfter: 85.00,
    note: 'Refund to credit — damaged sleeve on ORD-0210',
    orderId: 'ORD-0210',
    issuedBy: 'Maya Chen',
    createdAt: '2025-01-18',
  },
  {
    id: 'ctx-004',
    accountId: 'credit-001',
    customerId: 'cust-001',
    customerName: 'Sarah Mitchell',
    type: 'redeemed',
    amount: -40.00,
    balanceAfter: 45.00,
    note: 'Applied to order ORD-0235',
    orderId: 'ORD-0235',
    issuedBy: 'System',
    createdAt: '2025-02-20',
  },
  {
    id: 'ctx-005',
    accountId: 'credit-002',
    customerId: 'cust-002',
    customerName: 'James Rodriguez',
    type: 'refund',
    amount: 207.99,
    balanceAfter: 207.99,
    note: 'Refund to credit — order ORD-0241 (wrong pressing shipped)',
    orderId: 'ORD-0241',
    issuedBy: 'Jordan Reeves',
    createdAt: '2025-02-15',
  },
  {
    id: 'ctx-006',
    accountId: 'credit-003',
    customerId: 'cust-004',
    customerName: 'Lena Kowalski',
    type: 'issued',
    amount: 15.00,
    balanceAfter: 15.00,
    note: 'Courtesy credit — shipping delay on ORD-0244',
    orderId: 'ORD-0244',
    issuedBy: 'Maya Chen',
    createdAt: '2025-02-25',
  },
  {
    id: 'ctx-007',
    accountId: 'credit-001',
    customerId: 'cust-001',
    customerName: 'Sarah Mitchell',
    type: 'adjustment',
    amount: -10.00,
    balanceAfter: 40.00,
    note: 'Correction — duplicate credit removed',
    issuedBy: 'Jordan Reeves',
    createdAt: '2025-01-20',
  },
  {
    id: 'ctx-008',
    accountId: 'credit-001',
    customerId: 'cust-001',
    customerName: 'Sarah Mitchell',
    type: 'issued',
    amount: 5.00,
    balanceAfter: 45.00,
    note: 'Birthday bonus',
    issuedBy: 'Jordan Reeves',
    createdAt: '2025-02-14',
  },
]

// ─── Helpers ────────────────────────────────────────────────

export function getCreditAccount(customerId: string): StoreCreditAccount | undefined {
  return creditAccounts.find((a) => a.customerId === customerId)
}

export function getCreditTransactions(accountId: string): CreditTransaction[] {
  return creditTransactions.filter((t) => t.accountId === accountId)
}

export function getCreditStats() {
  const activeAccounts = creditAccounts.filter((a) => a.status === 'active').length
  const outstandingBalance = creditAccounts.reduce((sum, a) => sum + a.balance, 0)
  const totalRedeemed = creditAccounts.reduce((sum, a) => sum + a.totalRedeemed, 0)
  return { activeAccounts, outstandingBalance, totalRedeemed }
}
