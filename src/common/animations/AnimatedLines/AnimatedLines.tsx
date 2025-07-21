'use client'
import { useEffect, useRef, useState } from 'react'
import styles from './AnimatedLines.module.scss'

interface AnimatedLinesProps {
  d: string
  strokeId: string
}

const getRandomDuration = () => 2000 + Math.random() * 1000

export default function AnimatedLines({ d, strokeId }: AnimatedLinesProps) {
  const pathRef = useRef<SVGPathElement>(null)
  const [duration, setDuration] = useState(getRandomDuration())
  const [length, setLength] = useState(0)

  useEffect(() => {
    const path = pathRef.current
    if (!path) return

    const totalLength = path.getTotalLength()
    setLength(totalLength)

    const animate = () => {
      path.style.strokeDasharray = `${totalLength}`
      path.style.strokeDashoffset = `${totalLength}`

      path.animate(
        [
          { strokeDashoffset: totalLength },
          { strokeDashoffset: 0 },
          { strokeDashoffset: -totalLength },
        ],
        {
          duration,
          easing: 'ease-in-out',
          iterations: Infinity,
          fill: 'forwards',
        },
      )

      const timeout = setTimeout(() => {
        setDuration(getRandomDuration())
      }, duration)

      return () => clearTimeout(timeout)
    }

    animate()
  }, [duration])

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
          strokeDashoffset: length / 2,
        }}
      />
    </>
  )
}
