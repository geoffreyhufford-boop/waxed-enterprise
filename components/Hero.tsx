'use client'

interface HeroProps {
  onOpenModal: () => void
}

export default function Hero({ onOpenModal }: HeroProps) {
  const stats = [
    { label: 'Active Stores', value: '127' },
    { label: 'Records Listed', value: '84K' },
    { label: 'Total Sales', value: '$2.1M' },
  ]

  return (
    <section className="pt-32 pb-16 sm:pt-40 sm:pb-20">
      <div className="section-container">
        <div className="max-w-3xl mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.1] mb-6 text-waxed-text">
            Turn your inventory into a storefront.
          </h1>
          <p className="text-lg sm:text-xl text-waxed-text-secondary leading-relaxed mb-8 max-w-2xl">
            Import Discogs. Scan new arrivals. Sell online and run ops in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={onOpenModal} className="btn-primary text-base px-6 py-3">
              Request Early Access
            </button>
            <a href="#onboarding" className="btn-secondary text-base px-6 py-3">
              See how onboarding works
            </a>
          </div>
        </div>

        {/* Stat cards like the app */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="stat-card">
              <p className="text-xs font-medium text-waxed-text-muted uppercase tracking-wide mb-1">
                {stat.label}
              </p>
              <p className="text-2xl font-semibold text-waxed-text">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
