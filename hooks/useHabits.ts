'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Habit, HabitInsert } from '@/lib/supabase/types'

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchHabits = useCallback(async () => {
    const { data } = await supabase
      .from('habits')
      .select('*')
      .eq('is_archived', false)
      .order('created_at', { ascending: true })
    if (data) setHabits(data)
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchHabits()
  }, [fetchHabits])

  const addHabit = async (habit: Omit<HabitInsert, 'user_id'>) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    const { data, error } = await supabase
      .from('habits')
      .insert({ ...habit, user_id: user.id })
      .select()
      .single()
    if (!error && data) setHabits((prev) => [...prev, data])
    return data
  }

  const deleteHabit = async (id: string) => {
    await supabase.from('habits').delete().eq('id', id)
    setHabits((prev) => prev.filter((h) => h.id !== id))
  }

  const archiveHabit = async (id: string) => {
    await supabase.from('habits').update({ is_archived: true }).eq('id', id)
    setHabits((prev) => prev.filter((h) => h.id !== id))
  }

  return { habits, loading, addHabit, deleteHabit, archiveHabit, refetch: fetchHabits }
}
