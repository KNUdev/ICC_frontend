import { useTranslations } from 'next-intl'
import { INSTITUTIONS_PAGE_LINKS } from '@/shared/config/page.config'
import styles from './page.module.scss'

export default function ApplicationsPage() {
  const tInstitutions = useTranslations('institutions-page')

  return (
    <div className={styles.institutionsContainer}>
      <h1 className={styles.heading}>{tInstitutions('heading')}</h1>

      <ul className={styles.list} role='list'>
        {Object.entries(INSTITUTIONS_PAGE_LINKS).map(([key, link]) => (
          <li key={key} role='listitem'>
            <a
              href={link}
              target='_blank'
              rel='noopener noreferrer'
              aria-label={`${tInstitutions(
                `institutions.${key}`,
              )} (opens in a new tab)`}
              className='navLink'
            >
              {tInstitutions(`institutions.${key}`)}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
