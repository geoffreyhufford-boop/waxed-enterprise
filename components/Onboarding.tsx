export default function Onboarding() {
  const steps = [
    {
      number: '01',
      title: 'Import your catalog',
      description: 'Connect your Discogs account or upload a CSV export. We pull in titles, artists, conditions, and prices.',
    },
    {
      number: '02',
      title: 'Review and normalize',
      description: 'Clean up condition grades, merge duplicates, and fill in missing fields. Bulk editing makes it fast.',
    },
    {
      number: '03',
      title: 'Publish your storefront',
      description: 'Go live with a clean, searchable catalog. Customers can browse by genre, artist, or condition.',
    },
    {
      number: '04',
      title: 'Scan new arrivals',
      description: 'Barcode scanning adds records to inventory in seconds. Works with any USB or Bluetooth scanner.',
    },
    {
      number: '05',
      title: 'Fulfill orders',
      description: 'Print labels, mark shipped, send tracking. The workflow handles buyer comms automatically.',
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
            From spreadsheet to storefront in an afternoon.
          </h2>
        </div>

        <div className="grid gap-6 lg:gap-0">
          {steps.map((step, index) => (
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
