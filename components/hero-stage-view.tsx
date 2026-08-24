/**
 * Static HeroStage markup — server-rendered SVG/map. Motion is a separate
 * client controller targeting data-* hooks.
 */
import { VisitorGlyph } from '@/components/visitor-glyph'
import {
  BRANCH_IDS,
  BRANCH_PATHS,
  CHANNELS,
  CONVERSIONS,
  CTA_X,
  CTA_Y,
  INNER,
  JUNCTION,
  PAGE_H,
  PAGE_W,
  PAGES,
  SEARCH,
  STAGE_WAYPOINTS,
  TRAIL_MAIN,
  TRAIL_SEGMENTS,
  VB_H,
  VB_W,
  tipPct,
  type BranchId,
} from '@/components/hero-stage-data'

const INK = 'var(--ink)'

function VisitorFace({ color, variant = 0 }: { color: string; variant?: number }) {
  return (
    <>
      <g className="hs-packet hs-visitor-fit">
        <VisitorGlyph color={color} variant={variant} />
      </g>
      <g className="hs-think">
        <circle className="hs-think-tail" cx="7.4" cy="-10.8" r="1.05" />
        <circle className="hs-think-tail" cx="10.6" cy="-15.2" r="1.5" />
        <ellipse className="hs-think-cloud" cx="17.2" cy="-22" rx="8.2" ry="5.2" />
        <circle className="hs-think-dot hs-think-d1" cx="13.6" cy="-22" r="1.08" />
        <circle className="hs-think-dot hs-think-d2" cx="17.2" cy="-22" r="1.08" />
        <circle className="hs-think-dot hs-think-d3" cx="20.8" cy="-22" r="1.08" />
      </g>
    </>
  )
}

function VisitorChipIcon({ color, variant = 0 }: { color: string; variant?: number }) {
  return (
    <svg className="hs-chip-face" viewBox="-10 -11 20 22" width="22" height="22" aria-hidden="true">
      <VisitorGlyph color={color} variant={variant} />
    </svg>
  )
}

function SearchGlyph() {
  return (
    <g fill="none" stroke={INK} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="-1.6" cy="-1.8" r="5.2" />
      <path d="M2.2 2 6.4 6.2" />
    </g>
  )
}

/** Lime disc + dark glyph — shared style for junction car + convert ends */
function ConvertGlyph({ id, stroke = INK }: { id: BranchId; stroke?: string }) {
  if (id === 'phone') {
    return (
      <g fill="none" stroke={stroke} strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round">
        <path d="M-3.2 -4.2h2.1c.35 0 .65.28.65.65l.35 1.85c.05.3-.08.55-.3.7l-.95.95a7.2 7.2 0 0 0 3.1 3.1l.95-.95c.22-.22.5-.35.7-.3l1.85.35c.37.07.65.35.65.7v2.1c0 .37-.28.65-.65.65A8 8 0 0 1 -3.85 -3.55c0-.37.28-.65.65-.65Z" />
      </g>
    )
  }
  if (id === 'form') {
    return (
      <g fill="none" stroke={stroke} strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round">
        <rect x="-3.6" y="-4.4" width="7.2" height="8.8" rx="1.1" />
        <path d="M-1.8 -1.6h3.6M-1.8 .4h3.6M-1.8 2.4h2.2" />
      </g>
    )
  }
  return (
    <g fill="none" stroke={stroke} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M-2.6 .1  -.6 2.1  3.2 -1.8" />
    </g>
  )
}

function ConvertTipIcon({ id }: { id: BranchId }) {
  return (
    <svg className="hs-tip-mark" width="13" height="13" viewBox="-6 -6.5 12 13" fill="none" aria-hidden>
      <ConvertGlyph id={id} stroke="currentColor" />
    </svg>
  )
}

function CarGlyph() {
  return (
    <g fill="none" stroke={INK} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M-8.2 1.35h16.4" />
      <path d="M-6.4 1.35  -4.2 -2.7h8.4l2.2 4.05" />
      <circle cx="-3.8" cy="2.95" r="1.6" fill={INK} stroke="none" />
      <circle cx="3.8" cy="2.95" r="1.6" fill={INK} stroke="none" />
      <path d="M-2.5 -2.45h5" />
    </g>
  )
}

