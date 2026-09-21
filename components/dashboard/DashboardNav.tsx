'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
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

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.ready.then((reg) => {
        reg.pushManager.getSubscription().then((sub) => {
          setIsSubscribed(!!sub)
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
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#030712]/80 backdrop-blur-xl border-b border-white/5">
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <LogoSVG className="w-8 h-8 drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
          <span className="text-white font-bold hidden sm:block">
            Habit<span className="text-emerald-400">Blooms</span>
          </span>
        </Link>

        {/* Nav */}
        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-violet-500/20 text-violet-300'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon size={16} />
                <span className="hidden md:block">{item.label}</span>
              </Link>
            )
          })}
        </div>

        {/* User */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleShare}
            className="hidden sm:flex items-center gap-1.5 text-xs font-medium bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-lg border border-emerald-500/20 transition-colors"
            title="Share with friends"
          >
            <Share2 size={14} /> Share
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

          <Link href="/profile" className="ml-2 hover:opacity-80 transition-opacity">
            {user.user_metadata?.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url}
                alt="avatar"
                className="w-8 h-8 rounded-full ring-2 ring-violet-500/30"
              />
            ) : (
              <div className="w-8 h-8 rounded-full ring-2 ring-violet-500/30 bg-white/10 flex items-center justify-center text-xs text-white">
                {user.email?.charAt(0).toUpperCase()}
              </div>
            )}
          </Link>
          <button
            onClick={handleSignOut}
            className="text-gray-500 hover:text-white transition-colors ml-2"
            title="Sign out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </nav>
    </header>
  )
}
