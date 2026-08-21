'use client'

import { GrainGradient } from '@paper-design/shaders-react'

type QtiGrainSurfaceProps = {
  paused: boolean
}

/**
 * Paper Grain Gradient, scoped to the Discovery-to-Inventory route.
 * Imported dynamically with ssr:false so it never ships with the hero.
 */
export default function QtiGrainSurface({ paused }: QtiGrainSurfaceProps) {
  return (
    <GrainGradient
      aria-hidden="true"
      className="qti-grain"
      width="100%"
      height="100%"
      colorBack="#fffcf7"
      colors={['#e8eef5', '#eaf3ff', '#8fbcf5', '#dce5ee']}
      shape="wave"
      softness={0.92}
      intensity={0.12}
      noise={0.16}
      speed={paused ? 0 : 0.045}
      scale={1.2}
      minPixelRatio={1}
      maxPixelCount={288000}
      webGlContextAttributes={{
        alpha: true,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: 'low-power',
        preserveDrawingBuffer: false,
      }}
    />
  )
}
