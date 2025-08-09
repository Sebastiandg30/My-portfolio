'use client'
import { useEffect } from 'react'

const emailRe = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i
const badHrefRe = /(mailto:|tel:|contact|resume|cv|\.pdf($|\?))/i

export default function SanitizeLinks() {
  useEffect(() => {
    const SAFE = process.env.NEXT_PUBLIC_UPWORK_MODE === '1'
    if (!SAFE) return

    // 1) Reemplaza <a> peligrosos por <span>
    document.querySelectorAll<HTMLAnchorElement>('a').forEach(a => {
      const href = a.getAttribute('href') || ''
      const isExternal = /^https?:\/\//i.test(href)
      const dangerous = isExternal || badHrefRe.test(href)
      if (dangerous) {
        const span = document.createElement('span')
        span.textContent = a.textContent || 'Link disabled'
        span.className = a.className
        a.replaceWith(span)
      }
    })

    // 2) Enmascara emails en texto plano (sin romper eventos)
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
    const nodes: Text[] = []
    let n: Node | null
    while ((n = walker.nextNode())) nodes.push(n as Text)
    nodes.forEach(t => {
      if (emailRe.test(t.nodeValue || '')) {
        t.nodeValue = (t.nodeValue || '').replace(emailRe, 'Email hidden — contact via Upwork')
      }
    })
  }, [])

  return null
}
