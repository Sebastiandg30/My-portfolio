export interface ExperienceItem {
  id: string
  role: string
  company: string
  location: string
  period: string
  bullets: string[]
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
    contractual: ExperienceItem[]
    upwork: ExperienceItem[]
  }
  contact: {
    title: string
    description: string
  }
  certifications: CertificationItem[]
}

const defaultLinkedInCertUrl = 'https://www.linkedin.com/in/sebastiangomez30/details/certifications/'

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
        id: 'upwork-framework',
        role: 'QA Engineer',
        company: 'Automation Framework Build',
        location: 'Upwork',
        period: '2024',
        bullets: [
          'Built a reusable Selenium automation framework from zero for multi-project use.',
          'Defined structure, reusable components, and regression strategy for long-term maintainability.',
        ],
        link: 'https://www.upwork.com/freelancers/~01797400cf1c137fb1',
      },
      {
        id: 'upwork-lead-pipeline',
        role: 'QA Engineer',
        company: 'Lead Quality Automation',
        location: 'Upwork',
        period: '2025',
        bullets: [
          'Automated quality control pipeline for large lead datasets with API and AI-assisted checks.',
          'Removed manual bottlenecks and improved consistency of delivered datasets.',
        ],
        link: 'https://www.upwork.com/freelancers/~01797400cf1c137fb1',
      },
      {
        id: 'upwork-finance-validation',
        role: 'QA Engineer',
        company: 'Financial Invoice Validation',
        location: 'Upwork',
        period: '2025 - 2026',
        bullets: [
          'Built automated scenario-based validation for finance-critical invoice flows.',
          'Reduced time to detect accounting mismatches and prevented defects from reaching staging.',
        ],
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

function cloneExperienceItem(item: ExperienceItem): ExperienceItem {
  return {
    ...item,
    bullets: [...item.bullets],
  }
}

function cloneCertificationItem(item: CertificationItem): CertificationItem {
  return {
    ...item,
  }
}

function normalizeExperienceItem(value: unknown, fallback: ExperienceItem): ExperienceItem {
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

function normalizeExperienceList(value: unknown, fallback: ExperienceItem[]): ExperienceItem[] {
  if (!Array.isArray(value)) return fallback.map(cloneExperienceItem)

  return value.map((item, index) => {
    const fallbackItem = fallback[index] ?? {
      id: createContentId('experience'),
      role: 'QA Engineer',
      company: '',
      location: '',
      period: '',
      bullets: [],
      link: '',
    }
    return normalizeExperienceItem(item, fallbackItem)
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
      contractual: normalizeExperienceList(
        experience.contractual,
        defaultSiteContent.experience.contractual,
      ),
      upwork: normalizeExperienceList(experience.upwork, defaultSiteContent.experience.upwork),
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
