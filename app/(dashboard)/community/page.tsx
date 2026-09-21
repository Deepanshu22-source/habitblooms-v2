'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Trophy, Activity, Flame, ChevronRight, UserCircle, Settings } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import type { User } from '@supabase/supabase-js'

// Community Feature with Hybrid Ghost Engine

export default function CommunityPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [examGoal, setExamGoal] = useState<string | null>(null)
  
  // State for our Hybrid Engine
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [fullLeaderboard, setFullLeaderboard] = useState<any[]>([])
  const [feed, setFeed] = useState<any[]>([])
  
  // Modal State
  const [showModal, setShowModal] = useState(false)
  
  const supabase = createClient()

  useEffect(() => {
    async function loadCommunityData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      setUser(user)
      const userGoal = user.user_metadata?.exam_goal || null
      setExamGoal(userGoal)

      if (userGoal) {
        // 1. Try to fetch REAL data from our new tables
        const { data: realProfiles } = await supabase
          .from('profiles')
          .select('*')
          .eq('exam_goal', userGoal)
          .order('score', { ascending: false })
          .limit(50) as { data: any[] | null }

        const { data: realFeed } = await supabase
          .from('activity_feed')
          .select('*')
          .eq('exam_goal', userGoal)
          .order('created_at', { ascending: false })
          .limit(20) as { data: any[] | null }

        // 2. The Ghost Data (Cold Start Bots)
        const today = new Date().getDate()
        const ghostUsers = [
          { id: 'g-1', name: 'Aditi Sharma', avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=Aditi', score: 85 + (today % 10), streak: 45, isMe: false },
          { id: 'g-2', name: 'Rahul Kumar', avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=Rahul', score: 70 + (today % 15), streak: 12, isMe: false },
          { id: 'g-3', name: 'Sneha P.', avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=Sneha', score: 65 + (today % 5), streak: 5, isMe: false },
          { id: 'g-4', name: 'Vikram Singh', avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=Vikram', score: 40 + (today % 20), streak: 2, isMe: false },
          { id: 'g-5', name: 'Priya Patel', avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=Priya', score: 35, streak: 1, isMe: false },
          { id: 'g-6', name: 'Karan J.', avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=Karan', score: 30, streak: 1, isMe: false },
          { id: 'g-7', name: 'Neha Gupta', avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=Neha', score: 28, streak: 0, isMe: false },
          { id: 'g-8', name: 'Arjun Das', avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=Arjun', score: 25, streak: 2, isMe: false },
          { id: 'g-9', name: 'Diya Reddy', avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=Diya', score: 20, streak: 0, isMe: false },
          { id: 'g-10', name: 'Rohan Joshi', avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=Rohan', score: 15, streak: 0, isMe: false },
          { id: 'g-11', name: 'Kavya Nair', avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=Kavya', score: 10, streak: 1, isMe: false },
          { id: 'g-12', name: 'Ishaan Verma', avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=Ishaan', score: 5, streak: 0, isMe: false },
        ]

        const ghostFeed = [
          { id: 'f-1', name: 'Aditi Sharma', avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=Aditi', action: 'completed', habit: 'Mock Test Analysis', time: 'Just now' },
          { id: 'f-2', name: 'Rahul Kumar', avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=Rahul', action: 'is on a 12-day streak!', habit: '', time: '2m ago' },
          { id: 'f-3', name: 'Priya Patel', avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=Priya', action: 'started a new habit:', habit: 'Wake up at 6 AM', time: '5m ago' },
          { id: 'f-4', name: 'Vikram Singh', avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=Vikram', action: 'completed', habit: 'Optional Subject Review', time: '12m ago' },
          { id: 'f-5', name: 'Sneha P.', avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=Sneha', action: 'completed', habit: 'Read Hindu Editorial', time: '15m ago' },
          { id: 'f-6', name: 'Karan J.', avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=Karan', action: 'completed all daily habits! 🌸', habit: '', time: '28m ago' },
          { id: 'f-7', name: 'Neha Gupta', avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=Neha', action: 'completed', habit: 'Current Affairs Notes', time: '45m ago' },
          { id: 'f-8', name: 'Aditi Sharma', avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=Aditi', action: 'completed', habit: 'Meditation (10m)', time: '1h ago' },
        ]

        // 3. Format Real Profiles
        const formattedRealProfiles = (realProfiles || []).map(p => ({
          id: p.id,
          name: p.full_name || 'Anonymous',
          avatar: p.avatar_url || '',
          score: p.score || 0,
          streak: p.streak || 0,
          isMe: p.id === user.id
        }))

        // Ensure "You" are always in the list
        const hasMe = formattedRealProfiles.some(p => p.isMe)
        if (!hasMe) {
          formattedRealProfiles.push({
            id: user.id,
            name: user.user_metadata?.full_name || 'You',
            avatar: user.user_metadata?.avatar_url || '',
            score: 0,
            streak: 0,
            isMe: true
          })
        }

        // 4. Merge & Sort Leaderboard
        const combinedLeaderboard = [...formattedRealProfiles]
        // Only inject ghosts if we have less than 10 real users
        if (formattedRealProfiles.length < 10) {
          const slotsToFill = 10 - formattedRealProfiles.length
          combinedLeaderboard.push(...ghostUsers.slice(0, slotsToFill))
        }
        
        combinedLeaderboard.sort((a, b) => b.score - a.score)
        
        setFullLeaderboard(combinedLeaderboard) // The complete list for the modal
        setLeaderboard(combinedLeaderboard.slice(0, 5)) // Top 5 for the main page

        // 5. Format and Merge Feed
        const formattedRealFeed = (realFeed || []).map((f: any) => ({
          id: f.id,
          name: f.habit_name ? 'A squad member' : 'Someone',
          avatar: '',
          action: f.action,
          habit: f.habit_name,
          time: 'Recently'
        }))

        const combinedFeed = [...formattedRealFeed]
        if (formattedRealFeed.length < 5) {
          combinedFeed.push(...ghostFeed)
        }
        setFeed(combinedFeed)
      }
      setLoading(false)
    }

    loadCommunityData()
  }, [supabase])

  if (loading) return <div className="flex justify-center py-20"><Activity className="animate-spin text-violet-500" /></div>

  // If the user hasn't set an exam goal in their profile yet
  if (!examGoal) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-3xl p-12 max-w-md w-full border border-violet-500/20 shadow-[0_0_50px_rgba(139,92,246,0.1)] relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-pink-500" />
          <Users size={64} className="mx-auto text-violet-400 mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">Join a Squad</h2>
          <p className="text-gray-400 mb-8">
            You haven&apos;t set a Target Goal yet. Set your goal in your profile to automatically join a live community of peers aiming for the same target!
          </p>
          <Link href="/profile">
            <button className="bg-gradient-to-r from-violet-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold hover:scale-105 transition-transform flex items-center gap-2 mx-auto shadow-lg shadow-violet-500/25">
              <Settings size={20} />
              Set My Goal Now
            </button>
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 relative">
      {/* Header Section */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-medium mb-3">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            {Math.max(fullLeaderboard.length * 18, 120)} Online Now
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            {examGoal} Squad
          </h1>
          <p className="text-gray-400">Compete, stay accountable, and bloom together.</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Live Feed (The YPT Effect) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <Activity className="text-pink-400" size={20} /> Live Activity
            </h3>
          </div>

          <div className="glass rounded-2xl p-6 border border-white/5 relative overflow-hidden h-[500px]">
            {/* Fade overlays for scrolling effect */}
            <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-[#030712] to-transparent z-10 rounded-t-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#030712] to-transparent z-10 rounded-b-2xl pointer-events-none" />

            <div className="space-y-4 overflow-y-auto h-full pr-2 custom-scrollbar pt-4 pb-4">
              {feed.map((feedItem, idx) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.15 }}
                  key={feedItem.id} 
                  className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10 shrink-0 flex items-center justify-center">
                    {feedItem.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={feedItem.avatar} alt={feedItem.name} className="w-full h-full object-cover" />
                    ) : (
                       <UserCircle className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-300">
                      <span className="font-semibold text-white">{feedItem.name}</span> {feedItem.action} 
                      {feedItem.habit && <span className="text-violet-300 font-medium"> &quot;{feedItem.habit}&quot;</span>}
                    </p>
                    <span className="text-xs text-gray-500 mt-1 block">{feedItem.time}</span>
                  </div>
                </motion.div>
              ))}
              
              {/* Fake pulse item to look like a live feed */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-center text-xs text-gray-500 py-4"
              >
                Waiting for new activity...
              </motion.div>
            </div>
          </div>
        </div>

        {/* Right Column: Leaderboard (The Strava/Duolingo Effect) */}
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <Trophy className="text-yellow-400" size={20} /> Weekly League
            </h3>
          </div>

          <div className="glass rounded-2xl p-6 border border-white/5">
            <p className="text-xs text-gray-400 mb-6 uppercase tracking-wider font-medium text-center border-b border-white/10 pb-4">
              Top 10% advance to Gold League
            </p>

            <div className="space-y-3">
              {leaderboard.map((boardUser, index) => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  key={boardUser.id} 
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                    boardUser.isMe 
                      ? 'bg-violet-500/20 border border-violet-500/30' 
                      : 'hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className={`font-bold text-sm w-5 text-center ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-300' : index === 2 ? 'text-amber-600' : 'text-gray-500'}`}>
                    {index + 1}
                  </div>
                  
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-white/10 shrink-0 flex items-center justify-center">
                    {boardUser.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={boardUser.avatar} alt={boardUser.name} className="w-full h-full object-cover" />
                    ) : (
                      <UserCircle className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm truncate font-medium ${boardUser.isMe ? 'text-violet-300' : 'text-white'}`}>
                      {boardUser.name}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Flame size={12} className="text-orange-400" /> {boardUser.streak} day streak
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-bold text-white">{boardUser.score}</div>
                    <div className="text-[10px] text-gray-500">pts</div>
                  </div>
                </motion.div>
              ))}
            </div>

            <button 
              onClick={() => setShowModal(true)}
              className="w-full mt-6 py-3 rounded-xl border border-white/10 text-gray-300 text-sm font-medium hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
            >
              View Full Leaderboard <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* FULL LEADERBOARD MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="glass w-full max-w-md max-h-[85vh] rounded-3xl p-6 relative flex flex-col shadow-[0_0_50px_rgba(139,92,246,0.2)] border border-white/10"
          >
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-full"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
            
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
              <Trophy className="text-yellow-400" /> Squad Standings
            </h2>
            <p className="text-sm text-gray-400 mb-6 pb-4 border-b border-white/10">
              Only the top 10% advance to Gold League this Sunday.
            </p>

            <div className="overflow-y-auto flex-1 space-y-2 custom-scrollbar pr-2 pb-4">
              {fullLeaderboard.map((boardUser, index) => (
                <div 
                  key={boardUser.id} 
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                    boardUser.isMe 
                      ? 'bg-violet-500/20 border border-violet-500/30' 
                      : 'hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className={`font-bold text-sm w-6 text-center ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-300' : index === 2 ? 'text-amber-600' : 'text-gray-500'}`}>
                    #{index + 1}
                  </div>
                  
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10 shrink-0 flex items-center justify-center">
                    {boardUser.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={boardUser.avatar} alt={boardUser.name} className="w-full h-full object-cover" />
                    ) : (
                      <UserCircle className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm truncate font-medium ${boardUser.isMe ? 'text-violet-300' : 'text-white'}`}>
                      {boardUser.name}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Flame size={12} className="text-orange-400" /> {boardUser.streak} day streak
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-bold text-white">{boardUser.score}</div>
                    <div className="text-[10px] text-gray-500">pts</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
