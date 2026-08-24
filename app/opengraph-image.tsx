import { ImageResponse } from 'next/og'
import {
  WORDMARK_PALETTES,
  WORDMARK_PRODUCTION_TREATMENT,
  WORDMARK_SETS,
} from '@/components/authomotive-wordmark-outline'

export const runtime = 'edge'
export const alt = 'Authomotive. Get found. Guide buyers. Prove what works.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const wordmark = WORDMARK_SETS[WORDMARK_PRODUCTION_TREATMENT]
const colors = WORDMARK_PALETTES.onInk

/**
 * Open Graph card from the live wordmark and approved brand line.
 * No extra marketing claims, no leftover circle-O mark.
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
          backgroundColor: '#061B20',
          padding: '72px 80px',
        }}
      >
        <svg
          width="620"
          height="60"
          viewBox={`0 0 ${wordmark.width} ${wordmark.height}`}
          fill="none"
        >
          {wordmark.letters.map((letter) => (
            <path key={letter.char} fill={colors[letter.char]} d={letter.d} />
          ))}
          <path fill={colors.rest} d={wordmark.rest.d} />
        </svg>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 22,
            maxWidth: 980,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              fontSize: 56,
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 1.08,
            }}
          >
            <div style={{ display: 'flex', color: '#8FBCF5' }}>Get found.</div>
            <div style={{ display: 'flex', color: '#C8B8FF' }}>Guide buyers.</div>
            <div style={{ display: 'flex', color: '#FFC982' }}>Prove what works.</div>
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 26,
              color: '#C7D3DF',
              lineHeight: 1.35,
              maxWidth: 820,
            }}
          >
            The managed authority and measurement framework for dealership websites.
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <div style={{ display: 'flex', height: 6, width: '42%', backgroundColor: '#8FBCF5' }} />
          <div style={{ display: 'flex', height: 6, width: '22%', backgroundColor: '#C8B8FF' }} />
          <div style={{ display: 'flex', height: 6, width: '16%', backgroundColor: '#FFC982' }} />
        </div>
      </div>
    ),
    { ...size },
  )
}
