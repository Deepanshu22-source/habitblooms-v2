'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Flower2, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'

import { LogoSVG } from '@/components/ui/LogoSVG'

function ReferralTracker() {
  const searchParams = useSearchParams()
  useEffect(() => {
    const ref = searchParams.get('ref')
    if (ref) {
      // Save referral code in a cookie for 1 day
      document.cookie = `habitblooms_referral=${ref}; path=/; max-age=86400; SameSite=Lax`
    }
  }, [searchParams])
  return null
}

const CinematicBackground = () => {
  // Generate random particles for a cinematic "depth of field" effect
  const particles = Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
    yOffset: Math.random() * -50 - 20
  }))

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* 1. Deep space glowing nebulas */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-violet-900/30 blur-[120px]"
      />
      <motion.div 
        animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.3, 0.1], rotate: [0, -45, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-emerald-900/20 blur-[120px]"
      />

      {/* 2. Floating cinematic particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}vw`,
            top: `${p.y}vh`,
            backgroundColor: p.size > 2 ? '#e9d5ff' : '#10b981', // Light purple vs emerald
            boxShadow: `0 0 ${p.size * 3}px ${p.size > 2 ? 'rgba(233,213,255,0.8)' : 'rgba(16,185,129,0.5)'}`
          }}
          animate={{
            y: [0, p.yOffset],
            x: [0, Math.random() * 100 - 50],
            opacity: [0, Math.random() * 0.5 + 0.3, 0],
            scale: [0, 1, 0]
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear"
          }}
        />
      ))}

      {/* 3. Cinematic Vignette (darkens edges) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#030712_100%)] opacity-80" />
      
      {/* 4. Film Grain Overlay */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
    </div>
  )
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const handleGoogleLogin = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      
      if (error) {
        setError(error.message)
        setLoading(false)
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred')
      setLoading(false)
    }
  }

  const GoogleLogo = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden bg-[#030712]">
      
      <Suspense fallback={null}>
        <ReferralTracker />
      </Suspense>

      <CinematicBackground />

      <div className="relative w-full max-w-md z-10">
        
        {/* Back to Home Link */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute -top-16 left-0 right-0 flex justify-center"
        >
          <Link href="/" className="text-gray-500 hover:text-white transition-colors text-sm font-medium tracking-wide">
            ← BACK TO HOME
          </Link>
        </motion.div>

        {/* Main Glass Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} // Cinematic easing
          className="rounded-3xl p-8 sm:p-12 shadow-[0_0_50px_rgba(16,185,129,0.15)] border border-white/5 relative overflow-hidden backdrop-blur-2xl bg-black/40"
        >
          {/* Subtle inner top glow */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
          
          <div className="flex flex-col items-center text-center">
            
            {/* Animated Logo */}
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.4 }}
              className="mb-8"
            >
              <LogoSVG className="w-20 h-20 drop-shadow-[0_0_15px_rgba(16,185,129,0.4)]" />
            </motion.div>

            {/* Typography */}
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="text-3xl font-bold text-white mb-3 tracking-tight"
            >
              Welcome to <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-400 bg-[length:200%_auto] animate-gradient">HabitBlooms</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="text-gray-400 text-sm mb-10 tracking-wide"
            >
              Log in to continue your journey.
            </motion.p>
            
            {/* Error Message */}
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-6 w-full p-4 bg-red-950/30 border border-red-500/20 rounded-xl text-red-400 text-sm backdrop-blur-md"
              >
                {error}
              </motion.div>
            )}

            {/* Login Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full relative group flex items-center justify-center gap-3 px-6 py-4 bg-white/5 text-white border border-white/10 hover:border-white/20 rounded-2xl font-semibold transition-all disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden shadow-xl"
            >
              <div className="absolute inset-0 bg-white/10 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
              
              <span className="relative flex items-center gap-3">
                {loading ? <Loader2 size={20} className="animate-spin text-white" /> : <GoogleLogo />}
                {loading ? 'Authenticating...' : 'Sign in with Google'}
              </span>
            </motion.button>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
              className="text-xs text-gray-500 mt-8 tracking-wide"
            >
              SECURE OAUTH AUTHENTICATION
            </motion.p>
            
          </div>
        </motion.div>
      </div>
    </div>
  )
}
