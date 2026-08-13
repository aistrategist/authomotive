export const siteConfig = {
  name: 'Authomotive',
  tagline: 'Build authority. Move buyers.',
  category: 'The managed authority and measurement framework for dealership websites',
}

export const navLinks = [
  { label: 'What We Build', href: '#capabilities' },
  { label: 'Authority Content', href: '#authority-experiences' },
  { label: 'Reporting', href: '#reporting' },
  { label: 'Measurement', href: '#measurement' },
  { label: 'How It Works', href: '#how-it-works' },
] as const

export const hero = {
  brand: 'Authomotive',
  eyebrow: 'DEALERSHIP AUTHORITY, MADE MEASURABLE',
  headline: 'Your website should help buyers choose you.',
  emphasis: 'choose you',
  supporting:
    'Content that gets your dealership found, guides shoppers to the right vehicle on your lot, and proves what drove the sale.',
  primaryCta: 'Request an Opportunity Review',
  secondaryCta: 'See What We Build',
  confidence: 'Built around the dealership website and vendor stack you already have.',
  question: 'Which three-row SUV fits my family, budget, and winter driving needs?',
  outcomes: [
    {
      id: 'earn',
      statement: 'EARN DISCOVERY',
      explanation:
        'A shopper finds a dealership-owned answer to a specific question generic dealer content leaves unresolved.',
    },
    {
      id: 'guide',
      statement: 'GUIDE THE DECISION',
      explanation:
        'The experience helps that shopper evaluate fit and move naturally toward relevant inventory.',
    },
    {
      id: 'prove',
      statement: 'PROVE THE VALUE',
      explanation:
        'The dealership sees the visibility, engagement, selections, and meaningful handoffs connected to the work.',
    },
  ],
}

export const industryGap = {
  eyebrow: 'WHY THIS EXISTS',
  headline: 'Dealer websites have more tools than clarity.',
  supporting:
    'Content, inventory, analytics, advertising, vendor experiences, and AI visibility are often managed separately. That makes it difficult to know what buyers found, what helped them decide, which actions mattered, or what the dealership should build next.',
  problems: [
    {
      title: 'Content that looks like every other dealer page',
      body: 'Most dealership content exists to fill a URL\u2014repeating manufacturer language, answering little, and giving search systems few reasons to treat it as distinctive.',
    },
    {
      title: 'Reporting without a useful story',
      body: 'One platform reports traffic, another rankings, another leads. The dealership receives numbers but cannot clearly explain what changed or what should happen next.',
    },
    {
      title: 'Buyer actions that disappear',
      body: 'Shoppers use embedded tools, vendor experiences, calls, forms, and digital retailing pathways\u2014and many of those actions never reach standard reporting.',
    },
  ],
  closing: 'Authomotive connects those missing pieces into one managed standard.',
}

export interface Capability {
  id: string
  plainName: string
  brandedName: string
  primaryMessage: string
  supporting: string
  outcomesTitle: string
  outcomes: string[]
  disclosureTitle: string
  disclosureItems: string[]
  keyLine: string
}

