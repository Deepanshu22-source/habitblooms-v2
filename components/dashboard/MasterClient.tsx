'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, Users, BarChart2, ListChecks, Bell, Share2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

// Import Tabs
import TodayTab from './tabs/TodayTab'
import HabitsClient from './HabitsClient'
import CommunityTab from './tabs/CommunityTab'
import AnalyticsTab from './tabs/AnalyticsTab'
import ProfileTab from './tabs/ProfileTab' // We'll keep Profile as a tab or overlay

const LogoSVG = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 15C50 15 35 35 35 55C35 65 42 75 50 75C58 75 65 65 65 55C65 35 50 15 50 15Z" fill="url(#paint0_linear)" />
    <path d="M50 75C45 75 42 82 42 85C42 88 45 90 50 90C55 90 58 88 58 85C58 82 55 75 50 75Z" fill="#10B981" />
    <defs>
      <linearGradient id="paint0_linear" x1="50" y1="15" x2="50" y2="75" gradientUnits="userSpaceOnUse">
        <stop stopColor="#8B5CF6" />
        <stop offset="1" stopColor="#EC4899" />
      </linearGradient>
    </defs>
  </svg>
)

const navItems = [
  { id: 'today', icon: LayoutDashboard, label: 'Today' },
  { id: 'habits', icon: ListChecks, label: 'Habits' },
  { id: 'community', icon: Users, label: 'Community' },
  { id: 'analytics', icon: BarChart2, label: 'Analytics' },
]

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export default function MasterClient({ user, initialData }: { user: User, initialData: any }) {
  const [activeTab, setActiveTab] = useState('today')
  const [isSubscribed, setIsSubscribed] = useState(true)
  const [showPushPrompt, setShowPushPrompt] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function checkSubscription() {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        setIsSubscribed(true) // Hide button if unsupported
        return
      }
      try {
        const registration = await navigator.serviceWorker.ready
        const subscription = await registration.pushManager.getSubscription()
        setIsSubscribed(!!subscription)
        
        const dismissed = localStorage.getItem('habitblooms_push_dismissed')
        if (!subscription && !dismissed) {
          const { data: profile } = await supabase.from('profiles').select('score').eq('id', user.id).maybeSingle()
          if (profile && profile.score > 20) {
            setShowPushPrompt(true)
          }
        }
      } catch (err) {
        console.error('Error checking push subscription:', err)
      }
    }
    checkSubscription()
  }, [user.id, supabase])

  const handleSubscribe = async () => {
    try {
      const registration = await navigator.serviceWorker.ready
      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      if (!vapidKey) throw new Error('No VAPID key found')

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey)
      })

      await supabase.from('push_subscriptions').upsert({
        user_id: user.id,
        endpoint: subscription.endpoint,
        p256dh: subscription.toJSON().keys?.p256dh,
        auth: subscription.toJSON().keys?.auth,
      }, { onConflict: 'endpoint' })

      setIsSubscribed(true)
      alert('Notifications enabled! You will now receive daily reminders.')
    } catch (err) {
      console.error('Failed to subscribe:', err)
      alert('Failed to enable notifications. Please check your browser settings.')
    }
  }



  const handleShare = async () => {
    const url = `https://habitblooms.in/login?ref=${user.id}`
    const shareData = {
      title: 'HabitBlooms',
      text: `I'm tracking my daily habits and growing my virtual garden on HabitBlooms! Come join me and let's build our streaks together. 🌱🔥\n\nJoin here: ${url}`,
      url: url
    }
    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(shareData.text)
        alert('Link copied to clipboard!')
      }
    } catch (err) {
      console.log('Error sharing:', err)
    }
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'today':
        return <TodayTab {...initialData} />
      case 'habits':
        return <HabitsClient initialHabits={initialData.habits} />
      case 'community':
        return <CommunityTab />
      case 'analytics':
        return <AnalyticsTab dbStreak={initialData.streak} />
      case 'profile':
        return <ProfileTab />
      default:
        return <TodayTab {...initialData} />
    }
  }

  return (
    <>
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#030712]/80 backdrop-blur-xl border-b border-white/5">
        <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => setActiveTab('today')} className="flex items-center gap-2">
            <LogoSVG className="w-8 h-8 drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
            <span className="text-white font-bold hidden sm:block">
              Habit<span className="text-emerald-400">Blooms</span>
            </span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const active = activeTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? 'bg-violet-500/20 text-violet-300'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon size={16} />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </div>

          {/* User & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleShare}
              className="flex items-center justify-center bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 p-2 sm:px-3 sm:py-1.5 rounded-lg border border-emerald-500/20 transition-colors"
            >
              <Share2 size={16} className="sm:w-[14px] sm:h-[14px]" /> <span className="hidden sm:inline text-xs font-medium ml-1.5">Share</span>
            </button>

            {!isSubscribed && (
               <button
                 onClick={handleSubscribe}
                 className="flex items-center justify-center bg-white/5 hover:bg-white/10 text-violet-300 p-2 sm:px-3 sm:py-1.5 rounded-lg border border-violet-500/20 transition-colors"
               >
                 <Bell size={16} className="sm:w-[14px] sm:h-[14px]" /> <span className="hidden sm:inline text-xs font-medium ml-1.5">Enable Alerts</span>
               </button>
            )}

            <button onClick={() => setActiveTab('profile')} className="hover:opacity-80 transition-opacity shrink-0">
              {user.user_metadata?.custom_avatar || user.user_metadata?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.user_metadata?.custom_avatar || user.user_metadata?.avatar_url}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full border border-white/10"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white text-sm font-medium border border-white/10">
                  {user.email?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
            </button>


          </div>
        </nav>
      </header>

      {/* Main Tab Content Container */}
      <main className="max-w-5xl mx-auto px-4 pb-32 md:pb-8 pt-24 md:pt-28">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
          >
            {renderActiveTab()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Nav for Mobile - iOS Native Style */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#030712]/90 backdrop-blur-2xl border-t border-white/10 pb-[max(env(safe-area-inset-bottom),16px)] shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => {
            const active = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center w-full h-full gap-1 ${
                  active ? 'text-emerald-400' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <item.icon size={20} className={active ? 'drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]' : ''} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <AnimatePresence>
        {showPushPrompt && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowPushPrompt(false)
                localStorage.setItem('habitblooms_push_dismissed', 'true')
              }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.9 }}
              className="fixed bottom-0 sm:bottom-auto sm:top-1/2 left-0 right-0 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-[70] bg-[#0f172a] sm:rounded-3xl rounded-t-3xl p-6 border-t sm:border border-white/10 shadow-2xl max-w-sm w-full pb-[max(env(safe-area-inset-bottom),16px)]"
            >
              <div className="w-12 h-12 bg-violet-500/20 rounded-2xl flex items-center justify-center mb-4 border border-violet-500/30">
                <Bell size={24} className="text-violet-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Don&apos;t miss a streak!</h3>
              <p className="text-gray-400 text-sm mb-6">
                Allow notifications to get friendly reminders when it&apos;s time to water your virtual garden.
              </p>
              
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    setShowPushPrompt(false)
                    handleSubscribe()
                  }}
                  className="w-full py-3.5 bg-violet-500 hover:bg-violet-600 text-white rounded-xl font-semibold transition-colors shadow-[0_0_20px_rgba(139,92,246,0.3)] active:scale-95"
                >
                  Allow Notifications
                </button>
                <button
                  onClick={() => {
                    setShowPushPrompt(false)
                    localStorage.setItem('habitblooms_push_dismissed', 'true')
                  }}
                  className="w-full py-3.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl font-medium transition-colors active:scale-95"
                >
                  Maybe Later
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
