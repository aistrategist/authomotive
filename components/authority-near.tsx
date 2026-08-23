'use client'

import { NearSwap } from '@/components/near-swap'
import { AuthorityExperienceFallback } from '@/components/authority-experience-fallback'

const load = () =>
  import('@/components/authority-experience').then((m) => ({ default: m.AuthorityExperience }))

export function AuthorityNear() {
  return (
    <NearSwap
      load={load}
      hashes={['authority-experiences']}
      rootMargin="640px 0px"
      fallback={<AuthorityExperienceFallback />}
    />
  )
}
