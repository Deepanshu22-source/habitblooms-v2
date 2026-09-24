'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { User as UserIcon, Camera, Loader2, Save, Sparkles, Target, BookOpen, Search, ChevronDown, LogOut, Medal, UserCircle, Calendar, Hash , Send, CheckCircle2 , Instagram, MessageCircle, MessageSquarePlus, ChevronRight, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

const PRESET_AVATARS = [
  // Stylish Modern Humans (Micah)
  'https://api.dicebear.com/7.x/micah/svg?seed=Felix&backgroundColor=f5f3ff',
  'https://api.dicebear.com/7.x/micah/svg?seed=Aneka&backgroundColor=fdf4ff',
  'https://api.dicebear.com/7.x/micah/svg?seed=Jude&backgroundColor=eff6ff',
  'https://api.dicebear.com/7.x/micah/svg?seed=Caleb&backgroundColor=f0fdf4',
  'https://api.dicebear.com/7.x/micah/svg?seed=Eden&backgroundColor=fffbeb',
  
  // Cute & Expressive (Lorelei)
  'https://api.dicebear.com/7.x/lorelei/svg?seed=Oliver&backgroundColor=e0f2fe',
  'https://api.dicebear.com/7.x/lorelei/svg?seed=Luna&backgroundColor=fce7f3',
  'https://api.dicebear.com/7.x/lorelei/svg?seed=Milo&backgroundColor=dcfce7',
  'https://api.dicebear.com/7.x/lorelei/svg?seed=Bella&backgroundColor=f3e8ff',
  'https://api.dicebear.com/7.x/lorelei/svg?seed=Charlie&backgroundColor=ffedd5',
  
  // Classic Flat Humans (Avataaars)
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sara&backgroundColor=ffedd5',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Leo&backgroundColor=e0e7ff',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Mia&backgroundColor=fef08a',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Max&backgroundColor=d1fae5',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe&backgroundColor=ffe4e6',
  
  // Hand-drawn Lifestyle (Adventurer)
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Jack&backgroundColor=f3f4f6',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Lily&backgroundColor=e2e8f0',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Toby&backgroundColor=fef3c7',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Ruby&backgroundColor=dcfce7',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Finn&backgroundColor=ffedd5',
  
  // Minimalist / Aesthetic (Notionists)
  'https://api.dicebear.com/7.x/notionists/svg?seed=Sam&backgroundColor=ffffff',
  'https://api.dicebear.com/7.x/notionists/svg?seed=Alex&backgroundColor=ffffff',
  'https://api.dicebear.com/7.x/notionists/svg?seed=Jordan&backgroundColor=ffffff',
  'https://api.dicebear.com/7.x/notionists/svg?seed=Casey&backgroundColor=ffffff',
  'https://api.dicebear.com/7.x/notionists/svg?seed=Riley&backgroundColor=ffffff',
  
  // Big Smiles (Big Smile)
  'https://api.dicebear.com/7.x/big-smile/svg?seed=Happy&backgroundColor=fef9c3',
  'https://api.dicebear.com/7.x/big-smile/svg?seed=Joy&backgroundColor=fef08a',
  'https://api.dicebear.com/7.x/big-smile/svg?seed=Sunny&backgroundColor=fde047',
  
  // Emoji Faces (Fun Emoji)
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Cool&backgroundColor=e0f2fe',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Wink&backgroundColor=fae8ff'
]

const EXAM_GOALS = [
  "UPSC / Civil Services",
  "JEE (Mains/Advanced)",
  "NEET / Medical Entrance",
  "CA / CS / CMA",
  "SSC / Government Jobs",
  "Banking / IBPS / SBI",
  "GATE / ESE",
  "CAT / MBA Entrance",
  "CUET / College Admissions",
  "NDA / CDS / Defence",
  "State PSC / Judiciary",
  "College Semester Exams",
  "Class 12 (Board Exams)",
  "Class 11",
  "Class 10 (Board Exams)",
  "Class 8 & 9",
  "Data Science & AI",
  "Coding / Tech Interviews",
  "Language Learning",
  "Self Improvement / Fitness",
  "General Productivity"
]

