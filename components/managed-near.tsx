'use client'

import { NearSwap } from '@/components/near-swap'
import { ManagedHub } from '@/components/managed-framework-view'

const load = () =>
  import('@/components/managed-framework').then((m) => ({ default: m.ManagedFramework }))

export function ManagedNear() {
  return <NearSwap load={load} hashes={['engagement']} fallback={<ManagedHub />} />
}
