import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import { ArrowRight, CheckCircle2, Flame, Shield, Sparkles, Trophy, Users, BookOpen } from 'lucide-react'

interface NicheData {
  slug: string
  title: string
  metaTitle: string
  metaDescription: string
  headline: string
  highlight: string
  subheadline: string
  targetKeywords: string[]
  painPointTitle: string
  painPoints: { problem: string; solution: string }[]
  sampleHabits: { icon: string; name: string; time: string; tag: string }[]
  faqs: { question: string; answer: string }[]
}

const NICHES: Record<string, NicheData> = {
  upsc: {
    slug: 'upsc',
    title: 'UPSC CSE',
    metaTitle: 'UPSC Habit & Study Routine Tracker | HabitBlooms',
    metaDescription: 'The free gamified habit tracker for UPSC Civil Services aspirants. Track GS answer writing, daily newspaper reading, and revision routines with streak freeze protection.',
    headline: 'Build Daily Consistency for',
    highlight: 'UPSC CSE',
    subheadline: 'The CSE exam is not won in a single 14-hour marathon — it is won through 365 days of unbroken micro-routines. HabitBlooms keeps your daily discipline alive without burnout.',
    targetKeywords: ['UPSC habit tracker', 'UPSC study routine app', 'daily answer writing tracker', 'UPSC revision tracker'],
    painPointTitle: 'Why traditional habit apps fail UPSC aspirants',
    painPoints: [
      {
        problem: 'Strict streaks cause burnout after a single missed day',
        solution: 'HabitBlooms features built-in Streak Freezes so a hectic mock test day does not destroy months of momentum.'
      },
      {
        problem: 'General trackers don’t understand target days',
        solution: 'Schedule answer writing for 5 days a week without your streak breaking on your scheduled rest days.'
      },
      {
        problem: 'Studying in isolation leads to procrastination',
        solution: 'Join the dedicated UPSC Squad leaderboard and stay accountable alongside fellow serious aspirants.'
      }
    ],
    sampleHabits: [
      { icon: '📰', name: 'Editorial Reading (The Hindu / IE)', time: '45 mins', tag: 'Current Affairs' },
      { icon: '✍️', name: 'GS Mains Answer Writing (2 Qs)', time: '30 mins', tag: 'Mains Practice' },
      { icon: '🎯', name: 'Prelims PYQ Practice (25 MCQs)', time: '40 mins', tag: 'Prelims' },
      { icon: '📖', name: 'Static Syllabus Revision Block', time: '2 hours', tag: 'GS Core' },
    ],
    faqs: [
      {
        question: 'Can I track habits that are only scheduled 5 days a week?',
        answer: 'Yes! HabitBlooms allows custom target days. If you set Answer Writing for Mon–Fri, your streak stays 100% intact on weekends.'
      },
      {
        question: 'What happens if I miss a study day due to a mock test?',
        answer: 'You can use earned Seeds to deploy a Streak Freeze lifeline, protecting your hard-earned streak from resetting to 0.'
      },
      {
        question: 'Is HabitBlooms completely free for aspirants?',
        answer: 'Yes, HabitBlooms is free forever with no credit card required. Install it directly as a PWA on iOS or Android.'
      }
    ]
  },
  ca: {
    slug: 'ca',
    title: 'Chartered Accountancy (CA)',
    metaTitle: 'CA Exam Study Routine & Revision Tracker | HabitBlooms',
    metaDescription: 'Conquer CA Foundation, Intermediate & Final exams. Track daily revision hours, practical problem solving, and law theory with gamified streak freezes.',
    headline: 'Conquer Consistency for',
    highlight: 'CA Foundation, Inter & Final',
    subheadline: 'Balancing articleship and 8 hours of complex syllabus requires ruthless daily scheduling. HabitBlooms turns daily study blocks into a rewarding virtual garden.',
    targetKeywords: ['CA exam study tracker', 'CA intermediate revision tracker', 'study habits for chartered accountants'],
    painPointTitle: 'Built for the rigor of CA preparation',
    painPoints: [
      {
        problem: 'Huge theory subjects (Law, Audit) slip through the cracks',
        solution: 'Set daily 45-minute micro-revision habits that turn massive books into manageable daily check-ins.'
      },
      {
        problem: 'Articleship exhaustion kills long study sessions',
        solution: 'Track manageable morning and evening habit blocks so you make daily progress no matter how tired you feel.'
      },
      {
        problem: 'No motivation during endless self-study months',
        solution: 'Watch your Virtual Garden grow with every completed study session and earn Seeds to protect your streak.'
      }
    ],
    sampleHabits: [
      { icon: '📊', name: 'Practical Problem Solving (Accounts/Cost)', time: '90 mins', tag: 'Practical' },
      { icon: '⚖️', name: 'Law / Audit Section Memorization', time: '45 mins', tag: 'Theory' },
      { icon: '🧮', name: 'RTP / MTP Question Analysis', time: '60 mins', tag: 'Exam Prep' },
      { icon: '🔄', name: 'End-of-Day 30m Micro-Revision', time: '30 mins', tag: 'Retention' },
    ],
    faqs: [
      {
        question: 'How does HabitBlooms help with CA revision schedules?',
        answer: 'You can schedule different subjects on alternate days (e.g. Accounts on Mon/Wed/Fri and Tax on Tue/Thu/Sat). HabitBlooms automatically manages streaks per habit without false resets.'
      },
      {
        question: 'Can I install this on my phone during articleship commute?',
        answer: 'Yes, install it as an offline-ready PWA on your phone to check off tasks in seconds without any lag.'
      }
    ]
  },
  'jee-neet': {
    slug: 'jee-neet',
    title: 'JEE & NEET',
    metaTitle: 'Daily Habit & Problem Practice Tracker for JEE & NEET | HabitBlooms',
    metaDescription: 'Boost your percentile with unbroken daily problem solving. Track NCERT biology, physics numericals, and mock test analysis on HabitBlooms.',
    headline: 'Level Up Your Rank in',
    highlight: 'JEE & NEET',
    subheadline: 'Cracking JEE & NEET is about speed and muscle memory. Build unstoppable daily problem-solving routines and compete on your squad leaderboard.',
    targetKeywords: ['JEE study tracker', 'NEET habit tracker', 'daily problem practice routine', 'NCERT revision tracker'],
    painPointTitle: 'Designed for serious competitive exam prep',
    painPoints: [
      {
        problem: 'Inconsistent question solving between coaching classes',
        solution: 'Set daily minimum quotas (e.g., 25 physics numericals) and check them off to earn points and level up.'
      },
      {
        problem: 'Skipping error notebook analysis after tests',
        solution: 'Turn mock test post-mortem into a non-negotiable daily habit so mistakes never repeat on exam day.'
      },
      {
        problem: 'Burnout from high pressure and anxiety',
        solution: 'Streak Freezes prevent demotivation when you need a mental health break or fall sick before a test.'
      }
    ],
    sampleHabits: [
      { icon: '🧬', name: 'NCERT Biology / Chemistry Line-by-Line', time: '60 mins', tag: 'Theory' },
      { icon: '⚡', name: 'Physics Numerical Practice (25 Qs)', time: '75 mins', tag: 'Problem Solving' },
      { icon: '🧪', name: 'Inorganic Chemistry Reactions Flashcards', time: '30 mins', tag: 'Memorization' },
      { icon: '📝', name: 'Mock Test Error Analysis Log', time: '45 mins', tag: 'Analysis' },
    ],
    faqs: [
      {
        question: 'Can this replace a bulky study planner notebook?',
        answer: 'Yes, HabitBlooms opens in 0.0 seconds and lets you log your completed study sessions in one tap.'
      },
      {
        question: 'Does it work offline when I study without internet?',
        answer: 'Yes, as a Progressive Web App (PWA), it loads instantly even with Airplane Mode or weak Wi-Fi.'
      }
    ]
  },
  students: {
    slug: 'students',
    title: 'College & School Students',
    metaTitle: 'Gamified Habit & Study Tracker for Students | HabitBlooms',
    metaDescription: 'The free gamified habit tracker for students. Beat procrastination, build healthy morning and study routines, and grow a virtual garden with your consistency.',
    headline: 'Build Habits That Stick for',
    highlight: 'Students & College Achievers',
    subheadline: 'Stop starting over every Monday. Turn fitness, deep focus, and daily study habits into a rewarding game with streak lifelines and weekly friend leaderboards.',
    targetKeywords: ['habit tracker for students', 'college study routine app', 'gamified study tracker', 'ADHD student habit app'],
    painPointTitle: 'Why students choose HabitBlooms over standard trackers',
    painPoints: [
      {
        problem: 'Apps feel like boring chore checklists',
        solution: 'Earn Seeds with every habit, grow your Virtual Garden, and unlock exotic flowers as you achieve your goals.'
      },
      {
        problem: 'ADHD and procrastination break momentum',
        solution: 'Gentle hourly reminders, one-tap logging, and streak recovery keep dopamine high and friction zero.'
      },
      {
        problem: 'No social motivation or accountability',
        solution: 'Join squad leaderboards with your classmates and challenge each other to hit 100% Perfect Days.'
      }
    ],
    sampleHabits: [
      { icon: '📚', name: '2-Hour Deep Study Block (No Phone)', time: '120 mins', tag: 'Focus' },
      { icon: '🏃', name: 'Workout / 10k Steps Daily', time: '45 mins', tag: 'Health' },
      { icon: '💧', name: 'Drink 2.5L Water Throughout Day', time: 'Daily', tag: 'Wellness' },
      { icon: '😴', name: 'Screen-Free Wind-down Before 11 PM', time: '30 mins', tag: 'Sleep' },
    ],
    faqs: [
      {
        question: 'Is HabitBlooms free for students?',
        answer: '100% free with no paywalls or credit cards required.'
      },
      {
        question: 'Can I use it on both my laptop and phone?',
        answer: 'Yes, HabitBlooms syncs seamlessly across your Mac, Windows PC, iPhone, and Android device.'
      }
    ]
  }
}

