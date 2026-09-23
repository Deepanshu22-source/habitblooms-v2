import { createClient } from '@/lib/supabase/server'
import HabitsClient from '@/components/dashboard/HabitsClient'

export default async function HabitsPage() {
  const supabase = await createClient()
  const { data: habits } = await supabase
    .from('habits')
    .select('*')
    .order('created_at', { ascending: true })

  return <HabitsClient initialHabits={habits ?? []} />
}
