import Link from 'next/link'
import { LogoSVG } from '@/components/ui/LogoSVG'

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-14 px-6 bg-[#030712]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-white/5">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 mb-3">
              <LogoSVG className="w-7 h-7 drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]" />
              <span className="text-white font-bold text-lg">
                Habit<span className="text-emerald-400">Blooms</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
              The gamified habit tracker built for students, competitive exam aspirants, and daily consistency.
            </p>
          </div>

          {/* Exam & Goal Trackers */}
          <div>
            <h4 className="text-white font-semibold mb-3 tracking-wide uppercase text-xs text-gray-400">
              Study Trackers
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/for/upsc" className="hover:text-emerald-400 transition-colors">
                  UPSC Habit Tracker
                </Link>
              </li>
              <li>
                <Link href="/for/ca" className="hover:text-emerald-400 transition-colors">
                  CA Revision Tracker
                </Link>
              </li>
              <li>
                <Link href="/for/jee-neet" className="hover:text-emerald-400 transition-colors">
                  JEE & NEET Routine Tracker
                </Link>
              </li>
              <li>
                <Link href="/for/students" className="hover:text-emerald-400 transition-colors">
                  Student Study Tracker
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-3 tracking-wide uppercase text-xs text-gray-400">
              Product
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Sign In / Create Account
                </Link>
              </li>
              <li>
                <Link href="/#features" className="hover:text-white transition-colors">
                  Features & Economy
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} HabitBlooms. All rights reserved.</p>
          <p>Built with ❤️ for focused minds & daily consistency.</p>
        </div>
      </div>
    </footer>
  )
}
