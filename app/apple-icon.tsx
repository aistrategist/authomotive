import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

/** Authomotive brand mark — charcoal tile with discovery-blue “o”. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#252A31',
          borderRadius: 36,
        }}
      >
        <div
          style={{
            width: 88,
            height: 88,
            borderRadius: 999,
            border: '18px solid #8FBCF5',
          }}
        />
      </div>
    ),
    { ...size },
  )
}
