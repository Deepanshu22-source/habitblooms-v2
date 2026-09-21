import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://habitblooms.in'),
  title: {
    default: 'HabitBlooms | Gamified Habit Tracker & Productivity Community',
    template: '%s | HabitBlooms'
  },
  description:
    'The ultimate gamified habit tracker and productivity app. Build lasting habits, track daily routines, join goal-oriented squads, and boost your productivity. Free to use.',
  applicationName: 'HabitBlooms',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'HabitBlooms',
  },
  keywords: [
    'habit tracker',
    'productivity app',
    'daily routine tracker',
    'build habits',
    'goal tracking',
    'gamified habit tracker',
    'study tracker',
    'UPSC tracker',
    'JEE tracker',
    'student productivity',
    'habit streaks',
    'community habit tracker'
  ],
  authors: [{ name: 'HabitBlooms' }],
  creator: 'HabitBlooms',
  publisher: 'HabitBlooms',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: 'https://habitblooms.in',
  },
  openGraph: {
    type: 'website',
    url: 'https://habitblooms.in',
    title: 'HabitBlooms | Gamified Habit Tracker & Productivity Community',
    description: 'Build lasting habits, track daily routines, and boost your productivity with our gamified community.',
    siteName: 'HabitBlooms',
    images: [
      {
        url: 'https://habitblooms.in/icons/icon-512x512.png',
        width: 512,
        height: 512,
        alt: 'HabitBlooms Logo',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'HabitBlooms | Gamified Habit Tracker',
    description: 'Transform your daily routines into beautiful, lasting habits.',
    images: ['https://habitblooms.in/icons/icon-512x512.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export const viewport: Viewport = {
  themeColor: '#8b5cf6',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "HabitBlooms",
        "applicationCategory": "ProductivityApplication",
        "operatingSystem": "Any",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "description": "A gamified habit tracker that uses psychology and an in-app economy (Streak Freezes) to help users build lasting routines without burnout.",
        "featureList": [
          "Virtual Garden visualization",
          "Streak Freezes economy",
          "Weekly Squad Leaderboards",
          "Progressive Web App"
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is HabitBlooms and how does it work?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "HabitBlooms is a gamified habit tracker and productivity app designed to make building routines fun. As you complete your daily tasks, you earn 'Seeds' and grow a Virtual Garden. It uses psychology and gamification to keep you motivated, making it perfect for students, professionals, and anyone with ADHD."
            }
          },
          {
            "@type": "Question",
            "name": "How do Streak Freezes work in HabitBlooms?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Unlike traditional habit trackers that punish you for missing a single day, HabitBlooms features an in-app economy. You can use the Seeds you earn from completing habits to buy 'Streak Freezes' in the Store. If you miss a day, the freeze automatically protects your streak, preventing burnout and keeping you motivated."
            }
          }
        ]
      }
    ]
  }

  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}
