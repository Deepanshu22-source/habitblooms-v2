import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function getTodayString(): string {
  const d = new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getDateString(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getDatesInRange(startDate: Date, endDate: Date): string[] {
  const dates: string[] = []
  const current = new Date(startDate)
  while (current <= endDate) {
    dates.push(getDateString(current))
    current.setDate(current.getDate() + 1)
  }
  return dates
}

export function calculateStreak(completedDates: string[], targetDays: number[] | null = null): number {
  if (completedDates.length === 0) return 0

  const completionsSet = new Set(completedDates)
  let streak = 0
  
  const current = new Date()
  current.setHours(0, 0, 0, 0)
  const todayStr = getDateString(current)

  // If targetDays is null or empty, assume it's an everyday habit: [0, 1, 2, 3, 4, 5, 6]
  const activeDays = (targetDays && targetDays.length > 0) ? targetDays : [0, 1, 2, 3, 4, 5, 6]

  // Walk backward through the calendar
  for (let i = 0; i < 3650; i++) { // Cap at 10 years to prevent infinite loop
    const dateStr = getDateString(current)
    const dayOfWeek = current.getDay()

    // If today is a day we are supposed to do the habit
    if (activeDays.includes(dayOfWeek)) {
      if (completionsSet.has(dateStr)) {
        // Completed! Add to streak.
        streak++
      } else {
        // Not completed. 
        if (dateStr === todayStr) {
          // If it's today and they haven't done it yet, we don't break the streak. Give them time.
        } else {
          // They missed a target day in the past. Streak is officially broken.
          break
        }
      }
    }

    // Step exactly 1 day backward
    current.setDate(current.getDate() - 1)
  }

  return streak
}
