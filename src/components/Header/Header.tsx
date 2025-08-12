'use client'

import LogoIcc from '@/assets/image/icons/logo_icc.svg'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { UserProfile } from '@/components/UserProfile/UserProfile'
import { PAGES } from '@/shared/config/page.config'
import { useCurrentUser } from '@/shared/hooks/useCurrentUser'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import styles from './Header.module.scss'

export function Header() {
  const tCommon = useTranslations('common')
  const { isAuthenticated, isLoading } = useCurrentUser()

  return (
    <header id={styles.header} role='contentinfo'>
      <div className='layout-wrapper'>
        <div className={styles.navLogoWrapper}>
          <LogoIcc
            aria-label={`${tCommon('titleFullName')} logo`}
            role='img'
            width={70}
            height={37}
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

          {!isLoading && (
            <>
              {isAuthenticated ? (
                <UserProfile />
              ) : (
                <div className={styles.authButtons}>
                  <Link href='/Auth/SingIn' className={styles.loginButton}>
                    {tCommon('authentication.login')}
                  </Link>

                  <Link href='/Auth/SingUp' className={styles.registerButton}>
                    {tCommon('authentication.register')}
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  )
}
