import LogoIcc from '@/assets/image/icons/logo_icc.svg'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { PAGES } from '@/shared/config/page.config'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import styles from './Header.module.scss'

export function Header() {
  const tCommon = useTranslations('common')

  return (
    <header id={styles.header} role='contentinfo'>
      <div className='layout-wrapper'>
        <div className={styles.navLogoWrapper}>
          <LogoIcc
            aria-label='iccIcon'
            role='img'
            alt={`${tCommon('titleFullName')} logo`}
            width={70}
            height={37}
            priority
          />

          <nav role='navigation' aria-label='Header navigation'>
            <ul className={styles.navList} role='list'>
              {Object.entries(PAGES).map(([key, link]) => (
                <li key={key} role='listitem'>
                  <Link href={link} className='navLink'>
                    {tCommon(`navigation.${key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className={styles.userPanel}>
          <LanguageSwitcher />

          <div className={styles.authButtons}>
            <Link href='#' className={styles.loginButton}>
              {tCommon('authentication.login')}
            </Link>

            <Link href='#' className={styles.registerButton}>
              {tCommon('authentication.register')}
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
