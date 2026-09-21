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

  // Fetch today's completions
  const { data: completions } = await supabase
    .from('habit_completions')
    .select('habit_id')
    .eq('completed_at', today)

  // Fetch user's real score, streak, and new virtual garden economy from the new profiles table
  let profileData = { score: 0, streak: 0, seeds: 0, streak_freezes: 0, plant_stage: 1, plant_health: 100 }
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('score, streak, seeds, streak_freezes, plant_stage, plant_health')
      .eq('id', user.id)
      .single()
    if (profile) {
      profileData = profile
    }
  }

  const completedIds = new Set(completions?.map((c) => c.habit_id) ?? [])

  return (
    <DashboardClient
      habits={habits ?? []}
      completedIds={Array.from(completedIds)}
      userName={user?.user_metadata?.full_name?.split(' ')[0] ?? 'there'}
      score={profileData.score}
      streak={profileData.streak}
      seeds={profileData.seeds}
      streakFreezes={profileData.streak_freezes}
      plantStage={profileData.plant_stage}
      plantHealth={profileData.plant_health}
      profileId={user?.id}
    />
  )
}
