import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://habitblooms.in'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard',
          '/habits',
          '/community',
          '/analytics',
          '/profile',
          '/api/',
          '/auth/callback',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
