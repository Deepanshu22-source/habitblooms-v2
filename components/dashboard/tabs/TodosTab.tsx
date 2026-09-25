'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Check, Circle, Loader2, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Todo } from '@/lib/supabase/types'

export default function TodosTab() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [newTaskTitle, setNewTaskTitle] = useState('')
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
      is_completed: false
    }

    const { data, error } = await supabase
      .from('todos')
      .insert([newTodo])
      .select()
      .single()

    if (data && !error) {
      setTodos([data, ...todos])
      setNewTaskTitle('')
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

  const activeTodos = todos.filter(t => !t.is_completed)
  const completedTodos = todos.filter(t => t.is_completed)

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 md:px-0">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-2">To-Do List</h1>
        <p className="text-gray-400">One-off tasks and chores. Earn 5 seeds for every task completed.</p>
      </motion.div>

      {/* Add Task Input */}
      <form onSubmit={handleAddTodo} className="mb-8 relative">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="What needs to be done?"
          className="w-full bg-[#1c1c1e] text-white rounded-2xl px-5 py-4 outline-none border border-transparent focus:border-blue-500/30 transition-colors shadow-sm"
        />
        <button
          type="submit"
          disabled={!newTaskTitle.trim() || isAdding}
          className="absolute right-2 top-2 bottom-2 aspect-square bg-blue-500 text-white rounded-xl flex items-center justify-center hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-blue-500 transition-colors"
        >
          {isAdding ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} />}
        </button>
      </form>

      {/* Tasks List */}
      <div className="bg-[#1c1c1e] rounded-2xl overflow-hidden shadow-sm border border-transparent">
        <div className="flex flex-col">
          {activeTodos.length === 0 && completedTodos.length === 0 && (
            <div className="py-12 text-center text-gray-500">
              <Check size={48} className="mx-auto mb-4 opacity-20" />
              <p>You're all caught up!</p>
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
                  <span className="text-[16px] text-white tracking-tight">{todo.title}</span>
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
                      <span className="text-[16px] text-gray-500 line-through tracking-tight">{todo.title}</span>
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
