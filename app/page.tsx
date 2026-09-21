import Navbar from '@/components/landing/Navbar'
import Hero from '@/components/landing/Hero'
import Features from '@/components/landing/Features'
import HowItWorks from '@/components/landing/HowItWorks'
import CTA from '@/components/landing/CTA'
import Footer from '@/components/landing/Footer'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#030712]">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <CTA />
      <Footer />
    </main>
  )
}
