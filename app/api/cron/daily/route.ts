import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import webpush from 'web-push'

// Configure web-push with VAPID keys
webpush.setVapidDetails(
  'mailto:admin@habitblooms.in',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '',
  process.env.VAPID_PRIVATE_KEY || ''
)

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  const url = new URL(request.url)
  const isDevTesting = process.env.NODE_ENV === 'development' && url.searchParams.get('test') === 'true'

  if (!isDevTesting && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  try {
    // Calculate current time in IST
    const nowUtc = new Date().getTime()
    const istTime = new Date(nowUtc + (5.5 * 60 * 60 * 1000))
    // Subtract 1 day to get yesterday in IST
    istTime.setDate(istTime.getDate() - 1)
    
    // Because we artificially shifted the UTC time forward by 5.5 hours, 
    // toISOString() will give us the correct IST date string.
    const yesterdayStr = istTime.toISOString().split('T')[0]

    console.log(`[Cron] Processing daily streaks for IST Date: ${yesterdayStr}`)

    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, streak, streak_at_risk, streak_freezes')

    if (profilesError) throw profilesError

    const yesterdayDayOfWeek = istTime.getDay() // 0 = Sun, 1 = Mon...

    for (const profile of profiles || []) {
      const { data: habits } = await supabase
        .from('habits')
        .select('id')
        .eq('user_id', profile.id)
        .eq('is_archived', false)
        .contains('target_days', [yesterdayDayOfWeek])
        
      const activeHabitCount = habits?.length || 0

      const { data: completions } = await supabase.from('habit_completions').select('id').eq('user_id', profile.id).eq('completed_at', yesterdayStr)
      const completionsCount = completions?.length || 0

      if (activeHabitCount === 0) continue

      if (completionsCount >= activeHabitCount) {
        // Perfect Day!
        await supabase.from('profiles').update({ streak: (profile.streak || 0) + 1, streak_at_risk: false }).eq('id', profile.id)
      } else {
        // Missed Day!
        if (profile.streak_at_risk) {
          // Ignored risk. Burn streak to 0.
          await supabase.from('profiles').update({ streak: 0, streak_at_risk: false }).eq('id', profile.id)
          
          // Notify streak lost
          const { data: subs } = await supabase.from('push_subscriptions').select('*').eq('user_id', profile.id)
          const payload = JSON.stringify({ title: 'Streak Lost 💔', body: 'You forgot to repair your streak. Your streak has been reset to 0.', icon: '/icons/icon-192x192.png', badge: '/icons/icon-192x192.png', url: '/dashboard' })
          for (const sub of subs || []) {
            try { await webpush.sendNotification({ endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } }, payload) } catch (err) {}
          }
        } else {
          // First miss. Put streak at risk!
          await supabase.from('profiles').update({ streak_at_risk: true }).eq('id', profile.id)
          
          // Notify streak at risk
          const { data: subs } = await supabase.from('push_subscriptions').select('*').eq('user_id', profile.id)
          const payload = JSON.stringify({ title: '⚠️ Streak at Risk!', body: 'You missed a habit yesterday! Open the app now to repair your streak before it resets!', icon: '/icons/icon-192x192.png', badge: '/icons/icon-192x192.png', url: '/dashboard' })
          for (const sub of subs || []) {
            try { await webpush.sendNotification({ endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } }, payload) } catch (err) {}
          }
        }
      }
    }

    // --- WEEKLY RESET LOGIC ---
    // If the day we just processed was Sunday (0), it means it's now Monday Midnight IST.
    const isSunday = istTime.getDay() === 0
    if (isSunday) {
      console.log(`[Cron] 🏆 Weekly Reset Triggered! Resetting all leaderboard scores to 0.`)
      // Bulk update all users who have a score > 0 back to 0
      const { error: resetError } = await supabase
        .from('profiles')
        .update({ score: 0 })
        .gt('score', 0)
        
      if (resetError) {
        console.error('[Cron] Failed to reset weekly scores:', resetError)
      } else {
        // Optional: Send a generic push notification to everyone announcing the new league!
        const { data: subs } = await supabase.from('push_subscriptions').select('*')
        const payload = JSON.stringify({ 
          title: '🏆 New Weekly League!', 
          body: 'The leaderboard has been reset! Start checking off your habits today to secure your spot at the top!', 
          icon: '/icons/icon-192x192.png', 
          badge: '/icons/icon-192x192.png', 
          url: '/community' 
        })
        for (const sub of subs || []) {
          try { await webpush.sendNotification({ endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } }, payload) } catch (err) {}
        }
      }
    }

    return NextResponse.json({ success: true, processed: profiles?.length || 0, weeklyReset: isSunday })
  } catch (error) {
    console.error('[Cron] Error processing daily streaks:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
