import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardNav from '@/components/dashboard/DashboardNav'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-[#030712] selection:bg-violet-500/30">
      <DashboardNav user={user} />
      <main className="max-w-5xl mx-auto px-4 pb-32 md:pb-8 pt-24 md:pt-28">{children}</main>
    </div>
  )
}
