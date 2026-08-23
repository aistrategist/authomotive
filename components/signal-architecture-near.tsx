'use client'

import { NearSwap } from '@/components/near-swap'
import { SignalArchitectureConsole } from '@/components/signal-architecture-view'

const load = () =>
  import('@/components/signal-architecture').then((m) => ({ default: m.SignalArchitecture }))

export function SignalArchitectureNear() {
  return (
    <NearSwap
      load={load}
      hashes={['measurement', 'how-it-works']}
      fallback={<SignalArchitectureConsole />}
    />
  )
}
