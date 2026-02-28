import { NextResponse } from 'next/server'
import { defaultSiteContent } from '@/lib/site-content'
import {
  loadSiteContentFromStore,
  saveSiteContentToStore,
} from '@/lib/server/site-content-store'

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
    const siteContent = await loadSiteContentFromStore()
    return NextResponse.json({ siteContent })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown storage error'

    return NextResponse.json(
      {
        siteContent: defaultSiteContent,
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
    const payload = (await req.json()) as { siteContent?: unknown } | unknown
    const data =
      typeof payload === 'object' && payload !== null && 'siteContent' in payload
        ? (payload as { siteContent?: unknown }).siteContent
        : payload

    const siteContent = await saveSiteContentToStore(data)

    return NextResponse.json({
      ok: true,
      siteContent,
    })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unexpected error while saving site content'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
