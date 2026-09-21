import Link from 'next/link'
import { Flower2 } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
            <Flower2 size={14} className="text-white" />
          </div>
          <span className="text-white font-bold">
            Habit<span className="text-violet-400">Blooms</span>
          </span>
        </div>
        <p className="text-gray-600 text-sm">
          © {new Date().getFullYear()} HabitBlooms. All rights reserved.
        </p>
        <Link href="/login" className="text-sm text-gray-500 hover:text-white transition-colors">
          Sign in
        </Link>
      </div>
    </footer>
  )
}
