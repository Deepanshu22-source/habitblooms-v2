'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Trash2, Bell, Edit2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { getTodayString } from '@/lib/utils'
import { useCompletionSound } from '@/hooks/useCompletionSound'
import type { Habit } from '@/lib/supabase/types'

interface Props {
  habit: Habit
  completed: boolean
  onToggle: (id: string, completed: boolean) => void
  onDelete: (id: string) => void
  onEdit?: (habit: Habit) => void
  onReward?: (seeds: number, health: number) => void
  index: number
}

export default function HabitCard({ habit, completed, onToggle, onDelete, onEdit, onReward, index }: Props) {
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const playSound = useCompletionSound()

  const handleToggle = async () => {
    setLoading(true)
    try {
      const today = getTodayString()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      if (completed) {
        const { error } = await supabase
          .from('habit_completions')
          .delete()
          .eq('habit_id', habit.id)
          .eq('user_id', user.id)
          .eq('completed_at', today)
        
        if (!error) {
          onToggle(habit.id, false)

          // Deduct the rewards so users can't exploit infinite seeds
          const { data: profile } = await supabase.from('profiles').select('score, seeds, plant_health').eq('id', user.id).maybeSingle()
          
          const newSeeds = Math.max(0, (profile?.seeds || 0) - 10)
          const newScore = Math.max(0, (profile?.score || 0) - 10)
          
          await supabase.from('profiles').update({
            score: newScore,
            seeds: newSeeds,
          }).eq('id', user.id)

          if (onReward) {
            onReward(-10, 0) // Tell UI to deduct seeds visually
          }
        }
      } else {
        const { error } = await supabase.from('habit_completions').insert({
          habit_id: habit.id,
          user_id: user.id,
          completed_at: today,
        })
        if (!error) {
          playSound() // Play sound ONLY after successful DB write
          onToggle(habit.id, true)

          // 1. Award Economy Rewards (+10 Seeds, +10 Score, +5 Plant Health)
          const { data: profile } = await supabase.from('profiles').select('score, seeds, plant_health, plant_stage').eq('id', user.id).maybeSingle()
          
          const newSeeds = (profile?.seeds || 0) + 10
          const newScore = (profile?.score || 0) + 10
          let newHealth = (profile?.plant_health ?? 100) + 5
          let newStage = profile?.plant_stage || 1

          // Level up plant if over max health (just a fun mini-mechanic)
          if (newHealth >= 100) {
            newHealth = 100
            if (newStage < 4) newStage += 1
          }

          await supabase.from('profiles').update({
            score: newScore,
            seeds: newSeeds,
            plant_health: newHealth,
            plant_stage: newStage
          }).eq('id', user.id)
          
          // Notify UI to update instantly
          if (onReward) {
            onReward(10, 5)
          }

          // 2. Post to activity feed for Community page
          const examGoal = user.user_metadata?.exam_goal
          if (examGoal) {
            await supabase.from('activity_feed').insert({
              user_id: user.id,
              exam_goal: examGoal,
              habit_name: habit.name,
              action: 'completed',
            }).then(() => {}) // Fire and forget, don't block UI
          }
        }
      }
    } catch (err) {
      console.error('Failed to toggle habit:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm(`Delete "${habit.name}"? This cannot be undone.`)) return
    const { error } = await supabase.from('habits').delete().eq('id', habit.id)
    if (!error) onDelete(habit.id)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.05 }}
      className={`group relative min-h-[88px] w-full rounded-2xl p-4 transition-all duration-300 flex items-center gap-4 ${
        completed
          ? 'bg-violet-500/10 border-violet-500/30 border shadow-sm'
          : 'bg-white/[0.03] border-white/5 border hover:bg-white/[0.05]'
      }`}
    >
      <div 
        className="w-12 h-12 shrink-0 flex items-center justify-center rounded-xl text-2xl shadow-inner"
        style={{ backgroundColor: `${habit.color}15` }}
      >
        {habit.icon}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className={`font-semibold text-[15px] leading-tight truncate transition-colors ${completed ? 'text-white' : 'text-gray-200'}`}>
            {habit.name}
          </h3>
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onEdit(habit)
              }}
              className="p-1.5 text-gray-500/70 hover:text-white transition-colors"
              title="Edit Habit"
            >
              <Edit2 size={14} />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <span className="text-[11px] text-gray-500 font-medium capitalize">{habit.category}</span>
          {habit.reminder_time && (
            <span className="flex items-center gap-1 text-[10px] text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full border border-violet-500/20 font-medium">
              <Bell size={10} />
              {habit.reminder_time.slice(0, 5)}
            </span>
          )}
        </div>
      </div>

      <button
        onClick={handleToggle}
        disabled={loading}
        className={`w-9 h-9 shrink-0 flex items-center justify-center rounded-full border-2 transition-all active:scale-90 ${
          completed
            ? 'bg-violet-500 border-violet-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]'
            : 'border-gray-600/50 bg-transparent text-transparent hover:border-violet-500/50'
        }`}
      >
        <Check size={18} className={completed ? "opacity-100" : "opacity-0"} strokeWidth={3} />
      </button>
      
      {/* Delete button (hidden on mobile, visible on desktop hover) */}
      <button
        onClick={handleDelete}
        className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#030712] border border-white/10 text-gray-500 hover:text-red-400 p-1.5 rounded-full shadow-lg hidden sm:block"
      >
        <Trash2 size={12} />
      </button>
    </motion.div>
  )
}
