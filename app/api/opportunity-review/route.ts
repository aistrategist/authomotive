import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export const runtime = 'nodejs'

/** Field length limits — generous for real use, tight enough to block abuse. */
const LIMITS = {
  name: 120,
  email: 254,
  dealership: 160,
  website: 300,
  role: 120,
  concern: 120,
  notes: 2000,
} as const

const CONCERN_OPTIONS = new Set([
  'Our content is not earning enough visibility',
  'We cannot clearly explain performance',
  'Important buyer actions are not being tracked',
  'Our AI discovery foundation is unclear',
  'We need the complete framework',
  'I am not sure yet',
])

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

interface FieldErrors {
  [field: string]: string
}

function asTrimmedString(value: unknown, limit: number): string {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, limit)
}

/** Normalize a website URL: add https:// if missing, validate, strip credentials. */
function normalizeWebsite(raw: string): string | null {
  if (!raw) return null
  const candidate = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
  try {
    const url = new URL(candidate)
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null
    if (!url.hostname.includes('.')) return null
    url.username = ''
    url.password = ''
    return url.toString()
  } catch {
    return null
  }
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

export async function POST(request: Request) {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { ok: false, error: 'invalid_request', message: 'The request could not be read.' },
      { status: 400 },
    )
  }

  // Honeypot: real users never fill this hidden field. Return a generic
  // failure (not success) without sending anything.
  const honeypot = asTrimmedString(body.company_website, 300)
  if (honeypot) {
    return NextResponse.json(
      { ok: false, error: 'invalid_request', message: 'The request could not be processed.' },
      { status: 400 },
    )
  }

  const name = asTrimmedString(body.name, LIMITS.name)
  const emailRaw = asTrimmedString(body.email, LIMITS.email).toLowerCase()
  const dealership = asTrimmedString(body.dealership, LIMITS.dealership)
  const websiteRaw = asTrimmedString(body.website, LIMITS.website)
  const role = asTrimmedString(body.role, LIMITS.role)
  const concern = asTrimmedString(body.concern, LIMITS.concern)
  const notes = asTrimmedString(body.notes, LIMITS.notes)

  const errors: FieldErrors = {}
  if (!name) errors.name = 'Please enter your name.'
  if (!emailRaw || !EMAIL_PATTERN.test(emailRaw)) errors.email = 'Please enter a valid work email.'
  if (!dealership) errors.dealership = 'Please enter your dealership or group.'
  const website = normalizeWebsite(websiteRaw)
  if (!website) errors.website = 'Please enter a valid website URL.'
  if (!concern || !CONCERN_OPTIONS.has(concern)) errors.concern = 'Please choose a primary concern.'

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, error: 'validation', errors }, { status: 422 })
  }

  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.LEAD_NOTIFICATION_EMAIL
  const from = process.env.LEAD_FROM_EMAIL

  if (!apiKey || !to || !from) {
    // Configuration problem — do not pretend the request was delivered.
    console.error('[opportunity-review] Missing email configuration (env vars not set)')
    return NextResponse.json(
      {
        ok: false,
        error: 'not_configured',
        message: 'The request could not be sent right now.',
      },
      { status: 503 },
    )
  }

  const resend = new Resend(apiKey)

  const rows: Array<[string, string]> = [
    ['Name', name],
    ['Work email', emailRaw],
    ['Dealership or group', dealership],
    ['Website', website as string],
    ['Role', role || '(not provided)'],
    ['Primary concern', concern],
    ['Notes', notes || '(none)'],
  ]

  const html = `
    <h2 style="font-family:sans-serif;">New Opportunity Review request</h2>
    <table style="font-family:sans-serif;border-collapse:collapse;">
      ${rows
        .map(
          ([label, value]) =>
            `<tr><td style="padding:6px 16px 6px 0;font-weight:bold;vertical-align:top;">${escapeHtml(
              label,
            )}</td><td style="padding:6px 0;white-space:pre-wrap;">${escapeHtml(value)}</td></tr>`,
        )
        .join('')}
    </table>
  `

  const text = rows.map(([label, value]) => `${label}: ${value}`).join('\n')

  try {
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: emailRaw,
      subject: `Opportunity Review request from ${dealership}`,
      html,
      text,
    })

    if (error) {
      // Log the provider error name only — never submitted personal information.
      console.error('[opportunity-review] Delivery failed:', error.name)
      return NextResponse.json(
        { ok: false, error: 'delivery_failed', message: 'The request could not be sent.' },
        { status: 502 },
      )
    }
  } catch {
    console.error('[opportunity-review] Unexpected delivery error')
    return NextResponse.json(
      { ok: false, error: 'delivery_failed', message: 'The request could not be sent.' },
      { status: 502 },
    )
  }

  return NextResponse.json({ ok: true }, { status: 200 })
}
