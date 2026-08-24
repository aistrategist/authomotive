'use client'

import { NearSwap } from '@/components/near-swap'
import { FinalCtaView } from '@/components/final-cta-view'

const load = () => import('@/components/final-cta').then((m) => ({ default: m.FinalCta }))

export function FinalCtaNear() {
  return (
    <NearSwap
      load={load}
      hashes={['opportunity-review']}
      rootMargin="640px 0px"
      fallback={<FinalCtaView />}
    />
  )
}
