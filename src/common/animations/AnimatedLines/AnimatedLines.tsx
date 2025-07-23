'use client'
import { useEffect, useRef, useState } from 'react'
import { useAnimationContext } from '../FormLines/AnimationContext'
import styles from './AnimatedLines.module.scss'

interface AnimatedLinesProps {
  d: string
  strokeId: string
  isMainLine?: boolean
}

export default function AnimatedLines({
  d,
  strokeId,
  isMainLine = false,
}: AnimatedLinesProps) {
  const pathRef = useRef<SVGPathElement>(null)
  const [length, setLength] = useState(0)
  const animationRef = useRef<Animation | null>(null)
  const { isMainActive, isSecondaryActive, resetTrigger } =
    useAnimationContext()

  useEffect(() => {
    const path = pathRef.current
    if (!path) return

    const totalLength = path.getTotalLength()
    setLength(totalLength)

    path.style.strokeDasharray = `${totalLength}`
    const initialOffset = isMainLine ? totalLength : -totalLength
    path.style.strokeDashoffset = `${initialOffset}`
  }, [isMainLine])

  useEffect(() => {
    const path = pathRef.current
    if (!path) return

    if (animationRef.current) {
      animationRef.current.cancel()
      animationRef.current = null
    }

    const resetOffset = isMainLine ? length : -length
    path.style.strokeDashoffset = `${resetOffset}`
  }, [resetTrigger, length, isMainLine])

  useEffect(() => {
    const path = pathRef.current
    if (!path || length === 0 || !isMainLine || !isMainActive) return

    if (animationRef.current) return

    const keyframes = [
      { strokeDashoffset: length },
      { strokeDashoffset: 0 },
      { strokeDashoffset: -length },
    ]

    animationRef.current = path.animate(keyframes, {
      duration: 1500,
      easing: 'ease-in-out',
      fill: 'forwards',
    })
  }, [isMainActive, length, isMainLine])

  useEffect(() => {
    const path = pathRef.current
    if (!path || length === 0 || isMainLine || !isSecondaryActive) return

    if (animationRef.current) return

    const keyframes = [
      { strokeDashoffset: -length },
      { strokeDashoffset: 0 },
      { strokeDashoffset: length },
    ]

    animationRef.current = path.animate(keyframes, {
      duration: 1500,
      easing: 'ease-in-out',
      fill: 'forwards',
    })
  }, [isSecondaryActive, length, isMainLine])

  return (
    <>
      <path
        d={d}
        stroke={`url(#${strokeId})`}
        className={styles.path}
        style={{ opacity: 0.2 }}
      />
      <path
        ref={pathRef}
        d={d}
        stroke={`url(#${strokeId})`}
        className={styles.path}
        style={{
          strokeDasharray: length,
          strokeDashoffset: isMainLine ? length : -length,
        }}
      />
    </>
  )
}
