'use client'

import { MeshGradient } from '@paper-design/shaders-react'

type QtiFieldSurfaceProps = {
  paused: boolean
}

/**
 * Paper MeshGradient for the Discovery chapter field.
 * Imported dynamically with ssr:false so it never ships with the hero.
 */
export default function QtiFieldSurface({ paused }: QtiFieldSurfaceProps) {
  return (
    <MeshGradient
      aria-hidden="true"
      className="qti-shader"
      width="100%"
      height="100%"
      colors={['#fffcf7', '#f3f8ff', '#eaf3ff', '#bdd9ff', '#8fbcf5']}
      distortion={0.58}
      swirl={0.38}
      grainMixer={0.22}
      grainOverlay={0.1}
      speed={paused ? 0 : 0.15}
      scale={1.12}
      fit="cover"
      minPixelRatio={1}
      maxPixelCount={1600000}
      webGlContextAttributes={{
        alpha: true,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: 'low-power',
      }}
    />
  )
}
