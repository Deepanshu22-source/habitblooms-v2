'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { User as UserIcon, Camera, Loader2, Save, Sparkles, Target, BookOpen, Search, ChevronDown, LogOut, Medal, UserCircle, Calendar, Hash } from 'lucide-react'
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
    <div className="relative min-h-[calc(100vh-4rem)] pb-24 md:pb-8">
      {/* God-level Ambient Background */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet-600/10 blur-[120px] rounded-full opacity-50" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-pink-600/10 blur-[150px] rounded-full opacity-30 animate-pulse-glow" />
      </div>

      <div className="max-w-5xl mx-auto py-8 px-4 relative z-10">
        
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/50 tracking-tight mb-3">
            Your Identity
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl">
            Customize your avatar, set your primary mission, and level up your HabitBlooms persona.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          
          {/* LEFT COLUMN: Avatar & Quick Stats (Span 4) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: 0.1 }}
            className="lg:col-span-5 space-y-6"
          >
            {/* The Avatar Card */}
            <div className="relative group bg-[#0a0f1c]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col items-center shadow-2xl overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-violet-500 to-pink-500" />
              
              <div className="relative mb-8">
                <div className="w-40 h-40 rounded-full overflow-hidden bg-black/50 ring-4 ring-white/5 group-hover:ring-violet-500/30 transition-all duration-500 flex items-center justify-center shadow-[0_0_40px_rgba(139,92,246,0.15)] group-hover:shadow-[0_0_60px_rgba(139,92,246,0.3)]">
                  {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  ) : (
                    <UserCircle size={64} className="text-gray-600" />
                  )}
                </div>
                
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-2 right-2 w-12 h-12 bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 hover:rotate-12"
                  disabled={savingAvatar}
                >
                  {savingAvatar ? <Loader2 size={20} className="animate-spin" /> : <Camera size={20} />}
                </button>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                />
              </div>

              <div className="w-full text-center">
                <h4 className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                  <Sparkles size={12} className="text-amber-400" />
                  Preset Avatars
                  <Sparkles size={12} className="text-amber-400" />
                </h4>
                <div className="flex flex-wrap justify-center gap-3">
                  {PRESET_AVATARS.map((url, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setAvatarUrl(url)
                        saveAvatar(url)
                      }}
                      className={`w-14 h-14 rounded-2xl overflow-hidden transition-all duration-300 ${
                        avatarUrl === url 
                          ? 'ring-2 ring-violet-500 scale-110 shadow-[0_0_20px_rgba(139,92,246,0.4)]' 
                          : 'opacity-50 hover:opacity-100 hover:scale-105 bg-white/5'
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt={`Preset ${i}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Danger Zone */}
            <div className="bg-red-500/5 border border-red-500/10 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-red-400 font-bold">Sign Out</h3>
                <p className="text-red-400/60 text-xs mt-1">Ready to take a break?</p>
              </div>
              <button
                onClick={handleSignOut}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl font-bold transition-all"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Profile Details (Span 7) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: 0.2 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="bg-[#0a0f1c]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">
              
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <UserIcon className="text-blue-400" size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Personal Details</h3>
                  <p className="text-xs text-gray-400">How the community sees you.</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-300 ml-1">Display Name</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Hash size={18} className="text-gray-500 group-focus-within:text-violet-400 transition-colors" />
                    </div>
                    <input
                      type="text"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all placeholder:text-gray-600"
                      placeholder="e.g. John Doe"
                    />
                  </div>
                </div>

                {/* Age */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-300 ml-1">Age</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Calendar size={18} className="text-gray-500 group-focus-within:text-violet-400 transition-colors" />
                    </div>
                    <input
                      type="number"
                      value={age}
                      onChange={e => setAge(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all placeholder:text-gray-600"
                      placeholder="e.g. 21"
                      min="10"
                      max="100"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* The Mission Card */}
            <div className="bg-[#0a0f1c]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px] pointer-events-none" />
              
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <Target className="text-emerald-400" size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Your Mission</h3>
                  <p className="text-xs text-gray-400">What are you striving for?</p>
                </div>
              </div>

              <div className="space-y-6 relative z-10">
                {/* Primary Goal Dropdown */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-300 ml-1 flex items-center gap-2">
                    Primary Goal / Exam <Medal size={14} className="text-amber-400" />
                  </label>
                  
                  <div className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full flex items-center justify-between bg-black/40 border border-white/10 hover:border-white/20 rounded-2xl py-3.5 px-4 text-left transition-all"
                    >
                      <span className={examGoal ? "text-white font-medium" : "text-gray-500"}>
                        {examGoal || "Select your main goal..."}
                      </span>
                      <ChevronDown size={18} className={`text-gray-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    <AnimatePresence>
                      {isDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-0 right-0 mt-2 bg-[#131b2f] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
                        >
                          <div className="p-2 border-b border-white/5 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                            <input
                              type="text"
                              autoFocus
                              value={searchQuery}
                              onChange={e => setSearchQuery(e.target.value)}
                              placeholder="Search goals..."
                              className="w-full bg-black/30 border border-white/5 rounded-xl py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-violet-500"
                            />
                          </div>
                          
                          <div className="max-h-60 overflow-y-auto custom-scrollbar p-2">
                            {filteredGoals.length > 0 ? (
                              filteredGoals.map((goal) => (
                                <button
                                  key={goal}
                                  onClick={() => {
                                    setExamGoal(goal)
                                    setIsDropdownOpen(false)
                                    setSearchQuery('')
                                  }}
                                  className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-colors ${
                                    examGoal === goal 
                                      ? 'bg-violet-500/20 text-violet-300 font-bold' 
                                      : 'text-gray-300 hover:bg-white/5'
                                  }`}
                                >
                                  {goal}
                                </button>
                              ))
                            ) : (
                              <div className="p-4 text-center text-sm text-gray-500">
                                No matching goals found.
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-300 ml-1">Short Bio</label>
                  <div className="relative group">
                    <div className="absolute top-4 left-0 pl-4 pointer-events-none">
                      <BookOpen size={18} className="text-gray-500 group-focus-within:text-violet-400 transition-colors" />
                    </div>
                    <textarea
                      value={bio}
                      onChange={e => setBio(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all placeholder:text-gray-600 resize-none h-28 custom-scrollbar"
                      placeholder="Tell the squad about yourself..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end pt-4">
              <button
                onClick={handleSaveProfile}
                disabled={savingProfile}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white rounded-2xl font-black text-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-70 disabled:hover:scale-100 shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:shadow-[0_0_50px_rgba(139,92,246,0.5)]"
              >
                {savingProfile ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                {savingProfile ? 'SAVING...' : 'SAVE PROFILE'}
              </button>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  )
}
