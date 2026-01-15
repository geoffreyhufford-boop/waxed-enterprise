'use client'

import { useState, useEffect, useRef, FormEvent } from 'react'

interface EarlyAccessModalProps {
  isOpen: boolean
  onClose: () => void
}

interface FormData {
  storeName: string
  contactName: string
  email: string
  city: string
  sellsOnDiscogs: string
  inventorySize: string
  notes: string
}

interface FormErrors {
  storeName?: string
  contactName?: string
  email?: string
  city?: string
  sellsOnDiscogs?: string
  inventorySize?: string
}

const inventorySizeOptions = [
  { value: '', label: 'Select inventory size' },
  { value: 'under-500', label: 'Under 500 records' },
  { value: '500-2000', label: '500 - 2,000 records' },
  { value: '2000-5000', label: '2,000 - 5,000 records' },
  { value: '5000-10000', label: '5,000 - 10,000 records' },
  { value: 'over-10000', label: '10,000+ records' },
]

export default function EarlyAccessModal({ isOpen, onClose }: EarlyAccessModalProps) {
  const [formData, setFormData] = useState<FormData>({
    storeName: '',
    contactName: '',
    email: '',
    city: '',
    sellsOnDiscogs: '',
    inventorySize: '',
    notes: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const modalRef = useRef<HTMLDivElement>(null)
  const firstInputRef = useRef<HTMLInputElement>(null)

  // Focus trap and keyboard handling
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }

      if (e.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (!focusableElements || focusableElements.length === 0) return

        const firstElement = focusableElements[0] as HTMLElement
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    firstInputRef.current?.focus()

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.storeName.trim()) {
      newErrors.storeName = 'Store name is required'
    }
    if (!formData.contactName.trim()) {
      newErrors.contactName = 'Contact name is required'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required'
    }
    if (!formData.sellsOnDiscogs) {
      newErrors.sellsOnDiscogs = 'Please select an option'
    }
    if (!formData.inventorySize) {
      newErrors.inventorySize = 'Please select inventory size'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Store in localStorage
    const submissions = JSON.parse(localStorage.getItem('waxed_submissions') || '[]')
    const submission = {
      ...formData,
      submittedAt: new Date().toISOString(),
      id: crypto.randomUUID(),
    }
    submissions.push(submission)
    localStorage.setItem('waxed_submissions', JSON.stringify(submissions))

    // Log to console for development
    console.log('Early Access Submission:', submission)

    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        storeName: '',
        contactName: '',
        email: '',
        city: '',
        sellsOnDiscogs: '',
        inventorySize: '',
        notes: '',
      })
      setErrors({})
      setIsSubmitted(false)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-waxed-dark border border-waxed-border rounded-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-waxed-text-muted hover:text-waxed-text transition-colors rounded-lg hover:bg-waxed-card"
          aria-label="Close modal"
          disabled={isSubmitting}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {isSubmitted ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center bg-waxed-olive/20 border border-waxed-olive/30 rounded-xl">
              <svg className="w-6 h-6 text-waxed-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-waxed-text">You&apos;re on the list</h2>
            <p className="text-waxed-text-secondary text-sm mb-6">
              We&apos;ll reach out when your early access slot opens.
            </p>
            <button onClick={handleClose} className="btn-secondary">
              Close
            </button>
          </div>
        ) : (
          <>
            <h2 id="modal-title" className="text-xl font-semibold mb-1 text-waxed-text">
              Request Early Access
            </h2>
            <p className="text-waxed-text-secondary text-sm mb-6">
              Tell us about your store. We&apos;ll reach out when spots open.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="storeName" className="label-text">
                  Store Name *
                </label>
                <input
                  ref={firstInputRef}
                  type="text"
                  id="storeName"
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleInputChange}
                  className={`input-field ${errors.storeName ? 'border-red-500' : ''}`}
                  placeholder="Dusty Groove Records"
                />
                {errors.storeName && (
                  <p className="mt-1 text-xs text-red-400">{errors.storeName}</p>
                )}
              </div>

              <div>
                <label htmlFor="contactName" className="label-text">
                  Contact Name *
                </label>
                <input
                  type="text"
                  id="contactName"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleInputChange}
                  className={`input-field ${errors.contactName ? 'border-red-500' : ''}`}
                  placeholder="Your name"
                />
                {errors.contactName && (
                  <p className="mt-1 text-xs text-red-400">{errors.contactName}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="label-text">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="you@yourstore.com"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-400">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="city" className="label-text">
                  City *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={`input-field ${errors.city ? 'border-red-500' : ''}`}
                  placeholder="Brooklyn, NY"
                />
                {errors.city && (
                  <p className="mt-1 text-xs text-red-400">{errors.city}</p>
                )}
              </div>

              <div>
                <label className="label-text">Do you sell on Discogs? *</label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="sellsOnDiscogs"
                      value="yes"
                      checked={formData.sellsOnDiscogs === 'yes'}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-waxed-olive bg-waxed-card border-waxed-border focus:ring-waxed-olive focus:ring-offset-waxed-dark"
                    />
                    <span className="text-sm text-waxed-text">Yes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="sellsOnDiscogs"
                      value="no"
                      checked={formData.sellsOnDiscogs === 'no'}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-waxed-olive bg-waxed-card border-waxed-border focus:ring-waxed-olive focus:ring-offset-waxed-dark"
                    />
                    <span className="text-sm text-waxed-text">No</span>
                  </label>
                </div>
                {errors.sellsOnDiscogs && (
                  <p className="mt-1 text-xs text-red-400">{errors.sellsOnDiscogs}</p>
                )}
              </div>

              <div>
                <label htmlFor="inventorySize" className="label-text">
                  Approximate Inventory Size *
                </label>
                <select
                  id="inventorySize"
                  name="inventorySize"
                  value={formData.inventorySize}
                  onChange={handleInputChange}
                  className={`input-field ${errors.inventorySize ? 'border-red-500' : ''}`}
                >
                  {inventorySizeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.inventorySize && (
                  <p className="mt-1 text-xs text-red-400">{errors.inventorySize}</p>
                )}
              </div>

              <div>
                <label htmlFor="notes" className="label-text">
                  Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="input-field resize-none"
                  placeholder="Tell us about your store or specific needs..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Request Access'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
