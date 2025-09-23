'use client'

import LogoIcc from '@/assets/image/icons/logo_icc.svg'
import { AdminDropdown } from '@/components/Header/AdminDropdown/AdminDropdown'
import { UserProfile } from '@/components/Header/UserProfile/UserProfile'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { PAGES } from '@/shared/config/page.config'
import { useCurrentUser } from '@/shared/hooks/useCurrentUser'
import { useRole } from '@/shared/hooks/useRole'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import styles from './Header.module.scss'

type HeaderProps = {
  customNav?: React.ReactNode
}

export function Header({}: HeaderProps) {
  const tCommon = useTranslations('common')
  const { isAuthenticated, isLoading } = useCurrentUser()
  const { hasRole } = useRole()

  return (
    <header id={styles.header} role='contentinfo'>
      <div className='layout-wrapper'>
        <div className={styles.navLogoWrapper}>
          <Link href={PAGES.HOME} className='navLink'>
            <LogoIcc
              aria-label={`${tCommon('titleFullName')} logo`}
              role='img'
              width={70}
              height={37}
            />
          </Link>

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
          {isAuthenticated && hasRole('HEAD_MANAGER') && (
            <AdminDropdown className={styles.adminDropdown} />
          )}

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
