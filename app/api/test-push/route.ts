import { NextResponse } from 'next/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@/lib/supabase/server'
import webpush from 'web-push'

webpush.setVapidDetails(
  'mailto:admin@habitblooms.in',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '',
  process.env.VAPID_PRIVATE_KEY || ''
)

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const targetUserId = url.searchParams.get('userId')

    let supabase: any
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      supabase = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      )
    } else {
      supabase = await createServerClient()
    }

    let query = supabase.from('push_subscriptions').select('*')
    if (targetUserId) {
      query = query.eq('user_id', targetUserId)
    }
    const { data: allSubs, error: subsError } = await query

    if (subsError) {
      console.error('Push subscriptions query error:', subsError)
      return NextResponse.json({ error: `Database error: ${subsError.message}` }, { status: 500 })
    }
    
    if (!allSubs || allSubs.length === 0) {
      return NextResponse.json({ 
        error: 'No active push subscriptions found. Please enable notifications on this device first!' 
      }, { status: 404 })
    }

    let sent = 0
    let failed = 0
    
    const payload = JSON.stringify({
      title: "HabitBlooms Test! 🌸🚀",
      body: "Notifications are working perfectly on your device! Your daily streak is protected.",
      icon: "/icons/icon-192x192.png",
      badge: "/icons/icon-192x192.png",
      url: "/dashboard"
    })

    for (const sub of allSubs) {
      try {
        await webpush.sendNotification({ endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } }, payload)
        sent++
      } catch (err: any) {
        failed++
        console.error('Push error:', err)
        if (err.statusCode === 410 || err.statusCode === 404) {
          await supabase.from('push_subscriptions').delete().eq('id', sub.id)
        }
      }
    }

    return NextResponse.json({ success: true, message: `Sent ${sent} notifications, ${failed} failed. Total matching subs: ${allSubs.length}` })
  } catch (err: any) {
    return NextResponse.json({ error: err.message })
  }
}
