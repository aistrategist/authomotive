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
    'Authority Experiences, connected measurement, and a monthly read in plain English. Shoppers move from the question to inventory, and you can see what drove the action.',
  primaryCta: 'Request My Opportunity Review',
  secondaryCta: 'See the Authority System',
  confidence: 'Works with the dealership website and vendor stack you already have.',
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
  headline: 'We work on the website you already have.',
  supporting:
    'Shoppers still research a need first. SEO, AEO, and GEO bolt onto the site, agency, and vendors already in place. The actions below are what you can actually read.',
  platforms: {
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
  headline: 'One system. Three jobs.',
  supporting: 'We build the pages that earn the question, connect the buyer actions, and hand you the next move.',
  motto: 'BUILD · CONNECT · DECIDE',
  capabilities: [
    {
      id: 'get-found',
      verb: 'BUILD',
      brandedName: 'Authority Experiences',
      line: 'Shoppers should find you for the question they actually asked, then land on a page that helps them choose a vehicle.',
      proofs: ['Answers the real question.', 'Walks them toward live inventory.'],
      nextLabel: 'See one in action',
      nextHref: '#authority-experiences',
    },
    {
      id: 'know-working',
      verb: 'DECIDE',
      brandedName: 'Authomotive Intelligence',
      line: 'At month-end you should know what changed, what caused it, and what to build next.',
      proofs: ['One story, not five dashboards.', 'Protect, expand, or fix.'],
      nextLabel: 'See the monthly read',
      nextHref: '#reporting',
    },
    {
      id: 'track-matters',
      verb: 'CONNECT',
      brandedName: 'Signal Architecture',
      line: 'If a shopper called, compared, or started a deal, that action has to show up.',
      proofs: ['Events before the launch.', 'The report can tell the truth.'],
      nextLabel: 'See what gets tracked',
      nextHref: '#measurement',
    },
  ] satisfies Capability[],
}

