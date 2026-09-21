'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import TutorialModal from './TutorialModal'

const HeroScene = dynamic(() => import('@/components/3d/HeroScene'), {
  ssr: false,
  loading: () => <div className="absolute inset-0" />,
})

export default function Hero() {
  const [showTutorial, setShowTutorial] = useState(false)

  return (
    <>
      <TutorialModal isOpen={showTutorial} onClose={() => setShowTutorial(false)} />
      
      <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* 3D Scene */}
      <div className="absolute inset-0 z-0">
        <HeroScene />
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#030712] via-[#030712]/70 to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#030712] to-transparent z-10 pointer-events-none" />

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 pt-24 pb-20">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm mb-8"
            >
              <Sparkles size={14} />
              Habit tracking, reimagined
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] mb-6 tracking-tight"
            >
              Build Habits
              <br />
              That{' '}
              <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
                Bloom
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-xl text-gray-400 mb-10 leading-relaxed max-w-lg"
            >
              Transform your daily routines into beautiful, lasting habits.
              Track progress, celebrate streaks, and watch yourself grow.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/login"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-pink-600 rounded-2xl text-white font-semibold text-lg hover:scale-105 transition-all shadow-2xl shadow-violet-500/30"
              >
                Start for Free
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <button
                onClick={() => setShowTutorial(true)}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border border-white/10 text-white font-semibold text-lg hover:bg-white/5 transition-colors backdrop-blur-sm"
              >
                📖 Quick Guide
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="flex flex-wrap items-center gap-6 mt-10"
            >
              {['Free forever', 'No credit card', 'Works offline'].map((text) => (
                <span key={text} className="flex items-center gap-1.5 text-sm text-gray-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                  {text}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
    </>
  )
}