export const capabilitySystem = {
  eyebrow: 'THE AUTHOMOTIVE AUTHORITY SYSTEM',
  headline: 'Three jobs. One connected growth framework.',
  supporting:
    'We build the experience, connect the measurement, and use the evidence to decide what comes next.',
  capabilities: [
    {
      id: 'get-found',
      plainName: 'Get Found and Chosen',
      brandedName: 'Authority Experiences',
      primaryMessage:
        'Create dealership-owned pages that answer better questions and move buyers toward a decision.',
      supporting:
        'Original dealership research experiences built around real shopper needs, local opportunity, vehicle decisions, and inventory pathways\u2014useful to buyers and clearer for search and AI-assisted systems.',
      outcomesTitle: 'Visible outcomes',
      outcomes: [
        'Stronger non-branded discovery opportunities',
        'Better answers to high-value buyer questions',
        'Clearer model, feature, ownership, and comparison guidance',
        'More intentional movement from research to inventory',
        'Content that can be measured and improved over time',
      ],
      disclosureTitle: 'What makes the content different?',
      disclosureItems: [
        'Direct answers instead of keyword filler',
        'Buyer-fit guidance',
        'Model, trim, feature, ownership, and comparison logic',
        'Local relevance where it is genuinely useful',
        'Clear information hierarchy',
        'Structured FAQs and supporting data',
        'Internal pathways between related research',
        'Contextual transitions to relevant inventory',
        'Search-friendly and AI-readable HTML',
        'Custom interactive elements when they improve understanding',
        'Measurement planned before launch',
      ],
      keyLine:
        'Most dealer pages are built to exist. Authority Experiences are built to earn attention, guide a decision, and prove their value.',
    },
    {
      id: 'know-working',
      plainName: 'Know What Is Working',
      brandedName: 'Authomotive Intelligence',
      primaryMessage: 'Turn disconnected performance data into one reliable monthly story.',
      supporting:
        'Authomotive connects search visibility, website engagement, locality, content performance, identifiable AI activity, and meaningful buyer actions so a dealership can understand what changed and make the next decision with evidence.',
      outcomesTitle: 'Reporting questions we answer',
      outcomes: [
        'What improved month over month?',
        'What changed year over year?',
        'Which pages and buyer questions contributed?',
        'Are non-branded opportunities growing?',
        'Where is local visibility getting stronger?',
        'How are shoppers engaging with the work?',
        'Which actions indicate movement toward inventory or conversion?',
        'What should be protected, expanded, tested, or corrected next?',
      ],
      disclosureTitle: 'What can feed the reporting framework?',
      disclosureItems: [
        'Google Search Console',
        'GA4',
        'Semrush or DataForSEO',
        'Identifiable AI referral traffic',
        'Observed AI and AI Overview visibility',
        'Geographic and locality performance',
        'Page and query movement',
        'Engagement behavior',
        'GTM and custom-event data',
        'Inventory-pathway actions',
        'Advertising measurement signals',
      ],
      keyLine: 'The goal is not another dashboard. It is a clearer decision.',
    },
    {
      id: 'track-matters',
      plainName: 'Track What Matters',
      brandedName: 'Signal Architecture',
      primaryMessage: 'Capture the buyer actions standard analytics often overlooks.',
      supporting:
        'Authomotive audits and improves dealership measurement through GTM, custom events, vendor-supported integrations, advertising tags, and clearer event standards\u2014so reporting reflects more of what shoppers actually did.',
      outcomesTitle: 'Examples of what gets measured',
      outcomes: [
        'Calls and important CTA clicks',
        'Form starts and successful submissions',
        'Research selections and comparisons',
        'Inventory handoffs',
        'Digital retailing starts',
        'Chat and vendor-tool engagement',
        'Embedded experience exits',
        'Campaign-specific conversion tags',
        'MNTN and other advertising measurement requirements',
        'ASC-aligned dealership event naming',
      ],
      disclosureTitle: 'How deeper tracking is implemented',
      disclosureItems: [
        'Google Tag Manager configuration',
        'GA4 custom events',
        'Data-layer listeners',
        'Custom JavaScript where appropriate',
        'ASC-aligned event taxonomy',
        'Vendor-provided event hooks',
        'postMessage integrations when supported',
        'Outbound-link and handoff measurement',
        'Iframe focus or exit signals when technically reliable',
        'Campaign and advertising tags mapped to meaningful actions',
        'Validation, debugging, naming governance, and documentation',
      ],
      keyLine: 'If an action matters to the dealership, it deserves a clear measurement plan.',
    },
  ] satisfies Capability[],
}

export const authorityTheater = {
  eyebrow: 'BETTER DEALERSHIP CONTENT',
  headline: 'Pages that do more than rank.',
  supporting:
    'The strongest dealership content earns discovery, answers the real question, helps the shopper evaluate a decision, and creates a useful next step.',
  exampleTopic: 'Which Three-Row SUV Is Right for My Family?',
  views: [
    { id: 'shopper', label: 'What the shopper sees' },
    { id: 'discovery', label: 'What discovery systems understand' },
    { id: 'measurable', label: 'What the dealership can measure' },
  ],
}

