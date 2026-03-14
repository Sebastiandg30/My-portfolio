export interface ContractExperienceItem {
  id: string
  role: string
  company: string
  location: string
  period: string
  bullets: string[]
  link?: string
}

export interface UpworkExperienceItem {
  id: string
  title: string
  period: string
  engagementType: string
  earned: string
  hourlyRate?: string
  hours?: string
  clientLocation: string
  clientReview: string
  reviewQuote?: string
  signals: string[]
  bullets: string[]
  proofImage?: string
  link?: string
}

export interface CertificationItem {
  id: string
  title: string
  issuer: string
  image: string
  verifyUrl: string
}

export interface SiteContent {
  profile: {
    headline: string
    intro: string
    locationLabel: string
    cvUrl: string
    upworkUrl: string
    linkedinUrl: string
    githubUrl: string
    email: string
  }
  quickSnapshot: {
    highlights: string[]
    coreStack: string[]
  }
  experience: {
    contractual: ContractExperienceItem[]
    upwork: UpworkExperienceItem[]
  }
  contact: {
    title: string
    description: string
  }
  certifications: CertificationItem[]
}

const defaultLinkedInCertUrl = 'https://www.linkedin.com/in/sebastiangomez30/details/certifications/'

export function createEmptyContractExperienceItem(
  id = createContentId('contract'),
): ContractExperienceItem {
  return {
    id,
    role: 'QA Engineer',
    company: '',
    location: '',
    period: '',
    bullets: [],
    link: '',
  }
}

export function createEmptyUpworkExperienceItem(
  id = createContentId('upwork'),
  link = '',
): UpworkExperienceItem {
  return {
    id,
    title: 'New Upwork project',
    period: '',
    engagementType: 'Fixed price',
    earned: '',
    hourlyRate: '',
    hours: '',
    clientLocation: '',
    clientReview: '',
    reviewQuote: '',
    signals: [],
    bullets: [],
    proofImage: '',
    link,
  }
}

