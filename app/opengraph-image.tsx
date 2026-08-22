import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt =
  'Authomotive — The managed authority and measurement framework for dealership websites'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/**
 * Branded Open Graph card — charcoal stage, paper type, discovery blue,
 * evidence lavender. “Prove what works.” sits on its own intentional line.
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
          padding: '64px 72px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              display: 'flex',
              width: 36,
              height: 36,
              borderRadius: 8,
              backgroundColor: '#191C21',
              border: '2px solid #48515E',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: 999,
                border: '3px solid #8FBCF5',
              }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 34,
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

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
            maxWidth: 980,
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: 18,
              fontWeight: 600,
              color: '#8FBCF5',
              letterSpacing: '0.16em',
            }}
          >
            THE DEALERSHIP AUTHORITY STANDARD
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: 54,
                fontWeight: 700,
                color: '#FFFCF7',
                letterSpacing: '-0.02em',
                lineHeight: 1.12,
              }}
            >
              Get found. Guide buyers.
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: 54,
                fontWeight: 700,
                color: '#C8B8FF',
                letterSpacing: '-0.02em',
                lineHeight: 1.12,
              }}
            >
              Prove what works.
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              fontSize: 26,
              color: 'rgba(255, 252, 247, 0.74)',
              lineHeight: 1.35,
              maxWidth: 860,
              marginTop: 4,
            }}
          >
            The managed authority and measurement framework for dealership websites.
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <div style={{ display: 'flex', height: 6, width: '74%', backgroundColor: '#8FBCF5' }} />
          <div style={{ display: 'flex', height: 6, width: '10%', backgroundColor: '#C8B8FF' }} />
        </div>
      </div>
    ),
    { ...size },
  )
}
