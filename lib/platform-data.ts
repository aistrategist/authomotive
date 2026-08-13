/**
 * Centralized platform-credibility and reporting-matrix data.
 *
 * Brand mark rules:
 * - `image` marks use official assets stored locally in /public/brand-marks
 *   (sourced from theSVG.org — third-party trademarks belong to their owners).
 * - `wordmark` marks are typography-only. Never approximate a logo from memory.
 */

export interface BrandMark {
  id: string
  name: string
  /** 'image' renders a local official asset; 'wordmark' renders exact-name typography. */
  kind: 'image' | 'wordmark'
  /** Local path under /public for image marks. */
  src?: string
  /** Short qualifier shown under the name (e.g. "Standards"). */
  note?: string
}

export interface PlatformCategory {
  id: string
  label: string
  marks: BrandMark[]
  explanation: string
}

export const platformCredibility = {
  eyebrow: 'BUILT FOR THE STACK ALREADY IN PLACE',
  headline: 'Platform experience without a platform replacement.',
  supporting:
    'Authomotive works within the dealership website, search, analytics, and advertising environments already in place\u2014then connects the available signals into a clearer performance story.',
  categories: [
    {
      id: 'website',
      label: 'Website Platforms',
      marks: [
        { id: 'dealer-com', name: 'Dealer.com', kind: 'wordmark' },
        { id: 'dealer-inspire', name: 'Dealer Inspire', kind: 'wordmark' },
        { id: 'motive', name: 'Motive', kind: 'wordmark', note: 'motivehq.com' },
      ],
      explanation:
        'Authomotive can plan and implement authority content, buyer pathways, and supported measurement within major dealership website environments\u2014subject to platform access and technical constraints.',
    },
    {
      id: 'search',
      label: 'Search and Visibility',
      marks: [
        {
          id: 'search-console',
          name: 'Google Search Console',
          kind: 'image',
          src: '/brand-marks/google-search-console.svg',
        },
        { id: 'semrush', name: 'Semrush', kind: 'image', src: '/brand-marks/semrush.svg' },
        { id: 'dataforseo', name: 'DataForSEO', kind: 'wordmark' },
      ],
      explanation:
        'These sources help identify non-branded discovery, page and query movement, locality opportunity, competitive visibility, and observable search or AI-surface footprints.',
    },
    {
      id: 'measurement',
      label: 'Measurement and Advertising',
      marks: [
        {
          id: 'ga4',
          name: 'Google Analytics',
          kind: 'image',
          src: '/brand-marks/google-analytics.svg',
        },
        {
          id: 'gtm',
          name: 'Google Tag Manager',
          kind: 'image',
          src: '/brand-marks/google-tag-manager.svg',
        },
        { id: 'mntn', name: 'MNTN', kind: 'wordmark' },
        { id: 'asc', name: 'ASC Event Standards', kind: 'wordmark', note: 'Standards' },
      ],
      explanation:
        'These systems help connect engagement, calls, forms, inventory handoffs, supported vendor activity, digital-retailing starts, and campaign measurement to consistent event definitions.',
    },
  ] satisfies PlatformCategory[],
  clarification:
    'Third-party marks identify platforms, tools, and standards used or supported in applicable Authomotive work. They do not imply partnership, certification, or endorsement. Exact implementation depends on access and vendor capabilities.',
  closing:
    'The platform is not the strategy. Authomotive makes the existing stack more useful, measurable, and accountable.',
}

/* ------------------------------------------------------------------ */
/* Reporting matrix                                                    */
/* ------------------------------------------------------------------ */

export interface MatrixRow {
  id: string
  lens: string
  changed: string
  contributed: string
  means: string
  next: string
  /** Interpretation shown in the large plain-English panel. */
  interpretation: string
  /** The decision the evidence would support. */
  decision: string
  /** Which reporting sources activate for this row. */
  sources: string[]
}

export const reportingMatrix = {
  modeLabels: { story: 'Executive Story', matrix: 'Reporting Matrix' },
  statement:
    'One matrix connects the period change, the contributing evidence, the business meaning, and the next decision.',
  qualification:
    'Available reporting depth depends on platform access, data quality, supported events, and the dealership\u2019s existing measurement environment.',
  columns: ['What changed', 'What contributed', 'What it means', 'What comes next'],
  sources: [
    { id: 'gsc', label: 'Search Console' },
    { id: 'ga4', label: 'GA4' },
    { id: 'gtm', label: 'GTM' },
    { id: 'semrush', label: 'Semrush' },
    { id: 'dataforseo', label: 'DataForSEO' },
    { id: 'events', label: 'Custom events' },
    { id: 'vendor', label: 'Vendor signals' },
    { id: 'ads', label: 'Advertising tags' },
    { id: 'firstparty', label: 'First-party content' },
  ],
  rows: [
    {
      id: 'search-content',
      lens: 'Search and Content',
      changed: 'MoM and YoY visibility movement',
      contributed: 'Queries, pages, topics, and content clusters',
      means: 'Where dealership discovery is strengthening or weakening',
      next: 'Protect, expand, test, or correct',
      interpretation:
        'Visibility movement is read against the queries, pages, and topic clusters that produced it\u2014so the dealership knows where discovery is strengthening or weakening, and why.',
      decision: 'Protect what is working, expand what is growing, test or correct what is not.',
      sources: ['gsc', 'ga4', 'semrush', 'dataforseo'],
    },
    {
      id: 'locality',
      lens: 'Locality',
      changed: 'Performance movement by relevant market',
      contributed: 'Local pages, queries, content, and inventory relevance',
      means: 'Where geographic authority is becoming stronger',
      next: 'Reinforce or expand the right local opportunity',
      interpretation:
        'Market-level movement is connected to the local pages, queries, and inventory relevance behind it\u2014showing where geographic authority is genuinely building.',
      decision: 'Reinforce or expand the local opportunity the evidence supports.',
      sources: ['gsc', 'ga4', 'semrush', 'dataforseo'],
    },
    {
      id: 'buyer-actions',
      lens: 'Buyer Actions',
      changed: 'Engagement and meaningful-action movement',
      contributed: 'Research selections, inventory handoffs, calls, forms, and retailing starts',
      means: 'Where buyer intent advances, stalls, or disappears',
      next: 'Improve the experience, pathway, or measurement plan',
      interpretation:
        'Engagement movement is tied to the specific selections, handoffs, calls, forms, and retailing starts that drove it\u2014revealing where buyer intent advances, stalls, or disappears.',
      decision: 'Improve the experience, the pathway, or the measurement plan itself.',
      sources: ['ga4', 'gtm', 'events', 'vendor', 'ads'],
    },
    {
      id: 'ai-visibility',
      lens: 'AI Visibility',
      changed: 'Identifiable AI referrals and observed visibility footprint',
      contributed: 'Topics, pages, maintained first-party information, and surfaced observations',
      means: 'Directional evidence of AI-assisted discovery',
      next: 'Maintain, clarify, or deepen the dealership-owned answer',
      interpretation:
        'Identifiable AI referrals and observed visibility are read as directional evidence\u2014connected to the topics, pages, and maintained first-party information most likely responsible.',
      decision: 'Maintain, clarify, or deepen the dealership-owned answer.',
      sources: ['ga4', 'gsc', 'semrush', 'dataforseo', 'firstparty'],
    },
  ] satisfies MatrixRow[],
}
