'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Eye,
  Loader2,
  LogOut,
  Plus,
  Save,
  Trash2,
} from 'lucide-react'
import {
  createAchievementId,
  defaultAchievements,
  normalizeAchievements,
  type Achievement,
} from '@/lib/achievements'
import {
  createContentId,
  defaultSiteContent,
  normalizeSiteContent,
  type CertificationItem,
  type ExperienceItem,
  type SiteContent,
} from '@/lib/site-content'

const SESSION_KEY = 'sg_admin_password'

type SaveState = 'idle' | 'saving' | 'saved' | 'error'
type AdminTab =
  | 'achievements'
  | 'profile'
  | 'snapshot'
  | 'experience'
  | 'certifications'
  | 'contact'
type ExperienceGroupKey = keyof SiteContent['experience']

const FIELD_CLASS =
  'w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm font-normal text-slate-800 outline-none focus:border-[var(--teal)]'
const LABEL_CLASS = 'space-y-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500'

const TABS: Array<{ id: AdminTab; label: string }> = [
  { id: 'achievements', label: 'Achievements' },
  { id: 'profile', label: 'Profile & Links' },
  { id: 'snapshot', label: 'Quick Snapshot' },
  { id: 'experience', label: 'Experience' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'contact', label: 'Contact' },
]

function toTags(value: string): string[] {
  return value
    .split(',')
    .map(item => item.trim())
    .filter(Boolean)
}

function toLineList(value: string): string[] {
  return value
    .split('\n')
    .map(item => item.trim())
    .filter(Boolean)
}

function toFlexibleList(value: string): string[] {
  return value
    .split(/[\n,]/)
    .map(item => item.trim())
    .filter(Boolean)
}

function toMultilineText(items: string[]): string {
  return items.join('\n')
}

function moveArrayItem<T>(items: T[], index: number, direction: 'up' | 'down'): T[] {
  const target = direction === 'up' ? index - 1 : index + 1
  if (target < 0 || target >= items.length) return items

  const next = [...items]
  const [item] = next.splice(index, 1)
  next.splice(target, 0, item)
  return next
}

function extractErrorMessage(value: unknown): string {
  if (value instanceof Error) return value.message
  return 'Unexpected save error'
}

async function checkPassword(password: string): Promise<boolean> {
  const response = await fetch('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  })

  return response.ok
}

async function fetchAchievements(): Promise<Achievement[]> {
  const response = await fetch('/api/achievements', { cache: 'no-store' })
  if (!response.ok) {
    return defaultAchievements
  }

  const payload = (await response.json()) as { achievements?: unknown }
  return normalizeAchievements(payload.achievements)
}

async function saveAchievements(password: string, achievements: Achievement[]): Promise<void> {
  const response = await fetch('/api/achievements', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-password': password,
    },
    body: JSON.stringify({ achievements }),
  })

  if (!response.ok) {
    const payload = (await response.json()) as { error?: string }
    throw new Error(payload.error ?? 'Unable to save achievements')
  }
}

async function fetchSiteContent(): Promise<SiteContent> {
  const response = await fetch('/api/site-content', { cache: 'no-store' })
  if (!response.ok) {
    return defaultSiteContent
  }

  const payload = (await response.json()) as { siteContent?: unknown }
  return normalizeSiteContent(payload.siteContent)
}

async function saveSiteContent(password: string, siteContent: SiteContent): Promise<void> {
  const response = await fetch('/api/site-content', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-password': password,
    },
    body: JSON.stringify({ siteContent }),
  })

  if (!response.ok) {
    const payload = (await response.json()) as { error?: string }
    throw new Error(payload.error ?? 'Unable to save site content')
  }
}

