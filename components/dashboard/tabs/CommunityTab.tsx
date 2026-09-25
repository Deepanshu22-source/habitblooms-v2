'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Trophy, Flame, Activity, UserCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { getTodayString } from '@/lib/utils'

interface Props {
  onNavigateToProfile?: () => void
}

export default function CommunityTab({ onNavigateToProfile }: Props) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [examGoal, setExamGoal] = useState<string>('UPSC')
  const [activeView, setActiveView] = useState<'leaderboard' | 'feed'>('leaderboard')
  
  // Dummy data for visual effect
  const fullLeaderboard = [
    { id: '1', name: 'Priya S.', score: 1450, streak: 45, avatar: null, isMe: false },
    { id: '2', name: 'Rahul K.', score: 1320, streak: 32, avatar: null, isMe: false },
    { id: '3', name: 'You', score: 1280, streak: 28, avatar: null, isMe: true },
    { id: '4', name: 'Anjali M.', score: 1150, streak: 21, avatar: null, isMe: false },
    { id: '5', name: 'Vikram D.', score: 1090, streak: 18, avatar: null, isMe: false },
    { id: '6', name: 'Sneha R.', score: 980, streak: 15, avatar: null, isMe: false },
    { id: '7', name: 'Karan B.', score: 920, streak: 14, avatar: null, isMe: false },
    { id: '8', name: 'Neha G.', score: 850, streak: 12, avatar: null, isMe: false },
    { id: '9', name: 'Amit P.', score: 780, streak: 10, avatar: null, isMe: false },
    { id: '10', name: 'Riya T.', score: 710, streak: 8, avatar: null, isMe: false },
  ]

  const feed = [
    { id: '1', name: 'Priya S.', action: 'completed', habit: 'Mock Test CSAT', time: '2m ago', avatar: null },
    { id: '2', name: 'Anjali M.', action: 'completed', habit: 'Read The Hindu', time: '15m ago', avatar: null },
    { id: '3', name: 'Rahul K.', action: 'reached a', habit: '30 day streak!', time: '1h ago', avatar: null },
    { id: '4', name: 'Vikram D.', action: 'completed', habit: 'Answer Writing', time: '2h ago', avatar: null },
    { id: '5', name: 'Sneha R.', action: 'joined the', habit: 'UPSC Squad', time: '3h ago', avatar: null },
  ]

  useEffect(() => {
    const init = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        if (user.user_metadata?.exam_goal) {
          setExamGoal(user.user_metadata.exam_goal)
        }
      }
      setLoading(false)
    }
    init()
  }, [])

  if (loading) return <div className="flex justify-center py-20"><Activity className="animate-spin text-blue-500" /></div>

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 relative">
      
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-3">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            24 Online Now
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            {examGoal} Squad
          </h1>
          <p className="text-gray-400">Compete, stay accountable, and bloom together.</p>
        </div>
      </motion.div>

      {/* iOS Segmented Control */}
      <div className="flex bg-[#1c1c1e] p-1 rounded-xl mb-6 max-w-md border border-white/5 shadow-inner">
        <button
          onClick={() => setActiveView('leaderboard')}
          className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
            activeView === 'leaderboard' ? 'bg-[#2c2c2e] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          Leaderboard
        </button>
        <button
          onClick={() => setActiveView('feed')}
          className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
            activeView === 'feed' ? 'bg-[#2c2c2e] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          Live Feed
        </button>
      </div>

      {/* Main Content Area (Grouped List) */}
      <div className="bg-[#131b2f] border border-white/5 rounded-2xl overflow-hidden mb-8">
        
        {activeView === 'leaderboard' && (
          <div className="flex flex-col">
            <div className="px-4 py-3 border-b border-white/5 bg-white/[0.02]">
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold text-center">Top 10% advance to Gold League</p>
            </div>
            {fullLeaderboard.map((boardUser, index) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                key={boardUser.id} 
                className={`flex items-center gap-4 px-4 py-3.5 border-b border-white/5 last:border-b-0 transition-colors ${
                  boardUser.isMe 
                    ? 'bg-blue-500/10' 
                    : 'hover:bg-white/[0.02]'
                }`}
              >
                <div className={`font-bold text-[16px] w-6 text-center ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-300' : index === 2 ? 'text-amber-600' : 'text-gray-500'}`}>
                  {index + 1}
                </div>
                
                <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10 shrink-0 flex items-center justify-center">
                  {boardUser.avatar ? (
                    <img src={boardUser.avatar} alt={boardUser.name} className="w-full h-full object-cover" />
                  ) : (
                    <UserCircle className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className={`text-[16px] font-semibold truncate ${boardUser.isMe ? 'text-blue-400' : 'text-white'}`}>
                    {boardUser.name}
                  </p>
                  <div className="flex items-center gap-1 text-[12px] text-gray-500 mt-0.5">
                    <Flame size={12} className="text-gray-500" /> {boardUser.streak} day streak
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[16px] font-bold text-white">{boardUser.score}</div>
                  <div className="text-[10px] text-gray-500 uppercase font-semibold">pts</div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeView === 'feed' && (
          <div className="flex flex-col">
            {feed.map((feedItem, idx) => (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={feedItem.id} 
                className="flex items-start gap-4 px-4 py-3.5 border-b border-white/5 last:border-b-0 hover:bg-white/[0.02] transition-colors"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10 shrink-0 flex items-center justify-center">
                  {feedItem.avatar ? (
                    <img src={feedItem.avatar} alt={feedItem.name} className="w-full h-full object-cover" />
                  ) : (
                    <UserCircle className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] text-gray-300 leading-tight">
                    <span className="font-semibold text-white">{feedItem.name}</span> {feedItem.action} 
                    {feedItem.habit && <span className="text-blue-400 font-medium"> "{feedItem.habit}"</span>}
                  </p>
                  <span className="text-[11px] text-gray-500 mt-1 block">{feedItem.time}</span>
                </div>
              </motion.div>
            ))}
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-center text-xs text-gray-500 py-6"
            >
              Waiting for new activity...
            </motion.div>
          </div>
        )}

      </div>
    </div>
  )
}
