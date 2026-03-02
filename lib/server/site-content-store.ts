import { promises as fs } from 'fs'
import path from 'path'
import { defaultSiteContent, normalizeSiteContent, type SiteContent } from '@/lib/site-content'

const LOCAL_FILE_PATH = path.join(process.cwd(), 'data', 'site-content.json')
const GITHUB_API = 'https://api.github.com'

const storageMode = (process.env.ACHIEVEMENTS_STORAGE ?? '').trim().toLowerCase()
const githubRepo = (process.env.GITHUB_REPO ?? '').trim()
const githubToken = (process.env.GITHUB_TOKEN ?? '').trim()
const githubBranch = (process.env.GITHUB_BRANCH ?? 'main').trim()
const githubFilePath = (process.env.GITHUB_SITE_CONTENT_PATH ?? 'data/site-content.json').trim()

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

function withBranchRef(url: string): string {
  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}ref=${encodeURIComponent(githubBranch)}`
}

function extractCurrentShaFromError(details: string): string | undefined {
  const match = details.match(/\bis\s+([a-f0-9]{40})\s+but\s+expected\b/i)
  return match?.[1]
}

async function fetchGitHubFileSha(): Promise<string | undefined> {
  const url = withBranchRef(githubContentsEndpoint())
  const response = await fetch(url, {
    headers: githubHeaders(),
    cache: 'no-store',
  })

  if (!response.ok) return undefined

  const payload = (await response.json()) as { sha?: string }
  return payload.sha
}

async function readFromGitHub(): Promise<{ siteContent: SiteContent; sha?: string }> {
  if (!githubRepo || !githubToken) {
    throw new Error('GitHub storage is enabled but GITHUB_REPO or GITHUB_TOKEN is missing')
  }

  const response = await fetch(withBranchRef(githubContentsEndpoint()), {
    headers: githubHeaders(),
    cache: 'no-store',
  })

  if (response.status === 404) {
    return { siteContent: defaultSiteContent }
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
    return { siteContent: defaultSiteContent, sha: payload.sha }
  }

  const decoded = Buffer.from(raw, payload.encoding === 'base64' ? 'base64' : 'utf8').toString('utf8')
  const parsed = JSON.parse(decoded)

  return {
    siteContent: normalizeSiteContent(parsed),
    sha: payload.sha,
  }
}

async function writeToGitHub(siteContent: SiteContent): Promise<void> {
  if (!githubRepo || !githubToken) {
    throw new Error('GitHub storage is enabled but GITHUB_REPO or GITHUB_TOKEN is missing')
  }

  const existing = await readFromGitHub()
  const content = `${JSON.stringify(siteContent, null, 2)}\n`

  const body: {
    message: string
    content: string
    branch: string
    sha?: string
  } = {
    message: 'chore: update portfolio site content',
    content: Buffer.from(content, 'utf8').toString('base64'),
    branch: githubBranch,
  }

  if (existing.sha) {
    body.sha = existing.sha
  }

  const MAX_RETRIES = 4

  let lastStatus = 500
  let lastDetails = 'Unknown GitHub write error'

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    const response = await fetch(githubContentsEndpoint(), {
      method: 'PUT',
      headers: {
        ...githubHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (response.ok) return

    lastStatus = response.status
    lastDetails = await response.text()

    const shouldRefreshSha = response.status === 409 || response.status === 422
    if (!shouldRefreshSha) break

    const shaFromError = extractCurrentShaFromError(lastDetails)
    const latestSha = shaFromError ?? (await fetchGitHubFileSha())
    if (!latestSha || latestSha === body.sha) break

    body.sha = latestSha
  }

  throw new Error(`GitHub write failed (${lastStatus}): ${lastDetails}`)
}

async function readFromLocalFile(): Promise<SiteContent> {
  try {
    const raw = await fs.readFile(LOCAL_FILE_PATH, 'utf8')
    const parsed = JSON.parse(raw)
    return normalizeSiteContent(parsed)
  } catch {
    await writeToLocalFile(defaultSiteContent)
    return defaultSiteContent
  }
}

async function writeToLocalFile(siteContent: SiteContent): Promise<void> {
  await fs.mkdir(path.dirname(LOCAL_FILE_PATH), { recursive: true })
  await fs.writeFile(LOCAL_FILE_PATH, `${JSON.stringify(siteContent, null, 2)}\n`, 'utf8')
}

export async function loadSiteContentFromStore(): Promise<SiteContent> {
  if (shouldUseGithubStorage()) {
    const { siteContent } = await readFromGitHub()
    return siteContent
  }

  return readFromLocalFile()
}

export async function saveSiteContentToStore(input: unknown): Promise<SiteContent> {
  const normalized = normalizeSiteContent(input)

  if (shouldUseGithubStorage()) {
    await writeToGitHub(normalized)
    return normalized
  }

  await writeToLocalFile(normalized)
  return normalized
}
