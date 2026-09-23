'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import AnalyticsClient from '@/components/dashboard/AnalyticsClient'
import { Loader2 } from 'lucide-react'

export default function AnalyticsTab({ dbStreak }: { dbStreak: number }) {
  const [data, setData] = useState<{ habits: any[], completions: any[] } | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function loadData() {
      const { data: habits } = await supabase.from('habits').select('*').eq('is_archived', false)
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - 84)
      const { data: completions } = await supabase
        .from('habit_completions')
        .select('*')
        .gte('completed_at', startDate.toISOString().split('T')[0])
        .order('completed_at', { ascending: false })
        
      setData({ habits: habits ?? [], completions: completions ?? [] })
    }
    loadData()
  }, [])

  if (!data) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-violet-400" /></div>
  }

  return <AnalyticsClient habits={data.habits} completions={data.completions} dbStreak={dbStreak} />
}
