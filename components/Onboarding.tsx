export default function Onboarding() {
  const steps = [
    {
      number: '01',
      title: 'Export your inventory',
      description: 'Discogs CSV, Excel, Google Sheets, Shopify export, or POS export—whatever you already have. We start where your data lives.',
    },
    {
      number: '02',
      title: 'Import to Waxed',
      description: 'Upload the file. We map fields automatically and flag anything that needs review. Most stores are imported in under 5 minutes.',
    },
    {
      number: '03',
      title: 'Review and publish',
      description: 'Check your catalog, clean up edge cases, add notes. Hit publish and your storefront goes live with your full inventory.',
    },
    {
      number: '04',
      title: 'Scan new arrivals',
      description: 'Use camera scanning for incoming stock. Consumer-grade speed, enterprise-grade accuracy. Keeps inventory current without re-importing.',
    },
    {
      number: '05',
      title: 'Fulfill from the dashboard',
      description: 'Orders come in, you pack them out. Print labels, mark shipped, tracking updates automatically. No more post office workflows.',
    },
  ]

  return (
    <section id="onboarding" className="py-16 sm:py-20 bg-waxed-dark">
      <div className="section-container">
        <div className="max-w-2xl mb-12">
          <p className="text-xs font-medium text-waxed-text-muted uppercase tracking-wide mb-3">
            Onboarding
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-waxed-text">
            Your inventory to live storefront in one afternoon.
          </h2>
          <p className="text-waxed-text-secondary mt-4">
            No scanning thousands of records. Your catalog already exists somewhere—we just bring it over.
          </p>
        </div>

        <div className="grid gap-6 lg:gap-0">
          {steps.map((step) => (
            <div
              key={step.number}
              className="lg:grid lg:grid-cols-12 lg:gap-8 lg:border-t lg:border-waxed-border lg:py-8 first:lg:border-t-0 first:lg:pt-0"
            >
              <div className="lg:col-span-1">
                <span className="text-2xl font-semibold text-waxed-olive font-mono">
                  {step.number}
                </span>
              </div>
              <div className="lg:col-span-3 mt-2 lg:mt-0">
                <h3 className="font-medium text-lg text-waxed-text">{step.title}</h3>
              </div>
              <div className="lg:col-span-8 mt-2 lg:mt-0">
                <p className="text-waxed-text-secondary leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
