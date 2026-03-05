'use client'

import { useState, useCallback } from 'react'
import { BootScreen, GradientBackdrop, IntelligenceOverlay, Dock } from '@/components/dashboard'
import { CartProvider, CartDrawer, CartIndicator } from '@/lib/cart-context'
import { ThemeProvider } from '@/lib/theme-context'
import { IntelligenceProvider } from '@/lib/intelligence-context'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
 const [booted, setBooted] = useState(false)
 const handleBootComplete = useCallback(() => setBooted(true), [])

 return (
  <ThemeProvider>
   <CartProvider>
    <IntelligenceProvider>
     {!booted && <BootScreen onComplete={handleBootComplete} />}
     <div className={`flex flex-col h-screen overflow-hidden bg-waxe-deep text-[13px] ${booted ? '' : 'invisible'}`}>
      {/* Top bar — logo */}
      <div className="shrink-0 flex items-center justify-center py-3 relative z-[2]">
       <a href="/dashboard">
        <img src="/waxed-logo.svg" alt="WAXED" className="w-7 h-7 opacity-40 hover:opacity-70 transition-opacity" style={{ filter: 'var(--color-boot-logo-filter)' }} />
       </a>
      </div>
      {/* Main content */}
      <div className="relative flex-1 min-w-0 flex flex-col overflow-hidden">
       <GradientBackdrop />
       <IntelligenceOverlay />
       <main className="relative z-[1] flex-1 min-w-0 flex flex-col overflow-hidden px-5 lg:px-6">
        {children}
       </main>
       {/* Dock overlays bottom of content */}
       <Dock />
      </div>
     </div>
     <CartDrawer />
     <CartIndicator />
    </IntelligenceProvider>
   </CartProvider>
  </ThemeProvider>
 )
}
