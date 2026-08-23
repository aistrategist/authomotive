'use client'

import { NearSwap } from '@/components/near-swap'

const load = () =>
  import('@/components/capability-system').then((m) => ({ default: m.CapabilitySystem }))

export function CapabilityNear() {
  return <NearSwap load={load} hashes={['capabilities']} observe="#capabilities" fallback={null} />
}
