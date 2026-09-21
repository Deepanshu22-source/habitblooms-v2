# 🌸 HabitBlooms

A modern, beautiful habit tracker with 3D animations. Built with Next.js, Three.js, Supabase, and deployed on Vercel.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **3D**: React Three Fiber + Three.js
- **Animations**: Framer Motion
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (Google OAuth)
- **Styling**: Tailwind CSS
- **PWA**: @ducanh2912/next-pwa
- **Deployment**: Vercel

## Setup Guide

### 1. Clone & Install
```bash
npm install
```

### 2. Supabase Setup
1. Go to [supabase.com](https://supabase.com) and create a new project (or reset your existing one)
2. Go to **SQL Editor** and run the contents of `supabase/schema.sql`
3. Go to **Authentication → Providers → Google** and enable Google OAuth
   - You'll need a Google Cloud OAuth 2.0 client ID ([instructions](https://supabase.com/docs/guides/auth/social-login/auth-google))
4. Add your Supabase URL to the auth redirect: `https://habitblooms.in/auth/callback`

### 3. Environment Variables
```bash
cp .env.example .env.local
```
Fill in your Supabase URL and anon key from **Project Settings → API**.

### 4. Run Locally
```bash
npm run dev
```

### 5. Deploy to Vercel
1. Push this code to your GitHub repo
2. Vercel will auto-deploy on every push
3. Add environment variables in **Vercel → Project → Settings → Environment Variables**
4. Your domain `habitblooms.in` should already be connected — Vercel will pick it up

### 6. PWA Icons
Add icon files to `public/icons/`:
- `icon-192x192.png`
- `icon-512x512.png`

You can generate these from your logo at [realfavicongenerator.net](https://realfavicongenerator.net).

## Project Structure

```
habitblooms/
├── app/
│   ├── (auth)/login/      # Login page
│   ├── (dashboard)/       # Protected dashboard pages
│   ├── auth/callback/     # OAuth callback
│   ├── layout.tsx         # Root layout + PWA meta
│   └── page.tsx           # Landing page
├── components/
│   ├── 3d/HeroScene.tsx   # Three.js 3D scene
│   ├── landing/           # Landing page sections
│   └── dashboard/         # Dashboard components
├── lib/supabase/          # Supabase clients + types
├── hooks/                 # React hooks
├── supabase/schema.sql    # Database schema
└── public/manifest.json   # PWA manifest
```
