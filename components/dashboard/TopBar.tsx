'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useIntelligence } from '@/lib/intelligence-context'
import { useTheme } from '@/lib/theme-context'

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: '\u25C8' },
  { href: '/dashboard/sales', label: 'Orders', icon: '\u25A6' },
  { href: '/dashboard/inventory', label: 'Inventory', icon: '\u25A4' },
  { href: '/dashboard/customers', label: 'Customers', icon: '\u25CE' },
  { href: '/dashboard/storefront', label: 'Storefront', icon: '\u25A3' },
  { href: '/dashboard/marketplace', label: 'Marketplace', icon: '\u25C6' },
  { href: '/dashboard/settings', label: 'Settings', icon: '\u2699' },
]

const searchableItems = [
  { label: 'Overview', href: '/dashboard', type: 'Page' },
  { label: 'Orders', href: '/dashboard/sales', type: 'Page' },
  { label: 'Inventory', href: '/dashboard/inventory', type: 'Page' },
  { label: 'Customers', href: '/dashboard/customers', type: 'Page' },
  { label: 'Storefront', href: '/dashboard/storefront', type: 'Page' },
  { label: 'Marketplace', href: '/dashboard/marketplace', type: 'Page' },
  { label: 'Messages', href: '/dashboard/messages', type: 'Page' },
  { label: 'Settings', href: '/dashboard/settings', type: 'Page' },
  { label: 'Create Draft Order', href: '/dashboard/sales', type: 'Action' },
  { label: 'Trade-In Intake', href: '/dashboard/inventory', type: 'Action' },
  { label: 'Issue Store Credit', href: '/dashboard/inventory', type: 'Action' },
  { label: 'Broadcast Message', href: '/dashboard/messages', type: 'Action' },
  { label: 'Mobile POS', href: '/dashboard/sales', type: 'Feature' },
  { label: 'Analytics & Reports', href: '/dashboard', type: 'Feature' },
  { label: 'Date Range Selector', href: '/dashboard', type: 'Feature' },
  { label: 'Print Queue', href: '/dashboard/sales', type: 'Feature' },
]

export default function TopBar() {
  const pathname = usePathname()
  const { toggle: toggleIntel } = useIntelligence()
  const { theme, toggleTheme } = useTheme()
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [accountOpen, setAccountOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const accountRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false)
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) setAccountOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Cmd+K to open search
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
        setTimeout(() => searchInputRef.current?.focus(), 50)
      }
      if (e.key === 'Escape') {
        setSearchOpen(false)
        setSearchQuery('')
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [])

  const filteredSearch = searchQuery.trim()
    ? searchableItems.filter(item =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : searchableItems.slice(0, 6)

  return (
    <div className="topbar shrink-0 flex items-center h-12 px-4 relative z-[5]">
      {/* Logo — home button */}
      <Link href="/dashboard" className="topbar-logo shrink-0 flex items-center gap-2.5 mr-6">
        <img
          src="/waxed-logo.svg"
          alt="WAXED"
          className="w-7 h-7"
          style={{ filter: 'var(--color-boot-logo-filter)' }}
        />
      </Link>

      {/* Nav items — center area */}
      <nav className="flex items-center gap-0.5 flex-1 min-w-0">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`topbar-nav-item ${isActive(item.href) ? 'topbar-nav-active' : ''}`}
          >
            <span className="text-[11px] opacity-60">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}

        {/* Search — after Settings, same nav style but wider morph */}
        <div ref={searchRef} className="relative ml-0.5">
          <div
            className={`topbar-nav-item topbar-search-icon-morph ${searchOpen ? 'topbar-nav-active' : ''}`}
            style={{ width: searchOpen ? '260px' : '90px' }}
            onClick={() => {
              if (!searchOpen) {
                setSearchOpen(true)
                setTimeout(() => searchInputRef.current?.focus(), 80)
              }
            }}
          >
            <svg
              width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"
              className="shrink-0 opacity-60"
            >
              <circle cx="7" cy="7" r="4.5" />
              <path d="M10.5 10.5L14 14" strokeLinecap="round" />
            </svg>
            {!searchOpen && <span>Search</span>}
            {searchOpen && (
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search pages, features, products..."
                className="bg-transparent text-[12px] text-waxe-text outline-none placeholder:text-waxe-text-muted flex-1 ml-1"
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </div>

          {searchOpen && searchQuery.trim() && (
            <div className="absolute left-0 top-full mt-1 w-80 bg-waxe-card border border-waxe-border shadow-xl z-50 overflow-hidden" style={{ borderRadius: 'var(--radius-md)' }}>
              <div className="max-h-64 overflow-y-auto py-1">
                {filteredSearch.map((item, i) => (
                  <Link
                    key={i}
                    href={item.href}
                    onClick={() => { setSearchOpen(false); setSearchQuery('') }}
                    className="flex items-center justify-between px-3 py-2 hover:bg-waxe-surface/50 transition-colors"
                  >
                    <span className="text-sm text-waxe-text">{item.label}</span>
                    <span className="text-[10px] text-waxe-text-muted font-mono">{item.type}</span>
                  </Link>
                ))}
                {filteredSearch.length === 0 && (
                  <p className="px-3 py-4 text-sm text-waxe-text-muted text-center">No results</p>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Right section — assistant, theme, account */}
      <div className="flex items-center gap-1 shrink-0">

        {/* Assistant */}
        <button onClick={toggleIntel} className="topbar-icon-btn" title="Assistant">
          <span className="text-[15px]">{'\u{1F916}'}</span>
        </button>

        {/* Theme toggle */}
        <button onClick={toggleTheme} className="topbar-icon-btn" title={`Theme: ${theme}`}>
          <span className="text-[14px]">
            {theme === 'light' ? '\u2600' : theme === 'dark' ? '\u263D' : '\u2726'}
          </span>
        </button>

        {/* Divider */}
        <span className="w-px h-5 bg-waxe-border/40 mx-1" />

        {/* Account */}
        <div ref={accountRef} className="relative">
          <button
            onClick={() => setAccountOpen(!accountOpen)}
            className="topbar-account-btn flex items-center gap-2 px-2.5 py-1.5 hover:bg-waxe-surface/50 transition-colors"
            style={{ borderRadius: 'var(--radius-md)' }}
          >
            <div className="w-6 h-6 bg-waxe-warm flex items-center justify-center text-[10px] font-bold text-white" style={{ borderRadius: 'var(--radius-sm, 3px)' }}>
              WG
            </div>
            <span className="text-[11px] font-semibold text-waxe-text hidden sm:block">Wax & Groove</span>
          </button>

          {accountOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-waxe-card border border-waxe-border shadow-xl z-50 overflow-hidden" style={{ borderRadius: 'var(--radius-md)' }}>
              <div className="px-3 py-3 border-b border-waxe-border">
                <p className="text-sm font-semibold text-waxe-text">Wax & Groove</p>
                <p className="text-[11px] text-waxe-text-muted">Enterprise V3.1</p>
              </div>
              <div className="py-1">
                <Link href="/dashboard/settings" onClick={() => setAccountOpen(false)} className="block px-3 py-2 text-sm text-waxe-text hover:bg-waxe-surface/50 transition-colors">
                  Account Settings
                </Link>
                <button className="w-full text-left px-3 py-2 text-sm text-waxe-text hover:bg-waxe-surface/50 transition-colors">
                  Switch Store
                </button>
                <div className="border-t border-waxe-border my-1" />
                <button className="w-full text-left px-3 py-2 text-sm text-waxe-negative hover:bg-waxe-surface/50 transition-colors">
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
