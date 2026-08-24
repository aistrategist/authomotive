'use client'

import { useEffect } from 'react'
import {
  BASE_JOURNEY_MS,
  BRANCH_IDS,
  CHANNELS,
  CHANNEL_IDS,
  CONVERSIONS,
  CONVERT_FLASH_HOLD_MS,
  CONVERT_TIP_HOLD_MS,
  FLASH_HOLD_MS,
  LEAD_FLASH_HOLD_MS,
  LEAD_TIP_HOLD_MS,
  MAX_THINKING,
  PAGES,
  SPAWN_GAP_MS,
  SPEED_MAX,
  SPEED_MIN,
  STAGE_WAYPOINTS,
  THINK_COOLDOWN_MS,
  THINK_FADE_MS,
  THINK_MAX_MS,
  THINK_MIN_MS,
  TIP_FADE_MS,
  TIP_HOLD_MS,
  TIP_IDS,
  TIP_THRESHOLDS,
  type BranchId,
  type ChannelId,
  type TipId,
} from '@/components/hero-stage-data'
import { rideKeyframes, rideTransform } from '@/components/hero-stage-rides'

function pickBranch(exclude?: BranchId): BranchId {
  const pool = exclude ? BRANCH_IDS.filter((b) => b !== exclude) : BRANCH_IDS
  return pool[Math.floor(Math.random() * pool.length)]!
}

function rand(min: number, max: number) {
  return min + Math.random() * (max - min)
}

function makeTravelerSeed(branch: BranchId, waitUntil: number) {
  return {
    progress: 0,
    speed: 1 / BASE_JOURNEY_MS,
    thinking: false,
    thinkUntil: 0,
    cooldownUntil: 0,
    resumeAt: 0,
    waitUntil,
    fired: { guide: false, vsrp: false, vdp: false, convert: false },
    tipUntil: {} as Partial<Record<TipId, number>>,
    flashUntil: 0,
    flashTip: null as TipId | null,
    branch,
    /** Locked while convert tip fades — prevents climax tip jump/blink on respawn */
    tipBranch: branch,
    tipAnchorUntil: 0,
    started: false,
  }
}

function emptyChannelMap<T>(value: T): Record<ChannelId, T> {
  return Object.fromEntries(CHANNEL_IDS.map((id) => [id, value])) as Record<ChannelId, T>
}

type TipLive = Record<ChannelId, Partial<Record<TipId, boolean>>>
type FlashLive = Record<ChannelId, TipId | null>

function rollSpeed(ch: (typeof CHANNELS)[number]) {
  if (ch.id === 'seo' || ch.id === 'geo') return (1 / BASE_JOURNEY_MS) * ch.speedBias
  return (1 / BASE_JOURNEY_MS) * rand(SPEED_MIN, SPEED_MAX) * ch.speedBias
}

type UiSnap = {
  tips: TipLive
  flashes: FlashLive
  tipBranch: Record<ChannelId, BranchId>
  branch: Record<ChannelId, BranchId>
}

function uiChanged(a: UiSnap, b: UiSnap) {
  for (const id of CHANNEL_IDS) {
    if (a.flashes[id] !== b.flashes[id]) return true
    if (a.tipBranch[id] !== b.tipBranch[id]) return true
    if (a.branch[id] !== b.branch[id]) return true
    const x = a.tips[id]
    const y = b.tips[id]
    if (x.guide !== y.guide || x.vsrp !== y.vsrp || x.vdp !== y.vdp || x.convert !== y.convert) return true
  }
  return false
}

type TravelerDomCache = {
  branch: BranchId | null
  transform: string
  opacity: string
  thinking: boolean
  atNode: boolean
}

function makeTravelerDomCache(): TravelerDomCache {
  return {
    branch: null,
    transform: '',
    opacity: '',
    thinking: false,
    atNode: false,
  }
}

function animationTimeMs(value: Animation['currentTime']) {
  if (typeof value === 'number') return value
  if (value && typeof value === 'object' && 'value' in value) return Number(value.value) || 0
  return 0
}

function progressFromRide(anim: Animation) {
  return Math.max(0, Math.min(1, animationTimeMs(anim.currentTime) / BASE_JOURNEY_MS))
}

