import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt =
  'Authomotive — The managed authority and measurement framework for dealership websites'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/**
 * Branded Open Graph image rendered with the Authomotive visual system:
 * Ink environment, Paper type, pale-blue signal line, sherbet action accent.
 */
export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#0A0D0C',
          padding: '72px 80px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Wordmark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              display: 'flex',
              fontSize: 40,
              fontWeight: 700,
              color: '#FFFCF7',
              letterSpacing: '-0.02em',
            }}
          >
            Auth
            <span style={{ color: '#BDD9FF' }}>o</span>
            motive
          </div>
        </div>

        {/* Headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <div
            style={{
              display: 'flex',
              fontSize: 20,
              fontWeight: 600,
              color: '#BDD9FF',
              letterSpacing: '0.18em',
            }}
          >
            THE DEALERSHIP AUTHORITY STANDARD
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 64,
              fontWeight: 700,
              color: '#FFFCF7',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              maxWidth: 980,
            }}
          >
            Get found. Guide buyers. Prove what works.
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 28,
              color: 'rgba(255, 252, 247, 0.72)',
              lineHeight: 1.4,
              maxWidth: 900,
            }}
          >
            The managed authority and measurement framework for dealership websites.
          </div>
        </div>

        {/* Signal line with Orange terminus */}
        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <div style={{ display: 'flex', height: 6, width: '76%', backgroundColor: '#BDD9FF' }} />
          <div style={{ display: 'flex', height: 6, width: '8%', backgroundColor: '#FFC982' }} />
        </div>
      </div>
    ),
    size,
  )
}
