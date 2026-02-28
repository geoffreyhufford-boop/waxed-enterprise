'use client'

import { createContext, useContext, useReducer, type ReactNode } from 'react'
import type { MarketplaceListing } from './marketplace-data'

// ─── Types ───────────────────────────────────────────────────

export interface CartItem {
  listing: MarketplaceListing
  qty: number
}

interface CartState {
  items: CartItem[]
  isDrawerOpen: boolean
}

type CartAction =
  | { type: 'ADD_ITEM'; listing: MarketplaceListing; qty: number }
  | { type: 'REMOVE_ITEM'; listingId: string }
  | { type: 'UPDATE_QTY'; listingId: string; qty: number }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_DRAWER' }

// ─── Fee Calculation ─────────────────────────────────────────

export function calculateFees(items: CartItem[]) {
  const subtotal = items.reduce((sum, item) => sum + item.qty * item.listing.wholesalePrice, 0)
  const totalUnits = items.reduce((sum, item) => sum + item.qty, 0)
  const feeRate = totalUnits >= 75 ? 0.03 : 0.08
  const fee = subtotal * feeRate
  const shipping = Math.ceil(totalUnits / 25) * 17
  const total = subtotal + fee + shipping
  return { subtotal, totalUnits, feeRate, fee, shipping, total }
}

// ─── Reducer ─────────────────────────────────────────────────

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find((i) => i.listing.id === action.listing.id)
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.listing.id === action.listing.id ? { ...i, qty: i.qty + action.qty } : i
          ),
        }
      }
      return { ...state, items: [...state.items, { listing: action.listing, qty: action.qty }] }
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((i) => i.listing.id !== action.listingId) }
    case 'UPDATE_QTY':
      return {
        ...state,
        items: state.items.map((i) =>
          i.listing.id === action.listingId ? { ...i, qty: action.qty } : i
        ),
      }
    case 'CLEAR_CART':
      return { ...state, items: [] }
    case 'TOGGLE_DRAWER':
      return { ...state, isDrawerOpen: !state.isDrawerOpen }
    default:
      return state
  }
}

// ─── Context ─────────────────────────────────────────────────

