'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: '◧' },
  { href: '/dashboard/inventory', label: 'Inventory', icon: '▤' },
  { href: '/dashboard/analytics', label: 'Analytics', icon: '◈' },
  { href: '/dashboard/pos', label: 'POS', icon: '◉' },
  { href: '/dashboard/fulfillment', label: 'Fulfillment', icon: '▦' },
  { href: '/dashboard/messages', label: 'Messages', icon: '◻' },
]

const bottomNavItem = { href: '/dashboard/storefront', label: 'Storefront', icon: '◫' }

export default function Sidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  const nav = (
    <nav className="flex flex-col h-full">
      <div className="px-4 pt-6 pb-5 border-b-2 border-waxe-border">
        <Link href="/" className="block">
          <img src="/waxed-logo.svg" alt="WAXED" className="w-8 h-8" />
          <span className="block text-[8px] font-bold uppercase tracking-[0.15em] text-waxe-text-muted mt-1.5">{'>> '}Waxed Dealer Portal</span>
        </Link>
      </div>
      <div className="flex-1 py-3 px-2 flex flex-col">
        <div className="space-y-0.5">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={isActive(item.href) ? 'nav-item-active' : 'nav-item'}
            >
              <span className="text-sm w-5 text-center">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
        <div className="mt-auto pt-4 border-t-2 border-waxe-border">
          <Link
            href={bottomNavItem.href}
            onClick={() => setMobileOpen(false)}
            className={isActive(bottomNavItem.href) ? 'nav-item-active' : 'nav-item'}
          >
            <span className="text-sm w-5 text-center">{bottomNavItem.icon}</span>
            <span>{bottomNavItem.label}</span>
          </Link>
        </div>
      </div>
      <div className="p-4 border-t-2 border-waxe-border">
        <p className="text-[9px] font-black uppercase tracking-[0.1em] text-waxe-text">Wax & Groove</p>
        <p className="text-[8px] uppercase tracking-[0.15em] text-waxe-text-muted mt-0.5">Enterprise / V1.0</p>
      </div>
    </nav>
  )

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-none bg-waxe-card border-2 border-waxe-border"
        aria-label="Open menu"
      >
        <span className="text-waxe-text text-lg font-black">///</span>
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-waxe-text/60" onClick={() => setMobileOpen(false)} />
          <div className="relative w-60 h-full bg-waxe-card border-r-2 border-waxe-border">
            {nav}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-52 shrink-0 h-screen sticky top-0 bg-waxe-card border-r-2 border-waxe-border">
        {nav}
      </aside>
    </>
  )
}
