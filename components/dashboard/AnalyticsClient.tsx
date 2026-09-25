'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Flame, TrendingUp, Target, Calendar, BarChart3, Activity } from 'lucide-react'
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
    start.setDate(start.getDate() - 83) // 12 weeks (84 days)

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
    <div className="bg-[#1c1c1e] rounded-2xl p-6 relative overflow-hidden">
      {/* Background glow */}
      

      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <Activity size={20} className="text-blue-500" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Consistency Graph</h3>
            <p className="text-xs text-gray-400">Last 12 weeks of activity</p>
          </div>
        </div>
      </div>

      <div className="relative z-10 overflow-x-auto custom-scrollbar pb-2">
        <div className="inline-grid grid-rows-7 grid-flow-col gap-1.5 md:gap-2">
          {days.map((day) => {
            const intensity = day.count === 0 ? 0 : Math.ceil((day.count / maxCount) * 4)
            const colors = [
              'bg-white/5 border-white/5',
              'bg-blue-900/40 border-blue-800/30',
              'bg-blue-600/60 border-blue-500/40',
              'bg-blue-500/80 border-blue-400/50',
              'bg-blue-400 border-blue-300',
            ]
            return (
              <div
                key={day.date}
                title={`${day.date}: ${day.count} completions`}
                className={`w-3.5 h-3.5 md:w-4 md:h-4 rounded-[4px] border transition-all duration-300 hover:scale-125 ${colors[intensity]} cursor-pointer`}
              />
            )
          })}
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 mt-4 text-xs text-gray-500 font-medium relative z-10">
        <span>Less</span>
        {['bg-white/5', 'bg-blue-900/40', 'bg-blue-600/60', 'bg-blue-500/80', 'bg-blue-400'].map((c, i) => (
          <div key={i} className={`w-3 h-3 rounded-[3px] ${c.split(' ')[0]}`} />
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
    { icon: Flame, label: 'Current Streak', value: `${stats.streak}d`, color: 'text-blue-500', bg: 'from-orange-500/10 to-red-500/5', shadow: 'shadow-orange-500/10' },
    { icon: Target, label: "Today's Rate", value: `${stats.completionRate}%`, color: 'text-blue-500', bg: 'from-emerald-500/10 to-teal-500/5', shadow: 'shadow-emerald-500/10' },
    { icon: TrendingUp, label: '30-Day Rate', value: `${stats.rate30}%`, color: 'text-blue-400', bg: 'from-blue-500/10 to-cyan-500/5', shadow: 'shadow-blue-500/10' },
    { icon: Calendar, label: 'Total Check-ins', value: stats.totalCompletions.toString(), color: 'text-blue-500', bg: 'from-pink-500/10 to-rose-500/5', shadow: 'shadow-pink-500/10' },
  ]

  return (
    <div className="relative min-h-[calc(100vh-4rem)] pb-24 md:pb-8">
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-20 left-0 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full opacity-40" />
        <div className="absolute bottom-20 right-0 w-[600px] h-[600px] bg-violet-600/10 blur-[150px] rounded-full opacity-30" />
      </div>

      <div className="max-w-5xl mx-auto py-8 px-4">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/50 tracking-tight mb-3">
            Performance
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl">
            Analyze your consistency, track your growth, and watch your habits bloom.
          </p>
        </motion.div>

        {/* Bento Box Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {statCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative overflow-hidden rounded-2xl md:rounded-3xl p-4 md:p-6 bg-[#1c1c1e] border-transparent group hover:scale-105 transition-transform duration-300`}
            >
              <div className={`absolute -right-4 -top-4 w-24 h-24 ${card.bg.split(' ')[0]} rounded-full blur-[40px] opacity-50 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <card.icon size={24} className={`${card.color} mb-4 relative z-10`} />
              <div className="relative z-10">
                <p className="text-2xl md:text-4xl font-black text-white mb-1 tracking-tight">{card.value}</p>
                <p className="text-gray-400 text-xs md:text-sm font-medium uppercase tracking-wider">{card.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Heatmap Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <HeatMap completions={completions} />
        </motion.div>

        {/* Detailed Breakdown Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#1c1c1e] border-transparent rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <BarChart3 size={20} className="text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold text-white">Habit Breakdown</h3>
              <p className="text-xs text-gray-400">Your success rate per habit (Last 30 Days)</p>
            </div>
          </div>

          <div className="flex flex-col">
            {habits.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No active habits to track yet.</p>
            ) : (
              habits.map((habit) => {
                const habitCompletions = completions.filter((c) => c.habit_id === habit.id)
                const rate = Math.round((habitCompletions.length / 30) * 100)
                const streak = calculateStreak(habitCompletions.map((c) => c.completed_at))
                
                return (
                  <div key={habit.id} className="group flex items-center gap-4 py-3.5 border-b border-[#2c2c2e] last:border-b-0 transition-colors duration-300">
                    <span
                      className="text-2xl w-14 h-14 flex items-center justify-center rounded-xl flex-shrink-0 shadow-inner"
                      style={{ backgroundColor: `${habit.color}15` }}
                    >
                      {habit.icon}
                    </span>
                    
                    <div className="flex-1 min-w-0 py-1 flex flex-col justify-center">
                      <div className="flex items-start justify-between mb-2 gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-white text-sm md:text-base leading-tight line-clamp-2">{habit.name}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Flame size={12} className="text-blue-500" />
                            <span className="text-xs font-bold text-gray-400">{streak} Day Streak</span>
                          </div>
                        </div>
                        <span className="text-sm md:text-base font-black text-white flex-shrink-0 pt-0.5">{Math.min(rate, 100)}%</span>
                      </div>
                      
                      <div className="h-1.5 bg-[#2c2c2e] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-1000 ease-out "
                          style={{ 
                            width: `${Math.min(rate, 100)}%`, 
                            backgroundColor: habit.color,
                            boxShadow: 'none'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
