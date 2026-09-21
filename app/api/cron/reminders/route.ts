import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import webpush from 'web-push'

export const dynamic = 'force-dynamic'

// Configure Web Push with VAPID keys
if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    'mailto:support@habitblooms.in',
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  )
}

export async function GET(request: Request) {
  try {
    // 1. Verify Vercel Cron Secret for security
    const authHeader = request.headers.get('authorization')
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // 2. Initialize Supabase Admin Client (to bypass RLS)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase credentials (SUPABASE_SERVICE_ROLE_KEY is required)')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // 3. Get the exact current time in IST (Asia/Kolkata)
    const now = new Date()
    const options: Intl.DateTimeFormatOptions = { 
      timeZone: 'Asia/Kolkata',
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    }
    // Format will be "HH:MM" e.g., "16:05"
    let currentTimeStr = now.toLocaleTimeString('en-US', options)
    // Some environments return "24:xx" instead of "00:xx" for midnight
    if (currentTimeStr.startsWith('24:')) {
      currentTimeStr = '00:' + currentTimeStr.split(':')[1]
    }

    // 4. Fetch all active habits scheduled for this EXACT minute
    const { data: habits, error: habitsError } = await supabase
      .from('habits')
      .select('id, user_id, name')
      .eq('reminder_time', currentTimeStr)
      .eq('is_archived', false)

    if (habitsError) throw habitsError
    
    if (!habits || habits.length === 0) {
      return NextResponse.json({ 
        message: 'No reminders to send for this minute.', 
        time: currentTimeStr 
      })
    }

    // 5. Fetch Push Subscriptions for the matched users
    const userIds = [...new Set(habits.map(h => h.user_id))]
    const { data: subscriptions, error: subsError } = await supabase
      .from('push_subscriptions')
      .select('*')
      .in('user_id', userIds)

    if (subsError) throw subsError
    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({ message: 'No push subscriptions found for target users.' })
    }

    const notificationsSent = []

    // 6. Send the notifications!
    for (const habit of habits) {
      const userSubs = subscriptions.filter(s => s.user_id === habit.user_id)
      
      const payload = JSON.stringify({
        title: `🌱 Habit Reminder`,
        body: `It's time for: ${habit.name}! Keep your streak blooming.`,
        icon: '/logo.png',
        url: '/dashboard'
      })

      for (const sub of userSubs) {
        const pushSub = {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth
          }
        }
        
        try {
          await webpush.sendNotification(pushSub, payload)
          notificationsSent.push({ habitId: habit.id, success: true })
        } catch (err: any) {
          console.error(`Failed to send push to sub ${sub.id}:`, err)
          // If the subscription is no longer valid (e.g. user revoked permission)
          if (err.statusCode === 410 || err.statusCode === 404) {
             await supabase.from('push_subscriptions').delete().eq('id', sub.id)
          }
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      sent: notificationsSent.length,
      time: currentTimeStr 
    })
    
  } catch (err: any) {
    console.error('Cron Error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
