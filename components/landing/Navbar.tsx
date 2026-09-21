'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { LogoSVG } from '@/components/ui/LogoSVG'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Share2 } from 'lucide-react'

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleShare = async () => {
    const url = 'https://habitblooms.in'
    const shareData = {
      title: 'HabitBlooms',
      text: `Track your daily routines and grow your virtual garden on HabitBlooms! 🌱✨\n\nCheck it out: ${url}`,
      url: url
    }
    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(shareData.text)
        alert('Link copied to clipboard!')
      }
    } catch (err) {
      console.log('Error sharing:', err)
    }
  }

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#030712]/80 backdrop-blur-xl border-b border-white/5' : ''
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <LogoSVG className="w-8 h-8 drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
          <span className="text-white font-bold text-lg tracking-wide">
            Habit<span className="text-emerald-400">Blooms</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={handleShare}
            className="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 text-sm font-medium mr-2"
          >
            <Share2 size={16} /> Share
          </button>
          <Link
            href="/login"
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            Sign in
          </Link>
          <Link
            href="/login"
            className="px-5 py-2 bg-gradient-to-r from-violet-600 to-pink-600 rounded-xl text-white text-sm font-medium hover:scale-105 transition-transform shadow-lg shadow-violet-500/20"
          >
            Get Started Free
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-gray-400 hover:text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#030712]/95 backdrop-blur-xl border-b border-white/5"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-gray-400 hover:text-white transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <button
                onClick={() => {
                  handleShare()
                  setMobileOpen(false)
                }}
                className="text-gray-400 hover:text-white transition-colors text-left flex items-center gap-2"
              >
                <Share2 size={18} /> Share HabitBlooms
              </button>
              <Link
                href="/login"
                className="px-5 py-3 bg-gradient-to-r from-violet-600 to-pink-600 rounded-xl text-white font-medium text-center hover:opacity-90 transition-opacity mt-2"
                onClick={() => setMobileOpen(false)}
              >
                Get Started Free
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
