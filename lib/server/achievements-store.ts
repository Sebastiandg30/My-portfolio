import { promises as fs } from 'fs'
import path from 'path'
import { defaultAchievements, normalizeAchievements, type Achievement } from '@/lib/achievements'

const LOCAL_FILE_PATH = path.join(process.cwd(), 'data', 'achievements.json')
const GITHUB_API = 'https://api.github.com'

const storageMode = (process.env.ACHIEVEMENTS_STORAGE ?? '').trim().toLowerCase()
const githubRepo = (process.env.GITHUB_REPO ?? '').trim()
const githubToken = (process.env.GITHUB_TOKEN ?? '').trim()
const githubBranch = (process.env.GITHUB_BRANCH ?? 'main').trim()
const githubFilePath = (process.env.GITHUB_ACHIEVEMENTS_PATH ?? 'data/achievements.json').trim()

function shouldUseGithubStorage(): boolean {
  if (storageMode === 'github') return true
  return Boolean(githubRepo && githubToken)
}

function githubHeaders() {
  return {
    Authorization: `Bearer ${githubToken}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
}

function githubContentsEndpoint(): string {
  return `${GITHUB_API}/repos/${githubRepo}/contents/${githubFilePath}`
}

async function readFromGitHub(): Promise<{ achievements: Achievement[]; sha?: string }> {
  if (!githubRepo || !githubToken) {
    throw new Error('GitHub storage is enabled but GITHUB_REPO or GITHUB_TOKEN is missing')
  }

  const response = await fetch(githubContentsEndpoint(), {
    headers: githubHeaders(),
    cache: 'no-store',
  })

  if (response.status === 404) {
    return { achievements: defaultAchievements }
  }

  if (!response.ok) {
    const details = await response.text()
    throw new Error(`GitHub read failed (${response.status}): ${details}`)
  }

  const payload = (await response.json()) as {
    content?: string
    encoding?: string
    sha?: string
  }

  const raw = payload.content
  if (!raw) {
    return { achievements: defaultAchievements, sha: payload.sha }
  }

  const decoded = Buffer.from(raw, payload.encoding === 'base64' ? 'base64' : 'utf8').toString('utf8')
  const parsed = JSON.parse(decoded)

  return {
    achievements: normalizeAchievements(parsed),
    sha: payload.sha,
  }
}

async function writeToGitHub(achievements: Achievement[]): Promise<void> {
  if (!githubRepo || !githubToken) {
    throw new Error('GitHub storage is enabled but GITHUB_REPO or GITHUB_TOKEN is missing')
  }

  const existing = await readFromGitHub()
  const content = `${JSON.stringify(achievements, null, 2)}\n`

  const body: {
    message: string
    content: string
    branch: string
    sha?: string
  } = {
    message: 'chore: update portfolio achievements',
    content: Buffer.from(content, 'utf8').toString('base64'),
    branch: githubBranch,
  }

  if (existing.sha) {
    body.sha = existing.sha
  }

  const response = await fetch(githubContentsEndpoint(), {
    method: 'PUT',
    headers: {
      ...githubHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const details = await response.text()
    throw new Error(`GitHub write failed (${response.status}): ${details}`)
  }
}

async function readFromLocalFile(): Promise<Achievement[]> {
  try {
    const raw = await fs.readFile(LOCAL_FILE_PATH, 'utf8')
    const parsed = JSON.parse(raw)
    return normalizeAchievements(parsed)
  } catch {
    await writeToLocalFile(defaultAchievements)
    return defaultAchievements
  }
}

async function writeToLocalFile(achievements: Achievement[]): Promise<void> {
  await fs.mkdir(path.dirname(LOCAL_FILE_PATH), { recursive: true })
  await fs.writeFile(LOCAL_FILE_PATH, `${JSON.stringify(achievements, null, 2)}\n`, 'utf8')
}

export async function loadAchievementsFromStore(): Promise<Achievement[]> {
  if (shouldUseGithubStorage()) {
    const { achievements } = await readFromGitHub()
    return achievements
  }

  return readFromLocalFile()
}

export async function saveAchievementsToStore(input: unknown): Promise<Achievement[]> {
  const normalized = normalizeAchievements(input)

  if (shouldUseGithubStorage()) {
    await writeToGitHub(normalized)
    return normalized
  }

  await writeToLocalFile(normalized)
  return normalized
}

export function storageModeLabel(): 'github' | 'local' {
  return shouldUseGithubStorage() ? 'github' : 'local'
}
