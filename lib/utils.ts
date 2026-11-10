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

// All dates pinned to IST (Asia/Kolkata) for consistency between client and server.
// Each HabitBlooms day runs from 5:00 AM IST to 4:59:59 AM IST the next morning
// so students studying late at night still get credit for that night's study day.
export const DAY_RESET_HOUR_IST = 5
const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000
const DAY_RESET_OFFSET_MS = DAY_RESET_HOUR_IST * 60 * 60 * 1000
const LOGICAL_IST_SHIFT_MS = IST_OFFSET_MS - DAY_RESET_OFFSET_MS // +0.5h maps 05:00 IST -> 00:00 UTC

function getLogicalISTCalendarDate(date: Date = new Date()): Date {
  const shifted = new Date(date.getTime() + LOGICAL_IST_SHIFT_MS)
  return new Date(Date.UTC(shifted.getUTCFullYear(), shifted.getUTCMonth(), shifted.getUTCDate()))
}

function formatUTCDate(utcDate: Date): string {
  return utcDate.toISOString().slice(0, 10)
}

export function getTodayString(date: Date = new Date()): string {
  return formatUTCDate(getLogicalISTCalendarDate(date))
}

export function getDateString(date: Date): string {
  return formatUTCDate(getLogicalISTCalendarDate(date))
}

export function getYesterdayDateString(date: Date = new Date()): string {
  const logical = getLogicalISTCalendarDate(date)
  logical.setUTCDate(logical.getUTCDate() - 1)
  return formatUTCDate(logical)
}

export function getHabitDayOfWeek(date: Date = new Date()): number {
  return getLogicalISTCalendarDate(date).getUTCDay()
}

export function getDayOfWeekFromDateStr(dateStr: string): number {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay()
}

export function getHabitDisplayDateFromStr(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-US', {
    timeZone: 'UTC',
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  })
}

export function getHabitDisplayDate(date: Date = new Date()): string {
  return getHabitDisplayDateFromStr(getTodayString(date))
}

export function getISTHours(date: Date = new Date()): number {
  return new Date(date.getTime() + IST_OFFSET_MS).getUTCHours()
}

export function getMsUntilNextDayReset(date: Date = new Date()): number {
  const shiftedMs = date.getTime() + LOGICAL_IST_SHIFT_MS
  const shifted = new Date(shiftedMs)
  const nextResetShiftedMs = Date.UTC(
    shifted.getUTCFullYear(),
    shifted.getUTCMonth(),
    shifted.getUTCDate() + 1
  )
  return Math.max(0, nextResetShiftedMs - shiftedMs)
}

export function getHabitStartOfWeekMs(date: Date = new Date()): number {
  const logical = getLogicalISTCalendarDate(date)
  const day = logical.getUTCDay() // 0 = Sun, 1 = Mon...
  const daysSinceMonday = day === 0 ? 6 : day - 1
  const mondayShiftedMs = Date.UTC(
    logical.getUTCFullYear(),
    logical.getUTCMonth(),
    logical.getUTCDate() - daysSinceMonday
  )
  return mondayShiftedMs - LOGICAL_IST_SHIFT_MS
}

export function getRecentDateStrings(days: number, endDate: Date = new Date()): string[] {
  const result: string[] = []
  const cursor = getLogicalISTCalendarDate(endDate)
  cursor.setUTCDate(cursor.getUTCDate() - (days - 1))
  for (let i = 0; i < days; i++) {
    result.push(formatUTCDate(cursor))
    cursor.setUTCDate(cursor.getUTCDate() + 1)
  }
  return result
}

export function getDatesInRange(startDate: Date, endDate: Date): string[] {
  const dates: string[] = []
  const current = getLogicalISTCalendarDate(startDate)
  const end = getLogicalISTCalendarDate(endDate)
  while (current <= end) {
    dates.push(formatUTCDate(current))
    current.setUTCDate(current.getUTCDate() + 1)
  }
  return dates
}

export function calculateStreak(completedDates: string[], targetDays: number[] | null = null): number {
  if (completedDates.length === 0) return 0

  const completionsSet = new Set(completedDates)
  let streak = 0

  const current = getLogicalISTCalendarDate(new Date())
  const todayStr = formatUTCDate(current)

  // If targetDays is null or empty, assume it's an everyday habit: [0, 1, 2, 3, 4, 5, 6]
  const activeDays = (targetDays && targetDays.length > 0) ? targetDays : [0, 1, 2, 3, 4, 5, 6]

  // Walk backward through the calendar
  for (let i = 0; i < 3650; i++) { // Cap at 10 years to prevent infinite loop
    const dateStr = formatUTCDate(current)
    const dayOfWeek = current.getUTCDay()

    // If today is a day we are supposed to do the habit
    if (activeDays.includes(dayOfWeek)) {
      if (completionsSet.has(dateStr)) {
        // Completed! Add to streak.
        streak++
      } else {
        // Not completed.
        if (dateStr === todayStr) {
          // If it's today (before 5:00 AM IST reset) and they haven't done it yet, keep streak alive.
        } else {
          // They missed a target day in the past. Streak is officially broken.
          break
        }
      }
    }

    // Step exactly 1 day backward
    current.setUTCDate(current.getUTCDate() - 1)
  }

  return streak
}
