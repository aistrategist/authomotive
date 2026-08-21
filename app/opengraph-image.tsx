import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt =
  'Authomotive — The managed authority and measurement framework for dealership websites'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/**
 * Branded Open Graph image rendered with the Authomotive visual system:
 * Charcoal stage, paper type, stronger blue discovery, sherbet action accent.
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
          backgroundColor: '#252A31',
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
            <span style={{ color: '#8FBCF5' }}>o</span>
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
              color: '#8FBCF5',
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
            <span style={{ color: '#FFFCF7' }}>Get found. Guide buyers.&nbsp;</span>
            <span style={{ color: '#C8B8FF' }}>Prove what works.</span>
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
          <div style={{ display: 'flex', height: 6, width: '76%', backgroundColor: '#8FBCF5' }} />
          <div style={{ display: 'flex', height: 6, width: '8%', backgroundColor: '#FFC982' }} />
        </div>
      </div>
    ),
    size,
  )
}