export const defaultSiteContent: SiteContent = {
  profile: {
    headline: 'QA Engineer at the intersection of product, engineering, and users.',
    intro:
      'I build test coverage that catches real issues early, strengthen telemetry validation, and help teams ship with confidence.',
    locationLabel: 'Caracas, Venezuela (UTC-4)',
    cvUrl: '/Sebastian_Gomez_CV_2026.pdf',
    upworkUrl: 'https://www.upwork.com/freelancers/~01797400cf1c137fb1',
    linkedinUrl: 'https://www.linkedin.com/in/sebastiangomez30/',
    githubUrl: 'https://github.com/Sebastiandg30',
    email: 'sebasdgg3001@gmail.com',
  },
  quickSnapshot: {
    highlights: [
      'Product, engineering, and user-centered QA execution',
      'API testing, telemetry/tracking QA, automation, and data validation',
    ],
    coreStack: [
      'Cypress',
      'Selenium',
      'Playwright',
      'Postman',
      'Python',
      'JavaScript',
      'SQL',
      'GitHub Actions',
      'Jira',
    ],
  },
  experience: {
    contractual: [
      {
        id: 'contract-usa-today',
        role: 'QA Engineer',
        company: 'USA Today',
        location: 'United States',
        period: 'Nov 2025 - Present',
        bullets: [
          'Validated telemetry and tracking behavior using URL parameters, cookies, and QSP checks.',
          'Executed manual cross-browser testing in staging across national and local-market sites.',
          'Expanded coverage in existing Postman API collections and Cypress UI suites.',
        ],
      },
      {
        id: 'contract-3mit',
        role: 'QA Engineer',
        company: '3MIT',
        location: 'Venezuela',
        period: 'Apr 2025 - Present',
        bullets: [
          'Tested finance-heavy Odoo ERP modules for tax-compliant accounting behavior.',
          'Built and maintained a broad regression suite for accounting and business-critical flows.',
          'Standardized QA strategy and integrated automation in CI/CD workflows.',
        ],
      },
      {
        id: 'contract-salmonlabs',
        role: 'QA Engineer',
        company: 'SalmonLabs (Contract)',
        location: 'United States',
        period: 'Jul 2025 - Aug 2025',
        bullets: [
          'Built repeatable lead pipelines from scraping/API ingestion to QC and final delivery.',
          'Integrated ChatGPT API checks to automate script output review and remove manual bottlenecks.',
          'Cleaned and normalized large CSV/XLSX datasets for reliable downstream use.',
        ],
      },
      {
        id: 'contract-netforemost',
        role: 'QA Engineer',
        company: 'Netforemost',
        location: 'Panama',
        period: 'Aug 2024 - Apr 2025',
        bullets: [
          'Built a reusable Selenium framework for critical user flows and integrated it into CI/CD.',
          'Led API testing with Postman to detect backend issues earlier in the cycle.',
          'Applied TDD practices to improve maintainability and reduce recurring defects.',
        ],
      },
      {
        id: 'contract-uemura',
        role: 'Manual QA',
        company: 'Uemura',
        location: 'Spain',
        period: 'Jan 2024 - Aug 2024',
        bullets: [
          'Created the QA process from scratch, including strategy, documentation, and test coverage.',
          'Validated key CMS and database-related flows to reduce production regressions.',
        ],
      },
    ],
    upwork: [
      {
        id: 'upwork-digital-qe',
        title: 'Digital QE (Quality Engineering) Specialist, Test Cases, Test Scripts',
        period: 'Nov 11, 2025 - Present',
        engagementType: 'Hourly',
        earned: '$10,944 earned',
        hourlyRate: '$18/hr',
        hours: '608 hours',
        clientLocation: 'Private client',
        clientReview: 'Job in progress',
        signals: ['Quality engineering', 'Test cases', 'Test scripts'],
        bullets: [
          'Long-running hourly engagement focused on structured QE work, test case design, and test script creation.',
          'Supports repeatable validation coverage through documented scenarios and disciplined execution.',
        ],
        proofImage: '/upwork-previews/digital-qe.svg',
        link: 'https://www.upwork.com/freelancers/~01797400cf1c137fb1',
      },
      {
        id: 'upwork-saas-dashboard',
        title: 'QA Tester Needed for SaaS Dashboard (Backend Aware)',
        period: 'Feb 20, 2026 - Mar 8, 2026',
        engagementType: 'Fixed price',
        earned: '$220 earned',
        clientLocation: 'Private client',
        clientReview: 'No feedback given',
        signals: ['SaaS dashboard', 'Backend aware', 'Private engagement'],
        bullets: [
          'Validated a backend-aware SaaS dashboard engagement with attention to product flows and system behavior.',
          'Completed a private fixed-price project where the public job description remains hidden on Upwork.',
        ],
        proofImage: '/upwork-previews/saas-dashboard.svg',
        link: 'https://www.upwork.com/freelancers/~01797400cf1c137fb1',
      },
      {
        id: 'upwork-linux-vps',
        title: 'Linux VPS deployment plan + estimate',
        period: 'Feb 27, 2026 - Mar 2, 2026',
        engagementType: 'Fixed price',
        earned: '$25 earned',
        clientLocation: 'Canada · Abbotsford',
        clientReview: '5.0 client review',
        reviewQuote:
          'Sebastian was very thorough in his report, understood the job well and went above and beyond to deliver project requirements as discussed.',
        signals: [
          'Committed to Quality',
          'Solution Oriented',
          'Clear Communicator',
          'Accountable for Outcomes',
        ],
        bullets: [
          'Reviewed deployment options for a data extraction product moving beyond Vercel constraints.',
          'Delivered a detailed Linux VPS recommendation and estimate that went beyond the initial brief.',
        ],
        proofImage: '/upwork-previews/linux-vps.svg',
        link: 'https://www.upwork.com/freelancers/~01797400cf1c137fb1',
      },
      {
        id: 'upwork-testing-mobile',
        title: 'Testing Mobile App',
        period: 'Jan 16, 2026 - Jan 18, 2026',
        engagementType: 'Fixed price',
        earned: '$32 earned',
        clientLocation: 'United States · San Francisco',
        clientReview: '5.0 client review',
        reviewQuote:
          'It was great working with Sebastian, he was very proactive, communicated results very well, and made sure everything is as expected. I would definitely work with him again.',
        signals: ['Collaborative', 'Committed to Quality', 'Clear Communicator'],
        bullets: [
          'Tested mobile app behavior against expected flows and communicated findings proactively.',
          'Delivered clear QA results that earned direct praise for communication and follow-through.',
        ],
        proofImage: '/upwork-previews/testing-mobile-app.svg',
        link: 'https://www.upwork.com/freelancers/~01797400cf1c137fb1',
      },
      {
        id: 'upwork-whop-discord',
        title: 'WHOP Storefront and Discord Integration Tester',
        period: 'Oct 1, 2025 - Oct 2, 2025',
        engagementType: 'Fixed price',
        earned: '$25 earned',
        clientLocation: 'Australia · Birchgrove',
        clientReview: '5.0 client review',
        reviewQuote: 'Nice to work with him',
        signals: ['WHOP storefront', 'Discord integration', 'Subscription testing'],
        bullets: [
          'Tested storefront subscription flows and Discord integration behavior for a WHOP setup.',
          'Checked end-to-end functionality across subscription steps and user experience touchpoints.',
        ],
        proofImage: '/upwork-previews/whop-discord.svg',
        link: 'https://www.upwork.com/freelancers/~01797400cf1c137fb1',
      },
      {
        id: 'upwork-manual-android',
        title: 'Manual Mobile App Tester (Android)',
        period: 'Oct 6, 2025 - Oct 9, 2025',
        engagementType: 'Fixed price',
        earned: '$5 earned',
        clientLocation: 'United Arab Emirates · Abu Dhabi',
        clientReview: '5.0 client review',
        reviewQuote: 'Great work',
        signals: ['Android', 'Manual testing', 'UX validation'],
        bullets: [
          'Performed manual Android testing for app usability and core flow validation.',
          'Delivered concise QA feedback that resulted in a 5.0 review.',
        ],
        proofImage: '/upwork-previews/manual-android.svg',
        link: 'https://www.upwork.com/freelancers/~01797400cf1c137fb1',
      },
      {
        id: 'upwork-freelancer-tool',
        title: 'App Tester for Freelancer Productivity Tool',
        period: 'Oct 18, 2025 - Oct 22, 2025',
        engagementType: 'Fixed price',
        earned: '$5 earned',
        clientLocation: 'Germany · Bremen',
        clientReview: '5.0 client review',
        signals: ['Freelancer workflow', 'Productivity tool', 'Usability testing'],
        bullets: [
          'Tested a freelancer productivity tool and checked critical delivery-related user flows.',
          'Reported issues affecting usability and day-to-day workflow clarity.',
        ],
        proofImage: '/upwork-previews/freelancer-tool.svg',
        link: 'https://www.upwork.com/freelancers/~01797400cf1c137fb1',
      },
    ],
  },
  contact: {
    title: 'Need stronger release confidence?',
    description:
      'If your team is shipping fast and quality is becoming risky, I can help you build a QA system that scales with your product.',
  },
  certifications: [
    {
      id: 'cert-cs50x',
      title: "CS50's Intro to Computer Science",
      issuer: 'Harvard University',
      image: '/HarvardX CS50x.jpg',
      verifyUrl: defaultLinkedInCertUrl,
    },
    {
      id: 'cert-cs50p',
      title: "CS50's Intro to Python",
      issuer: 'Harvard University',
      image: '/HarvardX CS50P.jpg',
      verifyUrl: defaultLinkedInCertUrl,
    },
    {
      id: 'cert-testing-masterclass',
      title: 'Software Testing MasterClass',
      issuer: 'Udemy',
      image: '/TestingMC (1) (3).jpg',
      verifyUrl: defaultLinkedInCertUrl,
    },
  ],
}

