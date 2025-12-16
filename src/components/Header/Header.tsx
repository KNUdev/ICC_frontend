'use client'

import LogoIcc from '@/assets/image/icons/logo_icc.svg'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { PAGES } from '@/shared/config/page.config'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import styles from './Header.module.scss'

type HeaderProps = {
  customNav?: React.ReactNode
}

export function Header({}: HeaderProps) {
  const tCommon = useTranslations('common')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMobileMenu()
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  return (
    <>
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

            <button
              className={styles.mobileMenuButton}
              onClick={toggleMobileMenu}
              aria-label={isMobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
              aria-expanded={isMobileMenuOpen}
            >
              <span
                className={`${styles.hamburgerLine} ${
                  isMobileMenuOpen ? styles.open : ''
                }`}
              ></span>
              <span
                className={`${styles.hamburgerLine} ${
                  isMobileMenuOpen ? styles.open : ''
                }`}
              ></span>
              <span
                className={`${styles.hamburgerLine} ${
                  isMobileMenuOpen ? styles.open : ''
                }`}
              ></span>
            </button>
          </div>

          <div className={styles.userPanel}>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <div
        className={`${styles.mobileOverlay} ${
          isMobileMenuOpen ? styles.open : ''
        }`}
        onClick={closeMobileMenu}
        aria-hidden='true'
      />

      <nav
        className={`${styles.mobileNav} ${isMobileMenuOpen ? styles.open : ''}`}
        role='navigation'
        aria-label='Mobile navigation'
      >
        <ul className={styles.mobileNavList} role='list'>
          {Object.entries(PAGES).map(([key, link]) => (
            <li key={key} role='listitem'>
              <Link href={link} className='navLink' onClick={closeMobileMenu}>
                {tCommon(`navigation.${key}`)}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}
