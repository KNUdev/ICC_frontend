'use client'
import { useEffect, useState } from 'react'

export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [isLowPerformanceDevice, setIsLowPerformanceDevice] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)

    const checkDevicePerformance = () => {
      const connection = (
        navigator as unknown as { connection?: { effectiveType?: string } }
      ).connection
      const hardwareConcurrency = navigator.hardwareConcurrency || 4
      const memory = (
        performance as unknown as { memory?: { jsHeapSizeLimit?: number } }
      ).memory

      let isLowPerf = false

      if (hardwareConcurrency <= 2) {
        isLowPerf = true
      }

      if (memory?.jsHeapSizeLimit && memory.jsHeapSizeLimit < 1073741824) {
        isLowPerf = true
      }

      if (
        connection?.effectiveType &&
        (connection.effectiveType === 'slow-2g' ||
          connection.effectiveType === '2g')
      ) {
        isLowPerf = true
      }

      setIsLowPerformanceDevice(isLowPerf)
    }

    checkDevicePerformance()

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  return {
    shouldReduceMotion: prefersReducedMotion || isLowPerformanceDevice,
    prefersReducedMotion,
    isLowPerformanceDevice,
  }
}
