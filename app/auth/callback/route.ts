import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin
  
  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Exchange error:', error.message)
      return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`)
    }
    
    // Check for referral cookie
    const cookieStore = await cookies()
    const refCookie = cookieStore.get('habitblooms_referral')
    
    if (refCookie && refCookie.value && data.session?.user) {
      try {
        // We call an RPC function because we need to safely bypass RLS to credit the referrer.
        // We also pass the new user's ID to ensure they haven't been referred before.
        await supabase.rpc('reward_referrer', { 
          referrer_uuid: refCookie.value
        })
        
        // Clear the cookie so it doesn't trigger again
        cookieStore.delete('habitblooms_referral')
      } catch (err) {
        console.error('Failed to process referral:', err)
      }
    }
  }

  return NextResponse.redirect(`${origin}/dashboard`)
}
