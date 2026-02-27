'use client'

import { useState, useCallback } from 'react'
import { Sidebar, BootScreen } from '@/components/dashboard'
import { CartProvider, CartDrawer, CartIndicator } from '@/lib/cart-context'
import { ThemeProvider } from '@/lib/theme-context'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [booted, setBooted] = useState(false)
  const handleBootComplete = useCallback(() => setBooted(true), [])

  return (
    <ThemeProvider>
      <CartProvider>
        {!booted && <BootScreen onComplete={handleBootComplete} />}
        <div className={`flex h-screen overflow-hidden bg-waxe-deep text-[13px] ${booted ? '' : 'invisible'}`}>
          <Sidebar />
          <main className="flex-1 min-w-0 flex flex-col overflow-hidden p-5 lg:p-6">
            {children}
          </main>
          <CartDrawer />
          <CartIndicator />
        </div>
      </CartProvider>
    </ThemeProvider>
  )
}
