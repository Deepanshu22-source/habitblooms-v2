'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, ShieldAlert, Sparkles, Loader2, Coins, Share2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/lib/supabase/types'

interface StoreModalProps {
  profile: Profile
  onClose: () => void
  onPurchaseComplete: (updatedProfile: Profile) => void
}

const STREAK_FREEZE_COST = 500

export default function StoreModal({ profile, onClose, onPurchaseComplete }: StoreModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const supabase = createClient()

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'HabitBlooms',
          text: 'Join me on HabitBlooms and let\'s build better habits together!',
          url: 'https://www.habitblooms.in/?ref=invite'
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
      const newSeeds = profile.seeds - STREAK_FREEZE_COST
      const newFreezes = (profile.streak_freezes || 0) + 1

      const { data, error: updateError } = await supabase
        .from('profiles')
        .update({
          seeds: newSeeds,
          streak_freezes: newFreezes
        })
        .eq('id', profile.id)
        .select()
        .single()

      if (updateError) throw updateError

      setSuccessMsg('Successfully equipped 1 Streak Freeze! 🛡️')
      setTimeout(() => {
        onPurchaseComplete(data)
      }, 1500)

    } catch (err: any) {
      setError(err.message || 'Failed to purchase item.')
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
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#0a0f1c] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative"
      >
        {/* Background ambient glow */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-amber-500/20 blur-[100px] pointer-events-none" />

        <div className="flex items-center justify-between mb-8 relative z-10">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              Garden Shop 🏪
            </h2>
            <p className="text-gray-400 text-sm mt-1">Spend your hard-earned seeds</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors bg-white/5 p-2 rounded-full shrink-0">
            <X size={20} />
          </button>
        </div>

        {/* User Balance */}
        <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-4 mb-4 relative z-10">
          <span className="text-gray-300 font-medium">Your Balance</span>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-amber-400">{profile.seeds || 0}</span>
            <Coins className="text-amber-500" size={24} />
          </div>
        </div>

        {/* Earn by Referral Banner */}
        <div className="mb-8 relative z-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-gradient-to-r from-emerald-900/40 to-emerald-900/10 border border-emerald-500/30 rounded-2xl">
            <div className="text-center sm:text-left">
              <h3 className="font-bold text-white flex items-center justify-center sm:justify-start gap-2">
                Need more seeds? <Sparkles className="text-yellow-400" size={16} />
              </h3>
              <p className="text-xs text-emerald-200/70 mt-1">Invite a friend to HabitBlooms and earn +1,000 seeds when they join!</p>
            </div>
            <button 
              onClick={handleShare}
              className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-xl transition-colors shadow-lg shadow-emerald-500/20"
            >
              <Share2 size={16} /> Invite
            </button>
          </div>
        </div>

        {/* Store Items Grid */}
        <div className="space-y-4 relative z-10">
          
          {/* Item: Streak Freeze */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 bg-gradient-to-br from-blue-900/40 to-blue-900/10 border border-blue-500/20 rounded-2xl p-4 sm:p-5 hover:border-blue-500/50 transition-all group">
            <div className="flex items-start sm:items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 shrink-0 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/30 group-hover:scale-110 transition-transform">
                <ShieldAlert size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white text-base sm:text-lg">Streak Freeze</h3>
                <p className="text-xs sm:text-sm text-blue-200/60 max-w-full sm:max-w-[200px]">Protects your streak if you miss one day. Equips automatically.</p>
                <div className="text-[10px] sm:text-xs font-bold text-blue-400 mt-1">You own: {profile.streak_freezes || 0}</div>
              </div>
            </div>

            <button
              onClick={handleBuyFreeze}
              disabled={loading || profile.seeds < STREAK_FREEZE_COST}
              className="flex sm:flex-col items-center justify-center gap-2 sm:gap-0 w-full sm:w-auto px-6 py-3 sm:py-2 bg-white/10 hover:bg-amber-500/20 hover:border-amber-500/50 border border-white/10 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin text-amber-400" />
              ) : (
                <>
                  <span className="text-xs text-gray-400 font-medium sm:mb-0.5">BUY</span>
                  <div className="flex items-center gap-1.5 font-bold text-amber-400">
                    <Coins size={14} /> {STREAK_FREEZE_COST}
                  </div>
                </>
              )}
            </button>
          </div>

          {/* Item: Rare Seed (Coming Soon) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 bg-white/[0.02] border border-white/5 rounded-2xl p-4 sm:p-5 opacity-50 grayscale cursor-not-allowed">
            <div className="flex items-start sm:items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 shrink-0 rounded-xl bg-pink-500/20 flex items-center justify-center text-pink-400 border border-pink-500/30">
                <Sparkles size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white text-base sm:text-lg">Neon Lotus Seed</h3>
                <p className="text-xs sm:text-sm text-gray-400 max-w-full sm:max-w-[200px]">Unlock a legendary glowing plant for your dashboard.</p>
              </div>
            </div>
            <div className="w-full sm:w-auto text-center px-6 py-3 bg-white/5 rounded-xl text-gray-500 font-bold text-sm shrink-0">
              Coming Soon
            </div>
          </div>

        </div>

        {/* Feedback Messages */}
        {error && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm mt-4 text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20">
            {error}
          </motion.p>
        )}
        {successMsg && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-emerald-400 text-sm mt-4 text-center bg-emerald-500/10 py-2 rounded-lg border border-emerald-500/20">
            {successMsg}
          </motion.p>
        )}

      </motion.div>
    </motion.div>
  )
}
