import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2, ChevronUp, ChevronDown, Bell } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Habit } from '@/lib/supabase/types'

const ICONS = ['🌸', '💪', '📚', '🏃', '💧', '🧘', '✍️', '🎯', '🌿', '🍎', '😴', '🎵', '🧠', '❤️', '⭐']
const COLORS = [
  '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#3b82f6',
  '#ef4444', '#06b6d4', '#84cc16', '#f97316', '#6366f1',
]
const CATEGORIES = ['general', 'health', 'fitness', 'mindfulness', 'learning', 'productivity', 'nutrition', 'sleep']

interface Props {
  onClose: () => void
  onHabitAdded: (habit: Habit) => void
}

export default function AddHabitModal({ onClose, onHabitAdded }: Props) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [icon, setIcon] = useState('🌸')
  const [color, setColor] = useState('#8b5cf6')
  const [category, setCategory] = useState('general')
  
  // Custom Time Picker State
  const [reminderEnabled, setReminderEnabled] = useState(false)
  const [hour, setHour] = useState(8)
  const [minute, setMinute] = useState(0)
  const [ampm, setAmpm] = useState<'AM' | 'PM'>('AM')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  const handleTimeChange = (type: 'hour' | 'minute', direction: 'up' | 'down') => {
    if (type === 'hour') {
      if (direction === 'up') setHour(prev => prev === 12 ? 1 : prev + 1)
      if (direction === 'down') setHour(prev => prev === 1 ? 12 : prev - 1)
    } else {
      if (direction === 'up') setMinute(prev => prev === 55 ? 0 : prev + 5)
      if (direction === 'down') setMinute(prev => prev === 0 ? 55 : prev - 5)
    }
  }

  const getFormatted24hTime = () => {
    if (!reminderEnabled) return null
    let h24 = hour
    if (ampm === 'PM' && hour !== 12) h24 += 12
    if (ampm === 'AM' && hour === 12) h24 = 0
    return `${h24.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setLoading(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      const { data, error: err } = await supabase
        .from('habits')
        .insert({
          user_id: user.id,
          name: name.trim(),
          description: description.trim() || null,
          icon,
          color,
          category,
          reminder_time: getFormatted24hTime(),
        })
        .select()
        .single()

      if (err) {
        setError(err.message)
        return
      }

      if (data) {
        onHabitAdded(data)
        onClose()
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to add habit')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        className="w-full max-w-md bg-[#0d0d1a] border border-white/10 rounded-3xl p-6 pb-10 sm:pb-6 pb-safe shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">New Habit</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">Habit name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Morning run"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/50 transition-colors"
              autoFocus
              maxLength={60}
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">Description (optional)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Run 5km every morning"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/50 transition-colors"
              maxLength={120}
            />
          </div>

          {/* Icon */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Icon</label>
            <div className="flex flex-wrap gap-2">
              {ICONS.map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIcon(i)}
                  className={`w-10 h-10 rounded-xl text-xl transition-all ${
                    icon === i ? 'bg-violet-500/30 ring-2 ring-violet-500' : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Color</label>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full transition-all ${
                    color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0d0d1a] scale-110' : ''
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-sm capitalize transition-all ${
                    category === cat
                      ? 'bg-violet-500 text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Sleek Reminder Time Picker */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-lg ${reminderEnabled ? 'bg-violet-500/20 text-violet-400' : 'bg-white/5 text-gray-500'}`}>
                  <Bell size={16} />
                </div>
                <div>
                  <h4 className="text-white text-sm font-medium">Daily Reminder</h4>
                  <p className="text-xs text-gray-500">Get a push notification</p>
                </div>
              </div>
              
              {/* Custom Toggle */}
              <button
                type="button"
                onClick={() => setReminderEnabled(!reminderEnabled)}
                className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${reminderEnabled ? 'bg-violet-500' : 'bg-white/10'}`}
              >
                <motion.div
                  layout
                  className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm"
                  animate={{ x: reminderEnabled ? 24 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </div>

            <AnimatePresence>
              {reminderEnabled && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center justify-center gap-2 sm:gap-6 py-4 px-2 bg-[#05050a] rounded-xl border border-white/5 shadow-inner mt-2">
                    
                    {/* Hour */}
                    <div className="flex flex-col items-center">
                      <button type="button" onClick={() => handleTimeChange('hour', 'up')} className="p-2 text-gray-500 hover:text-violet-400 transition-colors"><ChevronUp size={24}/></button>
                      <div className="text-3xl sm:text-4xl font-black text-white w-12 sm:w-16 text-center tracking-tighter">
                        {hour.toString().padStart(2, '0')}
                      </div>
                      <button type="button" onClick={() => handleTimeChange('hour', 'down')} className="p-2 text-gray-500 hover:text-violet-400 transition-colors"><ChevronDown size={24}/></button>
                    </div>

                    <div className="text-2xl sm:text-3xl font-bold text-violet-500/50 mb-2">:</div>

                    {/* Minute */}
                    <div className="flex flex-col items-center">
                      <button type="button" onClick={() => handleTimeChange('minute', 'up')} className="p-2 text-gray-500 hover:text-violet-400 transition-colors"><ChevronUp size={24}/></button>
                      <div className="text-3xl sm:text-4xl font-black text-white w-12 sm:w-16 text-center tracking-tighter">
                        {minute.toString().padStart(2, '0')}
                      </div>
                      <button type="button" onClick={() => handleTimeChange('minute', 'down')} className="p-2 text-gray-500 hover:text-violet-400 transition-colors"><ChevronDown size={24}/></button>
                    </div>

                    {/* AM / PM */}
                    <div className="flex flex-col gap-2 ml-2 sm:ml-4">
                      <button
                        type="button"
                        onClick={() => setAmpm('AM')}
                        className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                          ampm === 'AM' ? 'bg-violet-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]' : 'bg-white/5 text-gray-500 hover:bg-white/10'
                        }`}
                      >
                        AM
                      </button>
                      <button
                        type="button"
                        onClick={() => setAmpm('PM')}
                        className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                          ampm === 'PM' ? 'bg-violet-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]' : 'bg-white/5 text-gray-500 hover:bg-white/10'
                        }`}
                      >
                        PM
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-pink-600 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : '🌱 Add Habit'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  )
}