interface CartContextValue {
  state: CartState
  addItem: (listing: MarketplaceListing, qty: number) => void
  removeItem: (listingId: string) => void
  updateQty: (listingId: string, qty: number) => void
  clearCart: () => void
  toggleDrawer: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isDrawerOpen: false })

  const value: CartContextValue = {
    state,
    addItem: (listing, qty) => dispatch({ type: 'ADD_ITEM', listing, qty }),
    removeItem: (listingId) => dispatch({ type: 'REMOVE_ITEM', listingId }),
    updateQty: (listingId, qty) => dispatch({ type: 'UPDATE_QTY', listingId, qty }),
    clearCart: () => dispatch({ type: 'CLEAR_CART' }),
    toggleDrawer: () => dispatch({ type: 'TOGGLE_DRAWER' }),
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

// ─── CartDrawer ──────────────────────────────────────────────

export function CartDrawer() {
  const { state, removeItem, updateQty, clearCart, toggleDrawer } = useCart()
  const { subtotal, totalUnits, feeRate, fee, shipping, total } = calculateFees(state.items)

  if (!state.isDrawerOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-waxe-text/60" onClick={toggleDrawer} />
      <div className="absolute right-0 top-0 h-full w-96 max-w-full bg-waxe-card border-l-2 border-waxe-border flex flex-col">
        {/* Header */}
        <div className="shrink-0 p-5 border-b-2 border-waxe-border flex items-center justify-between">
          <div>
            <h2 className="text-sm font-black uppercase tracking-[0.15em] text-waxe-text">Your Cart</h2>
            <p className="text-[11px] text-waxe-text-muted mt-0.5">{state.items.length} item{state.items.length !== 1 ? 's' : ''} &middot; {totalUnits} unit{totalUnits !== 1 ? 's' : ''}</p>
          </div>
          <button onClick={toggleDrawer} className="text-waxe-text-muted hover:text-waxe-text text-lg font-black">✕</button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {state.items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-waxe-text-muted">Cart is empty</p>
              <p className="text-[11px] text-waxe-text-muted mt-1">Add items from the marketplace</p>
            </div>
          ) : (
            state.items.map((item) => (
              <div key={item.listing.id} className="border-2 border-waxe-border p-3">
                <div className="flex gap-3">
                  <div
                    className="w-10 h-10 shrink-0 border border-waxe-border flex items-center justify-center overflow-hidden"
                    style={{ backgroundColor: item.listing.photoColor || '#3D3050' }}
                  >
                    {item.listing.artworkUrl ? (
                      <img src={item.listing.artworkUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[9px] font-black text-white/30">LP</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-waxe-text truncate">{item.listing.title}</p>
                    <p className="text-[11px] font-bold text-waxe-text-muted truncate">{item.listing.artist}</p>
                    <p className="text-[10px] text-waxe-text-muted mt-0.5">
                      {item.listing.seller.name} &middot;
                      <span className="uppercase"> {item.listing.sellerType}</span>
                    </p>
                  </div>
                  <button onClick={() => removeItem(item.listing.id)} className="text-waxe-text-muted hover:text-waxe-negative text-xs font-black shrink-0">✕</button>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-waxe-border/30">
                  <div className="flex items-center gap-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-waxe-text-muted">Qty</label>
                    <input
                      type="number"
                      min={item.listing.minOrderQty}
                      max={item.listing.availableQty || undefined}
                      value={item.qty}
                      onChange={(e) => updateQty(item.listing.id, Math.max(item.listing.minOrderQty, parseInt(e.target.value) || item.listing.minOrderQty))}
                      className="w-16 px-2 py-1 text-sm bg-waxe-deep border-2 border-waxe-border text-waxe-text rounded-none text-center font-mono"
                    />
                  </div>
                  <p className="text-sm font-black font-mono text-waxe-text">
                    ${(item.qty * item.listing.wholesalePrice).toFixed(2)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary */}
        {state.items.length > 0 && (
          <div className="shrink-0 border-t-2 border-waxe-border p-5">
            <div className="space-y-1.5 text-sm font-mono">
              <div className="flex justify-between text-waxe-text-secondary">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-waxe-text-secondary">
                <span>WAXED Fee ({Math.round(feeRate * 100)}%)</span>
                <span>${fee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-waxe-text-secondary">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="border-t-2 border-waxe-border pt-2 mt-2 flex justify-between text-waxe-text font-black">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              {totalUnits >= 75 && (
                <p className="text-[10px] text-waxe-positive font-bold uppercase tracking-wider mt-1">
                  &gt;&gt; Volume discount: 3% fee (saved {Math.round((0.08 - 0.03) * subtotal * 100) / 100})
                </p>
              )}
            </div>
            <button
              onClick={() => alert('Checkout is a demo — this would submit your wholesale order to WAXED for processing.')}
              className="btn-primary w-full mt-4 text-sm py-3"
            >
              Checkout
            </button>
            <div className="flex gap-2 mt-2">
              <button onClick={toggleDrawer} className="btn-ghost flex-1 text-[11px] py-2">Continue Shopping</button>
              <button onClick={clearCart} className="btn-ghost flex-1 text-[11px] py-2 text-waxe-negative">Clear Cart</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── CartIndicator ───────────────────────────────────────────

export function CartIndicator() {
  const { state, toggleDrawer } = useCart()
  const { total } = calculateFees(state.items)

  if (state.items.length === 0) return null

  return (
    <button
      onClick={toggleDrawer}
      className="fixed bottom-6 right-6 z-40 bg-waxe-text text-waxe-deep px-5 py-3 rounded-none border-2 border-waxe-text font-mono text-sm font-black uppercase tracking-[0.1em] cursor-pointer hover:bg-waxe-warm hover:text-waxe-text hover:border-waxe-warm transition-none"
      style={{ boxShadow: '2px 2px 0px var(--color-waxe-text-muted)' }}
    >
      ◆ {state.items.length} item{state.items.length !== 1 ? 's' : ''} &middot; ${total.toFixed(2)}
    </button>
  )
}
