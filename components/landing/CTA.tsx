'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function CTA() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <section className="py-24 px-6">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto relative overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 via-pink-500/5 to-transparent p-12 text-center"
      >
        <div className="absolute -top-20 -left-20 w-60 h-60 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative">
          <div className="text-5xl mb-4">🌸</div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Ready to bloom?</h2>
          <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
            Start building better habits today. Free, beautiful, and it actually works.
          </p>
          <Link
            href="/login"
            className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-pink-600 rounded-2xl text-white font-semibold text-lg hover:scale-105 transition-all shadow-2xl shadow-violet-500/30"
          >
            Start for Free
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </motion.div>
    </section>
  )
}