export const aiDiscovery = {
  eyebrow: 'INCLUDED FOUNDATION WITHIN GET FOUND AND CHOSEN',
  headline: 'A managed first-party source for AI discovery.',
  supporting:
    'Every engagement includes a dealership-owned AI Discovery page: one dependable, regularly managed reference that organizes verified business information for people, search systems, and AI-assisted discovery.',
  pageContents: [
    'Business identity and locations',
    'Brands, services, and markets',
    'Research and inventory pathways',
    'FAQs, structured information, and maintenance',
  ],
  values: [
    'Easier for people to understand',
    'Easier for search systems to crawl',
    'Clearer first-party context for AI-assisted discovery',
  ],
  keyLine:
    'AI Discovery is not a one-time upload. It is an owned dealership resource that should stay accurate, useful, and current.',
}

export const reporting = {
  eyebrow: 'ONE MONTHLY TRUTH',
  headline: 'See what changed. Understand why. Decide what comes next.',
  supporting:
    'Authomotive Intelligence connects performance across search, content, locality, engagement, AI visibility, and measured buyer actions\u2014then explains it in language dealership teams can use.',
  disclaimer: 'Illustrative reporting interface \u2014 not client results',
  views: [
    'Executive Summary',
    'Search and Content',
    'Locality',
    'Buyer Actions',
    'AI Visibility',
  ],
}

export const measurement = {
  eyebrow: 'MEASUREMENT THAT MATCHES THE WEBSITE',
  headline: 'Important shopper actions should not vanish between platforms.',
  supporting:
    'Authomotive helps dealership teams create a cleaner measurement layer across website content, embedded experiences, inventory pathways, conversion tools, and advertising requirements.',
  buyerActions: [
    'Research interactions',
    'Inventory handoffs',
    'Calls and forms',
    'Digital retailing',
    'Supported vendor experiences',
  ],
  destinations: [
    'Consistent event definitions',
    'GA4 and GTM',
    'Advertising measurement',
    'Authomotive Intelligence',
    'Future content and workflow decisions',
  ],
  implementationRows: [
    {
      title: 'Custom events',
      body: 'Meaningful shopper actions are defined as GA4 custom events with consistent, documented names so they can be trusted in reporting and used in advertising platforms.',
    },
    {
      title: 'ASC alignment',
      body: 'Where dealership event standards apply, event naming follows ASC-aligned taxonomy so measurement is consistent with broader automotive industry conventions.',
    },
    {
      title: 'Vendor signals',
      body: 'When a vendor exposes supported events, data-layer signals, or postMessage communication, those signals are captured and mapped into the measurement plan.',
    },
    {
      title: 'Iframe and handoff measurement',
      body: 'Interactions inside cross-origin iframes can only be measured when the vendor provides a supported integration. Where direct measurement is unavailable, we track the reliable handoff, focus, exit, or supported surrounding signal\u2014without inventing precision.',
    },
    {
      title: 'MNTN and advertising tags',
      body: 'Campaign and advertising tags\u2014including MNTN and platform conversion tags\u2014are mapped to meaningful actions rather than generic pageviews.',
    },
    {
      title: 'Validation and governance',
      body: 'Every implementation is validated, debugged, documented, and governed with clear naming rules so measurement stays dependable as the website changes.',
    },
  ],
}

