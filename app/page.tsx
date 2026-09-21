import { Suspense } from 'react'
import Navbar from '@/components/landing/Navbar'
import Hero from '@/components/landing/Hero'
import Features from '@/components/landing/Features'
import HowItWorks from '@/components/landing/HowItWorks'
import FAQ from '@/components/landing/FAQ'
import CTA from '@/components/landing/CTA'
import Footer from '@/components/landing/Footer'
import ReferralTracker from '@/components/landing/ReferralTracker'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#030712]">
      <Suspense fallback={null}>
        <ReferralTracker />
      </Suspense>
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  )
}
