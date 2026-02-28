'use client'

import { useEffect } from 'react'

const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i
const blockedHrefRegex = /(mailto:|tel:|contact|resume|cv|\.pdf($|\?))/i

export default function SanitizeLinks() {
  useEffect(() => {
    const safeMode = process.env.NEXT_PUBLIC_UPWORK_MODE === '1'
    if (!safeMode) return

    document.querySelectorAll<HTMLAnchorElement>('a').forEach(anchor => {
      const href = anchor.getAttribute('href') || ''
      const isExternal = /^https?:\/\//i.test(href)
      const isBlocked = isExternal || blockedHrefRegex.test(href)

      if (isBlocked) {
        const replacement = document.createElement('span')
        replacement.textContent = anchor.textContent || 'Link disabled'
        replacement.className = anchor.className
        anchor.replaceWith(replacement)
      }
    })

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
    const textNodes: Text[] = []
    let node: Node | null

    while ((node = walker.nextNode())) {
      textNodes.push(node as Text)
    }

    textNodes.forEach(textNode => {
      if (emailRegex.test(textNode.nodeValue || '')) {
        textNode.nodeValue = (textNode.nodeValue || '').replace(
          emailRegex,
          'Email hidden - contact via Upwork',
        )
      }
    })
  }, [])

  return null
}