export default function ProfileTab() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [savingAvatar, setSavingAvatar] = useState(false)

    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false)
  const [feedbackText, setFeedbackText] = useState('')
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false)
  const [feedbackSuccess, setFeedbackSuccess] = useState(false)

  const handleSendFeedback = async () => {
    if (!user || !feedbackText.trim()) return
    setIsSubmittingFeedback(true)
    
    const { error } = await supabase.from('feedback').insert({
      user_id: user.id,
      message: feedbackText,
      type: 'general'
    })
    
    if (error) {
      alert('Error sending feedback: ' + error.message)
    } else {
      setFeedbackSuccess(true)
      setTimeout(() => {
        setFeedbackSuccess(false)
        setFeedbackText('')
        setIsFeedbackModalOpen(false)
      }, 1500)
    }
    setIsSubmittingFeedback(false)
  }

  const [savingProfile, setSavingProfile] = useState(false)
  
  // Form State
  const [avatarUrl, setAvatarUrl] = useState<string>('')
  const [fullName, setFullName] = useState('')
  const [age, setAge] = useState('')
  const [examGoal, setExamGoal] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)
    const [bio, setBio] = useState('')
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        setFullName(user.user_metadata?.full_name || '')
        setAvatarUrl(user.user_metadata?.custom_avatar || user.user_metadata?.avatar_url || '')
        setAge(user.user_metadata?.age || '')
        setBio(user.user_metadata?.bio || '')
        
        const savedGoal = user.user_metadata?.exam_goal || ''
        setExamGoal(savedGoal)
      }
      setLoading(false)
    }
    loadUser()
  }, [supabase.auth])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const filteredGoals = EXAM_GOALS.filter(g => g.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0 || !user) return
      
      const file = e.target.files[0]
      const fileExt = file.name.split('.').pop()
      const filePath = `${user.id}-${Math.random()}.${fileExt}`

      setSavingAvatar(true)
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
      
      setAvatarUrl(data.publicUrl)
      await saveAvatar(data.publicUrl)
      
    } catch (error: any) {
      alert('Error uploading image: ' + error.message)
      setSavingAvatar(false)
    }
  }

  const saveAvatar = async (url: string) => {
    if (!user) return
    setSavingAvatar(true)
    const { error } = await supabase.auth.updateUser({
      data: { custom_avatar: url, avatar_url: url }
    })
    
    if (error) {
      alert('Error saving avatar: ' + error.message)
    } else {
      // Sync avatar to profiles table
      await supabase.from('profiles').update({
        avatar_url: url,
        updated_at: new Date().toISOString()
      }).eq('id', user.id)
      router.refresh()
    }
    setSavingAvatar(false)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleSaveProfile = async () => {
    if (!user) return
    setSavingProfile(true)
    
    const finalGoal = examGoal;

    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: fullName,
        age: age,
        exam_goal: finalGoal,
        bio: bio
      }
    })

    if (error) {
      alert('Error saving profile: ' + error.message)
    } else {
      alert('Profile saved successfully! 🌸')
      // Sync profile data to profiles table for Community features
      await supabase.from('profiles').update({
        full_name: fullName,
        avatar_url: user.user_metadata?.custom_avatar || user.user_metadata?.avatar_url || null,
        exam_goal: finalGoal,
        updated_at: new Date().toISOString()
      }).eq('id', user.id)
      router.refresh()
    }
    setSavingProfile(false)
  }

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-violet-500" size={32} /></div>
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] pb-24 md:pb-8 max-w-2xl mx-auto px-4 pt-6">
      
      {/* 1. Header & Avatar (Minimalist) */}
      <div className="flex flex-col items-center mb-10">
        <div className="relative group">
          <div className="w-28 h-28 rounded-full overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <UserIcon size={40} className="text-gray-500" />
            )}
          </div>
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 w-8 h-8 bg-white text-black rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
            disabled={savingAvatar}
          >
            {savingAvatar ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />}
          </button>
          <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
        </div>
        
        <h1 className="text-2xl font-bold text-white mt-4">{fullName || 'Your Profile'}</h1>
        <p className="text-sm text-gray-500">{examGoal || 'No goal set'}</p>
      </div>

      {/* Preset Avatars (Subtle) */}
      <div className="mb-8">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">Presets</p>
        <div className="flex gap-3 overflow-x-auto custom-scrollbar pb-2 px-2 -mx-2">
          {PRESET_AVATARS.map((url, i) => (
            <button
              key={i}
              onClick={() => {
                setAvatarUrl(url)
                saveAvatar(url)
              }}
              className={`w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 transition-all ${
                avatarUrl === url ? 'border-violet-500 opacity-100' : 'border-transparent opacity-50 hover:opacity-100'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`Preset ${i}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {/* 2. Personal Info (Grouped List Style) */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">Personal</p>
          <div className="bg-[#131b2f] border border-white/5 rounded-2xl overflow-hidden">
            
            <div className="flex items-center px-4 py-3 border-b border-white/5 focus-within:bg-white/[0.02] transition-colors">
              <label className="w-1/3 text-sm text-gray-400">Name</label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-2/3 bg-transparent text-white text-sm focus:outline-none placeholder:text-gray-600"
                placeholder="Enter your name"
              />
            </div>

            <div className="flex items-center px-4 py-3 focus-within:bg-white/[0.02] transition-colors">
              <label className="w-1/3 text-sm text-gray-400">Age</label>
              <input
                type="number"
                value={age}
                onChange={e => setAge(e.target.value)}
                className="w-2/3 bg-transparent text-white text-sm focus:outline-none placeholder:text-gray-600"
                placeholder="e.g. 21"
              />
            </div>
          </div>
        </div>

        {/* 3. Mission & Bio */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">Mission</p>
          <div className="bg-[#131b2f] border border-white/5 rounded-2xl overflow-hidden">
            
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex items-center px-4 py-3 border-b border-white/5 text-left transition-colors hover:bg-white/[0.02]"
              >
                <span className="w-1/3 text-sm text-gray-400">Goal</span>
                <div className="w-2/3 flex items-center justify-between">
                  <span className={examGoal ? "text-white text-sm" : "text-gray-600 text-sm"}>
                    {examGoal || "Select goal"}
                  </span>
                  <ChevronDown size={16} className={`text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </div>
              </button>
              
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute top-full left-0 right-0 mt-1 bg-[#1a233a] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 mx-2"
                  >
                    <div className="p-2 border-b border-white/5 relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                      <input
                        type="text"
                        autoFocus
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Search..."
                        className="w-full bg-black/20 rounded-lg py-2 pl-8 pr-3 text-sm text-white focus:outline-none"
                      />
                    </div>
                    
                    <div className="max-h-48 overflow-y-auto custom-scrollbar p-1">
                      {filteredGoals.length > 0 ? (
                        filteredGoals.map((goal) => (
                          <button
                            key={goal}
                            onClick={() => {
                              setExamGoal(goal)
                              setIsDropdownOpen(false)
                              setSearchQuery('')
                            }}
                            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                              examGoal === goal ? 'bg-violet-500/20 text-violet-300' : 'text-gray-300 hover:bg-white/5'
                            }`}
                          >
                            {goal}
                          </button>
                        ))
                      ) : (
                        <div className="p-3 text-center text-xs text-gray-500">No matching goals found.</div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex px-4 py-3 focus-within:bg-white/[0.02] transition-colors">
              <label className="w-1/3 text-sm text-gray-400 pt-1">Bio</label>
              <textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                className="w-2/3 bg-transparent text-white text-sm focus:outline-none placeholder:text-gray-600 resize-none h-20 custom-scrollbar"
                placeholder="Tell the squad about yourself..."
              />
            </div>
          </div>
        </div>

        
        {/* Support & Feedback */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">Community & Support</p>
          <div className="bg-[#131b2f] border border-white/5 rounded-2xl overflow-hidden">
            
            <a 
              href="https://www.instagram.com/habitblooms.in?stkn=MTRxYzFic3ozenpraQ==" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between px-4 py-3.5 border-b border-white/5 text-left transition-colors hover:bg-white/[0.02]"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-pink-500/10 flex items-center justify-center">
                  <Instagram size={16} className="text-pink-500" />
                </div>
                <span className="text-sm text-gray-200">Follow on Instagram</span>
              </div>
              <ChevronRight size={16} className="text-gray-600" />
            </a>

            <a 
              href="https://chat.whatsapp.com/your-invite-link" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between px-4 py-3.5 border-b border-white/5 text-left transition-colors hover:bg-white/[0.02]"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                  <MessageCircle size={16} className="text-green-500" />
                </div>
                <span className="text-sm text-gray-200">Join WhatsApp Community</span>
              </div>
              <ChevronRight size={16} className="text-gray-600" />
            </a>

            <button 
              onClick={() => setIsFeedbackModalOpen(true)}
              className="w-full flex items-center justify-between px-4 py-3.5 text-left transition-colors hover:bg-white/[0.02]"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-violet-500/10 flex items-center justify-center">
                  <MessageSquarePlus size={16} className="text-violet-500" />
                </div>
                <span className="text-sm text-gray-200">Suggestion or Bug Report</span>
              </div>
              <ChevronRight size={16} className="text-gray-600" />
            </button>

          </div>
        </div>

        {/* 4. Action Buttons */}
        <div className="pt-6 space-y-3">
          <button
            onClick={handleSaveProfile}
            disabled={savingProfile}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-white text-black rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            {savingProfile ? <Loader2 size={16} className="animate-spin" /> : null}
            {savingProfile ? 'Saving...' : 'Save Changes'}
          </button>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-red-500/10 text-red-500 rounded-xl font-bold text-sm hover:bg-red-500/20 transition-colors"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>

      </div>

      {/* Feedback Modal */}
      <AnimatePresence>
        {isFeedbackModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsFeedbackModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-[#131b2f] border border-white/10 rounded-3xl shadow-2xl overflow-hidden p-6"
            >
              <button 
                onClick={() => setIsFeedbackModalOpen(false)}
                className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-full text-gray-400 transition-colors"
              >
                <X size={16} />
              </button>

              <div className="mb-6">
                <div className="w-12 h-12 bg-violet-500/10 rounded-2xl flex items-center justify-center mb-4">
                  <MessageSquarePlus size={24} className="text-violet-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-1">Send Feedback</h3>
                <p className="text-sm text-gray-400">Found a bug or have a feature idea? Let me know directly.</p>
              </div>

              <textarea
                value={feedbackText}
                onChange={e => setFeedbackText(e.target.value)}
                autoFocus
                className="w-full bg-black/20 border border-white/5 rounded-xl p-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-500/50 resize-none h-32 custom-scrollbar mb-4"
                placeholder="What's on your mind?..."
              />
              
              <button
                onClick={handleSendFeedback}
                disabled={!feedbackText.trim() || isSubmittingFeedback || feedbackSuccess}
                className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all ${
                  feedbackSuccess ? 'bg-green-500 text-white' :
                  feedbackText.trim() ? 'bg-white text-black hover:bg-gray-100' : 'bg-white/5 text-gray-500'
                }`}
              >
                {isSubmittingFeedback ? <Loader2 size={16} className="animate-spin" /> : 
                 feedbackSuccess ? <><CheckCircle2 size={16} /> Sent Successfully!</> : 
                 <><Send size={16} /> Send to Developer</>}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
