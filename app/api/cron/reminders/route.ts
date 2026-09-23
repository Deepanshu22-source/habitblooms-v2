import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import webpush from 'web-push'

// Configure web-push with VAPID keys
webpush.setVapidDetails(
  'mailto:admin@habitblooms.in',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '',
  process.env.VAPID_PRIVATE_KEY || ''
)

const BROADCAST_MESSAGES: Record<string, { title: string, body: string }> = {
  '08': { title: "Good morning! 🌸", body: "Ready to bloom today? Time to tackle your habits!" },
  '13': { title: "Mid-day Check-in 🌱", body: "Halfway through the day! Keep up the momentum!" },
  '20': { title: "Evening Reminder 🌙", body: "Don't forget to check off your habits for today!" },
  '22': { title: "Almost Midnight! ⏳", body: "Only a few hours left! Finish your habits to save your streak!" }
}

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  
  const isAuthorized = 
    authHeader === `Bearer ${cronSecret}` || 
    url.searchParams.get('secret') === cronSecret

  const isDevTesting = process.env.NODE_ENV === 'development' && url.searchParams.get('test') === 'true'

  if (!isAuthorized && !isDevTesting) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  try {
    const now = new Date()
    const utcTime = now.getTime()
    const istTime = new Date(utcTime + (5.5 * 60 * 60 * 1000))
    const currentHourStr = String(istTime.getUTCHours()).padStart(2, '0')

    console.log(`[Reminders] Checking for habits and broadcasts at hour: ${currentHourStr}:xx (IST)`)

    let sentCount = 0
    let failedCount = 0

    // --- PART 1: BROADCAST GENERIC DAILY MESSAGES ---
    const broadcastMsg = BROADCAST_MESSAGES[currentHourStr]
    if (broadcastMsg) {
      console.log(`[Reminders] Sending broadcast message for hour ${currentHourStr}`)
      const { data: allSubs } = await supabase.from('push_subscriptions').select('*')
      
      const payload = JSON.stringify({
        ...broadcastMsg,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-192x192.png',
        url: '/dashboard'
      })

      for (const sub of allSubs || []) {
        try {
          await webpush.sendNotification({ endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } }, payload)
          sentCount++
        } catch (err: any) {
          failedCount++
          if (err.statusCode === 410) {
            await supabase.from('push_subscriptions').delete().eq('id', sub.id)
          }
        }
      }
    }

    // --- PART 2: SPECIFIC USER HABIT REMINDERS ---
    const { data: habits } = await supabase
      .from('habits')
      .select('user_id, name')
      .eq('is_archived', false)
      .like('reminder_time', `${currentHourStr}:%`)

    if (habits && habits.length > 0) {
      const habitsByUser = habits.reduce((acc, habit) => {
        if (!acc[habit.user_id]) acc[habit.user_id] = []
        acc[habit.user_id].push(habit.name)
        return acc
      }, {} as Record<string, string[]>)

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
            await webpush.sendNotification({ endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } }, payload)
            sentCount++
          } catch (err: any) {
            failedCount++
            if (err.statusCode === 410) {
              await supabase.from('push_subscriptions').delete().eq('id', sub.id)
            }
          }
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      sent: sentCount, 
      failed: failedCount
    })

  } catch (error) {
    console.error('[Reminders] Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
