'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    workbox?: { register: () => Promise<void> }
  }
}

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('serviceWorker' in navigator)) return
    if (process.env.NODE_ENV !== 'production') return

    const swUrl = '/sw.js'

    const register = async () => {
      try {
        if (window.workbox && typeof window.workbox.register === 'function') {
          await window.workbox.register()
          return
        }
        const registration = await navigator.serviceWorker.register(swUrl)
        if (registration && registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' })
        }
      } catch (e) {
        console.warn('SW registration failed', e)
      }
    }

    register()

    return () => {}
  }, [])

  return null
}
