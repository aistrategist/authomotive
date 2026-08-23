export const siteConfig = {
  name: 'Authomotive',
  tagline: 'Get found. Guide buyers. Prove what works.',
  category: 'The managed authority and measurement framework for dealership websites',
}

/** One branded offer. Never compete with Website Review or other names. */
export const cta = {
  offer: 'Authomotive Opportunity Review',
  primary: 'Request My Opportunity Review',
  secondary: 'See the Authority System',
}

export const navLinks = [
  { label: 'What We Build', href: '#capabilities' },
  { label: 'Authority Experiences', href: '#authority-experiences' },
  { label: 'Reporting', href: '#reporting' },
  { label: 'Measurement', href: '#measurement' },
  { label: 'How It Works', href: '#how-it-works' },
] as const

export const hero = {
  brand: 'Authomotive',
  eyebrow: 'DEALERSHIP AUTHORITY · MADE MEASURABLE',
  headline: 'Your website should help buyers choose you.',
  emphasis: 'choose you',
  supporting:
    'Build better paths from shopper questions to inventory, measure what happens next, and use the evidence to decide what to improve.',
  primaryCta: 'Request My Opportunity Review',
  secondaryCta: 'See the Authority System',
  confidence: 'Works with the dealership website, agency, and vendor stack you already have.',
  question: 'Which three-row SUV fits my family, budget, and winter driving needs?',
  outcomes: [
    {
      id: 'earn',
      statement: 'Get Found',
      explanation: 'Capture real buyer questions.',
    },
    {
      id: 'guide',
      statement: 'Guide Buyers',
      explanation: 'Help shoppers compare and move toward inventory.',
    },
    {
      id: 'prove',
      statement: 'Prove What Works',
      explanation: 'Connect the journey to meaningful buyer actions.',
    },
  ],
}

export const discoveryToInventory = {
  eyebrow: 'KEEP THE PLATFORM · ADD THE STRATEGY',
  headline: 'Turn the website you already have into a connected buyer system.',
  supporting:
    'We build dealership-owned content for search, AI, and local discovery, connect it to inventory and buyer actions, then measure the signals that help decide what we improve next.',
  platforms: {
    lockup: ['Platform', 'Strategy', 'Layer'] as const,
    line: 'Your website, agency, and vendors stay.',
  },
  disciplines: [
    { id: 'seo', label: 'SEO', line: 'Get found for the question.', tone: 'accent' },
    { id: 'aeo', label: 'AEO', line: 'Be the answer AI can trust.', tone: 'proof' },
    { id: 'geo', label: 'GEO', line: 'Show up where they are.', tone: 'action' },
  ] as const,
  events: [
    { id: 'vsrp', label: 'VSRP', parent: 'seo' },
    { id: 'vdp', label: 'VDP', parent: 'seo' },
    { id: 'form', label: 'Form', parent: 'aeo' },
    { id: 'chat', label: 'Chat', parent: 'aeo' },
    { id: 'call', label: 'Call', parent: 'geo' },
    { id: 'lead', label: 'Lead', parent: 'geo' },
  ] as const,
}

export const industryGap = {
  eyebrow: 'THE GAP · DISCONNECTED WORK',
  headline: 'More tools. Less clarity. Too many missed signals.',
  supporting:
    'Content, inventory, analytics, advertising, vendor experiences, and AI visibility are often managed separately, so it is hard to know what buyers found, what helped them decide, and which actions mattered.',
  problems: [
    {
      title: 'Content that looks like every competing dealer page',
      body: 'Most dealership content exists to fill a URL. It repeats manufacturer language, answers little, and gives search systems few reasons to treat it as distinctive.',
    },
    {
      title: 'Reports that provide numbers without an explanation',
      body: 'One platform reports traffic, another rankings, another leads. The dealership receives numbers but cannot clearly explain what changed or what should happen next.',
    },
    {
      title: 'Buyer actions that disappear between platforms',
      body: 'Shoppers use embedded tools, vendor experiences, calls, forms, and digital retailing pathways, and many of those actions never reach standard reporting.',
    },
  ],
  closing: 'Authomotive connects those missing pieces into one measurable standard.',
}

export interface Capability {
  id: string
  verb: string
  brandedName: string
  line: string
  proofs: [string, string]
  nextLabel: string
  nextHref: string
}

