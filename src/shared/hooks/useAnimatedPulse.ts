'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useReducedMotion } from './useReducedMotion'

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
  const { shouldReduceMotion } = useReducedMotion()
  const finalConfig = useMemo(() => {
    const baseConfig = { ...defaultConfig, ...config }

    if (shouldReduceMotion) {
      return {
        ...baseConfig,
        duration: baseConfig.duration * 2,
        easing: 'linear',
      }
    }

    return baseConfig
  }, [config, shouldReduceMotion])

  const shouldDisableAnimation = shouldReduceMotion || finalConfig.forceDisable

  const styleRef = useRef<HTMLStyleElement | null>(null)

  const keyframeName = useMemo(
    () =>
      `pulse-${finalConfig.colors.from.replace(
        '#',
        '',
      )}-${finalConfig.colors.to.replace('#', '')}-${
        shouldDisableAnimation ? 'reduced' : 'normal'
      }`,
    [finalConfig.colors.from, finalConfig.colors.to, shouldDisableAnimation],
  )

  const pulseStyle = useMemo(() => {
    if (shouldDisableAnimation) {
      return {
        fill: finalConfig.colors.from,
        transform: 'translateZ(0)',
      } as React.CSSProperties
    }

    return {
      animation: `${keyframeName} ${finalConfig.duration}ms ${finalConfig.easing} infinite`,
      willChange: 'fill',
      transform: 'translateZ(0)',
    } as React.CSSProperties
  }, [
    keyframeName,
    finalConfig.duration,
    finalConfig.easing,
    finalConfig.colors.from,
    shouldDisableAnimation,
  ])

  useEffect(() => {
    if (
      typeof document === 'undefined' ||
      createdKeyframes.has(keyframeName) ||
      shouldDisableAnimation
    ) {
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
  }, [
    keyframeName,
    finalConfig.colors.from,
    finalConfig.colors.to,
    shouldDisableAnimation,
  ])

  return { pulseStyle }
}
