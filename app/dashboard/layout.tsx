'use client'

import { useState, useCallback } from 'react'
import { BootScreen, GradientBackdrop, IntelligenceOverlay, TopBar } from '@/components/dashboard'
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
      <TopBar />
      {/* Main content */}
      <div className="relative flex-1 min-w-0 flex flex-col overflow-hidden">
       <GradientBackdrop />
       <IntelligenceOverlay />
       <main className="relative z-[1] flex-1 min-w-0 flex flex-col overflow-hidden px-5 lg:px-6 pt-4">
        {children}
       </main>
      </div>
     </div>
     <CartDrawer />
     <CartIndicator />
    </IntelligenceProvider>
   </CartProvider>
  </ThemeProvider>
 )
}
