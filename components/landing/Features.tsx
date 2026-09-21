'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Flame, BarChart2, Bell, Shield, Smartphone, Zap } from 'lucide-react'

const features = [
  {
    icon: Flame,
    color: 'from-orange-500 to-red-500',
    glow: 'shadow-orange-500/20',
    title: 'Streak Tracking',
    description: 'Build momentum with visual streak counters. Every day you show up adds to your chain — never break the streak.',
  },
  {
    icon: BarChart2,
    color: 'from-violet-500 to-purple-500',
    glow: 'shadow-violet-500/20',
    title: 'Beautiful Analytics',
    description: 'See your progress with GitHub-style heatmaps, completion rates, and personal bests.',
  },
  {
    icon: Bell,
    color: 'from-blue-500 to-cyan-500',
    glow: 'shadow-blue-500/20',
    title: 'Smart Reminders',
    description: 'Set custom reminder times for each habit. Never forget a check-in again.',
  },
  {
    icon: Smartphone,
    color: 'from-pink-500 to-rose-500',
    glow: 'shadow-pink-500/20',
    title: 'Works Offline (PWA)',
    description: 'Install as an app on any device. Log habits even without internet — syncs automatically.',
  },
  {
    icon: Zap,
    color: 'from-yellow-500 to-amber-500',
    glow: 'shadow-yellow-500/20',
    title: 'One-Tap Check-In',
    description: 'Mark habits done in one tap. No friction, no forms — just a satisfying click.',
  },
  {
    icon: Shield,
    color: 'from-emerald-500 to-teal-500',
    glow: 'shadow-emerald-500/20',
    title: 'Private & Secure',
    description: 'Your data belongs to you. Secured with Row Level Security — no one sees your habits but you.',
  },
]

function FeatureCard({ feature, index }: { feature: typeof features[number]; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300"
    >
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg ${feature.glow} group-hover:scale-110 transition-transform`}>
        <feature.icon size={22} className="text-white" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
    </motion.div>
  )
}

export default function Features() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-violet-400 text-sm font-medium tracking-widest uppercase">Everything you need</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-4">
            Features that make you{' '}
            <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">bloom</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Everything you need to build lasting habits, beautifully designed.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
