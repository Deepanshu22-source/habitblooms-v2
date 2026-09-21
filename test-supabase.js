require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

async function test() {
  const { data: { users }, error: authErr } = await supabase.auth.admin?.listUsers() || {}
  console.log('Admin list users error:', authErr?.message) // will probably fail without service_role
  
  // Let's just try to read profiles
  const { data: profiles, error: readErr } = await supabase.from('profiles').select('*').limit(5)
  console.log('Profiles:', profiles, 'Error:', readErr)
}

test()
