'use client'

import { useTranslations } from 'next-intl'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { CircularProgressBar } from './CircularProgressBar/CircularProgressBar'
import styles from './FormPoints.module.scss'

type StepKey = 'request' | 'trial' | 'discussion' | 'execution' | 'completed'

interface FormPointsProps {
  autoplayInterval?: number
  className?: string
}

const FormPointItem = memo(function FormPointItem({
  stepKey,
  index,
  isActive,
  isOpen,
  onUserClick,
  progressResetTrigger,
  tFormPoints,
}: {
  stepKey: StepKey
  index: number
  isActive: boolean
  isOpen: boolean
  onUserClick: (index: number) => void
  progressResetTrigger: number
  tFormPoints: (key: string) => string
}) {
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      onUserClick(index)
    },
    [index, onUserClick],
  )

  return (
    <details
      key={stepKey}
      role='group'
      className={styles.details}
      open={isActive}
      onClick={handleClick}
    >
      <summary className={styles.summary}>
        {index + 1}. {tFormPoints(`pointHeaders.${stepKey}`)}
        {!isOpen && isActive && (
          <div className={styles.loader}>
            <CircularProgressBar
              triggerReset={progressResetTrigger}
              className='form-progress-bar'
            />
          </div>
        )}
      </summary>

      <hr className={styles.divider} role='separator' />

      <p className={styles.paragraph}>{tFormPoints(`pointTexts.${stepKey}`)}</p>
    </details>
  )
})

export const FormPoints = memo(function FormPoints({
  autoplayInterval = 5000,
  className = '',
}: FormPointsProps = {}) {
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [progressResetTrigger, setProgressResetTrigger] = useState(0)

  const tFormPoints = useTranslations('form/points')

  const steps = useMemo(
    (): StepKey[] => [
      'request',
      'trial',
      'discussion',
      'execution',
      'completed',
    ],
    [],
  )

  const handleUserClick = useCallback((index: number) => {
    setOpen(true)
    setActiveIndex(index)
    setProgressResetTrigger((prev) => prev + 1)
  }, [])

  useEffect(() => {
    if (open) return

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % steps.length)
      setProgressResetTrigger((prev) => prev + 1)
    }, autoplayInterval)

    return () => clearInterval(interval)
  }, [open, steps.length, autoplayInterval])

  const containerClassName = useMemo(
    () => `${styles.formPoints} ${className}`.trim(),
    [className],
  )

  return (
    <article
      className={containerClassName}
      role='region'
      aria-label='Form points'
      data-open={open}
      data-active-index={activeIndex}
    >
      {steps.map((stepKey, index) => (
        <FormPointItem
          key={stepKey}
          stepKey={stepKey}
          index={index}
          isActive={index === activeIndex}
          isOpen={open}
          onUserClick={handleUserClick}
          progressResetTrigger={progressResetTrigger}
          tFormPoints={tFormPoints}
        />
      ))}
    </article>
  )
})
