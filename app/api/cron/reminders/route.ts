import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import webpush from 'web-push'

export const dynamic = 'force-dynamic'

if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    'mailto:support@habitblooms.in',
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  )
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const secretParam = url.searchParams.get('secret')
    const authHeader = request.headers.get('authorization')
    
    if (process.env.CRON_SECRET) {
      if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && secretParam !== process.env.CRON_SECRET) {
        return new NextResponse('Unauthorized', { status: 401 })
      }
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase credentials (SUPABASE_SERVICE_ROLE_KEY is required)')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Current time in IST
    const now = new Date()
    const options: Intl.DateTimeFormatOptions = { 
      timeZone: 'Asia/Kolkata',
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    }
    let currentTimeStr = now.toLocaleTimeString('en-US', options)
    if (currentTimeStr.startsWith('24:')) {
      currentTimeStr = '00:' + currentTimeStr.split(':')[1]
    }

    const notificationsToSend: { user_id: string, title: string, body: string }[] = []

    // 1. Specific Habit Reminders (User-set)
    const { data: habits } = await supabase
      .from('habits')
      .select('id, user_id, name')
      .eq('reminder_time', currentTimeStr)
      .eq('is_archived', false)

    if (habits) {
      habits.forEach(habit => {
        notificationsToSend.push({
          user_id: habit.user_id,
          title: `🌱 Habit Reminder`,
          body: `It's time for: ${habit.name}! Keep your streak blooming.`,
        })
      })
    }

    // 2. Generic Daily Reminders (5 times a day: 08:00, 12:00, 15:00, 18:00, 21:00)
    const genericTimes = {
      '08:00': 'Good morning! Water your virtual garden today by completing a habit. ☀️',
      '12:00': 'Halfway through the day! Take a break and check off a habit. 🌿',
      '15:00': 'Afternoon slump? A quick habit can boost your energy! ⚡',
      '18:00': 'Evening is here. Did you complete your daily goals? 🌅',
      '21:00': 'Time to wind down. Check off any remaining habits before bed! 🌙'
    }

    const genericMessage = genericTimes[currentTimeStr as keyof typeof genericTimes]
    
    if (genericMessage) {
      // Get all users who have push subscriptions
      const { data: allSubs } = await supabase.from('push_subscriptions').select('user_id')
      if (allSubs) {
        const uniqueUsers = [...new Set(allSubs.map(s => s.user_id))]
        uniqueUsers.forEach(uid => {
          notificationsToSend.push({
            user_id: uid,
            title: `HabitBlooms`,
            body: genericMessage,
          })
        })
      }
    }

    if (notificationsToSend.length === 0) {
      return NextResponse.json({ message: 'No reminders to send for this minute.', time: currentTimeStr })
    }

    // Fetch Push Subscriptions for matched users
    const userIds = [...new Set(notificationsToSend.map(n => n.user_id))]
    const { data: subscriptions } = await supabase
      .from('push_subscriptions')
      .select('*')
      .in('user_id', userIds)

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({ message: 'No push subscriptions found for target users.' })
    }

    let sentCount = 0

    // Send notifications
    for (const notification of notificationsToSend) {
      const userSubs = subscriptions.filter(s => s.user_id === notification.user_id)
      
      const payload = JSON.stringify({
        title: notification.title,
        body: notification.body,
        icon: '/logo.png',
        url: '/dashboard'
      })

      for (const sub of userSubs) {
        const pushSub = {
          endpoint: sub.endpoint,
          keys: { p256dh: sub.p256dh, auth: sub.auth }
        }
        
        try {
          await webpush.sendNotification(pushSub, payload)
          sentCount++
        } catch (err: any) {
          if (err.statusCode === 410 || err.statusCode === 404) {
             await supabase.from('push_subscriptions').delete().eq('id', sub.id)
          }
        }
      }
    }

    return NextResponse.json({ success: true, sent: sentCount, time: currentTimeStr })
    
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