export const authorityTheater = {
  eyebrow: 'AUTHORITY EXPERIENCES · DISCOVERY AND GUIDANCE',
  headline: 'Pages that get found, then move buyers.',
  supporting:
    'The strongest dealership content earns discovery, answers the real question, helps the buyer evaluate a decision, and creates a useful path to inventory.',
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
  headline: 'See what changed. Understand why. Decide what comes next.',
  supporting:
    'Each month we read the dealership numbers that matter: traffic mix, AI and local discovery, VSRP and VDP activity, leads, and locality. Then we say what moved, why it moved, and what to do next.',
  product: 'Authomotive Intelligence',
  reportKind: 'Monthly SEO & discovery report',
  period: 'July 14 – August 10, 2026',
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
      label: 'Organic traffic',
      value: '+18%',
      note: 'Non-branded discovery',
      tone: 'accent',
      popout: {
        changed: 'Non-branded organic rose. Winter-driving and wheelbase clusters carried the period.',
        why: 'Two Authority Experiences launched around real shopper questions, with inventory pathways attached.',
        next: 'Expand the winter-driving cluster that is already earning discovery.',
      },
    },
    {
      id: 'total',
      group: 'traffic',
      label: 'Total traffic',
      value: '+9%',
      note: 'All observed sessions',
      tone: 'ink',
      popout: {
        changed: 'Total sessions rose, but slower than organic. The mix improved.',
        why: 'Organic lift sat beside stable paid and other sessions. The total is mix, not a trophy.',
        next: 'Hold the mix. Do not chase the total if organic and leads are the story.',
      },
    },
    {
      id: 'ai',
      group: 'traffic',
      label: 'AI / LLM traffic',
      value: '+24%',
      note: 'Identifiable referrals',
      tone: 'proof',
      popout: {
        changed: 'Identifiable AI referrals and observed visibility both moved up.',
        why: 'Authority pages were structured for AI discovery. We report observed footprint, not invented journeys.',
        next: 'Keep the pages that are being cited. Do not claim complete AI attribution.',
      },
    },
    {
      id: 'local',
      group: 'traffic',
      label: 'Local traffic',
      value: '+11%',
      note: 'Maps and local pack',
      tone: 'accent',
      popout: {
        changed: 'Local-pack and maps-driven sessions strengthened on the north side.',
        why: 'Locality pages and listing consistency supported the same questions the Authority Experiences answer.',
        next: 'Protect the north-side cluster. Watch the east corridor as the next locality bet.',
      },
    },
    {
      id: 'vsrp',
      group: 'inventory',
      label: 'VSRP results',
      value: '+14%',
      note: 'Inventory search views',
      tone: 'proof',
      popout: {
        changed: 'Vehicle search result views rose with the research-to-inventory handoffs.',
        why: 'Authority Experiences pointed shoppers into matching inventory instead of a generic lot.',
        next: 'Keep the handoff from research to the right VSRP filters. Do not send every click to the homepage.',
      },
    },
    {
      id: 'vdp',
      group: 'inventory',
      label: 'VDP views',
      value: '+12%',
      note: 'Vehicle detail views',
      tone: 'proof',
      popout: {
        changed: 'Vehicle detail views followed VSRP. More shoppers reached a specific unit.',
        why: 'Cleaner pathway tracking connected research clicks to the VDP they actually opened.',
        next: 'Read VDP against leads. Views that do not become a call or form are the next gap.',
      },
    },
    {
      id: 'leads',
      group: 'outcomes',
      label: 'Leads',
      value: '+7%',
      note: 'Calls, forms, and handoffs',
      tone: 'action',
      popout: {
        changed: 'Leads rose, but not at the same pace as VDP views.',
        why: 'Pathway tracking connected VDP to calls and forms. The mobile form-start gap is still visible.',
        next: 'Close the mobile form-start gap so inventory activity becomes a lead action.',
      },
    },
    {
      id: 'locality',
      group: 'outcomes',
      label: 'Locality',
      value: 'North-side',
      note: 'Strongest market this period',
      tone: 'action',
      popout: {
        changed: 'North-side is the strength. East corridor is the opening.',
        why: 'Local visibility and the Authority Experiences landed in the same market, not spread thin.',
        next: 'Double down north-side. Brief the east corridor as the next locality page, not a statewide push.',
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

export const measurement = {
  eyebrow: 'ASC · DATA LAYER',
  headline: 'Track the actions the report is built on.',
  supporting:
    'Shopper behavior, inventory activity, and leads become named events in one plan. Calls fire as asc_click_to_call. Forms fire as asc_form_submission. They stay separate hits, not a generic lead blob, so the monthly report can read what actually happened.',
  product: 'CAPTURE · LIVE',
  planKind: 'GTM / GA4',
  path: 'dataLayer → GTM → GA4',
  events: [
    {
      id: 'vsrp',
      action: 'VSRP views',
      event: 'view_item_list',
      kind: 'GA4',
      stamp: '00:02.1',
      pillar: 'VSRP results',
      payload: [
        { key: 'item_list_name', value: 'srp_used' },
        { key: 'item_list_id', value: 'inventory' },
        { key: 'item_category', value: 'used' },
      ],
      popout: {
        capture: 'Vehicle search result views fire as GA4 ecommerce so inventory search is named the same way across the site.',
        destination: 'Maps to the VSRP results pillar in the monthly report.',
        limit: 'Filter state is recorded when the data layer exposes it. We do not guess hidden inventory queries.',
      },
    },
    {
      id: 'select',
      action: 'Inventory selection',
      event: 'select_item',
      kind: 'GA4',
      stamp: '00:04.4',
      pillar: 'VSRP results',
      payload: [
        { key: 'item_list_name', value: 'srp_used' },
        { key: 'item_id', value: 'unit' },
        { key: 'item_category', value: 'used' },
        { key: 'index', value: '3' },
      ],
      popout: {
        capture: 'A unit selected from the list is a named ecommerce hit, so VSRP-to-VDP movement can be read.',
        destination: 'Stays with VSRP results, then read against the following view_item.',
        limit: 'We capture the exposed list context. We do not reconstruct a shopper’s full filter path.',
      },
    },
    {
      id: 'vdp',
      action: 'VDP views',
      event: 'view_item',
      kind: 'GA4',
      stamp: '00:07.4',
      pillar: 'VDP views',
      payload: [
        { key: 'item_id', value: 'unit' },
        { key: 'item_category', value: 'used' },
        { key: 'item_list_name', value: 'srp_used' },
      ],
      popout: {
        capture: 'Vehicle detail views are named events with unit-level context, so research-to-inventory handoffs can be read.',
        destination: 'Maps to VDP views, then read against leads.',
        limit: 'Third-party VDP embeds are measured when the vendor exposes a supported signal.',
      },
    },
    {
      id: 'cta',
      action: 'Authority and research CTAs',
      event: 'asc_cta_interaction',
      kind: 'ASC',
      stamp: '00:09.2',
      pillar: 'Organic traffic',
      payload: [
        { key: 'element_text', value: 'compare' },
        { key: 'content_type', value: 'authority' },
        { key: 'event_action_result', value: 'success' },
      ],
      popout: {
        capture: 'Guide reads, comparison tools, and Authority Experience CTAs fire as asc_cta_interaction, not generic pageviews.',
        destination: 'Feeds organic and content movement in Authomotive Intelligence, and can be used in advertising platforms.',
        limit: 'We do not invent anonymous AI-assisted journeys. Identifiable referrals and observed visibility only.',
      },
    },
    {
      id: 'retail',
      action: 'Digital retailing',
      event: 'asc_retail_process',
      kind: 'ASC',
      stamp: '00:11.0',
      pillar: 'Leads',
      payload: [
        { key: 'flow_name', value: 'retail' },
        { key: 'flow_outcome', value: 'start' },
        { key: 'department', value: 'sales' },
      ],
      popout: {
        capture: 'Digital retailing progress is captured as asc_retail_process when the pathway is on-site or the vendor exposes a handoff.',
        destination: 'Counts toward leads and inventory activity, not a vanity session.',
        limit: 'Cross-origin retail iframes are measured only with a supported integration. Otherwise we track the handoff, focus, or exit.',
      },
    },
    {
      id: 'form',
      action: 'Form submission',
      event: 'asc_form_submission',
      kind: 'ASC',
      stamp: '00:12.6',
      pillar: 'Leads',
      payload: [
        { key: 'form_name', value: 'contact' },
        { key: 'department', value: 'sales' },
        { key: 'event_action_result', value: 'success' },
        { key: 'comm_type', value: 'form' },
      ],
      popout: {
        capture: 'Form completes fire as asc_form_submission. Department lives in a parameter, not a second key event.',
        destination: 'Maps to Leads. Campaign tags, including MNTN, attach to this conversion, not a pageview.',
        limit: 'Do not also mark asc_form_submission_sales or _service as key events. Those twins fire with the parent and double-count.',
      },
    },
    {
      id: 'call',
      action: 'Click to call',
      event: 'asc_click_to_call',
      kind: 'ASC',
      stamp: '00:14.2',
      pillar: 'Leads',
      payload: [
        { key: 'comm_type', value: 'voice' },
        { key: 'department', value: 'sales' },
        { key: 'event_action_result', value: 'click' },
        { key: 'link_url', value: 'tel' },
      ],
      popout: {
        capture: 'Tap-to-call is its own hit. A click is not a completed conversation, and it is not assumed to be a sales call.',
        destination: 'Maps to Leads when the call platform can confirm the outcome. Ads attach to the conversion we can trust.',
        limit: 'Call tracking depends on the dealership’s voice vendor. We map the reliable conversion, not a reconstructed conversation. Department twins stay parameters, not a second key event.',
      },
    },
    {
      id: 'comm',
      action: 'Chat and SMS',
      event: 'asc_comm_submission',
      kind: 'ASC',
      stamp: '00:16.1',
      pillar: 'Leads',
      payload: [
        { key: 'comm_type', value: 'chat' },
        { key: 'department', value: 'sales' },
        { key: 'event_action_result', value: 'success' },
      ],
      popout: {
        capture: 'Chat and SMS completes fire as asc_comm_submission when the vendor pushes a supported signal.',
        destination: 'Lands in Leads once the handoff is documented, on the same plan as forms and calls.',
        limit: 'If the vendor does not expose a signal, we do not invent one. We track the surrounding handoff only.',
      },
    },
  ],
  cycle: [
    { id: 'observe', n: '01', label: 'Observe', lead: 'See what shoppers actually do.' },
    { id: 'connect', n: '02', label: 'Connect', lead: 'Capture the actions that matter.' },
    { id: 'improve', n: '03', label: 'Improve', lead: 'Use the evidence to guide the work.' },
    { id: 'report', n: '04', label: 'Report', lead: 'Decide what comes next.' },
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
  lead:
    'Authomotive works alongside your website provider, agency, and vendors. Implementation, authority work, measurement, and the monthly decision stay connected, so the next move is obvious.',
  proof:
    'Drawn from work across 90+ dealership websites. This is what actually moves discovery, inventory, and buyer action.',
  hub: {
    kicker: 'THE NEXT DECISION',
    title: 'Ongoing strategy',
    line: 'What works this month becomes the next thing we build, correct, or expand.',
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
    'Start with an Authomotive Opportunity Review. We will identify the clearest opening across authority content, AI discovery, reporting, and measurement.',
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
