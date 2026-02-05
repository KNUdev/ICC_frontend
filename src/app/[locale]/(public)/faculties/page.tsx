import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import { FACULTY_LINKS } from '@/shared/config/page.config'
import styles from './page.module.scss'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'common' })

  return {
    title: t('facultiesHeading'),
  }
}

export default function ApplicationsPage() {
  const tCommon = useTranslations('common')

  return (
    <div className={styles.institutionsContainer}>
      <h1 className={styles.heading}>{tCommon('facultiesHeading')}</h1>

      <ul className={styles.list} role='list'>
        {Object.entries(FACULTY_LINKS).map(([key, link]) => (
          <li key={key} role='listitem'>
            <a
              href={link}
              target='_blank'
              rel='noopener noreferrer'
              aria-label={`${tCommon(`faculties.${key}`)} (opens in a new tab)`}
              className='navLink'
            >
              {tCommon(`faculties.${key}`)}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
