import { NextResponse } from 'next/server'

export function middleware(req: Request) {
  const SAFE = process.env.NEXT_PUBLIC_UPWORK_MODE === '1'
  if (!SAFE) return NextResponse.next()

  const url = new URL(req.url)
  const path = url.pathname.toLowerCase()

  if (path.endsWith('.pdf') || path.includes('resume') || path.includes('cv')) {
    url.pathname = '/upwork' // o tu landing limpia
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = { matcher: ['/:path*'] }