function PageWireframe({
  id,
  x,
  y,
  label,
  variant,
  lit,
}: {
  id: string
  x: number
  y: number
  label: string
  variant: 'guide' | 'vsrp' | 'vdp'
  lit?: boolean
}) {
  const cardW = Math.round(INNER / 3 - 4)
  const cardGap = 12
  const card1 = 12
  const card2 = card1 + cardW + cardGap
  const card3 = card2 + cardW + cardGap

  return (
    <g className={`hs-skel hs-skel-${id}${lit ? ' is-lit' : ''}`} transform={`translate(${x} ${y})`}>
      <rect
        width={PAGE_W}
        height={PAGE_H}
        rx="11"
        fill="var(--hero-panel-body)"
        stroke="var(--hero-panel-border)"
        strokeWidth="1.25"
      />
      <rect width={PAGE_W} height="26" rx="11" fill="var(--hero-panel-chrome)" />
      <rect y="13" width={PAGE_W} height="13" fill="var(--hero-panel-chrome)" />
      <circle cx="16" cy="13" r="3" fill="rgba(184,193,204,0.42)" />
      <circle cx="27" cy="13" r="3" fill="rgba(184,193,204,0.28)" />
      <circle cx="38" cy="13" r="3" fill="rgba(184,193,204,0.16)" />
      <rect x="52" y="8" width="120" height="9" rx="4" fill="var(--hero-panel-line)" />

      <text
        x="12"
        y="44"
        fill="rgba(255,252,247,0.62)"
        style={{ fontSize: '8px', letterSpacing: '0.14em', fontFamily: 'ui-monospace, monospace' }}
      >
        {label}
      </text>

      {variant === 'guide' && (
        <>
          <rect className="hs-skel-line" x="12" y="54" width="92" height="9" rx="2" />
          <rect className="hs-skel-block" x="12" y="72" width={INNER} height="6" rx="2" />
          <rect className="hs-skel-block" x="12" y="84" width={INNER - 20} height="6" rx="2" />
          <rect className="hs-skel-block" x="12" y="96" width={INNER - 10} height="6" rx="2" />
          <rect className="hs-skel-block" x="12" y="108" width={INNER - 56} height="6" rx="2" />
          <rect className="hs-skel-mass" x="12" y="122" width={INNER} height="16" rx="3" />
        </>
      )}
      {variant === 'vsrp' && (
        <>
          <rect className="hs-skel-mass" x={card1} y="54" width={cardW} height="52" rx="4" />
          <rect className="hs-skel-mass" x={card2} y="54" width={cardW} height="52" rx="4" />
          <rect className="hs-skel-mass" x={card3} y="54" width={cardW} height="52" rx="4" />
          <rect className="hs-skel-block" x="12" y="118" width={INNER - 40} height="6" rx="2" />
          <rect className="hs-skel-block" x="12" y="130" width={INNER - 70} height="6" rx="2" />
        </>
      )}
      {variant === 'vdp' && (
        <>
          <rect className="hs-skel-mass" x="12" y="54" width={INNER} height="64" rx="5" />
          <rect className="hs-skel-line" x="12" y="128" width="132" height="7" rx="2" />
          <rect className="hs-skel-block" x="12" y="140" width="184" height="6" rx="2" />
        </>
      )}

      <rect
        className="hs-skel-cta"
        x={CTA_X - 52}
        y={CTA_Y - 14}
        width="104"
        height="28"
        rx="6"
        fill="rgba(143,188,245,0.14)"
        stroke="rgba(143,188,245,0.72)"
        strokeWidth="1.25"
      />
      <rect className="hs-skel-block" x={CTA_X - 28} y={CTA_Y - 3} width="56" height="6" rx="2" opacity="0.7" />
    </g>
  )
}

function HeroStageAtmosphere() {
  return (
    <>
      <defs>
        <pattern id="hs-map-grid" width="28" height="28" patternUnits="userSpaceOnUse">
          <path className="hs-map-grid-line" d="M28 0H0V28" fill="none" />
        </pattern>
        <radialGradient id="hs-grid-fade" cx="48%" cy="46%" r="62%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="70%" stopColor="#fff" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id="hs-grid-mask">
          <rect width={VB_W} height={VB_H} fill="url(#hs-grid-fade)" />
        </mask>
      </defs>

      <g className="hs-grid-fragments" mask="url(#hs-grid-mask)" opacity="0.45">
        <rect x="40" y="20" width="220" height="180" fill="url(#hs-map-grid)" />
        <rect x="300" y="40" width="240" height="200" fill="url(#hs-map-grid)" />
        <rect x="80" y="220" width="260" height="170" fill="url(#hs-map-grid)" />
        <rect x="360" y="250" width="200" height="140" fill="url(#hs-map-grid)" />
      </g>
    </>
  )
}

