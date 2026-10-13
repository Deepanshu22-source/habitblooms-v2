'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Trophy, Flame, Activity, UserCircle, Share2, BookOpen, Sparkles, MessageCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { getTodayString } from '@/lib/utils'
import ResourceVaultModal from '../ResourceVaultModal'

interface Props {
  onNavigateToProfile?: () => void
}

export default function CommunityTab({ onNavigateToProfile }: Props) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [examGoal, setExamGoal] = useState<string>('UPSC')
  const [activeView, setActiveView] = useState<'leaderboard' | 'feed'>('leaderboard')
  
  
  // State for our Hybrid Engine
  const [fullLeaderboard, setFullLeaderboard] = useState<any[]>([])
  const [feed, setFeed] = useState<any[]>([])
  const [showVaultModal, setShowVaultModal] = useState(false)


  
  
  
  const handleShare = async () => {
    const url = `https://habitblooms.in/?ref=${user?.id || ''}`
    const shareData = {
      title: 'HabitBlooms Squad',
      text: `Join my ${examGoal} Squad on HabitBlooms! Let's compete on the leaderboard and build our habits together. 🏆🌱 ${url}`,
      url: url
    }
    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(shareData.text)
        alert('Squad Invite link copied to clipboard!')
      }
    } catch (err) {
      console.log('Error sharing:', err)
    }
  }

  useEffect(() => {
    async function loadCommunityData() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      setUser(user)
      const userGoal = user.user_metadata?.exam_goal || 'UPSC'
      if (userGoal) setExamGoal(userGoal)

      // 1. Try to fetch REAL data from our new tables
      const { data: realProfiles } = await supabase
        .from('profiles')
        .select('*')
        .eq('exam_goal', userGoal)
        .not('full_name', 'is', null)
        .neq('full_name', '')
        .order('score', { ascending: false })
        .limit(50) as { data: any[] | null }

      const { data: realFeed } = await supabase
        .from('activity_feed')
        .select('*')
        .eq('exam_goal', userGoal)
        .order('created_at', { ascending: false })
        .limit(20) as { data: any[] | null }

      // 2. The Ghost Data (Cold Start Bots)
      // 2. The Ghost Data (Dynamic Hourly Drip relative to Account Age)
      const userCreatedAt = new Date(user.created_at || Date.now());
      // ---------------------------------------------------------
      // WEEKLY BOT RESET ALGORITHM (Matches the Database Cron Job)
      // ---------------------------------------------------------
      const now = new Date();
      const day = now.getDay();
      // Calculate days since Monday (0 = Monday, 6 = Sunday)
      const daysSinceMonday = day === 0 ? 6 : day - 1;
      
      const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysSinceMonday);
      startOfWeek.setHours(0, 0, 0, 0); // Monday at Midnight local time

      // Hours elapsed since the week started (min 1 hour so they don't all show 0 points on Monday morning)
      const botHours = Math.max(1, (now.getTime() - startOfWeek.getTime()) / (1000 * 60 * 60));
      const hoursSinceJoin = botHours; // Pass this into the existing ghost math

      const ghostUsers = [
        { id: 'g-1', name: 'Aditi Sharma', avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=Aditi', score: Math.floor(hoursSinceJoin * 3.8), streak: 14 + Math.floor((botHours % 24) / 6), isMe: false },
        { id: 'g-2', name: 'Rahul Kumar', avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=Rahul', score: Math.floor(hoursSinceJoin * 3.3), streak: 11, isMe: false },
        { id: 'g-3', name: 'Sneha P.', avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=Sneha', score: Math.floor(hoursSinceJoin * 2.9), streak: 8, isMe: false },
        { id: 'g-4', name: 'Vikram Singh', avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=Vikram', score: Math.floor(hoursSinceJoin * 2.5), streak: 5, isMe: false },
        { id: 'g-5', name: 'Priya Patel', avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=Priya', score: Math.floor(hoursSinceJoin * 2.0), streak: 4, isMe: false },
        { id: 'g-6', name: 'Karan J.', avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=Karan', score: Math.floor(hoursSinceJoin * 1.5), streak: 3, isMe: false },
        { id: 'g-7', name: 'Neha Gupta', avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=Neha', score: Math.floor(hoursSinceJoin * 1.2), streak: 2, isMe: false },
        { id: 'g-8', name: 'Arjun Das', avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=Arjun', score: Math.floor(hoursSinceJoin * 1.0), streak: 2, isMe: false },
        { id: 'g-9', name: 'Diya Reddy', avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=Diya', score: Math.floor(hoursSinceJoin * 0.8), streak: 1, isMe: false },
        { id: 'g-10', name: 'Rohan Joshi', avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=Rohan', score: Math.floor(hoursSinceJoin * 0.6), streak: 1, isMe: false },
        { id: 'g-11', name: 'Kavya Nair', avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=Kavya', score: Math.floor(hoursSinceJoin * 0.4), streak: 1, isMe: false },
        { id: 'g-12', name: 'Ishaan Verma', avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=Ishaan', score: Math.floor(hoursSinceJoin * 0.2), streak: 0, isMe: false },
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

      // Ensure "You" are always in the list (Bug #12 Fix: Fetch directly from DB instead of stale localStorage)
      const hasMe = formattedRealProfiles.some(p => p.isMe)
      if (!hasMe && user?.id) {
        const { data: myProfile } = await supabase
          .from('profiles')
          .select('score, streak')
          .eq('id', user.id)
          .maybeSingle()

        formattedRealProfiles.push({
          id: user.id,
          name: user.user_metadata?.full_name || 'You',
          avatar: user.user_metadata?.avatar_url || '',
          score: myProfile?.score || 0,
          streak: myProfile?.streak || 0,
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
      setFullLeaderboard(combinedLeaderboard)

      // 5. Format and Merge Feed
      const formattedRealFeed = (realFeed || []).map((f: any) => ({
        id: f.id,
        name: f.user_id === user.id ? 'You' : (f.habit_name ? 'A squad member' : 'Someone'),
        avatar: '',
        action: f.action,
        habit: f.habit_name,
        time: 'Recently'
      }))

      const combinedFeed = []
      let rIdx = 0
      let gIdx = 0
      while (combinedFeed.length < 15 && (rIdx < formattedRealFeed.length || gIdx < ghostFeed.length)) {
        if (rIdx < formattedRealFeed.length) combinedFeed.push(formattedRealFeed[rIdx++])
        if (gIdx < ghostFeed.length) combinedFeed.push(ghostFeed[gIdx++])
      }
      setFeed(combinedFeed)
      
      setLoading(false)
    }
    
    loadCommunityData()
  }, [])


  if (loading) return <div className="flex justify-center py-20"><Activity className="animate-spin text-blue-500" /></div>

  const myIndex = fullLeaderboard.findIndex((u) => u.isMe)
  const myRank = myIndex !== -1 ? myIndex + 1 : 0

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
          <div className="flex flex-wrap items-center gap-2 mt-2 mb-2">
            <button 
              onClick={handleShare}
              className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl text-white font-medium text-xs hover:opacity-90 transition-opacity shadow-md shadow-violet-500/20 active:scale-95"
            >
              <Share2 size={14} /> Invite Friends
            </button>
            <a 
              href="https://whatsapp.com/channel/0029Vb99OVr0wajmDtKWUw36" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3.5 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/25 rounded-xl font-medium text-xs transition-all shadow-sm active:scale-95"
            >
              <MessageCircle size={14} /> WhatsApp Channel
            </a>
          </div>
          <p className="text-gray-400">Compete, stay accountable, and bloom together.</p>
        </div>
      </motion.div>

      {/* Topper Resource Vault Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-[#0e1728] to-emerald-950/20 border border-emerald-500/30 shadow-xl shadow-emerald-500/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 relative overflow-hidden"
      >
        <div className="flex items-start gap-3.5 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30 text-2xl shadow-inner">
            📚
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <Sparkles size={11} /> Top 10 Weekly Reward
              </span>
              {myRank > 0 && myRank <= 10 && (
                <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  UNLOCKED 🔓 (Rank #{myRank})
                </span>
              )}
            </div>
            <h3 className="text-lg font-black text-white leading-tight">
              {examGoal} Topper Resource Vault
            </h3>
            <p className="text-xs text-gray-400 mt-1 max-w-xl leading-relaxed">
              {myRank > 0 && myRank <= 10
                ? "You've earned full access! Read exclusive strategy blueprints, revision sheets, and formula maps."
                : `Finish in the Top 10 this week to unlock official strategy blueprints & formulas! (${myRank > 10 ? `Currently Rank #${myRank} — ${myRank - 10} ranks away` : "Climb the ranks by checking habits!"})`}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowVaultModal(true)}
          className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-95 rounded-xl text-white text-xs font-bold transition-all shadow-lg shadow-emerald-500/20 shrink-0 flex items-center justify-center gap-2 relative z-10 hover:scale-105 active:scale-95"
        >
          <BookOpen size={16} /> Open Vault
        </button>
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
                    {feedItem.habit && <span className="text-blue-400 font-medium"> &quot;{feedItem.habit}&quot;</span>}
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

      <ResourceVaultModal
        isOpen={showVaultModal}
        onClose={() => setShowVaultModal(false)}
        userRank={myRank}
        examGoal={examGoal}
      />
    </div>
  )
}
