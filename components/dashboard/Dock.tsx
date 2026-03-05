'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useIntelligence } from '@/lib/intelligence-context'
import { useTheme } from '@/lib/theme-context'

const dockApps = [
 { href: '/dashboard', label: 'Overview', icon: '\u25C8', color: '#E87B35' },
 { href: '/dashboard/sales', label: 'Orders', icon: '\u25A6', color: '#E87B35' },
 { href: '/dashboard/inventory', label: 'Inventory', icon: '\u25A4', color: '#7B6FA0' },
 { href: '/dashboard/customers', label: 'Customers', icon: '\u25CE', color: '#22C55E' },
 { href: '/dashboard/storefront', label: 'Storefront', icon: '\u25A3', color: '#8A7EB0' },
 { href: '/dashboard/marketplace', label: 'Marketplace', icon: '\u25C6', color: '#E87B35' },
 { href: '/dashboard/messages', label: 'Messages', icon: '\u25C7', color: '#22C55E' },
 { href: null, label: 'Assistant', icon: '\u{1F916}', color: '#7B6FA0' },
 { href: '/dashboard/settings', label: 'Settings', icon: '\u2699', color: '#A89E90' },
]

export default function Dock() {
 const pathname = usePathname()
 const { toggle: toggleIntel } = useIntelligence()
 const { theme, toggleTheme } = useTheme()

 const isActive = (href: string | null) => {
  if (!href) return false
  if (href === '/dashboard') return pathname === '/dashboard'
  return pathname.startsWith(href)
 }

 return (
  <div className="absolute bottom-3 left-0 right-0 z-10 flex justify-center pointer-events-none">
   <div className="launchpad-dock pointer-events-auto bg-waxe-deep/80 backdrop-blur-xl border border-waxe-border/30 flex items-center gap-0.5 px-3 shadow-lg">
    {dockApps.map((app, i) => {
     const active = isActive(app.href)
     const inner = (
      <div className="group flex flex-col items-center text-center px-3 py-1.5 relative">
       <div className={`launchpad-icon w-[44px] h-[44px] flex items-center justify-center bg-waxe-deep transition-all duration-200 group-hover:-translate-y-1 group-hover:scale-110 ${active ? 'scale-105' : ''}`}>
        <span className="text-[18px]" style={{ color: active ? app.color : undefined, opacity: active ? 1 : 0.55 }}>{app.icon}</span>
       </div>
       <span className={`text-[9px] font-medium mt-0.5 transition-colors ${active ? 'text-waxe-text' : 'text-waxe-text-muted'}`}>{app.label}</span>
       {active && <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full" style={{ backgroundColor: app.color }} />}
      </div>
     )

     return (
      <span key={app.label} className="flex items-center">
       {i === 4 && <span className="w-px h-7 bg-waxe-border/30 mx-1 shrink-0" />}
       {app.href ? <Link href={app.href}>{inner}</Link> : <button onClick={toggleIntel}>{inner}</button>}
      </span>
     )
    })}

    <span className="w-px h-7 bg-waxe-border/30 mx-2 shrink-0" />
    <button
     onClick={toggleTheme}
     className="group flex flex-col items-center text-center px-3 py-1.5"
     title={`Theme: ${theme}`}
    >
     <div className="launchpad-icon w-[44px] h-[44px] flex items-center justify-center bg-waxe-deep transition-all duration-200 group-hover:-translate-y-1 group-hover:scale-110">
      <span className="text-[18px] opacity-55">{theme === 'light' ? '\u2600' : theme === 'dark' ? '\u263D' : '\u2726'}</span>
     </div>
     <span className="text-[9px] font-medium text-waxe-text-muted mt-0.5">{theme === 'light' ? 'Ivory' : theme === 'dark' ? 'Dark' : 'Magi'}</span>
    </button>
   </div>
  </div>
 )
}
