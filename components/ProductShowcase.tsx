'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

interface ScreenshotProps {
  src: string
  alt: string
  url: string
  delay?: number
}

function Screenshot({ src, alt, url, delay = 0 }: ScreenshotProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1, rootMargin: '50px' }
    )
    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="bg-waxed-card border border-waxed-border rounded-xl overflow-hidden shadow-2xl shadow-black/40 hover:shadow-black/60 hover:border-waxed-muted transition-all duration-300">
        {/* Browser chrome */}
        <div className="flex items-center gap-2 px-4 py-3 bg-waxed-dark border-b border-waxed-border">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-waxed-border" />
            <div className="w-2.5 h-2.5 rounded-full bg-waxed-border" />
            <div className="w-2.5 h-2.5 rounded-full bg-waxed-border" />
          </div>
          <div className="flex-1 mx-4">
            <div className="bg-waxed-card rounded px-3 py-1 text-xs text-waxed-text-muted text-center max-w-xs mx-auto truncate">
              {url}
            </div>
          </div>
        </div>
        {/* Screenshot */}
        <div className="relative aspect-[16/10] bg-waxed-black">
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover object-top"
          />
        </div>
      </div>
    </div>
  )
}

export default function ProductShowcase() {
  return (
    <section className="py-24 sm:py-32 overflow-hidden">
      <div className="section-container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-medium text-waxed-text-muted uppercase tracking-wide mb-3">
            The Platform
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-waxed-text">
            A single dashboard for inventory, orders, and performance.
          </h2>
          <p className="text-waxed-text-secondary mt-4">
            Inventory, analytics, integrations—all in one dark-mode dashboard built for record stores.
          </p>
        </div>

        {/* Screenshot grid */}
        <div className="relative max-w-6xl mx-auto">
          {/* Background glow */}
          <div
            className="absolute inset-0 blur-3xl opacity-15 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(163, 160, 108, 0.5) 0%, transparent 60%)',
            }}
          />

          {/* Main inventory screenshot - center, largest */}
          <div className="relative z-10 max-w-4xl mx-auto">
            <Screenshot
              src="/demo-inventory.jpg"
              alt="Waxed inventory dashboard showing record listings with conditions, prices, and status"
              url="app.waxed.io/inventory"
            />
            <div className="text-center mt-6">
              <p className="text-sm font-medium text-waxed-text">Inventory Management</p>
              <p className="text-xs text-waxed-text-muted mt-1">Your entire catalog with conditions, variants, and real-time stock</p>
            </div>
          </div>

          {/* Two smaller screenshots below */}
          <div className="grid md:grid-cols-2 gap-8 mt-12 relative z-10">
            {/* Overview/Settings */}
            <div>
              <Screenshot
                src="/demo-overview.jpg"
                alt="Waxed overview showing pricing plans and connected services like Discogs, Stripe, and Shippo"
                url="app.waxed.io/overview"
                delay={100}
              />
              <div className="text-center mt-6">
                <p className="text-sm font-medium text-waxed-text">Connected Services</p>
                <p className="text-xs text-waxed-text-muted mt-1">Import from anywhere, Stripe payments, Shippo labels—one click</p>
              </div>
            </div>

            {/* Analytics */}
            <div>
              <Screenshot
                src="/demo-analytics.jpg"
                alt="Waxed analytics showing revenue, sales by genre, and performance metrics"
                url="app.waxed.io/analytics"
                delay={200}
              />
              <div className="text-center mt-6">
                <p className="text-sm font-medium text-waxed-text">Store Analytics</p>
                <p className="text-xs text-waxed-text-muted mt-1">Genre velocity, avg order value, what&apos;s actually selling</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
