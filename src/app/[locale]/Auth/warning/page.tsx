'use client'

import { AnimatedBrain } from '@/common/animations/AnimatedBrain/AnimatedBrain'
import { useRouter } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import styles from './page.module.scss'

export default function WarningPage() {
  const t = useTranslations('Auth/warning')
  const router = useRouter()
  const [fromPage, setFromPage] = useState<'signIn' | 'signUp'>('signUp')

  useEffect(() => {
    const savedFromPage = localStorage.getItem('authWarningFrom') as
      | 'signIn'
      | 'signUp'
    if (savedFromPage) {
      setFromPage(savedFromPage)
    }
  }, [])

  const handleBackToHome = () => {
    router.push('/')
  }

  const handleProceedAsEmployee = () => {
    localStorage.setItem('employeeConfirmed', 'true')
    localStorage.removeItem('authWarningFrom')
    router.back()
  }

  return (
    <div className={styles.warningContainer}>
      <div className={styles.iconContainer}>
        <AnimatedBrain />
      </div>

      <div className={styles.warningCard}>
        <h1 className={styles.title}>
          {t(`${fromPage}.titlePart1`)}
          <span className={styles.titleHighlight}>
            {t(`${fromPage}.titleHighlight`)}
          </span>
          {t(`${fromPage}.titlePart2`)}
        </h1>

        <div className={styles.buttonsContainer}>
          <button className={styles.backButton} onClick={handleBackToHome}>
            {t('backToHome')}
          </button>

          <button
            className={styles.employeeButton}
            onClick={handleProceedAsEmployee}
          >
            {t('iAmEmployee')}
          </button>
        </div>
      </div>
    </div>
  )
}
