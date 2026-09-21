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
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}
