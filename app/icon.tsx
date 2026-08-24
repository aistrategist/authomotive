import { ImageResponse } from 'next/og'
import { WORDMARK_SETS } from '@/components/authomotive-wordmark-outline'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

const aPath = WORDMARK_SETS.uniform.letters[0]!.d

/** 32×32 PNG of the outlined AUTH “A” on Ink. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#061B20',
          borderRadius: 7,
        }}
      >
        <svg width="20" height="21" viewBox="0 0 49.54 52.56" fill="none">
          <path fill="#8FBCF5" d={aPath} />
        </svg>
      </div>
    ),
    { ...size },
  )
}
