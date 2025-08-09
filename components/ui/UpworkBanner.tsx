'use client'
import { useEffect, useState } from 'react'

export default function UpworkBanner() {
  const [show, setShow] = useState(true)
  const [fade, setFade] = useState(false)

  useEffect(() => {
    // añade espacio mientras el banner está visible
    const prevPadding = document.body.style.paddingTop
    document.body.style.paddingTop = '40px'

    const t1 = setTimeout(() => setFade(true), 4500) // empieza fade a los 4.5s
    const t2 = setTimeout(() => {
      setShow(false)
      document.body.style.paddingTop = prevPadding // quita el espacio
    }, 5000)

    return () => {
      clearTimeout(t1); clearTimeout(t2)
      document.body.style.paddingTop = prevPadding
    }
  }, [])

  if (!show) return null

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 9999,
        padding: '10px 12px',
        textAlign: 'center',
        background: '#14A800',        // Upwork green
        color: '#FFFFFF',
        boxShadow: '0 2px 8px rgba(0,0,0,.15)',
        fontWeight: 500,
        transition: 'opacity 500ms ease, transform 500ms ease',
        opacity: fade ? 0 : 1,
        transform: fade ? 'translateY(-8px)' : 'translateY(0)',
      }}
    >
      Please contact me via <b>Upwork Messages</b>.
      <button
        onClick={() => { setFade(true); setTimeout(() => setShow(false), 300); document.body.style.paddingTop = '' }}
        aria-label="Dismiss"
        style={{
          position: 'absolute', right: 10, top: 8,
          background: 'transparent', border: 'none',
          color: '#FFFFFF', fontSize: 18, cursor: 'pointer', lineHeight: 1
        }}
      >
        ×
      </button>
    </div>
  )
}
