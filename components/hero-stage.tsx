import { HeroStageMotionLoader } from '@/components/hero-stage-motion-loader'
import { HeroStageView } from '@/components/hero-stage-view'

/**
 * HeroStage — treasure-map journey (hard-tuned cubic Béziers from blue sketch).
 * Static SVG is server-rendered. Traveler motion loads after idle/interaction.
 */
export function HeroStage() {
  return (
    <>
      <HeroStageView />
      <HeroStageMotionLoader />
    </>
  )
}
