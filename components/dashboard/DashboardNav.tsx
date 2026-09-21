'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { LogoSVG } from '@/components/ui/LogoSVG'
import { usePathname, useRouter } from 'next/navigation'
import { Flower2, LayoutDashboard, ListChecks, BarChart2, LogOut, Bell, Users, Share2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Today' },
  { href: '/habits', icon: ListChecks, label: 'Habits' },
  { href: '/community', icon: Users, label: 'Community' },
  { href: '/analytics', icon: BarChart2, label: 'Analytics' },
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

export default function DashboardNav({ user }: { user: User }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [showPushPrompt, setShowPushPrompt] = useState(false)

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window) {
      navigator.serviceWorker.ready.then((reg) => {
        reg.pushManager.getSubscription().then((sub) => {
          setIsSubscribed(!!sub)
          
          // Auto-prompt logic for new users
          if (!sub && Notification.permission === 'default') {
            const hasDismissed = localStorage.getItem('habitblooms_push_dismissed')
            if (!hasDismissed) {
              // Wait 2.5 seconds so it feels natural and not immediate spam
              setTimeout(() => setShowPushPrompt(true), 2500)
            }
          }
        })
      })
    }
  }, [])

  const handleSubscribe = async () => {
    if (!('serviceWorker' in navigator)) return
    
    try {
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') return

      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!)
      })

      const subData = JSON.parse(JSON.stringify(subscription))
      
      await supabase.from('push_subscriptions').upsert({
        user_id: user.id,
        endpoint: subData.endpoint,
        p256dh: subData.keys.p256dh,
        auth: subData.keys.auth
      }, { onConflict: 'user_id,endpoint' })

      setIsSubscribed(true)
      alert('Notifications enabled successfully!')
    } catch (err) {
      console.error('Failed to subscribe:', err)
      alert('Failed to enable notifications. Please make sure they are allowed in your browser settings.')
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
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

  return (
    <>
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#030712]/80 backdrop-blur-xl border-b border-white/5">
        <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <LogoSVG className="w-8 h-8 drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
            <span className="text-white font-bold hidden sm:block">
              Habit<span className="text-emerald-400">Blooms</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={true}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? 'bg-violet-500/20 text-violet-300'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon size={16} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>

          {/* User & Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 text-xs font-medium bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-lg border border-emerald-500/20 transition-colors"
              title="Share with friends"
            >
              <Share2 size={14} /> <span className="hidden sm:inline">Share</span>
            </button>

            {!isSubscribed && (
               <button
                 onClick={handleSubscribe}
                 className="hidden lg:flex items-center gap-2 text-xs font-medium bg-white/5 hover:bg-white/10 text-violet-300 px-3 py-1.5 rounded-lg border border-violet-500/20 transition-colors"
                 title="Enable Notifications"
               >
                 <Bell size={14} /> Enable Alerts
               </button>
            )}

            <Link href="/profile" className="hover:opacity-80 transition-opacity">
              {user.user_metadata?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.user_metadata.avatar_url}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full border border-white/10"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white text-sm font-medium border border-white/10">
                  {user.email?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
            </Link>

            <button
              onClick={handleSignOut}
              className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
              title="Sign Out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </nav>
      </header>

      {/* Bottom Nav for Mobile - iOS Native Style */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#030712]/90 backdrop-blur-2xl border-t border-white/10 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                className={`flex flex-col items-center justify-center w-full h-full gap-1 ${
                  active ? 'text-emerald-400' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <item.icon size={20} className={active ? 'drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]' : ''} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
      {/* Auto-Prompt Notification Modal */}
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
              className="fixed bottom-0 sm:bottom-auto sm:top-1/2 left-0 right-0 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-[70] bg-[#0f172a] sm:rounded-3xl rounded-t-3xl p-6 border-t sm:border border-white/10 shadow-2xl max-w-sm w-full pb-safe"
            >
              <div className="w-12 h-12 bg-violet-500/20 rounded-2xl flex items-center justify-center mb-4 border border-violet-500/30">
                <Bell size={24} className="text-violet-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Don't miss a streak!</h3>
              <p className="text-gray-400 text-sm mb-6">
                Allow notifications to get friendly reminders when it's time to water your virtual garden.
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
