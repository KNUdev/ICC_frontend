'use client'

import { AnimatedHistory } from '@/common/animations/AnimatedHistory/AnimatedHistory'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import styles from './page.module.scss'

export default function SuccessPage() {
  const t = useTranslations('form/success')

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.animationWrapper}>
          <AnimatedHistory />
        </div>

        <div className={styles.textContent}>
          <h1 className={styles.title}>{t('title')}</h1>

          <p className={styles.subtitle}>{t('subtitle')}</p>

          <Link href='/' className={styles.backButton}>
            {t('backButton')}
          </Link>
        </div>
      </div>
    </div>
  )
}