export const capabilitySystem = {
  eyebrow: 'ONE AUTHORITY SYSTEM · THREE JOBS',
  headline: 'Follow the buyer through the system.',
  supporting:
    'Research creates new discovery opportunities. Shopper actions show what they care about. Verified signals show what happened next—and help decide what Authomotive improves next.',
  motto: 'DISCOVERY · ACTION · EVIDENCE',
  capabilities: [
    {
      id: 'get-found',
      verb: 'DISCOVERY',
      brandedName: 'Authority Experiences',
      line: 'Dealership-owned research answers real shopper questions, earns search and AI discovery, and gives buyers a useful path into inventory.',
      proofs: ['Earn the question.', 'Guide the buyer toward inventory.'],
      nextLabel: 'See one in action',
      nextHref: '#authority-experiences',
    },
    {
      id: 'track-matters',
      verb: 'ACTION',
      brandedName: 'Signal Architecture',
      line: 'Comparisons, inventory clicks, calls, forms, and retail actions become trackable events instead of disappearing between tools.',
      proofs: ['Capture meaningful buyer actions.', 'Verify the events before reporting.'],
      nextLabel: 'See what gets tracked',
      nextHref: '#measurement',
    },
    {
      id: 'know-working',
      verb: 'EVIDENCE',
      brandedName: 'Authomotive Intelligence',
      line: 'Verified buyer signals are read together to show what changed, what likely contributed, and what deserves attention next.',
      proofs: ['One connected monthly read.', 'Improve from evidence, not guesswork.'],
      nextLabel: 'See the monthly read',
      nextHref: '#reporting',
    },
  ] satisfies Capability[],
}

export const authorityTheater = {
  eyebrow: 'AUTHORITY EXPERIENCES · ONE PAGE · THREE LENSES',
  headline: 'See the same page through the shopper, discovery, and measurement lens.',
  supporting:
    'Choose a lens below to see how one Authority Experience helps a buyer make a decision, gives search and AI clearer information to understand, and captures the actions the dealership can measure. Those signals help us decide what to strengthen, expand, or build next.',
  lensCue: 'SELECT A LENS TO EXPLORE ↓',
  lensRead: 'One page. Three jobs. One measurable path from discovery to buyer action.',
  exampleTopic: 'Which Three-Row SUV Is Right for My Family?',
  views: [
    { id: 'shopper', label: 'What the shopper sees' },
    { id: 'discovery', label: 'What discovery systems understand' },
    { id: 'measurable', label: 'What the dealership can measure' },
  ],
}