export const howItWorks = {
  eyebrow: 'ONE WORKING PROCESS',
  headline: 'Managed from opportunity to evidence',
  supporting:
    'Each engagement follows one loop: diagnose the gap, build the work with a measurement plan attached, and let the evidence decide what happens next.',
  stages: [
    {
      number: '1',
      title: 'Find the opportunity',
      body: 'Review the dealership\u2019s content, visibility, locality, reporting, analytics, AI footprint, and measurement gaps.',
      evidence: 'What gap exists, and what does the available evidence tell us?',
    },
    {
      number: '2',
      title: 'Build the authority',
      body: 'Create the highest-value Authority Experiences and maintain the managed AI Discovery foundation.',
      evidence: 'Every page launches with its measurement plan already defined.',
    },
    {
      number: '3',
      title: 'Connect the signals',
      body: 'Implement and validate the measurement required to understand discovery, engagement, inventory movement, and important buyer actions.',
      evidence: 'What changed across visibility, engagement, locality, and meaningful actions?',
    },
    {
      number: '4',
      title: 'Report and improve',
      body: 'Explain what changed, connect the result to the work, and use the evidence to prioritize the next opportunity.',
      evidence: 'What should be expanded, adjusted, protected, or tested next?',
    },
  ],
  closing: 'One strategy. One measurement standard. One clearer view of what the website is doing.',
}

export const founder = {
  eyebrow: 'FOUNDER-LED. DEALERSHIP-SPECIALIZED.',
  headline: 'Built from inside the work.',
  copy:
    'Authomotive is led by Chris Gabriel, a technical SEO and web analytics strategist with years of hands-on dealership experience across content, organic visibility, GA4, GTM, reporting, measurement, and AI discovery. Strategy, implementation, and interpretation stay connected under one accountable lead.',
  supporting: 'Deep dealership experience without the layers of a conventional agency.',
}

export const managedFramework = {
  eyebrow: 'WHAT AN ENGAGEMENT INCLUDES',
  headline: 'One managed engagement, mapped to the three jobs.',
  inclusions: [
    'Dealership visibility and opportunity review',
    'Prioritized authority-content roadmap',
    'Search- and AI-ready Authority Experiences',
    'Managed AI Discovery page',
    'Interactive research elements where valuable',
    'Inventory and conversion pathways',
    'GTM, GA4, and custom-event improvements',
    'ASC-aligned event planning',
    'Advertising and campaign measurement support',
    'Unified monthly intelligence',
    'MoM, YoY, locality, engagement, and content analysis',
    'Identifiable AI referral and visibility observations',
    'Evidence-backed next-step recommendations',
    'Ongoing optimization and governance',
  ],
  callout:
    'Designed to work with the dealership website and vendor stack you already have. Exact implementation depends on platform and data access.',
}

export const idealFit = {
  headline: 'Authomotive is built for dealerships that know their website should be doing more.',
  signals: [
    'Your content looks similar to every competing dealer website',
    'Your reports provide numbers but not a clear explanation',
    'Important vendor or buyer actions are missing from analytics',
    'Your team wants a credible search and AI strategy grounded in measurable work',
  ],
  contrast:
    'Authomotive is not a shortcut, traffic guarantee, or replacement for the dealership\u2019s website provider. It is the authority and measurement layer that helps the existing website become more useful, visible, and accountable.',
}

export const finalCta = {
  eyebrow: 'START WITH THE WEBSITE YOU ALREADY HAVE',
  headline: 'See where your dealership is losing visibility, clarity, or measurable buyer intent.',
  supporting:
    'Request an Authomotive Opportunity Review. We will identify the strongest opening across authority content, AI discovery, reporting, and measurement.',
  concernOptions: [
    'Our content is not earning enough visibility',
    'We cannot clearly explain performance',
    'Important buyer actions are not being tracked',
    'Our AI discovery foundation is unclear',
    'We need the complete framework',
    'I am not sure yet',
  ],
  submitLabel: 'Request My Opportunity Review',
  confidence: 'No generic audit deck. No invented score. Just a focused review of the opportunity.',
  consent:
    'By submitting this form, you agree that Authomotive may contact you about this request.',
  successHeading: 'Your opportunity review request has been sent.',
  successCopy:
    'Thank you. Authomotive has received the details you provided and can now review the website and primary concern.',
  errorCopy:
    'We couldn\u2019t send your request. Your information is still here\u2014please try again in a moment.',
}
