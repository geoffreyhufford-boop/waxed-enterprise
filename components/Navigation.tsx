'use client'

import { useState } from 'react'

interface NavigationProps {
  onOpenModal: () => void
}

export default function Navigation({ onOpenModal }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { href: '#product', label: 'Product' },
    { href: '#onboarding', label: 'Onboarding' },
    { href: '#analytics', label: 'Analytics' },
    { href: '#trust', label: 'Trust' },
    { href: '#faq', label: 'FAQ' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-waxed-black/95 backdrop-blur-sm border-b border-waxed-border">
      <div className="section-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#" className="text-lg font-semibold tracking-tight text-waxed-olive">
            WAXED
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-waxed-text-secondary hover:text-waxed-text transition-colors"
              >
                {link.label}
              </a>
            ))}
            <button onClick={onOpenModal} className="btn-primary">
              Request Early Access
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-waxed-text-secondary hover:text-waxed-text transition-colors"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-waxed-border">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm text-waxed-text-secondary hover:text-waxed-text transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  onOpenModal()
                }}
                className="btn-primary mt-2"
              >
                Request Early Access
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
