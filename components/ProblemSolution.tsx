export default function ProblemSolution() {
  const problems = [
    {
      label: 'Discogs is where records are listed, not where stores are run.',
      description: 'Your operations end up split across tools that don\'t talk to each other.',
    },
    {
      label: 'Spreadsheet chaos',
      description: 'Stock lives in Excel files nobody trusts, synced to nothing',
    },
    {
      label: 'Post office workflows',
      description: 'Discogs for listings, spreadsheets for stock, Square for POS, shipping apps for labels. Everything lives in different places.',
    },
    {
      label: 'Without clear demand signals, stores are left guessing.',
      description: 'What\'s moving, what\'s stalled, and what\'s mispriced stays hidden.',
    },
  ]

  const solutions = [
    {
      label: 'Real inventory system',
      description: 'Central source of truth for stock, condition, variants, and notes',
    },
    {
      label: 'Flexible import',
      description: 'Discogs, spreadsheets, Shopify, POS exports—start where your inventory already lives',
    },
    {
      label: 'Modern fulfillment',
      description: 'Order queue, prepaid labels, batch workflows, returns, and tracking in one place.',
    },
    {
      label: 'Actionable analytics',
      description: 'See what\'s selling, what\'s stalled, and what demand is pointing to next.',
    },
  ]

  return (
    <section id="product" className="py-16 sm:py-20 bg-waxed-dark">
      <div className="section-container">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          {/* Problems */}
          <div>
            <p className="text-xs font-medium text-waxed-text-muted uppercase tracking-wide mb-6">
              The Problem
            </p>
            <div className="space-y-6">
              {problems.map((item) => (
                <div key={item.label} className="flex gap-4">
                  <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                    <svg className="w-5 h-5 text-waxed-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-waxed-text">{item.label}</p>
                    <p className="text-sm text-waxed-text-secondary mt-0.5">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Solutions */}
          <div>
            <p className="text-xs font-medium text-waxed-text-muted uppercase tracking-wide mb-6">
              The Solution
            </p>
            <div className="space-y-6">
              {solutions.map((item) => (
                <div key={item.label} className="flex gap-4">
                  <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                    <svg className="w-5 h-5 text-waxed-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-waxed-text">{item.label}</p>
                    <p className="text-sm text-waxed-text-secondary mt-0.5">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
