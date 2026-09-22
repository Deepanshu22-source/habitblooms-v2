'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Camera, Loader2, Save, User as UserIcon, BookOpen, UserCircle, AlignLeft, X } from 'lucide-react'
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
  "NEET",
  "SSC / Railway",
  "GATE / IES",
  "CAT / MBA Entrance",
  "Campus Placements",
  "College Semester Exams",
  "State PSC",
  "Self Improvement / Fitness",
  "Other"
]

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [savingAvatar, setSavingAvatar] = useState(false)
  const [savingProfile, setSavingProfile] = useState(false)
  
  // Form State
  const [avatarUrl, setAvatarUrl] = useState<string>('')
  const [fullName, setFullName] = useState('')
  const [age, setAge] = useState('')
  const [examGoal, setExamGoal] = useState('')
  const [customGoal, setCustomGoal] = useState('')
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
        
        // Handle custom goals
        const savedGoal = user.user_metadata?.exam_goal || ''
        if (savedGoal && !EXAM_GOALS.includes(savedGoal)) {
          setExamGoal('Other')
          setCustomGoal(savedGoal)
        } else {
          setExamGoal(savedGoal)
        }
      }
      setLoading(false)
    }
    loadUser()
  }, [supabase.auth])

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

  const handleSaveProfile = async () => {
    if (!user) return
    setSavingProfile(true)
    
    // Use custom goal if "Other" is selected
    const finalGoal = examGoal === 'Other' ? customGoal : examGoal

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
    <div className="max-w-4xl mx-auto py-8 px-4">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
        <p className="text-gray-400">Customize your identity and goals in HabitBlooms.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Avatar Settings */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-1 space-y-6">
          <div className="glass rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 border-b border-white/10 pb-3">Avatar</h3>
            
            <div className="flex flex-col items-center gap-6">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-white/5 ring-4 ring-violet-500/20 flex items-center justify-center">
                  {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon size={48} className="text-gray-500" />
                  )}
                </div>
                
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-10 h-10 bg-violet-500 hover:bg-violet-600 text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110"
                  disabled={savingAvatar}
                >
                  {savingAvatar ? <Loader2 size={18} className="animate-spin" /> : <Camera size={18} />}
                </button>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                />
              </div>

              <div className="w-full">
                <h4 className="text-xs font-medium text-gray-400 mb-3 uppercase tracking-wider text-center">Or choose a preset</h4>
                <div className="flex flex-wrap justify-center gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {PRESET_AVATARS.map((url, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setAvatarUrl(url)
                        saveAvatar(url)
                      }}
                      disabled={savingAvatar}
                      className={`w-10 h-10 rounded-full overflow-hidden bg-white/5 border-2 transition-all hover:scale-110 ${
                        avatarUrl === url ? 'border-violet-500' : 'border-transparent hover:border-white/20'
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt={`Preset ${i}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Personal Information */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2">
          <div className="glass rounded-2xl p-6 md:p-8">
            <h3 className="text-xl font-semibold text-white mb-6 border-b border-white/10 pb-4">Personal Information</h3>
            
            <div className="space-y-6">
              
              {/* Name & Age Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <UserCircle size={16} className="text-violet-400" /> Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rahul Kumar"
                    className="w-full bg-[#030712]/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <UserIcon size={16} className="text-pink-400" /> Age
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="e.g. 21"
                    className="w-full bg-[#030712]/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all"
                  />
                </div>
              </div>

              {/* Exam / Goal Dropdown */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <BookOpen size={16} className="text-emerald-400" /> Current Goal / Target Exam
                </label>
                
                {examGoal === 'Other' ? (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative">
                    <input
                      type="text"
                      value={customGoal}
                      onChange={(e) => setCustomGoal(e.target.value)}
                      placeholder="Please type your specific goal..."
                      className="w-full bg-[#030712]/50 border border-violet-500/50 rounded-xl px-4 py-3 pr-10 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-violet-500/50 transition-all shadow-[0_0_15px_rgba(139,92,246,0.1)]"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setExamGoal('')
                        setCustomGoal('')
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-lg"
                      title="Choose from list instead"
                    >
                      <X size={14} />
                    </button>
                  </motion.div>
                ) : (
                  <select
                    value={examGoal}
                    onChange={(e) => setExamGoal(e.target.value)}
                    className="w-full bg-[#030712]/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all appearance-none"
                  >
                    <option value="" disabled className="text-gray-500">Select your primary goal...</option>
                    {EXAM_GOALS.map((goal) => (
                      <option key={goal} value={goal} className="bg-gray-900 text-white">{goal}</option>
                    ))}
                  </select>
                )}
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <AlignLeft size={16} className="text-blue-400" /> Bio / Motivation
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Why are you building these habits? What drives you?"
                  rows={4}
                  className="w-full bg-[#030712]/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all resize-none"
                />
              </div>

              {/* Save Button */}
              <div className="pt-4 flex justify-end">
                <button
                  onClick={handleSaveProfile}
                  disabled={savingProfile}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-pink-600 text-white rounded-xl font-medium hover:scale-105 transition-transform disabled:opacity-70 disabled:hover:scale-100 shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                >
                  {savingProfile ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  {savingProfile ? 'Saving...' : 'Save Profile'}
                </button>
              </div>

            </div>
          </div>
        </motion.div>

      </div>
    </div>
  )
}
