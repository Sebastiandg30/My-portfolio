import './globals.css'
import type { Metadata } from 'next'
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"
import UpworkBanner from '../components/ui/UpworkBanner'
import SanitizeLinks from '../components/ui/SanitizeLinks'


export const metadata: Metadata = {
  title: 'Sebastian Gomez Portfolio',
  description: 'A showcase of my work and skills',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
    const SAFE = process.env.NEXT_PUBLIC_UPWORK_MODE === '1'
  return (
    <html lang="en" data-upwork-safe={SAFE ? '1' : '0'}>
      <body>
        {SAFE && <UpworkBanner />}
        {SAFE && <SanitizeLinks />}
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}



