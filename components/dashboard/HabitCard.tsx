'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Trash2, Bell } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { getTodayString } from '@/lib/utils'
import { useCompletionSound } from '@/hooks/useCompletionSound'
import type { Habit } from '@/lib/supabase/types'

interface Props {
  habit: Habit
  completed: boolean
  onToggle: (id: string, completed: boolean) => void
  onDelete: (id: string) => void
  onReward?: (seeds: number, health: number) => void
  index: number
}

export default function HabitCard({ habit, completed, onToggle, onDelete, onReward, index }: Props) {
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
          // Remove seeds/score (optional, we'll just keep it simple for now and not deduct on undo)
          onToggle(habit.id, false)
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

          await supabase.from('profiles').upsert({
            id: user.id,
            score: newScore,
            seeds: newSeeds,
            plant_health: newHealth,
            plant_stage: newStage
          })
          
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
      className={`group relative h-[160px] rounded-3xl p-5 border transition-all duration-300 overflow-hidden hover:-translate-y-1 shadow-lg ${
        completed
          ? 'border-violet-500/30 bg-violet-500/10 hover:shadow-[0_8px_30px_rgba(139,92,246,0.2)]'
          : 'border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04] hover:shadow-[0_8px_30px_rgba(255,255,255,0.05)]'
      }`}
    >
      {/* Glow on complete */}
      {completed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-pink-500/5 pointer-events-none"
        />
      )}

      <div className="relative flex flex-col h-full">
        {/* Top row */}
        <div className="flex items-start justify-between mb-auto">
          <div className="flex items-center gap-3">
            <span
              className="text-2xl w-10 h-10 flex items-center justify-center rounded-xl"
              style={{ backgroundColor: `${habit.color}20` }}
            >
              {habit.icon}
            </span>
            <div>
              <h3 className="font-semibold text-white text-sm leading-tight">{habit.name}</h3>
              {habit.description && (
                <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">{habit.description}</p>
              )}
            </div>
          </div>

          <button
            onClick={handleDelete}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-600 hover:text-red-400 p-1"
          >
            <Trash2 size={14} />
          </button>
        </div>

        {/* Category & Reminder badge */}
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs text-gray-500 capitalize">{habit.category}</span>
          {habit.reminder_time && (
            <span className="flex items-center gap-1 text-xs text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full border border-violet-500/20">
              <Bell size={10} />
              {habit.reminder_time.slice(0, 5)}
            </span>
          )}
        </div>

        {/* Check button */}
        <button
          onClick={handleToggle}
          disabled={loading}
          className={`w-full py-2.5 rounded-xl font-medium text-sm transition-all ${
            completed
              ? 'bg-violet-500 text-white hover:bg-violet-600'
              : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
          }`}
        >
          {completed ? (
            <span className="flex items-center justify-center gap-2">
              <Check size={14} /> Done!
            </span>
          ) : (
            'Mark complete'
          )}
        </button>
      </div>
    </motion.div>
  )
}
