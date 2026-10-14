import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
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
    'gamified habit tracker',
    'productivity app',
    'daily routine tracker',
    'study tracker for students',
    'UPSC habit tracker',
    'CA exam study tracker',
    'JEE NEET routine tracker',
    'habit tracker with streak freeze',
    'ADHD friendly routine tracker',
    'anti burnout habit tracker',
    'free habit tracker online',
    'build habits',
    'habit streaks',
    'virtual garden habit tracker',
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
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://habitblooms.in',
    title: 'HabitBlooms | Gamified Habit Tracker & Productivity Community',
    description: 'Build lasting habits, track daily routines, and boost your productivity with our gamified community.',
    siteName: 'HabitBlooms',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'HabitBlooms — Gamified Habit Tracker & Productivity Community',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HabitBlooms | Gamified Habit Tracker',
    description: 'Transform your daily routines into beautiful, lasting habits.',
    images: ['/opengraph-image'],
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
          },
          {
            "@type": "Question",
            "name": "Does HabitBlooms have a community leaderboard?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes! HabitBlooms features a Weekly Squad Leaderboard. You can compete with friends and other users globally. Earning seeds from your daily habits pushes you up the leaderboard, adding a fun, social, and competitive element to your personal growth."
            }
          },
          {
            "@type": "Question",
            "name": "Is HabitBlooms a Progressive Web App (PWA)?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, HabitBlooms is a fully installable Progressive Web App. You can install it directly to your iOS or Android home screen from your browser, and it will function perfectly just like a native mobile app."
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
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
