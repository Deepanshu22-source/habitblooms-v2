'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronRight, ChevronLeft, Target, CheckCircle2, Trophy, Users, Leaf, Store } from 'lucide-react'

interface Props {
  isOpen: boolean
  onClose: () => void
}

const steps = [
  {
    icon: <CheckCircle2 className="w-12 h-12 text-pink-400" />,
    title: '1. Habits & Reminders',
    description: "Click 'Add Habit' to set up your routines. You can even set custom time reminders using the digital dial so you never forget to check in!",
    color: 'from-pink-500/20 to-rose-500/20'
  },
  {
    icon: <Leaf className="w-12 h-12 text-emerald-400" />,
    title: '2. Your Virtual Garden 🌱',
    description: "Completing habits waters your Virtual Plant. Maintain high health and your plant will eventually bloom! But be careful—miss days and your plant will wilt.",
    color: 'from-emerald-500/20 to-green-500/20'
  },
  {
    icon: <Store className="w-12 h-12 text-amber-400" />,
    title: '3. Earn Seeds & Shop 🪙',
    description: "Completing habits earns you 'Seeds'. Spend your Seeds in the Shop to buy Streak Freezes 🛡️! A Streak Freeze automatically protects your streak if you miss a day.",
    color: 'from-amber-500/20 to-yellow-500/20'
  },
  {
    icon: <Trophy className="w-12 h-12 text-blue-400" />,
    title: '4. Squads & Leaderboard 🏆',
    description: "Set your 'Exam/Goal' in your Profile to join a Squad. Compete on the Weekly Leaderboard against others with the exact same goal as you!",
    color: 'from-blue-500/20 to-cyan-500/20'
  }
]

export default function TutorialModal({ isOpen, onClose }: Props) {
  const [currentStep, setCurrentStep] = useState(0)
  const router = useRouter()

  // Reset step when modal opens
  useEffect(() => {
    if (isOpen) setCurrentStep(0)
  }, [isOpen])

  if (!isOpen) return null

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      onClose()
      router.push('/login')
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 px-4 sm:px-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-[#0a0f1c] border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors z-10"
          >
            <X size={20} />
          </button>

          <div className="relative p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center text-center mt-4"
              >
                {/* Icon Circle */}
                <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${steps[currentStep].color} border border-white/10 flex items-center justify-center mb-6 shadow-inner`}>
                  {steps[currentStep].icon}
                </div>

                <h3 className="text-2xl font-bold text-white mb-4">
                  {steps[currentStep].title}
                </h3>
                
                <p className="text-gray-400 text-lg leading-relaxed mb-8 min-h-[140px] px-2">
                  {steps[currentStep].description}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Dots */}
            <div className="flex justify-center gap-2 mb-8">
              {steps.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentStep ? 'w-8 bg-violet-500' : 'w-2 bg-white/20'
                  }`}
                />
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={handlePrev}
                disabled={currentStep === 0}
                className={`p-3 rounded-xl border border-white/10 transition-colors ${
                  currentStep === 0 
                    ? 'opacity-0 pointer-events-none' 
                    : 'text-white hover:bg-white/5'
                }`}
              >
                <ChevronLeft size={24} />
              </button>

              <button
                onClick={handleNext}
                className="flex-1 py-4 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 text-lg"
              >
                {currentStep === steps.length - 1 ? 'Got it! Start building' : 'Next'}
                {currentStep !== steps.length - 1 && <ChevronRight size={20} />}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
