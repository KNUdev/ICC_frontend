import LogoIcc from '@/assets/image/icons/logo_icc.svg'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { PAGES } from '@/shared/config/page.config'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import styles from './Header.module.scss'

type HeaderProps = {
  customNav?: React.ReactNode
}

export function Header({ customNav }: HeaderProps) {
  const tCommon = useTranslations('common')

  return (
    <header id={styles.header} role='contentinfo'>
      <div className='layout-wrapper'>
        <LogoIcc
          className={styles.headerLogo}
          aria-label='iccIcon'
          role='img'
        />
        {customNav ?? (
          <nav role="navigation" aria-label="Header navigation">
            <ul className={styles.navList} role="list">
              {Object.entries(PAGES).map(([key, link]) => (
                <li key={key} role="listitem">
                  <Link href={link} className="navLink">
                    {tCommon(`navigation.${key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
        <div className={styles.userPanel}>
          <LanguageSwitcher />
          <div className={styles.authButtons}>
            <Link href='#' className={styles.loginButton}>
              {tCommon('authentication.login')}/
              {tCommon('authentication.register')}
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
