import { createClient } from '@/lib/supabase/server'
import AnalyticsClient from '@/components/dashboard/AnalyticsClient'

export default async function AnalyticsPage() {
  const supabase = await createClient()

  const { data: habits } = await supabase
    .from('habits')
    .select('*')
    .eq('is_archived', false)

  const startDate = new Date()
  startDate.setDate(startDate.getDate() - 84)

  const { data: completions } = await supabase
    .from('habit_completions')
    .select('*')
    .gte('completed_at', startDate.toISOString().split('T')[0])
    .order('completed_at', { ascending: false })

  return <AnalyticsClient habits={habits ?? []} completions={completions ?? []} />
}