export function generateStaticParams() {
  return Object.keys(NICHES).map((slug) => ({ slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const niche = NICHES[params.slug]
  if (!niche) return {}

  const url = `https://habitblooms.in/for/${niche.slug}`

  return {
    title: niche.metaTitle,
    description: niche.metaDescription,
    keywords: niche.targetKeywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: niche.metaTitle,
      description: niche.metaDescription,
      url: url,
      type: 'website',
      siteName: 'HabitBlooms',
      images: ['/opengraph-image'],
    },
    twitter: {
      card: 'summary_large_image',
      title: niche.metaTitle,
      description: niche.metaDescription,
      images: ['/opengraph-image'],
    },
  }
}

export default function NicheLandingPage({ params }: { params: { slug: string } }) {
  const niche = NICHES[params.slug]
  if (!niche) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: niche.metaTitle,
        description: niche.metaDescription,
        url: `https://habitblooms.in/for/${niche.slug}`,
      },
      {
        '@type': 'FAQPage',
        mainEntity: niche.faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.answer,
          },
        })),
      },
    ],
  }

  return (
    <main className="min-h-screen bg-[#030712] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-violet-600/10 blur-[140px] pointer-events-none rounded-full" />
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-emerald-500/10 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium mb-6">
            <Sparkles size={14} />
            Dedicated Routine Builder for {niche.title}
          </span>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-[1.05] mb-6">
            {niche.headline}{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-300 bg-clip-text text-transparent">
              {niche.highlight}
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10">
            {niche.subheadline}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-pink-600 rounded-2xl text-white font-bold text-lg hover:scale-105 transition-all shadow-2xl shadow-violet-500/30"
            >
              Start Free {niche.title} Streak
              <ArrowRight size={20} />
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-2xl border border-white/10 text-gray-300 font-semibold text-lg hover:bg-white/5 transition-colors"
            >
              Explore All Features
            </Link>
          </div>

          <div className="flex items-center justify-center gap-6 mt-10 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-emerald-400" /> Free Forever
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-emerald-400" /> No Credit Card
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-emerald-400" /> Anti-Burnout Lifelines
            </span>
          </div>
        </div>
      </section>

      {/* Recommended Habits Blueprint */}
      <section className="py-16 px-6 bg-[#080d1a]/50 border-y border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Recommended Blueprint</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2">
              Ready-to-Use Habits for {niche.title}
            </h2>
            <p className="text-gray-400 text-sm mt-2">
              Add these exact routines into your dashboard in one tap after signing in.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {niche.sampleHabits.map((habit, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-violet-500/30 transition-all flex items-start gap-4"
              >
                <div className="text-3xl w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                  {habit.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-violet-500/10 text-violet-300 border border-violet-500/20">
                      {habit.tag}
                    </span>
                    <span className="text-xs text-gray-500">{habit.time}</span>
                  </div>
                  <h3 className="text-white font-bold text-base">{habit.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pain Points / Comparison */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              {niche.painPointTitle}
            </h2>
          </div>

          <div className="space-y-4">
            {niche.painPoints.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#0e1320] border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex-1">
                  <span className="text-xs text-red-400 font-bold uppercase tracking-wider block mb-1">
                    ❌ Traditional Apps
                  </span>
                  <p className="text-gray-300 text-sm">{item.problem}</p>
                </div>
                <div className="h-px md:h-12 md:w-px bg-white/10" />
                <div className="flex-1">
                  <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider block mb-1">
                    ✅ HabitBlooms Solution
                  </span>
                  <p className="text-white text-sm font-medium">{item.solution}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 bg-[#080d1a]/60 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">Frequently Asked Questions</h2>
            <p className="text-gray-400 text-sm mt-2">Common questions from {niche.title} aspirants.</p>
          </div>

          <div className="space-y-4">
            {niche.faqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white/[0.02] border border-white/5"
              >
                <h3 className="text-base font-bold text-white mb-2">{faq.question}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-3xl mx-auto p-10 rounded-3xl bg-gradient-to-br from-violet-600/20 via-pink-600/10 to-transparent border border-violet-500/20">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Build Your {niche.title} Streak?
          </h2>
          <p className="text-gray-400 text-base max-w-xl mx-auto mb-8">
            Join hundreds of serious aspirants today. It takes 10 seconds to sign in and set up your daily habits.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-pink-600 rounded-2xl text-white font-bold text-lg hover:scale-105 transition-all shadow-xl shadow-violet-500/25"
          >
            Get Started Free
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
