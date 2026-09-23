'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronRight, ChevronLeft, Target, ShieldAlert, Trophy, Coins, Leaf, Store, Zap } from 'lucide-react'

interface Props {
  isOpen: boolean
  onClose: () => void
}

const steps = [
  {
    icon: <Target className="w-12 h-12 text-pink-400" />,
    title: '1. The Rules of the Game 📅',
    description: "Lock in the specific days you'll do a habit. Your Progress Ring only tracks today's habits. To increase your overall Streak (🔥), you MUST hit a 100% Perfect Day. Miss just one? Your streak is at risk!",
    color: 'from-pink-500/20 to-rose-500/20'
  },
  {
    icon: <Coins className="w-12 h-12 text-emerald-400" />,
    title: '2. The Economy 🪙',
    description: "Earn Seeds by completing habits! But there's a strict anti-spam cap: Your first 10 habits pay +10 Seeds. Habits 11-20 pay +5. Everything after pays +1. This guarantees a completely fair playing field.",
    color: 'from-emerald-500/20 to-green-500/20'
  },
  {
    icon: <ShieldAlert className="w-12 h-12 text-red-400" />,
    title: '3. The Anti-Cheat Engine 🛡️',
    description: "Think you can farm points by checking off a fake habit and deleting it? The system strictly tracks payouts. If you delete a habit checked off today, those exact seeds are instantly deducted back out of your wallet.",
    color: 'from-red-500/20 to-orange-500/20'
  },
  {
    icon: <Store className="w-12 h-12 text-amber-400" />,
    title: '4. The Store & Lifelines 🏥',
    description: "If you miss a Perfect Day, a red warning banner appears. You can visit the Shop and spend 500 hard-earned Seeds to buy a Streak Freeze. This magical lifeline will repair your broken streak and save your progress!",
    color: 'from-amber-500/20 to-yellow-500/20'
  },
  {
    icon: <Trophy className="w-12 h-12 text-blue-400" />,
    title: '5. The Weekly League 🏆',
    description: "Declare your exact goal (e.g., 'UPSC' or 'Fitness') to join a targeted Squad. Compete on the live Weekly Leaderboard. Every Sunday at midnight, the robot archives the week and resets the board for a fresh battle!",
    color: 'from-blue-500/20 to-cyan-500/20'
  },
  {
    icon: <Zap className="w-12 h-12 text-violet-400" />,
    title: '6. Zero-Second Speed & Alerts ⚡',
    description: "The app is built as a 0-second Single Page App (SPA). It feels faster than native. Plus, enable push notifications for automated hourly broadcasts and a 10:00 PM Midnight Warning if your streak is in danger!",
    color: 'from-violet-500/20 to-purple-500/20'
  }
]

export default function TutorialModal({ isOpen, onClose }: Props) {
  const [currentStep, setCurrentStep] = useState(0)
  const router = useRouter()

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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-[#0a0f1c] border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors z-10"
          >
            <X size={20} />
          </button>

          <div className="relative p-6 sm:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center text-center mt-2"
              >
                <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br ${steps[currentStep].color} border border-white/10 flex items-center justify-center mb-6 shadow-inner`}>
                  {steps[currentStep].icon}
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
                  {steps[currentStep].title}
                </h3>
                
                <p className="text-gray-400 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8 min-h-[140px] sm:min-h-[150px] px-2">
                  {steps[currentStep].description}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center gap-2 mb-6 sm:mb-8">
              {steps.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentStep ? 'w-8 bg-violet-500' : 'w-2 bg-white/20'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center justify-between gap-3 sm:gap-4">
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
                className="flex-1 py-3.5 sm:py-4 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 text-base sm:text-lg"
              >
                {currentStep === steps.length - 1 ? 'Start Winning' : 'Next'}
                {currentStep !== steps.length - 1 && <ChevronRight size={20} />}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