function HeroTravelers() {
  return (
    <>
      {CHANNELS.map((ch) => (
        <g key={ch.id} data-hs-traveler={ch.id} className={`hs-traveler hs-traveler-${ch.id}`}>
          <g className="hs-packet-steer" transform={`translate(0 ${ch.lane})`}>
            <VisitorFace color={ch.color} variant={ch.face} />
          </g>
        </g>
      ))}
    </>
  )
}

function HeroStageSignals() {
  return (
    <>
      {PAGES.map((page) => (
        <PageWireframe
          key={page.id}
          id={page.id}
          x={page.x}
          y={page.y}
          label={page.label}
          variant={page.id}
        />
      ))}

      <g className="hs-trail-layer">
        <path className="hs-trail-glow" d={TRAIL_MAIN} />
        {BRANCH_IDS.map((id) => (
          <path
            key={`glow-${id}`}
            className="hs-trail-glow hs-trail-glow-branch"
            d={`M${JUNCTION.cx} ${JUNCTION.cy}${BRANCH_PATHS[id]}`}
          />
        ))}
        <path className="hs-trail-base" d={TRAIL_MAIN} />
        {BRANCH_IDS.map((id) => (
          <path
            key={`base-${id}`}
            data-hs-branch={id}
            className="hs-trail-base hs-trail-base-branch"
            d={`M${JUNCTION.cx} ${JUNCTION.cy}${BRANCH_PATHS[id]}`}
          />
        ))}
        {TRAIL_SEGMENTS.map((seg) => {
          const isBranch = seg.id === 'phone' || seg.id === 'form' || seg.id === 'lead'
          return (
            <path
              key={seg.id}
              data-hs-branch={isBranch ? seg.id : undefined}
              className={`hs-trail-seg hs-trail-seg-${seg.tone}${isBranch ? ' hs-trail-branch' : ''}`}
              d={seg.d}
            />
          )
        })}
        <path className="hs-trail-center" d={TRAIL_MAIN} />
        {BRANCH_IDS.map((id) => (
          <path
            key={`center-${id}`}
            data-hs-branch={id}
            className="hs-trail-center hs-trail-center-branch"
            d={`M${JUNCTION.cx} ${JUNCTION.cy}${BRANCH_PATHS[id]}`}
          />
        ))}
        {STAGE_WAYPOINTS.map((wp) => (
          <circle key={`node-${wp.id}`} className="hs-trail-node" cx={wp.cx} cy={wp.cy} r="16" />
        ))}
      </g>

      <g className="hs-junction" transform={`translate(${JUNCTION.cx} ${JUNCTION.cy})`}>
        <circle className="hs-hub-bloom" r="36" fill="rgba(232,238,245,0.12)" />
        <circle r="22" fill="#b8c1cc" />
        <circle r="22" fill="none" stroke="rgba(255,252,247,0.35)" strokeWidth="1.35" />
        <CarGlyph />
      </g>

      <g className="hs-start" transform={`translate(${SEARCH.cx} ${SEARCH.cy})`}>
        <circle className="hs-convert-disc" r="16" fill="#b8c1cc" />
        <circle r="16" fill="none" stroke="rgba(255,252,247,0.28)" strokeWidth="1.25" />
        <SearchGlyph />
      </g>

      {STAGE_WAYPOINTS.map((wp) => (
        <g key={wp.id}>
          {CHANNELS.map((ch) => (
            <circle
              key={ch.id}
              data-hs-ring={`${ch.id}-${wp.id}`}
              className={`hs-ring hs-ring-${ch.id}`}
              cx={wp.cx}
              cy={wp.cy}
              r="18"
              fill="none"
              stroke={ch.color}
              strokeWidth="2"
            />
          ))}
        </g>
      ))}

      {CONVERSIONS.map((cv) => (
        <g key={cv.id} data-hs-convert={cv.id} className={`hs-convert hs-convert-${cv.id}`}>
          <circle
            className="hs-win-glow"
            cx={cv.cx}
            cy={cv.cy}
            r="30"
            fill="var(--action)"
            opacity="0"
          />
          <circle
            className="hs-win-ring hs-win-ring-a"
            cx={cv.cx}
            cy={cv.cy}
            r="16"
            fill="none"
            stroke="var(--action)"
            strokeWidth="2"
            opacity="0"
          />
          <circle
            className="hs-win-ring hs-win-ring-b"
            cx={cv.cx}
            cy={cv.cy}
            r="16"
            fill="none"
            stroke="#fffcf7"
            strokeWidth="1.4"
            opacity="0"
          />
          <circle className="hs-convert-disc" cx={cv.cx} cy={cv.cy} r="13" fill="#b8c1cc" />
          <g transform={`translate(${cv.cx} ${cv.cy})`}>
            <g className="hs-convert-glyph">
              <ConvertGlyph id={cv.id} />
            </g>
          </g>
          <text
            className="hs-convert-label"
            x={cv.cx}
            y={cv.cy + 26}
            textAnchor="middle"
            fill="rgba(255,252,247,0.58)"
            style={{
              fontSize: '8px',
              letterSpacing: '0.12em',
              fontFamily: 'ui-monospace, monospace',
            }}
          >
            {cv.label}
          </text>
        </g>
      ))}
    </>
  )
}

