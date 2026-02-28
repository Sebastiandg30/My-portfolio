import { NextResponse } from 'next/server'

const ADMIN_PASSWORD =
  process.env.ADMIN_PASSWORD ??
  process.env.NEXT_PUBLIC_ADMIN_PASSWORD ??
  'sgqa2024'

export async function POST(req: Request) {
  try {
    const payload = (await req.json()) as { password?: string }
    const password = payload.password?.trim() ?? ''

    if (password && password === ADMIN_PASSWORD) {
      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}
