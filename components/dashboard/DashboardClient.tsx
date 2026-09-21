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

        {/* Compact Player Status Bar (Habitica Style) */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 mb-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 shadow-lg backdrop-blur-md relative overflow-hidden">
          {/* Subtle plant health glow */}
          <div className={`absolute top-0 left-0 w-32 h-32 blur-3xl opacity-20 pointer-events-none ${localPlantHealth > 50 ? 'bg-emerald-500' : localPlantHealth > 20 ? 'bg-orange-500' : 'bg-red-500'}`} />
          
          {/* 1. Plant Avatar */}
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-black/40 rounded-full border border-white/10 shadow-inner flex items-center justify-center overflow-hidden shrink-0">
              <div className="absolute bottom-0 left-0 right-0 h-4 bg-[#1a1311] border-t border-white/5" />
              <div className="text-3xl sm:text-4xl z-10" style={{ transformOrigin: 'bottom center' }}>
                {localPlantHealth <= 0 ? '🥀' : plantStage === 1 ? '🌰' : plantStage === 2 ? '🌱' : plantStage === 3 ? '🌿' : '🌸'}
              </div>
            </div>
            
            {/* Mobile Greeting (Hidden on desktop) */}
            <div className="sm:hidden flex-1">
              <p className="text-violet-400 font-semibold text-[10px] uppercase tracking-wider">{today}</p>
              <h1 className="text-xl font-bold text-white tracking-tight leading-tight truncate">
                Hey, {userName}
              </h1>
            </div>
          </div>

          {/* 2. Stats & Progress */}
          <div className="flex-1 w-full flex flex-col justify-center gap-3">
            {/* Desktop Greeting */}
            <div className="hidden sm:block">
              <p className="text-violet-400 font-semibold text-xs uppercase tracking-wider mb-1">{today}</p>
              <h1 className="text-2xl font-bold text-white tracking-tight">Hey, {userName}</h1>
            </div>

            {/* Stat Bars */}
            <div className="grid grid-cols-2 gap-4 w-full">
              {/* Plant Health */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] sm:text-xs font-medium text-gray-400">
                  <span>Moisture</span>
                  <span className="text-white">{localPlantHealth}%</span>
                </div>
                <div className="h-1.5 w-full bg-black/50 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${localPlantHealth > 50 ? 'bg-emerald-500' : localPlantHealth > 20 ? 'bg-orange-500' : 'bg-red-500'}`}
                    style={{ width: `${localPlantHealth}%` }}
                  />
                </div>
              </div>

              {/* Daily Progress */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] sm:text-xs font-medium text-gray-400">
                  <span>Daily Progress</span>
                  <span className="text-white">{completionRate}%</span>
                </div>
                <div className="h-1.5 w-full bg-black/50 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-pink-500 transition-all duration-1000"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. Economy Badges */}
          <div className="flex sm:flex-col gap-2 w-full sm:w-auto mt-2 sm:mt-0 shrink-0">
            <div className="flex-1 sm:flex-none flex items-center justify-between sm:justify-start gap-3 bg-black/30 px-3 py-2 rounded-xl border border-white/5">
              <span className="text-[10px] text-gray-500 uppercase font-bold">Seeds</span>
              <div className="flex items-center gap-1.5">
                <Coins size={12} className="text-amber-400" />
                <span className="text-sm font-bold text-white">{seeds || 0}</span>
              </div>
            </div>
            <div 
              onClick={() => setShowStoreModal(true)}
              className="flex-1 sm:flex-none flex items-center justify-between sm:justify-start gap-3 bg-black/30 px-3 py-2 rounded-xl border border-white/5 cursor-pointer hover:bg-white/10 transition-colors"
            >
              <span className="text-[10px] text-gray-500 uppercase font-bold">Shop</span>
              <div className="flex items-center gap-1.5">
                <Store size={12} className="text-pink-400" />
                <span className="text-xs font-bold text-white uppercase">Open</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4 sm:mb-6">
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
