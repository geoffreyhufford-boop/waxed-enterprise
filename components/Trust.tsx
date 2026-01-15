export default function Trust() {
  const trustItems = [
    {
      title: 'On-platform transactions',
      description: 'Payments stay on Waxed. No hunting through PayPal or Venmo for order records.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      title: 'Anti off-platform warnings',
      description: 'We flag suspicious messages trying to take deals off-platform. Protects you and your buyers.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
    {
      title: 'Verified store badges',
      description: 'Prove you\'re a real brick-and-mortar. NYC-certified stores get a verified badge.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
    },
    {
      title: 'Data security',
      description: 'Your inventory data stays yours. Role-based permissions control who sees what.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
    },
  ]

  return (
    <section id="trust" className="py-16 sm:py-20">
      <div className="section-container">
        <div className="max-w-2xl mb-12">
          <p className="text-xs font-medium text-waxed-text-muted uppercase tracking-wide mb-3">
            Trust &amp; Safety
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-waxed-text">
            Built for stores that take their reputation seriously.
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {trustItems.map((item) => (
            <div key={item.title} className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-waxed-card border border-waxed-border rounded-xl">
                <span className="text-waxed-olive">{item.icon}</span>
              </div>
              <div>
                <h3 className="font-medium mb-1 text-waxed-text">{item.title}</h3>
                <p className="text-sm text-waxed-text-secondary leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
