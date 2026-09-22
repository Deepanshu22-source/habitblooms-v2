'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Flame, TrendingUp, Target, Calendar } from 'lucide-react'
import { calculateStreak, getTodayString, getDateString } from '@/lib/utils'
import type { Habit, HabitCompletion } from '@/lib/supabase/types'

interface Props {
  habits: Habit[]
  completions: HabitCompletion[]
  dbStreak: number
}

function HeatMap({ completions }: { completions: HabitCompletion[] }) {
  const days = useMemo(() => {
    const result: { date: string; count: number }[] = []
    const end = new Date()
    const start = new Date()
    start.setDate(start.getDate() - 83) // 12 weeks

    const countByDate = completions.reduce<Record<string, number>>((acc, c) => {
      acc[c.completed_at] = (acc[c.completed_at] || 0) + 1
      return acc
    }, {})

    const current = new Date(start)
    while (current <= end) {
      const dateStr = getDateString(current)
      result.push({ date: dateStr, count: countByDate[dateStr] || 0 })
      current.setDate(current.getDate() + 1)
    }
    return result
  }, [completions])

  const maxCount = Math.max(...days.map((d) => d.count), 1)

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Calendar size={18} className="text-violet-400" />
        <h3 className="font-semibold text-white">Activity (Last 12 Weeks)</h3>
      </div>
      <div className="flex gap-1 flex-wrap">
        {days.map((day) => {
          const intensity = day.count === 0 ? 0 : Math.ceil((day.count / maxCount) * 4)
          const colors = [
            'bg-white/5',
            'bg-violet-900/60',
            'bg-violet-700/70',
            'bg-violet-500/80',
            'bg-violet-400',
          ]
          return (
            <div
              key={day.date}
              title={`${day.date}: ${day.count} completions`}
              className={`w-3 h-3 rounded-sm ${colors[intensity]} transition-colors`}
            />
          )
        })}
      </div>
      <div className="flex items-center gap-1 mt-3 text-xs text-gray-600">
        <span>Less</span>
        {['bg-white/5', 'bg-violet-900/60', 'bg-violet-700/70', 'bg-violet-500/80', 'bg-violet-400'].map((c, i) => (
          <div key={i} className={`w-3 h-3 rounded-sm ${c}`} />
        ))}
        <span>More</span>
      </div>
    </div>
  )
}

export default function AnalyticsClient({ habits, completions, dbStreak }: Props) {
  const today = getTodayString()

  const stats = useMemo(() => {
    const todayCount = completions.filter((c) => c.completed_at === today).length
    const completionRate = habits.length > 0 ? Math.round((todayCount / habits.length) * 100) : 0

    const total30Days = completions.length
    const possibleMax = habits.length * 30
    const rate30 = possibleMax > 0 ? Math.round((total30Days / possibleMax) * 100) : 0

    return { streak: dbStreak, completionRate, rate30, totalCompletions: completions.length }
  }, [completions, habits, today, dbStreak])

  const statCards = [
    { icon: Flame, label: 'Current Streak', value: `${stats.streak}d`, color: 'text-orange-400', bg: 'from-orange-500/10 to-red-500/5' },
    { icon: Target, label: "Today's Rate", value: `${stats.completionRate}%`, color: 'text-violet-400', bg: 'from-violet-500/10 to-purple-500/5' },
    { icon: TrendingUp, label: '30-Day Rate', value: `${stats.rate30}%`, color: 'text-emerald-400', bg: 'from-emerald-500/10 to-teal-500/5' },
    { icon: Calendar, label: 'Total Check-ins', value: stats.totalCompletions.toString(), color: 'text-pink-400', bg: 'from-pink-500/10 to-rose-500/5' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">Your habit performance overview</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`rounded-2xl p-5 bg-gradient-to-br ${card.bg} border border-white/5`}
          >
            <card.icon size={20} className={`${card.color} mb-3`} />
            <p className="text-2xl font-bold text-white mb-1">{card.value}</p>
            <p className="text-gray-500 text-sm">{card.label}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <HeatMap completions={completions} />
      </motion.div>

      {/* Per-habit breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6"
      >
        <h3 className="text-white font-semibold mb-4">Habit Breakdown</h3>
        <div className="space-y-3">
          {habits.map((habit) => {
            const habitCompletions = completions.filter((c) => c.habit_id === habit.id)
            const rate = Math.round((habitCompletions.length / 30) * 100)
            const streak = calculateStreak(habitCompletions.map((c) => c.completed_at))
            return (
              <div key={habit.id} className="glass rounded-xl p-4 flex items-center gap-4">
                <span
                  className="text-xl w-10 h-10 flex items-center justify-center rounded-xl flex-shrink-0"
                  style={{ backgroundColor: `${habit.color}20` }}
                >
                  {habit.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-white text-sm truncate">{habit.name}</p>
                    <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{streak}d streak</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${Math.min(rate, 100)}%`, backgroundColor: habit.color }}
                    />
                  </div>
                </div>
                <span className="text-sm font-semibold text-white flex-shrink-0">{Math.min(rate, 100)}%</span>
              </div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}
