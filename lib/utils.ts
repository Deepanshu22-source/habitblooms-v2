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
  return new Date().toISOString().split('T')[0]
}

export function getDateString(date: Date): string {
  return date.toISOString().split('T')[0]
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

export function calculateStreak(completedDates: string[]): number {
  if (completedDates.length === 0) return 0

  // Deduplicate dates (multiple habits completed on same day)
  const uniqueDates = Array.from(new Set(completedDates))
  const sorted = uniqueDates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

  const today = getTodayString()
  if (sorted[0] !== today) return 0

  let streak = 1
  for (let i = 1; i < sorted.length; i++) {
    const current = new Date(sorted[i - 1])
    const prev = new Date(sorted[i])
    const diff = Math.round((current.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24))
    if (diff === 1) {
      streak++
    } else {
      break
    }
  }
  return streak
}
