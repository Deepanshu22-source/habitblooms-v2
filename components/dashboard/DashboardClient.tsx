'use client'

import { useState, useEffect } from 'react'
import { Plus, Trophy, Flame, Sparkles, Store, Coins } from 'lucide-react'
import HabitCard from './HabitCard'
import AddHabitModal from './AddHabitModal'
import VirtualPlant from './VirtualPlant'
import StoreModal from './StoreModal'
import type { Habit } from '@/lib/supabase/types'
import { motion, AnimatePresence } from 'framer-motion'
import { getTodayString } from '@/lib/utils'

interface DashboardClientProps {
  habits: Habit[]
  completedIds: string[]
  userName: string
  score: number
  streak: number
  seeds: number
  streakFreezes: number
  plantStage: number
  plantHealth: number
  profileId: string | undefined
}

export default function DashboardClient({ 
  habits: initialHabits, 
  completedIds: initialCompletedIds, 
  userName, 
  score, 
  streak,
  seeds: initialSeeds,
  streakFreezes: initialStreakFreezes,
  plantStage,
  plantHealth,
  profileId
}: DashboardClientProps) {
  const [habits, setHabits] = useState(initialHabits)
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set(initialCompletedIds))
  const [showAddModal, setShowAddModal] = useState(false)
  const [showStoreModal, setShowStoreModal] = useState(false)
  const [greeting, setGreeting] = useState('')
  
  // Realtime UI state for economy
  const [seeds, setSeeds] = useState(initialSeeds)
  const [streakFreezes, setStreakFreezes] = useState(initialStreakFreezes)
  const [localPlantHealth, setLocalPlantHealth] = useState(plantHealth)

  // Current Date
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  })
  const completionRate = habits.length > 0 ? Math.round((completedIds.size / habits.length) * 100) : 0
  const allCompleted = habits.length > 0 && completedIds.size === habits.length

  // Generate dynamic text based on progress
  let progressMessage = "Let's get blooming."
  if (completionRate > 0 && completionRate < 50) progressMessage = "You're off to a great start!"
  if (completionRate >= 50 && completionRate < 100) progressMessage = "You're halfway there, keep it up!"
  if (allCompleted) progressMessage = "Perfect day! You crushed everything."

  useEffect(() => {
    if (allCompleted) {
      const hour = new Date().getHours()
      if (hour >= 5 && hour < 12) setGreeting("Good morning! Amazing job finishing early!")
      else if (hour >= 12 && hour < 17) setGreeting("Good afternoon! Way to crush your habits today!")
      else if (hour >= 17 && hour < 22) setGreeting("Good evening! Perfect day, everything is done!")
      else setGreeting("Wow, late night dedication! All habits complete!")
    }
  }, [allCompleted])

  const handleHabitAdded = (habit: Habit) => {
    setHabits((prev) => [...prev, habit])
  }

  const handleToggle = (habitId: string, completed: boolean) => {
    setCompletedIds((prev) => {
      const next = new Set(prev)
      if (completed) next.add(habitId)
      else next.delete(habitId)
      return next
    })
  }

  const handleReward = (seedsEarned: number, healthEarned: number) => {
    setSeeds(prev => prev + seedsEarned)
    setLocalPlantHealth(prev => Math.min(prev + healthEarned, 100))
  }

  const handleDelete = (habitId: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== habitId))
    setCompletedIds((prev) => {
      const next = new Set(prev)
      next.delete(habitId)
      return next
    })
  }

  // SVG Circle configuration for the Apple Watch style ring
  const circleRadius = 50
  const circleCircumference = 2 * Math.PI * circleRadius
  const circleOffset = circleCircumference - (completionRate / 100) * circleCircumference

  return (
    <div className="relative min-h-[calc(100vh-4rem)] pb-20 md:pb-0">
      {/* Cinematic Ambient Background (Disabled on mobile for performance) */}
      <div className="hidden md:block fixed top-20 left-1/4 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse-glow" />
      <div className="hidden md:block fixed bottom-20 right-1/4 w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[150px] pointer-events-none animate-float" />
      
      <div className="max-w-6xl mx-auto py-6 md:py-8 px-4 relative z-10">
        
        {/* All Completed Banner */}
        <AnimatePresence>
          {allCompleted && (
            <motion.div
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              className="mb-8 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-violet-600/20 to-pink-600/20 border border-violet-500/30 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left shadow-[0_0_40px_rgba(139,92,246,0.15)] relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none" />
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center shrink-0 shadow-lg shadow-violet-500/50 z-10">
                  <Trophy className="text-white" size={24} />
                </div>
                <div className="z-10">
                  <h3 className="text-xl font-bold text-white mb-1 flex items-center justify-center sm:justify-start gap-2">
                    100% Complete! <Sparkles size={18} className="text-yellow-400" />
                  </h3>
                  <p className="text-violet-200">{greeting}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero Section: Progress Ring & Welcome Text */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-8">
          
          <div className="flex items-center gap-4 sm:gap-6">
            {/* The Apple Watch Glowing Ring */}
            <div className="relative w-20 h-20 sm:w-32 sm:h-32 flex items-center justify-center shrink-0">
              {/* Glow Behind */}
              <div className="absolute inset-0 bg-violet-500/20 rounded-full blur-[15px]" />
              
              <svg viewBox="0 0 128 128" className="w-20 h-20 sm:w-32 sm:h-32 transform -rotate-90 relative z-10 drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]">
                {/* Track */}
                <circle
                  cx="64"
                  cy="64"
                  r={circleRadius}
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-white/5"
                />
                {/* Progress */}
                <circle
                  cx="64"
                  cy="64"
                  r={circleRadius}
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={circleCircumference}
                  strokeDashoffset={circleOffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out drop-shadow-md"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10">
                <span className="text-xl sm:text-2xl font-bold text-white drop-shadow-md">{completionRate}%</span>
              </div>
            </div>

            {/* Greeting & Motivation */}
            <div>
              <p className="text-violet-400 font-medium text-[10px] sm:text-sm mb-1 uppercase tracking-wider">{today}</p>
              <h1 className="text-3xl sm:text-5xl font-bold text-white mb-1 sm:mb-2 tracking-tight leading-tight">
                Hey, <br className="sm:hidden" />{userName}
              </h1>
              <p className="text-gray-400 text-sm sm:text-lg">{progressMessage}</p>
            </div>
          </div>

          {/* Gamification Badges */}
          <div className="flex gap-3 w-full md:w-auto mt-2 md:mt-0">
            <div className="glass flex-1 md:flex-none px-4 sm:px-5 py-3 rounded-2xl border border-white/10 flex flex-col items-center justify-center shadow-lg">
              <span className="text-[10px] sm:text-xs text-gray-500 font-medium mb-1 uppercase">Seeds</span>
              <div className="flex items-center gap-2">
                <Coins size={16} className="text-amber-400 animate-pulse sm:w-5 sm:h-5" />
                <span className="text-lg sm:text-xl font-bold text-white">{seeds || 0}</span>
              </div>
            </div>
            <div className="glass flex-1 md:flex-none px-4 sm:px-5 py-3 rounded-2xl border border-white/10 flex flex-col items-center justify-center shadow-lg cursor-pointer hover:bg-white/10 transition-colors" onClick={() => setShowStoreModal(true)}>
              <span className="text-[10px] sm:text-xs text-gray-500 font-medium mb-1 uppercase text-center w-full">Shop</span>
              <div className="flex items-center gap-2">
                <Store size={16} className="text-pink-400 sm:w-5 sm:h-5" />
                <span className="text-sm font-bold text-white uppercase mt-0.5">Open</span>
              </div>
            </div>
          </div>
        </div>

        {/* Virtual Garden Section */}
        <div className="mb-12">
          <VirtualPlant stage={plantStage || 1} health={localPlantHealth ?? 100} freezes={streakFreezes || 0} />
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-white">Your Habits</h2>
          <span className="text-gray-500">{completedIds.size} / {habits.length} done</span>
        </div>

        {/* Habits grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {habits.map((habit, i) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                completed={completedIds.has(habit.id)}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onReward={handleReward}
                index={i}
              />
            ))}
          </AnimatePresence>

          {/* Add habit card */}
          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: habits.length * 0.05 + 0.1 }}
            onClick={() => setShowAddModal(true)}
            className="group h-[160px] rounded-3xl border border-dashed border-white/20 bg-white/5 flex flex-col items-center justify-center gap-3 hover:border-violet-500/50 hover:bg-violet-500/10 transition-all shadow-lg hover:shadow-violet-500/20 hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/5 group-hover:bg-violet-500/20 flex items-center justify-center transition-colors">
              <Plus size={24} className="text-gray-400 group-hover:text-violet-300 transition-colors" />
            </div>
            <span className="text-sm font-medium text-gray-400 group-hover:text-violet-300 transition-colors">Add new habit</span>
          </motion.button>
        </div>

        {/* Empty state */}
        {habits.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 col-span-full"
          >
            <div className="text-6xl mb-6 animate-float">🌱</div>
            <h3 className="text-2xl font-bold text-white mb-2">No habits yet</h3>
            <p className="text-gray-400 mb-8 max-w-sm mx-auto">Start small. Add your very first daily goal and begin blooming today.</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-8 py-4 bg-gradient-to-r from-violet-600 to-pink-600 rounded-2xl text-white font-bold hover:scale-105 transition-transform shadow-lg shadow-violet-500/25 flex items-center gap-2 mx-auto"
            >
              <Plus size={20} /> Add First Habit
            </button>
          </motion.div>
        )}

        {/* Add Habit Modal */}
        <AnimatePresence>
          {showAddModal && (
            <AddHabitModal
              onClose={() => setShowAddModal(false)}
              onHabitAdded={handleHabitAdded}
            />
          )}
        </AnimatePresence>

        {/* Store Modal */}
        <AnimatePresence>
          {showStoreModal && profileId && (
            <StoreModal
              profile={{
                id: profileId,
                score,
                streak,
                seeds,
                streak_freezes: streakFreezes,
                plant_stage: plantStage,
                plant_health: plantHealth,
                referred_by: null,
                full_name: userName,
                avatar_url: null,
                exam_goal: null,
                updated_at: ''
              }}
              onClose={() => setShowStoreModal(false)}
              onPurchaseComplete={(updatedProfile) => {
                setSeeds(updatedProfile.seeds)
                setStreakFreezes(updatedProfile.streak_freezes)
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
