'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from '@/lib/theme-context'

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: '★' },
  { href: '/dashboard/orders', label: 'Orders', icon: '▦' },
  { href: '/dashboard/inventory', label: 'Inventory', icon: '▤' },
  { href: '/dashboard/marketplace', label: 'Marketplace', icon: '◆' },
  { href: '/dashboard/analytics', label: 'Analytics', icon: '◈' },
  { href: '/dashboard/pos', label: 'POS', icon: '◉' },
  { href: '/dashboard/messages', label: 'Messages', icon: '◻' },
  { href: '/dashboard/storefront', label: 'Storefront', icon: '◫' },
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
      <div className="px-4 pt-6 pb-4 hatch-bg">
        <Link href="/" className="block">
          <img src="/waxed-logo.svg" alt="WAXED" className="w-8 h-8" style={{ filter: 'var(--color-boot-logo-filter)' }} />
          <span className="block text-[10px] font-bold uppercase tracking-[0.15em] text-waxe-text-muted mt-1.5">{'>> '}Waxed Dealer Portal</span>
        </Link>
      </div>
      <div className="hatch-divider-strong" />
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
      <div className="p-4 scanline relative">
        <div className="relative z-10">
          <p className="designation-tag mb-1.5">Wax & Groove</p>
          <div className="flex items-center gap-2">
            {/* Theme toggle switch */}
            <button
              onClick={toggleTheme}
              className="relative flex items-center cursor-pointer"
              style={{ fontFamily: 'var(--font-mono)', height: 28 }}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {/* LIGHT label */}
              <span
                className="text-[8px] font-black uppercase tracking-[0.12em] px-2 flex items-center h-full border-2 border-r-0"
                style={{
                  borderColor: 'var(--color-waxe-border)',
                  color: theme === 'light' ? 'var(--color-waxe-deep)' : 'var(--color-waxe-text-muted)',
                  background: theme === 'light' ? 'var(--color-waxe-text)' : 'transparent',
                }}
              >
                Light
              </span>
              {/* Circle knob */}
              <span
                className="relative flex items-center justify-center shrink-0"
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  border: '2px solid var(--color-waxe-border)',
                  background: 'var(--color-waxe-surface)',
                  zIndex: 2,
                  marginLeft: -1,
                  marginRight: -1,
                }}
              >
                <span className="text-[10px]" style={{ color: 'var(--color-waxe-text)' }}>
                  {theme === 'dark' ? '◑' : '◐'}
                </span>
              </span>
              {/* DARK label */}
              <span
                className="text-[8px] font-black uppercase tracking-[0.12em] px-2 flex items-center h-full border-2 border-l-0"
                style={{
                  borderColor: 'var(--color-waxe-border)',
                  color: theme === 'dark' ? 'var(--color-waxe-deep)' : 'var(--color-waxe-text-muted)',
                  background: theme === 'dark' ? 'var(--color-waxe-text)' : 'transparent',
                }}
              >
                Dark
              </span>
            </button>
            <span className="hatch-inline flex-1" style={{ width: 'auto' }} />
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            <div className="badge-compound">
              <span className="badge-compound-label">ENT</span>
              <span className="badge-compound-code">V1.0</span>
            </div>
            <span className="hatch-inline-lg hatch-inline-strong" />
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
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-none bg-waxe-card border-2 border-waxe-border clip-stat"
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
