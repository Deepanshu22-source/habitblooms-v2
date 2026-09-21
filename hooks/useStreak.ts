import { useMemo } from 'react'
import { calculateStreak } from '@/lib/utils'
import type { HabitCompletion } from '@/lib/supabase/types'

export function useStreak(completions: HabitCompletion[]) {
  const streak = useMemo(() => {
    const dates = completions.map((c) => c.completed_at)
    return calculateStreak(dates)
  }, [completions])

  const longestStreak = useMemo(() => {
    if (!completions.length) return 0
    const dates = [...completions.map((c) => c.completed_at)].sort()
    let longest = 1
    let current = 1
    for (let i = 1; i < dates.length; i++) {
      const prev = new Date(dates[i - 1])
      const curr = new Date(dates[i])
      const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)
      if (diff === 1) {
        current++
        longest = Math.max(longest, current)
      } else if (diff > 1) {
        current = 1
      }
    }
    return longest
  }, [completions])

  return { streak, longestStreak }
}