function HeroTips() {
  return (
    <>
      {STAGE_WAYPOINTS.flatMap((wp) =>
        CHANNELS.map((ch) => (
          <div
            key={`${wp.id}-${ch.id}`}
            data-hs-tip={`${wp.id}-${ch.id}`}
            className={`hs-tip hs-tip-${ch.tipLabel.toLowerCase()}`}
            style={{ left: wp.x, top: wp.y }}
          >
            <span className="hs-tip-dot" />
            <span className="hs-tip-label">{wp.tip}</span>
          </div>
        )),
      )}

      {CHANNELS.flatMap((ch) =>
        CONVERSIONS.map((branch) => {
          const pos = tipPct(branch.cx, branch.cy)
          return (
            <div
              key={`convert-${ch.id}-${branch.id}`}
              data-hs-convert-tip={`${ch.id}-${branch.id}`}
              className={`hs-tip hs-tip-convert hs-tip-climax hs-tip-submit hs-tip-${ch.tipLabel.toLowerCase()}${
                branch.id === 'lead' ? ' hs-tip-win' : ''
              }`}
              style={{ left: pos.x, top: pos.y }}
            >
              <span className="hs-tip-dot" />
              <span className="hs-tip-icon" aria-hidden="true">
                <ConvertTipIcon id={branch.id} />
              </span>
              <span className="hs-tip-label">{branch.tip}</span>
            </div>
          )
        }),
      )}
    </>
  )
}

export function HeroStageView() {
  return (
    <div className="hero-stage relative mx-auto w-full max-w-[580px] overflow-visible lg:max-w-none">
      <p className="sr-only">
        Animated conversion map: website visitors from Search, AI, and Local follow a trail
        through a research guide, VSRP, and VDP, then convert via phone, form, or lead.
        Visitors vary in pace and occasionally pause as if thinking.
      </p>

      <div className="hs-map" aria-hidden="true">
        <div className="hs-intel">
          <p className="hs-intel-kicker">Website visitors</p>
          <div className="hs-intel-channels">
            <span className="hs-legend-item hs-chip-seo">
              <VisitorChipIcon color="var(--accent)" variant={0} />
              Search
            </span>
            <span className="hs-legend-item hs-chip-aeo">
              <VisitorChipIcon color="var(--porcelain)" variant={2} />
              AI
            </span>
            <span className="hs-legend-item hs-chip-geo">
              <VisitorChipIcon color="var(--proof)" variant={1} />
              Local
            </span>
          </div>
        </div>

        <div className="hs-map-stage">
          <svg
            className="hs-map-svg"
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="presentation"
            preserveAspectRatio="xMidYMid meet"
            overflow="visible"
          >
            <HeroStageAtmosphere />
            <HeroStageSignals />
          </svg>
          <svg
            className="hs-map-svg hs-map-travelers"
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="presentation"
            preserveAspectRatio="xMidYMid meet"
            overflow="visible"
          >
            <HeroTravelers />
          </svg>

          <HeroTips />
        </div>
      </div>
    </div>
  )
}
