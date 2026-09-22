import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: Request) {
  // Verify cron secret for security
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  
  // Allow manual testing via query param in development
  const url = new URL(request.url)
  const isDevTesting = process.env.NODE_ENV === 'development' && url.searchParams.get('test') === 'true'

  if (!isDevTesting && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Use Service Role Key to bypass RLS for background jobs
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  try {
    const yesterdayDate = new Date()
    yesterdayDate.setDate(yesterdayDate.getDate() - 1)
    const yesterdayStr = yesterdayDate.toISOString().split('T')[0]

    console.log(`[Cron] Processing daily streaks for: ${yesterdayStr}`)

    // 1. Fetch all profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, streak, streak_at_risk, streak_freezes')

    if (profilesError) throw profilesError

    for (const profile of profiles || []) {
      // 2. Fetch active habits for this user
      const { data: habits } = await supabase
        .from('habits')
        .select('id')
        .eq('user_id', profile.id)
        .eq('is_archived', false)

      const activeHabitCount = habits?.length || 0

      // 3. Fetch yesterday's completions for this user
      const { data: completions } = await supabase
        .from('habit_completions')
        .select('id')
        .eq('user_id', profile.id)
        .eq('completed_at', yesterdayStr)

      const completionsCount = completions?.length || 0

      // Skip users with no active habits to prevent unfairly burning their streak
      if (activeHabitCount === 0) {
        console.log(`[Cron] User ${profile.id} has 0 habits. Skipping.`)
        continue
      }

      // 4. Perfect Day Logic
      if (completionsCount >= activeHabitCount) {
        // Perfect Day!
        console.log(`[Cron] User ${profile.id} had a Perfect Day.`)
        await supabase.from('profiles').update({
          streak: (profile.streak || 0) + 1,
          streak_at_risk: false
        }).eq('id', profile.id)
      } else {
        // Missed Day!
        if (profile.streak_at_risk) {
          // They missed yesterday AND the day before (and didn't repair). Burn streak to 0.
          console.log(`[Cron] User ${profile.id} ignored risk. Burning streak.`)
          await supabase.from('profiles').update({
            streak: 0,
            streak_at_risk: false
          }).eq('id', profile.id)
        } else {
          // First miss. Put streak at risk!
          console.log(`[Cron] User ${profile.id} missed day. Setting risk=true.`)
          // (Wait, do they auto-freeze if they have a freeze? The user wanted the Repair modal to manually consume freezes to make it dramatic!
          // So we always set risk to true, and let them repair it manually.)
          await supabase.from('profiles').update({
            streak_at_risk: true
          }).eq('id', profile.id)
        }
      }
    }

    return NextResponse.json({ success: true, processed: profiles?.length || 0 })
  } catch (error) {
    console.error('[Cron] Error processing daily streaks:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
