const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
async function test() {
  const { data, error } = await supabase.rpc('reward_referrer', { referrer_uuid: 'f568a8ff-55ec-44f2-95cd-8a3b092289c0' });
  console.log("Response:", { data, error });
}
test();
