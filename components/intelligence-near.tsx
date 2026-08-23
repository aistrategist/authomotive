'use client'

import { NearSwap } from '@/components/near-swap'
import { IntelligenceFrame } from '@/components/intelligence-view'

const load = () =>
  import('@/components/intelligence-preview').then((m) => ({ default: m.IntelligencePreview }))

export function IntelligenceNear() {
  return (
    <NearSwap load={load} hashes={['reporting']} fallback={<IntelligenceFrame />} />
  )
}
