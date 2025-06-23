'use client'

import LogoIcc from '@/assets/image/icons/logo_icc.svg'
import {
    footerNavigation,
  } from '@/lib/footerData'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import styles from './Header.module.scss'



export function Header() {
  const tCommon = useTranslations('common')
  const tFooter = useTranslations('footer')

  return (
      <header id={styles.header} role='contentinfo'>
          <div className='layout-wrapper'>
              <LogoIcc className={styles.headerLogo} aria-label='iccIcon' role='img' />
              <nav 
                  role='navigation'
                  aria-label='Header navigation'
              >
                  <ul className={styles.navList} role="list">
                      {footerNavigation.map(({ key, link }) => (
                          <li key={key} role="listitem">
                            <Link href={link} className='navLink'>
                              {tFooter(`navigation.${key}`)}
                            </Link>
                          </li>
                      ))}
                  </ul>
              </nav>
              <div className={styles.userPanel}>
                  <LanguageSwitcher />
                  <div className={styles.authButtons}>
                      <Link href="#" className={styles.loginButton}>
                          {tCommon('authentication.login')}
                      </Link>
                      <Link href="#" className={styles.registerButton}>
                          {tCommon('authentication.register')}
                      </Link>
                  </div>
              </div>
          </div>
      </header>
  )
}
