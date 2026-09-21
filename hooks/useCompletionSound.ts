'use client'

import { useCallback, useRef, useEffect } from 'react'

export function useCompletionSound() {
  const ctxRef = useRef<AudioContext | null>(null)

  // Create AudioContext lazily on first use
  const getContext = useCallback(() => {
    if (typeof window === 'undefined') return null
    if (!ctxRef.current || ctxRef.current.state === 'closed') {
      ctxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    return ctxRef.current
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (ctxRef.current && ctxRef.current.state !== 'closed') {
        ctxRef.current.close()
      }
    }
  }, [])

  const playSound = useCallback(() => {
    const ctx = getContext()
    if (!ctx) return

    // Resume if suspended (browser autoplay policy)
    if (ctx.state === 'suspended') {
      ctx.resume()
    }

    const frequencies = [523.25, 659.25, 783.99] // C5, E5, G5 major chord

    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const delay = i * 0.08
      const startTime = ctx.currentTime + delay

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, startTime)
      gain.gain.setValueAtTime(0.15, startTime)
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.6)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(startTime)
      osc.stop(startTime + 0.6)
    })
  }, [getContext])

  return playSound
}