export const aiDiscovery = {
  eyebrow: 'INCLUDED FOUNDATION WITHIN AUTHORITY EXPERIENCES',
  headline: 'Give AI a dependable source about your dealership.',
  supporting:
    'Every engagement includes a managed, dealership-owned AI Discovery page that organizes verified business information for people, search systems, and AI-assisted discovery.',
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
  eyebrow: 'AUTHOMOTIVE INTELLIGENCE · ONE MONTHLY TRUTH',
  headline: 'See what changed. Understand what likely contributed. Decide what comes next.',
  supporting:
    'Each month we read the dealership signals that matter: search and AI discovery, traffic mix, VSRP and VDP activity, leads, and local market movement. Then we explain what changed, what likely contributed, and what deserves attention next.',
  product: 'Authomotive Intelligence',
  sampleEyebrow: 'ILLUSTRATIVE INTELLIGENCE · SAMPLE DATA',
  reportKind: 'Monthly read',
  period: 'July 14 – August 10, 2026',
  executive: {
    label: 'EXECUTIVE SUMMARY',
    body: 'More shoppers found the dealership without searching for its name, and more of that activity continued into inventory. Organic, AI, and local discovery all increased, while VSRP views, VDP activity, and leads moved up with them. North-side showed the strongest local momentum, giving us a clear place to investigate and expand what is working.',
  },
  quote: 'The goal is not another dashboard. It is a monthly decision.',
  groups: [
    { id: 'traffic', label: 'Traffic' },
    { id: 'inventory', label: 'Inventory' },
    { id: 'outcomes', label: 'Outcomes' },
  ],
  metrics: [
    {
      id: 'organic',
      group: 'traffic',
      category: 'DISCOVERY',
      label: 'Organic traffic',
      value: '+18%',
      note: 'More non-brand shoppers',
      tone: 'accent',
      popout: {
        changed: 'More shoppers reached the site through unpaid search, led by non-branded discovery.',
        why: 'The dealership is earning demand beyond searches for its own name.',
        next: 'Protect the pages creating the lift and expand the buyer questions around them.',
      },
    },
    {
      id: 'total',
      group: 'traffic',
      category: 'TRAFFIC',
      label: 'Total traffic',
      value: '+9%',
      note: 'Broader site demand',
      tone: 'ink',
      popout: {
        changed: 'Overall observed website sessions increased across the period.',
        why: 'Organic growth is happening inside a site that is gaining demand overall, not simply taking share from shrinking traffic.',
        next: 'Compare the channel mix and confirm the additional visits are progressing into inventory and lead activity.',
      },
    },
    {
      id: 'ai',
      group: 'traffic',
      category: 'DISCOVERY',
      label: 'AI / LLM traffic',
      value: '+24%',
      note: 'Identifiable AI visits',
      tone: 'proof',
      popout: {
        changed: 'Identifiable visits from AI and LLM sources increased during the period.',
        why: 'More measurable discovery is beginning outside the traditional search-results page.',
        next: 'Find the landing pages earning those visits, strengthen the owned sources behind them, and track what those shoppers do next.',
      },
    },
    {
      id: 'local',
      group: 'traffic',
      category: 'LOCAL',
      label: 'Local traffic',
      value: '+11%',
      note: 'Maps + local discovery',
      tone: 'accent',
      popout: {
        changed: 'Traffic connected to maps and local discovery increased during the period.',
        why: 'More nearby shoppers are finding the dealership while making a location-sensitive decision.',
        next: 'Compare performance by market area and strengthen the locations, pages, and signals where visibility still has room to grow.',
      },
    },
    {
      id: 'vsrp',
      group: 'inventory',
      category: 'INVENTORY',
      label: 'VSRP results',
      value: '+14%',
      note: 'More inventory browsing',
      tone: 'proof',
      popout: {
        changed: 'More shoppers reached inventory search results through measured website pathways.',
        why: 'Discovery and research are progressing into actual vehicle shopping.',
        next: 'Identify the pages sending qualified shoppers into inventory and tighten the pathways that are underperforming.',
      },
    },
    {
      id: 'vdp',
      group: 'inventory',
      category: 'INVENTORY',
      label: 'VDP views',
      value: '+12%',
      note: 'Deeper vehicle interest',
      tone: 'proof',
      popout: {
        changed: 'Vehicle detail views increased as more shoppers moved deeper into available inventory.',
        why: 'More website activity is reaching individual vehicles rather than ending on informational pages.',
        next: 'Compare VSRP-to-VDP movement and identify which research and inventory pathways create the strongest vehicle interest.',
      },
    },
    {
      id: 'leads',
      group: 'outcomes',
      category: 'OUTCOME',
      label: 'Leads',
      value: '+7%',
      note: 'Calls, forms + handoffs',
      tone: 'action',
      popout: {
        changed: 'Observed calls, forms, and documented handoffs increased during the period.',
        why: 'Growth upstream is also reaching measurable outcome activity.',
        next: 'Trace those outcomes back to their landing pages and buyer pathways so the strongest sources can be protected and expanded.',
      },
    },
    {
      id: 'locality',
      group: 'outcomes',
      category: 'MARKET',
      label: 'Locality',
      value: 'North-side',
      note: 'Strongest market',
      tone: 'action',
      popout: {
        changed: 'North-side produced the strongest local visibility signal this period.',
        why: 'Market-level reporting shows where dealership visibility is strengthening and where opportunity remains.',
        next: 'Protect North-side momentum while investigating East corridor as the clearest expansion opportunity in this sample.',
      },
    },
  ],
  evidence: {
    observed: {
      kicker: 'ORGANIC · PAGE-LEVEL EXAMPLE',
      title: 'Sprinter Wheelbase Guide',
      context:
        'A commercial vehicle dealership’s Sprinter Wheelbase Guide existed before its July 14, 2026 authority and AI-discovery upgrade. In the following 28-day comparison, the page recorded:',
      metrics: [
        { id: 'clicks', label: 'WEB CLICKS', before: '4', after: '39' },
        { id: 'impressions', label: 'WEB IMPRESSIONS', before: '3,021', after: '10,429' },
        { id: 'ai', label: 'AI DISCOVERY IMPRESSIONS', before: '1,369', after: '3,377' },
      ],
      interpretation:
        'The guide was expanded around real wheelbase questions, comparison needs and a clearer path toward relevant inventory. The result does not prove a single cause, but it gives the dealership an observable asset and a credible before-and-after.',
      source: 'Google Search Console · 28-day comparison · Reporting through August 10, 2026',
      qualification:
        'Observed result from one anonymized dealership page. Outcomes vary by market, website and reporting period.',
    },
  },
  sourcesLine:
    'The monthly report is built from organic, total, AI/LLM, and local traffic; VSRP and VDP activity; leads; and locality. Depth depends on platform access, data quality, and the dealership’s existing measurement environment.',
}

