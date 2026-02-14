import { Sidebar } from '@/components/dashboard'
import { CartProvider, CartDrawer, CartIndicator } from '@/lib/cart-context'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <div className="flex h-screen overflow-hidden bg-waxe-deep text-[13px]">
        <Sidebar />
        <main className="flex-1 min-w-0 flex flex-col overflow-hidden p-5 lg:p-6" style={{ zoom: 0.75 }}>
          {children}
        </main>
        <CartDrawer />
        <CartIndicator />
      </div>
    </CartProvider>
  )
}
