'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShieldAlert, Sparkles, Loader2, Coins, Share2, Palette, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/lib/supabase/types'

interface StoreModalProps {
  profile: Profile
  onClose: () => void
  onPurchaseComplete: (updatedProfile: Profile) => void
}

const STREAK_FREEZE_COST = 500

const COSMETICS = [
  { id: 'default', name: 'Classic Sprout', icon: '🌱', cost: 0, description: 'Your starter plant.' },
  { id: 'cactus', name: 'Desert Cactus', icon: '🌵', cost: 500, description: 'Prickly but resilient.' },
  { id: 'bonsai', name: 'Zen Bonsai', icon: '🪴', cost: 1000, description: 'A symbol of ultimate focus.' },
  { id: 'monstera', name: 'Lush Monstera', icon: '🌿', cost: 1500, description: 'Tropical and vibrant.' },
  { id: 'golden', name: 'Golden Oak', icon: '🌳✨', cost: 5000, description: 'The legendary tree of masters.' }
]

export default function StoreModal({ profile, onClose, onPurchaseComplete }: StoreModalProps) {
  const [activeTab, setActiveTab] = useState<'consumables' | 'cosmetics'>('cosmetics')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const supabase = createClient()

  // Ensure arrays exist safely
  const unlockedPlants = profile.unlocked_plants || ['default']
  const equippedPlant = profile.equipped_plant || 'default'

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'HabitBlooms',
          text: 'Join me on HabitBlooms and let\'s build better habits together!',
          url: `https://www.habitblooms.in/?ref=${profile.id}`
        })
      } catch (err) {
        console.log('User cancelled share')
      }
    }
  }

  const handleBuyFreeze = async () => {
    if (profile.seeds < STREAK_FREEZE_COST) {
      setError("Not enough seeds! Complete more habits to earn seeds.")
      return
    }
    setLoading(true)
    setError('')
    setSuccessMsg('')
    try {
      const { data, error: updateError } = await supabase
        .from('profiles')
        .update({
          seeds: profile.seeds - STREAK_FREEZE_COST,
          streak_freezes: (profile.streak_freezes || 0) + 1
        })
        .eq('id', profile.id)
        .select()
        .single()
      if (updateError) throw updateError
      setSuccessMsg('Successfully equipped 1 Streak Freeze! 🛡️')
      setTimeout(() => onPurchaseComplete(data), 1500)
    } catch (err: any) {
      setError(err.message || 'Failed to purchase item.')
      setLoading(false)
    }
  }

  const handleEquipPlant = async (plantId: string) => {
    setLoading(true)
    setError('')
    setSuccessMsg('')
    try {
      const { data, error: updateError } = await supabase
        .from('profiles')
        .update({ equipped_plant: plantId })
        .eq('id', profile.id)
        .select()
        .single()
      if (updateError) throw updateError
      setSuccessMsg('Successfully equipped new plant! 🌱')
      setTimeout(() => onPurchaseComplete(data), 1000)
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  const handleBuyPlant = async (plant: typeof COSMETICS[0]) => {
    if (profile.seeds < plant.cost) {
      setError("Not enough seeds to buy this plant!")
      return
    }
    setLoading(true)
    setError('')
    setSuccessMsg('')
    try {
      const newUnlocked = [...unlockedPlants, plant.id]
      const { data, error: updateError } = await supabase
        .from('profiles')
        .update({
          seeds: profile.seeds - plant.cost,
          unlocked_plants: newUnlocked,
          equipped_plant: plant.id // Auto equip on buy
        })
        .eq('id', profile.id)
        .select()
        .single()
      if (updateError) throw updateError
      setSuccessMsg(`Successfully bought ${plant.name}! 🎉`)
      setTimeout(() => onPurchaseComplete(data), 1500)
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ y: 50, scale: 0.95, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 50, scale: 0.95, opacity: 0 }}
        className="w-full max-w-lg max-h-[90vh] flex flex-col bg-[#0a0f1c] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative"
      >
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-amber-500/20 blur-[100px] pointer-events-none" />

        {/* Header (Sticky) */}
        <div className="p-6 pb-4 border-b border-white/5 relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              Garden Shop 🏪
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors bg-white/5 p-2 rounded-full shrink-0">
              <X size={20} />
            </button>
          </div>

          <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-4 mb-4">
            <span className="text-gray-300 font-medium">Your Balance</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-amber-400">{profile.seeds || 0}</span>
              <Coins className="text-amber-500" size={24} />
            </div>
          </div>

          <div className="flex gap-2 p-1 bg-black/40 rounded-xl">
            <button
              onClick={() => setActiveTab('cosmetics')}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'cosmetics' ? 'bg-amber-500/20 text-amber-400' : 'text-gray-500 hover:text-white'
              }`}
            >
              <Palette size={16} /> Plants
            </button>
            <button
              onClick={() => setActiveTab('consumables')}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'consumables' ? 'bg-violet-500/20 text-violet-400' : 'text-gray-500 hover:text-white'
              }`}
            >
              <ShieldAlert size={16} /> Upgrades
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar relative z-10 flex-1">
          {error && (
            <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
              {error}
            </div>
          )}
          {successMsg && (
            <div className="mb-4 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium flex items-center gap-2">
              <Check size={16} /> {successMsg}
            </div>
          )}

          <AnimatePresence mode="wait">
            {activeTab === 'cosmetics' ? (
              <motion.div key="cosmetics" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
                <p className="text-sm text-gray-400 mb-2">Buy new plants for your dashboard. They grow automatically as your streak increases!</p>
                <div className="grid grid-cols-1 gap-3">
                  {COSMETICS.map(plant => {
                    const isOwned = unlockedPlants.includes(plant.id)
                    const isEquipped = equippedPlant === plant.id

                    return (
                      <div key={plant.id} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${isEquipped ? 'bg-amber-500/10 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.1)]' : isOwned ? 'bg-white/5 border-white/10' : 'bg-black/40 border-white/5 opacity-80'}`}>
                        <div className="w-12 h-12 bg-black/50 rounded-xl flex items-center justify-center text-3xl shrink-0">
                          {plant.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-bold truncate">{plant.name}</h4>
                          <p className="text-xs text-gray-400 truncate">{plant.description}</p>
                        </div>
                        <div className="shrink-0">
                          {isEquipped ? (
                            <button disabled className="px-4 py-2 bg-amber-500/20 text-amber-400 rounded-xl font-bold text-sm cursor-default flex items-center gap-1">
                              <Check size={14} /> Equipped
                            </button>
                          ) : isOwned ? (
                            <button 
                              onClick={() => handleEquipPlant(plant.id)}
                              disabled={loading}
                              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-sm transition-colors"
                            >
                              Equip
                            </button>
                          ) : (
                            <button
                              onClick={() => handleBuyPlant(plant)}
                              disabled={loading}
                              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-sm transition-colors flex items-center gap-1 shadow-lg shadow-amber-500/20"
                            >
                              {plant.cost} <Coins size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            ) : (
              <motion.div key="consumables" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-4">
                <div className="p-5 bg-gradient-to-br from-violet-900/40 to-fuchsia-900/10 border border-violet-500/30 rounded-2xl relative overflow-hidden">
                  <div className="flex justify-between items-start mb-2 relative z-10">
                    <div>
                      <h3 className="text-lg font-black text-white flex items-center gap-2">
                        Streak Freeze <ShieldAlert className="text-violet-400" size={18} />
                      </h3>
                      <p className="text-sm text-violet-200/70 mt-1">Missed a day? Automatically consumes this instead of breaking your streak.</p>
                      <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/10 rounded-full text-xs font-bold text-violet-300">
                        Owned: {profile.streak_freezes || 0}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={handleBuyFreeze}
                    disabled={loading}
                    className="w-full mt-4 flex items-center justify-center gap-2 bg-violet-500 hover:bg-violet-600 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : (
                      <>Buy for {STREAK_FREEZE_COST} <Coins size={16} /></>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
}