function LoginScreen({
  onSuccess,
}: {
  onSuccess: (password: string) => void
}) {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    setLoading(true)
    setError('')

    try {
      const isValid = await checkPassword(password)
      if (!isValid) {
        setError('Incorrect password.')
        return
      }

      onSuccess(password)
    } catch {
      setError('Unable to validate password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-transparent px-4 py-12">
      <div className="mx-auto w-full max-w-md rounded-3xl border border-black/10 bg-white/80 p-8 shadow-sm backdrop-blur">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-black"
        >
          <ArrowLeft className="h-4 w-4" /> Back to portfolio
        </Link>

        <p className="section-label">Admin Access</p>
        <h1 className="mt-2 font-display text-4xl leading-[1.22]">Portfolio CMS</h1>
        <p className="mt-3 text-sm text-slate-600">
          Sign in to update portfolio content without editing code.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          <input
            type="password"
            value={password}
            onChange={event => setPassword(event.target.value)}
            placeholder="Admin password"
            className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--teal)]"
            autoFocus
          />
          {error ? <p className="text-xs font-medium text-red-600">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--night)] px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {loading ? 'Checking...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}

function Dashboard({
  password,
  onLogout,
}: {
  password: string
  onLogout: () => void
}) {
  const [activeTab, setActiveTab] = useState<AdminTab>('achievements')
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [siteContent, setSiteContent] = useState<SiteContent>(defaultSiteContent)
  const [openAchievementId, setOpenAchievementId] = useState<string | null>(null)
  const [openExperienceId, setOpenExperienceId] = useState<string | null>(null)
  const [openCertificationId, setOpenCertificationId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const [saveMessage, setSaveMessage] = useState('')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const persistLockRef = useRef(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const [achievementsData, siteContentData] = await Promise.all([
          fetchAchievements(),
          fetchSiteContent(),
        ])

        setAchievements(achievementsData)
        setSiteContent(siteContentData)
        setHasUnsavedChanges(false)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const markDirty = () => {
    setHasUnsavedChanges(true)
    if (saveState !== 'saving') {
      setSaveState('idle')
      setSaveMessage('')
    }
  }

  const updateSite = (updater: (current: SiteContent) => SiteContent) => {
    setSiteContent(current => updater(current))
    markDirty()
  }

  const updateProfileField = (key: keyof SiteContent['profile'], value: string) => {
    updateSite(current => ({
      ...current,
      profile: {
        ...current.profile,
        [key]: value,
      },
    }))
  }

  const updateContactField = (key: keyof SiteContent['contact'], value: string) => {
    updateSite(current => ({
      ...current,
      contact: {
        ...current.contact,
        [key]: value,
      },
    }))
  }

  const updateQuickSnapshotList = (
    key: keyof SiteContent['quickSnapshot'],
    value: string,
    parser: (input: string) => string[],
  ) => {
    updateSite(current => ({
      ...current,
      quickSnapshot: {
        ...current.quickSnapshot,
        [key]: parser(value),
      },
    }))
  }

  const updateExperienceItem = (
    group: ExperienceGroupKey,
    id: string,
    patch: Partial<ExperienceItem>,
  ) => {
    updateSite(current => ({
      ...current,
      experience: {
        ...current.experience,
        [group]: current.experience[group].map(item =>
          item.id === id ? { ...item, ...patch } : item,
        ),
      },
    }))
  }

  const addExperienceItem = (group: ExperienceGroupKey) => {
    const next: ExperienceItem = {
      id: createContentId(group === 'contractual' ? 'contract' : 'upwork'),
      role: 'QA Engineer',
      company: '',
      location: '',
      period: '',
      bullets: [],
      link: group === 'upwork' ? siteContent.profile.upworkUrl : '',
    }

    updateSite(current => ({
      ...current,
      experience: {
        ...current.experience,
        [group]: [next, ...current.experience[group]],
      },
    }))

    setOpenExperienceId(`${group}:${next.id}`)
  }

  const removeExperienceItem = (group: ExperienceGroupKey, id: string) => {
    if (!confirm('Delete this experience item?')) return

    updateSite(current => ({
      ...current,
      experience: {
        ...current.experience,
        [group]: current.experience[group].filter(item => item.id !== id),
      },
    }))

    setOpenExperienceId(current => (current === `${group}:${id}` ? null : current))
  }

  const moveExperienceItem = (
    group: ExperienceGroupKey,
    index: number,
    direction: 'up' | 'down',
  ) => {
    updateSite(current => ({
      ...current,
      experience: {
        ...current.experience,
        [group]: moveArrayItem(current.experience[group], index, direction),
      },
    }))
  }

  const updateCertificationItem = (id: string, patch: Partial<CertificationItem>) => {
    updateSite(current => ({
      ...current,
      certifications: current.certifications.map(item =>
        item.id === id ? { ...item, ...patch } : item,
      ),
    }))
  }

  const addCertification = () => {
    const next: CertificationItem = {
      id: createContentId('cert'),
      title: '',
      issuer: '',
      image: '',
      verifyUrl:
        siteContent.profile.linkedinUrl ||
        'https://www.linkedin.com/in/sebastiangomez30/details/certifications/',
    }

    updateSite(current => ({
      ...current,
      certifications: [next, ...current.certifications],
    }))

    setOpenCertificationId(next.id)
  }

  const removeCertification = (id: string) => {
    if (!confirm('Delete this certification?')) return

    updateSite(current => ({
      ...current,
      certifications: current.certifications.filter(item => item.id !== id),
    }))

    setOpenCertificationId(current => (current === id ? null : current))
  }

  const moveCertification = (index: number, direction: 'up' | 'down') => {
    updateSite(current => ({
      ...current,
      certifications: moveArrayItem(current.certifications, index, direction),
    }))
  }

  const updateAchievement = (id: string, patch: Partial<Achievement>) => {
    setAchievements(items =>
      items.map(item => (item.id === id ? { ...item, ...patch } : item)),
    )
    markDirty()
  }

  const addAchievement = () => {
    const next: Achievement = {
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

    setAchievements(items => [next, ...items])
    setOpenAchievementId(next.id)
    markDirty()
  }

  const removeAchievement = (id: string) => {
    if (!confirm('Delete this achievement?')) return

    setAchievements(items => items.filter(item => item.id !== id))
    setOpenAchievementId(current => (current === id ? null : current))
    markDirty()
  }

  const moveAchievement = (index: number, direction: 'up' | 'down') => {
    setAchievements(items => moveArrayItem(items, index, direction))
    markDirty()
  }

  const persist = async () => {
    if (persistLockRef.current) return
    persistLockRef.current = true
    setSaveState('saving')
    setSaveMessage('')

    try {
      // Save sequentially to reduce write contention when GitHub storage is enabled.
      let siteContentError: unknown = null
      let achievementsError: unknown = null

      try {
        await saveSiteContent(password, siteContent)
      } catch (error) {
        siteContentError = error
      }

      try {
        await saveAchievements(password, achievements)
      } catch (error) {
        achievementsError = error
      }

      if (
        !siteContentError &&
        !achievementsError
      ) {
        setSaveState('saved')
        setSaveMessage('Changes published successfully.')
        setHasUnsavedChanges(false)
        setTimeout(() => setSaveState('idle'), 1800)
        return
      }

      const failures: string[] = []
      if (siteContentError) {
        failures.push(`Site content: ${extractErrorMessage(siteContentError)}`)
      }
      if (achievementsError) {
        failures.push(`Achievements: ${extractErrorMessage(achievementsError)}`)
      }

      setSaveState('error')
      setSaveMessage(failures.join(' | '))
    } finally {
      persistLockRef.current = false
    }
  }

  const renderExperienceGroup = (
    group: ExperienceGroupKey,
    title: string,
    description: string,
  ) => {
    const items = siteContent.experience[group]

    return (
      <section className="space-y-4 rounded-2xl border border-black/10 bg-white/75 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-display text-2xl leading-[1.22]">{title}</p>
            <p className="text-xs text-slate-500">{description}</p>
          </div>

          <button
            type="button"
            onClick={() => addExperienceItem(group)}
            className="inline-flex items-center gap-2 rounded-lg border border-black/15 bg-white px-3 py-2 text-sm font-semibold"
          >
            <Plus className="h-4 w-4" /> Add item
          </button>
        </div>

        {items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-black/15 bg-white px-4 py-4 text-sm text-slate-500">
            No items yet.
          </div>
        ) : null}

        <div className="space-y-3">
          {items.map((item, index) => {
            const expanded = openExperienceId === `${group}:${item.id}`
            return (
              <article key={item.id} className="rounded-xl border border-black/10 bg-white/90 p-4">
                <div className="flex items-start justify-between gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenExperienceId(current =>
                        current === `${group}:${item.id}` ? null : `${group}:${item.id}`,
                      )
                    }
                    className="text-left"
                  >
                    <p className="font-display text-xl leading-[1.22]">
                      {item.role || 'Untitled role'}
                    </p>
                    <p className="mt-1 text-xs font-mono-custom uppercase tracking-[0.16em] text-slate-500">
                      {item.company || 'Company pending'} · {item.period || 'Period pending'}
                    </p>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveExperienceItem(group, index, 'up')}
                      className="rounded-md border border-black/10 bg-white p-1.5 text-slate-600"
                      aria-label="Move up"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveExperienceItem(group, index, 'down')}
                      className="rounded-md border border-black/10 bg-white p-1.5 text-slate-600"
                      aria-label="Move down"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeExperienceItem(group, item.id)}
                      className="rounded-md border border-black/10 bg-white p-1.5 text-red-600"
                      aria-label="Delete item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {expanded ? (
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <label className={LABEL_CLASS}>
                      Role
                      <input
                        type="text"
                        value={item.role}
                        onChange={event =>
                          updateExperienceItem(group, item.id, { role: event.target.value })
                        }
                        className={FIELD_CLASS}
                      />
                    </label>

                    <label className={LABEL_CLASS}>
                      Company
                      <input
                        type="text"
                        value={item.company}
                        onChange={event =>
                          updateExperienceItem(group, item.id, { company: event.target.value })
                        }
                        className={FIELD_CLASS}
                      />
                    </label>

                    <label className={LABEL_CLASS}>
                      Location
                      <input
                        type="text"
                        value={item.location}
                        onChange={event =>
                          updateExperienceItem(group, item.id, { location: event.target.value })
                        }
                        className={FIELD_CLASS}
                      />
                    </label>

                    <label className={LABEL_CLASS}>
                      Period
                      <input
                        type="text"
                        value={item.period}
                        onChange={event =>
                          updateExperienceItem(group, item.id, { period: event.target.value })
                        }
                        className={FIELD_CLASS}
                      />
                    </label>

                    <label className={`${LABEL_CLASS} md:col-span-2`}>
                      Bullets (one per line)
                      <textarea
                        rows={4}
                        value={toMultilineText(item.bullets)}
                        onChange={event =>
                          updateExperienceItem(group, item.id, {
                            bullets: toLineList(event.target.value),
                          })
                        }
                        className={FIELD_CLASS}
                      />
                    </label>

                    <label className={`${LABEL_CLASS} md:col-span-2`}>
                      Link (optional)
                      <input
                        type="text"
                        value={item.link ?? ''}
                        onChange={event =>
                          updateExperienceItem(group, item.id, {
                            link: event.target.value,
                          })
                        }
                        className={FIELD_CLASS}
                      />
                    </label>
                  </div>
                ) : null}
              </article>
            )
          })}
        </div>
      </section>
    )
  }

  return (
    <div className="min-h-screen bg-transparent">
      <header className="sticky top-0 z-30 border-b border-black/10 bg-[color:rgba(251,247,241,0.95)] backdrop-blur">
        <div className="mx-auto flex min-h-16 w-full max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <div>
            <p className="section-label">Admin</p>
            <p className="font-display text-xl leading-[1.28]">Manage Portfolio Content</p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-black/15 bg-white px-3 py-2 text-xs font-semibold"
            >
              <Eye className="h-3.5 w-3.5" /> Preview
            </Link>
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-2 rounded-lg border border-black/15 bg-white px-3 py-2 text-xs font-semibold"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8">
        <section className="rounded-2xl border border-black/10 bg-white/75 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-700">Content manager</p>
              <p className="text-xs text-slate-500">
                Achievements, profile, quick snapshot, split experience, certifications, and contact.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={persist}
                disabled={saveState === 'saving' || !hasUnsavedChanges}
                className="inline-flex items-center gap-2 rounded-lg bg-[var(--night)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {saveState === 'saving' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {saveState === 'saving' ? 'Saving...' : 'Publish changes'}
              </button>
            </div>
          </div>

          <div className="mt-4 grid gap-3 text-xs text-slate-600 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-black/10 bg-white px-3 py-2">
              Achievements: <b>{achievements.length}</b>
            </div>
            <div className="rounded-lg border border-black/10 bg-white px-3 py-2">
              Contract experience: <b>{siteContent.experience.contractual.length}</b>
            </div>
            <div className="rounded-lg border border-black/10 bg-white px-3 py-2">
              Upwork experience: <b>{siteContent.experience.upwork.length}</b>
            </div>
            <div className="rounded-lg border border-black/10 bg-white px-3 py-2">
              Certifications: <b>{siteContent.certifications.length}</b>
            </div>
          </div>

          {saveMessage ? (
            <p
              className={`mt-3 text-sm font-medium ${
                saveState === 'error' ? 'text-red-600' : 'text-emerald-700'
              }`}
            >
              {saveMessage}
            </p>
          ) : null}
        </section>

        <section className="rounded-2xl border border-black/10 bg-white/75 p-2">
          <div className="flex flex-wrap gap-2">
            {TABS.map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[var(--night)] text-white'
                    : 'bg-white text-slate-700 hover:bg-black/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </section>

        {loading ? (
          <div className="rounded-2xl border border-black/10 bg-white/75 p-8 text-center text-sm text-slate-600">
            <Loader2 className="mx-auto mb-3 h-5 w-5 animate-spin" />
            Loading content...
          </div>
        ) : null}

        {!loading && activeTab === 'profile' ? (
          <section className="rounded-2xl border border-black/10 bg-white/75 p-4">
            <div className="grid gap-3 md:grid-cols-2">
              <label className={`${LABEL_CLASS} md:col-span-2`}>
                Headline
                <input
                  type="text"
                  value={siteContent.profile.headline}
                  onChange={event => updateProfileField('headline', event.target.value)}
                  className={FIELD_CLASS}
                />
              </label>

              <label className={`${LABEL_CLASS} md:col-span-2`}>
                Intro
                <textarea
                  rows={3}
                  value={siteContent.profile.intro}
                  onChange={event => updateProfileField('intro', event.target.value)}
                  className={FIELD_CLASS}
                />
              </label>

              <label className={LABEL_CLASS}>
                Location label
                <input
                  type="text"
                  value={siteContent.profile.locationLabel}
                  onChange={event => updateProfileField('locationLabel', event.target.value)}
                  className={FIELD_CLASS}
                />
              </label>

              <label className={LABEL_CLASS}>
                Email
                <input
                  type="email"
                  value={siteContent.profile.email}
                  onChange={event => updateProfileField('email', event.target.value)}
                  className={FIELD_CLASS}
                />
              </label>

              <label className={LABEL_CLASS}>
                CV URL or path
                <input
                  type="text"
                  value={siteContent.profile.cvUrl}
                  onChange={event => updateProfileField('cvUrl', event.target.value)}
                  className={FIELD_CLASS}
                />
              </label>

              <label className={LABEL_CLASS}>
                Upwork URL
                <input
                  type="text"
                  value={siteContent.profile.upworkUrl}
                  onChange={event => updateProfileField('upworkUrl', event.target.value)}
                  className={FIELD_CLASS}
                />
              </label>

              <label className={LABEL_CLASS}>
                LinkedIn URL
                <input
                  type="text"
                  value={siteContent.profile.linkedinUrl}
                  onChange={event => updateProfileField('linkedinUrl', event.target.value)}
                  className={FIELD_CLASS}
                />
              </label>

              <label className={LABEL_CLASS}>
                GitHub URL
                <input
                  type="text"
                  value={siteContent.profile.githubUrl}
                  onChange={event => updateProfileField('githubUrl', event.target.value)}
                  className={FIELD_CLASS}
                />
              </label>
            </div>
          </section>
        ) : null}

        {!loading && activeTab === 'snapshot' ? (
          <section className="rounded-2xl border border-black/10 bg-white/75 p-4">
            <div className="grid gap-3 md:grid-cols-2">
              <label className={`${LABEL_CLASS} md:col-span-2`}>
                Highlights (one per line)
                <textarea
                  rows={5}
                  value={toMultilineText(siteContent.quickSnapshot.highlights)}
                  onChange={event =>
                    updateQuickSnapshotList('highlights', event.target.value, toLineList)
                  }
                  className={FIELD_CLASS}
                />
              </label>

              <label className={`${LABEL_CLASS} md:col-span-2`}>
                Core stack (comma or line separated)
                <textarea
                  rows={4}
                  value={toMultilineText(siteContent.quickSnapshot.coreStack)}
                  onChange={event =>
                    updateQuickSnapshotList('coreStack', event.target.value, toFlexibleList)
                  }
                  className={FIELD_CLASS}
                />
              </label>
            </div>
          </section>
        ) : null}

        {!loading && activeTab === 'experience' ? (
          <div className="space-y-4">
            {renderExperienceGroup(
              'contractual',
              'Contract Experience (CV)',
              'Formal contractual roles from your CV and direct engagements.',
            )}
            {renderExperienceGroup(
              'upwork',
              'Upwork Experience',
              'Client case work and project outcomes from Upwork.',
            )}
          </div>
        ) : null}

        {!loading && activeTab === 'certifications' ? (
          <section className="space-y-4 rounded-2xl border border-black/10 bg-white/75 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-display text-2xl leading-[1.22]">Certifications</p>
                <p className="text-xs text-slate-500">All cards can link to a public verification URL.</p>
              </div>
              <button
                type="button"
                onClick={addCertification}
                className="inline-flex items-center gap-2 rounded-lg border border-black/15 bg-white px-3 py-2 text-sm font-semibold"
              >
                <Plus className="h-4 w-4" /> Add certification
              </button>
            </div>

            {siteContent.certifications.length === 0 ? (
              <div className="rounded-xl border border-dashed border-black/15 bg-white px-4 py-4 text-sm text-slate-500">
                No certifications yet.
              </div>
            ) : null}

            <div className="space-y-3">
              {siteContent.certifications.map((cert, index) => {
                const expanded = openCertificationId === cert.id
                return (
                  <article key={cert.id} className="rounded-xl border border-black/10 bg-white/90 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenCertificationId(current =>
                            current === cert.id ? null : cert.id,
                          )
                        }
                        className="text-left"
                      >
                        <p className="font-display text-xl leading-[1.22]">
                          {cert.title || 'Untitled certification'}
                        </p>
                        <p className="mt-1 text-xs font-mono-custom uppercase tracking-[0.16em] text-slate-500">
                          {cert.issuer || 'Issuer pending'}
                        </p>
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => moveCertification(index, 'up')}
                          className="rounded-md border border-black/10 bg-white p-1.5 text-slate-600"
                          aria-label="Move up"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveCertification(index, 'down')}
                          className="rounded-md border border-black/10 bg-white p-1.5 text-slate-600"
                          aria-label="Move down"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeCertification(cert.id)}
                          className="rounded-md border border-black/10 bg-white p-1.5 text-red-600"
                          aria-label="Delete certification"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {expanded ? (
                      <div className="mt-4 grid gap-3 md:grid-cols-2">
                        <label className={`${LABEL_CLASS} md:col-span-2`}>
                          Title
                          <input
                            type="text"
                            value={cert.title}
                            onChange={event =>
                              updateCertificationItem(cert.id, { title: event.target.value })
                            }
                            className={FIELD_CLASS}
                          />
                        </label>

                        <label className={LABEL_CLASS}>
                          Issuer
                          <input
                            type="text"
                            value={cert.issuer}
                            onChange={event =>
                              updateCertificationItem(cert.id, { issuer: event.target.value })
                            }
                            className={FIELD_CLASS}
                          />
                        </label>

                        <label className={LABEL_CLASS}>
                          Image path
                          <input
                            type="text"
                            value={cert.image}
                            onChange={event =>
                              updateCertificationItem(cert.id, { image: event.target.value })
                            }
                            className={FIELD_CLASS}
                          />
                        </label>

                        <label className={`${LABEL_CLASS} md:col-span-2`}>
                          Verification URL
                          <input
                            type="text"
                            value={cert.verifyUrl}
                            onChange={event =>
                              updateCertificationItem(cert.id, { verifyUrl: event.target.value })
                            }
                            className={FIELD_CLASS}
                          />
                        </label>
                      </div>
                    ) : null}
                  </article>
                )
              })}
            </div>
          </section>
        ) : null}

        {!loading && activeTab === 'contact' ? (
          <section className="rounded-2xl border border-black/10 bg-white/75 p-4">
            <div className="grid gap-3 md:grid-cols-2">
              <label className={`${LABEL_CLASS} md:col-span-2`}>
                Contact title
                <input
                  type="text"
                  value={siteContent.contact.title}
                  onChange={event => updateContactField('title', event.target.value)}
                  className={FIELD_CLASS}
                />
              </label>

              <label className={`${LABEL_CLASS} md:col-span-2`}>
                Contact description
                <textarea
                  rows={4}
                  value={siteContent.contact.description}
                  onChange={event => updateContactField('description', event.target.value)}
                  className={FIELD_CLASS}
                />
              </label>
            </div>
          </section>
        ) : null}

        {!loading && activeTab === 'achievements' ? (
          <section className="space-y-4">
            <div className="rounded-2xl border border-black/10 bg-white/75 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    {achievements.length} achievement{achievements.length === 1 ? '' : 's'}
                  </p>
                  <p className="text-xs text-slate-500">Include a video path to show preview thumbnails.</p>
                </div>

                <button
                  type="button"
                  onClick={addAchievement}
                  className="inline-flex items-center gap-2 rounded-lg border border-black/15 bg-white px-3 py-2 text-sm font-semibold"
                >
                  <Plus className="h-4 w-4" /> Add achievement
                </button>
              </div>
            </div>

            {achievements.length === 0 ? (
              <div className="rounded-2xl border border-black/10 bg-white/75 p-8 text-center text-sm text-slate-600">
                No achievements yet.
              </div>
            ) : null}

            <div className="space-y-4">
              {achievements.map((item, index) => {
                const tagsAsText = item.tags.join(', ')
                const expanded = openAchievementId === item.id

                return (
                  <section key={item.id} className="rounded-2xl border border-black/10 bg-white/75 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenAchievementId(current =>
                            current === item.id ? null : item.id,
                          )
                        }
                        className="text-left"
                      >
                        <p className="font-display text-2xl leading-[1.22]">
                          {item.title || 'Untitled achievement'}
                        </p>
                        <p className="mt-1 text-xs font-mono-custom uppercase tracking-[0.18em] text-slate-500">
                          {item.company || 'Company pending'} · {item.period || 'Period pending'}
                        </p>
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => moveAchievement(index, 'up')}
                          className="rounded-md border border-black/10 bg-white p-1.5 text-slate-600"
                          aria-label="Move up"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveAchievement(index, 'down')}
                          className="rounded-md border border-black/10 bg-white p-1.5 text-slate-600"
                          aria-label="Move down"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeAchievement(item.id)}
                          className="rounded-md border border-black/10 bg-white p-1.5 text-red-600"
                          aria-label="Delete achievement"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {expanded ? (
                      <div className="mt-4 grid gap-3 md:grid-cols-2">
                        <label className={LABEL_CLASS}>
                          Title
                          <input
                            type="text"
                            value={item.title}
                            onChange={event =>
                              updateAchievement(item.id, { title: event.target.value })
                            }
                            className={FIELD_CLASS}
                          />
                        </label>

                        <label className={LABEL_CLASS}>
                          Company
                          <input
                            type="text"
                            value={item.company}
                            onChange={event =>
                              updateAchievement(item.id, { company: event.target.value })
                            }
                            className={FIELD_CLASS}
                          />
                        </label>

                        <label className={LABEL_CLASS}>
                          Role
                          <input
                            type="text"
                            value={item.role}
                            onChange={event =>
                              updateAchievement(item.id, { role: event.target.value })
                            }
                            className={FIELD_CLASS}
                          />
                        </label>

                        <label className={LABEL_CLASS}>
                          Period
                          <input
                            type="text"
                            value={item.period}
                            onChange={event =>
                              updateAchievement(item.id, { period: event.target.value })
                            }
                            className={FIELD_CLASS}
                          />
                        </label>

                        <label className={`${LABEL_CLASS} md:col-span-2`}>
                          Challenge
                          <textarea
                            rows={3}
                            value={item.challenge}
                            onChange={event =>
                              updateAchievement(item.id, {
                                challenge: event.target.value,
                              })
                            }
                            className={FIELD_CLASS}
                          />
                        </label>

                        <label className={`${LABEL_CLASS} md:col-span-2`}>
                          Action
                          <textarea
                            rows={3}
                            value={item.action}
                            onChange={event =>
                              updateAchievement(item.id, {
                                action: event.target.value,
                              })
                            }
                            className={FIELD_CLASS}
                          />
                        </label>

                        <label className={`${LABEL_CLASS} md:col-span-2`}>
                          Impact
                          <textarea
                            rows={3}
                            value={item.impact}
                            onChange={event =>
                              updateAchievement(item.id, {
                                impact: event.target.value,
                              })
                            }
                            className={FIELD_CLASS}
                          />
                        </label>

                        <label className={`${LABEL_CLASS} md:col-span-2`}>
                          Tags (comma separated)
                          <input
                            type="text"
                            value={tagsAsText}
                            onChange={event =>
                              updateAchievement(item.id, {
                                tags: toTags(event.target.value),
                              })
                            }
                            className={FIELD_CLASS}
                          />
                        </label>

                        <label className={`${LABEL_CLASS} md:col-span-2`}>
                          Evidence link (optional)
                          <input
                            type="text"
                            value={item.proofUrl ?? ''}
                            onChange={event =>
                              updateAchievement(item.id, {
                                proofUrl: event.target.value,
                              })
                            }
                            className={FIELD_CLASS}
                          />
                        </label>

                        <label className={`${LABEL_CLASS} md:col-span-2`}>
                          Preview video path (optional)
                          <input
                            type="text"
                            value={item.previewVideo ?? ''}
                            onChange={event =>
                              updateAchievement(item.id, {
                                previewVideo: event.target.value,
                              })
                            }
                            placeholder="/Selenium.mp4"
                            className={FIELD_CLASS}
                          />
                        </label>
                      </div>
                    ) : null}
                  </section>
                )
              })}
            </div>
          </section>
        ) : null}
      </main>
    </div>
  )
}

export default function AdminPage() {
  const [ready, setReady] = useState(false)
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')

  useEffect(() => {
    const restore = async () => {
      const stored = sessionStorage.getItem(SESSION_KEY)
      if (!stored) {
        setReady(true)
        return
      }

      try {
        const valid = await checkPassword(stored)
        if (valid) {
          setPassword(stored)
          setAuthed(true)
        } else {
          sessionStorage.removeItem(SESSION_KEY)
        }
      } finally {
        setReady(true)
      }
    }

    restore()
  }, [])

  const handleLogin = (nextPassword: string) => {
    sessionStorage.setItem(SESSION_KEY, nextPassword)
    setPassword(nextPassword)
    setAuthed(true)
    setReady(true)
  }

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY)
    setAuthed(false)
    setPassword('')
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-slate-600">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading admin...
      </div>
    )
  }

  if (!authed) {
    return <LoginScreen onSuccess={handleLogin} />
  }

  return <Dashboard password={password} onLogout={handleLogout} />
}
