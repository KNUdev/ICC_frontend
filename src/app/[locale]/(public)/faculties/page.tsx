import { useTranslations } from 'next-intl'
import { FACULTIES_PAGE_LINKS } from '@/shared/config/page.config'
import styles from './page.module.scss'

export default function ApplicationsPage() {
  const tFaculties = useTranslations('faculties-page')

  return (
    <div className={styles.institutionsContainer}>
      <h1 className={styles.heading}>{tFaculties('heading')}</h1>

      <ul className={styles.list} role='list'>
        {Object.entries(FACULTIES_PAGE_LINKS).map(([key, link]) => (
          <li key={key} role='listitem'>
            <a
              href={link}
              target='_blank'
              rel='noopener noreferrer'
              aria-label={`${tFaculties(
                `faculties.${key}`,
              )} (opens in a new tab)`}
              className='navLink'
            >
              {tFaculties(`faculties.${key}`)}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
