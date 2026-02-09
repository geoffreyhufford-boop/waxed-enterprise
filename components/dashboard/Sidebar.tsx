'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: '⌂' },
  { href: '/dashboard/inventory', label: 'Inventory', icon: '◉' },
  { href: '/dashboard/analytics', label: 'Analytics', icon: '◫' },
  { href: '/dashboard/pos', label: 'POS', icon: '▣' },
  { href: '/dashboard/messages', label: 'Messages', icon: '◬' },
]

const bottomNavItem = { href: '/dashboard/storefront', label: 'Storefront', icon: '◧' }

export default function Sidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  const nav = (
    <nav className="flex flex-col h-full">
      <div className="p-6 border-b border-waxe-border">
        <Link href="/" className="block">
          <span className="text-xl font-bold text-gradient">WAXE</span>
          <span className="block text-xs text-waxe-text-muted mt-0.5">Dealer Portal</span>
        </Link>
      </div>
      <div className="flex-1 py-4 px-3 flex flex-col">
        <div className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={isActive(item.href) ? 'nav-item-active' : 'nav-item'}
            >
              <span className="text-base w-6 text-center">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
        <div className="mt-auto pt-4 border-t border-waxe-border">
          <Link
            href={bottomNavItem.href}
            onClick={() => setMobileOpen(false)}
            className={isActive(bottomNavItem.href) ? 'nav-item-active' : 'nav-item'}
          >
            <span className="text-base w-6 text-center">{bottomNavItem.icon}</span>
            <span>{bottomNavItem.label}</span>
          </Link>
        </div>
      </div>
      <div className="p-4 border-t border-waxe-border">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-waxe-warm/20 flex items-center justify-center text-xs font-bold text-waxe-warm">
            WG
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-waxe-text truncate">Wax & Groove</p>
            <p className="text-xs text-waxe-text-muted">Enterprise Plan</p>
          </div>
        </div>
      </div>
    </nav>
  )

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-waxe-surface border border-waxe-border"
        aria-label="Open menu"
      >
        <span className="text-waxe-text text-lg">☰</span>
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div className="relative w-60 h-full bg-waxe-base border-r border-waxe-border">
            {nav}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-60 shrink-0 h-screen sticky top-0 bg-waxe-base border-r border-waxe-border">
        {nav}
      </aside>
    </>
  )
}
