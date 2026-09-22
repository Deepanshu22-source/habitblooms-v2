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

  // Calculate REAL true streak from database
  let trueStreak = 0
  if (user) {
    const { data: allCompletions } = await supabase
      .from('habit_completions')
      .select('completed_at')
      .order('completed_at', { ascending: false })
    
    if (allCompletions && allCompletions.length > 0) {
      const uniqueDates = Array.from(new Set(allCompletions.map(c => c.completed_at)))
      const sorted = uniqueDates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
      
      const todayDate = new Date()
      // Adjust to local date string matching DB format (YYYY-MM-DD)
      // Vercel runs in UTC, so we will check if the latest is today OR yesterday to maintain streak
      const todayStr = todayDate.toISOString().split('T')[0]
      const yesterdayDate = new Date(todayDate)
      yesterdayDate.setDate(yesterdayDate.getDate() - 1)
      const yesterdayStr = yesterdayDate.toISOString().split('T')[0]

      if (sorted[0] === todayStr || sorted[0] === yesterdayStr) {
        let currentStreak = 1
        for (let i = 1; i < sorted.length; i++) {
          const current = new Date(sorted[i - 1])
          const prev = new Date(sorted[i])
          const diffDays = Math.round((current.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24))
          
          if (diffDays === 1) {
            currentStreak++
          } else {
            break // Streak broken
          }
        }
        trueStreak = currentStreak
      }
    }
  }

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
