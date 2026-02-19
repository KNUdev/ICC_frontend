'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

export interface AnimatedPulseConfig {
  duration?: number
  easing?: string
  colors?: {
    from: string
    to: string
  }
  forceDisable?: boolean
}

const defaultConfig: Required<AnimatedPulseConfig> = {
  duration: 4000,
  easing: 'ease-in-out',
  colors: {
    from: '#ff7881',
    to: '#ff525e',
  },
  forceDisable: false,
}

const createdKeyframes = new Set<string>()

export function useAnimatedPulse(config: AnimatedPulseConfig = {}) {
  const [isMounted, setIsMounted] = useState(false)
  const finalConfig = useMemo(() => {
    return { ...defaultConfig, ...config }
  }, [config])

  const shouldDisableAnimation = finalConfig.forceDisable

  const styleRef = useRef<HTMLStyleElement | null>(null)

  const keyframeName = useMemo(
    () =>
      `pulse-${finalConfig.colors.from.replace(
        '#',
        '',
      )}-${finalConfig.colors.to.replace('#', '')}-normal`,
    [finalConfig.colors.from, finalConfig.colors.to],
  )

  const pulseStyle = useMemo(() => {
    if (shouldDisableAnimation || !isMounted) {
      return {
        fill: finalConfig.colors.from,
      } as React.CSSProperties
    }

    return {
      fill: finalConfig.colors.from,
      animation: `${keyframeName} ${finalConfig.duration}ms ${finalConfig.easing} infinite`,
    } as React.CSSProperties
  }, [
    keyframeName,
    finalConfig.duration,
    finalConfig.easing,
    finalConfig.colors.from,
    shouldDisableAnimation,
    isMounted,
  ])

  useEffect(() => {
    setIsMounted(true)

    if (
      typeof document === 'undefined' ||
      shouldDisableAnimation
    ) {
      return
    }

    const styleId = `pulse-keyframes-${keyframeName}`
    let styleElement = document.getElementById(styleId) as HTMLStyleElement

    if (!styleElement) {
      const keyframes = `
        @keyframes ${keyframeName} {
          0% { fill: ${finalConfig.colors.from}; }
          50% { fill: ${finalConfig.colors.to}; }
          100% { fill: ${finalConfig.colors.from}; }
        }
      `
      styleElement = document.createElement('style')
      styleElement.id = styleId
      styleElement.textContent = keyframes
      document.head.appendChild(styleElement)
      createdKeyframes.add(keyframeName)
    }

    return () => {
      // We don't remove the style element here because other components 
      // might be using the same keyframes.
    }
  }, [
    keyframeName,
    finalConfig.colors.from,
    finalConfig.colors.to,
    shouldDisableAnimation,
  ])

  return { pulseStyle }
}
