'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  Navigation,
  Hero,
  ValueProps,
  Features,
  Pricing,
  ClosingCTA,
  Footer,
  EarlyAccessModal,
} from '@/components'

export default function Home() {
  const router = useRouter()
  // useEffect(() => { router.replace('/dashboard') }, [router])

  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  return (
    <>
      <Navigation onOpenModal={openModal} />
      <main>
        <Hero onOpenModal={openModal} />
        <ValueProps />
        <Features />
        <Pricing onOpenModal={openModal} />
        <ClosingCTA onOpenModal={openModal} />
      </main>
      <Footer />
      <EarlyAccessModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  )
}
