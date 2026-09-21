import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard', '/community', '/profile', '/analytics', '/api/', '/auth/'],
    },
    sitemap: 'https://habitblooms.in/sitemap.xml',
  }
}
