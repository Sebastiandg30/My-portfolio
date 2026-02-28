import './globals.css'
import type { Metadata } from 'next'
import { Space_Grotesk, Syne, IBM_Plex_Mono } from 'next/font/google'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/react'
import UpworkBanner from '../components/ui/UpworkBanner'
import SanitizeLinks from '../components/ui/SanitizeLinks'

const sansFont = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
})

const displayFont = Syne({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['500', '700', '800'],
})

const monoFont = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-mono-custom',
  weight: ['400', '500'],
})

const SAFE = process.env.NEXT_PUBLIC_UPWORK_MODE === '1'

export const metadata: Metadata = {
  title: 'Sebastian Gomez | QA Engineer Portfolio',
  description:
    'QA Engineer specialized in test automation, validation pipelines, and quality systems for real production workflows.',
  robots: SAFE ? { index: false, follow: false } : { index: true, follow: true },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const safeMode = process.env.NEXT_PUBLIC_UPWORK_MODE === '1'

  return (
    <html lang="en" data-upwork-safe={safeMode ? '1' : '0'}>
      <body className={`${sansFont.variable} ${displayFont.variable} ${monoFont.variable} antialiased`}>
        {safeMode && <UpworkBanner />}
        {safeMode && <SanitizeLinks />}
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}
