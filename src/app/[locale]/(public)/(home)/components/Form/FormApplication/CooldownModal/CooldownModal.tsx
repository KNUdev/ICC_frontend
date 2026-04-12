'use client'

import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import styles from './CooldownModal.module.scss'

interface CooldownModalProps {
  isOpen: boolean
  remainingTime: number
  onConfirm: () => void
  onCancel: () => void
}

interface CooldownModalContentProps {
  remainingTime: number
  onConfirm: () => void
  onCancel: () => void
}

function CooldownModalContent({
  remainingTime,
  onConfirm,
  onCancel,
}: CooldownModalContentProps) {
  const [timeLeft, setTimeLeft] = useState(remainingTime)
  const tFormApplication = useTranslations('form/application')

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const next = Math.max(prev - 1000, 0)

        if (next <= 0) {
          clearInterval(interval)
          onCancel()
        }

        return next
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [onCancel])

  const minutes = Math.floor(timeLeft / 60000)
  const seconds = Math.floor((timeLeft % 60000) / 1000)

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel()
    }
  }

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <h3 className={styles.title}>{tFormApplication('cooldown.title')}</h3>

        <p className={styles.message}>
          {tFormApplication('cooldown.message', { minutes, seconds })}
        </p>

        <div className={styles.buttons}>
          <button
            type='button'
            className={`${styles.button} ${styles.cancel}`}
            onClick={onCancel}
          >
            {tFormApplication('cooldown.cancelButton')}
          </button>

          <button
            type='button'
            className={`${styles.button} ${styles.confirm}`}
            onClick={onConfirm}
          >
            {tFormApplication('cooldown.confirmButton')}
          </button>
        </div>
      </div>
    </div>
  )
}

export function CooldownModal({
  isOpen,
  remainingTime,
  onConfirm,
  onCancel,
}: CooldownModalProps) {
  if (!isOpen) return null

  return (
    <CooldownModalContent
      key={remainingTime}
      remainingTime={remainingTime}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  )
}
