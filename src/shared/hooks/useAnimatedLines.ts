'use client'
import { useCallback, useEffect, useMemo, useRef } from 'react'

export interface LineConfig {
  d: string
  gradientId: string
}

export interface GradientConfig {
  id: string
  x1: string
  y1: string
  x2: string
  y2: string
  stops: Array<{
    offset: string
    stopColor: string
  }>
}

export interface AnimatedLinesConfig {
  lines: LineConfig[]
  gradients: GradientConfig[]
  baseDuration?: number
  durationVariation?: number
  easing?: string
  className?: string
}

const getRandomDuration = (base: number, variation: number) =>
  base + Math.random() * variation

const defaultLineStyles: React.CSSProperties = {
  strokeWidth: 3,
  strokeOpacity: 1,
  fill: 'none',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  willChange: 'stroke-dashoffset',
  transform: 'translateZ(0)',
}

export function useAnimatedLines(config: AnimatedLinesConfig) {
  const {
    lines,
    gradients,
    baseDuration = 2000,
    durationVariation = 1000,
    easing = 'ease-in-out',
    className = '',
  } = config

  const pathRefs = useRef<(SVGPathElement | null)[]>([])
  const animationsRef = useRef<Animation[]>([])
  const isInitializedRef = useRef(false)

  const animationConfig = useMemo(
    () => ({
      baseDuration,
      durationVariation,
      easing,
    }),
    [baseDuration, durationVariation, easing],
  )

  const setPathRef = useCallback(
    (index: number) => (ref: SVGPathElement | null) => {
      pathRefs.current[index] = ref
    },
    [],
  )

  const createAnimations = useCallback(() => {
    const paths = pathRefs.current.filter(Boolean) as SVGPathElement[]
    if (paths.length === 0) return

    animationsRef.current.forEach((animation) => animation.cancel())
    animationsRef.current = []

    requestAnimationFrame(() => {
      paths.forEach((path, index) => {
        try {
          const totalLength = path.getTotalLength()
          const duration = getRandomDuration(
            animationConfig.baseDuration,
            animationConfig.durationVariation,
          )

          Object.assign(path.style, defaultLineStyles)
          path.style.strokeDasharray = `${totalLength}`
          path.style.strokeDashoffset = `${totalLength}`

          const animation = path.animate(
            [
              { strokeDashoffset: totalLength },
              { strokeDashoffset: 0 },
              { strokeDashoffset: -totalLength },
            ],
            {
              duration,
              easing: animationConfig.easing,
              iterations: Infinity,
              fill: 'forwards',
              composite: 'replace',
            },
          )

          animation.currentTime = (index * 200) % duration

          animationsRef.current.push(animation)
        } catch (error) {
          console.warn('Failed to create animation for path:', error)
        }
      })
    })
  }, [animationConfig])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!isInitializedRef.current && pathRefs.current.length > 0) {
        createAnimations()
        isInitializedRef.current = true
      }
    }, 100)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [createAnimations, lines.length])

  useEffect(() => {
    return () => {
      animationsRef.current.forEach((animation) => animation.cancel())
      animationsRef.current = []
      isInitializedRef.current = false
    }
  }, [])

  return {
    setPathRef,
    lines,
    gradients,
    defaultLineStyles,
    className,
  }
}
