'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { UserPlus, Flower2, Trophy } from 'lucide-react'

const steps = [
  {
    icon: UserPlus,
    step: '01',
    title: 'Pick your Goal',
    description: "Sign in with one click and declare your life goal or exam target. This places you in the right competitive league.",
    color: 'from-violet-600 to-purple-600',
  },
  {
    icon: Flower2,
    step: '02',
    title: 'Grow your Garden',
    description: 'Create scheduled habits. Every time you achieve a 100% Perfect Day, you earn Seeds and your virtual plant levels up.',
    color: 'from-emerald-600 to-teal-600',
  },
  {
    icon: Trophy,
    step: '03',
    title: 'Climb the Ranks',
    description: 'Use your earned Seeds to buy Streak Freezes, and compete on the real-time weekly leaderboard against your peers.',
    color: 'from-pink-600 to-rose-600',
  },
]

export default function HowItWorks() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <section id="how-it-works" className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-violet-500/5 via-transparent to-transparent pointer-events-none" />
      <div className="max-w-5xl mx-auto relative">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="text-pink-400 text-sm font-medium tracking-widest uppercase">The Loop</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-4">
            How to{' '}
            <span className="bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent">Win</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15 }}
              className="relative text-center"
            >
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-gradient-to-r from-white/10 to-transparent" />
              )}
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto mb-5 shadow-2xl`}>
                <step.icon size={28} className="text-white" />
              </div>
              <div className="text-5xl font-black text-white/5 mb-2">{step.step}</div>
              <h3 className="text-xl font-bold text-white mb-2 -mt-6">{step.title}</h3>
              <p className="text-gray-400 leading-relaxed text-sm">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
