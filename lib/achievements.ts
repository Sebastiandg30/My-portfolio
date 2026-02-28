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
    role: 'QA Engineer',
    period: '2024',
    challenge:
      'There was no framework, no structure, and no repeatable QA flow across multiple active projects. Bugs were discovered by chance and quality depended on manual effort.',
    action:
      'I designed and implemented a Selenium framework from zero with reusable components, organized suites, and a structure that could support different domains without restarting from scratch.',
    impact:
      'Testing moved from reactive to systematic execution, with faster regression cycles and more stable releases.',
    tags: ['Selenium', 'Java', 'Regression Testing', 'Test Strategy'],
    proofUrl: 'https://www.upwork.com/freelancers/~01797400cf1c137fb1',
  },
  {
    id: 'ai-validation-cleaned-leads',
    title: 'AI-powered validation that cleaned thousands of leads',
    company: 'Salmonlabs',
    role: 'QA Engineer',
    period: '2025',
    challenge:
      'Thousands of scraped lead profiles arrived with missing fields, invalid photos, and contradictory data. Manual review was too slow and too expensive to scale.',
    action:
      'I built an automated validation pipeline in Python and integrated the ChatGPT API to check profile quality, classify inconsistencies, and route flagged records for focused review.',
    impact:
      'Bad leads were filtered before reaching sales operations, improving confidence in campaign data and reducing manual verification time.',
    tags: ['Python', 'Data Validation', 'OpenAI API', 'Automation'],
    proofUrl: 'https://www.upwork.com/freelancers/~01797400cf1c137fb1',
  },
  {
    id: 'invoice-validation-caught-missed-bugs',
    title: 'Automated invoice validation that caught what manual testing missed',
    company: '3MIT',
    role: 'QA Engineer',
    period: '2025 - 2026',
    challenge:
      'Invoice records looked correct on the UI but failed accounting balance checks under specific combinations of taxes, currencies, and line items.',
    action:
      'I implemented a unit-test suite covering hundreds of invoice scenarios with detailed failure traces to pinpoint mismatches quickly.',
    impact:
      'High-risk accounting defects were detected before staging, reducing investigation time and preventing client-facing incidents.',
    tags: ['Python', 'Unit Testing', 'Financial QA', 'Automation'],
    proofUrl: 'https://www.upwork.com/freelancers/~01797400cf1c137fb1',
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

function normalizeProofUrl(value: unknown): string | undefined {
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
  const proofUrl = normalizeProofUrl(source.proofUrl ?? source.link)

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
  }
}

export function normalizeAchievements(input: unknown): Achievement[] {
  if (!Array.isArray(input)) {
    return defaultAchievements
  }

  const normalized = input.map((item, index) => normalizeAchievement(item, index))
  return normalized.length > 0 ? normalized : defaultAchievements
}
