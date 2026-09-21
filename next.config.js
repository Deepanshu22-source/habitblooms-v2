/** @type {import('next').NextConfig} */
const withPWA = require('@ducanh2912/next-pwa').default

const pwaConfig = withPWA({
  dest: 'public',
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === 'development',
  workboxOptions: {
    disableDevLogs: true,
    importScripts: ['/custom-sw.js'],
  },
})

const nextConfig = {
  reactStrictMode: true,
}

module.exports = pwaConfig(nextConfig)
