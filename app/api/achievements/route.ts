import { NextResponse } from 'next/server'
import { defaultAchievements } from '@/lib/achievements'
import {
  loadAchievementsFromStore,
  saveAchievementsToStore,
  storageModeLabel,
} from '@/lib/server/achievements-store'

export const dynamic = 'force-dynamic'

const ADMIN_PASSWORD =
  process.env.ADMIN_PASSWORD ??
  process.env.NEXT_PUBLIC_ADMIN_PASSWORD ??
  'sgqa2024'

function isAuthorized(req: Request): boolean {
  const provided = req.headers.get('x-admin-password')?.trim()
  return Boolean(provided) && provided === ADMIN_PASSWORD
}

export async function GET() {
  try {
    const achievements = await loadAchievementsFromStore()
    return NextResponse.json({ achievements, storage: storageModeLabel() })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown storage error'

    return NextResponse.json(
      {
        achievements: defaultAchievements,
        storage: 'fallback',
        warning: message,
      },
      { status: 200 },
    )
  }
}

export async function PUT(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const payload = (await req.json()) as { achievements?: unknown } | unknown
    const data = typeof payload === 'object' && payload !== null && 'achievements' in payload
      ? (payload as { achievements?: unknown }).achievements
      : payload

    const achievements = await saveAchievementsToStore(data)

    return NextResponse.json({
      ok: true,
      achievements,
      storage: storageModeLabel(),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error while saving achievements'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
