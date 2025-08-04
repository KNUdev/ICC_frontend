'use client'

import { memo, useCallback, useEffect, useMemo, useRef } from 'react'

interface CircularProgressBarProps {
  triggerReset: number
  size?: number
  duration?: number
  strokeColor?: string
  backgroundColor?: string
  className?: string
}

export const CircularProgressBar = memo(function CircularProgressBar({
  triggerReset,
  size = 25,
  duration = 5000,
  strokeColor = '#FF525E',
  backgroundColor = '#D1D1D1',
  className = '',
}: CircularProgressBarProps) {
  const animationRef = useRef<Animation | null>(null)
  const circleRef = useRef<SVGCircleElement | null>(null)

  const geometry = useMemo(() => {
    const center = size / 2
    const radius = size * 0.4
    const strokeWidth = size * 0.1
    const circumference = 2 * Math.PI * radius

    return {
      center,
      radius,
      strokeWidth,
      circumference,
      viewBox: `0 0 ${size} ${size}`,
      transform: `rotate(-90 ${center} ${center})`,
    }
  }, [size])

  const startAnimation = useCallback(() => {
    const circle = circleRef.current
    if (!circle) return

    if (animationRef.current) {
      animationRef.current.cancel()
    }

    circle.style.strokeDashoffset = `${geometry.circumference}`

    animationRef.current = circle.animate(
      [{ strokeDashoffset: geometry.circumference }, { strokeDashoffset: 0 }],
      {
        duration,
        easing: 'linear',
        fill: 'forwards',
      },
    )
  }, [geometry.circumference, duration])

  useEffect(() => {
    startAnimation()

    return () => {
      if (animationRef.current) {
        animationRef.current.cancel()
      }
    }
  }, [triggerReset, startAnimation])

  const svgStyle = useMemo(
    () => ({
      willChange: 'transform',
      transform: 'translateZ(90)',
      backfaceVisibility: 'hidden' as const,
    }),
    [],
  )

  const progressCircleStyle = useMemo(
    () => ({
      willChange: 'stroke-dashoffset',
      transform: 'translateZ(90)',
      strokeDasharray: geometry.circumference,
      strokeDashoffset: geometry.circumference,
      transition: 'none',
    }),
    [geometry.circumference],
  )

  return (
    <svg
      viewBox={geometry.viewBox}
      width={size}
      height={size}
      className={`circular-progress ${className}`}
      style={svgStyle}
      aria-hidden='true'
    >
      <circle
        cx={geometry.center}
        cy={geometry.center}
        r={geometry.radius}
        fill='transparent'
        stroke={backgroundColor}
        strokeWidth={geometry.strokeWidth}
        style={{
          transform: 'translateZ(0)',
        }}
      />

      <circle
        ref={circleRef}
        cx={geometry.center}
        cy={geometry.center}
        r={geometry.radius}
        fill='transparent'
        stroke={strokeColor}
        strokeWidth={geometry.strokeWidth}
        strokeLinecap='round'
        transform={geometry.transform}
        style={progressCircleStyle}
      />
    </svg>
  )
})
