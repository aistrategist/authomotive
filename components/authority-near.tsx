'use client'

import type { ReactNode } from 'react'
import { NearSwap } from '@/components/near-swap'

const load = () =>
  import('@/components/authority-experience').then((m) => ({ default: m.AuthorityExperience }))

export function AuthorityNear({ fallback }: { fallback: ReactNode }) {
  return (
    <NearSwap
      load={load}
      hashes={['authority-experiences']}
      rootMargin="640px 0px"
      fallback={fallback}
    />
  )
}
