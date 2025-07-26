'use client'
import { useCallback, useEffect, useRef } from 'react'

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

  const setPathRef = useCallback(
    (index: number) => (ref: SVGPathElement | null) => {
      pathRefs.current[index] = ref
    },
    [],
  )

  useEffect(() => {
    const paths = pathRefs.current.filter(Boolean) as SVGPathElement[]
    if (paths.length === 0) return

    const animations: Animation[] = []

    paths.forEach((path) => {
      const totalLength = path.getTotalLength()
      const duration = getRandomDuration(baseDuration, durationVariation)

      // Применяем стили
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
          easing,
          iterations: Infinity,
          fill: 'forwards',
        },
      )

      animations.push(animation)
    })

    return () => {
      animations.forEach((animation) => animation.cancel())
    }
  }, [baseDuration, durationVariation, easing, lines.length])

  return {
    setPathRef,
    lines,
    gradients,
    defaultLineStyles,
    className,
  }
}
