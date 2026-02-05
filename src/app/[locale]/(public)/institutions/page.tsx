import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import { INSTITUTION_LINKS } from '@/shared/config/page.config'
import styles from './page.module.scss'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'common' })

  return {
    title: t('institutionsHeading'),
  }
}

export default function ApplicationsPage() {
  const tCommon = useTranslations('common')

  return (
    <div className={styles.institutionsContainer}>
      <h1 className={styles.heading}>{tCommon('institutionsHeading')}</h1>

      <ul className={styles.list} role='list'>
        {Object.entries(INSTITUTION_LINKS).map(([key, link]) => (
          <li key={key} role='listitem'>
            <a
              href={link}
              target='_blank'
              rel='noopener noreferrer'
              aria-label={`${tCommon(
                `institutions.${key}`,
              )} (opens in a new tab)`}
              className='navLink'
            >
              {tCommon(`institutions.${key}`)}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
