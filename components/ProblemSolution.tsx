export default function ProblemSolution() {
  const problems = [
    {
      label: 'Spreadsheets',
      description: 'Inventory lives in scattered files nobody trusts',
    },
    {
      label: 'Manual listings',
      description: 'Hours spent copy-pasting the same data to multiple platforms',
    },
    {
      label: 'Shipping pain',
      description: 'Printing labels, tracking numbers, buyer messages everywhere',
    },
    {
      label: 'No analytics',
      description: 'Guessing what sells instead of knowing',
    },
  ]

  const solutions = [
    {
      label: 'One system of record',
      description: 'Single source of truth for every record in stock',
    },
    {
      label: 'Bulk import',
      description: 'Bring your Discogs catalog over in minutes',
    },
    {
      label: 'Fulfillment tools',
      description: 'Labels, tracking, and buyer comms in one workflow',
    },
    {
      label: 'Real insights',
      description: 'See what moves, what sits, and what to price',
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
