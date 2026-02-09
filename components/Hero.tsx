'use client'

interface HeroProps {
  onOpenModal: () => void
}

export default function Hero({ onOpenModal }: HeroProps) {
  return (
    <section className="pt-32 pb-20 sm:pt-44 sm:pb-28">
      <div className="section-container">
        <div className="max-w-3xl text-center mx-auto">
          <p className="text-sm font-medium text-waxe-warm uppercase tracking-wider mb-4">
            Dealer Portal
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.08] mb-6 text-waxe-text">
            Power Your Record Store
          </h1>
          <p className="text-xl sm:text-2xl text-waxe-text-secondary leading-relaxed mb-4">
            The professional dashboard for vinyl dealers.
          </p>
          <p className="text-base text-waxe-text-muted mb-10 max-w-xl mx-auto">
            Manage inventory, track sales, and grow your business on the WAXE marketplace.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#pricing" className="btn-primary text-base">
              View Pricing
            </a>
            <button onClick={onOpenModal} className="btn-secondary text-base">
              Request Early Access
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