/** Compositor-owned ride — browser interpolates precomputed translate keyframes. */
function attachTransformRide(
  g: SVGGElement,
  frames: Keyframe[],
  progress: number,
  playbackRate: number,
) {
  g.style.transform = ''
  const anim = g.animate(frames, {
    duration: BASE_JOURNEY_MS,
    easing: 'linear',
    fill: 'forwards',
  })
  anim.playbackRate = Math.max(0.05, playbackRate)
  anim.currentTime = Math.max(0, Math.min(BASE_JOURNEY_MS, progress * BASE_JOURNEY_MS))
  return anim
}

function applyTravelerDom(
  g: SVGGElement | null,
  cache: TravelerDomCache,
  live: {
    progress: number
    opacity: number
    thinking: boolean
    branch: BranchId
    atNode: boolean
    pinTransform?: string
  },
) {
  if (!g) return
  if (live.pinTransform && cache.transform !== live.pinTransform) {
    g.style.transform = live.pinTransform
    cache.transform = live.pinTransform
  }
  cache.branch = live.branch
  const opacity = String(live.opacity)
  if (cache.opacity !== opacity) {
    g.style.opacity = opacity
    cache.opacity = opacity
  }
  if (cache.thinking !== live.thinking) {
    g.classList.toggle('is-thinking', live.thinking)
    cache.thinking = live.thinking
  }
  if (cache.atNode !== live.atNode) {
    g.classList.toggle('is-node', live.atNode)
    cache.atNode = live.atNode
  }
}

function makeStoryDomCache(root: HTMLElement) {
  const rings = {} as Record<string, Element | null>
  const tips = {} as Record<string, Element | null>
  const convertTips = {} as Record<string, Element | null>
  const converts = {} as Record<string, { group: Element; flashes: Element[] } | null>
  const branches = {} as Record<string, Element[]>
  const skels = {} as Record<string, Element | null>

  for (const page of PAGES) {
    skels[page.id] = root.querySelector(`.hs-skel-${page.id}`)
  }
  for (const id of BRANCH_IDS) {
    branches[id] = [...root.querySelectorAll(`[data-hs-branch="${id}"]`)]
  }
  for (const wp of STAGE_WAYPOINTS) {
    for (const ch of CHANNELS) {
      rings[`${ch.id}-${wp.id}`] = root.querySelector(`[data-hs-ring="${ch.id}-${wp.id}"]`)
      tips[`${wp.id}-${ch.id}`] = root.querySelector(`[data-hs-tip="${wp.id}-${ch.id}"]`)
    }
  }
  for (const cv of CONVERSIONS) {
    const group = root.querySelector(`[data-hs-convert="${cv.id}"]`)
    converts[cv.id] = group
      ? { group, flashes: [...group.querySelectorAll('.hs-win-glow, .hs-win-ring')] }
      : null
    for (const ch of CHANNELS) {
      convertTips[`${ch.id}-${cv.id}`] = root.querySelector(
        `[data-hs-convert-tip="${ch.id}-${cv.id}"]`,
      )
    }
  }

  return {
    skels,
    branches,
    junction: root.querySelector('.hs-junction'),
    rings,
    tips,
    converts,
    convertTips,
  }
}

