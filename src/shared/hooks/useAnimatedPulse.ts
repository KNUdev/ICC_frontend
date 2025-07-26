'use client'

import { useEffect, useMemo, useRef } from 'react'

export interface AnimatedPulseConfig {
  duration?: number
  easing?: string
  colors?: {
    from: string
    to: string
  }
}

const defaultConfig: Required<AnimatedPulseConfig> = {
  duration: 4000,
  easing: 'ease-in-out',
  colors: {
    from: '#ff7881',
    to: '#ff525e',
  },
}

const createdKeyframes = new Set<string>()

export function useAnimatedPulse(config: AnimatedPulseConfig = {}) {
  const finalConfig = useMemo(() => ({ ...defaultConfig, ...config }), [config])
  const styleRef = useRef<HTMLStyleElement | null>(null)

  const keyframeName = useMemo(
    () =>
      `pulse-${finalConfig.colors.from.replace(
        '#',
        '',
      )}-${finalConfig.colors.to.replace('#', '')}`,
    [finalConfig.colors.from, finalConfig.colors.to],
  )

  const pulseStyle = useMemo(
    () =>
      ({
        animation: `${keyframeName} ${finalConfig.duration}ms ${finalConfig.easing} infinite`,
        willChange: 'fill',
        transform: 'translateZ(0)',
      } as React.CSSProperties),
    [keyframeName, finalConfig.duration, finalConfig.easing],
  )

  useEffect(() => {
    if (typeof document === 'undefined' || createdKeyframes.has(keyframeName)) {
      return
    }

    const keyframes = `
      @keyframes ${keyframeName} {
        0% { fill: ${finalConfig.colors.from}; }
        50% { fill: ${finalConfig.colors.to}; }
        100% { fill: ${finalConfig.colors.from}; }
      }
    `

    const styleId = `pulse-keyframes-${keyframeName}`

    if (!document.getElementById(styleId)) {
      const style = document.createElement('style')
      style.id = styleId
      style.textContent = keyframes
      document.head.appendChild(style)
      styleRef.current = style
      createdKeyframes.add(keyframeName)
    }

    return () => {
      if (styleRef.current && styleRef.current.parentNode) {
        styleRef.current.parentNode.removeChild(styleRef.current)
        createdKeyframes.delete(keyframeName)
      }
    }
  }, [keyframeName, finalConfig.colors.from, finalConfig.colors.to])

  return { pulseStyle }
}
