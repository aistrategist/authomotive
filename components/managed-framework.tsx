import { managedFramework } from '@/lib/site-data'
import { SignalRail } from '@/components/signal-rail'

export function ManagedFramework() {
  const { leadInset, collab } = managedFramework

  return (
    <section
      id="engagement"
      data-spy="clear"
      aria-labelledby="framework-heading"
      className="scroll-mt-24 border-b border-border bg-alloy"
    >
      <div className="mx-auto max-w-[1280px] px-5 py-14 md:px-8 md:py-16 lg:py-[4.5rem]">
        <SignalRail tone="ink" />
        <div className="max-w-[46rem]">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-signal-deep">
            {managedFramework.eyebrow}
          </p>
          <h2
            id="framework-heading"
            className="mt-3 text-3xl font-semibold tracking-tight text-ink md:text-5xl text-balance"
          >
            {managedFramework.headline}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-pretty">
            {managedFramework.lead}
          </p>
        </div>

        <article className="mt-9 overflow-hidden rounded-[8px] border-2 border-ink bg-paper md:mt-10">
          <header className="flex items-start gap-3 border-b-2 border-ink bg-ink px-5 py-4 md:items-center md:gap-4 md:px-7 md:py-5">
            <span className="mt-1.5 h-3 w-3 shrink-0 bg-paper md:mt-0" aria-hidden="true" />
            <div>
              <p className="font-mono text-[0.625rem] font-medium uppercase tracking-[0.16em] text-stage-muted">
                Monthly operating agenda
              </p>
              <h3 className="mt-1 text-lg font-semibold tracking-tight text-paper md:text-2xl text-balance">
                {managedFramework.sessionTitle}
              </h3>
            </div>
          </header>

          <ol className="grid gap-0 lg:grid-cols-3">
            {managedFramework.sessionParts.map((part, i) => (
              <li
                key={part.id}
                className={`flex flex-col p-5 md:p-6 ${
                  i < managedFramework.sessionParts.length - 1
                    ? 'border-b border-ink/15 lg:border-b-0 lg:border-r'
                    : ''
                }`}
              >
                <h4 className="flex items-center gap-2.5 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-signal-deep">
                  <span className={`h-2.5 w-2.5 shrink-0 ${part.mark}`} aria-hidden="true" />
                  <span aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  {part.label}
                </h4>
                <ul className="mt-4 flex flex-col">
                  {part.items.map((item) => (
                    <li
                      key={item}
                      className="border-t border-ink/10 py-2.5 text-base font-semibold leading-snug text-ink first:border-t-0 md:text-lg text-pretty"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>

          <aside className="border-t-2 border-ink bg-porcelain px-5 py-5 md:px-7 md:py-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:gap-8">
              <div className="md:max-w-[11rem] md:shrink-0">
                <h4 className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-signal-deep">
                  {leadInset.kicker}
                </h4>
              </div>
              <div className="min-w-0 flex-1 border-l-2 border-ink pl-4 md:pl-6">
                <p className="text-lg font-semibold leading-snug tracking-tight text-ink md:text-xl text-pretty">
                  {leadInset.copy}
                </p>
                <p className="mt-2 text-base leading-relaxed text-muted-foreground text-pretty">
                  {leadInset.supporting}
                </p>
              </div>
            </div>
          </aside>
        </article>

        <div className="mt-6 border-t border-ink/15 pt-6">
          <p className="font-mono text-[0.625rem] font-medium uppercase tracking-[0.14em] text-signal-deep md:text-xs">
            {collab.eyebrow}
          </p>
          <ul
            className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
            aria-label="Partners Authomotive works alongside"
          >
            {collab.partners.map((partner) => (
              <li key={partner} className="flex items-start gap-2.5">
                <span className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 bg-ink" aria-hidden="true" />
                <span className="text-sm font-semibold leading-snug text-ink md:text-base">
                  {partner}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 max-w-[46rem] text-sm leading-relaxed text-muted-foreground text-pretty md:text-base">
            {collab.supporting}
          </p>
        </div>

        <p className="mt-6 max-w-[46rem] text-lg font-semibold leading-snug tracking-tight text-ink md:text-xl text-pretty">
          {managedFramework.fit}
        </p>

        <div className="mt-6 flex flex-col items-start gap-3">
          <a href="#opportunity-review" className="btn btn-action">
            {managedFramework.ctaLabel}
            <span className="btn-arrow" aria-hidden="true">
              →
            </span>
          </a>
          <p className="max-w-[36rem] text-sm leading-relaxed text-muted-foreground text-pretty md:text-base">
            {managedFramework.ctaSupport}
          </p>
        </div>
      </div>
    </section>
  )
}
