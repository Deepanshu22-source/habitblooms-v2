import { createClient } from '@/lib/supabase/server'
import DashboardClient from '@/components/dashboard/DashboardClient'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const today = new Date().toISOString().split('T')[0]

  // Fetch habits
  const { data: habits } = await supabase
    .from('habits')
    .select('*')
    .eq('is_archived', false)
    .order('created_at', { ascending: true })

  // Fetch recent completions (last 3 days) to account for timezone differences between Vercel (UTC) and user's local phone time
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  const { data: completions } = await supabase
    .from('habit_completions')
    .select('habit_id, completed_at')
    .gte('completed_at', threeDaysAgo)

  // Fetch user's real score, streak, and new virtual garden economy from the new profiles table
  let profileData = { score: 0, streak: 0, streak_at_risk: false, seeds: 0, streak_freezes: 0, plant_stage: 1, plant_health: 100 }
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('score, seeds, streak_freezes, plant_stage, plant_health, streak_at_risk')
      .eq('id', user.id)
      .single()
    if (profile) {
      profileData = { ...profileData, ...profile }
    }
  }

  // Note: Streak is now exclusively managed by the daily cron job for strict Perfect Day accuracy.
  const trueStreak = profileData.streak || 0

  const recentCompletions = completions ?? []

  return (
    <DashboardClient
      habits={habits ?? []}
      recentCompletions={recentCompletions}
      userName={user?.user_metadata?.full_name?.split(' ')[0] ?? 'there'}
      score={profileData.score}
      streak={trueStreak}
      streakAtRisk={profileData.streak_at_risk}
      seeds={profileData.seeds}
      streakFreezes={profileData.streak_freezes}
      plantStage={profileData.plant_stage}
      plantHealth={profileData.plant_health}
      profileId={user?.id}
    />
  )
}
