import type { Metadata } from 'next'
import {
  AuthomotiveLogo,
  AuthomotiveWordmark,
} from '@/components/authomotive-brand-svg'

export const metadata: Metadata = {
  title: 'Logo test',
  robots: { index: false, follow: false },
}

const treatments = [
  {
    id: 'graded',
    label: 'Graded · AUTH 0.014em → OMOTIVE 0.024em',
    note: 'AUTH 0.014em, OMOTIVE 0.024em, +1 at the joint. Inherited from the icon lockup.',
  },
  {
    id: 'uniform',
    label: 'Uniform · 0.024em throughout — production',
    note: 'Even rhythm. Weight carries the hierarchy, colour carries the sequence.',
  },
  {
    id: 'open',
    label: 'Open · 0.034em throughout',
    note: 'More air between the coloured letters. Widest of the three.',
  },
] as const

const eyebrow = 'font-mono text-xs font-medium uppercase tracking-[0.16em] text-ink/50'
const caption =
  'font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-ink/45'

export default function LogoTestPage() {
  return (
    <main className="min-h-dvh">
      <section className="bg-white px-6 py-12 md:px-10 md:py-16">
        <p className={eyebrow}>Temporary review · not linked</p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-ink">
          Wordmark-first direction
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink/70">
          No icon. AUTH carries the brand sequence letter by letter at weight 700,
          OMOTIVE follows in Ink at 400. Every letter is an outlined vector path, so
          there is no font dependency. Live header is untouched.
        </p>

        <div className="mt-12 flex flex-col gap-12">
          <figure className="flex flex-col items-start gap-3">
            <figcaption className={caption}>Primary · on white</figcaption>
            <AuthomotiveWordmark className="h-14 w-auto" />
          </figure>

          <figure className="flex flex-col items-start gap-3">
            <figcaption className={caption}>Primary · live header slot</figcaption>
            <div className="flex h-[2.25rem] w-full max-w-[22rem] items-center">
              <AuthomotiveWordmark className="h-full w-full" />
            </div>
          </figure>
        </div>
      </section>

      <section className="bg-ink px-6 py-12 md:px-10 md:py-16">
        <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-paper/50">
          Reversed on ink · brand tints as briefed
        </p>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-paper/70">
          This is the environment the tint-level colours were designed for. A, U, T and
          H sit between 9.0 and 11.8:1 here.
        </p>
        <div className="mt-12 flex flex-col gap-12">
          <AuthomotiveWordmark palette="onInk" className="h-14 w-auto" />
          <div className="flex h-[2.25rem] w-full max-w-[22rem] items-center">
            <AuthomotiveWordmark palette="onInk" className="h-full w-full" />
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-12 md:px-10 md:py-16">
        <p className={eyebrow}>Spacing treatments · same height</p>
        <div className="mt-10 flex flex-col gap-10">
          {treatments.map((item) => (
            <figure key={item.id} className="flex flex-col items-start gap-3">
              <figcaption className={caption}>{item.label}</figcaption>
              <AuthomotiveWordmark treatment={item.id} className="h-12 w-auto" />
              <p className="max-w-xl text-xs leading-relaxed text-ink/55">{item.note}</p>
            </figure>
          ))}
        </div>
      </section>

      <section className="bg-white px-6 py-12 md:px-10 md:py-16">
        <p className={eyebrow}>Colour check · why the deep stops</p>
        <div className="mt-10 flex flex-col gap-10">
          <figure className="flex flex-col items-start gap-3">
            <figcaption className={caption}>Brand tints exactly as briefed, on white</figcaption>
            <AuthomotiveWordmark palette="asBriefed" className="h-14 w-auto" />
            <p className="max-w-xl text-xs leading-relaxed text-ink/55">
              A 1.97:1, U 1.79:1, T 1.51:1, H 1.95:1 against white, versus OMOTIVE at
              17.72:1. AUTH ends up reading lighter than OMOTIVE, which inverts the
              intended hierarchy.
            </p>
          </figure>
          <figure className="flex flex-col items-start gap-3">
            <figcaption className={caption}>Deep stops of the same four hues</figcaption>
            <AuthomotiveWordmark className="h-14 w-auto" />
            <p className="max-w-xl text-xs leading-relaxed text-ink/55">
              A 6.52:1, U 5.88:1, T 2.59:1, H 5.57:1. Same sequence and meaning, and AUTH
              now holds against OMOTIVE. T stays the softest note because apricot is a
              tint by design.
            </p>
          </figure>
        </div>
      </section>

      <section className="bg-white px-6 pb-16 md:px-10">
        <p className={eyebrow}>Previous direction · still live in the header</p>
        <div className="mt-8 text-ink">
          <AuthomotiveLogo className="h-12 w-auto" />
        </div>
      </section>
    </main>
  )
}
