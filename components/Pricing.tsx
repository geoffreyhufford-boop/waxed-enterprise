'use client'

interface PricingProps {
  onOpenModal: () => void
}

export default function Pricing({ onOpenModal }: PricingProps) {
  const plans = [
    {
      name: 'Starter',
      target: 'Small stores',
      price: '$49',
      period: '/mo',
      features: [
        'Up to 2,000 listings',
        'Basic analytics',
        'Email support',
      ],
    },
    {
      name: 'Pro',
      target: 'Busy stores',
      price: '$129',
      period: '/mo',
      features: [
        'Unlimited listings',
        'Full analytics suite',
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
        'Dedicated account manager',
        'Custom integrations',
      ],
      cta: 'Talk to us',
    },
  ]

  return (
    <section className="py-16 sm:py-20 bg-waxed-dark">
      <div className="section-container">
        <div className="max-w-2xl mb-12">
          <p className="text-xs font-medium text-waxed-text-muted uppercase tracking-wide mb-3">
            Early Access Pricing
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-waxed-text">
            Simple pricing that scales with you.
          </h2>
          <p className="text-waxed-text-secondary mt-4">
            Lock in early access rates. Prices shown are placeholders—final pricing announced at launch.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`card ${
                plan.highlighted ? 'border-waxed-olive' : ''
              }`}
            >
              <div className="mb-6">
                <p className="text-xs font-medium text-waxed-text-muted uppercase tracking-wide">
                  {plan.target}
                </p>
                <h3 className="text-xl font-semibold mt-1 text-waxed-text">{plan.name}</h3>
              </div>

              <div className="mb-6">
                <span className="text-3xl font-semibold text-waxed-text">{plan.price}</span>
                {plan.period && (
                  <span className="text-waxed-text-secondary">{plan.period}</span>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <svg
                      className="w-4 h-4 text-waxed-olive mt-0.5 flex-shrink-0"
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
                    <span className="text-waxed-text-secondary">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={onOpenModal}
                className={plan.highlighted ? 'btn-primary w-full' : 'btn-secondary w-full'}
              >
                {plan.cta || 'Request Access'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
