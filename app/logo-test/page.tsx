import type { Metadata } from 'next'
import {
  AuthomotiveLogo,
  AuthomotiveLogoText,
  AuthomotiveMark,
} from '@/components/authomotive-brand-svg'

export const metadata: Metadata = {
  title: 'Logo test',
  robots: { index: false, follow: false },
}

const markSizes = [
  { label: '128px', className: 'h-[128px] w-auto', compact: false },
  { label: '48px', className: 'h-12 w-auto', compact: false },
  { label: '32px', className: 'h-8 w-auto', compact: false },
  { label: '16px · simplified', className: 'h-4 w-auto', compact: true },
]

const eyebrow =
  'font-mono text-xs font-medium uppercase tracking-[0.16em] text-ink/50'
const caption =
  'font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-ink/45'

export default function LogoTestPage() {
  return (
    <main className="min-h-dvh">
      <section className="bg-white px-6 py-12 md:px-10 md:py-16">
        <p className={eyebrow}>Temporary review · not linked</p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-ink">
          Final horizontal lockup
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink/70">
          Mark frozen. Wordmark tracking unchanged from Balanced. Mark-to-wordmark gap
          tightened, wordmark dropped onto the mark&apos;s optical centre, and the
          wordmark is now outlined vector rather than live text.
        </p>

        <div className="mt-10 flex flex-col gap-12 text-ink">
          <figure className="flex flex-col items-start gap-3">
            <figcaption className={caption}>Final · presentation scale</figcaption>
            <AuthomotiveLogo className="h-24 w-auto" />
          </figure>

          <figure className="flex flex-col items-start gap-3">
            <figcaption className={caption}>Final · live header scale</figcaption>
            <div className="flex h-[3.15rem] w-full max-w-[22rem] items-center">
              <AuthomotiveLogo className="h-full w-full" />
            </div>
          </figure>
        </div>
      </section>

      <section className="bg-ink px-6 py-12 text-paper md:px-10 md:py-16">
        <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-paper/50">
          Final · reversed on ink
        </p>
        <div className="mt-10 flex flex-col gap-12">
          <AuthomotiveLogo className="h-24 w-auto text-paper" />
          <div className="flex h-[3.15rem] w-full max-w-[22rem] items-center">
            <AuthomotiveLogo className="h-full w-full text-paper" />
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-12 md:px-10 md:py-16">
        <p className={eyebrow}>Standalone mark · frozen</p>
        <div className="mt-10 flex flex-wrap items-end gap-10 text-ink">
          {markSizes.map((size) => (
            <figure key={size.label} className="flex flex-col items-start gap-2">
              <AuthomotiveMark compact={size.compact} className={size.className} />
              <figcaption className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-ink/45">
                {size.label}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="bg-white px-6 py-12 md:px-10 md:py-16">
        <p className={eyebrow}>Outline fidelity check · same height</p>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink/70">
          The outlined path was generated from Instrument Sans at these exact metrics, so
          it should be indistinguishable from the live-text rendering below it.
        </p>
        <div className="mt-8 flex flex-col gap-8 text-ink">
          <figure className="flex flex-col items-start gap-3">
            <figcaption className={caption}>Outlined vector · production</figcaption>
            <AuthomotiveLogo className="h-16 w-auto" />
          </figure>
          <figure className="flex flex-col items-start gap-3">
            <figcaption className={caption}>Live text · reference only</figcaption>
            <AuthomotiveLogoText className="h-16 w-auto" />
          </figure>
        </div>
      </section>

      <section className="bg-white px-6 pb-16 md:px-10">
        <p className={eyebrow}>Reference comparison · same height</p>
        <div className="mt-8 flex flex-col gap-8 text-ink">
          <figure className="flex flex-col items-start gap-3">
            <figcaption className={caption}>Final SVG</figcaption>
            <AuthomotiveLogo className="h-16 w-auto" />
          </figure>
          <figure className="flex flex-col items-start gap-3">
            <figcaption className={caption}>Current PNG in the live header</figcaption>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/authomotive-logo.png"
              alt="Current Authomotive logo raster reference"
              width={1024}
              height={161}
              className="h-16 w-auto"
            />
          </figure>
        </div>
      </section>
    </main>
  )
}
