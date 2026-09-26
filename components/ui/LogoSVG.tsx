import React from 'react'

interface LogoSVGProps {
  className?: string
}

export function LogoSVG({ className }: LogoSVGProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Neon Emerald Gradient for the Ring and Plant */}
        <linearGradient id="emeraldGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#059669" /> {/* Emerald 600 */}
          <stop offset="100%" stopColor="#34d399" /> {/* Emerald 400 */}
        </linearGradient>
        
        {/* Vibrant Gold Gradient for the Sparkles */}
        <linearGradient id="goldGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f59e0b" /> {/* Amber 500 */}
          <stop offset="100%" stopColor="#fbbf24" /> {/* Amber 400 */}
        </linearGradient>

        {/* Subtle Glow Filter */}
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Outer Incomplete Circle */}
      <path 
        d="M 40 10 A 40 40 0 1 0 85 58" 
        stroke="url(#emeraldGrad)" 
        strokeWidth="5.5" 
        strokeLinecap="round" 
        filter="url(#glow)"
      />

      {/* Checkmark Base */}
      <path 
        d="M 28 62 L 45 78 L 72 50" 
        stroke="url(#emeraldGrad)" 
        strokeWidth="6" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />

      {/* Growing Stem */}
      <path 
        d="M 45 78 Q 45 55 52 32" 
        stroke="url(#emeraldGrad)" 
        strokeWidth="4" 
        strokeLinecap="round" 
      />

      {/* Left Leaf */}
      <path 
        d="M 46 62 C 22 62 25 43 38 43 C 44 43 46 52 46 62 Z" 
        fill="url(#emeraldGrad)" 
      />

      {/* Right Leaf */}
      <path 
        d="M 50 50 C 73 43 68 25 58 25 C 52 25 49 38 50 50 Z" 
        fill="url(#emeraldGrad)" 
      />

      {/* Top Right Sparkle 1 (Large) */}
      <path 
        d="M 72 15 Q 72 25 82 25 Q 72 25 72 35 Q 72 25 62 25 Q 72 25 72 15 Z" 
        fill="url(#goldGrad)" 
        filter="url(#glow)"
      />
      
      {/* Top Right Sparkle 2 (Small) */}
      <path 
        d="M 90 8 Q 90 14 96 14 Q 90 14 90 20 Q 90 14 84 14 Q 90 14 90 8 Z" 
        fill="url(#goldGrad)" 
        filter="url(#glow)"
      />

      {/* Middle Right Sparkle 3 (Medium) */}
      <path 
        d="M 88 30 Q 88 37 95 37 Q 88 37 88 44 Q 88 37 81 37 Q 88 37 88 30 Z" 
        fill="url(#goldGrad)" 
        filter="url(#glow)"
      />
    </svg>
  )
}
