import React from 'react'

export function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* The Incomplete Circle (Emerald) */}
      <path 
        d="M 50 15 A 35 35 0 1 0 82 35" 
        stroke="#10b981" 
        strokeWidth="6" 
        strokeLinecap="round" 
        fill="none" 
      />

      {/* The Checkmark (Emerald) */}
      <path 
        d="M 35 60 L 48 73 L 70 51" 
        stroke="#10b981" 
        strokeWidth="7" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        fill="none" 
      />

      {/* The Plant Leaves (Emerald) */}
      {/* Stem growing from checkmark center (48, 73) */}
      <path 
        d="M 48 73 Q 48 50 48 45" 
        stroke="#10b981" 
        strokeWidth="4" 
        strokeLinecap="round" 
      />
      {/* Left Leaf */}
      <path 
        d="M 48 58 Q 30 50 35 38 Q 45 35 48 48 Z" 
        fill="#10b981" 
      />
      {/* Right Leaf */}
      <path 
        d="M 48 53 Q 65 42 60 28 Q 50 25 48 40 Z" 
        fill="#10b981" 
      />

      {/* The Gold Sparkles (Stars) */}
      <g fill="#fbbf24">
        {/* Top Left Star */}
        <path d="M 68 25 Q 72 25 72 21 Q 72 25 76 25 Q 72 25 72 29 Q 72 25 68 25 Z" />
        {/* Main Center Star */}
        <path d="M 75 35 Q 82 35 82 28 Q 82 35 89 35 Q 82 35 82 42 Q 82 35 75 35 Z" />
        {/* Bottom Right Star */}
        <path d="M 85 48 Q 88 48 88 45 Q 88 48 91 48 Q 88 48 88 51 Q 88 48 85 48 Z" />
      </g>
    </svg>
  )
}
