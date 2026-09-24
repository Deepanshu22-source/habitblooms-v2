import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import webpush from 'web-push'

webpush.setVapidDetails(
  'mailto:admin@habitblooms.in',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '',
  process.env.VAPID_PRIVATE_KEY || ''
)

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  try {
    const { data: allSubs } = await supabase.from('push_subscriptions').select('*')
    
    if (!allSubs || allSubs.length === 0) {
      return NextResponse.json({ error: 'No subscriptions found in database. Make sure you clicked Enable Alerts.' })
    }

    let sent = 0
    let failed = 0
    
    const payload = JSON.stringify({
      title: "Test Notification! 🚀",
      body: "If you see this, the entire push pipeline is working perfectly!",
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
      }
    }

    return NextResponse.json({ success: true, message: `Sent ${sent} notifications, ${failed} failed. Total subs in DB: ${allSubs.length}` })
  } catch (err: any) {
    return NextResponse.json({ error: err.message })
  }
}