export const fieldProof = {
  eyebrow: 'PROOF FROM THE FIELD · OBSERVED DEALERSHIP RESULT',
  headline: 'Research content can become a measurable discovery asset.',
  supporting:
    'In one dealership example, a research page upgrade was followed by materially higher search visibility, clicks, and identifiable AI discovery in the next 28-day period. We treat results like these as evidence to investigate—not proof of a single cause.',
  metrics: [
    { id: 'clicks', value: '+89%', label: 'Web clicks', tone: 'accent' },
    { id: 'impressions', value: '+93%', label: 'Web impressions', tone: 'proof' },
    { id: 'ai', value: '+286%', label: 'AI impressions', tone: 'action' },
  ],
  source:
    'Observed 28-day comparison · Google Search Console + AI discovery reporting · dealership anonymized',
} as const

export const measurement = {
  eyebrow: 'ASC · SIGNAL ARCHITECTURE',
  headline: 'Make sure the actions that matter actually show up.',
  supporting:
    'We structure and verify calls, forms, inventory, retail, and exposed vendor events—so reporting is built on signals we can trust.',
  stack: 'GTM · GA4 · ASC · QA · REPORTING',
  principle: 'No exposed signal? We don\u2019t invent one.',
  payoff:
    'The result: cleaner measurement and a monthly report built on website actions we can actually verify.',
  product: 'CAPTURE · LIVE',
  planKind: 'GTM / GA4',
  path: 'dataLayer → GTM → GA4',
  events: [
    {
      id: 'campaign',
      action: 'TV / CTV campaign visit',
      event: 'campaign_visit',
      kind: 'GA4',
      stamp: '00:02.1',
      pillar: 'MEDIA',
      payload: [
        { key: 'source', value: 'ctv' },
        { key: 'medium', value: 'tv' },
        { key: 'campaign', value: 'tagged' },
      ],
      meaning:
        'A measurable visit arrived from a tagged TV/CTV campaign. When that source is exposed, we preserve it in GA4 so it can be represented accurately in reporting.',
      path: 'campaign_visit · CAMPAIGN → GA4 → REPORT',
    },
    {
      id: 'select',
      action: 'Inventory explored',
      event: 'select_item',
      kind: 'GA4',
      stamp: '00:04.4',
      pillar: 'VSRP',
      payload: [
        { key: 'item_list_name', value: 'srp_used' },
        { key: 'item_id', value: 'unit' },
        { key: 'item_category', value: 'used' },
      ],
      meaning:
        'A shopper interacted with dealership inventory results. We confirm that inventory activity is captured consistently and available as a usable reporting signal.',
      path: 'select_item · WEBSITE → GA4 → REPORT',
    },
    {
      id: 'vdp',
      action: 'Vehicle viewed',
      event: 'view_item',
      kind: 'GA4',
      stamp: '00:07.4',
      pillar: 'VDP',
      payload: [
        { key: 'item_id', value: 'unit' },
        { key: 'item_category', value: 'used' },
        { key: 'item_list_name', value: 'srp_used' },
      ],
      meaning:
        'A shopper reached a specific vehicle detail page. We verify the inventory event is structured correctly so VDP activity can be read consistently in GA4 and reporting.',
      path: 'view_item · WEBSITE → GA4 → REPORT',
    },
    {
      id: 'cta',
      action: 'Buyer guide action',
      event: 'asc_cta_interaction',
      kind: 'ASC',
      stamp: '00:09.2',
      pillar: 'AUTHORITY',
      payload: [
        { key: 'element_text', value: 'compare' },
        { key: 'content_type', value: 'authority' },
        { key: 'event_action_result', value: 'success' },
      ],
      meaning:
        'A shopper interacted with an Authority Experience. We instrument that action so movement from research toward inventory can appear clearly in reporting.',
      path: 'asc_cta_interaction · AUTHORITY → GTM → GA4 → REPORT',
    },
    {
      id: 'retail',
      action: 'Digital retail started',
      event: 'asc_retail_process',
      kind: 'ASC',
      stamp: '00:11.0',
      pillar: 'BUYER ACTION',
      payload: [
        { key: 'flow_name', value: 'retail' },
        { key: 'flow_outcome', value: 'start' },
        { key: 'department', value: 'sales' },
      ],
      meaning:
        'A shopper entered a digital retail process. When the retail provider exposes that action, we preserve it as its own measurable event instead of blending it into a generic lead.',
      path: 'asc_retail_process · VENDOR → GTM → GA4 → REPORT',
    },
    {
      id: 'form',
      action: 'Form lead',
      event: 'asc_form_submission',
      kind: 'ASC',
      stamp: '00:12.6',
      pillar: 'LEADS',
      payload: [
        { key: 'form_name', value: 'contact' },
        { key: 'department', value: 'sales' },
        { key: 'comm_type', value: 'form' },
      ],
      meaning:
        'A shopper completed a dealership form. We confirm that the submission fires consistently and remains a clean, reportable lead event.',
      path: 'asc_form_submission · GTM → GA4 → REPORT',
    },
    {
      id: 'call',
      action: 'Phone lead',
      event: 'asc_click_to_call',
      kind: 'ASC',
      stamp: '00:14.2',
      pillar: 'LEADS',
      payload: [
        { key: 'comm_type', value: 'voice' },
        { key: 'department', value: 'sales' },
        { key: 'event_action_result', value: 'click' },
      ],
      meaning:
        'A shopper clicked a dealership phone number. We verify that the call event fires correctly, stays distinct from other lead actions, and is available in GA4 and reporting.',
      path: 'asc_click_to_call · GTM → GA4 → REPORT',
    },
    {
      id: 'comm',
      action: 'Chat / SMS lead',
      event: 'asc_comm_submission',
      kind: 'ASC',
      stamp: '00:16.1',
      pillar: 'LEADS',
      payload: [
        { key: 'comm_type', value: 'chat' },
        { key: 'department', value: 'sales' },
        { key: 'event_action_result', value: 'success' },
      ],
      meaning:
        'A shopper started a chat or SMS conversation. When the vendor exposes that signal, we map it into the event structure so it can be reported consistently.',
      path: 'asc_comm_submission · VENDOR → GTM → GA4 → REPORT',
    },
  ],
  cycle: [
    { id: 'define', n: '01', label: 'Define', lead: 'Name the actions that matter.' },
    { id: 'implement', n: '02', label: 'Implement', lead: 'Build the GTM + GA4 event structure.' },
    { id: 'verify', n: '03', label: 'Verify', lead: 'Confirm available signals fire correctly.' },
    { id: 'report', n: '04', label: 'Report', lead: 'Use verified events in the monthly read.' },
  ],
  handoffLabel: 'NEXT · THE WORKING RELATIONSHIP',
  handoffHref: '#engagement',
  handoffCta: 'See how the evidence becomes a monthly decision',
  handoffNote: 'The next decision becomes the next thing Authomotive builds and measures.',
}

