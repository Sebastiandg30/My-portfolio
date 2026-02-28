'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
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

const SESSION_KEY = 'sg_admin_password'

type SaveState = 'idle' | 'saving' | 'saved' | 'error'

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
    throw new Error(payload.error ?? 'Unable to save changes')
  }
}

function toTags(value: string): string[] {
  return value
    .split(',')
    .map(item => item.trim())
    .filter(Boolean)
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
        <h1 className="mt-2 font-display text-4xl">Portfolio CMS</h1>
        <p className="mt-3 text-sm text-slate-600">
          Edit your real achievements from here without touching code.
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
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [openEditorId, setOpenEditorId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const [saveMessage, setSaveMessage] = useState('')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const data = await fetchAchievements()
        setAchievements(data)
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

  const updateItem = (id: string, patch: Partial<Achievement>) => {
    setAchievements(items => items.map(item => (item.id === id ? { ...item, ...patch } : item)))
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
    setOpenEditorId(next.id)
    markDirty()
  }

  const removeAchievement = (id: string) => {
    if (!confirm('Delete this achievement?')) return
    setAchievements(items => items.filter(item => item.id !== id))
    setOpenEditorId(current => (current === id ? null : current))
    markDirty()
  }

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1
    if (target < 0 || target >= achievements.length) return

    const next = [...achievements]
    const [item] = next.splice(index, 1)
    next.splice(target, 0, item)

    setAchievements(next)
    markDirty()
  }

  const persist = async () => {
    setSaveState('saving')
    setSaveMessage('')

    try {
      await saveAchievements(password, achievements)
      setSaveState('saved')
      setSaveMessage('Changes published successfully.')
      setHasUnsavedChanges(false)
      setTimeout(() => setSaveState('idle'), 1800)
    } catch (error) {
      setSaveState('error')
      setSaveMessage(error instanceof Error ? error.message : 'Save failed')
    }
  }

  return (
    <div className="min-h-screen bg-transparent">
      <header className="sticky top-0 z-30 border-b border-black/10 bg-[color:rgba(251,247,241,0.95)] backdrop-blur">
        <div className="mx-auto flex min-h-16 w-full max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <div>
            <p className="section-label">Admin</p>
            <p className="font-display text-xl leading-[1.2]">Manage Achievements</p>
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
              <p className="text-sm font-semibold text-slate-700">
                {achievements.length} achievement{achievements.length === 1 ? '' : 's'}
              </p>
              <p className="text-xs text-slate-500">
                Your homepage reads this list from the API.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={addAchievement}
                className="inline-flex items-center gap-2 rounded-lg border border-black/15 bg-white px-3 py-2 text-sm font-semibold"
              >
                <Plus className="h-4 w-4" /> Add
              </button>
              <button
                type="button"
                onClick={persist}
                disabled={saveState === 'saving' || !hasUnsavedChanges}
                className="inline-flex items-center gap-2 rounded-lg bg-[var(--night)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {saveState === 'saving' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {saveState === 'saving' ? 'Saving...' : 'Publish changes'}
              </button>
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

        {loading ? (
          <div className="rounded-2xl border border-black/10 bg-white/75 p-8 text-center text-sm text-slate-600">
            <Loader2 className="mx-auto mb-3 h-5 w-5 animate-spin" />
            Loading achievements...
          </div>
        ) : null}

        {!loading && achievements.length === 0 ? (
          <div className="rounded-2xl border border-black/10 bg-white/75 p-8 text-center text-sm text-slate-600">
            No achievements yet. Click &quot;Add&quot; to create one.
          </div>
        ) : null}

        <div className="space-y-4">
          {achievements.map((item, index) => {
            const tagsAsText = item.tags.join(', ')
            const expanded = openEditorId === item.id

            return (
              <motion.section
                key={item.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-black/10 bg-white/75 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setOpenEditorId(current => (current === item.id ? null : item.id))}
                    className="text-left"
                  >
                    <p className="font-display text-2xl">{item.title || 'Untitled achievement'}</p>
                    <p className="mt-1 text-xs font-mono-custom uppercase tracking-[0.18em] text-slate-500">
                      {item.company || 'Company pending'} · {item.period || 'Period pending'}
                    </p>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveItem(index, 'up')}
                      className="rounded-md border border-black/10 bg-white p-1.5 text-slate-600"
                      aria-label="Move up"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveItem(index, 'down')}
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
                    <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                      Title
                      <input
                        type="text"
                        value={item.title}
                        onChange={event => updateItem(item.id, { title: event.target.value })}
                        className="w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm font-normal text-slate-800 outline-none focus:border-[var(--teal)]"
                      />
                    </label>

                    <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                      Company
                      <input
                        type="text"
                        value={item.company}
                        onChange={event => updateItem(item.id, { company: event.target.value })}
                        className="w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm font-normal text-slate-800 outline-none focus:border-[var(--teal)]"
                      />
                    </label>

                    <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                      Role
                      <input
                        type="text"
                        value={item.role}
                        onChange={event => updateItem(item.id, { role: event.target.value })}
                        className="w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm font-normal text-slate-800 outline-none focus:border-[var(--teal)]"
                      />
                    </label>

                    <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                      Period
                      <input
                        type="text"
                        value={item.period}
                        onChange={event => updateItem(item.id, { period: event.target.value })}
                        className="w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm font-normal text-slate-800 outline-none focus:border-[var(--teal)]"
                      />
                    </label>

                    <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 md:col-span-2">
                      Challenge
                      <textarea
                        rows={3}
                        value={item.challenge}
                        onChange={event => updateItem(item.id, { challenge: event.target.value })}
                        className="w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm font-normal text-slate-800 outline-none focus:border-[var(--teal)]"
                      />
                    </label>

                    <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 md:col-span-2">
                      Action
                      <textarea
                        rows={3}
                        value={item.action}
                        onChange={event => updateItem(item.id, { action: event.target.value })}
                        className="w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm font-normal text-slate-800 outline-none focus:border-[var(--teal)]"
                      />
                    </label>

                    <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 md:col-span-2">
                      Impact
                      <textarea
                        rows={3}
                        value={item.impact}
                        onChange={event => updateItem(item.id, { impact: event.target.value })}
                        className="w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm font-normal text-slate-800 outline-none focus:border-[var(--teal)]"
                      />
                    </label>

                    <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 md:col-span-2">
                      Tags (comma separated)
                      <input
                        type="text"
                        value={tagsAsText}
                        onChange={event => updateItem(item.id, { tags: toTags(event.target.value) })}
                        className="w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm font-normal text-slate-800 outline-none focus:border-[var(--teal)]"
                      />
                    </label>

                    <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 md:col-span-2">
                      Evidence link (optional)
                      <input
                        type="text"
                        value={item.proofUrl ?? ''}
                        onChange={event => updateItem(item.id, { proofUrl: event.target.value })}
                        className="w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm font-normal text-slate-800 outline-none focus:border-[var(--teal)]"
                      />
                    </label>

                    <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 md:col-span-2">
                      Preview video path (optional)
                      <input
                        type="text"
                        value={item.previewVideo ?? ''}
                        onChange={event => updateItem(item.id, { previewVideo: event.target.value })}
                        placeholder="/Selenium.mp4"
                        className="w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm font-normal text-slate-800 outline-none focus:border-[var(--teal)]"
                      />
                    </label>
                  </div>
                ) : null}
              </motion.section>
            )
          })}
        </div>
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
