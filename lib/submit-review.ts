export interface ReviewRequest {
  name: string
  email: string
  dealership: string
  website: string
  role: string
  concern: string
  notes: string
  /** Honeypot — must remain empty for real submissions. */
  company_website: string
}

export interface SubmitResult {
  ok: boolean
  /** Server-side field errors, when validation fails. */
  errors?: Record<string, string>
}

/**
 * Sends the Opportunity Review request to the real submission endpoint.
 * Resolves ok:true only after the server confirms delivery.
 */
export async function submitOpportunityReview(data: ReviewRequest): Promise<SubmitResult> {
  try {
    const response = await fetch('/api/opportunity-review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    const payload = (await response.json().catch(() => null)) as {
      ok?: boolean
      errors?: Record<string, string>
    } | null

    if (response.ok && payload?.ok) {
      return { ok: true }
    }
    return { ok: false, errors: payload?.errors }
  } catch {
    return { ok: false }
  }
}
