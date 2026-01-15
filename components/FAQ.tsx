'use client'

import { useState } from 'react'

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: 'Do I need to scan every record?',
    answer: 'No. Scanning is for new arrivals and quick adds. Your existing inventory comes over via CSV import or Discogs sync. Most stores only scan incoming stock.',
  },
  {
    question: 'Can you import my Discogs shop?',
    answer: 'Yes. Export your Discogs inventory as CSV and upload it directly. We map fields automatically—titles, artists, conditions, prices all come over.',
  },
  {
    question: 'What if I don\'t use Discogs?',
    answer: 'No problem. You can upload any CSV with your inventory data, or start from scratch and build your catalog by scanning. We provide templates to get started.',
  },
  {
    question: 'How do condition grades work?',
    answer: 'We use Goldmine grading standards (Mint, Near Mint, VG+, VG, G+, G, Fair, Poor) for both media and sleeve. You can add custom notes for edge cases.',
  },
  {
    question: 'Do you support in-store POS?',
    answer: 'In-store sales are on the roadmap. For now, Waxed focuses on online inventory and marketplace. We\'ll announce POS features when they\'re ready.',
  },
  {
    question: 'What fees do you take?',
    answer: 'We charge a flat monthly subscription. Transaction fees depend on your plan—Starter includes standard payment processing, Pro and Enterprise get reduced rates. No listing fees.',
  },
  {
    question: 'Can customers pick up locally?',
    answer: 'Yes. You can enable local pickup at checkout. Customers select it as a shipping option, and you mark orders as ready for pickup when they\'re pulled.',
  },
  {
    question: 'When do labels and shipping go live?',
    answer: 'Integrated shipping labels with USPS, UPS, and FedEx are in development. Early access users will be first to test. Target is Q2 2026.',
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
