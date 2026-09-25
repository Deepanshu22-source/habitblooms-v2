'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Check, Circle, Loader2, Trash2, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Todo } from '@/lib/supabase/types'

export default function TodosTab() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [scheduledTime, setScheduledTime] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    loadTodos()
  }, [])

  const loadTodos = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      
    if (data) setTodos(data)
    setLoading(false)
  }

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskTitle.trim() || isAdding) return

    setIsAdding(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const newTodo = {
      user_id: user.id,
      title: newTaskTitle.trim(),
      is_completed: false,
      scheduled_time: scheduledTime || null
    }

    const { data, error } = await supabase
      .from('todos')
      .insert([newTodo])
      .select()
      .single()

    if (data && !error) {
      setTodos([data, ...todos])
      setNewTaskTitle('')
      setScheduledTime('')
    }
    setIsAdding(false)
  }

  const handleToggleTodo = async (todo: Todo) => {
    // Optimistic update
    setTodos(todos.map(t => t.id === todo.id ? { ...t, is_completed: !t.is_completed } : t))
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Update DB
    await supabase
      .from('todos')
      .update({ is_completed: !todo.is_completed })
      .eq('id', todo.id)

    // Reward seeds if checking OFF (not unchecking)
    if (!todo.is_completed) {
      const { data: profile } = await supabase.from('profiles').select('score, seeds').eq('id', user.id).single()
      if (profile) {
        await supabase.from('profiles').update({
          score: profile.score + 5,
          seeds: profile.seeds + 5
        }).eq('id', user.id)
      }
    }
  }

  const handleDeleteTodo = async (id: string) => {
    setTodos(todos.filter(t => t.id !== id))
    await supabase.from('todos').delete().eq('id', id)
  }

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-500" /></div>
  }

  
  const activeTodos = todos.filter(t => !t.is_completed).sort((a, b) => {
    if (a.scheduled_time && b.scheduled_time) return a.scheduled_time.localeCompare(b.scheduled_time)
    if (a.scheduled_time) return -1
    if (b.scheduled_time) return 1
    return 0
  })
  const completedTodos = todos.filter(t => t.is_completed)

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 md:px-0">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-2">Daily Schedule</h1>
        <p className="text-gray-400">Map out your day. Earn 5 seeds for every task completed.</p>
      </motion.div>

      {/* Add Task Input */}
      <form onSubmit={handleAddTodo} className="mb-8">
        <div className="flex bg-[#1c1c1e] rounded-2xl border border-transparent focus-within:border-blue-500/30 transition-colors shadow-sm overflow-hidden p-1.5">
          <input
            type="time"
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
            className="bg-transparent text-gray-400 px-4 outline-none border-r border-[#2c2c2e] focus:text-blue-400 transition-colors cursor-pointer"
          />
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="What's the plan?"
            className="flex-1 bg-transparent text-white px-4 py-3 outline-none"
          />
          <button
            type="submit"
            disabled={!newTaskTitle.trim() || isAdding}
            className="aspect-square bg-blue-500 text-white rounded-xl flex items-center justify-center hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-blue-500 transition-colors px-4"
          >
            {isAdding ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} />}
          </button>
        </div>
      </form>

      {/* Tasks List */}
      <div className="bg-[#1c1c1e] rounded-2xl overflow-hidden shadow-sm border border-transparent">
        <div className="flex flex-col">
          {activeTodos.length === 0 && completedTodos.length === 0 && (
            <div className="py-12 text-center text-gray-500">
              <Check size={48} className="mx-auto mb-4 opacity-20" />
              <p>You&apos;re all caught up!</p>
            </div>
          )}

          <AnimatePresence mode="popLayout">
            {activeTodos.map(todo => (
              <motion.div
                layout
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                key={todo.id}
                className="group flex items-center gap-4 py-3.5 px-4 border-b border-[#2c2c2e] last:border-b-0 transition-colors duration-300 hover:bg-white/[0.02]"
              >
                <button
                  onClick={() => handleToggleTodo(todo)}
                  className="w-6 h-6 shrink-0 flex items-center justify-center rounded-full border border-gray-500 bg-transparent text-transparent hover:border-gray-400 transition-all"
                >
                  <Check size={14} className="opacity-0" strokeWidth={3} />
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col">
                    <span className="text-[16px] text-white tracking-tight">{todo.title}</span>
                    {todo.scheduled_time && (
                      <div className="flex items-center gap-1 mt-0.5 text-blue-400">
                        <Clock size={12} />
                        <span className="text-[11px] font-bold tracking-wider">{todo.scheduled_time}</span>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-gray-500 hover:text-red-400 transition-all shrink-0"
                >
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))}

            {/* Completed Tasks */}
            {completedTodos.length > 0 && (
              <div className="pt-4 pb-2 px-4 border-t border-[#2c2c2e] bg-[#1a1a1c]">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Completed</h3>
                {completedTodos.map(todo => (
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={todo.id}
                    className="group flex items-center gap-4 py-2.5 transition-colors duration-300"
                  >
                    <button
                      onClick={() => handleToggleTodo(todo)}
                      className="w-6 h-6 shrink-0 flex items-center justify-center rounded-full border border-blue-500 bg-blue-500 text-white transition-all"
                    >
                      <Check size={14} className="opacity-100" strokeWidth={3} />
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col">
                      <span className="text-[16px] text-gray-500 line-through tracking-tight">{todo.title}</span>
                      {todo.scheduled_time && (
                        <div className="flex items-center gap-1 mt-0.5 text-gray-600">
                          <Clock size={12} />
                          <span className="text-[11px] font-bold tracking-wider line-through">{todo.scheduled_time}</span>
                        </div>
                      )}
                    </div>
                    </div>
                    <button
                      onClick={() => handleDeleteTodo(todo.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-gray-600 hover:text-red-400 transition-all shrink-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
