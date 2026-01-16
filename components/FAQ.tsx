'use client'

import { useState } from 'react'

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: 'Do I need to scan every record?',
    answer: 'No. Scanning is for new arrivals and quick adds. Your existing inventory comes over via import—Discogs, spreadsheets, Shopify, or POS exports. Most stores only scan incoming stock after the initial bulk import.',
  },
  {
    question: 'What can I import from?',
    answer: 'Discogs CSV, Excel, Google Sheets, Shopify exports, or POS exports (Square, Lightspeed, etc). If your inventory is in a file somewhere, we can bring it over. Most imports take under 5 minutes.',
  },
  {
    question: 'Do I need Discogs?',
    answer: 'No. Discogs is just one option. Most stores start with whatever they already have—spreadsheets, Shopify, or a POS export. We start where your data lives.',
  },
  {
    question: 'Is this useful before I have buyers?',
    answer: 'Yes. Waxed works as an inventory manager, catalog system, ops dashboard, and analytics tool from day one. Marketplace liquidity comes later—stores win immediately.',
  },
  {
    question: 'How is this different from just using Discogs?',
    answer: 'Discogs is a marketplace you\'re using as an ops tool. Waxed is a real inventory and fulfillment system that happens to have a storefront. Central source of truth, batch workflows, label printing, analytics that answer "what should I buy more of."',
  },
  {
    question: 'What fees do you take?',
    answer: 'Flat monthly subscription. Transaction fees depend on your plan—Starter includes standard processing, Pro and Enterprise get reduced rates. No listing fees, no percentage cuts on sales.',
  },
  {
    question: 'Can customers pick up locally?',
    answer: 'Yes. Enable local pickup at checkout. Customers select it as a shipping option, and you mark orders ready when they\'re pulled. Good for stores with foot traffic.',
  },
  {
    question: 'When do shipping labels go live?',
    answer: 'Label generation with USPS, UPS, and FedEx is in development. Early access users will be first to test. Discounted rates included—no more post office runs.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="py-16 sm:py-20">
      <div className="section-container">
        <div className="max-w-2xl mb-12">
          <p className="text-xs font-medium text-waxed-text-muted uppercase tracking-wide mb-3">
            FAQ
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-waxed-text">
            Common questions.
          </h2>
        </div>

        <div className="max-w-3xl">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-b border-waxed-border last:border-b-0"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full py-5 flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-waxed-olive focus:ring-offset-2 focus:ring-offset-waxed-black rounded-lg"
                aria-expanded={openIndex === index}
              >
                <span className="font-medium pr-4 text-waxed-text">{faq.question}</span>
                <svg
                  className={`w-5 h-5 text-waxed-text-muted flex-shrink-0 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {openIndex === index && (
                <div className="pb-5 pr-12">
                  <p className="text-waxed-text-secondary leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