function normalizeText(value: unknown, fallback = ''): string {
  if (typeof value !== 'string') return fallback
  const trimmed = value.trim()
  return trimmed || fallback
}

function normalizeStringArray(value: unknown, fallback: string[] = []): string[] {
  if (!Array.isArray(value)) return [...fallback]
  const clean = value
    .map(item => (typeof item === 'string' ? item.trim() : ''))
    .filter(Boolean)
  return clean
}

function cloneContractExperienceItem(item: ContractExperienceItem): ContractExperienceItem {
  return {
    ...item,
    bullets: [...item.bullets],
  }
}

function cloneUpworkExperienceItem(item: UpworkExperienceItem): UpworkExperienceItem {
  return {
    ...item,
    signals: [...item.signals],
    bullets: [...item.bullets],
  }
}

function cloneCertificationItem(item: CertificationItem): CertificationItem {
  return {
    ...item,
  }
}

function normalizeContractExperienceItem(
  value: unknown,
  fallback: ContractExperienceItem,
): ContractExperienceItem {
  const source = (typeof value === 'object' && value !== null ? value : {}) as Record<string, unknown>

  return {
    id: normalizeText(source.id, fallback.id),
    role: normalizeText(source.role, fallback.role),
    company: normalizeText(source.company, fallback.company),
    location: normalizeText(source.location, fallback.location),
    period: normalizeText(source.period, fallback.period),
    bullets: normalizeStringArray(source.bullets, fallback.bullets),
    link: normalizeText(source.link, fallback.link ?? '') || undefined,
  }
}

