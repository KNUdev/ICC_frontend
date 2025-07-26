import { USER_PAGES } from '@/config/page.config'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import styles from './Header.module.scss'

export function CustomHeaderNav() {
  const tCommon = useTranslations('common')

  return (
    <nav
      className={styles.customHeader}
      role='navigation'
      aria-label='Header navigation'
    >
      <ul className={styles.navList} role='list'>
        {Object.entries(USER_PAGES).map(([key, link]) => (
          <li key={key} role='listitem'>
            <Link href={link} className='navLink'>
              {tCommon(`customNavigation.${key}`)}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
