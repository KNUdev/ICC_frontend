'use client'

import { useState, useEffect } from 'react'

export const CircularProgressBar = ({
  triggerReset,
}: {
  triggerReset: number
}) => {
  const [loadingPercent, setLoadingPercent] = useState(0)

  useEffect(() => {
    const startTime = Date.now()
    const duration = 5000

    const intervalId = setInterval(() => {
      const elapsed = (Date.now() - startTime) % duration
      const progress = (elapsed / duration) * 100
      setLoadingPercent(progress)
    }, 16)

    return () => clearInterval(intervalId)
  }, [triggerReset])

  const size = 25
  const center = size / 2
  const radius = size * 0.4
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (loadingPercent / 100) * circumference

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill='transparent'
        stroke='#e6e6e6'
        strokeWidth={size * 0.1}
      />
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill='transparent'
        stroke='red'
        strokeWidth={size * 0.1}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${center} ${center})`}
      />
    </svg>
  )
}
