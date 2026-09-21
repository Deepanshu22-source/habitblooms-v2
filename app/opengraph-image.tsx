import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'HabitBlooms - Gamified Habit Tracker'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div style={{
        background: 'linear-gradient(to bottom right, #0a0f1c, #1e1b4b, #3b0764)',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontFamily: 'sans-serif',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 40,
        }}>
          <span style={{ fontSize: 100 }}>🌱</span>
        </div>
        <h1 style={{ fontSize: 100, fontWeight: 900, marginBottom: 20, letterSpacing: '-0.05em' }}>
          Habit<span style={{ color: '#34d399' }}>Blooms</span>
        </h1>
        <p style={{ fontSize: 40, color: '#c4b5fd', textAlign: 'center', padding: '0 120px', lineHeight: 1.4 }}>
          Build lasting habits, track daily routines, and watch your virtual garden bloom.
        </p>
      </div>
    ),
    { ...size }
  )
}