function applyStoryDom(cache: ReturnType<typeof makeStoryDomCache>, ui: UiSnap) {
  const winning = new Set(
    CHANNELS.filter((ch) => ui.flashes[ch.id] === 'convert').map((ch) => ui.branch[ch.id]),
  )
  const anyWin = winning.size > 0

  for (const page of PAGES) {
    cache.skels[page.id]?.classList.toggle('is-lit', Object.values(ui.flashes).includes(page.id))
  }

  for (const id of BRANCH_IDS) {
    const hot = winning.has(id)
    const muted = anyWin && !hot
    cache.branches[id]?.forEach((el) => {
      el.classList.toggle('is-hot', hot)
      el.classList.toggle('is-muted', muted)
    })
  }

  cache.junction?.classList.toggle('is-bloom', anyWin)

  for (const wp of STAGE_WAYPOINTS) {
    for (const ch of CHANNELS) {
      cache.rings[`${ch.id}-${wp.id}`]?.classList.toggle('is-flash', ui.flashes[ch.id] === wp.id)
      cache.tips[`${wp.id}-${ch.id}`]?.classList.toggle('is-on', Boolean(ui.tips[ch.id][wp.id]))
    }
  }

  for (const cv of CONVERSIONS) {
    const win = winning.has(cv.id)
    const entry = cache.converts[cv.id]
    if (!entry) continue
    entry.group.classList.toggle('is-win', win)
    entry.group.classList.toggle('is-dim', anyWin && !win)
    entry.flashes.forEach((el) => el.classList.toggle('is-flash', win))
  }

  for (const ch of CHANNELS) {
    for (const cv of CONVERSIONS) {
      cache.convertTips[`${ch.id}-${cv.id}`]?.classList.toggle(
        'is-on',
        Boolean(ui.tips[ch.id].convert) && ui.tipBranch[ch.id] === cv.id,
      )
    }
  }
}

/**
 * Tiny client controller. Static SVG lives in HeroStageView and does not hydrate.
 */
