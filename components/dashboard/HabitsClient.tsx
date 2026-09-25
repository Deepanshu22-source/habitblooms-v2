'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Archive, Flower2, Edit2 } from 'lucide-react'
import AddHabitModal from './AddHabitModal'
import EditHabitModal from './EditHabitModal'
import { createClient } from '@/lib/supabase/client'
import type { Habit } from '@/lib/supabase/types'

export default function HabitsClient({ initialHabits }: { initialHabits: Habit[] }) {
  const [habits, setHabits] = useState(initialHabits)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
  const supabase = createClient()

  const handleHabitAdded = (habit: Habit) => setHabits((p) => [...p, habit])
  const handleHabitUpdated = (habit: Habit) => setHabits((p) => p.map(h => h.id === habit.id ? habit : h))

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    await supabase.from('habits').delete().eq('id', id)
    setHabits((p) => p.filter((h) => h.id !== id))
  }

  const handleArchive = async (id: string) => {
    await supabase.from('habits').update({ is_archived: true }).eq('id', id)
    setHabits((p) => p.filter((h) => h.id !== id))
  }

  const active = habits.filter((h) => !h.is_archived)

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">All Habits</h1>
          <p className="text-gray-500 text-sm mt-1">{active.length} active habits</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-pink-600 rounded-xl text-white text-sm font-medium hover:scale-105 transition-transform shadow-lg shadow-violet-500/20"
        >
          <Plus size={16} /> New Habit
        </button>
      </div>

      {active.length === 0 && (
        <div className="text-center py-20">
          <Flower2 size={48} className="text-gray-700 mx-auto mb-4" />
          <p className="text-gray-500">No habits yet. Add one to get started!</p>
        </div>
      )}

      <div className="bg-[#131b2f] border border-white/5 rounded-2xl overflow-hidden">
        <AnimatePresence>
          {active.map((habit, i) => (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: i * 0.04 }}
              className="px-4 py-3.5 flex items-center gap-4 group border-b border-white/5 last:border-b-0 hover:bg-white/[0.02] transition-colors"
            >
              <span
                className="text-2xl w-12 h-12 flex items-center justify-center rounded-xl flex-shrink-0"
                style={{ backgroundColor: `${habit.color}20` }}
              >
                {habit.icon}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white">{habit.name}</p>
                {habit.description && (
                  <p className="text-gray-500 text-sm truncate">{habit.description}</p>
                )}
                <span className="text-xs text-gray-600 capitalize">
                  {habit.category} · {habit.target_days?.length === 7 ? 'Every Day' : `${habit.target_days?.length} days/week`} {habit.reminder_time ? `· ${habit.reminder_time}` : ''}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingHabit(habit)}
                  className="p-2 text-gray-600 hover:text-white transition-colors"
                  title="Edit Habit"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleArchive(habit.id)}
                  className="p-2 text-gray-600 hover:text-yellow-400 transition-colors"
                  title="Archive"
                >
                  <Archive size={16} />
                </button>
                <button
                  onClick={() => handleDelete(habit.id, habit.name)}
                  className="p-2 text-gray-600 hover:text-red-400 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showAddModal && (
          <AddHabitModal
            onClose={() => setShowAddModal(false)}
            onHabitAdded={handleHabitAdded}
          />
        )}
        {editingHabit && (
          <EditHabitModal
            habit={editingHabit}
            onClose={() => setEditingHabit(null)}
            onHabitUpdated={handleHabitUpdated}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
