'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function ReferralTracker() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const ref = searchParams.get('ref')
    if (ref) {
      // Save the referrer's ID to localStorage so we can reward them after the user logs in
      localStorage.setItem('habitblooms_referred_by', ref)
    }
  }, [searchParams])

  return null
}