function normalizeUpworkExperienceItem(
  value: unknown,
  fallback: UpworkExperienceItem,
): UpworkExperienceItem {
  const source = (typeof value === 'object' && value !== null ? value : {}) as Record<string, unknown>
  const legacyCompany = normalizeText(source.company, '')
  const legacyRole = normalizeText(source.role, '')
  const legacyLocation = normalizeText(source.location, '')
  const inferredEngagementType =
    typeof source.hourlyRate === 'string' || typeof source.hours === 'string'
      ? 'Hourly'
      : fallback.engagementType

  return {
    id: normalizeText(source.id, fallback.id),
    title: normalizeText(source.title, legacyCompany || fallback.title),
    period: normalizeText(source.period, fallback.period),
    engagementType: normalizeText(source.engagementType, inferredEngagementType),
    earned: normalizeText(source.earned, fallback.earned),
    hourlyRate: normalizeText(source.hourlyRate, fallback.hourlyRate ?? '') || undefined,
    hours: normalizeText(source.hours, fallback.hours ?? '') || undefined,
    clientLocation: normalizeText(source.clientLocation, legacyLocation || fallback.clientLocation),
    clientReview: normalizeText(
      source.clientReview,
      legacyRole ? `${legacyRole} delivery` : fallback.clientReview,
    ),
    reviewQuote: normalizeText(source.reviewQuote, fallback.reviewQuote ?? '') || undefined,
    signals: normalizeStringArray(source.signals, fallback.signals),
    bullets: normalizeStringArray(source.bullets, fallback.bullets),
    proofImage: normalizeText(source.proofImage, fallback.proofImage ?? '') || undefined,
    link: normalizeText(source.link, fallback.link ?? '') || undefined,
  }
}

function normalizeCertificationItem(value: unknown, fallback: CertificationItem): CertificationItem {
  const source = (typeof value === 'object' && value !== null ? value : {}) as Record<string, unknown>

  return {
    id: normalizeText(source.id, fallback.id),
    title: normalizeText(source.title, fallback.title),
    issuer: normalizeText(source.issuer, fallback.issuer),
    image: normalizeText(source.image, fallback.image),
    verifyUrl: normalizeText(source.verifyUrl, fallback.verifyUrl),
  }
}

