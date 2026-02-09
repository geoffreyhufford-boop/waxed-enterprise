'use client'

interface PricingProps {
  onOpenModal: () => void
}

export default function Pricing({ onOpenModal }: PricingProps) {
  const plans = [
    {
      name: 'Free',
      target: 'Getting started',
      price: '$0',
      period: '/mo',
      features: [
        'Up to 500 listings',
        'Basic storefront',
        'Community support',
      ],
    },
    {
      name: 'Pro',
      target: 'Growing stores',
      price: '$29',
      period: '/mo',
      features: [
        'Unlimited listings',
        'Full analytics',
        'Priority support',
      ],
      highlighted: true,
    },
    {
      name: 'Enterprise',
      target: 'Multi-location',
      price: 'Custom',
      period: '',
      features: [
        'Multiple storefronts',
        'Dedicated support',
        'Custom integrations',
      ],
      cta: 'Contact Us',
    },
  ]

  return (
    <section id="pricing" className="py-16 sm:py-24">
      <div className="section-container">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-waxe-warm uppercase tracking-wider mb-3">
            Pricing
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-waxe-text">
            Start free. Scale when ready.
          </h2>
          <p className="text-waxe-text-secondary mt-4 max-w-lg mx-auto">
            No credit card required. Upgrade anytime as your store grows.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`card ${
                plan.highlighted ? 'border-waxe-warm/40 bg-waxe-surface/80' : ''
              }`}
            >
              <div className="mb-6">
                <p className="text-xs font-medium text-waxe-text-muted uppercase tracking-wider">
                  {plan.target}
                </p>
                <h3 className="text-xl font-semibold mt-1 text-waxe-text">{plan.name}</h3>
              </div>

              <div className="mb-6">
                <span className="text-3xl font-semibold text-waxe-text">{plan.price}</span>
                {plan.period && (
                  <span className="text-waxe-text-secondary">{plan.period}</span>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <svg
                      className="w-4 h-4 text-waxe-warm mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-waxe-text-secondary">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={onOpenModal}
                className={plan.highlighted ? 'btn-primary w-full' : 'btn-secondary w-full'}
              >
                {plan.cta || 'Get Started'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
