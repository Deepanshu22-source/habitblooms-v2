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
  const url = new URL(request.url)
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  
  // Allow authorization via Bearer token OR ?secret= in the URL (for cron-job.org)
  const isAuthorized = 
    authHeader === `Bearer ${cronSecret}` || 
    url.searchParams.get('secret') === cronSecret

  // Always allow test mode in local dev
  const isDevTesting = process.env.NODE_ENV === 'development' && url.searchParams.get('test') === 'true'

  if (!isAuthorized && !isDevTesting) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  try {
    // 1. Calculate current hour in IST (UTC+5:30) since we assume India timezone for now
    const now = new Date()
    const utcTime = now.getTime()
    const istTime = new Date(utcTime + (5.5 * 60 * 60 * 1000))
    const currentHourStr = String(istTime.getUTCHours()).padStart(2, '0')

    console.log(`[Reminders] Checking for habits at hour: ${currentHourStr}:xx (IST)`)

    // 2. Find all active habits scheduled for this hour
    const { data: habits, error: habitsError } = await supabase
      .from('habits')
      .select('user_id, name')
      .eq('is_archived', false)
      .like('reminder_time', `${currentHourStr}:%`)

    if (habitsError) throw habitsError
    
    if (!habits || habits.length === 0) {
      return NextResponse.json({ success: true, message: 'No reminders for this hour' })
    }

    // 3. Group by user to avoid spamming multiple notifications for the same hour
    const habitsByUser = habits.reduce((acc, habit) => {
      if (!acc[habit.user_id]) acc[habit.user_id] = []
      acc[habit.user_id].push(habit.name)
      return acc
    }, {} as Record<string, string[]>)

    // 4. Fetch subscriptions and send notifications
    let sentCount = 0
    let failedCount = 0

    for (const [userId, habitNames] of Object.entries(habitsByUser)) {
      const { data: subs } = await supabase
        .from('push_subscriptions')
        .select('*')
        .eq('user_id', userId)

      if (!subs || subs.length === 0) continue

      const payload = JSON.stringify({
        title: 'Time to Bloom! 🌱',
        body: `You have ${habitNames.length} habit(s) scheduled now: ${habitNames.join(', ')}`,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-192x192.png',
        url: '/dashboard'
      })

      for (const sub of subs) {
        try {
          await webpush.sendNotification({
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth
            }
          }, payload)
          sentCount++
        } catch (err: any) {
          console.error(`[Reminders] Failed to send to sub ${sub.id}:`, err)
          failedCount++
          // If the subscription is expired/invalid (410), delete it
          if (err.statusCode === 410) {
             await supabase.from('push_subscriptions').delete().eq('id', sub.id)
          }
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      sent: sentCount, 
      failed: failedCount,
      usersProcessed: Object.keys(habitsByUser).length
    })

  } catch (error) {
    console.error('[Reminders] Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
