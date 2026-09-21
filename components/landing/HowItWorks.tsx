'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { UserPlus, Plus, CheckCircle2 } from 'lucide-react'

const steps = [
  {
    icon: UserPlus,
    step: '01',
    title: 'Sign up in seconds',
    description: "One click with Google. No forms, no passwords, no friction — you're in instantly.",
    color: 'from-violet-600 to-purple-600',
  },
  {
    icon: Plus,
    step: '02',
    title: 'Create your habits',
    description: 'Add the habits you want to build. Choose an icon, color, and category.',
    color: 'from-pink-600 to-rose-600',
  },
  {
    icon: CheckCircle2,
    step: '03',
    title: 'Check in daily',
    description: 'One tap to mark a habit done. Watch your streaks grow and your heatmap fill up.',
    color: 'from-emerald-600 to-teal-600',
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
          <span className="text-pink-400 text-sm font-medium tracking-widest uppercase">Simple by design</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-4">
            Up and running in{' '}
            <span className="bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent">60 seconds</span>
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
