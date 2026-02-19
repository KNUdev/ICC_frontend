'use client'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

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
  forceDisable?: boolean
}

const getRandomDuration = (base: number, variation: number) =>
  base + Math.random() * variation

const defaultLineStyles: React.CSSProperties = {
  strokeWidth: 3,
  strokeOpacity: 1,
  fill: 'none',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export function useAnimatedLines(config: AnimatedLinesConfig) {
  const {
    lines,
    gradients,
    baseDuration = 2000,
    durationVariation = 1000,
    easing = 'ease-in-out',
    className = '',
    forceDisable = false,
  } = config

  const [isMounted, setIsMounted] = useState(false)
  const pathRefs = useRef<(SVGPathElement | null)[]>([])
  const animationsRef = useRef<Animation[]>([])
  const isInitializedRef = useRef(false)

  const animationConfig = useMemo(() => {
    return {
      baseDuration,
      durationVariation,
      easing,
      shouldAnimate: !forceDisable && isMounted,
    }
  }, [baseDuration, durationVariation, easing, forceDisable, isMounted])

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

    if (!animationConfig.shouldAnimate) {
      paths.forEach((path) => {
        Object.assign(path.style, defaultLineStyles)
        path.style.strokeDasharray = 'none'
        path.style.strokeDashoffset = '0'
      })
      return
    }

    requestAnimationFrame(() => {
      let allPathsReady = true
      
      paths.forEach((path, index) => {
        try {
          const totalLength = path.getTotalLength()
          if (totalLength === 0) {
            allPathsReady = false
            return
          }

          const duration =
            animationConfig.durationVariation > 0
              ? getRandomDuration(
                  animationConfig.baseDuration,
                  animationConfig.durationVariation,
                )
              : animationConfig.baseDuration

          Object.assign(path.style, defaultLineStyles)
          path.style.strokeDasharray = `${totalLength} ${totalLength}`
          path.style.strokeDashoffset = `${totalLength}`

          const timeOffset =
            animationConfig.durationVariation > 0
              ? (index * 200) % duration
              : (index * 100) % duration

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
              iterationStart: timeOffset / duration,
            },
          )

          animationsRef.current.push(animation)
        } catch (error) {
          console.warn('Failed to create animation for path:', error)
        }
      })

      if (allPathsReady && paths.length > 0) {
        isInitializedRef.current = true
      }
    })
  }, [animationConfig])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    const checkAndInit = () => {
      if (!isInitializedRef.current && pathRefs.current.length > 0) {
        createAnimations()
      }
    }

    const timeoutId = setTimeout(checkAndInit, 100)
    const backupTimeoutId = setTimeout(checkAndInit, 1000)

    return () => {
      clearTimeout(timeoutId)
      clearTimeout(backupTimeoutId)
    }
  }, [createAnimations, lines.length, isMounted])

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
    pathRefs: pathRefs.current,
  }
}
