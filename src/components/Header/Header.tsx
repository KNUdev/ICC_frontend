'use client'

import LogoIcc from '@/assets/image/icons/logo_icc.svg'
import FlagUA from '@/assets/image/icons/Ukraine_flag.svg'
import ArrowUp from '@/assets/image/icons/arrow-up.svg'
import ArrowDown from '@/assets/image/icons/arrow-down.svg'
import {
    footerNavigation,
  } from '@/lib/footerData'
import { useState } from 'react'
import { LANGUAGE_LABELS, type Locale, SUPPORTED_LOCALES } from '@/i18n/config'
import { usePathname, useRouter } from '@/i18n/navigation'
import { useLocale } from 'next-intl'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import styles from './Header.module.scss'



export function Header() {
    const tHeader = useTranslations('header')
    const tFooter = useTranslations('footer')
    const [isOpen, setIsOpen] = useState(false)
    const locale = useLocale()
    const router = useRouter()
    const pathname = usePathname()

    const handleChange = (newLang: Locale) => {
        router.push(pathname, { locale: newLang })
        setIsOpen(false)
    }

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
                    <div className={styles.languageSwitcher}>
                        <switch onClick={() => setIsOpen(!isOpen)} className={styles.toggleButton}>
                            <FlagUA className={styles.flag} aria-label='flagIcon' role='img' />
                            {LANGUAGE_LABELS[locale as Locale]}
                            <span className={styles.arrow}>{isOpen ? <ArrowUp aria-label='arrow-upIcon' role='img' /> : <ArrowDown aria-label='arrow-downIcon' role='img' />}</span>
                        </switch>
                        {isOpen && (
                          <ul className={styles.dropdown}>
                            <li className={`${styles.option} ${styles.active}`}>
                              <FlagUA className={styles.flag} aria-label='flagIcon' role='img' />
                              {LANGUAGE_LABELS[locale as Locale]}
                            </li>
                            <hr  className={styles.divider} role='separator'  />
                            {SUPPORTED_LOCALES.filter(code => code !== locale).map(code => (
                              <li
                                key={code}
                                onClick={() => handleChange(code)}
                                className={styles.option}
                              >
                                <FlagUA className={styles.flag} aria-label='flagIcon' role='img' />
                                {LANGUAGE_LABELS[code]}
                              </li>
                            ))}
                          </ul>
                        )}
                    </div>
                    <div className={styles.authButtons}>
                        <Link href="#" className={styles.loginButton}>
                            {tHeader('authentication.login')}
                        </Link>
                        <Link href="#" className={styles.registerButton}>
                            {tHeader('authentication.register')}
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    )
}
