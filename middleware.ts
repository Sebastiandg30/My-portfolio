import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const SAFE = process.env.NEXT_PUBLIC_UPWORK_MODE === '1'
  if (!SAFE) return NextResponse.next()

  const res = NextResponse.next()
  res.headers.set('X-Robots-Tag', 'noindex, nofollow')

  const { pathname } = req.nextUrl
  const lower = pathname.toLowerCase()

  if (
    lower.endsWith('.pdf') ||
    lower.includes('/contact') ||
    lower.includes('/resume') ||
    lower.includes('/cv')
  ) {
    const url = req.nextUrl.clone()
    url.pathname = '/upwork' 
    return NextResponse.redirect(url)
  }

  return res
}

export const config = {
  matcher: ['/:path*'],
}
