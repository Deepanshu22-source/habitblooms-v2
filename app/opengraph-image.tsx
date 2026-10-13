import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'HabitBlooms — Gamified Habit Tracker & Productivity Community'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #030712 0%, #0b1528 50%, #030712 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
          padding: '60px',
        }}
      >
        {/* Glow Effects */}
        <div
          style={{
            position: 'absolute',
            top: '-80px',
            left: '200px',
            width: '450px',
            height: '450px',
            borderRadius: '50%',
            background: 'rgba(16, 185, 129, 0.15)',
            filter: 'blur(90px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-80px',
            right: '200px',
            width: '450px',
            height: '450px',
            borderRadius: '50%',
            background: 'rgba(139, 92, 246, 0.18)',
            filter: 'blur(90px)',
          }}
        />

        {/* Brand Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 24px',
            borderRadius: '999px',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            color: '#34d399',
            fontSize: 22,
            fontWeight: 600,
            marginBottom: '28px',
          }}
        >
          <span>🌱</span>
          <span>Gamified Habit Tracker & Routine Builder</span>
        </div>

        {/* Heading */}
        <div
          style={{
            fontSize: 76,
            fontWeight: 900,
            color: '#ffffff',
            lineHeight: 1.1,
            textAlign: 'center',
            marginBottom: '20px',
            letterSpacing: '-2px',
            display: 'flex',
          }}
        >
          <span>Build Habits That </span>
          <span
            style={{
              marginLeft: '16px',
              background: 'linear-gradient(90deg, #34d399, #10b981, #f59e0b)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Bloom
          </span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 28,
            color: '#9ca3af',
            textAlign: 'center',
            maxWidth: '850px',
            lineHeight: 1.4,
            marginBottom: '44px',
          }}
        >
          Level up your daily consistency. Grow your virtual garden, protect streaks with Streak Freezes, and compete in study squads.
        </div>

        {/* Feature Pills */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
          }}
        >
          {['🌿 Virtual Garden', '🧊 Streak Freezes', '🏆 Squad Leaderboards', '100% Free'].map((pill) => (
            <div
              key={pill}
              style={{
                padding: '12px 22px',
                borderRadius: '16px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#e5e7eb',
                fontSize: 20,
                fontWeight: 600,
              }}
            >
              {pill}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
