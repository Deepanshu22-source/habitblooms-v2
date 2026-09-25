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
  completedCount: number
  onToggle: (id: string, completed: boolean) => void
  onDelete: (id: string) => void
  onEdit?: (habit: Habit) => void
  onReward?: (seeds: number, health: number) => void
  index: number
}

// DIMINISHING RETURNS MATH
const getReward = (count: number) => {
  if (count < 10) return 10;
  if (count < 20) return 5;
  return 1;
};

export default function HabitCard({ habit, completed, completedCount, onToggle, onDelete, onEdit, onReward, index }: Props) {
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

          const penalty = getReward(Math.max(0, completedCount - 1))
          const { data: profile } = await supabase.from('profiles').select('score, seeds').eq('id', user.id).maybeSingle()
          
          const newSeeds = Math.max(0, (profile?.seeds || 0) - penalty)
          const newScore = Math.max(0, (profile?.score || 0) - penalty)
          
          await supabase.from('profiles').update({
            score: newScore,
            seeds: newSeeds,
          }).eq('id', user.id)

          if (onReward) {
            onReward(-penalty, 0)
          }
        }
      } else {
        const { error } = await supabase.from('habit_completions').insert({
          habit_id: habit.id,
          user_id: user.id,
          completed_at: today,
        })
        if (!error) {
          playSound()
          onToggle(habit.id, true)

          const reward = getReward(completedCount)
          const { data: profile } = await supabase.from('profiles').select('score, seeds, plant_health, plant_stage').eq('id', user.id).maybeSingle()
          
          const newSeeds = (profile?.seeds || 0) + reward
          const newScore = (profile?.score || 0) + reward
          let newHealth = (profile?.plant_health ?? 100) + 5
          let newStage = profile?.plant_stage || 1

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
          
          if (onReward) {
            onReward(reward, newHealth)
          }

          const examGoal = user.user_metadata?.exam_goal
          if (examGoal) {
            await supabase.from('activity_feed').insert({
              user_id: user.id,
              exam_goal: examGoal,
              habit_name: habit.name,
              action: 'completed',
            }).then(() => {}) 
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
    
    // STRICT DELETE PENALTY: If deleted while completed today, subtract the seeds they just farmed!
    if (completed) {
      const penalty = getReward(Math.max(0, completedCount - 1))
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('score, seeds').eq('id', user.id).maybeSingle()
        if (profile) {
          await supabase.from('profiles').update({
            score: Math.max(0, (profile.score || 0) - penalty),
            seeds: Math.max(0, (profile.seeds || 0) - penalty),
          }).eq('id', user.id)
          onReward?.(-penalty, 0)
        }
      }
    }

    const { error } = await supabase.from('habits').delete().eq('id', habit.id)
    if (!error) onDelete(habit.id)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.05 }}
      className={`group relative w-full px-4 py-2 transition-colors duration-200 flex items-center gap-3 border-b border-[#2c2c2e] last:border-b-0 ${
        completed
          ? 'bg-transparent'
          : 'bg-transparent hover:bg-white/[0.02]'
      }`}
    >
      
      {/* iOS Style Circle Checkbox (Left) */}
      <button
        onClick={handleToggle}
        disabled={loading}
        className={`w-6 h-6 shrink-0 flex items-center justify-center rounded-full border transition-all ${
          completed
            ? 'bg-blue-500 border-blue-500 text-white'
            : 'border-gray-500 bg-transparent text-transparent hover:border-gray-400'
        }`}
      >
        <Check size={14} className={completed ? "opacity-100" : "opacity-0"} strokeWidth={3} />
      </button>

      {/* Content (Middle) */}
      <div className="flex-1 min-w-0 flex flex-col justify-center py-1">
        <div className="flex items-center gap-2">
          <span className="text-lg">{habit.icon}</span>
          <h3 className={`text-[16px] tracking-tight transition-colors ${completed ? 'text-gray-500 line-through' : 'text-white'}`}>
            {habit.name}
          </h3>
        </div>
        
        {/* Minimal text for metadata, NO bulky pills */}
        <div className="flex items-center gap-2 mt-0.5 text-[13px] text-gray-500">
          <span className="capitalize">{habit.category}</span>
          {habit.reminder_time && (
            <>
              <span>&middot;</span>
              <span className="flex items-center gap-0.5">
                <Bell size={10} /> {habit.reminder_time.slice(0, 5)}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Edit button (Right, subtle) */}
      {onEdit && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onEdit(habit)
          }}
          className="p-2 text-gray-600 hover:text-white transition-colors"
        >
          <Edit2 size={16} />
        </button>
      )}

      
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
