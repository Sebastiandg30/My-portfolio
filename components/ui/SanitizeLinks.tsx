'use client'
import { useEffect } from 'react'

export default function SanitizeLinks() {
  useEffect(() => {
    const SAFE = process.env.NEXT_PUBLIC_UPWORK_MODE === '1'
    if (!SAFE) return

    const anchors = Array.from(document.querySelectorAll<HTMLAnchorElement>('a'))
    const badRe = /(mailto:|tel:|contact|resume|cv|wa\.me|whatsapp|t\.me|telegram|instagram|facebook|x\.com|calendly|discord|linktr\.ee)/i

    anchors.forEach(a => {
      const href = a.getAttribute('href') || ''
      const isExternal = /^https?:\/\//i.test(href)
      const dangerous = isExternal || badRe.test(href)

      if (dangerous) {
        const span = document.createElement('span')
        // Evita dejar la URL en texto visible
        span.textContent = a.textContent && a.textContent.match(/^https?:\/\//i)
          ? 'External link (disabled)'
          : (a.textContent || '')
        span.className = a.className
        a.replaceWith(span) // elimina el <a> con su href del DOM
      }
    })
  }, [])

  return null
}
