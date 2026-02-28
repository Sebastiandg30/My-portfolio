export interface Achievement {
  id: string
  title: string
  company: string
  role: string
  period: string
  challenge: string
  action: string
  impact: string
  tags: string[]
  proofUrl?: string
  previewVideo?: string
}

interface LegacyAchievement {
  id?: string
  title?: string
  role?: string
  tags?: string[]
  problem?: string
  solution?: string
  result?: string
}

const DEFAULT_COMPANY = 'Confidential Client'
const DEFAULT_PERIOD = '2025'

export const defaultAchievements: Achievement[] = [
  {
    id: 'test-framework-order-chaos',
    title: 'Test framework built from scratch that brought order to chaos',
    company: 'Uemura',
    role: 'Manual QA',
    period: '2024',
    challenge:
      'The team had no QA structure, no reusable tests, and no clear process across multiple active projects.',
    action:
      'I built a Selenium framework from scratch with reusable components, organized suites, and a repeatable structure for multi-domain products.',
    impact:
      'Testing stopped being ad hoc and became a predictable process that improved release quality and debugging speed.',
    tags: ['Selenium', 'Java', 'Regression Testing', 'Framework Design'],
    proofUrl: 'https://www.upwork.com/freelancers/~01797400cf1c137fb1',
    previewVideo: '/Selenium.mp4',
  },
  {
    id: 'ai-validation-cleaned-leads',
    title: 'AI-powered validation pipeline for lead quality control',
    company: 'SalmonLabs',
    role: 'QA Engineer',
    period: '2025',
    challenge:
      'Large lead datasets arrived with missing fields, duplicates, and inconsistent records that blocked reliable delivery.',
    action:
      'I implemented an API/scraping -> parsing -> quality control pipeline and integrated ChatGPT API checks to automate review and remove manual bottlenecks.',
    impact:
      'Delivery became faster and more consistent, with better data quality and stronger SLA compliance.',
    tags: ['Python', 'Data Validation', 'OpenAI API', 'Automation'],
    proofUrl: 'https://www.upwork.com/freelancers/~01797400cf1c137fb1',
    previewVideo: '/Postman.mp4',
  },
  {
    id: 'invoice-validation-caught-missed-bugs',
    title: 'Automated invoice validation for finance-critical workflows',
    company: '3MIT',
    role: 'QA Engineer',
    period: '2025 - 2026',
    challenge:
      'Accounting flows produced silent invoice mismatches under specific combinations of taxes, currencies, and line items.',
    action:
      'I created a unit-test suite with high scenario coverage and failure traces to identify mismatches quickly in ERP accounting logic.',
    impact:
      'High-risk accounting defects were detected before staging, reducing incident risk and investigation time.',
    tags: ['Python', 'Unit Testing', 'Financial QA', 'ERP Testing'],
    proofUrl: 'https://www.upwork.com/freelancers/~01797400cf1c137fb1',
    previewVideo: '/Jmeter.mp4',
  },
]

function createFallbackId(index: number): string {
  return `achievement-${index + 1}`
}

function normalizeText(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value.trim()
}

function normalizeTags(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  const tags = value
    .map(tag => (typeof tag === 'string' ? tag.trim() : ''))
    .filter(Boolean)
  return Array.from(new Set(tags))
}

function normalizeUrl(value: unknown): string | undefined {
  const url = normalizeText(value)
  if (!url) return undefined
  return url
}

export function createAchievementId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

export function createEmptyAchievement(): Achievement {
  return {
    id: createAchievementId(),
    title: '',
    company: '',
    role: 'QA Engineer',
    period: '',
    challenge: '',
    action: '',
    impact: '',
    tags: [],
    proofUrl: '',
    previewVideo: '',
  }
}

export function normalizeAchievement(input: unknown, index: number): Achievement {
  const source = (typeof input === 'object' && input !== null ? input : {}) as Record<string, unknown> &
    LegacyAchievement

  const title = normalizeText(source.title) || 'Untitled achievement'
  const id = normalizeText(source.id) || createFallbackId(index)
  const role = normalizeText(source.role) || 'QA Engineer'
  const tags = normalizeTags(source.tags)

  const challenge =
    normalizeText(source.challenge) ||
    normalizeText(source.problem) ||
    'Challenge details pending.'

  const action =
    normalizeText(source.action) ||
    normalizeText(source.solution) ||
    'Implementation details pending.'

  const impact =
    normalizeText(source.impact) ||
    normalizeText(source.result) ||
    'Impact details pending.'

  const company = normalizeText(source.company) || DEFAULT_COMPANY
  const period = normalizeText(source.period) || normalizeText(source.date) || DEFAULT_PERIOD
  const proofUrl = normalizeUrl(source.proofUrl ?? source.link)
  const previewVideo = normalizeUrl(source.previewVideo ?? source.videoUrl ?? source.video)

  return {
    id,
    title,
    company,
    role,
    period,
    challenge,
    action,
    impact,
    tags,
    ...(proofUrl ? { proofUrl } : {}),
    ...(previewVideo ? { previewVideo } : {}),
  }
}

export function normalizeAchievements(input: unknown): Achievement[] {
  if (!Array.isArray(input)) {
    return defaultAchievements
  }

  const normalized = input.map((item, index) => normalizeAchievement(item, index))
  return normalized.length > 0 ? normalized : defaultAchievements
}
