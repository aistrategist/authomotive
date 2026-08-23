import dynamic from 'next/dynamic'

export const CapabilitySystem = dynamic(
  () => import('@/components/capability-system').then((m) => ({ default: m.CapabilitySystem })),
  { ssr: true },
)

export const AuthorityExperience = dynamic(
  () =>
    import('@/components/authority-experience').then((m) => ({ default: m.AuthorityExperience })),
  { ssr: true },
)

export const IntelligencePreview = dynamic(
  () =>
    import('@/components/intelligence-preview').then((m) => ({ default: m.IntelligencePreview })),
  { ssr: true },
)

export const SignalArchitecture = dynamic(
  () =>
    import('@/components/signal-architecture').then((m) => ({ default: m.SignalArchitecture })),
  { ssr: true },
)

export const ManagedFramework = dynamic(
  () => import('@/components/managed-framework').then((m) => ({ default: m.ManagedFramework })),
  { ssr: true },
)

export const FinalCta = dynamic(
  () => import('@/components/final-cta').then((m) => ({ default: m.FinalCta })),
  { ssr: true },
)
