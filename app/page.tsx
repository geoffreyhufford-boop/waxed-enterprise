'use client'

import { useState } from 'react'
import {
  Navigation,
  Hero,
  ProblemSolution,
  Features,
  ProductShowcase,
  Onboarding,
  Trust,
  Pricing,
  FAQ,
  Footer,
  EarlyAccessModal,
} from '@/components'

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  return (
    <>
      <Navigation onOpenModal={openModal} />
      <main>
        <Hero onOpenModal={openModal} />
        <ProblemSolution />
        <Features />
        <ProductShowcase />
        <Onboarding />
        <Trust />
        <Pricing onOpenModal={openModal} />
        <FAQ />
      </main>
      <Footer />
      <EarlyAccessModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  )
}