export const howItWorks = {
  eyebrow: 'ONE WORKING PROCESS · OPPORTUNITY TO EVIDENCE',
  headline: 'One managed loop. From opportunity to evidence.',
  supporting:
    'Every engagement follows the same accountable loop: diagnose the gap, build the work with measurement attached, and let the evidence determine what comes next.',
  stages: [
    {
      number: '1',
      title: 'Find the Opportunity',
      body: 'Review the dealership\u2019s content, visibility, locality, reporting, analytics, AI footprint, and measurement gaps.',
      evidence: 'What gap exists, and what does the available evidence tell us?',
    },
    {
      number: '2',
      title: 'Build the Authority',
      body: 'Create the highest-value Authority Experiences and maintain the managed AI Discovery foundation.',
      evidence: 'Every page launches with its measurement plan already defined.',
    },
    {
      number: '3',
      title: 'Connect the Signals',
      body: 'Implement and validate the measurement required to understand discovery, engagement, inventory movement, and important buyer actions.',
      evidence: 'What changed across visibility, engagement, locality, and meaningful actions?',
    },
    {
      number: '4',
      title: 'Prove What Works.',
      body: 'Explain what changed, connect the result to the work, and use the evidence to prioritize the next opportunity.',
      evidence: 'What should be expanded, adjusted, protected, or tested next?',
    },
  ],
  closing: 'One strategy. Three connected jobs. One measurable standard.',
}

