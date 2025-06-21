'use client'

import styles from './FormPoints.module.scss'
import { useTranslations } from 'next-intl'
import { useState, useEffect } from 'react'
import { CircularProgressBar } from './CircularProgressBar/CircularProgressBar'

export function FormPoints() {
  const [open, isOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [progressResetTrigger, setProgressResetTrigger] = useState(0)

  const tFormPoints = useTranslations('form/points')
  const steps = [
    'request',
    'trial',
    'discussion',
    'execution',
    'completed',
  ] as const

  useEffect(() => {
    if (open) return

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % steps.length)
      setProgressResetTrigger((prev) => prev + 1)
    }, 5000)

    return () => clearInterval(interval)
  }, [open, steps.length])

  const handleUserClick = (index: number) => {
    isOpen(true)
    setActiveIndex(index)
    setProgressResetTrigger((prev) => prev + 1)
  }

  return (
    <article
      className={styles.formPoints}
      role='region'
      aria-label='Form points'
    >
      {steps.map((key, index) => (
        <details
          key={key}
          role='group'
          className={styles.details}
          open={index === activeIndex}
          onClick={(e) => {
            e.preventDefault()
            handleUserClick(index)
          }}
        >
          <summary className={styles.summary}>
            {index + 1}. {tFormPoints(`pointHeaders.${key}`)}
            {!open && index === activeIndex && (
              <div className={styles.loader}>
                <CircularProgressBar triggerReset={progressResetTrigger} />
              </div>
            )}
          </summary>

          <hr className={styles.divider} role='separator' />

          <p className={styles.paragraph}>{tFormPoints(`pointTexts.${key}`)}</p>
        </details>
      ))}
    </article>
  )
}
