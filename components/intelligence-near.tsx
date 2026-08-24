'use client'

import type { ReactNode } from 'react'
import { NearSwap } from '@/components/near-swap'

const load = () =>
  import('@/components/intelligence-preview').then((m) => ({ default: m.IntelligencePreview }))

export function IntelligenceNear({ fallback }: { fallback: ReactNode }) {
  return <NearSwap load={load} hashes={['reporting']} fallback={fallback} />
}
