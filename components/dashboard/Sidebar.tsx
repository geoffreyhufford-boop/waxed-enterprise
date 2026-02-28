'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from '@/lib/theme-context'

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: '★' },
  { href: '/dashboard/orders', label: 'Sales Orders', icon: '▦' },
  { href: '/dashboard/inventory', label: 'Inventory', icon: '▤' },
  { href: '/dashboard/pos', label: 'POS', icon: '◉' },
  { href: '/dashboard/customers', label: 'Customers', icon: '◎' },
  { href: '/dashboard/analytics', label: 'Analytics', icon: '◈' },
  { href: '/dashboard/storefront', label: 'Storefront', icon: '◫' },
  { href: '/dashboard/marketplace', label: 'Marketplace', icon: '◆' },
  { href: '/dashboard/messages', label: 'Messages', icon: '◻' },
  { href: '/dashboard/settings', label: 'Settings', icon: '⚙' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  const nav = (
    <nav className="flex flex-col h-full">
      <div className="px-4 pt-6 pb-4">
        <Link href="/" className="block">
          <img src="/waxed-logo.svg" alt="WAXED" className="w-8 h-8" style={{ filter: 'var(--color-boot-logo-filter)' }} />
          <span className="block text-[10px] font-medium text-waxe-text-muted mt-1.5">waxed dealer portal</span>
        </Link>
      </div>
      <div className="hatch-divider" />
      <div className="flex-1 py-2 px-2 flex flex-col">
        <div className="space-y-0.5 mt-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={isActive(item.href) ? 'nav-item-active' : 'nav-item'}
            >
              <span className="glyph-box">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
      <div className="p-4">
        <p className="designation-tag mb-1.5">Wax & Groove</p>
        <div className="flex items-center gap-2">
          {/* Theme toggle switch */}
          <button
            onClick={toggleTheme}
            className="relative flex items-center cursor-pointer rounded-full border border-waxe-border overflow-hidden transition-colors"
            style={{ fontFamily: 'var(--font-mono)', height: 26 }}
            aria-label={`Switch theme (current: ${theme})`}
          >
            {([['dark', 'morph'], ['light', 'light'], ['retro', 'retro']] as const).map(([mode, label]) => (
              <span
                key={mode}
                className="text-[9px] font-medium px-2.5 flex items-center h-full transition-colors"
                style={{
                  color: theme === mode ? 'var(--color-waxe-deep)' : 'var(--color-waxe-text-muted)',
                  background: theme === mode ? 'var(--color-waxe-text)' : 'transparent',
                }}
              >
                {label}
              </span>
            ))}
          </button>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <div className="badge-compound">
            <span className="badge-compound-label">ENT</span>
            <span className="badge-compound-code">V3.0</span>
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
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-waxe-card border border-waxe-border clip-stat"
        aria-label="Open menu"
      >
        <span className="text-waxe-text text-lg">///</span>
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-waxe-text/60" onClick={() => setMobileOpen(false)} />
          <div className="relative w-60 h-full bg-waxe-sidebar border-r border-waxe-border">
            {nav}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-52 shrink-0 h-screen sticky top-0 bg-waxe-sidebar border-r border-waxe-border">
        {nav}
      </aside>
    </>
  )
}
