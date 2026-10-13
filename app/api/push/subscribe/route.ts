import { NextResponse } from 'next/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { user_id, endpoint, p256dh, auth } = body

    if (!user_id || !endpoint || !p256dh || !auth) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    let supabase: any
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      supabase = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      )
    } else {
      supabase = await createServerClient()
    }

    const { error } = await supabase.from('push_subscriptions').upsert({
      user_id,
      endpoint,
      p256dh,
      auth
    }, { onConflict: 'user_id,endpoint' })

    if (error) {
      console.error('Error saving push subscription to Supabase:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Exception in push subscribe:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
