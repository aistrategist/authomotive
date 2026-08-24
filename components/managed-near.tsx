'use client'

import type { ReactNode } from 'react'
import { NearSwap } from '@/components/near-swap'

const load = () =>
  import('@/components/managed-framework').then((m) => ({ default: m.ManagedFramework }))

export function ManagedNear({ fallback }: { fallback: ReactNode }) {
  return <NearSwap load={load} hashes={['engagement']} fallback={fallback} />
}
