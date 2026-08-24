import { HeroStageMotion } from '@/components/hero-stage-motion'
import { HeroStageView } from '@/components/hero-stage-view'

/**
 * HeroStage — treasure-map journey (hard-tuned cubic Béziers from blue sketch).
 * Static SVG is server-rendered. Traveler motion is a tiny client controller.
 */
export function HeroStage() {
  return (
    <>
      <HeroStageView />
      <HeroStageMotion />
    </>
  )
}
