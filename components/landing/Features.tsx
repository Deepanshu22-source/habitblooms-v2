'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Flame, BarChart2, Bell, Shield, Zap, Users, ShieldAlert, Coins } from 'lucide-react'

const features = [
  {
    icon: Zap,
    color: 'from-yellow-500 to-amber-500',
    glow: 'shadow-yellow-500/20',
    title: 'Zero-Second Speed',
    description: 'Built as a high-speed Single Page App. Switch tabs with zero delay and log habits in one tap — perfectly fluid on both iOS and Android.',
  },
  {
    icon: Coins,
    color: 'from-orange-500 to-red-500',
    glow: 'shadow-orange-500/20',
    title: 'Gamified Economy',
    description: 'Earn Seeds by checking off habits. Level up your Virtual Garden and buy in-store items like Streak Freezes to safeguard your consistency.',
  },
  {
    icon: Users,
    color: 'from-blue-500 to-cyan-500',
    glow: 'shadow-blue-500/20',
    title: 'Weekly Squad Leaderboards',
    description: 'Compete in a weekly league with peers who share your exam or life goals (UPSC, CA, JEE, College). Leaderboards reset every Monday for a fresh start.',
  },
  {
    icon: Flame,
    color: 'from-pink-500 to-rose-500',
    glow: 'shadow-pink-500/20',
    title: 'Anti-Burnout Streaks',
    description: 'Never fear missing a day. With built-in Rest Day skips and Streak Freezes, HabitBlooms prevents streak anxiety and supports long-term consistency.',
  },
  {
    icon: Bell,
    color: 'from-violet-500 to-purple-500',
    glow: 'shadow-violet-500/20',
    title: 'Smart Push Reminders',
    description: 'Set custom alerts for every habit, or rely on automated hourly nudges (Morning, Mid-day, and the 10:00 PM streak-saver broadcast).',
  },
  {
    icon: ShieldAlert,
    color: 'from-emerald-500 to-teal-500',
    glow: 'shadow-emerald-500/20',
    title: 'Anti-Cheat Architecture',
    description: 'Schedule specific days for gym or study routines. Anti-cheat rules prevent exploiting streak resets or unchecking habits out of order.',
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
          <span className="text-violet-400 text-sm font-medium tracking-widest uppercase">The Engine</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-4">
            Not just a tracker, it&apos;s a{' '}
            <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">Game</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Packed with psychology-driven features to guarantee you never miss a day again.
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
