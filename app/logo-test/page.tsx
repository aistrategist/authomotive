import type { Metadata } from 'next'
import { AuthomotiveLogo, AuthomotiveMark } from '@/components/authomotive-brand-svg'

export const metadata: Metadata = {
  title: 'Logo test',
  robots: { index: false, follow: false },
}

const variants = [
  { id: 'tight', label: 'A — Tight / automotive' },
  { id: 'balanced', label: 'B — Balanced' },
  { id: 'airy', label: 'C — Airy / premium' },
] as const

export default function LogoTestPage() {
  return (
    <main className="min-h-dvh">
      <section className="bg-white px-6 py-12 md:px-10 md:py-16">
        <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-ink/50">
          Temporary review · not linked
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-ink">
          Wordmark spacing · A frozen
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink/70">
          Three spacing variants at the same height. A mark is unchanged. Public lockup file
          uses Balanced. Header still uses the PNG.
        </p>
        <div className="mt-10 flex flex-col gap-10 text-ink">
          {variants.map((item) => (
            <figure key={item.id} className="flex flex-col items-start gap-3">
              <figcaption className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-ink/50">
                {item.label}
              </figcaption>
              <AuthomotiveLogo variant={item.id} className="h-16 w-auto" />
            </figure>
          ))}
        </div>
      </section>

      <section className="bg-ink px-6 py-12 text-paper md:px-10 md:py-16">
        <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-paper/50">
          Reversed on ink
        </p>
        <div className="mt-10 flex flex-col gap-10">
          {variants.map((item) => (
            <figure key={item.id} className="flex flex-col items-start gap-3">
              <figcaption className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-paper/45">
                {item.label}
              </figcaption>
              <AuthomotiveLogo variant={item.id} className="h-16 w-auto text-paper" />
            </figure>
          ))}
        </div>
      </section>

      <section className="bg-white px-6 py-12 md:px-10 md:py-16">
        <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-ink/50">
          Standalone mark · frozen
        </p>
        <div className="mt-10 flex flex-wrap items-end gap-10">
          <figure className="flex flex-col items-start gap-2">
            <AuthomotiveMark className="h-[128px] w-auto" />
            <figcaption className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-ink/45">
              128px
            </figcaption>
          </figure>
          <figure className="flex flex-col items-start gap-2">
            <AuthomotiveMark className="h-12 w-auto" />
            <figcaption className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-ink/45">
              48px
            </figcaption>
          </figure>
          <figure className="flex flex-col items-start gap-2">
            <AuthomotiveMark className="h-8 w-auto" />
            <figcaption className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-ink/45">
              32px
            </figcaption>
          </figure>
          <figure className="flex flex-col items-start gap-2">
            <AuthomotiveMark compact className="h-4 w-auto" />
            <figcaption className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-ink/45">
              16px · simplified
            </figcaption>
          </figure>
        </div>
      </section>
    </main>
  )
}
