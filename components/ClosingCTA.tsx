'use client'

interface ClosingCTAProps {
  onOpenModal: () => void
}

export default function ClosingCTA({ onOpenModal }: ClosingCTAProps) {
  return (
    <section className="py-20 sm:py-28">
      <div className="section-container">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-waxe-text mb-4">
            Join thousands of dealers already selling on WAXE
          </h2>
          <p className="text-waxe-text-secondary mb-8">
            Free tier available. No credit card required.
          </p>
          <button onClick={onOpenModal} className="btn-primary text-base">
            Get Started Free
          </button>
        </div>
      </div>
    </section>
  )
}