export const founder = {
  eyebrow: 'FOUNDER-LED · DEALERSHIP-SPECIALIZED',
  headline: 'One strategy. One accountable lead.',
  copy:
    'Authomotive is led by Chris Gabriel, a technical SEO and web analytics strategist with years of hands-on dealership experience. Strategy, implementation, and interpretation stay connected under one accountable lead.',
  supporting: 'Deep dealership experience without the layers of a conventional agency.',
}

export const managedFramework = {
  eyebrow: 'THE ENGAGEMENT · WHAT WORKS NEXT',
  headline: 'A working strategy, not another vendor handoff.',
  lead: 'Authomotive works alongside your website provider, agency, and vendors.',
  relation: 'One strategic lead. One connected system. One monthly working session.',
  proof:
    'Informed by experience across 90+ dealership websites. That experience shapes how we connect discovery, inventory, and buyer action.',
  beats: [
    {
      id: 'build',
      verb: 'BUILD',
      line: 'Improve the highest-value dealership-owned opportunity.',
    },
    {
      id: 'read',
      verb: 'READ',
      line: 'Connect discovery, inventory, and buyer signals.',
    },
    {
      id: 'decide',
      verb: 'DECIDE',
      line: 'Choose what gets protected, expanded, fixed, or built next.',
    },
  ],
  hub: {
    kicker: 'THE NEXT DECISION',
    title: 'Ongoing strategy',
    line: 'Every month follows the same rhythm: build the highest-value opportunity, measure what shoppers did, then decide what gets protected, expanded, fixed, or built next.',
  },
  works: [
    {
      id: 'authority',
      label: 'Authority Experiences',
      tone: 'accent',
      move: 'Expand the page that earned the question. Retire the one that did not.',
    },
    {
      id: 'pathways',
      label: 'Inventory pathways',
      tone: 'proof',
      move: 'Tighten the handoff from research into matching SRP and VDP pages.',
    },
    {
      id: 'discovery',
      label: 'AI Discovery',
      tone: 'action',
      move: 'Keep the owned source accurate so search and AI have one place to trust.',
    },
    {
      id: 'measurement',
      label: 'Connected measurement',
      tone: 'proof',
      move: 'Attach the event before the next launch. Read what shoppers actually did.',
    },
    {
      id: 'intelligence',
      label: 'Monthly intelligence',
      tone: 'action',
      move: 'What changed, what likely contributed, and what we build next.',
    },
  ],
  collab: {
    eyebrow: 'BUILT TO WORK WITH THE TEAM ALREADY IN PLACE',
    partners: [
      'Dealership leadership',
      'Website and inventory provider',
      'Marketing agency',
      'Advertising and technology vendors',
    ],
    supporting:
      'Authomotive adds the authority, measurement and decision-making layer. It does not require the dealership to replace the partners or platforms already supporting the business.',
  },
  fit:
    'A strong fit for dealerships that know the website should be producing more, but cannot yet connect content, visibility, inventory movement, and buyer behavior into one accountable plan.',
  ctaLabel: 'Start With My Dealership Website',
  ctaSupport:
    'Begin with one focused Opportunity Review, not a generic audit deck or invented score.',
}

export const idealFit = {
  headline: 'A strong fit when…',
  signals: [
    'Your content looks like every competing dealer website.',
    'Your reports provide numbers without a clear explanation.',
    'Important buyer and vendor actions are missing from analytics.',
    'Your team needs a credible search and AI strategy grounded in measurable work.',
  ],
  contrast:
    'Authomotive is not a shortcut, traffic guarantee, or replacement for the dealership\u2019s website provider. It is the authority and measurement layer that helps the existing website become more useful, visible, and accountable.',
}

export const finalCta = {
  eyebrow: 'ONE FOCUSED REVIEW · START WITH YOUR WEBSITE',
  headline: 'Find the strongest opportunity on your dealership website.',
  supporting:
    'We’ll look at where your dealership is being discovered, how shoppers reach inventory, and what your current measurement can actually prove—then identify the clearest place to start.',
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
    'We couldn\u2019t send your request. Your information is still here. Please try again in a moment.',
}
