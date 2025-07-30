'use client'
import {
  useAnimatedLines,
  type GradientConfig,
  type LineConfig,
} from '@/shared/hooks/useAnimatedLines'
import React, { useCallback, useEffect, useMemo, useRef } from 'react'

export interface FormLineConfig {
  d: string
  gradientId: string
  isMainLine?: boolean
}

export { type GradientConfig } from '@/shared/hooks/useAnimatedLines'

export interface FormLinesAnimationConfig {
  lines: FormLineConfig[]
  gradients: GradientConfig[]
  mainLineDuration?: number
  sideLineDuration?: number
  cycleDuration?: number
  className?: string
  forceDisable?: boolean
}

export interface FormLinesAnimationReturn {
  setPathRef: (index: number) => (ref: SVGPathElement | null) => void
  lines: FormLineConfig[]
  gradients: GradientConfig[]
  defaultLineStyles: React.CSSProperties
  className: string
}

export function useFormLinesAnimation(
  config: FormLinesAnimationConfig,
): FormLinesAnimationReturn {
  const {
    lines,
    gradients,
    mainLineDuration = 1500,
    sideLineDuration = 1500,
    cycleDuration = 4000,
    className = '',
    forceDisable = false,
  } = config

  const formAnimationsRef = useRef<Animation[]>([])
  const cycleTimeoutRef = useRef<number | null>(null)
  const isFormInitializedRef = useRef(false)

  const animatedLinesConfig = useMemo(() => {
    const convertedLines: LineConfig[] = lines.map((line) => ({
      d: line.d,
      gradientId: line.gradientId,
    }))

    return {
      lines: convertedLines,
      gradients,
      durationVariation: 0,
      easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
      className,
      forceDisable: true,
    }
  }, [lines, gradients, className])

  const baseAnimation = useAnimatedLines(animatedLinesConfig)

  const createSynchronizedFormAnimation = useCallback(() => {
    formAnimationsRef.current.forEach((animation) => animation.cancel())
    formAnimationsRef.current = []

    const paths = baseAnimation.pathRefs.filter(Boolean) as SVGPathElement[]

    if (paths.length === 0) return

    const shouldDisableAnimation = forceDisable
    if (shouldDisableAnimation) {
      paths.forEach((path) => {
        Object.assign(path.style, baseAnimation.defaultLineStyles)
        path.style.strokeDasharray = 'none'
        path.style.strokeDashoffset = '0'
      })
      return
    }

    const adaptedMainDuration = mainLineDuration
    const adaptedSideDuration = sideLineDuration
    const simplifiedEasing = 'cubic-bezier(0.4, 0.0, 0.2, 1)'

    requestAnimationFrame(() => {
      const pathData = paths.map((path, index) => {
        const line = lines[index]
        const totalLength = path.getTotalLength()

        Object.assign(path.style, baseAnimation.defaultLineStyles)
        path.style.strokeDasharray = `${totalLength}`

        const initialOffset = line.isMainLine ? totalLength : -totalLength
        path.style.strokeDashoffset = `${initialOffset}`

        return {
          path,
          line,
          totalLength,
          isMainLine: line.isMainLine,
        }
      })

      const mainPathData = pathData.find((data) => data.isMainLine)
      if (mainPathData) {
        const mainAnimation = mainPathData.path.animate(
          [
            { strokeDashoffset: mainPathData.totalLength },
            { strokeDashoffset: 0 },
            { strokeDashoffset: -mainPathData.totalLength },
          ],
          {
            duration: adaptedMainDuration,
            easing: simplifiedEasing,
            fill: 'forwards',
            composite: 'replace',
          },
        )
        formAnimationsRef.current.push(mainAnimation)

        const sideLineDelay = adaptedMainDuration / 2.55

        setTimeout(() => {
          const sideAnimations = pathData
            .filter((data) => !data.isMainLine)
            .map((data) => {
              const animation = data.path.animate(
                [
                  { strokeDashoffset: -data.totalLength },
                  { strokeDashoffset: 0 },
                  { strokeDashoffset: data.totalLength },
                ],
                {
                  duration: adaptedSideDuration,
                  easing: simplifiedEasing,
                  fill: 'forwards',
                  composite: 'replace',
                },
              )
              return animation
            })

          formAnimationsRef.current.push(...sideAnimations)
        }, sideLineDelay)
      }
    })
  }, [
    lines,
    mainLineDuration,
    sideLineDuration,
    forceDisable,
    baseAnimation.pathRefs,
    baseAnimation.defaultLineStyles,
  ])

  const startFormAnimationCycle = useCallback(() => {
    createSynchronizedFormAnimation()

    if (cycleTimeoutRef.current) {
      clearTimeout(cycleTimeoutRef.current)
    }

    const shouldDisableAnimation = forceDisable
    if (!shouldDisableAnimation) {
      const adaptedCycleDuration = cycleDuration

      cycleTimeoutRef.current = window.setTimeout(() => {
        startFormAnimationCycle()
      }, adaptedCycleDuration)
    }
  }, [createSynchronizedFormAnimation, cycleDuration, forceDisable])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!isFormInitializedRef.current && baseAnimation.pathRefs.length > 0) {
        startFormAnimationCycle()
        isFormInitializedRef.current = true
      }
    }, 200)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [startFormAnimationCycle, baseAnimation.pathRefs.length])

  useEffect(() => {
    return () => {
      formAnimationsRef.current.forEach((animation) => animation.cancel())
      formAnimationsRef.current = []

      if (cycleTimeoutRef.current) {
        clearTimeout(cycleTimeoutRef.current)
        cycleTimeoutRef.current = null
      }

      isFormInitializedRef.current = false
    }
  }, [])

  return {
    setPathRef: baseAnimation.setPathRef,
    lines,
    gradients: baseAnimation.gradients,
    defaultLineStyles: baseAnimation.defaultLineStyles,
    className: baseAnimation.className,
  }
}
