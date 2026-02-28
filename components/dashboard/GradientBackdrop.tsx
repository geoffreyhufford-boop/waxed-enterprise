'use client'

import { usePathname } from 'next/navigation'

/**
 * Neutone-inspired gradient bleed that flows from the sidebar edge
 * into the content area. Each dashboard page gets a unique gradient
 * derived from the WAXED color palette.
 */

const gradients: Record<string, string> = {
  // Overview — warm salmon/peach flowing down-left with a bottom hotspot (like ref image 1)
  '/dashboard': `
    radial-gradient(circle at 5% 85%, rgba(232, 131, 124, 0.9) 0%, transparent 45%),
    radial-gradient(ellipse 120% 80% at 0% 40%, rgba(244, 162, 97, 0.65) 0%, transparent 60%),
    radial-gradient(circle at 25% 100%, rgba(210, 140, 110, 0.5) 0%, transparent 40%),
    linear-gradient(160deg, transparent 20%, rgba(232, 131, 124, 0.15) 60%, rgba(244, 162, 97, 0.3) 100%)
  `,

  // Orders — lavender arc sweeping from top-left corner (dramatic curve like ref image 3)
  '/dashboard/orders': `
    radial-gradient(circle at -10% -10%, rgba(45, 37, 64, 0.8) 0%, rgba(123, 111, 160, 0.4) 35%, transparent 55%),
    radial-gradient(ellipse 90% 70% at 15% 30%, rgba(139, 92, 246, 0.35) 0%, transparent 60%),
    radial-gradient(circle at 20% 50%, rgba(200, 160, 220, 0.25) 0%, transparent 40%),
    linear-gradient(135deg, rgba(123, 111, 160, 0.3) 0%, transparent 50%)
  `,

  // Inventory — amber bloom from center-bottom radiating up (like ref image 2)
  '/dashboard/inventory': `
    radial-gradient(ellipse 100% 70% at 30% 100%, rgba(234, 179, 8, 0.85) 0%, transparent 60%),
    radial-gradient(circle at 20% 70%, rgba(244, 162, 97, 0.5) 0%, transparent 50%),
    radial-gradient(ellipse 80% 50% at 50% 80%, rgba(234, 210, 80, 0.35) 0%, transparent 55%),
    linear-gradient(0deg, rgba(234, 179, 8, 0.25) 0%, transparent 60%)
  `,

  // Marketplace — green glow anchored bottom-left, arcing upward
  '/dashboard/marketplace': `
    radial-gradient(circle at 0% 100%, rgba(34, 197, 94, 0.75) 0%, transparent 50%),
    radial-gradient(ellipse 70% 90% at 10% 60%, rgba(74, 154, 98, 0.4) 0%, transparent 55%),
    radial-gradient(circle at 30% 90%, rgba(34, 197, 94, 0.2) 0%, transparent 35%),
    linear-gradient(200deg, transparent 40%, rgba(34, 197, 94, 0.15) 100%)
  `,

  // Analytics — deep purple/magenta diagonal sweep from top-right to bottom-left
  '/dashboard/analytics': `
    radial-gradient(ellipse 80% 60% at 40% 10%, rgba(139, 92, 246, 0.6) 0%, transparent 55%),
    radial-gradient(circle at 10% 60%, rgba(200, 80, 140, 0.45) 0%, transparent 45%),
    radial-gradient(circle at 0% 90%, rgba(45, 37, 64, 0.7) 0%, transparent 40%),
    linear-gradient(145deg, rgba(139, 92, 246, 0.2) 0%, transparent 40%, rgba(200, 80, 140, 0.15) 100%)
  `,

  // POS — orange vertical flow intensifying at bottom (like ref image 1 but warmer)
  '/dashboard/pos': `
    radial-gradient(ellipse 110% 60% at 15% 90%, rgba(249, 115, 22, 0.85) 0%, transparent 55%),
    radial-gradient(circle at 0% 50%, rgba(244, 162, 97, 0.5) 0%, transparent 45%),
    radial-gradient(ellipse 60% 40% at 5% 20%, rgba(234, 179, 8, 0.3) 0%, transparent 50%),
    linear-gradient(170deg, transparent 30%, rgba(249, 115, 22, 0.2) 100%)
  `,

  // Messages — soft lavender center bloom fading outward (like ref image 2 but cooler)
  '/dashboard/messages': `
    radial-gradient(ellipse 90% 80% at 25% 50%, rgba(160, 150, 200, 0.55) 0%, transparent 60%),
    radial-gradient(circle at 0% 30%, rgba(123, 111, 160, 0.4) 0%, transparent 40%),
    radial-gradient(circle at 15% 80%, rgba(180, 170, 210, 0.3) 0%, transparent 35%),
    linear-gradient(180deg, rgba(160, 150, 200, 0.1) 0%, rgba(123, 111, 160, 0.15) 100%)
  `,

  // Customers — rose/pink curved sweep from right edge (dramatic arc like ref image 3)
  '/dashboard/customers': `
    radial-gradient(circle at 40% 40%, rgba(200, 80, 140, 0.5) 0%, transparent 45%),
    radial-gradient(ellipse 60% 100% at 0% 50%, rgba(100, 80, 90, 0.4) 0%, transparent 50%),
    radial-gradient(circle at 25% 60%, rgba(232, 131, 124, 0.35) 0%, transparent 40%),
    linear-gradient(120deg, rgba(100, 80, 90, 0.2) 0%, transparent 35%, rgba(232, 131, 124, 0.15) 100%)
  `,

  // Storefront — lime/green radiating from bottom-center upward (like ref image 2)
  '/dashboard/storefront': `
    radial-gradient(ellipse 90% 60% at 20% 100%, rgba(132, 204, 22, 0.7) 0%, transparent 55%),
    radial-gradient(circle at 5% 60%, rgba(34, 197, 94, 0.35) 0%, transparent 45%),
    radial-gradient(ellipse 70% 40% at 40% 80%, rgba(234, 179, 8, 0.25) 0%, transparent 50%),
    linear-gradient(10deg, rgba(132, 204, 22, 0.2) 0%, transparent 50%)
  `,

  // Settings — neutral grey with subtle curved shadow (muted version of ref image 3)
  '/dashboard/settings': `
    radial-gradient(circle at -5% 40%, rgba(90, 90, 86, 0.35) 0%, transparent 45%),
    radial-gradient(ellipse 80% 60% at 10% 80%, rgba(138, 138, 133, 0.2) 0%, transparent 50%),
    radial-gradient(circle at 20% 10%, rgba(160, 160, 154, 0.15) 0%, transparent 35%),
    linear-gradient(150deg, rgba(90, 90, 86, 0.1) 0%, transparent 60%)
  `,
}

export default function GradientBackdrop() {
  const pathname = usePathname()

  const bg = gradients[pathname]
    || Object.entries(gradients).find(([route]) =>
      route !== '/dashboard' && pathname.startsWith(route)
    )?.[1]
    || gradients['/dashboard']

  return (
    <div className="gradient-panel" aria-hidden="true">
      <div className="gradient-panel-fill" style={{ background: bg }} />
      <div className="gradient-panel-noise" />
    </div>
  )
}
