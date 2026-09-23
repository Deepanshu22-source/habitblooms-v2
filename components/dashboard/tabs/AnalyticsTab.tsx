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

  const { data: { user } } = await supabase.auth.getUser()
  let dbStreak = 0
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('streak').eq('id', user.id).single()
    if (profile) dbStreak = profile.streak || 0
  }

  return <AnalyticsClient habits={habits ?? []} completions={completions ?? []} dbStreak={dbStreak} />
}