function normalizeContractExperienceList(
  value: unknown,
  fallback: ContractExperienceItem[],
): ContractExperienceItem[] {
  if (!Array.isArray(value)) return fallback.map(cloneContractExperienceItem)

  return value.map((item, index) => {
    const fallbackItem = fallback[index] ?? createEmptyContractExperienceItem()
    return normalizeContractExperienceItem(item, fallbackItem)
  })
}

function normalizeUpworkExperienceList(
  value: unknown,
  fallback: UpworkExperienceItem[],
): UpworkExperienceItem[] {
  if (!Array.isArray(value)) return fallback.map(cloneUpworkExperienceItem)

  return value.map((item, index) => {
    const fallbackItem =
      fallback[index] ?? createEmptyUpworkExperienceItem(undefined, defaultSiteContent.profile.upworkUrl)
    return normalizeUpworkExperienceItem(item, fallbackItem)
  })
}

function normalizeCertificationList(value: unknown, fallback: CertificationItem[]): CertificationItem[] {
  if (!Array.isArray(value)) return fallback.map(cloneCertificationItem)

  return value.map((item, index) => {
    const fallbackItem = fallback[index] ?? {
      id: createContentId('certification'),
      title: '',
      issuer: '',
      image: '',
      verifyUrl: defaultLinkedInCertUrl,
    }
    return normalizeCertificationItem(item, fallbackItem)
  })
}

export function normalizeSiteContent(input: unknown): SiteContent {
  const source = (typeof input === 'object' && input !== null ? input : {}) as Record<string, unknown>
  const profile = (typeof source.profile === 'object' && source.profile !== null ? source.profile : {}) as Record<string, unknown>
  const quickSnapshot =
    typeof source.quickSnapshot === 'object' && source.quickSnapshot !== null
      ? (source.quickSnapshot as Record<string, unknown>)
      : {}
  const experience =
    typeof source.experience === 'object' && source.experience !== null
      ? (source.experience as Record<string, unknown>)
      : {}
  const contact = (typeof source.contact === 'object' && source.contact !== null ? source.contact : {}) as Record<string, unknown>

  return {
    profile: {
      headline: normalizeText(profile.headline, defaultSiteContent.profile.headline),
      intro: normalizeText(profile.intro, defaultSiteContent.profile.intro),
      locationLabel: normalizeText(profile.locationLabel, defaultSiteContent.profile.locationLabel),
      cvUrl: normalizeText(profile.cvUrl, defaultSiteContent.profile.cvUrl),
      upworkUrl: normalizeText(profile.upworkUrl, defaultSiteContent.profile.upworkUrl),
      linkedinUrl: normalizeText(profile.linkedinUrl, defaultSiteContent.profile.linkedinUrl),
      githubUrl: normalizeText(profile.githubUrl, defaultSiteContent.profile.githubUrl),
      email: normalizeText(profile.email, defaultSiteContent.profile.email),
    },
    quickSnapshot: {
      highlights: normalizeStringArray(quickSnapshot.highlights, defaultSiteContent.quickSnapshot.highlights),
      coreStack: normalizeStringArray(quickSnapshot.coreStack, defaultSiteContent.quickSnapshot.coreStack),
    },
    experience: {
      contractual: normalizeContractExperienceList(
        experience.contractual,
        defaultSiteContent.experience.contractual,
      ),
      upwork: normalizeUpworkExperienceList(experience.upwork, defaultSiteContent.experience.upwork),
    },
    contact: {
      title: normalizeText(contact.title, defaultSiteContent.contact.title),
      description: normalizeText(contact.description, defaultSiteContent.contact.description),
    },
    certifications: normalizeCertificationList(
      source.certifications,
      defaultSiteContent.certifications,
    ),
  }
}

export function createContentId(prefix: string): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`
  }
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}
