'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getTodayString } from '@/lib/utils'
import type { HabitCompletion } from '@/lib/supabase/types'

export function useCompletions(habitId?: string) {
  const [completions, setCompletions] = useState<HabitCompletion[]>([])
  const [todayComplete, setTodayComplete] = useState(false)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchCompletions = useCallback(async () => {
    let query = supabase
      .from('habit_completions')
      .select('*')
      .order('completed_at', { ascending: false })

    if (habitId) query = query.eq('habit_id', habitId)

    const { data } = await query
    if (data) {
      setCompletions(data)
      const today = getTodayString()
      setTodayComplete(data.some((c) => c.completed_at === today && (!habitId || c.habit_id === habitId)))
    }
    setLoading(false)
  }, [supabase, habitId])

  useEffect(() => {
    fetchCompletions()
  }, [fetchCompletions])

  const toggleToday = async (currentHabitId: string) => {
    const today = getTodayString()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    if (todayComplete) {
      await supabase
        .from('habit_completions')
        .delete()
        .eq('habit_id', currentHabitId)
        .eq('completed_at', today)
      setTodayComplete(false)
    } else {
      const { data } = await supabase
        .from('habit_completions')
        .insert({ habit_id: currentHabitId, user_id: user.id, completed_at: today })
        .select()
        .single()
      if (data) {
        setCompletions((prev) => [data, ...prev])
        setTodayComplete(true)
      }
    }
  }

  return { completions, todayComplete, loading, toggleToday, refetch: fetchCompletions }
}