export function HeroStageMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>('.hero-stage')
    if (!root) return

    const nodes = emptyChannelMap<SVGGElement | null>(null)
    for (const id of CHANNEL_IDS) {
      nodes[id] = root.querySelector(`[data-hs-traveler="${id}"]`)
    }

    const travelerDom = Object.fromEntries(
      CHANNEL_IDS.map((id) => [id, makeTravelerDomCache()]),
    ) as Record<ChannelId, TravelerDomCache>

    const ui: { current: UiSnap } = {
      current: {
        tips: emptyChannelMap({}),
        flashes: emptyChannelMap(null),
        tipBranch: emptyChannelMap('phone' as BranchId),
        branch: emptyChannelMap('phone' as BranchId),
      },
    }

    const sim = {
      reduced: false,
      spawnLockUntil: 0,
      travelers: Object.fromEntries(
        CHANNELS.map((ch, i) => [
          ch.id,
          makeTravelerSeed(BRANCH_IDS[i % BRANCH_IDS.length]!, ch.startDelayMs),
        ]),
      ) as Record<ChannelId, ReturnType<typeof makeTravelerSeed>>,
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    sim.reduced = reduced

    let framesReady = false
    const frames = {} as Record<ChannelId, Record<BranchId, Keyframe[]>>

    const ensureFrames = () => {
      if (framesReady) return
      for (const ch of CHANNELS) {
        frames[ch.id] = {
          phone: rideKeyframes(ch.id, 'phone'),
          form: rideKeyframes(ch.id, 'form'),
          lead: rideKeyframes(ch.id, 'lead'),
        }
      }
      framesReady = true
    }

    for (const ch of CHANNELS) {
      const t = sim.travelers[ch.id]
      t.branch = pickBranch()
      t.tipBranch = t.branch
      t.speed = rollSpeed(ch)
      t.waitUntil = performance.now() + ch.startDelayMs
      if (reduced) {
        t.progress = 1
        t.started = true
      }
    }

    if (reduced) {
      ensureFrames()
      const branch = emptyChannelMap('phone' as BranchId)
      for (const ch of CHANNELS) branch[ch.id] = sim.travelers[ch.id].branch
      const reducedUi: UiSnap = {
        tips: { ...emptyChannelMap({}), seo: { convert: true } },
        flashes: emptyChannelMap(null),
        tipBranch: { ...branch },
        branch,
      }
      ui.current = reducedUi
      applyStoryDom(makeStoryDomCache(root), reducedUi)
      const lead = sim.travelers.seo
      applyTravelerDom(nodes.seo, travelerDom.seo, {
        progress: 1,
        opacity: 0.9,
        thinking: false,
        branch: lead.branch,
        atNode: false,
        pinTransform: rideTransform('seo', lead.branch, 1),
      })
      return
    }

    const storyCache = makeStoryDomCache(root)
    const waitingDom = Object.fromEntries(CHANNEL_IDS.map((id) => [id, true])) as Record<
      ChannelId,
      boolean
    >
    let raf = 0
    let last = performance.now()
    let running = false
    let waveAligned = false
    const rides = Object.fromEntries(CHANNEL_IDS.map((id) => [id, null])) as Record<
      ChannelId,
      Animation | null
    >

    const cancelRide = (id: ChannelId) => {
      const ride = rides[id]
      if (!ride) return
      ride.cancel()
      rides[id] = null
    }

    const ensureRide = (id: ChannelId, t: (typeof sim.travelers)[ChannelId]) => {
      const g = nodes[id]
      if (!g || typeof g.animate !== 'function') return null
      const existing = rides[id]
      if (existing && existing.playState !== 'idle' && travelerDom[id].branch === t.branch) {
        return existing
      }
      existing?.cancel()
      travelerDom[id].transform = ''
      const ride = attachTransformRide(
        g,
        frames[id][t.branch],
        t.progress,
        t.speed * BASE_JOURNEY_MS,
      )
      rides[id] = ride
      travelerDom[id].branch = t.branch
      return ride
    }

    const pauseRides = () => {
      for (const id of CHANNEL_IDS) rides[id]?.pause()
    }

    const tick = (now: number) => {
      if (!running) return
      const dt = Math.min(32, now - last)
      last = now
      const travelers = sim.travelers

      let thinkingCount = 0
      for (const ch of CHANNELS) {
        if (travelers[ch.id].thinking) thinkingCount++
      }

      const nextTips = {} as TipLive
      const nextFlashes = {} as FlashLive
      const nextTipBranch = {} as Record<ChannelId, BranchId>
      const nextBranch = {} as Record<ChannelId, BranchId>

      for (const ch of CHANNELS) {
        const t = travelers[ch.id]
        const waitingToSpawn =
          now < t.waitUntil || (!t.started && now < sim.spawnLockUntil)

        if (waitingToSpawn) {
          if (!waitingDom[ch.id]) {
            waitingDom[ch.id] = true
            cancelRide(ch.id)
            applyTravelerDom(nodes[ch.id], travelerDom[ch.id], {
              progress: t.progress,
              opacity: 0,
              thinking: false,
              branch: t.branch,
              atNode: false,
              pinTransform: rideTransform(ch.id, t.branch, t.progress),
            })
          }
          nextTips[ch.id] = {}
          nextFlashes[ch.id] = null
          nextTipBranch[ch.id] = t.tipBranch
          nextBranch[ch.id] = t.branch
          continue
        }

        waitingDom[ch.id] = false

        if (!t.started) {
          t.started = true
          t.progress = 0
          t.fired = { guide: false, vsrp: false, vdp: false, convert: false }
          t.tipUntil = {}
          t.thinking = false
        }

        if (t.thinking) {
          if (now >= t.thinkUntil) {
            t.thinking = false
            t.resumeAt = now + THINK_FADE_MS
            t.cooldownUntil = now + THINK_COOLDOWN_MS
            thinkingCount = Math.max(0, thinkingCount - 1)
          }
        } else if (
          ch.id !== 'seo' &&
          t.progress > 0.16 &&
          t.progress < 0.88 &&
          now >= t.cooldownUntil &&
          now >= t.resumeAt &&
          thinkingCount < MAX_THINKING
        ) {
          const startChance = (dt / 1000) * 0.35
          if (Math.random() < startChance) {
            t.thinking = true
            t.thinkUntil = now + rand(THINK_MIN_MS, THINK_MAX_MS)
            thinkingCount++
          }
        }

        if (t.thinking || now < t.resumeAt) {
          rides[ch.id]?.pause()
        } else if (t.progress < 1) {
          const ride = ensureRide(ch.id, t)
          if (ride) {
            if (ride.playState === 'paused') ride.play()
            t.progress = progressFromRide(ride)
          } else {
            t.progress = Math.min(1, t.progress + t.speed * dt)
          }
        }

        const thresholds = TIP_THRESHOLDS[t.branch]
        for (const tip of TIP_IDS) {
          if (!t.fired[tip] && t.progress >= thresholds[tip]) {
            t.fired[tip] = true
            const convert = tip === 'convert'
            const leadWin = convert && t.branch === 'lead'
            const hold = leadWin ? LEAD_TIP_HOLD_MS : convert ? CONVERT_TIP_HOLD_MS : TIP_HOLD_MS
            t.tipUntil[tip] = now + hold
            if (convert) {
              t.tipBranch = t.branch
              t.tipAnchorUntil = now + hold + TIP_FADE_MS
            }
            t.flashTip = tip
            t.flashUntil =
              now + (leadWin ? LEAD_FLASH_HOLD_MS : convert ? CONVERT_FLASH_HOLD_MS : FLASH_HOLD_MS)
          }
        }

        const tipState: Partial<Record<TipId, boolean>> = {}
        for (const tip of TIP_IDS) {
          const until = t.tipUntil[tip]
          if (until && now < until) tipState[tip] = true
        }

        nextTips[ch.id] = tipState
        nextFlashes[ch.id] = now < t.flashUntil ? t.flashTip : null
        nextTipBranch[ch.id] = t.tipBranch
        nextBranch[ch.id] = t.branch

        const convertHoldUntil = t.tipUntil.convert ?? 0
        const opacity =
          t.progress <= 0.02
            ? t.progress / 0.02
            : t.progress >= 0.985
              ? Math.max(0, 1 - (t.progress - 0.985) / 0.015)
              : 1

        const atNode = now < t.flashUntil && Boolean(t.flashTip)
        const riding = Boolean(rides[ch.id]) && !t.thinking && now >= t.resumeAt && t.progress < 1

        let live = {
          progress: t.progress,
          opacity: Math.max(0, Math.min(1, opacity)),
          thinking: t.thinking,
          branch: t.branch,
          atNode,
          pinTransform: riding ? undefined : rideTransform(ch.id, t.branch, t.progress),
        }

        if (t.progress >= 1) {
          const holdUntil = Math.max(convertHoldUntil, t.flashUntil, t.tipAnchorUntil)
          if (now < holdUntil) {
            rides[ch.id]?.pause()
            live = {
              progress: 1,
              opacity: 0,
              thinking: false,
              branch: t.branch,
              atNode,
              pinTransform: rideTransform(ch.id, t.branch, 1),
            }
          } else {
            cancelRide(ch.id)
            t.branch = pickBranch(t.branch)
            t.speed = rollSpeed(ch)
            t.progress = 0
            t.started = false
            t.thinking = false
            t.resumeAt = 0
            t.waitUntil = now + rand(280, 640)
            sim.spawnLockUntil = now + SPAWN_GAP_MS
            t.fired = { guide: false, vsrp: false, vdp: false, convert: false }
            t.tipUntil = {}
            t.flashTip = null
            t.flashUntil = 0
            t.tipAnchorUntil = 0
            nextBranch[ch.id] = t.branch
            live = {
              progress: 0,
              opacity: 0,
              thinking: false,
              branch: t.branch,
              atNode: false,
              pinTransform: rideTransform(ch.id, t.branch, 0),
            }
          }
        }

        applyTravelerDom(nodes[ch.id], travelerDom[ch.id], live)
      }

      const nextUi: UiSnap = {
        tips: nextTips,
        flashes: nextFlashes,
        tipBranch: nextTipBranch,
        branch: nextBranch,
      }
      if (uiChanged(ui.current, nextUi)) {
        ui.current = nextUi
        applyStoryDom(storyCache, nextUi)
      }

      raf = requestAnimationFrame(tick)
    }

    const start = () => {
      if (running) return
      ensureFrames()
      running = true
      last = performance.now()
      if (!waveAligned) {
        waveAligned = true
        for (const ch of CHANNELS) {
          const t = sim.travelers[ch.id]
          if (!t.started) t.waitUntil = last + ch.startDelayMs
        }
      }
      raf = requestAnimationFrame(tick)
    }

    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
      pauseRides()
    }

    const scheduleStart = () => {
      if (running || document.hidden) return
      start()
    }

    const onVis = () => {
      if (document.hidden) stop()
      else scheduleStart()
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !document.hidden) scheduleStart()
        else stop()
      },
      { rootMargin: '80px' },
    )
    io.observe(root)
    if (!document.hidden) scheduleStart()

    document.addEventListener('visibilitychange', onVis)

    return () => {
      stop()
      for (const id of CHANNEL_IDS) cancelRide(id)
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  return null
}
