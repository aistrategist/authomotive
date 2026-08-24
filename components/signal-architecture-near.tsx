'use client'

import type { ReactNode } from 'react'
import { NearSwap } from '@/components/near-swap'

const load = () =>
  import('@/components/signal-architecture').then((m) => ({ default: m.SignalArchitecture }))

export function SignalArchitectureNear({ fallback }: { fallback: ReactNode }) {
  return (
    <NearSwap
      load={load}
      hashes={['measurement', 'how-it-works']}
      fallback={fallback}
    />
  )
}
