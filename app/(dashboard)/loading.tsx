import { Loader2 } from 'lucide-react'

export default function DashboardLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full animate-in fade-in duration-500">
      <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mb-4" />
      <p className="text-gray-400 font-medium">Loading your garden...</p>
    </div>
  )
}
