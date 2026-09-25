'use client'

import { useState, useEffect } from 'react'
import { Plus, Trophy, Flame, Sparkles, Store, Coins, ShieldAlert, Share2, X } from 'lucide-react'
import HabitCard from '../HabitCard'
import AddHabitModal from '../AddHabitModal'
import EditHabitModal from '../EditHabitModal'
import VirtualPlant from '../VirtualPlant'
import StoreModal from '../StoreModal'
import type { Habit } from '@/lib/supabase/types'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import { getTodayString } from '@/lib/utils'

interface DashboardClientProps {
  habits: Habit[]
  recentCompletions: { habit_id: string; completed_at: string }[]
  userName: string
  score: number
  streak: number
  streakAtRisk?: boolean
  seeds: number
  streakFreezes: number
  plantStage: number
  plantHealth: number
  profileId?: string
  equippedPlant?: string
  unlockedPlants?: string[]
}

export default function TodayTab({ 
  habits: initialHabits, 
  recentCompletions, 
  userName, 
  score, 
  streak,
  streakAtRisk = false,
  seeds: initialSeeds,
  streakFreezes: initialStreakFreezes,
  plantStage,
  plantHealth,
  profileId,
  equippedPlant: initialEquippedPlant = 'default',
  unlockedPlants: initialUnlockedPlants = ['default']
}: DashboardClientProps) {
  // Only display habits that are actually scheduled for TODAY (local time)
  const [habits, setHabits] = useState(() => {
    const todayDayOfWeek = new Date().getDay()
    const activeHabits = initialHabits.filter(h => !h.target_days || h.target_days.includes(todayDayOfWeek))
    
    // Sort habits chronologically by reminder_time to act as a Timetable
    return activeHabits.sort((a, b) => {
      if (a.reminder_time && b.reminder_time) {
        return a.reminder_time.localeCompare(b.reminder_time)
      }
      if (a.reminder_time) return -1
      if (b.reminder_time) return 1
      return 0
    })
  })
  
  // Compute today's completed habits using the user's LOCAL phone timezone
  const [completedIds, setCompletedIds] = useState<Set<string>>(() => {
    const todayLocal = getTodayString()
    const todaysCompletions = recentCompletions.filter(c => c.completed_at === todayLocal)
    return new Set(todaysCompletions.map(c => c.habit_id))
  })
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
  const [showStoreModal, setShowStoreModal] = useState(false)
  const [showGardenModal, setShowGardenModal] = useState(false)
  const getCompactAvatar = (plant: string, stage: number, health: number) => {
    if (health <= 0) return '🥀'
    if (plant === 'bonsai') return stage === 1 ? '🪵' : stage === 2 ? '🪴' : stage === 3 ? '⛩️' : '🌲'
    if (plant === 'cactus') return stage === 1 ? '🏜️' : stage === 2 ? '🌵' : stage === 3 ? '🌵✨' : '🌸🌵'
    if (plant === 'monstera') return stage === 1 ? '🪴' : stage === 2 ? '🌿' : stage === 3 ? '🌴' : '🌺🌴'
    if (plant === 'golden') return stage === 1 ? '✨🌱' : stage === 2 ? '✨🌿' : stage === 3 ? '✨🌳' : '🌟🌳🌟'
    return stage === 1 ? '🌰' : stage === 2 ? '🌱' : stage === 3 ? '🌿' : '🌸'
  }

  const [greeting, setGreeting] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  
  // Realtime UI state for economy
  const [seeds, setSeeds] = useState(initialSeeds)
  const [streakFreezes, setStreakFreezes] = useState(initialStreakFreezes)
  const [localPlantHealth, setLocalPlantHealth] = useState(plantHealth)
  const [equippedPlant, setEquippedPlant] = useState(initialEquippedPlant)
  const [unlockedPlants, setUnlockedPlants] = useState(initialUnlockedPlants)

  // Current Date
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  })
  
  // CRITICAL FIX: Only count completedIds that belong to today's active habits to avoid >100% bug
  const validCompletedCount = Array.from(completedIds).filter(id => habits.some(h => h.id === id)).length
  const completionRate = habits.length > 0 ? Math.round((validCompletedCount / habits.length) * 100) : 0
  const allCompleted = habits.length > 0 && validCompletedCount >= habits.length

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

  useEffect(() => {
    const processReferral = async () => {
      const referredBy = localStorage.getItem('habitblooms_referred_by')
      if (referredBy) {
        // Prevent referring yourself
        if (profileId && profileId !== referredBy) {
          try {
            const { createClient } = await import('@/lib/supabase/client')
            const supabase = createClient()
            const { error } = await supabase.rpc('reward_referrer', { 
              referrer_uuid: referredBy
            })
            if (error) {
              console.error('Referral RPC error:', error)
              alert('Referral error: ' + error.message)
            } else {
              alert('Referral successful! Seeds added.')
            }
          } catch (err) {
            console.error('Referral exception:', err)
          }
        }
        // Always remove the code so we only try once
        localStorage.removeItem('habitblooms_referred_by')
      }
    }
    processReferral()
  }, [profileId])

  const handleHabitAdded = (habit: Habit) => {
    const todayDayOfWeek = new Date().getDay()
    if (!habit.target_days || habit.target_days.includes(todayDayOfWeek)) {
      setHabits((prev) => [...prev, habit])
    }
  }

  const handleHabitUpdated = (updatedHabit: Habit) => {
    const todayDayOfWeek = new Date().getDay()
    setHabits(prev => {
      // If they un-scheduled it for today, remove it from the dashboard entirely
      if (updatedHabit.target_days && !updatedHabit.target_days.includes(todayDayOfWeek)) {
        return prev.filter(h => h.id !== updatedHabit.id)
      }
      // Otherwise, update the habit in the list
      return prev.map(h => h.id === updatedHabit.id ? updatedHabit : h)
    })
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

  const [localStreakAtRisk, setLocalStreakAtRisk] = useState(streakAtRisk)
  const [showRepairModal, setShowRepairModal] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState('')

  useEffect(() => {
    if (!localStreakAtRisk) return
    const updateTime = () => {
      const now = new Date()
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
      const diff = tomorrow.getTime() - now.getTime()
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const mins = Math.floor((diff / (1000 * 60)) % 60)
      const secs = Math.floor((diff / 1000) % 60)
      setTimeRemaining(`${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`)
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [localStreakAtRisk])

  // SVG Circle configuration for the Apple Watch style ring
  const circleRadius = 50
  const circleCircumference = 2 * Math.PI * circleRadius
  const circleOffset = circleCircumference - (completionRate / 100) * circleCircumference

  const activeCategories = ['All', ...Array.from(new Set(habits.map(h => h.category)))]
  const displayedHabits = selectedCategory === 'All' ? habits : habits.filter(h => h.category === selectedCategory)

  return (
    <div className="relative min-h-[calc(100vh-4rem)] pb-20 md:pb-0">
      {/* Cinematic Ambient Background (Disabled on mobile for performance) */}
      <div className="hidden md:block fixed top-20 left-1/4 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse-glow" />
      <div className="hidden md:block fixed bottom-20 right-1/4 w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[150px] pointer-events-none animate-float" />
      
      <div className="max-w-6xl mx-auto py-6 md:py-8 px-4 relative">
        
        {/* Streak At Risk Banner */}
        <AnimatePresence>
          {localStreakAtRisk && (
            <motion.div
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="bg-red-950/40 border border-red-500/50 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center shrink-0 border border-red-500/50 animate-pulse">
                  <Flame className="text-red-500" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-red-400 mb-1 flex items-center justify-center sm:justify-start gap-2">
                    ⚠️ Streak at Risk!
                  </h3>
                  <p className="text-red-200/80 text-sm">
                    You missed a day! Your streak burns to 0 in <span className="font-mono font-bold text-white bg-red-500/20 px-1.5 py-0.5 rounded">{timeRemaining}</span>.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto shrink-0">
                  <button 
                    onClick={() => setShowRepairModal(true)}
                    className="w-full sm:w-auto px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-500/20"
                  >
                    Repair Streak
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* All Completed Banner (Sleek Apple Style) */}
        <AnimatePresence>
          {allCompleted && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-3 mb-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                  <Trophy className="text-blue-400" size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[15px] font-semibold text-blue-100 flex items-center gap-1.5">
                    100% Complete <Sparkles size={14} className="text-blue-400" />
                  </h3>
                  <p className="text-[13px] text-blue-200/70 truncate">{greeting}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>


        {/* Apple Style Large Title Header */}
        <div className="flex flex-row items-end justify-between mb-8 mt-2">
          <div>
            <p className="text-gray-500 font-semibold uppercase text-[11px] tracking-widest mb-1">{today}</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Today</h1>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-2 px-3 py-1.5 bg-[#131b2f] rounded-full border border-white/5">
               <div className="flex items-center gap-1.5 border-r border-white/10 pr-2">
                 <Flame size={14} className="text-orange-500" />
                 <span className="text-xs font-bold text-white">{streak}</span>
               </div>
               <div className="flex items-center gap-1.5 pl-1">
                 <Coins size={14} className="text-amber-400" />
                 <span className="text-xs font-bold text-white">{seeds}</span>
               </div>
             </div>
             
             <button 
                onClick={() => setShowGardenModal(true)}
                className="w-12 h-12 bg-[#131b2f] rounded-full flex items-center justify-center text-2xl active:scale-95 transition-transform shadow-sm border border-white/5"
             >
                {getCompactAvatar(equippedPlant, plantStage, localPlantHealth)}
             </button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-semibold text-white">Your Habits</h2>
          <span className="text-gray-500 text-sm font-medium">{completedIds.size} / {habits.length} done</span>
        </div>
        
        {/* Sleek Daily Progress Bar */}
        <div className="h-1.5 w-full bg-[#131b2f] border border-white/5 rounded-full overflow-hidden mb-6">
          <div 
             className="h-full bg-blue-500 rounded-full transition-all duration-700" 
             style={{ width: `${habits.length > 0 ? Math.round((completedIds.size / habits.length) * 100) : 0}%` }} 
          />
        </div>

        {/* Filter Pills */}
        {activeCategories.length > 2 && (
          <div className="flex overflow-x-auto gap-2 mb-4 sm:mb-6 pb-2 custom-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth">
            {activeCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === cat 
                    ? 'bg-white text-black font-semibold shadow-sm' 
                    : 'text-gray-500 hover:text-white font-medium'
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        )}

        {/* Habits grid */}
        <div className="bg-[#1c1c1e] rounded-2xl overflow-hidden mb-6">
          <AnimatePresence>
            {displayedHabits.map((habit, i) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                completed={completedIds.has(habit.id)}
                completedCount={completedIds.size}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onEdit={(habit: any) => setEditingHabit(habit)}
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
            className="group w-full flex items-center gap-3 px-4 py-3 hover:bg-[#1c1c1e] transition-colors border-b border-[#2c2c2e] last:border-b-0 text-left"
          >
            <div className="w-6 h-6 shrink-0 flex items-center justify-center">
              <Plus size={20} className="text-blue-500" />
            </div>
            <span className="text-[16px] text-blue-500 tracking-tight">New Reminder...</span>
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
          {editingHabit && (
            <EditHabitModal
              habit={editingHabit}
              onClose={() => setEditingHabit(null)}
              onHabitUpdated={handleHabitUpdated}
            />
          )}
        </AnimatePresence>

        
      {/* My Garden Popup Modal */}
      <AnimatePresence>
        {showGardenModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowGardenModal(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg z-10"
            >
              <button 
                onClick={() => setShowGardenModal(false)}
                className="absolute -top-12 right-0 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              >
                <X size={20} />
              </button>
              
              <VirtualPlant 
                stage={plantStage} 
                health={localPlantHealth} 
                freezes={streakFreezes} 
                equippedPlant={equippedPlant} 
              />
              
              <div className="mt-4 flex gap-3">
                <button 
                  onClick={() => { setShowGardenModal(false); setShowStoreModal(true); }}
                  className="flex-1 py-3.5 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] flex items-center justify-center gap-2"
                >
                  <Store size={18} /> Open Garden Shop
                </button>
              </div>
            </motion.div>
          </div>
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
                streak_at_risk: localStreakAtRisk,
                seeds,
                streak_freezes: streakFreezes,
                plant_stage: plantStage,
                plant_health: localPlantHealth,
                equipped_plant: equippedPlant,
                unlocked_plants: unlockedPlants,
                referred_by: null,
                full_name: userName,
                avatar_url: null,
                exam_goal: null,
                updated_at: ''
              }}
              onClose={() => setShowStoreModal(false)}
              onPurchaseComplete={(updatedProfile: any) => {
                setSeeds(updatedProfile.seeds)
                setStreakFreezes(updatedProfile.streak_freezes)
                if (updatedProfile.equipped_plant) setEquippedPlant(updatedProfile.equipped_plant)
                if (updatedProfile.unlocked_plants) setUnlockedPlants(updatedProfile.unlocked_plants)
              }}
            />
          )}
        </AnimatePresence>
        {/* Repair Modal */}
        <AnimatePresence>
          {showRepairModal && profileId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
              onClick={(e) => e.target === e.currentTarget && setShowRepairModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-[#0a0f1c] border border-red-500/30 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl relative overflow-hidden"
              >
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-red-500/10 blur-[100px] pointer-events-none" />
                
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-black text-white flex items-center gap-2">
                      Save Streak 🔥
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">Don&apos;t let your hard work burn.</p>
                  </div>
                  <button onClick={() => setShowRepairModal(false)} className="text-gray-500 bg-white/5 p-2 rounded-full hover:text-white">
                    <X size={16} />
                  </button>
                </div>

                <div className="space-y-4 relative z-10">
                  <button
                    onClick={async () => {
                      if (seeds >= 500 || streakFreezes > 0) {
                        const newSeeds = streakFreezes > 0 ? seeds : Math.max(0, seeds - 500)
                        const newFreezes = streakFreezes > 0 ? streakFreezes - 1 : streakFreezes
                        
                        const supabase = createClient()
                        await supabase.from('profiles').update({
                          streak_at_risk: false,
                          seeds: newSeeds,
                          streak_freezes: newFreezes
                        }).eq('id', profileId)

                        setSeeds(newSeeds)
                        setStreakFreezes(newFreezes)
                        setLocalStreakAtRisk(false)
                        setShowRepairModal(false)
                        alert(streakFreezes > 0 ? 'Streak freeze consumed! Streak saved.' : '500 Seeds spent! Streak saved.')
                      }
                    }}
                    disabled={seeds < 500 && streakFreezes === 0}
                    className="w-full p-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-xl flex items-center justify-between transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    <div className="text-left">
                      <div className="font-bold text-red-400">Repair Now</div>
                      <div className="text-xs text-red-300/70">{streakFreezes > 0 ? 'Uses 1 Streak Freeze' : 'Costs 500 Seeds'}</div>
                    </div>
                    <div className="flex items-center gap-1.5 font-bold text-white bg-black/30 px-3 py-1.5 rounded-lg group-hover:scale-105 transition-transform">
                      {streakFreezes > 0 ? <ShieldAlert size={16} className="text-blue-400"/> : <Coins size={16} className="text-amber-400" />}
                      {streakFreezes > 0 ? '1' : '500'}
                    </div>
                  </button>

                  <div className="text-center text-xs text-gray-500 font-bold uppercase tracking-wider my-2">OR</div>

                  <button
                    onClick={() => {
                      setShowRepairModal(false)
                      const url = `https://habitblooms.in/?ref=${profileId}`
                      if (navigator.share) {
                        navigator.share({
                          title: 'Join HabitBlooms',
                          text: `Save my streak! Sign up for HabitBlooms using my link: ${url}`,
                          url: url
                        })
                      } else {
                        navigator.clipboard.writeText(url)
                        alert('Referral link copied! Send it to a friend to get 1000 seeds instantly when they join.')
                      }
                    }}
                    className="w-full p-4 bg-gradient-to-r from-violet-600 to-emerald-600 hover:opacity-90 rounded-xl flex items-center justify-between transition-opacity"
                  >
                    <div className="text-left">
                      <div className="font-bold text-white">Invite a Friend</div>
                      <div className="text-xs text-emerald-200">Earn 1,000 Seeds instantly</div>
                    </div>
                    <Share2 size={20} className="text-white" />
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
